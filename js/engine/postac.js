// ============================================================
//  BOHATER — to, co przechodzi MIĘDZY walkami
//  Poziom, XP, cechy, złoto, materiały, ekwipunek, HP.
//
//  KLUCZOWE: HP nie wraca po walce. Regeneruje się w czasie
//  albo za złoto w gospodzie. To jest system energii tej gry.
// ============================================================

const Bohater = {

  stan: null,

  stworz(idKlasy) {
    const klasa = KLASY[idKlasy];

    this.stan = {
      klasa: idKlasy,
      poziom: 1,
      xp: 0,
      punktyDoRozdania: 0,
      cechy: Object.assign({}, klasa.cechy),

      zloto: 0,
      klejnoty: 0,      // waluta premium (js/data/premium.js)
      trening: null,    // { cecha, koniec } — jeden trening naraz
      materialy: {},
      esencje: {},
      eliksiry: 0,

      // Ekwipunek: co masz i co masz założone
      posiadane: [klasa.bronStartowa, klasa.pancerzStartowy],
      bron: klasa.bronStartowa,
      helm: null,
      tarcza: null,
      nagolenniki: null,
      pancerz: klasa.pancerzStartowy,
      ulepszenieBroni: 0,

      // Artefakty (trzeci, pasywny slot)
      artefakty: [],
      artefakt: null,

      // Drzewko umiejętności
      pu: CONFIG.drzewko.puNaStart,
      wezly: {},
      sloty: [null, null, null, null],

      // Postęp na drabinie
      najwyzszaRanga: 1,
      pokonani: [],

      // HP na wyczerpanie
      hp: 0,
      czasOstatniejRegeneracji: Date.now()
    };

    // Generator klasy dostajesz gratis, zeby pasek nie byl pusty.
    this.stan.wezly[klasa.startowyWezel] = 1;
    this.stan.sloty[0] = DRZEWKA[idKlasy].wezly[klasa.startowyWezel].akcja;

    this.stan.hp = this.maxHp();
    return this.stan;
  },

  klasa() { return KLASY[this.stan.klasa]; },

  maxHp() {
    return CONFIG.postac.hpBazowe
         + this.cecha('witalnosc') * CONFIG.postac.hpZaWitalnosc
         + Bonusy.mod('maxHp');
  },

  // Cecha po doliczeniu bonusow z drzewka (np. Weteran, Zwinnosc).
  cecha(nazwa) {
    return this.stan.cechy[nazwa]
         + Bonusy.mod('wszystkieCechy')
         + Bonusy.mod(nazwa);
  },

  // ---------- ekwipunek ----------

  // Broń z doliczonym ulepszeniem z kuźni.
  bron() {
    const bazowa = PRZEDMIOTY[this.stan.bron];
    const poziom = this.stan.ulepszenieBroni;
    if (poziom === 0) return bazowa;

    const bonus = PRZEPISY.ulepszenieBroni.poziomy[poziom - 1].bonusObrazen;
    return Object.assign({}, bazowa, {
      obrazenia: bazowa.obrazenia + bonus,
      nazwa: `${bazowa.nazwa} +${poziom}`
    });
  },

  pancerz() { return PRZEDMIOTY[this.stan.pancerz]; },

  // Pozostałe części zbroi — każda może być pusta.
  czesc(gniazdo) { return PRZEDMIOTY[this.stan[gniazdo]] || null; },

  // Obrona z całego sprzętu razem: napierśnik + hełm + tarcza + nagolenniki.
  obronaSprzetu() {
    return ['pancerz', 'helm', 'tarcza', 'nagolenniki']
      .reduce((suma, gniazdo) => {
        const p = PRZEDMIOTY[this.stan[gniazdo]];
        return suma + (p && p.obrona ? p.obrona : 0);
      }, 0);
  },

  ma(idPrzedmiotu) { return this.stan.posiadane.includes(idPrzedmiotu); },

  // Łucznik strzela z łuku, melee walczy wręcz — nie mieszamy.
  czyPasuje(p) {
    const k = this.klasa();

    // Tarcza wymaga wolnej reki: luk i kostur trzyma sie oburacz.
    if (p.typ === 'tarcza') return !k.dystansowa && k.cechaObrazen !== 'wola';
    if (p.typ !== 'bron') return true;

    if (k.cechaObrazen === 'wola') return !!p.magiczna;   // mag i druid
    if (p.magiczna) return false;
    return !!p.dystansowa === !!k.dystansowa;             // łucznik vs melee
  },

  zaloz(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p || !this.ma(idPrzedmiotu) || !this.czyPasuje(p)) return false;
    if (p.typ === 'bron')    this.stan.bron = idPrzedmiotu;
    if (p.typ === 'pancerz') this.stan.pancerz = idPrzedmiotu;
    if (p.typ === 'helm')        this.stan.helm = idPrzedmiotu;
    if (p.typ === 'tarcza')      this.stan.tarcza = idPrzedmiotu;
    if (p.typ === 'nagolenniki') this.stan.nagolenniki = idPrzedmiotu;
    return true;
  },

  // ---------- HP i regeneracja ----------

  // Dolicza HP odzyskane od ostatniego sprawdzenia. Wołane przy wejściu
  // do miasta i przed walką. Działa też po powrocie do gry po przerwie.
  odswiezRegeneracje() {
    const teraz = Date.now();
    const minut = (teraz - this.stan.czasOstatniejRegeneracji) / 60000;
    const maxHp = this.maxHp();

    if (this.stan.hp >= maxHp) {
      this.stan.czasOstatniejRegeneracji = teraz;
      return 0;
    }

    const hpNaMinute = (maxHp / CONFIG.ekonomia.minutNaPelneHp)
                     * (1 + Bonusy.mod('przyspieszenieRegeneracji'));
    const odzyskane = Math.floor(minut * hpNaMinute);

    if (odzyskane > 0) {
      this.stan.hp = Math.min(maxHp, this.stan.hp + odzyskane);
      this.stan.czasOstatniejRegeneracji = teraz;
    }
    return odzyskane;
  },

  // Ile minut do pełnego zdrowia (do pokazania w mieście).
  minutDoPelnegoHp() {
    const brakuje = this.maxHp() - this.stan.hp;
    if (brakuje <= 0) return 0;
    const naMinute = (this.maxHp() / CONFIG.ekonomia.minutNaPelneHp)
                   * (1 + Bonusy.mod('przyspieszenieRegeneracji'));
    return Math.ceil(brakuje / naMinute);
  },

  ulecz(ile) {
    const przed = this.stan.hp;
    this.stan.hp = Math.min(this.maxHp(), this.stan.hp + ile);
    return this.stan.hp - przed;
  },

  // ---------- gospoda ----------

  kosztGospody() {
    const g = CONFIG.ekonomia.gospoda;
    const brakujaceHp = this.maxHp() - this.stan.hp;
    if (brakujaceHp <= 0) return 0;

    const pelny = g.kosztBazowy + this.stan.poziom * g.kosztZaPoziom;
    return Math.max(1, Math.round(pelny * (brakujaceHp / this.maxHp())));
  },

  odpocznijWGospodzie() {
    const koszt = this.kosztGospody();
    if (koszt === 0 || this.stan.zloto < koszt) return false;
    this.stan.zloto -= koszt;
    this.stan.hp = this.maxHp();
    this.stan.czasOstatniejRegeneracji = Date.now();
    return true;
  },

  // ---------- eliksiry ----------

  wypijEliksir() {
    if (this.stan.eliksiry <= 0) return 0;
    this.stan.eliksiry--;
    return Math.round(this.maxHp() * CONFIG.ekonomia.eliksir.leczenieProcentMaxHp);
  },

  // ---------- plac treningowy ----------
  //  Jeden trening naraz. Koszt i czas rosną z wartością cechy, więc
  //  to sam się hamujący odpływ złota, a nie darmowa winda w górę.

  kosztTreningu(cecha) {
    const t = CONFIG.ekonomia.trening;
    return t.kosztBazowy + this.stan.cechy[cecha] * t.kosztZaPunkt;
  },

  minutyTreningu(cecha) {
    const t = CONFIG.ekonomia.trening;
    const ponadProg = this.stan.cechy[cecha] - t.progCzasu;
    if (ponadProg <= 0) return 0;                       // wcześnie: od ręki
    return Math.min(t.minutMax, ponadProg * t.minutZaPunkt);
  },

  trening() { return this.stan.trening; },

  // Ile minut zostało. 0 znaczy "gotowe do odebrania".
  minutDoKonca() {
    if (!this.stan.trening) return 0;
    const ms = this.stan.trening.koniec - Date.now();
    return Math.max(0, Math.ceil(ms / 60000));
  },

  czyTreningGotowy() { return !!this.stan.trening && this.minutDoKonca() === 0; },

  zacznijTrening(cecha) {
    if (this.stan.trening) return false;                // jeden naraz
    if (!this.stan.cechy.hasOwnProperty(cecha)) return false;

    const koszt = this.kosztTreningu(cecha);
    if (this.stan.zloto < koszt) return false;
    this.stan.zloto -= koszt;

    const minuty = this.minutyTreningu(cecha);
    if (minuty === 0) {                                 // natychmiastowy
      this.stan.cechy[cecha]++;
      return 'gotowe';
    }
    this.stan.trening = { cecha: cecha, koniec: Date.now() + minuty * 60000 };
    return 'czekaj';
  },

  odbierzTrening() {
    if (!this.czyTreningGotowy()) return false;
    const cecha = this.stan.trening.cecha;
    this.stan.cechy[cecha]++;
    this.stan.trening = null;
    return cecha;
  },

  klejnotyNaSkrocenie() {
    const minuty = this.minutDoKonca();
    if (!minuty) return 0;
    return Math.max(1, Math.ceil(minuty / 60 * CONFIG.ekonomia.trening.klejnotyZaGodzine));
  },

  skrocTreningKlejnotami() {
    const cena = this.klejnotyNaSkrocenie();
    if (!cena || this.stan.klejnoty < cena) return false;
    this.stan.klejnoty -= cena;
    this.stan.trening.koniec = Date.now();
    return true;
  },

  // ---------- sklep i kuźnia ----------

  // Towar za klejnoty. Osobna metoda, zeby nie dalo sie przez pomylke
  // kupic przedmiotu premium za zloto ani odwrotnie.
  kupZaKlejnoty(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p || !p.klejnoty || this.ma(idPrzedmiotu) || !this.czyPasuje(p)) return false;
    if (this.stan.klejnoty < p.klejnoty) return false;

    this.stan.klejnoty -= p.klejnoty;
    this.stan.posiadane.push(idPrzedmiotu);
    this.zalozJesliLepszy(idPrzedmiotu);
    return true;
  },

  kup(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p || !p.cena || this.ma(idPrzedmiotu) || !this.czyPasuje(p)) return false;
    if (this.stan.zloto < p.cena) return false;

    this.stan.zloto -= p.cena;
    this.stan.posiadane.push(idPrzedmiotu);
    this.zalozJesliLepszy(idPrzedmiotu); // słabszego zakupu nie wkładamy na siłę
    return true;
  },

  // Zakładamy tylko wtedy, gdy gniazdo jest puste albo nowa rzecz jest mocniejsza.
  // Dzięki temu kupno taniego hełmu "na zapas" nie zdejmie lepszego.
  zalozJesliLepszy(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p) return false;

    const gniazdo = p.typ === 'bron' ? 'bron' : p.typ;
    const teraz = PRZEDMIOTY[this.stan[gniazdo]];
    if (teraz) {
      const miara = p.typ === 'bron' ? 'obrazenia' : 'obrona';
      if ((p[miara] || 0) <= (teraz[miara] || 0)) return false;
    }
    return this.zaloz(idPrzedmiotu);
  },

  // Ile dostaniesz za sprzedaż. Sprzęt z kuźni nie ma ceny sklepowej,
  // więc liczymy go po wartości zastępczej z konfiguracji.
  cenaSprzedazy(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p) return 0;
    const wartosc = p.cena
      || (p.startowa ? CONFIG.ekonomia.wartoscSprzetuStartowego : CONFIG.ekonomia.wartoscSprzetuBezCeny);
    return Math.max(1, Math.round(wartosc * CONFIG.ekonomia.zwrotZeSprzedazy));
  },

  // Sprzedajemy tylko to, czego nie masz na sobie i co nie jest startowe —
  // inaczej dałoby się zostać bez broni.
  czyMoznaSprzedac(idPrzedmiotu) {
    const p = PRZEDMIOTY[idPrzedmiotu];
    if (!p || !this.ma(idPrzedmiotu)) return false;
    // Rzeczy za klejnoty sa poza handlem — inaczej gracz opylilby je
    // za grosze w zlocie i zostal z niczym.
    if (p.klejnoty) return false;
    return ![this.stan.bron, this.stan.pancerz, this.stan.helm, this.stan.tarcza, this.stan.nagolenniki]
      .includes(idPrzedmiotu);
  },

  sprzedaj(idPrzedmiotu) {
    if (!this.czyMoznaSprzedac(idPrzedmiotu)) return false;
    this.stan.zloto += this.cenaSprzedazy(idPrzedmiotu);
    this.stan.posiadane = this.stan.posiadane.filter(id => id !== idPrzedmiotu);
    return true;
  },

  kupEliksir() {
    const e = CONFIG.ekonomia.eliksir;
    if (this.stan.eliksiry >= e.maksWPlecaku) return false;
    if (this.stan.zloto < e.cena) return false;
    this.stan.zloto -= e.cena;
    this.stan.eliksiry++;
    return true;
  },

  // Czy stać nas na dany koszt {materialy, zloto}
  staC(koszt) {
    if (this.stan.zloto < (koszt.zloto || 0)) return false;
    const maMaterialy = Object.entries(koszt.materialy || {})
      .every(([idM, ile]) => (this.stan.materialy[idM] || 0) >= ile);
    const maEsencje = Object.entries(koszt.esencje || {})
      .every(([idE, ile]) => (this.stan.esencje[idE] || 0) >= ile);
    return maMaterialy && maEsencje;
  },

  zaplac(koszt) {
    this.stan.zloto -= (koszt.zloto || 0);
    Object.entries(koszt.materialy || {}).forEach(([idM, ile]) => { this.stan.materialy[idM] -= ile; });
    Object.entries(koszt.esencje || {}).forEach(([idE, ile]) => { this.stan.esencje[idE] -= ile; });
  },

  wykuj(idPrzepisu) {
    const przepis = PRZEPISY[idPrzepisu];
    if (!przepis || przepis.ulepszenie) return false;
    if (!this.czyPasuje(PRZEDMIOTY[przepis.przedmiot])) return false;
    if (this.ma(przepis.przedmiot) || !this.staC(przepis.koszt)) return false;

    this.zaplac(przepis.koszt);
    this.stan.posiadane.push(przepis.przedmiot);
    this.zaloz(przepis.przedmiot);
    return true;
  },

  ulepszBron() {
    const przepis = PRZEPISY.ulepszenieBroni;
    if (this.stan.ulepszenieBroni >= przepis.maksPoziom) return false;

    const koszt = przepis.poziomy[this.stan.ulepszenieBroni].koszt;
    if (!this.staC(koszt)) return false;

    this.zaplac(koszt);
    this.stan.ulepszenieBroni++;
    return true;
  },

  // ---------- poziomy ----------

  xpDoNastepnegoPoziomu(poziom) {
    const p = poziom || this.stan.poziom;
    return CONFIG.postep.xpNaPoziom2 + (p - 1) * CONFIG.postep.xpPrzyrostNaPoziom;
  },

  dodajXp(ile) {
    this.stan.xp += ile;
    let awanse = 0;

    while (this.stan.xp >= this.xpDoNastepnegoPoziomu()) {
      this.stan.xp -= this.xpDoNastepnegoPoziomu();
      this.stan.poziom++;
      this.stan.punktyDoRozdania += CONFIG.postep.punktyCechZaPoziom;
      this.stan.pu += CONFIG.drzewko.puZaPoziom;
      awanse++;
    }
    return awanse;
  },

  wydajPunkt(cecha) {
    if (this.stan.punktyDoRozdania <= 0) return false;
    if (this.stan.cechy[cecha] === undefined) return false;

    const maxHpPrzed = this.maxHp();
    this.stan.cechy[cecha]++;
    this.stan.punktyDoRozdania--;

    // Punkt w Witalność ma od razu dawać nowe HP, nie tylko podnosić sufit.
    this.stan.hp += this.maxHp() - maxHpPrzed;
    return true;
  },

  // ---------- łupy ----------

  zapiszNagrode(wrog) {
    const n = wrog.nagroda;
    const zloto = Math.round(n.zloto * CONFIG.ekonomia.mnoznikZlota);
    this.stan.zloto += zloto;

    Object.entries(n.materialy || {}).forEach(([idM, ile]) => {
      this.stan.materialy[idM] = (this.stan.materialy[idM] || 0) + ile;
    });
    Object.entries(n.esencje || {}).forEach(([idE, ile]) => {
      this.stan.esencje[idE] = (this.stan.esencje[idE] || 0) + ile;
    });

    const artefakt = Artefakty.losujZWroga(wrog);
    if (artefakt) Artefakty.dodaj(artefakt);

    const awanse = this.dodajXp(n.xp);

    // Klejnoty za granie — tylko przy PIERWSZYM pokonaniu, zeby nie
    // dalo sie ich farmic w kolko na tym samym przeciwniku.
    let klejnoty = 0;
    if (!this.stan.pokonani.length) klejnoty += KLEJNOTY_ZA.pierwszeZwyciestwo;

    let bonusPU = 0;
    if (!this.stan.pokonani.includes(wrog.id)) {
      this.stan.pokonani.push(wrog.id);
      if (wrog.miniboss) { bonusPU = CONFIG.drzewko.puZaMinibossa; klejnoty += KLEJNOTY_ZA.miniboss; }
      if (wrog.czempion) { bonusPU = CONFIG.drzewko.puZaCzempiona; klejnoty += KLEJNOTY_ZA.czempion; }
      this.stan.pu += bonusPU;
    }
    klejnoty += awanse * KLEJNOTY_ZA.awansPoziomu;
    this.stan.klejnoty += klejnoty;
    if (wrog.ranga >= this.stan.najwyzszaRanga) {
      this.stan.najwyzszaRanga = Math.min(DRABINA.length, wrog.ranga + 1);
    }

    return { zloto: zloto, xp: n.xp, klejnoty: klejnoty, materialy: n.materialy || {},
             esencje: n.esencje || {},
             awanse: awanse, bonusPU: bonusPU, artefakt: artefakt };
  },

  // ---------- postęp ----------

  czyOdblokowana(ranga) { return ranga <= this.stan.najwyzszaRanga; },
  czyPokonany(idWroga)  { return this.stan.pokonani.includes(idWroga); },
  czyRegionUkonczony()  { return this.czyPokonany('verrus'); },

  czyBudynekOtwarty(idBudynku) {
    return this.stan.pokonani.length >= BUDYNKI[idBudynku].odblokowanePoRandze;
  }
};
