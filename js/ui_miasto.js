// ============================================================
//  INTERFEJS MIASTA — hub, sklep, kuźnia, gospoda
//  Osobny plik, żeby ui.js (walka) nie spuchł.
// ============================================================

const Miasto = {

  el: {},

  start() {
    const id = x => document.getElementById(x);
    this.el = {
      ekran: id('ekran-miasta'),
      naglowek: id('miasto-naglowek'),
      budynki: id('miasto-budynki'),
      panel: id('miasto-panel'),
      panelTytul: id('panel-tytul'),
      panelTresc: id('panel-tresc'),
      panelZamknij: id('panel-zamknij')
    };
    this.el.panelZamknij.addEventListener('click', () => this.zamknijPanel());
  },

  // ---------- hub ----------

  pokaz() {
    Bohater.odswiezRegeneracje();
    this.rysujNaglowek();
    this.rysujBudynki();
    this.el.ekran.classList.add('widoczny');
  },

  schowaj() { this.el.ekran.classList.remove('widoczny'); },

  // Na mapie zostaje sam portret bohatera i sakiewka — reszta siedzi
  // w jego ekranie, otwieranym kliknięciem w portret.
  rysujNaglowek() {
    const b = Bohater.stan;
    this.el.naglowek.innerHTML = '';
    if (this.el.panel.classList.contains('widoczny') && this.otwartyPanel === 'bohater') {
      this.panel_bohater();   // odśwież zawartość, gdy ekran bohatera jest otwarty
    }
  },

  htmlBohatera() {
    const b = Bohater.stan;
    const maxHp = Bohater.maxHp();
    const procentHp = (b.hp / maxHp) * 100;
    const doNast = Bohater.xpDoNastepnegoPoziomu();
    const minut = Bohater.minutDoPelnegoHp();

    const materialy = Object.keys(b.materialy).filter(k => b.materialy[k] > 0);
    const listaMat = materialy.length
      ? materialy.map(k => `<span class="material">${UI.ikonaMaterialu(k, MATERIALY[k])} ${MATERIALY[k].nazwa} ${b.materialy[k]}</span>`).join('')
      : '<span class="material pusty">brak materiałów</span>';

    return `
      <div class="bohater-glowa">
        <span class="bohater-zloto">🪙 ${b.zloto} złota</span>
      </div>

      <div class="pasek-tlo pasek-hp">
        <div class="pasek-wypelnienie hp ${procentHp <= 30 ? 'nisko' : ''}" style="width:${procentHp}%"></div>
        <span class="pasek-tekst">${b.hp} / ${maxHp} HP</span>
      </div>
      <p class="regen-info">${minut > 0
        ? `Rany goją się same — pełnia za ${minut} min.`
        : 'Jesteś w pełni sił.'}</p>

      <div class="pasek-tlo pasek-xp">
        <div class="pasek-wypelnienie xp" style="width:${(b.xp / doNast) * 100}%"></div>
        <span class="pasek-tekst">XP ${b.xp} / ${doNast}</span>
      </div>

      <div class="zakladki">
        ${this.ZAKLADKI.map(([id, ikona, nazwa]) => `
          <button class="zakladka ${this.zakladkaBohatera === id ? 'aktywna' : ''}"
                  onclick="Miasto.zakladka('${id}')">
            <span class="zakladka-ikona">${ikona}</span>
            <span class="zakladka-nazwa">${nazwa}</span>
            ${this.czyKropka(id) ? '<span class="zakladka-kropka"></span>' : ''}
          </button>`).join('')}
      </div>

      <div class="zakladka-tresc">${this['zakladka_' + this.zakladkaBohatera]()}</div>

      <p class="zapis-info">Postęp zapisuje się sam.
        <button class="link-nowa-gra" onclick="Gra.nowaGra()">Zacznij od nowa</button></p>`;
  },

  ZAKLADKI: [
    ['ekwipunek',    '🛡', 'Ekwipunek'],
    ['cechy',        '💪', 'Cechy'],
    ['umiejetnosci', '🌿', 'Umiejętności'],
    ['zasoby',       '🪙', 'Zasoby']
  ],

  zakladkaBohatera: 'ekwipunek',

  // Zielona kropka na zakładce = masz tam coś do wydania.
  czyKropka(idZakladki) {
    const b = Bohater.stan;
    if (idZakladki === 'cechy')        return b.punktyDoRozdania > 0;
    if (idZakladki === 'umiejetnosci') return b.pu > 0;
    return false;
  },

  zakladka(id) {
    this.zakladkaBohatera = id;
    this.panel_bohater();
  },

  // Gniazda rozmieszczone wokół postaci. „gotowe: false" znaczy, że tej
  // części ekwipunku gra jeszcze nie obsługuje.
  GNIAZDA: [
    { id: 'helm',        nazwa: 'Hełm',        strona: 'lewo',  gotowe: true },
    { id: 'pancerz',     nazwa: 'Napierśnik',  strona: 'lewo',  gotowe: true  },
    { id: 'nagolenniki', nazwa: 'Nagolenniki', strona: 'lewo',  gotowe: true },
    { id: 'bron',        nazwa: 'Broń',        strona: 'prawo', gotowe: true  },
    { id: 'tarcza',      nazwa: 'Tarcza',      strona: 'prawo', gotowe: true },
    { id: 'artefakt',    nazwa: 'Artefakt',    strona: 'prawo', gotowe: true  }
  ],

  gniazdo: null,   // które gniazdo jest otwarte pod postacią

  // Co siedzi w gnieździe: przedmiot albo null.
  wGniezdzie(idGniazda) {
    if (idGniazda === 'bron')     return Bohater.bron();
    if (idGniazda === 'pancerz')  return Bohater.pancerz();
    if (idGniazda === 'artefakt') return Artefakty.zalozony();
    return Bohater.czesc(idGniazda);   // helm, tarcza, nagolenniki
  },

  zakladka_ekwipunek() {
    const b = Bohater.stan;
    const grafiki = typeof GRAFIKI_POSTACI !== 'undefined' ? GRAFIKI_POSTACI[b.klasa] : null;

    const gniazdoHtml = g => {
      const p = this.wGniezdzie(g.id);
      const ikona = p
        ? (g.id === 'artefakt' ? UI.ikonaArtefaktu(p) : UI.ikonaPrzedmiotu(p))
        : (g.gotowe ? '◻' : '🔒');
      return `
        <button class="gniazdo ${this.gniazdo === g.id ? 'wybrane' : ''} ${p ? '' : 'puste'} ${g.gotowe ? '' : 'niegotowe'}"
                onclick="Miasto.wybierzGniazdo('${g.id}')" title="${g.nazwa}">
          <span class="gniazdo-ikona">${ikona}</span>
          <span class="gniazdo-nazwa">${g.nazwa}</span>
        </button>`;
    };

    return `
      <div class="postac-ekwipunek">
        <div class="kolumna-gniazd">${this.GNIAZDA.filter(g => g.strona === 'lewo').map(gniazdoHtml).join('')}</div>
        <div class="sylwetka-ekwipunku">
          ${grafiki && grafiki.portret
            ? `<img class="sylwetka-obraz" data-ikona="${grafiki.portret}" alt="">`
            : `<span class="sylwetka-zapas">${Bohater.klasa().ikona}</span>`}
        </div>
        <div class="kolumna-gniazd">${this.GNIAZDA.filter(g => g.strona === 'prawo').map(gniazdoHtml).join('')}</div>
      </div>

      ${this.gniazdo ? this.htmlZawartosciGniazda(this.gniazdo) : `
        <p class="zakladka-info">Kliknij gniazdo, żeby zobaczyć, co masz na to miejsce.</p>`}

      <div class="bohater-ekwipunek">
        <span class="ekwip">🧪 Eliksiry: ${b.eliksiry}</span>
      </div>`;
  },

  // Lista rzeczy pasujących do wybranego gniazda: założ albo sprzedaj.
  htmlZawartosciGniazda(idGniazda) {
    const g = this.GNIAZDA.find(x => x.id === idGniazda);
    if (!g.gotowe) {
      return `<div class="gniazdo-panel">
                <h2 class="sekcja-tytul">${g.nazwa}</h2>
                <p class="zakladka-info">Ta część ekwipunku pojawi się w grze później.</p>
              </div>`;
    }

    if (idGniazda === 'artefakt') {
      const a = Artefakty.zalozony();
      return `<div class="gniazdo-panel">
                <h2 class="sekcja-tytul">Artefakt</h2>
                <p class="zakladka-info">${a
                  ? `${a.nazwa} — ${a.efekt}. Zmieniasz je u czarodzieja.`
                  : 'Artefakty zdobywasz za bossów, zakładasz u czarodzieja.'}</p>
              </div>`;
    }

    const typ = idGniazda;   // 'bron' albo 'pancerz'
    const moje = Bohater.stan.posiadane
      .map(id => PRZEDMIOTY[id])
      .filter(p => p && p.typ === typ && Bohater.czyPasuje(p));

    return `
      <div class="gniazdo-panel">
        <h2 class="sekcja-tytul">${g.nazwa} — co masz</h2>
        ${moje.map(p => {
          const wGnie = this.wGniezdzie(idGniazda);
          const naSobie = !!wGnie && wGnie.id === p.id;
          const cena = Bohater.cenaSprzedazy(p.id);
          return `
            <div class="oferta ${naSobie ? 'zalozony' : ''}">
              <span class="oferta-ikona">${UI.ikonaPrzedmiotu(p)}</span>
              <span class="oferta-tresc">
                <strong>${p.nazwa}</strong>
                <span>${typ === 'bron' ? `+${p.obrazenia} obrażeń` : `+${p.obrona} Obrony`}${p.opis ? ` — ${p.opis}` : ''}</span>
              </span>
              ${naSobie
                ? '<span class="oferta-kup wtorny">Na sobie</span>'
                : `<span class="gniazdo-akcje">
                     <button class="oferta-kup wtorny" onclick="Miasto.zaloz('${p.id}')">Załóż</button>
                     ${Bohater.czyMoznaSprzedac(p.id)
                       ? `<button class="oferta-kup sprzedaj" onclick="Miasto.sprzedaj('${p.id}')">🪙 ${cena}</button>`
                       : ''}
                   </span>`}
            </div>`;
        }).join('')}
      </div>`;
  },

  wybierzGniazdo(id) {
    this.gniazdo = this.gniazdo === id ? null : id;
    this.panel_bohater();
  },

  sprzedaj(idPrzedmiotu) {
    if (!Bohater.sprzedaj(idPrzedmiotu)) return;
    Zapis.zapisz();
    this.panel_bohater();
    this.rysujBudynki();   // sakiewka na mapie
  },

  zakladka_cechy() {
    const b = Bohater.stan;
    const opisy = {
      sila:      ['Siła',      'obrażenia Twoich ciosów'],
      atak:      ['Atak',      'celność — jak często trafiasz'],
      obrona:    ['Obrona',    'ile obrażeń zdejmuje zbroja'],
      zrecznosc: ['Zręczność', 'inicjatywa i unik'],
      witalnosc: ['Witalność', 'maksymalne HP'],
      wola:      ['Wola',      'odporność na magię i klątwy']
    };

    return `
      <div class="cechy-siatka">
        ${Object.entries(opisy).map(([klucz, [nazwa, opis]]) => {
          // Obrona to jedyna cecha, ktora rosnie od sprzetu — pokazujemy sume.
          const zeSprzetu = klucz === 'obrona' ? Bohater.obronaSprzetu() : 0;
          return `
          <div class="cecha-kafel">
            <span class="cecha-liczba">${b.cechy[klucz] + zeSprzetu}</span>
            <span class="cecha-opis"><strong>${nazwa}</strong><span>${
              zeSprzetu > 0 ? `${b.cechy[klucz]} z cech + ${zeSprzetu} ze sprzętu` : opis
            }</span></span>
          </div>`;
        }).join('')}
      </div>
      ${b.punktyDoRozdania > 0
        ? `<button class="przycisk-awansu" onclick="UI.pokazAwans()">Rozdaj ${b.punktyDoRozdania} pkt cech</button>`
        : '<p class="zakladka-info">Punkty cech dostajesz za każdy poziom.</p>'}`;
  },

  zakladka_umiejetnosci() {
    const b = Bohater.stan;
    const podstawowy = UMIEJETNOSCI[Bohater.klasa().atakPodstawowy];

    const kafel = (um, etykieta) => um
      ? `<div class="slot-ekw">
           <span class="slot-ikona">${UI.ikona('umiejetnosci', um.id, um.ikona, 'ikona-przedmiotu')}</span>
           <span class="slot-tresc">
             <span class="slot-gniazdo">${etykieta}</span>
             <strong>${um.nazwa}</strong>
             <span class="slot-efekt">${UI.etykietaKosztu(um) || 'bez kosztu'}</span>
           </span>
         </div>`
      : `<div class="slot-ekw pusty">
           <span class="slot-ikona">◻</span>
           <span class="slot-tresc">
             <span class="slot-gniazdo">${etykieta}</span>
             <strong>—</strong>
             <span class="slot-efekt">Wybierz w drzewku</span>
           </span>
         </div>`;

    return `
      <div class="sloty-ekwipunku">
        ${kafel(podstawowy, 'Atak podstawowy')}
        ${b.sloty.map((id, i) => kafel(id ? UMIEJETNOSCI[id] : null, `Slot ${i + 1}`)).join('')}
      </div>
      <button class="przycisk-drzewka" onclick="EkranDrzewka.pokaz()">
        🌿 Drzewko umiejętności${b.pu > 0 ? ` — ${b.pu} PU do wydania` : ''}
      </button>`;
  },

  zakladka_zasoby() {
    const b = Bohater.stan;
    const materialy = Object.keys(b.materialy).filter(k => b.materialy[k] > 0);
    const esencje = Object.keys(b.esencje || {}).filter(k => b.esencje[k] > 0);

    return `
      <h2 class="sekcja-tytul">Materiały — do kucia w kuźni</h2>
      <div class="bohater-materialy">${materialy.length
        ? materialy.map(k => `<span class="material">${UI.ikonaMaterialu(k, MATERIALY[k])} ${MATERIALY[k].nazwa} ${b.materialy[k]}</span>`).join('')
        : '<span class="material pusty">brak materiałów</span>'}</div>

      <h2 class="sekcja-tytul">Esencje — z bestii, na broń żywiołową</h2>
      <div class="bohater-materialy">${esencje.length
        ? esencje.map(k => `<span class="material esencja">${UI.ikonaMaterialu(k, ESENCJE[k])} ${ESENCJE[k].nazwa} ${b.esencje[k]}</span>`).join('')
        : '<span class="material pusty">brak esencji</span>'}</div>`;
  },

  // Jeden slot ekwipunku: ikona przedmiotu, nazwa gniazda i co daje.
  slot(gniazdo, przedmiot, efekt, dodatkowa) {
    const ikona = gniazdo === 'Artefakt'
      ? UI.ikonaArtefaktu(przedmiot)
      : UI.ikonaPrzedmiotu(przedmiot);
    return `
      <div class="slot-ekw ${dodatkowa || ''}">
        <span class="slot-ikona">${ikona}</span>
        <span class="slot-tresc">
          <span class="slot-gniazdo">${gniazdo}</span>
          <strong>${przedmiot.nazwa}</strong>
          <span class="slot-efekt">${efekt}</span>
        </span>
      </div>`;
  },

  slotPusty(gniazdo, uwaga) {
    return `
      <div class="slot-ekw pusty">
        <span class="slot-ikona">◻</span>
        <span class="slot-tresc">
          <span class="slot-gniazdo">${gniazdo}</span>
          <strong>—</strong>
          <span class="slot-efekt">${uwaga}</span>
        </span>
      </div>`;
  },

  // Ekran bohatera: wszystko, co kiedyś wisiało nad mapą.
  panel_bohater() {
    this.el.panelTresc.innerHTML = this.htmlBohatera();
  },

  // Mapa okolicy: budynki stoją na polanach, klika się wprost w nie.
  // Pozycje (w procentach mapy) są w MAPA_PUNKTY w js/data/grafiki.js.
  rysujBudynki() {
    this.el.budynki.innerHTML = '';
    this.el.budynki.classList.add('mapa');

    Object.values(BUDYNKI).forEach(bud => {
      const otwarty = Bohater.czyBudynekOtwarty(bud.id);
      const punkt = (typeof MAPA_PUNKTY !== 'undefined' && MAPA_PUNKTY[bud.id]) || { x: 50, y: 50 };

      const b = document.createElement('button');
      b.className = 'budynek' + (otwarty ? '' : ' zamkniety');
      b.style.left = punkt.x + '%';
      b.style.top  = punkt.y + '%';
      b.disabled = !otwarty;
      b.title = otwarty ? bud.opis : `Otworzy się po pokonaniu ${bud.odblokowanePoRandze} rang`;
      b.innerHTML = `
        <span class="budynek-ikona">${UI.ikonaBudynku(bud)}</span>
        <span class="budynek-etykieta">${bud.nazwa}${otwarty ? '' : ' 🔒'}</span>`;

      if (otwarty) b.addEventListener('click', () => this.wejdz(bud.id));
      this.el.budynki.appendChild(b);
    });

    this.el.budynki.appendChild(this.przyciskBohatera());
  },

  // Portret w rogu mapy — wejście do ekranu bohatera (jak awatar w mobilnych RPG).
  przyciskBohatera() {
    const b = Bohater.stan;
    const grafiki = typeof GRAFIKI_POSTACI !== 'undefined' ? GRAFIKI_POSTACI[b.klasa] : null;

    const p = document.createElement('button');
    p.className = 'portret-mapy';
    p.title = 'Bohater: ekwipunek, drzewko, postępy';
    p.innerHTML = `
      <span class="portret-ramka">
        <img class="portret-obraz" alt="">
        <span class="portret-zapas">${Bohater.klasa().ikona}</span>
        <span class="portret-poziom">${b.poziom}</span>
      </span>
      <span class="portret-sakiewka">🪙 ${b.zloto}</span>
      ${b.punktyDoRozdania > 0 || b.pu > 0 ? '<span class="portret-kropka"></span>' : ''}`;

    if (grafiki && grafiki.portret) {
      Sylwetki.ustaw(p.querySelector('.portret-obraz'), grafiki.portret)
        .then(ok => { if (ok) p.querySelector('.portret-ramka').classList.add('z-portretem'); });
    }
    p.addEventListener('click', () => this.wejdz('bohater'));
    return p;
  },

  otwartyPanel: null,

  wejdz(idBudynku) {
    if (idBudynku === 'arena') { Gra.pokazDrabine(); return; }

    this.otwartyPanel = idBudynku;
    this.el.panelTytul.textContent = idBudynku === 'bohater'
      ? `${Bohater.klasa().ikona}  ${Bohater.klasa().nazwa} · poziom ${Bohater.stan.poziom}`
      : BUDYNKI[idBudynku].ikona + '  ' + BUDYNKI[idBudynku].nazwa;

    this['panel_' + idBudynku]();
    this.el.panel.classList.add('widoczny');
  },

  zamknijPanel() {
    this.otwartyPanel = null;
    this.el.panel.classList.remove('widoczny');
    this.rysujNaglowek();
  },

  odswiezPanel(idBudynku) {
    this['panel_' + idBudynku]();
    this.rysujNaglowek();
    Zapis.zapisz();                 // kazdy zakup i nocleg zapisany
  },

  // ---------- GOSPODA ----------

  panel_gospoda() {
    const b = Bohater.stan;
    const maxHp = Bohater.maxHp();
    const koszt = Bohater.kosztGospody();
    const staC = b.zloto >= koszt;

    this.el.panelTresc.innerHTML = koszt === 0
      ? '<p class="panel-opis">Jesteś zdrowy jak byk. Karczmarz kręci głową: „Wracaj, jak cię poobijają."</p>'
      : `<p class="panel-opis">Miska gorącej strawy, czysta słoma i noc bez śnienia o arenie.
           Wracasz do pełni sił: <strong>${b.hp} → ${maxHp} HP</strong>.</p>
         <div class="oferta ${staC ? '' : 'niestac'}">
           <span class="oferta-ikona">🛏</span>
           <span class="oferta-tresc"><strong>Nocleg i opatrunek</strong><span>Pełne leczenie od ręki</span></span>
           <button class="oferta-kup" ${staC ? '' : 'disabled'} onclick="Miasto.odpocznij()">🪙 ${koszt}</button>
         </div>
         <p class="panel-uwaga">Możesz też po prostu poczekać — rany goją się same, za darmo.
           Gospoda kupuje czas, nie siłę.</p>`;
  },

  odpocznij() {
    if (Bohater.odpocznijWGospodzie()) this.odswiezPanel('gospoda');
  },

  // ---------- SKLEP ----------

  panel_sklep() {
    const b = Bohater.stan;
    const e = CONFIG.ekonomia.eliksir;

    const wiersze = Object.values(PRZEDMIOTY).filter(p => p.cena && Bohater.czyPasuje(p)).map(p => {
      const mamy = Bohater.ma(p.id);
      const zalozony = [b.bron, b.pancerz, b.helm, b.tarcza, b.nagolenniki].includes(p.id);
      const staC = b.zloto >= p.cena;

      let przycisk;
      if (zalozony)  przycisk = '<span class="oferta-stan">założone</span>';
      else if (mamy) przycisk = `<button class="oferta-kup wtorny" onclick="Miasto.zaloz('${p.id}')">Załóż</button>`;
      else           przycisk = `<button class="oferta-kup" ${staC ? '' : 'disabled'} onclick="Miasto.kup('${p.id}')">🪙 ${p.cena}</button>`;

      const statystyka = p.typ === 'bron'
        ? `+${p.obrazenia} obrażeń${p.bonusCelnosci ? `, +${Math.round(p.bonusCelnosci * 100)}% celności` : ''}`
        : `+${p.obrona} Obrony`;

      return `<div class="oferta ${mamy || staC ? '' : 'niestac'}">
                <span class="oferta-ikona">${UI.ikonaPrzedmiotu(p)}</span>
                <span class="oferta-tresc"><strong>${p.nazwa}</strong><span>${statystyka} — ${p.opis}</span></span>
                ${przycisk}
              </div>`;
    }).join('');

    const pelnyPlecak = b.eliksiry >= e.maksWPlecaku;
    const eliksirStac = b.zloto >= e.cena;

    this.el.panelTresc.innerHTML = `
      <p class="panel-opis">Handlarz rozkłada towar na kocu. Nowy sprzęt zakładasz od razu.</p>
      ${wiersze}
      <div class="oferta ${pelnyPlecak || !eliksirStac ? 'niestac' : ''}">
        <span class="oferta-ikona">🧪</span>
        <span class="oferta-tresc">
          <strong>Mały eliksir (masz ${b.eliksiry}/${e.maksWPlecaku})</strong>
          <span>Leczy ${Math.round(e.leczenieProcentMaxHp * 100)}% HP — działa też w trakcie walki</span>
        </span>
        <button class="oferta-kup" ${pelnyPlecak || !eliksirStac ? 'disabled' : ''}
                onclick="Miasto.kupEliksir()">🪙 ${e.cena}</button>
      </div>
      ${this.sekcjaPremium()}`;
  },

  // ---------- KUPIEC ZZA MORZA (towar za klejnoty) ----------

  sekcjaPremium() {
    const b = Bohater.stan;

    const towar = Object.values(PRZEDMIOTY_PREMIUM)
      .filter(p => Bohater.czyPasuje(p))
      .map(p => {
        const mamy = Bohater.ma(p.id);
        const zalozony = [b.bron, b.pancerz, b.helm, b.tarcza, b.nagolenniki].includes(p.id);
        const stac = b.klejnoty >= p.klejnoty;

        let przycisk;
        if (zalozony)  przycisk = '<span class="oferta-stan">założone</span>';
        else if (mamy) przycisk = `<button class="oferta-kup wtorny" onclick="Miasto.zaloz('${p.id}')">Załóż</button>`;
        else           przycisk = `<button class="oferta-kup klejnot" ${stac ? '' : 'disabled'}
                                      onclick="Miasto.kupPremium('${p.id}')">💎 ${p.klejnoty}</button>`;

        const statystyka = p.typ === 'bron'
          ? `+${p.obrazenia} obrażeń${p.bonusCelnosci ? `, +${Math.round(p.bonusCelnosci * 100)}% celności` : ''}${p.bonusKrytyka ? `, +${Math.round(p.bonusKrytyka * 100)}% krytyka` : ''}`
          : `+${p.obrona} Obrony`;

        return `<div class="oferta ${mamy || stac ? '' : 'niestac'}">
                  <span class="oferta-ikona">${UI.ikonaPrzedmiotu(p)}</span>
                  <span class="oferta-tresc"><strong>${p.nazwa}</strong><span>${statystyka} — ${p.opis}</span></span>
                  ${przycisk}
                </div>`;
      }).join('');

    const paczki = PACZKI_KLEJNOTOW.map(p => `
      <div class="oferta niestac">
        <span class="oferta-ikona">💎</span>
        <span class="oferta-tresc">
          <strong>${p.nazwa} — ${p.klejnoty} 💎</strong>
          <span>${p.cena}${p.bonus ? ` · ${p.bonus} więcej` : ''}</span>
        </span>
        <span class="oferta-stan">wkrótce</span>
      </div>`).join('');

    return `
      <h2 class="sekcja-tytul">Kupiec zza morza · masz 💎 ${b.klejnoty}</h2>
      <p class="panel-opis">Towar, którego nie uświadczysz w Kapui. Klejnoty dostajesz
        za pierwsze pokonanie przeciwnika, za minibossy, za czempiona i za każdy awans.</p>
      ${towar}
      <h2 class="sekcja-tytul">Klejnoty za pieniądze</h2>
      ${paczki}
      <p class="panel-uwaga">Płatności podłączymy przy wydaniu na Androida.
        Na razie klejnoty zdobywasz wyłącznie grą.</p>`;
  },

  kupPremium(idPrzedmiotu) {
    if (Bohater.kupZaKlejnoty(idPrzedmiotu)) { Zapis.zapisz(); this.odswiezPanel('sklep'); }
  },

  kup(idPrzedmiotu)   { if (Bohater.kup(idPrzedmiotu)) this.odswiezPanel('sklep'); },
  zaloz(idPrzedmiotu) {
    if (!Bohater.zaloz(idPrzedmiotu)) return;
    Zapis.zapisz();
    this.odswiezPanel(this.otwartyPanel || 'sklep');   // dziala i w sklepie, i w ekranie bohatera
  },
  kupEliksir()        { if (Bohater.kupEliksir()) this.odswiezPanel('sklep'); },

  // ---------- PLAC TRENINGOWY ----------

  CECHY_TRENINGU: {
    sila:      ['Siła',      'obrażenia Twoich ciosów'],
    atak:      ['Atak',      'celność — jak często trafiasz'],
    obrona:    ['Obrona',    'ile obrażeń zdejmuje zbroja'],
    zrecznosc: ['Zręczność', 'inicjatywa i unik'],
    witalnosc: ['Witalność', 'maksymalne HP'],
    wola:      ['Wola',      'odporność na magię i klątwy']
  },

  // "135 min" czyta sie zle — pokazujemy godziny i minuty.
  czasSlownie(minuty) {
    if (minuty < 60) return `${minuty} min`;
    const h = Math.floor(minuty / 60), m = minuty % 60;
    return m ? `${h} godz. ${m} min` : `${h} godz.`;
  },

  panel_trening() {
    const b = Bohater.stan;

    // W trakcie treningu panel pokazuje tylko ten jeden, zeby nie kusic
    // klikaniem w cos, czego i tak nie da sie teraz zaczac.
    if (b.trening) {
      const [nazwa] = this.CECHY_TRENINGU[b.trening.cecha];
      const zostalo = Bohater.minutDoKonca();

      if (Bohater.czyTreningGotowy()) {
        this.el.panelTresc.innerHTML = `
          <p class="panel-opis">Trener kiwa głową. <strong>${nazwa}</strong> wyćwiczona.</p>
          <button class="przycisk-awansu" onclick="Miasto.odbierzTrening()">
            Odbierz +1 ${nazwa}
          </button>`;
        return;
      }

      const cena = Bohater.klejnotyNaSkrocenie();
      const stac = b.klejnoty >= cena;
      this.el.panelTresc.innerHTML = `
        <p class="panel-opis">Trenujesz <strong>${nazwa}</strong>.
          Zostało <strong>${this.czasSlownie(zostalo)}</strong>.
          Możesz zamknąć grę — czas leci dalej.</p>
        <div class="oferta ${stac ? '' : 'niestac'}">
          <span class="oferta-ikona">💎</span>
          <span class="oferta-tresc">
            <strong>Skróć czekanie</strong>
            <span>Kończy trening od razu. Masz 💎 ${b.klejnoty}</span>
          </span>
          <button class="oferta-kup klejnot" ${stac ? '' : 'disabled'}
                  onclick="Miasto.skrocTrening()">💎 ${cena}</button>
        </div>
        <div class="oferta niestac">
          <span class="oferta-ikona">📺</span>
          <span class="oferta-tresc">
            <strong>Obejrzyj reklamę</strong>
            <span>Skróci czekanie za darmo, kilka razy dziennie</span>
          </span>
          <span class="oferta-stan">wkrótce</span>
        </div>
        <p class="panel-uwaga">Reklamy podłączymy przy wydaniu na Androida.</p>`;
      return;
    }

    const wiersze = Object.entries(this.CECHY_TRENINGU).map(([klucz, [nazwa, opis]]) => {
      const koszt = Bohater.kosztTreningu(klucz);
      const minuty = Bohater.minutyTreningu(klucz);
      const stac = b.zloto >= koszt;

      return `
        <div class="oferta ${stac ? '' : 'niestac'}">
          <span class="oferta-ikona">${b.cechy[klucz]}</span>
          <span class="oferta-tresc">
            <strong>${nazwa} → ${b.cechy[klucz] + 1}</strong>
            <span>${opis} — ${minuty ? this.czasSlownie(minuty) : 'od ręki'}</span>
          </span>
          <button class="oferta-kup" ${stac ? '' : 'disabled'}
                  onclick="Miasto.trenuj('${klucz}')">🪙 ${koszt}</button>
        </div>`;
    }).join('');

    this.el.panelTresc.innerHTML = `
      <p class="panel-opis">Trener bierze złoto i czas. Im wyżej masz cechę,
        tym drożej i dłużej — ale rośnie na stałe, bez czekania na awans.</p>
      ${wiersze}
      <p class="panel-uwaga">Trenujesz jedną cechę naraz. Czas leci też przy wyłączonej grze.</p>`;
  },

  trenuj(cecha) {
    const wynik = Bohater.zacznijTrening(cecha);
    if (!wynik) return;
    Zapis.zapisz();
    this.odswiezPanel('trening');
    this.rysujBudynki();
  },

  odbierzTrening() {
    if (!Bohater.odbierzTrening()) return;
    Zapis.zapisz();
    this.odswiezPanel('trening');
    this.rysujBudynki();
  },

  skrocTrening() {
    if (!Bohater.skrocTreningKlejnotami()) return;
    Zapis.zapisz();
    this.odswiezPanel('trening');
  },

  // ---------- KUŹNIA ----------

  panel_kuznia() {
    const b = Bohater.stan;

    const przepisy = Object.values(PRZEPISY)
      .filter(p => !p.ulepszenie && !p.zEsencji && Bohater.czyPasuje(PRZEDMIOTY[p.przedmiot]))
      .map(przepis => {
      const p = PRZEDMIOTY[przepis.przedmiot];
      const mamy = Bohater.ma(p.id);
      const staC = Bohater.staC(przepis.koszt);

      const statystyka = p.typ === 'bron'
        ? `+${p.obrazenia} obrażeń${p.bonusKrytyka ? `, +${Math.round(p.bonusKrytyka * 100)}% krytyka` : ''}`
        : `+${p.obrona} Obrony`;

      return `<div class="oferta ${mamy || staC ? '' : 'niestac'}">
                <span class="oferta-ikona">${UI.ikonaPrzedmiotu(p)}</span>
                <span class="oferta-tresc">
                  <strong>${p.nazwa}</strong>
                  <span>${statystyka} — ${p.opis}</span>
                  <span class="koszt-materialow">${this.opisKosztu(przepis.koszt)}</span>
                </span>
                ${mamy ? '<span class="oferta-stan">wykute</span>'
                       : `<button class="oferta-kup" ${staC ? '' : 'disabled'} onclick="Miasto.wykuj('${przepis.id}')">Wykuj</button>`}
              </div>`;
    }).join('');

    const ulepsz = PRZEPISY.ulepszenieBroni;
    const poziom = b.ulepszenieBroni;
    let wierszUlepszenia;

    if (poziom >= ulepsz.maksPoziom) {
      wierszUlepszenia = `<div class="oferta">
          <span class="oferta-ikona">🔨</span>
          <span class="oferta-tresc"><strong>Ulepszenie broni</strong><span>Maksymalnie ulepszona (+${poziom})</span></span>
          <span class="oferta-stan">gotowe</span>
        </div>`;
    } else {
      const nast = ulepsz.poziomy[poziom];
      const staC = Bohater.staC(nast.koszt);
      wierszUlepszenia = `<div class="oferta ${staC ? '' : 'niestac'}">
          <span class="oferta-ikona">🔨</span>
          <span class="oferta-tresc">
            <strong>Ulepszenie broni +${poziom + 1}</strong>
            <span>${Bohater.bron().nazwa}: łącznie +${nast.bonusObrazen} obrażeń do broni</span>
            <span class="koszt-materialow">${this.opisKosztu(nast.koszt)}</span>
          </span>
          <button class="oferta-kup" ${staC ? '' : 'disabled'} onclick="Miasto.ulepsz()">Kuj</button>
        </div>`;
    }

    this.el.panelTresc.innerHTML = `
      <p class="panel-opis">Kowal patrzy na Twoje materiały. Tu powstaje najlepszy sprzęt regionu —
        za samo złoto go nie kupisz, trzeba go wyszarpać z areny.</p>
      ${przepisy}
      ${wierszUlepszenia}`;
  },

  opisKosztu(koszt) {
    const czesci = [];

    Object.entries(koszt.esencje || {}).forEach(([idE, ile]) => {
      const masz = Bohater.stan.esencje[idE] || 0;
      czesci.push(`<span class="${masz < ile ? 'brak' : 'ok'}">${UI.ikonaMaterialu(idE, ESENCJE[idE])} ${ile} (masz ${masz})</span>`);
    });
    Object.entries(koszt.materialy || {}).forEach(([idM, ile]) => {
      const masz = Bohater.stan.materialy[idM] || 0;
      czesci.push(`<span class="${masz < ile ? 'brak' : 'ok'}">${UI.ikonaMaterialu(idM, MATERIALY[idM])} ${ile} (masz ${masz})</span>`);
    });
    czesci.push(`<span class="${Bohater.stan.zloto >= (koszt.zloto || 0) ? 'ok' : 'brak'}">🪙 ${koszt.zloto || 0}</span>`);

    return czesci.join(' · ');
  },

  wykuj(idPrzepisu) { if (Bohater.wykuj(idPrzepisu)) this.odswiezPanel('kuznia'); },
  ulepsz()          { if (Bohater.ulepszBron()) this.odswiezPanel('kuznia'); },

  // ---------- CZARODZIEJ (artefakty) ----------

  panel_czarodziej() {
    const zalozony = Bohater.stan.artefakt;

    const wiersz = (a, kontekst) => {
      const mamy = Artefakty.ma(a.id);
      const naSobie = zalozony === a.id;

      let przyciski;
      if (naSobie) {
        przyciski = `<button class="oferta-kup wtorny" onclick="Miasto.zdejmijArtefakt()">Zdejmij</button>`;
      } else if (mamy) {
        przyciski = `<button class="oferta-kup" onclick="Miasto.zalozArtefakt('${a.id}')">Załóż</button>`;
      } else if (kontekst === 'sklep') {
        const staC = Bohater.stan.zloto >= a.cena;
        przyciski = `<button class="oferta-kup" ${staC ? '' : 'disabled'}
                       onclick="Miasto.kupArtefakt('${a.id}')">🪙 ${a.cena}</button>`;
      } else {
        przyciski = '';
      }

      return `<div class="oferta artefakt r-${a.rzadkosc} ${naSobie ? 'zalozony' : ''}">
                <span class="oferta-ikona">${UI.ikonaArtefaktu(a)}</span>
                <span class="oferta-tresc">
                  <strong>${a.nazwa} <span class="rzadkosc">${a.rzadkosc === 'rzadki' ? 'rzadki' : 'zwykły'}</span></strong>
                  <span class="artefakt-efekt">${a.efekt}</span>
                  <span>${a.opis}</span>
                </span>
                ${przyciski}
              </div>`;
    };

    const moje = Artefakty.posiadane().map(id => wiersz(ARTEFAKTY[id], 'moje')).join('');
    const naSprzedaz = Object.values(ARTEFAKTY)
      .filter(a => a.cena && !Artefakty.ma(a.id))
      .map(a => wiersz(a, 'sklep')).join('');

    this.el.panelTresc.innerHTML = `
      <p class="panel-opis">Czarodziej ogląda Twoje amulety pod światło.
        Artefakty działają pasywnie i <strong>zmieniasz je za darmo</strong> —
        eksperymentuj przed każdą walką.</p>

      <h2 class="pomoc-naglowek">Twoje artefakty ${zalozony ? '' : '— nic nie masz założone'}</h2>
      ${moje || '<p class="panel-uwaga">Jeszcze żadnego nie zdobyłeś. Wypadają z minibossów i elit.</p>'}

      <h2 class="pomoc-naglowek">Na sprzedaż</h2>
      ${naSprzedaz || '<p class="panel-uwaga">Czarodziej rozkłada ręce — wykupiłeś wszystko.</p>'}

      <h2 class="pomoc-naglowek">Oręż z esencji</h2>
      <p class="panel-uwaga">Broń żywiołowa <strong>omija pancerz</strong>, ale wchodzi w słabości
        i odporności celu. Esencje zdobywasz w jamie łowów.</p>
      ${this.przepisyZEsencji()}`;
  },

  przepisyZEsencji() {
    return Object.values(PRZEPISY)
      .filter(p => p.zEsencji && Bohater.czyPasuje(PRZEDMIOTY[p.przedmiot]))
      .map(przepis => {
      const p = PRZEDMIOTY[przepis.przedmiot];
      const mamy = Bohater.ma(p.id);
      const staC = Bohater.staC(przepis.koszt);
      const zalozony = Bohater.stan.bron === p.id;

      return `<div class="oferta ${mamy || staC ? '' : 'niestac'}">
                <span class="oferta-ikona">${UI.ikonaPrzedmiotu(p)}</span>
                <span class="oferta-tresc">
                  <strong>${p.nazwa} <span class="zyw slabosc">${ZYWIOLY[p.zywiol].ikona} ${ZYWIOLY[p.zywiol].nazwa}</span></strong>
                  <span>+${p.obrazenia} obrażeń, omija pancerz — ${p.opis}</span>
                  <span class="koszt-materialow">${this.opisKosztu(przepis.koszt)}</span>
                </span>
                ${zalozony ? '<span class="oferta-stan">założone</span>'
                  : mamy ? `<button class="oferta-kup wtorny" onclick="Miasto.zalozZCzarodzieja('${p.id}')">Załóż</button>`
                  : `<button class="oferta-kup" ${staC ? '' : 'disabled'} onclick="Miasto.wykujZEsencji('${przepis.id}')">Wykuj</button>`}
              </div>`;
    }).join('');
  },

  wykujZEsencji(id)      { if (Bohater.wykuj(id)) this.odswiezPanel('czarodziej'); },
  zalozZCzarodzieja(id)  { if (Bohater.zaloz(id)) this.odswiezPanel('czarodziej'); },

  // ---------- JAMA ŁOWÓW ----------

  panel_jama() {
    const wiersze = LOWY.map(id => {
      const wataha = WATAHY[id];
      const b = wataha ? this.opisWatahy(wataha) : BESTIE[id];
      const pokonana = Bohater.czyPokonany(id);

      const zywioly = [
        ...(b.wchlania || []).map(z => `<span class="zyw wchlania">${ZYWIOLY[z].ikona} wchłania ${ZYWIOLY[z].nazwa}</span>`),
        ...(b.slabosci || []).map(z => `<span class="zyw slabosc">${ZYWIOLY[z].ikona} słaby na ${ZYWIOLY[z].nazwa}</span>`),
        ...(b.odpornosci || []).map(z => `<span class="zyw odpornosc">${ZYWIOLY[z].ikona} odporny na ${ZYWIOLY[z].nazwa}</span>`)
      ].join('');

      const esencje = Object.keys(b.nagroda.esencje || {})
        .map(e => `${ESENCJE[e].ikona} ${ESENCJE[e].nazwa}`).join(', ');

      return `<div class="oferta bestia ${b.apex ? 'apex' : ''}">
                <span class="oferta-ikona">${b.ikona}</span>
                <span class="oferta-tresc">
                  <strong>${b.nazwa} ${b.apex ? '☠' : ''}${b.liczba ? ` <span class="liczebnosc">×${b.liczba}</span>` : ''} ${pokonana ? '<span class="oferta-stan">ubita</span>' : ''}</strong>
                  <span>${b.hp} HP łącznie · ${b.nagroda.zloto} zł · ${b.nagroda.xp} XP · ${esencje}</span>
                  <span>${b.opis}</span>
                  <span class="zywioly">${zywioly}</span>
                </span>
                <button class="oferta-kup" onclick="Miasto.polujNa('${id}')">Poluj</button>
              </div>`;
    }).join('');

    this.el.panelTresc.innerHTML = `
      <p class="panel-opis">Krata w podłodze areny. Pod nią trzymają to, czego nie da się
        wystawić przeciw ludziom. Bestie nie noszą pancerzy, ale mają <strong>żywioły</strong> —
        i to one decydują, czy Twoja broń w ogóle coś im zrobi.
        Możesz tu wracać, ile chcesz: to poza drabiną.</p>
      ${wiersze}`;
  },

  // Wataha w interfejsie wygląda jak jedna pozycja — sumujemy jej dane.
  opisWatahy(wataha) {
    const czlonkowie = wataha.sklad.map(id => BESTIE[id]);
    const suma = (pole) => czlonkowie.reduce((a, b) => a + b.nagroda[pole], 0);

    const esencje = {};
    czlonkowie.forEach(c => Object.entries(c.nagroda.esencje || {})
      .forEach(([k, v]) => { esencje[k] = (esencje[k] || 0) + v; }));

    return {
      id: wataha.id, nazwa: wataha.nazwa, ikona: wataha.ikona, opis: wataha.opis,
      hp: czlonkowie.reduce((a, b) => a + b.hp, 0),
      slabosci: czlonkowie[0].slabosci,
      odpornosci: czlonkowie[0].odpornosci,
      wchlania: czlonkowie[0].wchlania,
      liczba: wataha.sklad.length,
      nagroda: { zloto: suma('zloto'), xp: suma('xp'), esencje: esencje }
    };
  },

  polujNa(idBestii) {
    this.el.panel.classList.remove('widoczny');
    Gra.walcz(idBestii);
  },

  kupArtefakt(id)   { if (Artefakty.kup(id)) this.odswiezPanel('czarodziej'); },
  zalozArtefakt(id) { if (Artefakty.zaloz(id)) this.odswiezPanel('czarodziej'); },
  zdejmijArtefakt() { Artefakty.zaloz(null); this.odswiezPanel('czarodziej'); }
};
