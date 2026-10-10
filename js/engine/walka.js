// ============================================================
//  SILNIK WALKI
//  Tury, inicjatywa, obrazenia, zasoby, statusy, AI wrogow.
//  Bonusy z drzewka czyta przez Bonusy.mod() i Drzewko.liczbyAkcji().
//  Nie wie nic o wygladzie - o rysowanie prosi obiekt UI.
// ============================================================

const Walka = {

  stan: null,

  // ---------- start ----------

  // Przyjmuje id pojedynczego wroga albo id watahy z WATAHY.
  rozpocznij(idWroga) {
    const wataha = (typeof WATAHY !== 'undefined') ? WATAHY[idWroga] : null;
    const sklad = wataha ? wataha.sklad : [idWroga];

    const wrogowie = sklad.map((id, i) => {
      const w = this.stworzWroga(WROGOWIE[id]);
      if (sklad.length > 1) w.nazwa = `${w.nazwa} ${i + 1}`;
      return w;
    });

    this.stan = {
      gracz: this.stworzGracza(),
      wrogowie: wrogowie,
      celIndeks: 0,
      wataha: wataha ? wataha.id : null,
      spotkanie: idWroga,            // czego dotyczy nagroda i postęp
      runda: 1,
      kolejka: [],
      indeks: 0,
      koniec: false,
      wynik: null,
      czekamNaGracza: false,
      nagroda: null,

      // Dystans: klasy strzelajace otwieraja walke z daleka
      dystans: Bohater.klasa().dystansowa ? 'daleko' : 'zwarcie',
      dobiegniecie: 0,

      // Przywolania druida — dodatkowe ciala po Twojej stronie
      pupile: []
    };

    this.stan.dobiegniecie = this.turyDobiegania();

    // Zgodnosc wstecz: stan.wrog to zawsze aktualnie obrany cel.
    Object.defineProperty(this.stan, 'wrog', {
      get: () => this.cel(),
      configurable: true
    });

    this.stan.kolejka = this.ustalKolejnosc();

    UI.wyczyscDziennik();
    UI.dziennik(
      wataha ? `Arena. Naprzeciw staje ${wataha.nazwa.toLowerCase()} — ${sklad.length} przeciwników.`
             : `Arena. ${wrogowie[0].nazwa} staje naprzeciw.`,
      'info'
    );
    UI.dziennik(this.opisInicjatywy(), 'info');
    if (this.stan.dystans === 'daleko') {
      UI.dziennik('Otwierasz z dystansu. Zanim dobiegną, strzelaj.', 'garda');
    }
    UI.odswiez();
    this.turaNastepnego();
  },

  // ---------- cele ----------

  zywi() { return this.stan.wrogowie.filter(w => w.hp > 0); },

  // Aktualnie obrany cel; jeśli padł, przeskakujemy na pierwszego żywego.
  cel() {
    const s = this.stan;
    const obrany = s.wrogowie[s.celIndeks];
    if (obrany && obrany.hp > 0) return obrany;

    const zywy = s.wrogowie.findIndex(w => w.hp > 0);
    if (zywy !== -1) s.celIndeks = zywy;
    return s.wrogowie[s.celIndeks] || s.wrogowie[0];
  },

  obierzCel(indeks) {
    const w = this.stan.wrogowie[indeks];
    if (!w || w.hp <= 0) return false;
    this.stan.celIndeks = indeks;
    UI.odswiez();
    return true;
  },

  opisInicjatywy() {
    const s = this.stan;
    const remis = this.zrecznoscEfektywna(s.gracz) === this.zrecznoscEfektywna(s.wrog);

    if (s.kolejka[0] === 'gracz') {
      return remis ? 'Równi w Zręczności — los daje pierwszy ruch Tobie.'
                   : 'Jesteś szybszy — zaczynasz.';
    }
    return remis ? `Równi w Zręczności — los daje pierwszy ruch: ${s.wrog.nazwa}.`
                 : `Pierwszy ruch należy do: ${s.wrog.nazwa}.`;
  },

  stworzGracza() {
    const b = Bohater.stan;
    const klasa = Bohater.klasa();
    const maxHp = Bohater.maxHp();
    const zas = CONFIG.zasoby[klasa.zasob];

    const cechy = {};
    Object.keys(b.cechy).forEach(c => { cechy[c] = Bohater.cecha(c); });

    let maxZasobu = zas.max !== undefined
      ? zas.max
      : zas.maxBazowy
        + cechy.zrecznosc * (zas.maxZaZrecznosc || 0)
        + cechy.wola * (zas.maxZaWole || 0);
    maxZasobu += Bonusy.mod('maxZasobu') + Bonusy.mod('maksKombo');

    return {
      czyGracz: true,
      nazwa: klasa.nazwa,
      klasa: klasa.id,
      ikona: klasa.ikona,
      cechy: cechy,
      bron: Bohater.bron(),
      pancerz: Bohater.pancerz(),
      obronaSprzetu: Bohater.obronaSprzetu(),   // napierśnik + hełm + tarcza + nagolenniki
      // HP przechodzi z poprzedniej walki - to jest system energii tej gry.
      maxHp: maxHp, hp: Math.max(1, Math.min(maxHp, b.hp)),

      zasob: {
        id: klasa.zasob,
        nazwa: zas.nazwa,
        wartosc: zas.start,
        max: maxZasobu
      },

      atakPodstawowy: klasa.atakPodstawowy,
      cechaObrazen: klasa.cechaObrazen || 'sila',
      sloty: b.sloty,
      gardaAktywna: false,
      statusy: [],
      zuzycia: {},
      juzOszukalSmierc: false
    };
  },

  stworzWroga(wrog) {
    // Dwa globalne pokretla trudnosci z CONFIG.wrogowie — jedna zmiana
    // podkreca albo luzuje cala drabine, bez ruszania 15 kart wrogow.
    const t = CONFIG.wrogowie;
    const cechy = Object.assign({}, wrog.cechy);
    // Bez zaokraglania do pelnych punktow — inaczej przy sile 3 mnoznik
    // 1.12 nic by nie zmienil (3.36 -> 3) i slabi wrogowie zostaliby w tyle.
    cechy.sila = Math.round(cechy.sila * t.mnoznikSily * 10) / 10;
    const maxHp = Math.round(wrog.hp * t.mnoznikHp);

    return {
      czyGracz: false,
      id: wrog.id,
      nazwa: wrog.nazwa,
      tytul: wrog.tytul,
      ikona: wrog.ikona || '🗡',
      cechy: cechy,
      bron: wrog.bron,
      pancerz: wrog.pancerz,
      maxHp: maxHp, hp: maxHp,
      ai: wrog.ai || { typ: 'prosty' },
      zasob: null,
      gardaAktywna: false,
      statusy: [],
      zuzycia: {},

      // Przynaleznosc zywiolowa (bestie)
      bestia: !!wrog.bestia,
      slabosci: (wrog.slabosci || []).slice(),
      odpornosci: (wrog.odpornosci || []).slice(),
      wchlania: (wrog.wchlania || []).slice(),
      odpornyNaKrwawienie: !!wrog.odpornyNaKrwawienie,
      trudnaDoTrafienia: wrog.trudnaDoTrafienia || 0,

      licznikTur: 0,
      szykujeSzarze: false,
      wSzale: false,
      faza: 1,
      juzLeczony: false,
      mnoznikObrazen: 1
    };
  },

  zrecznoscEfektywna(postac) {
    let z = postac.cechy.zrecznosc;
    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def && def.modyfikatorZrecznosci) z += def.modyfikatorZrecznosci * s.moc;
    });
    return Math.max(0, z);
  },

  // Kolejnosc na runde: wszyscy zywi uczestnicy wg efektywnej ZRECZNOSCI.
  ustalKolejnosc() {
    const uczestnicy = [{ kto: 'gracz', zre: this.zrecznoscEfektywna(this.stan.gracz) }];

    this.stan.pupile.forEach((p, i) => {
      if (p.hp > 0) uczestnicy.push({ kto: 'p' + i, zre: this.zrecznoscEfektywna(p) });
    });

    this.stan.wrogowie.forEach((w, i) => {
      if (w.hp > 0) uczestnicy.push({ kto: 'w' + i, zre: this.zrecznoscEfektywna(w) });
    });

    // Remis rozstrzyga los — dlatego najpierw mieszamy.
    uczestnicy.sort(() => Math.random() - 0.5);
    uczestnicy.sort((a, b) => b.zre - a.zre);

    return uczestnicy.map(u => u.kto);
  },

  // Zamienia wpis z kolejki na postac ('gracz' albo 'w2').
  postacZKolejki(wpis) {
    if (wpis === 'gracz') return this.stan.gracz;
    const nr = parseInt(wpis.slice(1), 10);
    return wpis[0] === 'p' ? this.stan.pupile[nr] : this.stan.wrogowie[nr];
  },

  // ---------- dystans ----------

  // Ile tur wrog potrzebuje, zeby Cie dopasc (pasywy moga to wydluzyc).
  turyDobiegania() {
    return CONFIG.dystans.turyDobiegania + Bonusy.mod('turyDobiegania');
  },

  czyDaleko() { return this.stan.dystans === 'daleko'; },

  odskoczNaDystans() {
    this.stan.dystans = 'daleko';
    this.stan.dobiegniecie = this.turyDobiegania();
  },

  // Tura wroga melee, gdy jestes daleko: zamiast bic, skraca dystans.
  probaDobiegniecia(w) {
    if (w.statusy.some(s => STATUSY[s.id].blokujeDobieganie)) {
      UI.dziennik(`${w.nazwa} szarpie się w sidłach — nie zbliża się ani o krok.`, 'garda');
      return true;
    }

    // Dystans skraca się raz na RUNDĘ, nie raz na wroga — inaczej wataha
    // dopadałaby strzelca natychmiast i klasa nie miałaby czego bronić.
    if (this.stan.rundaDobiegania === this.stan.runda) {
      UI.dziennik(`${w.nazwa} pędzi razem z resztą.`, 'cichy');
      return true;
    }
    this.stan.rundaDobiegania = this.stan.runda;

    // Mroz wydluza droge.
    const zmarzniety = w.statusy.some(s => STATUSY[s.id].spowalniaDobieganie);
    this.stan.dobiegniecie -= zmarzniety ? 0.5 : 1;

    if (this.stan.dobiegniecie <= 0) {
      this.stan.dystans = 'zwarcie';
      UI.dziennik(`${w.nazwa} dopada Cię. Zwarcie.`, 'przegrana');
    } else {
      UI.dziennik(
        zmarzniety ? `${w.nazwa} brnie ku Tobie, zesztywniały od mrozu.`
                   : `${w.nazwa} biegnie w Twoją stronę.`,
        'cichy'
      );
    }
    return true;
  },

  // ---------- przeplyw tur ----------

  turaNastepnego() {
    if (this.stan.koniec) return;

    const wpis = this.stan.kolejka[this.stan.indeks];
    if (wpis === undefined) { this.przekazDalej(); return; }

    if (wpis === 'gracz') {
      this.zacznijTureGracza();
      return;
    }

    // Tura przywolania: bije samo, gracz nie klika za nie.
    if (wpis[0] === 'p') {
      const pupil = this.postacZKolejki(wpis);
      if (!pupil || pupil.hp <= 0) { this.przekazDalej(); return; }
      this.stan.czekamNaGracza = false;
      UI.odswiez();
      setTimeout(() => this.turaPupila(pupil), CONFIG.ui.pauzaPrzedTuraWroga);
      return;
    }

    // Wrog moze byc juz martwy (padl w tej rundzie) - pomijamy go.
    const w = this.postacZKolejki(wpis);
    if (!w || w.hp <= 0) { this.przekazDalej(); return; }

    this.stan.czekamNaGracza = false;
    UI.odswiez();
    setTimeout(() => this.turaWroga(w), CONFIG.ui.pauzaPrzedTuraWroga);
  },

  przekazDalej() {
    if (this.stan.koniec) return;
    this.stan.indeks++;
    if (this.stan.indeks >= this.stan.kolejka.length) {
      this.stan.indeks = 0;
      this.stan.runda++;
      this.stan.kolejka = this.ustalKolejnosc();
    }
    this.turaNastepnego();
  },

  zacznijTureGracza() {
    const g = this.stan.gracz;

    if (g.gardaAktywna) {
      g.gardaAktywna = false;
      UI.dziennik('Opuszczasz gardę.', 'cichy');
    }

    this.tykajStatusy(g, true);
    if (this.sprawdzKoniec()) return;

    // Weteran: regeneracja co ture
    const regenHp = Bonusy.mod('regenHpNaTure');
    if (regenHp > 0 && g.hp < g.maxHp) this.ulecz(g, regenHp, 'Weteran');

    if (this.czyOgluszony(g, true)) { this.przekazDalej(); return; }

    const regen = CONFIG.zasoby[g.zasob.id].regenNaTure;
    if (regen > 0) {
      const zysk = this.dodajZasob(g, regen);
      if (zysk > 0) UI.dziennik(`Łapiesz oddech. +${zysk} ${g.zasob.nazwa}.`, 'cichy');
    }

    this.stan.czekamNaGracza = true;
    UI.odswiez();
  },

  akcjaGracza(idUmiejetnosci, wariant) {
    if (!this.stan || this.stan.koniec || !this.stan.czekamNaGracza) return;

    const um = UMIEJETNOSCI[idUmiejetnosci];
    if (!um) return;

    const powod = this.dlaczegoNieMozna(this.stan.gracz, um);
    if (powod) { UI.dziennik(powod, 'cichy'); return; }

    this.stan.czekamNaGracza = false;
    this.zaplac(this.stan.gracz, um);
    this.zapiszZuzycie(this.stan.gracz, um);

    this.wykonajAkcje(this.stan.gracz, this.cel(), um, wariant);
    this.obrazeniaObszarowe(this.stan.gracz, this.cel(), um);

    UI.odswiez();
    if (this.sprawdzKoniec()) return;
    this.przekazDalej();
  },

  turaWroga(wrog) {
    if (this.stan.koniec) return;
    const w = wrog || this.cel();
    if (!w || w.hp <= 0) { this.przekazDalej(); return; }

    if (w.gardaAktywna) w.gardaAktywna = false;
    this.tykajStatusy(w, false);
    if (this.sprawdzKoniec()) return;

    this.regeneracjaBestii(w);

    if (this.czyOgluszony(w, false)) {
      UI.odswiez();
      setTimeout(() => this.przekazDalej(), CONFIG.ui.pauzaPoTurzeWroga);
      return;
    }

    w.licznikTur++;

    // Daleko? Wrog w zwarciu musi najpierw dobiec.
    if (this.czyDaleko() && !w.dystansowy) {
      this.probaDobiegniecia(w);
      UI.odswiez();
      setTimeout(() => this.przekazDalej(), CONFIG.ui.pauzaPoTurzeWroga);
      return;
    }

    this.wykonajAkcje(w, this.celWroga(), this.wybierzAkcjeWroga(w));

    UI.odswiez();
    if (this.sprawdzKoniec()) return;
    setTimeout(() => this.przekazDalej(), CONFIG.ui.pauzaPoTurzeWroga);
  },

  // Obrazenia obszarowe: te same ciosy lecą w kolejne cele z watahy.
  obrazeniaObszarowe(atakujacy, glownyCel, um) {
    if (this.stan.koniec) return;

    const l = this.liczbyDla(atakujacy, um);
    const dodatkowe = l.celeObszarowe || 0;
    if (dodatkowe <= 0) return;

    const pozostali = this.zywi().filter(w => w !== glownyCel).slice(0, dodatkowe);
    if (!pozostali.length) return;

    UI.dziennik(`${um.nazwa} sięga dalej — cios zbiera kolejne cele.`, 'info');
    pozostali.forEach(w => {
      if (!this.stan.koniec) this.wykonajAtak(atakujacy, w, um, true);
    });
  },

  // Hydra: goi sie co ture, chyba ze plonie (ogien przypala kikuty).
  regeneracjaBestii(w) {
    if (!w.ai.regenNaTure || w.hp >= w.maxHp) return;

    const blokada = w.ai.blokujeRegen;
    if (blokada && w.statusy.some(s => (STATUSY[s.id].zywiol || '') === blokada)) {
      UI.dziennik(`${w.nazwa} nie może się zregenerować — ogień przypala rany.`, 'krytyk');
      return;
    }

    this.ulecz(w, w.ai.regenNaTure, `${w.nazwa} odrasta`);
  },

  // Wrog musi wybrac: gracz czy jego bestia. To lamie 1v1.
  celWroga() {
    const pupile = this.zywePupile();
    if (!pupile.length) return this.stan.gracz;
    if (Math.random() < CONFIG.przywolania.szansaAtakuNaPupila) {
      return pupile[Math.floor(Math.random() * pupile.length)];
    }
    return this.stan.gracz;
  },

  // ---------- przywolania ----------

  zywePupile() { return this.stan.pupile.filter(p => p.hp > 0); },

  stworzPupila(szablon, mnoznikMocy) {
    const moc = 1 + mnoznikMocy;
    const cechy = {};
    Object.entries(szablon.cechy).forEach(([k, v]) => {
      cechy[k] = (k === 'sila' || k === 'atak') ? Math.round(v * moc) : v;
    });

    const maxHp = Math.round(szablon.hp * moc);
    return {
      czyPupil: true,
      id: szablon.id,
      nazwa: szablon.nazwa,
      ikona: szablon.ikona,
      cechy: cechy,
      bron: szablon.bron,
      pancerz: { nazwa: 'skóra', obrona: 0 },
      maxHp: maxHp, hp: maxHp,
      tury: szablon.tury + Bonusy.mod('turyPupili'),
      zasob: null,
      gardaAktywna: false,
      statusy: [],
      zuzycia: {},
      slabosci: [], odpornosci: [], wchlania: [],
      mnoznikObrazen: 1
    };
  },

  wykonajPrzyzwanie(wykonawca, um) {
    const l = this.liczbyDla(wykonawca, um);
    const szablon = PUPILE[l.pupil];
    if (!szablon) return;

    const ile = l.liczbaPupili || 1;
    const moc = Bonusy.mod('mocPupili') + (l.mocPupilaAkcji || 0);

    for (let i = 0; i < ile; i++) {
      const p = this.stworzPupila(szablon, moc);
      if (ile > 1) p.nazwa = szablon.nazwa + ' ' + (this.stan.pupile.length + 1);
      this.stan.pupile.push(p);
    }

    UI.dziennik(
      ile > 1 ? `Wzywasz watahę — ${ile} bestie stają u Twojego boku.`
              : `${szablon.nazwa} wyskakuje z cienia i staje przy Tobie.`,
      'leczenie'
    );
    this.stan.kolejka = this.ustalKolejnosc();
  },

  // Pupil dziala sam: bije obrany przez Ciebie cel.
  turaPupila(pupil) {
    if (this.stan.koniec) return;

    this.tykajStatusy(pupil, false);
    if (pupil.hp <= 0) { this.przekazDalej(); return; }

    pupil.tury--;
    if (pupil.tury <= 0) {
      UI.dziennik(`${pupil.nazwa} rozpływa się w powietrzu.`, 'cichy');
      pupil.hp = 0;
      UI.odswiez();
      setTimeout(() => this.przekazDalej(), CONFIG.ui.pauzaPoTurzeWroga);
      return;
    }

    const cel = this.cel();
    if (cel && cel.hp > 0) this.atakPupila(pupil, cel);

    UI.odswiez();
    if (this.sprawdzKoniec()) return;
    setTimeout(() => this.przekazDalej(), CONFIG.ui.pauzaPoTurzeWroga);
  },

  atakPupila(pupil, cel) {
    if (!this.czyTrafil(pupil, cel)) {
      UI.dziennik(`${pupil.nazwa} chybia.`, 'pudlo');
      return;
    }

    let obrazenia = this.losujObrazenia(pupil);
    obrazenia = this.poPancerzu(obrazenia, this.obronaPostaci(cel));
    obrazenia *= (1 - this.redukcjaCelu(cel));
    obrazenia = Math.max(CONFIG.walka.minimalneObrazenia, Math.round(obrazenia));

    cel.hp = Math.max(0, cel.hp - obrazenia);
    UI.dziennik(`${pupil.nazwa} rzuca się na ${cel.nazwa} — ${obrazenia} HP.`, 'cios-gracza');
    UI.drgnij('wrog');

    // Wiez krwi: przywolania lecza swojego pana.
    const wampiryzm = Bonusy.mod('wampiryzmPupili');
    if (wampiryzm > 0) {
      this.ulecz(this.stan.gracz, Math.max(1, Math.round(obrazenia * wampiryzm)),
                 `Więź krwi z ${pupil.nazwa}`);
    }
    this.sprawdzProgiWroga(cel);
  },

  czyOgluszony(postac, czyGracz) {
    const wpis = postac.statusy.find(s => STATUSY[s.id].pomijaTure);
    if (!wpis) return false;

    // Niezlomna postawa chroni przed ogluszeniem
    if (postac.statusy.some(s => STATUSY[s.id].odpornoscNaOgluszenie)) {
      postac.statusy = postac.statusy.filter(s => s !== wpis);
      UI.dziennik(czyGracz ? 'Niezłomna postawa trzyma Cię na nogach.'
                           : `${postac.nazwa} strząsa oszołomienie.`, 'garda');
      return false;
    }

    postac.statusy = postac.statusy.filter(s => s !== wpis);
    UI.dziennik(
      czyGracz ? 'Jesteś oszołomiony — tracisz turę.'
               : `${postac.nazwa} — oszołomienie, tura przepada.`,
      'status'
    );
    return true;
  },

  // ---------- AI wrogow ----------

  wybierzAkcjeWroga(w) {
    const ai = w.ai;

    if (ai.typ === 'szarza') {
      if (w.szykujeSzarze) { w.szykujeSzarze = false; return UMIEJETNOSCI.szarza; }
      if (w.licznikTur % ai.coIleTur === 0) {
        w.szykujeSzarze = true;
        return UMIEJETNOSCI.szykowanieSzarzy;
      }
      return UMIEJETNOSCI.cios;
    }

    if (ai.typ === 'leczacy' && !w.juzLeczony && w.hp < w.maxHp * ai.progLeczenia) {
      w.juzLeczony = true;
      return UMIEJETNOSCI.opatrunek;
    }

    if (ai.typ === 'siec' && Math.random() < ai.szansaSieci)   return UMIEJETNOSCI.siec;
    if (ai.typ === 'trujacy' && Math.random() < ai.szansaJadu) return UMIEJETNOSCI.jadowityCios;
    if (ai.typ === 'klatwa' && Math.random() < ai.szansaKlatwy
        && !this.stan.gracz.statusy.some(s => s.id === 'oslabienieAtaku')) {
      return UMIEJETNOSCI.klatwa;
    }

    // ---- bestie ----

    if (ai.typ === 'krwawiacy' && Math.random() < ai.szansaKrwawienia) return UMIEJETNOSCI.ugryzienie;
    if (ai.typ === 'ogluszajacy' && Math.random() < ai.szansaOgluszenia) return UMIEJETNOSCI.uderzenieGolema;

    if (ai.typ === 'zionacy' && Math.random() < ai.szansaZioniecia) return UMIEJETNOSCI.zioniecie;

    if (ai.typ === 'bicz' && Math.random() < ai.szansaBicza
        && !this.stan.gracz.statusy.some(s => s.id === 'oslabienieCelnosci')) {
      return UMIEJETNOSCI.trzaskBicza;
    }

    if (ai.typ === 'wrzask' && Math.random() < ai.szansaWrzasku
        && !this.stan.gracz.statusy.some(s => s.id === 'oslabienieCelnosci')) {
      return UMIEJETNOSCI.wrzask;
    }

    if (ai.typ === 'regenerujacy' && Math.random() < ai.szansaMultiCiosu) return UMIEJETNOSCI.wielePaszczy;

    if (ai.typ === 'fazyZywiolowe') {
      if (w.faza === 1 && Math.random() < ai.szansaZioniecia) return UMIEJETNOSCI.zioniecie;
      if (w.faza === 2 && Math.random() < ai.faza2.szansaJadu) return UMIEJETNOSCI.jadowityCios;
    }

    if ((ai.szansaGardy || 0) > 0 && Math.random() < ai.szansaGardy) return UMIEJETNOSCI.garda;
    return UMIEJETNOSCI.cios;
  },

  sprawdzProgiWroga(w) {
    if (!w || !w.ai || w.hp <= 0) return;

    // Dzik: szal przy niskim HP
    if (w.ai.progSzalu && !w.wSzale && w.hp <= w.maxHp * w.ai.progSzalu && w.ai.mnoznikSzalu) {
      w.wSzale = true;
      w.mnoznikObrazen = w.ai.mnoznikSzalu;
      UI.dziennik(`${w.nazwa} kwiczy z wściekłości i przestaje uważać!`, 'przegrana');
    }

    // Chimera: zmiana fazy PRZESTAWIA ZYWIOLY
    if (w.ai.typ === 'fazyZywiolowe' && w.faza === 1 && w.hp <= w.maxHp * w.ai.progFazy) {
      w.faza = 2;
      const f = w.ai.faza2;
      w.slabosci = f.slabosci.slice();
      w.odpornosci = f.odpornosci.slice();
      UI.dziennik(f.komunikat, 'przegrana');
    }

    if (w.ai.typ === 'szal' && !w.wSzale && w.hp <= w.maxHp * w.ai.progSzalu) {
      w.wSzale = true;
      w.mnoznikObrazen = w.ai.mnoznikObrazen;
      w.cechy.obrona = Math.round(w.cechy.obrona * w.ai.mnoznikObrony);
      UI.dziennik(`${w.nazwa} wpada w szał! Bije mocniej, ale przestaje się kryć.`, 'przegrana');
    }

    if (w.ai.typ === 'fazy' && w.faza === 1 && w.hp <= w.maxHp * w.ai.progFazy) {
      w.faza = 2;
      const f = w.ai.faza2;
      w.cechy.obrona = f.obrona;
      w.cechy.zrecznosc = f.zrecznosc;
      w.mnoznikObrazen = f.mnoznikObrazen;
      w.ai = Object.assign({}, w.ai, { szansaGardy: f.szansaGardy });
      UI.dziennik(`${w.nazwa} odrzuca tarczę. Pancerz spada, ale wpada w furię!`, 'przegrana');
    }
  },

  // ---------- rozliczanie akcji ----------

  wykonajAkcje(wykonawca, cel, um, wariant) {
    switch (um.typ) {
      case 'atak':
      case 'finiszer':  this.wykonajAtak(wykonawca, cel, um); break;
      case 'seria':     this.wykonajSerie(wykonawca, cel, um); break;
      case 'detonacja': this.wykonajDetonacje(wykonawca, cel, um); break;
      case 'garda':     this.wykonajGarde(wykonawca); break;
      case 'leczenie':  this.wykonajLeczenie(wykonawca, um); break;
      case 'ofiara':    this.wykonajOfiare(wykonawca, um); break;
      case 'ukrycie':
      case 'postawa':   this.wykonajPostawe(wykonawca, um); break;
      case 'klatwa':    this.wykonajKlatwe(wykonawca, cel, um); break;
      case 'eliksir':   this.wykonajEliksir(wykonawca, wariant); break;
      case 'odskok':    this.wykonajOdskok(wykonawca, cel, um); break;
      case 'salwa':     this.wykonajSalwe(wykonawca, cel, um); break;
      case 'przyzwanie':this.wykonajPrzyzwanie(wykonawca, um); break;
      case 'telegraf':  UI.dziennik(`${wykonawca.nazwa} grzebie nogą w piachu — zaraz zaszarżuje!`, 'status'); break;
    }
  },

  wykonajAtak(atakujacy, cel, um, cichy) {
    const czyGracz = atakujacy.czyGracz;
    const l = this.liczbyDla(atakujacy, um);

    const punktyKombo = atakujacy.__zuzyteKombo || 0;
    delete atakujacy.__zuzyteKombo;

    const unik = this.znajdzUnik(cel);
    if (unik) { this.zuzyjUnik(cel, unik, atakujacy, czyGracz); return; }

    if (!this.czyTrafil(atakujacy, cel)) {
      UI.dziennik(
        czyGracz ? `${um.nazwa} idzie w powietrze — ${cel.nazwa} uchyla się.`
                 : `${atakujacy.nazwa} chybia.`,
        'pudlo'
      );
      UI.liczba(cel, 'PUDŁO', 'pudlo');
      UI.poza(atakujacy, 'atak', CONFIG.ui.czasAtakuMs);
      this.poPudle(atakujacy, czyGracz);
      return;
    }

    let mnoznik = l.mnoznikObrazen || 1;

    if (um.typ === 'finiszer') mnoznik = l.mnoznikBazowy + punktyKombo * l.mnoznikZaPunktKombo;
    if (um.id === 'egzekucja' && cel.hp <= cel.maxHp * l.progHpCelu) {
      mnoznik = l.mnoznikEgzekucji;
      UI.dziennik('Widzisz, że ledwo stoi. Kończysz to.', 'info');
    }
    // Mag: premie za trafianie w slabosci i w pancerz.
    if (czyGracz) {
      const zywiolCiosu = this.zywiolAtaku(atakujacy, um);
      if ((cel.slabosci || []).includes(zywiolCiosu)) mnoznik += Bonusy.mod('bonusZaSlabosc');
      if (this.obronaPostaci(cel) >= 5) mnoznik += Bonusy.mod('bonusNaOpancerzonych');
      if (cel.statusy.some(s => s.id === 'wychlodzenie')) {
        mnoznik += Bonusy.mod('bonusNaZmarznietych') + (l.bonusNaZmarznietych || 0);
      }
    }
    if (um.id === 'gniewJowisza' && this.obronaPostaci(cel) >= l.progObronyWroga) {
      mnoznik += l.bonusNaOpancerzonych;
      UI.dziennik('Metal przyciąga piorun!', 'info');
    }
    if (um.id === 'zabojczyStrzal' && this.czyDaleko()) {
      mnoznik += l.bonusZDaleka;
      UI.dziennik('Masz go na widelcu — strzał leci z pełnym naciągiem.', 'info');
    }
    if (um.id === 'rozlupujacyCios' && this.obronaPostaci(cel) >= l.progObronyWroga) {
      mnoznik += l.bonusNaOpancerzonych;
      UI.dziennik('Ostrze znajduje szparę w pancerzu!', 'info');
    }

    let obrazenia = this.losujObrazenia(atakujacy) * mnoznik;
    obrazenia *= this.modyfikatorObrazen(atakujacy);
    if (atakujacy.mnoznikObrazen) obrazenia *= atakujacy.mnoznikObrazen;

    // Kiel wilka: pierwszy cios w walce boli bardziej
    if (atakujacy.czyGracz && !atakujacy.juzUderzyl) {
      atakujacy.juzUderzyl = true;
      const bonus = Bonusy.mod('bonusPierwszegoCiosu');
      if (bonus > 0) {
        obrazenia *= (1 + bonus);
        UI.dziennik('Otwierasz walkę z zaskoczenia!', 'info');
      }
    }

    const krytyk = this.czyKrytyk(atakujacy, um, l);
    if (krytyk) obrazenia *= this.mnoznikKrytyka(atakujacy);

    // Zywiol decyduje, czy pancerz w ogole ma cos do powiedzenia.
    const zywiol = this.zywiolAtaku(atakujacy, um);
    if (!ZYWIOLY[zywiol].omijaPancerz) {
      obrazenia = this.poPancerzu(obrazenia, this.obronaSkuteczna(atakujacy, cel, l));
    }
    obrazenia *= (1 - this.redukcjaCelu(cel));

    // Slabosci, odpornosci i wchlanianie
    const reakcja = this.reakcjaNaZywiol(cel, zywiol);
    obrazenia *= reakcja.mnoznik;
    obrazenia = Math.max(CONFIG.walka.minimalneObrazenia, Math.round(obrazenia));

    if (reakcja.wchlania) {
      this.ulecz(cel, obrazenia, `${cel.nazwa} POCHŁANIA ${ZYWIOLY[zywiol].nazwa}`);
      UI.dziennik(`Zły żywioł! ${cel.nazwa} karmi się tym atakiem.`, 'przegrana');
      this.poTrafieniu(atakujacy, cel, um, 0, czyGracz);
      return;
    }
    if (reakcja.komunikat) UI.dziennik(reakcja.komunikat, reakcja.dobre ? 'krytyk' : 'pudlo');

    // Kataklizm: detonuje Podpalenie zamiast czekac, az sie wypali.
    if (l.detonujePodpalenia) {
      const ogien = cel.statusy.find(s => s.id === 'podpalenie');
      if (ogien) {
        const wybuch = Math.round(ogien.moc * ogien.tury * l.detonujePodpalenia);
        cel.statusy = cel.statusy.filter(s => s !== ogien);
        obrazenia += wybuch;
        UI.dziennik(`Płomienie na ${cel.nazwa} eksplodują — +${wybuch} obrażeń!`, 'krytyk');
      }
    }

    this.zadajObrazenia(atakujacy, cel, obrazenia, um, krytyk, czyGracz, cichy);

    if (um.nakladaStatus && cel.hp > 0) this.nalozZUmiejetnosci(atakujacy, cel, um, l);

    // Slaby punkt (lucznik): krytyk otwiera krwawiaca rane.
    if (krytyk && czyGracz && cel.hp > 0) {
      const krwawienie = Bonusy.mod('krwawienieZKrytyka');
      if (krwawienie > 0) this.nalozStatus(cel, 'krwawienie', krwawienie, 3);
    }
    if (um.id === 'siec') this.efektSieci(cel, l);

    this.poTrafieniu(atakujacy, cel, um, obrazenia, czyGracz);
    if (czyGracz) {
      this.sprawdzProgiWroga(cel);
      this.sprawdzDodatkowyCios(atakujacy, cel, um, krytyk);
    }
  },

  // Seria pchniec: kilka slabszych ciosow pod rzad, kazdy buduje Kombo.
  wykonajSerie(atakujacy, cel, um) {
    const l = this.liczbyDla(atakujacy, um);
    UI.dziennik(`${um.nazwa}: ostrza migają w powietrzu.`, 'info');

    for (let i = 0; i < l.liczbaCiosow && cel.hp > 0 && !this.stan.koniec; i++) {
      this.wykonajAtak(atakujacy, cel, um, true);
    }
    if (l.szansaKrwawienia > 0 && cel.hp > 0 && Math.random() < l.szansaKrwawienia) {
      this.nalozStatus(cel, 'krwawienie', l.obrazeniaKrwawienia, l.turyKrwawienia);
    }
  },

  // Rozprucie: detonuje cala trucizne na wrogu.
  wykonajDetonacje(atakujacy, cel, um) {
    const l = this.liczbyDla(atakujacy, um);
    const jad = cel.statusy.find(s => s.id === 'zatrucie');

    if (!jad) {
      UI.dziennik(`${um.nazwa} nie ma czego zdetonować — wróg nie jest zatruty.`, 'cichy');
      return;
    }

    const naTure = jad.moc * (jad.stacki || 1);
    const obrazenia = Math.max(1, Math.round(naTure * jad.tury * l.mnoznikDetonacji));

    cel.statusy = cel.statusy.filter(s => s !== jad);
    cel.hp = Math.max(0, cel.hp - obrazenia);

    UI.dziennik(`${um.nazwa}! Jad wybucha w żyłach — ${cel.nazwa} traci ${obrazenia} HP.`, 'krytyk');
    UI.drgnij('wrog');

    if (l.szansaKrwawienia > 0 && cel.hp > 0 && Math.random() < l.szansaKrwawienia) {
      this.nalozStatus(cel, 'krwawienie', l.obrazeniaKrwawienia, l.turyKrwawienia);
    }
    this.kradziezZycia(atakujacy, obrazenia);
    this.sprawdzProgiWroga(cel);
  },

  // Nieokielznany / Taniec ostrzy: szansa na darmowe uderzenie.
  sprawdzDodatkowyCios(atakujacy, cel, um, krytyk) {
    if (cel.hp <= 0 || atakujacy.__wDodatkowym) return;

    const szansa = Bonusy.mod('szansaDodatkowegoCiosu');
    if (szansa <= 0) return;

    // Taniec ostrzy dziala po krytyku, Nieokielznany przy wysokim zasobie
    const wysokiZasob = atakujacy.zasob && atakujacy.zasob.wartosc >= atakujacy.zasob.max * 0.6;
    if (!krytyk && !wysokiZasob) return;
    if (Math.random() >= szansa) return;

    atakujacy.__wDodatkowym = true;
    UI.dziennik('Ostrze wraca — dodatkowe uderzenie!', 'krytyk');
    this.wykonajAtak(atakujacy, cel, UMIEJETNOSCI[atakujacy.atakPodstawowy], true);
    delete atakujacy.__wDodatkowym;
  },

  efektSieci(cel, l) {
    if (cel.hp <= 0) return;
    if (Math.random() < l.szansaOgluszenia) {
      this.nalozStatus(cel, 'ogluszenie', 1, 2);
      UI.dziennik('Sieć oplata Cię całkowicie!', 'status');
    } else {
      this.nalozStatus(cel, 'spowolnienie', l.oslabienieZrecznosci, l.turySpowolnienia);
    }
  },

  wykonajKlatwe(wykonawca, cel, um) {
    const l = this.liczbyDla(wykonawca, um);
    UI.poza(wykonawca, 'klatwa', CONFIG.ui.czasKlatwyMs);

    if (um.id === 'trzaskBicza') {
      UI.dziennik(`${wykonawca.nazwa} trzaska biczem tuż przy Twojej twarzy.`, 'status');
      this.nalozStatus(cel, 'oslabienieCelnosci', l.oslabienieCelnosci, l.turyDzialania);
      return;
    }

    if (um.id === 'wrzask') {
      UI.dziennik(`${wykonawca.nazwa} wrzeszczy — dzwoni Ci w uszach.`, 'status');
      this.nalozStatus(cel, 'oslabienieCelnosci', l.oslabienieCelnosci, l.turyDzialania);
      return;
    }

    UI.dziennik(`${wykonawca.nazwa} rzuca klątwę — Twoje ciosy słabną.`, 'status');
    this.nalozStatus(cel, 'oslabienieAtaku', wykonawca.ai.oslabienieAtaku, l.turyDzialania);
  },

  zadajObrazenia(atakujacy, cel, obrazenia, um, krytyk, czyGracz, cichy) {
    // Bariera (Lodowa zbroja) wchlania cios, zanim siegnie HP.
    const bariera = cel.statusy.find(s => STATUSY[s.id].pochlaniaObrazenia);
    if (bariera && obrazenia > 0) {
      const pochloniete = Math.min(bariera.moc, obrazenia);
      bariera.moc -= pochloniete;
      obrazenia -= pochloniete;

      if (bariera.moc <= 0) {
        cel.statusy = cel.statusy.filter(s => s !== bariera);
        UI.dziennik('Lodowa zbroja pęka.', 'cichy');
      }
      if (obrazenia <= 0) {
        UI.dziennik(`Bariera pochłania cios (${pochloniete}).`, 'garda');
        UI.liczba(cel, 'BLOK', 'blok');
        return;
      }
    }

    cel.hp = Math.max(0, cel.hp - obrazenia);

    // Ostatnia furia: raz na walke smiertelny cios zostawia 1 HP
    if (cel.hp <= 0 && cel.czyGracz && !cel.juzOszukalSmierc && Bonusy.mod('oszukanieSmierci') > 0) {
      const leczenie = Bonusy.mod('leczenieZOszukaniaSmierci');
      cel.hp = leczenie > 0 ? Math.round(cel.maxHp * leczenie) : 1;
      cel.juzOszukalSmierc = true;
      UI.dziennik(
        leczenie > 0 ? `ODRODZENIE! Cios, który miał Cię zabić, budzi w Tobie życie — ${cel.hp} HP.`
                     : 'Miałeś zginąć — zostajesz na nogach z 1 HP.',
        'krytyk'
      );
    }

    let tekst = czyGracz
      ? `${um.nazwa}: ${cel.nazwa} traci ${obrazenia} HP.`
      : `${atakujacy.nazwa} — ${um.nazwa}: tracisz ${obrazenia} HP.`;
    if (krytyk) tekst = 'KRYTYK! ' + tekst;
    if (cel.gardaAktywna) tekst += ' (garda zamortyzowała)';

    UI.dziennik(tekst, czyGracz ? (krytyk ? 'krytyk' : 'cios-gracza') : 'cios-wroga');
    UI.liczba(cel, '−' + obrazenia, krytyk ? 'krytyk' : 'obrazenia');
    if (krytyk) UI.liczba(cel, 'KRYT!', 'haslo-krytyk');
    if (cel.gardaAktywna) {
      UI.liczba(cel, 'BLOK', 'blok');
      UI.blysnijBlokiem(cel);
    }

    UI.poza(atakujacy, 'atak', CONFIG.ui.czasAtakuMs);
    UI.poza(cel, 'trafienie', CONFIG.ui.czasTrafieniaMs);
    if (!cichy) UI.drgnij(czyGracz ? 'wrog' : 'gracz');
  },

  poTrafieniu(atakujacy, cel, um, obrazenia, czyGracz) {
    if (czyGracz) {
      const z = CONFIG.zasoby[atakujacy.zasob.id];
      const l = this.liczbyDla(atakujacy, um);
      const bonusZasobu = 1 + Bonusy.mod('bonusZasobuProcent');

      if (um.id === atakujacy.atakPodstawowy && l.zwrotZasobu) {
        const zysk = this.dodajZasob(atakujacy, l.zwrotZasobu + Bonusy.mod('zwrotZasobuPodstawowego'));
        if (zysk > 0) UI.dziennik(`+${zysk} ${atakujacy.zasob.nazwa}.`, 'cichy');
      }
      if (z.zaZadaneObrazenia) {
        this.dodajZasob(atakujacy, obrazenia * z.zaZadaneObrazenia * bonusZasobu);
      }
      if (z.zaTrafienie) this.dodajZasob(atakujacy, z.zaTrafienie);

      this.kradziezZycia(atakujacy, obrazenia, l);

      if (cel.hp <= 0 && um.id === 'egzekucja') {
        this.ulecz(atakujacy, Math.round(atakujacy.maxHp * l.leczenieZaZabojstwo),
                   'Zabójstwo dodaje Ci sił');
      }
      // Zabojczy strzal dobija ciezko rannych
      if (um.id === 'zabojczyStrzal' && cel.hp > 0 && cel.hp <= cel.maxHp * l.progDobicia) {
        cel.hp = 0;
        UI.dziennik('Strzał w gardło. Koniec.', 'krytyk');
      }

      // Smiertelny cios: finiszer z pelnym Kombo dobija ciezko rannych
      if (um.typ === 'finiszer' && cel.hp > 0) {
        const prog = Bonusy.mod('dobicieFiniszerem');
        if (prog > 0 && cel.hp <= cel.maxHp * prog) {
          cel.hp = 0;
          UI.dziennik('ŚMIERTELNY CIOS! Ostrze znajduje gardło.', 'krytyk');
        }
      }
    } else {
      const g = this.stan.gracz;
      const z = CONFIG.zasoby[g.zasob.id];
      const bonusZasobu = 1 + Bonusy.mod('bonusZasobuProcent');

      if (z.zaOtrzymaneObrazenia) {
        const zysk = this.dodajZasob(g, obrazenia * z.zaOtrzymaneObrazenia * bonusZasobu);
        if (zysk > 0) UI.dziennik(`Ból podsyca wściekłość. +${zysk} ${g.zasob.nazwa}.`, 'cichy');
      }
      if (z.traciZaOberwanie && g.zasob.wartosc > 0) {
        const ile = z.traciZaOberwanie >= 99 ? g.zasob.wartosc : z.traciZaOberwanie;
        g.zasob.wartosc = Math.max(0, g.zasob.wartosc - ile);
        UI.dziennik(`Cios wytrąca Cię z rytmu — tracisz ${ile} Kombo.`, 'cichy');
      }

      // Ciernie odbijaja czesc obrazen w atakujacego.
      const kolce = g.statusy.find(s => STATUSY[s.id].odbicieObrazen);
      if (kolce && atakujacy.hp > 0) {
        const odbite = Math.max(1, Math.round(obrazenia * kolce.moc));
        atakujacy.hp = Math.max(0, atakujacy.hp - odbite);
        UI.dziennik(`Kolce ranią ${atakujacy.nazwa} — ${odbite} HP.`, 'cios-gracza');
        this.sprawdzProgiWroga(atakujacy);
      }

      this.sprawdzKontre(g, atakujacy);
    }
  },

  // Znak Marsa: szansa na odbicie ciosu od razu po oberwaniu.
  sprawdzKontre(gracz, wrog) {
    if (gracz.hp <= 0 || wrog.hp <= 0 || gracz.__wKontrze) return;

    const szansa = Bonusy.mod('szansaKontry');
    if (szansa <= 0 || Math.random() >= szansa) return;

    gracz.__wKontrze = true;
    UI.dziennik('Znak Marsa płonie — oddajesz cios!', 'krytyk');
    this.wykonajAtak(gracz, wrog, UMIEJETNOSCI[gracz.atakPodstawowy], true);
    delete gracz.__wKontrze;
  },

  poPudle(atakujacy, czyGracz) {
    if (!czyGracz) return;
    const g = this.stan.gracz;
    if (CONFIG.zasoby[g.zasob.id].zerujePudlo && g.zasob.wartosc > 0) {
      g.zasob.wartosc = 0;
      UI.dziennik('Pudło zrywa Kombo.', 'cichy');
    }
  },

  kradziezZycia(postac, obrazenia, l) {
    if (!postac.czyGracz) return;

    let procent = Bonusy.mod('kradziezZycia');
    if (l && l.kradziezZyciaAkcji) procent += l.kradziezZyciaAkcji;

    // Wampiryczny szal: podwojona przy wysokim zasobie
    const podwojenie = Bonusy.mod('kradziezZyciaPrzyWysokimZasobie');
    if (podwojenie > 0 && postac.zasob && postac.zasob.wartosc >= postac.zasob.max * 0.6) {
      procent *= (1 + podwojenie);
    }

    const ile = Math.round(obrazenia * procent);
    if (ile > 0) this.ulecz(postac, ile, 'Pijesz krew wroga');
  },

  // Bonusy i kary do ZADAWANYCH obrazen.
  modyfikatorObrazen(postac) {
    let mnoznik = 1;

    if (postac.czyGracz) {
      mnoznik += Bonusy.mod('obrazeniaProcent');

      // Strzelec z dystansu bije mocniej, w zwarciu slabiej.
      if (Bohater.klasa().dystansowa) {
        mnoznik += this.czyDaleko()
          ? CONFIG.dystans.bonusZDaleka + Bonusy.mod('obrazeniaZDaleka')
          : -CONFIG.dystans.karaWZwarciu;
      }

      const brakujeHp = 1 - (postac.hp / postac.maxHp);
      mnoznik += brakujeHp * Bonusy.mod('obrazeniaPrzyNiskimHp');

      const zaZasob = Bonusy.mod('obrazeniaZaZasob');
      if (zaZasob > 0 && postac.zasob) {
        mnoznik += zaZasob * (postac.zasob.wartosc / postac.zasob.max);
      }
    }

    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def && def.modyfikatorObrazen) mnoznik += def.modyfikatorObrazen * s.moc / 10;
      if (def && def.bonusObrazen && s.liczby) mnoznik += s.liczby.bonusObrazen || 0;
    });

    return Math.max(0.2, mnoznik);
  },

  // Redukcja OTRZYMYWANYCH obrazen: garda, postawy, pasywy.
  redukcjaCelu(cel) {
    let redukcja = cel.gardaAktywna ? CONFIG.akcje.garda.redukcjaObrazen : 0;

    cel.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def && def.redukcjaObrazen) redukcja += s.moc;
    });

    if (cel.czyGracz) {
      redukcja += Bonusy.mod('redukcjaObrazenProcent');
      if (cel.statusy.some(s => STATUSY[s.id].forma)) redukcja += Bonusy.mod('redukcjaWFormie');
      if (this.zywePupile().length) redukcja += Bonusy.mod('redukcjaZaPupila');

      const przyNiskim = Bonusy.mod('redukcjaPrzyNiskimHp');
      if (przyNiskim > 0 && cel.hp <= cel.maxHp * 0.35) redukcja += przyNiskim;
    }

    return Math.min(0.85, redukcja);   // nigdy nie jesteś nietykalny
  },

  // ---------- zywioly ----------

  // Zywiol ciosu: z umiejetnosci, inaczej z broni, inaczej fizyczny.
  zywiolAtaku(atakujacy, um) {
    if (um.zywiol) return um.zywiol;
    if (atakujacy.bron && atakujacy.bron.zywiol) return atakujacy.bron.zywiol;
    return 'fizyczny';
  },

  // Jak cel reaguje na dany zywiol: slabosc, odpornosc albo wchloniecie.
  reakcjaNaZywiol(cel, zywiol) {
    const slabosci = cel.slabosci || [];
    const odpornosci = cel.odpornosci || [];
    const wchlania = cel.wchlania || [];
    const ikona = ZYWIOLY[zywiol].ikona;

    if (wchlania.includes(zywiol)) return { mnoznik: 1, wchlania: true };

    if (slabosci.includes(zywiol)) {
      return { mnoznik: CONFIG.zywioly.mnoznikSlabosci, dobre: true,
               komunikat: `${ikona} Słaby punkt! ${cel.nazwa} nie znosi tego żywiołu.` };
    }
    if (odpornosci.includes(zywiol)) {
      return { mnoznik: CONFIG.zywioly.mnoznikOdpornosci, dobre: false,
               komunikat: `${ikona} ${cel.nazwa} — odporność na ten żywioł. Cios ledwo drasnął.` };
    }
    return { mnoznik: 1 };
  },

  // Pancerz celu po uwzglednieniu przebijania z drzewka.
  obronaSkuteczna(atakujacy, cel, l) {
    const obrona = this.obronaPostaci(cel);
    if (!atakujacy.czyGracz) return obrona;

    const przebicie = Bonusy.mod('ignorujPancerz') + ((l && l.przebiciePancerza) || 0);
    return obrona * Math.max(0, 1 - przebicie);
  },

  wykonajGarde(postac) {
    postac.gardaAktywna = true;
    UI.liczba(postac, 'GARDA', 'blok');
    UI.blysnijBlokiem(postac);
    if (postac.czyGracz) {
      const zysk = this.dodajZasob(postac, this.liczbyDla(postac, UMIEJETNOSCI.garda).zwrotZasobu);
      UI.dziennik(`Stajesz w gardzie. +${zysk} ${postac.zasob.nazwa}, obrażenia mniejsze.`, 'garda');
    } else {
      UI.dziennik(`${postac.nazwa} zasłania się tarczą.`, 'garda');
    }
  },

  wykonajLeczenie(postac, um) {
    const l = this.liczbyDla(postac, um);
    const moc = 1 + Bonusy.mod('mocLeczenia');
    this.ulecz(postac, Math.round(postac.maxHp * l.leczenieProcentMaxHp * moc), um.nazwa);

    // Uzdrowienie zostawia tez Regeneracje.
    if (um.nakladaStatus === 'regeneracja' && l.leczenieNaTure) {
      this.nalozStatus(postac, 'regeneracja', Math.round(l.leczenieNaTure * moc), l.turyDzialania);
    }
    if (l.zwrotZasobu && postac.zasob) {
      const zysk = this.dodajZasob(postac, l.zwrotZasobu);
      if (zysk > 0) UI.dziennik(`+${zysk} ${postac.zasob.nazwa}.`, 'cichy');
    }
  },

  wykonajOfiare(postac, um) {
    const l = this.liczbyDla(postac, um);
    const cena = Math.max(1, Math.round(postac.maxHp * l.kosztProcentHp));
    postac.hp = Math.max(1, postac.hp - cena);
    const zysk = this.dodajZasob(postac, l.zwrotZasobu);
    UI.dziennik(`${um.nazwa}: tniesz własne ramię za ${cena} HP. +${zysk} ${postac.zasob.nazwa}.`, 'ofiara');
    UI.drgnij('gracz');
  },

  wykonajPostawe(postac, um) {
    const l = this.liczbyDla(postac, um);

    // Sidla zastawiasz na przeciwniku, nie na sobie.
    if (um.id === 'sidla') {
      const cel = this.cel();
      this.nalozStatus(cel, 'usidlenie', 1, l.turyDzialania);
      UI.dziennik(`Zastawiasz sidła — ${cel.nazwa} nie zbliży się teraz ani o krok.`, 'status');
      return;
    }

    // Moc statusu zalezy od tego, co dana postawa robi.
    let moc = l.redukcjaObrazen || 1;
    if (um.nakladaStatus === 'bariera')     moc = l.pochlanianie;
    if (um.nakladaStatus === 'regeneracja') moc = Math.round(l.leczenieNaTure * (1 + Bonusy.mod('mocLeczenia')));
    if (um.nakladaStatus === 'ciernie')     moc = l.odbicieObrazen;
    if (um.nakladaStatus === 'formaNiedzwiedzia') moc = l.bonusObrony;
    if (um.nakladaStatus === 'formaWilka')        moc = l.bonusZrecznosci;

    const tury = l.turyDzialania + (String(um.nakladaStatus).startsWith('forma') ? Bonusy.mod('turyForm') : 0);
    this.nalozStatus(postac, um.nakladaStatus, moc, tury);

    // Formy i postawy niosa wlasne liczby, ktore czyta silnik.
    const wpis = postac.statusy.find(s => s.id === um.nakladaStatus);
    if (wpis) wpis.liczby = l;

    const zysk = this.dodajZasob(postac, l.zwrotZasobu || 0);

    let tekst;
    if (um.id === 'medytacja')             tekst = 'Zamykasz oczy i czerpiesz z arkany.';
    else if (um.id === 'wiezZNatura')       tekst = 'Kładziesz dłoń na ziemi. Moc wraca, rany zaczynają się goić.';
    else if (um.id === 'lodowaZbroja')      tekst = 'Powietrze wokół Ciebie krzepnie w lodową skorupę.';
    else if (um.id === 'ciernie')           tekst = 'Skóra pokrywa się kolcami.';
    else if (um.id === 'postacNiedzwiedzia')tekst = 'Kości trzeszczą — stajesz się niedźwiedziem.';
    else if (um.id === 'postacWilka')       tekst = 'Kurczysz się i przyspieszasz — jesteś wilkiem.';
    else if (um.id === 'wezNaCel')          tekst = 'Bierzesz go na cel. Następny strzał nie chybi.';
    else if (um.id === 'zejscieWCien')      tekst = 'Znikasz w cieniu. Następny cios będzie krytyczny.';
    else if (um.id === 'mur')              tekst = 'Zapierasz się tarczą jak mur.';
    else if (um.id === 'niezlomnaPostawa') tekst = 'Zaciskasz zęby. Nic Cię teraz nie ruszy.';
    else                                   tekst = 'Przyjmujesz postawę kontry.';
    if (zysk > 0) tekst += ` +${zysk} ${postac.zasob.nazwa}.`;

    UI.dziennik(tekst, 'garda');
  },

  // Odskok: wracasz na Daleko i strzelasz w biegu.
  wykonajOdskok(atakujacy, cel, um) {
    this.odskoczNaDystans();
    UI.dziennik('Odskakujesz do tyłu — znów jesteś poza zasięgiem.', 'garda');
    this.wykonajAtak(atakujacy, cel, um, true);
  },

  // Deszcz zywiolow: jedna salwa, wszystkie statusy naraz.
  wykonajSalwe(atakujacy, cel, um) {
    const l = this.liczbyDla(atakujacy, um);
    UI.dziennik('Salwa. Ogień, mróz i jad naraz.', 'krytyk');

    this.wykonajAtak(atakujacy, cel, um, true);
    if (cel.hp <= 0) return;

    this.nalozStatus(cel, 'podpalenie', l.obrazeniaPodpalenia + Bonusy.mod('mocStatusowZywiolowych'), l.turyDzialania);
    this.nalozStatus(cel, 'wychlodzenie', l.oslabienieZrecznosci, l.turyDzialania);
    this.nalozStatus(cel, 'zatrucie',
      l.obrazeniaZatrucia + Bonusy.mod('obrazeniaTrucizny'),
      l.turyDzialania + Bonusy.mod('turyTrucizny'), l.maksStackow);
  },

  // Eliksiry: leczące pijesz, ogniste i jad rzucasz we wroga,
  // wzmacniające nakładają status na Ciebie.
  wykonajEliksir(postac, idEliksiru) {
    const e = Bohater.zuzyjEliksir(idEliksiru || 'maly');
    if (!e) return;

    if (e.dzialanie === 'leczenie') {
      this.ulecz(postac, Math.round(postac.maxHp * e.procentMaxHp), `Wypijasz: ${e.nazwa}`);
      return;
    }

    if (e.dzialanie === 'wzmocnienie') {
      UI.dziennik(`${e.nazwa} — ${STATUSY[e.status].opisKrotki.toLowerCase()}.`, 'status');
      this.nalozStatus(postac, e.status, e.moc, e.tury);
      return;
    }

    // 'status' — flakon leci w przeciwnika.
    const cel = this.cel();
    if (!cel || cel.hp <= 0) return;
    UI.poza(postac, 'atak', CONFIG.ui.czasAtakuMs);
    UI.dziennik(`${e.nazwa} rozbija się o ${cel.nazwa}.`, 'status');
    this.nalozStatus(cel, e.status, e.moc, e.tury);
  },

  ulecz(postac, ile, powod) {
    const przed = postac.hp;
    postac.hp = Math.min(postac.maxHp, postac.hp + ile);
    const odzyskane = postac.hp - przed;
    if (odzyskane > 0) {
      UI.dziennik(`${powod}: +${odzyskane} HP.`, 'leczenie');
      UI.liczba(postac, '+' + odzyskane, 'leczenie');
    }
    return odzyskane;
  },

  // ---------- uniki i kontry ----------

  znajdzUnik(cel) {
    return cel.statusy.find(s => STATUSY[s.id] && STATUSY[s.id].unikNastepnego);
  },

  zuzyjUnik(cel, wpis, atakujacy, atakowalGracz) {
    const def = STATUSY[wpis.id];
    cel.statusy = cel.statusy.filter(s => s !== wpis);
    UI.liczba(cel, 'UNIK', 'pudlo');

    UI.dziennik(
      atakowalGracz ? `${cel.nazwa} znika Ci z ostrza (${def.nazwa}).`
                    : `Uchylasz się — ${def.nazwa} działa.`,
      'pudlo'
    );

    if (!cel.czyGracz) return;

    // Riposta: kontra krytycznym ciosem
    if (def.kontraPoUniku) {
      const l = this.liczbyDla(cel, UMIEJETNOSCI.riposta);
      let obrazenia = this.losujObrazenia(cel) * l.mnoznikKontry
                      * this.modyfikatorObrazen(cel) * this.mnoznikKrytyka(cel);
      obrazenia = this.poPancerzu(obrazenia, this.obronaSkuteczna(cel, atakujacy));
      obrazenia = Math.max(CONFIG.walka.minimalneObrazenia, Math.round(obrazenia));

      atakujacy.hp = Math.max(0, atakujacy.hp - obrazenia);
      UI.dziennik(`KONTRA! ${atakujacy.nazwa} traci ${obrazenia} HP.`, 'krytyk');
      UI.drgnij('wrog');

      const z = CONFIG.zasoby[cel.zasob.id];
      if (z.zaTrafienie) this.dodajZasob(cel, z.zaTrafienie);
      this.kradziezZycia(cel, obrazenia);
      this.sprawdzProgiWroga(atakujacy);
      return;
    }

    // Cien w akcji: szansa na darmowy cios po uniku
    const szansa = Bonusy.mod('szansaCiosuPoUniku');
    if (szansa > 0 && Math.random() < szansa && atakujacy.hp > 0) {
      UI.dziennik('Wychodzisz z uniku prosto w cios!', 'krytyk');
      this.wykonajAtak(cel, atakujacy, UMIEJETNOSCI[cel.atakPodstawowy], true);
    }
  },

  // ---------- statusy ----------

  nalozZUmiejetnosci(atakujacy, cel, um, l) {
    if (um.nakladaStatus === 'roztrzaskanie') {
      this.nalozStatus(cel, 'roztrzaskanie', l.oslabienieObrony, l.turyDzialania);
    }
    if (um.nakladaStatus === 'krwawienie') {
      this.nalozStatus(cel, 'krwawienie', l.obrazeniaKrwawienia, l.turyDzialania);
    }
    if (um.nakladaStatus === 'podpalenie') {
      const moc = l.obrazeniaPodpalenia + (atakujacy.czyGracz ? Bonusy.mod('mocStatusowZywiolowych') : 0);
      const tury = l.turyDzialania + (atakujacy.czyGracz ? Bonusy.mod('turyStatusowZywiolowych') : 0);
      this.nalozStatus(cel, 'podpalenie', moc, tury);

      // Piromancja: ogien przeskakuje na kolejne cele.
      if (atakujacy.czyGracz) {
        const skoki = Bonusy.mod('rozprzestrzenieniePodpalenia');
        if (skoki > 0) {
          this.zywi().filter(w => w !== cel).slice(0, skoki).forEach(w => {
            UI.dziennik(`Ogień przeskakuje na ${w.nazwa}.`, 'status');
            this.nalozStatus(w, 'podpalenie', moc, tury);
          });
        }
      }
    }
    if (um.nakladaStatus === 'porazenie') {
      this.nalozStatus(cel, 'porazenie', l.oslabienieCelnosci, l.turyDzialania);
      if (l.szansaOgluszenia > 0 && Math.random() < l.szansaOgluszenia) {
        UI.dziennik(`${cel.nazwa} zastyga porażony!`, 'krytyk');
        this.nalozStatus(cel, 'ogluszenie', 1, 2);
      }
    }
    if (um.nakladaStatus === 'wychlodzenie') {
      const moc = l.oslabienieZrecznosci + Bonusy.mod('mocStatusowZywiolowych');
      this.nalozStatus(cel, 'wychlodzenie', moc, l.turyDzialania);

      // Ranga 3 Lodowej strzaly: szansa, ze mroz calkiem unieruchomi.
      if (l.szansaZamrozenia > 0 && Math.random() < l.szansaZamrozenia) {
        UI.dziennik(`${cel.nazwa} zamarza w pół ruchu!`, 'krytyk');
        this.nalozStatus(cel, 'ogluszenie', 1, 2);
      }
    }
    if (um.nakladaStatus === 'usidlenie') {
      this.nalozStatus(cel, 'usidlenie', 1, l.turyDzialania);
      UI.dziennik(`${cel.nazwa} wpada w sidła!`, 'status');
    }
    if (um.nakladaStatus === 'ogluszenie') {
      this.nalozStatus(cel, 'ogluszenie', 1, l.turyOgluszenia);
    }
    if (um.nakladaStatus === 'odslona') {
      this.nalozStatus(atakujacy, 'odslona', l.karaObrony, l.turyKary);
    }
    if (um.nakladaStatus === 'zatrucie') {
      // Jad rosnie z Sila truciciela i z pasywu "Jad w zylach".
      const moc = l.obrazeniaZatrucia
                + Math.floor(atakujacy.cechy.sila * (l.skalowanieOdSily || 0))
                + (atakujacy.czyGracz ? Bonusy.mod('obrazeniaTrucizny') : 0);
      const tury = l.turyDzialania + (atakujacy.czyGracz ? Bonusy.mod('turyTrucizny') : 0);
      this.nalozStatus(cel, 'zatrucie', moc, tury, l.maksStackow);

      // Rozprzestrzenienie: jad przeskakuje na kolejne cele w watasze.
      if (atakujacy.czyGracz) {
        const skoki = Bonusy.mod('rozprzestrzenienieTrucizny');
        if (skoki > 0) {
          this.zywi().filter(w => w !== cel).slice(0, skoki).forEach(w => {
            UI.dziennik(`Jad przeskakuje na ${w.nazwa}.`, 'status');
            this.nalozStatus(w, 'zatrucie', moc, tury, l.maksStackow);
          });
        }
      }
    }
  },

  nalozStatus(cel, idStatusu, moc, tury, maksStackow) {
    const def = STATUSY[idStatusu];
    if (!def) return;

    // Kamien nie krwawi - golem ignoruje Krwawienie.
    if (idStatusu === 'krwawienie' && cel.odpornyNaKrwawienie) {
      UI.dziennik(`${cel.nazwa} nie ma z czego krwawić.`, 'pudlo');
      return;
    }

    // Nie da sie zatruc kogos odpornego na Nature.
    if (idStatusu === 'zatrucie' && (cel.odpornosci || []).includes('natura')) {
      UI.dziennik(`${cel.nazwa} jest odporny na trucizny.`, 'pudlo');
      return;
    }

    const istniejacy = cel.statusy.find(s => s.id === idStatusu);

    if (istniejacy && def.stackowalny) {
      istniejacy.stacki = Math.min(maksStackow || 99, (istniejacy.stacki || 1) + 1);
      istniejacy.tury = Math.max(istniejacy.tury, tury);
      istniejacy.moc = Math.max(istniejacy.moc, moc);
      UI.dziennik(`${def.nazwa} narasta na ${cel.nazwa} — ${istniejacy.stacki} stacki.`, 'status');
      return;
    }
    if (istniejacy) {
      istniejacy.tury = Math.max(istniejacy.tury, tury);
      istniejacy.moc  = Math.max(istniejacy.moc, moc);
      return;
    }

    cel.statusy.push({ id: idStatusu, moc: moc, tury: tury, stacki: 1 });

    if (def.rodzaj === 'oslabienie' && !def.pomijaTure) {
      UI.dziennik(`${def.nazwa}: ${cel.nazwa} — ${def.opisKrotki} na ${tury} tury.`, 'status');
    }
  },

  tykajStatusy(postac, czyGracz) {
    if (!postac.statusy.length) return;

    // Regeneracja i gojenie w formie zwierzecej
    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def.leczenieNaTure && postac.hp > 0) this.ulecz(postac, s.moc, def.nazwa);
      if (def.forma && postac.czyGracz) {
        const regen = Bonusy.mod('regenWFormie');
        if (regen > 0) this.ulecz(postac, regen, 'Dzika krew');
      }
    });

    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (!def.obrazeniaNaTure) return;

      let obrazenia = s.moc * (s.stacki || 1);
      if (!def.omijaPancerz) obrazenia = this.poPancerzu(obrazenia, this.obronaPostaci(postac));
      obrazenia = Math.max(1, Math.round(obrazenia));

      postac.hp = Math.max(0, postac.hp - obrazenia);
      UI.dziennik(
        czyGracz ? `${def.nazwa} zabiera Ci ${obrazenia} HP.`
                 : `${def.nazwa}: ${postac.nazwa} traci ${obrazenia} HP.`,
        czyGracz ? 'cios-wroga' : 'status'
      );
    });

    // Smiertelna dawka: zatrucie od gracza nie odlicza czasu
    const trwaleZatrucie = !czyGracz && Bonusy.mod('trwaleZatrucie') > 0;

    postac.statusy.forEach(s => {
      if (trwaleZatrucie && s.id === 'zatrucie') return;
      s.tury--;
    });

    postac.statusy.filter(s => s.tury <= 0).forEach(s => {
      const def = STATUSY[s.id];
      UI.dziennik(czyGracz ? `${def.nazwa} mija.` : `${def.nazwa} mija u ${postac.nazwa}.`, 'cichy');
    });

    postac.statusy = postac.statusy.filter(s => s.tury > 0);

    // Progi szału i faz mają tylko wrogowie — przywołania ich nie mają.
    if (!czyGracz && postac.ai) this.sprawdzProgiWroga(postac);
  },

  // Pancerz zdejmuje obrazenia, ale nigdy nie zdejmuje calego ciosu.
  // Bez gornego limitu wystarczylo kupic komplet zbroi, zeby slabsi
  // przeciwnicy zadawali minimalne 1 obrazenie i walka traci sens.
  // Limit jest UDZIALEM w sile ciosu: w mocny cios pancerz wchlania
  // duzo, w slaby — proporcjonalnie mniej.
  poPancerzu(obrazenia, obrona) {
    const zdejmuje = obrona * CONFIG.walka.redukcjaZaPunktObrony;
    const limit = obrazenia * CONFIG.walka.maksUdzialPancerza;
    return obrazenia - Math.min(zdejmuje, limit);
  },

  obronaPostaci(postac) {
    let obrona = postac.cechy.obrona + (postac.obronaSprzetu !== undefined
      ? postac.obronaSprzetu
      : (postac.pancerz ? postac.pancerz.obrona : 0));
    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def && def.modyfikatorObrony) obrona += def.modyfikatorObrony * s.moc;
    });
    return Math.max(0, obrona);
  },

  // ---------- zasoby i koszty ----------

  // Gracz korzysta z liczb podbitych rangami drzewka, wrogowie z surowego CONFIG.
  liczbyDla(postac, um) {
    return postac.czyGracz ? Drzewko.liczbyAkcji(um.id) : (CONFIG.akcje[um.id] || {});
  },

  zaplac(postac, um) {
    const l = this.liczbyDla(postac, um);
    if (l.kosztCaleKombo) {
      postac.__zuzyteKombo = postac.zasob.wartosc;
      postac.zasob.wartosc = 0;
      return;
    }
    if (l.koszt) postac.zasob.wartosc -= l.koszt;
  },

  dodajZasob(postac, ile) {
    if (!postac.zasob) return 0;
    const przed = postac.zasob.wartosc;
    postac.zasob.wartosc = Math.min(postac.zasob.max, Math.round(postac.zasob.wartosc + ile));
    return postac.zasob.wartosc - przed;
  },

  dlaczegoNieMozna(postac, um) {
    if (um.typ === 'eliksir') {
      return Bohater.razemEliksirow() > 0 ? null : 'Nie masz już eliksirów.';
    }

    const l = this.liczbyDla(postac, um);

    if (l.kosztCaleKombo && postac.zasob.wartosc < (l.minimumKombo || 1)) {
      return `${um.nazwa} wymaga ${l.minimumKombo || 1} pkt Kombo.`;
    }
    if (!l.kosztCaleKombo && (l.koszt || 0) > postac.zasob.wartosc) {
      return `Za mało: ${postac.zasob.nazwa} na ${um.nazwa}.`;
    }
    if (l.uzyciNaWalke !== undefined && (postac.zuzycia[um.id] || 0) >= l.uzyciNaWalke) {
      return `${um.nazwa} — brak użyć w tej walce.`;
    }
    return null;
  },

  zapiszZuzycie(postac, um) {
    if (this.liczbyDla(postac, um).uzyciNaWalke === undefined) return;
    postac.zuzycia[um.id] = (postac.zuzycia[um.id] || 0) + 1;
  },

  pozostaleUzycia(postac, um) {
    const l = this.liczbyDla(postac, um);
    if (l.uzyciNaWalke === undefined) return null;
    return l.uzyciNaWalke - (postac.zuzycia[um.id] || 0);
  },

  // ---------- losowanie ----------

  czyTrafil(atakujacy, cel) {
    const przewaga = atakujacy.cechy.atak - this.zrecznoscEfektywna(cel);
    let szansa = CONFIG.walka.celnoscBazowa + przewaga * CONFIG.walka.celnoscZaPunktPrzewagi;

    if (atakujacy.bron && atakujacy.bron.bonusCelnosci) szansa += atakujacy.bron.bonusCelnosci;
    if (cel.czyGracz) szansa -= Bonusy.mod('bonusUniku');
    if (cel.trudnaDoTrafienia) szansa -= cel.trudnaDoTrafienia;

    atakujacy.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (def && def.modyfikatorCelnosci) szansa += def.modyfikatorCelnosci * s.moc;
    });

    szansa = Math.min(CONFIG.walka.celnoscMax, Math.max(CONFIG.walka.celnoscMin, szansa));
    return Math.random() < szansa;
  },

  czyKrytyk(atakujacy, um, l) {
    const ukryty = atakujacy.statusy.find(s => STATUSY[s.id].gwarantowanyKrytyk && !s.krytZuzyty);
    if (ukryty) { ukryty.krytZuzyty = true; return true; }

    let szansa = CONFIG.walka.szansaKrytyka + (l.bonusSzansyKrytyka || 0);
    if (atakujacy.bron && atakujacy.bron.bonusKrytyka) szansa += atakujacy.bron.bonusKrytyka;
    if (atakujacy.czyGracz) {
      szansa += Bonusy.mod('szansaKrytyka');
      atakujacy.statusy.forEach(s => {
        if (STATUSY[s.id].bonusKrytyka && s.liczby) szansa += s.liczby.bonusKrytyka || 0;
      });
    }
    if (atakujacy.ai && atakujacy.ai.bonusKrytyka) szansa += atakujacy.ai.bonusKrytyka;
    return Math.random() < szansa;
  },

  mnoznikKrytyka(atakujacy) {
    return CONFIG.walka.mnoznikKrytyka
         + (atakujacy.czyGracz ? Bonusy.mod('mnoznikKrytyka') : 0);
  },

  losujObrazenia(atakujacy) {
    // Mag i druid czerpią moc z Woli, reszta z Siły.
    const cecha = atakujacy.cechaObrazen || 'sila';
    const baza = atakujacy.cechy[cecha] + (atakujacy.bron ? atakujacy.bron.obrazenia : 0);
    const r = CONFIG.walka.rozrzutObrazen;
    return baza * (1 - r) + Math.random() * (baza * 2 * r);
  },

  // ---------- koniec ----------

  sprawdzKoniec() {
    if (this.stan.koniec) return true;

    // Wygrywasz dopiero, gdy padnie CAŁA wataha.
    if (this.zywi().length === 0) {
      const uczta = Bonusy.mod('leczenieZaZwyciestwo');
      if (uczta > 0) this.ulecz(this.stan.gracz, Math.round(this.stan.gracz.maxHp * uczta), 'Uczta');

      Bohater.stan.hp = this.stan.gracz.hp;
      // W prologu nie ma się gdzie leczyć, więc po wygranej opatrują Cię sami.
      this.stan.wPelniSil = Bohater.poWalcePrologu();
      Bohater.stan.czasOstatniejRegeneracji = Date.now();
      this.stan.nagroda = Bohater.zapiszNagrode(this.opisSpotkania());

      this.zakoncz('wygrana', this.stan.wataha
        ? `Ostatni przeciwnik pada. Wataha rozbita.`
        : `${this.stan.wrogowie[0].nazwa} pada na piach. Wygrałeś.`);
      return true;
    }

    if (this.stan.gracz.hp <= 0) {
      Bohater.stan.hp = CONFIG.ekonomia.hpPoPrzegranej;
      Bohater.stan.czasOstatniejRegeneracji = Date.now();
      this.zakoncz('przegrana', 'Padasz na kolana. Tłum wyje.');
      return true;
    }
    return false;
  },

  // Do zapisu nagrody: wataha to suma lupow calego skladu.
  opisSpotkania() {
    const wataha = (typeof WATAHY !== 'undefined') ? WATAHY[this.stan.spotkanie] : null;
    if (!wataha) return WROGOWIE[this.stan.spotkanie];

    const suma = { zloto: 0, xp: 0, materialy: {}, esencje: {} };
    wataha.sklad.forEach(id => {
      const n = WROGOWIE[id].nagroda;
      suma.zloto += n.zloto;
      suma.xp += n.xp;
      Object.entries(n.materialy || {}).forEach(([k, v]) => { suma.materialy[k] = (suma.materialy[k] || 0) + v; });
      Object.entries(n.esencje || {}).forEach(([k, v]) => { suma.esencje[k] = (suma.esencje[k] || 0) + v; });
    });

    return { id: wataha.id, nazwa: wataha.nazwa, ranga: 0, nagroda: suma };
  },

  zakoncz(wynik, tekst) {
    this.stan.koniec = true;
    this.stan.wynik = wynik;
    this.stan.czekamNaGracza = false;
    Zapis.zapisz();
    UI.dziennik(tekst, wynik);
    UI.odswiez();
    UI.koniecWalki(wynik);
  }
};
