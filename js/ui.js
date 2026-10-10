// ============================================================
//  INTERFEJS
//  Rysuje stan gry na ekranie. Nie podejmuje decyzji o rozgrywce.
// ============================================================

const UI = {

  el: {},

  start() {
    const id = x => document.getElementById(x);

    this.el = {
      wrogowie: id('wrogowie'), wrogSylwetka: null,
      pupile: id('pupile'),

      graczNazwa: id('gracz-nazwa'),
      graczHpPasek: id('gracz-hp-pasek'), graczHpTekst: id('gracz-hp-tekst'),
      graczZasPasek: id('gracz-zasob-pasek'), graczZasTekst: id('gracz-zasob-tekst'),
      graczKarta: id('gracz-karta'), graczSylwetka: id('gracz-sylwetka'),
      graczStatusy: id('gracz-statusy'),

      arena: id('arena'), graczPostac: id('gracz-postac'),
      miejsceGracza: id('miejsce-gracza'), miejscaWrogow: id('miejsca-wrogow'),
      graczPortret: id('gracz-portret'), graczIkona: id('gracz-ikona'),
      liczby: id('liczby'),

      runda: id('runda'), tura: id('tura'), dystans: id('dystans'),
      dziennik: id('dziennik'), pasek: id('pasek-akcji'), podpowiedz: id('podpowiedz'),

      ekranKonca: id('ekran-konca'), koncaTytul: id('konca-tytul'),
      koncaOpis: id('konca-opis'), koncaLup: id('konca-lup'),
      koncaPrzyciski: id('konca-przyciski'),

      pomocPrzycisk: id('pomoc-przycisk'), pomocEkran: id('pomoc-ekran'),
      pomocTresc: id('pomoc-tresc'), pomocZamknij: id('pomoc-zamknij'),

      ekranKlas: id('ekran-klas'), listaKlas: id('lista-klas'),

      ekranDrabiny: id('ekran-drabiny'), listaRang: id('lista-rang'),
      drabinaPowrot: id('drabina-powrot'),
      pasekBohatera: id('pasek-bohatera'),

      ekranAwansu: id('ekran-awansu'), awansTresc: id('awans-tresc'),
      awansPunkty: id('awans-punkty'), awansZamknij: id('awans-zamknij')
    };

    // Ikony przedmiotów wstawiamy po narysowaniu listy: HTML dostaje tylko
    // znacznik data-ikona, a tu dociągamy wyciętą grafikę.
    new MutationObserver(() => this.wypelnijIkony()).observe(document.body, { childList: true, subtree: true });

    this.el.pomocPrzycisk.addEventListener('click', () => this.pokazPomoc());
    this.el.pomocZamknij.addEventListener('click', () => this.schowajPomoc());
    this.el.awansZamknij.addEventListener('click', () => this.schowajAwans());
  },

  // ---------- ekran wyboru klasy ----------

  pokazWyborKlasy() {
    this.el.listaKlas.innerHTML = '';

    Object.values(KLASY).forEach(k => {
      const galezie = Object.values(DRZEWKA[k.id].galezie)
        .map(g => `<span class="pasyw">${g.ikona} ${g.nazwa}</span>`).join('');
      const akcje = `${UMIEJETNOSCI[k.atakPodstawowy].ikona} ${UMIEJETNOSCI[k.atakPodstawowy].nazwa}`
        + ` · ${UMIEJETNOSCI[DRZEWKA[k.id].wezly[k.startowyWezel].akcja].ikona} `
        + `${UMIEJETNOSCI[DRZEWKA[k.id].wezly[k.startowyWezel].akcja].nazwa} (na start)`;
      const maxHp = CONFIG.postac.hpBazowe + k.cechy.witalnosc * CONFIG.postac.hpZaWitalnosc;
      const c = k.cechy;

      const karta = document.createElement('button');
      karta.className = 'karta-klasy';
      karta.innerHTML = `
        <div class="klasa-glowa">
          <span class="klasa-ikona"><img class="klasa-portret" alt=""><span>${k.ikona}</span></span>
          <div><strong>${k.nazwa}</strong><span class="klasa-haslo">${k.haslo}</span></div>
          <span class="klasa-trudnosc t-${k.id}">${k.trudnosc}</span>
        </div>
        <p class="klasa-opis">${k.opis}</p>
        <div class="klasa-liczby">
          <span><b>${maxHp}</b> HP</span>
          <span><b>${CONFIG.zasoby[k.zasob].nazwa}</b> jako zasób</span>
          <span>SIŁ ${c.sila} · ATK ${c.atak} · OBR ${c.obrona} · ZRĘ ${c.zrecznosc} · WIT ${c.witalnosc}</span>
        </div>
        <div class="klasa-akcje">${akcje}</div>
        <div class="klasa-pasywy">${galezie}</div>`;

      karta.addEventListener('click', () => Gra.wybierzKlase(k.id));
      this.el.listaKlas.appendChild(karta);

      // Portret klasy zamiast emoji, gdy już jest narysowany.
      const portret = typeof GRAFIKI_POSTACI !== 'undefined'
        && GRAFIKI_POSTACI[k.id] && GRAFIKI_POSTACI[k.id].portret;
      if (portret) {
        Sylwetki.ustaw(karta.querySelector('.klasa-portret'), portret)
          .then(ok => { if (ok) karta.querySelector('.klasa-ikona').classList.add('z-portretem'); });
      }
    });

    this.el.ekranKlas.classList.add('widoczny');
  },

  schowajWyborKlasy() { this.el.ekranKlas.classList.remove('widoczny'); },

  // ---------- ekran drabiny areny ----------

  pokazDrabine() {
    this.rysujPasekBohatera();
    this.el.listaRang.innerHTML = '';

    const region = Bohater.stan.region || 2;
    this.el.ekranDrabiny.querySelector('h1').textContent = region === 1
      ? 'Kamieniołom — droga do bramy'
      : 'Ludus w Kapui — drabina areny';
    // W prologu nie ma miasta, więc nie ma dokąd wracać.
    this.el.drabinaPowrot.hidden = region === 1;

    drabinaRegionu(region).forEach(idW => {
      // Wpis może być pojedynczym wrogiem albo watahą.
      const w = WROGOWIE[idW] || WATAHY[idW];
      if (!w) return;
      const odblokowany = Bohater.czyOdblokowana(w.ranga);
      const pokonany = Bohater.czyPokonany(idW);

      const b = document.createElement('button');
      b.className = 'ranga'
        + (pokonany ? ' pokonany' : '')
        + (!odblokowany ? ' zablokowany' : '')
        + (w.miniboss ? ' miniboss' : '')
        + (w.czempion ? ' czempion' : '');
      b.disabled = !odblokowany;

      const znacznik = w.czempion ? '☠' : (w.miniboss ? '★' : '');

      // Wataha nie ma własnego HP ani nagrody — sumujemy je ze składu.
      const sklad = w.sklad ? w.sklad.map(id => WROGOWIE[id]) : [w];
      const hp = sklad.reduce((s, x) => s + x.hp, 0);
      const zloto = sklad.reduce((s, x) => s + x.nagroda.zloto, 0);
      const xp = sklad.reduce((s, x) => s + x.nagroda.xp, 0);
      const lupy = `${zloto} zł · ${xp} XP`;

      b.innerHTML = `
        <span class="ranga-numer">${w.ranga}</span>
        <span class="ranga-ikona">${odblokowany ? w.ikona : '🔒'}</span>
        <span class="ranga-tresc">
          <strong>${odblokowany ? w.nazwa : '???'} ${znacznik}</strong>
          <span class="ranga-meta">${!odblokowany ? 'Wygraj poprzednią rangę'
            : (w.uczy ? w.uczy : `${hp} HP · ${lupy}`)}</span>
        </span>
        ${pokonany ? '<span class="ranga-ptaszek">✓</span>' : ''}`;

      if (odblokowany) b.addEventListener('click', () => Gra.walcz(idW));
      this.el.listaRang.appendChild(b);
    });

    this.el.ekranDrabiny.classList.add('widoczny');
    this.el.drabinaPowrot.onclick = () => Gra.pokazMiasto();
  },

  schowajDrabine() { this.el.ekranDrabiny.classList.remove('widoczny'); },

  rysujPasekBohatera() {
    const b = Bohater.stan;
    const doNast = Bohater.xpDoNastepnegoPoziomu();
    const procent = Math.min(100, (b.xp / doNast) * 100);

    const materialy = Object.keys(b.materialy).length
      ? Object.entries(b.materialy)
          .map(([k, ile]) => `<span class="material" title="${MATERIALY[k].nazwa}">${MATERIALY[k].ikona} ${ile}</span>`).join('')
      : '<span class="material pusty">brak materiałów</span>';

    this.el.pasekBohatera.innerHTML = `
      <div class="bohater-glowa">
        <span class="bohater-ikona">${Bohater.klasa().ikona}</span>
        <div>
          <strong>${Bohater.klasa().nazwa}</strong>
          <span class="bohater-meta">Poziom ${b.poziom} · ${Bohater.maxHp()} HP</span>
        </div>
        <span class="bohater-zloto">🪙 ${b.zloto}</span>
      </div>
      <div class="pasek-tlo pasek-xp">
        <div class="pasek-wypelnienie xp" style="width:${procent}%"></div>
        <span class="pasek-tekst">XP ${b.xp} / ${doNast}</span>
      </div>
      <div class="bohater-materialy">${materialy}</div>
      ${b.punktyDoRozdania > 0
        ? `<button class="przycisk-awansu" onclick="UI.pokazAwans()">Masz ${b.punktyDoRozdania} pkt cech do rozdania</button>`
        : ''}`;
  },

  // ---------- ekran awansu (rozdawanie punktów) ----------

  pokazAwans() {
    this.rysujAwans();
    this.el.ekranAwansu.classList.add('widoczny');
  },

  rysujAwans() {
    const b = Bohater.stan;
    const opisy = {
      sila:      ['SIŁA',      'obrażenia Twoich ciosów'],
      atak:      ['ATAK',      'celność — jak często trafiasz'],
      obrona:    ['OBRONA',    'ile obrażeń zdejmuje pancerz'],
      zrecznosc: ['ZRĘCZNOŚĆ', 'inicjatywa i unik (u Wojownika też max Wigoru)'],
      witalnosc: ['WITALNOŚĆ', `maksymalne HP (+${CONFIG.postac.hpZaWitalnosc} za punkt)`],
      wola:      ['WOLA',      'odporność na magię i klątwy']
    };

    this.el.awansPunkty.textContent = b.punktyDoRozdania;
    this.el.awansTresc.innerHTML = Object.entries(opisy).map(([cecha, [nazwa, opis]]) => `
      <div class="cecha">
        <span class="cecha-wartosc">${b.cechy[cecha]}</span>
        <span class="cecha-tresc"><strong>${nazwa}</strong><span>${opis}</span></span>
        <button class="cecha-plus" ${b.punktyDoRozdania <= 0 ? 'disabled' : ''}
                onclick="UI.dodajPunkt('${cecha}')">+</button>
      </div>`).join('')
      // Punkty umiejetnosci lezaly dotad tylko w karcie bohatera, wiec po
      // awansie latwo bylo o nich zapomniec. Przejscie do drzewka jest tutaj.
      + (b.pu > 0
        ? `<button class="przycisk-awansu" onclick="UI.schowajAwans(); EkranDrzewka.pokaz()">
             Masz ${b.pu} pkt umiejętności — otwórz drzewko
           </button>`
        : '');
  },

  dodajPunkt(cecha) {
    if (Bohater.wydajPunkt(cecha)) {
      Zapis.zapisz();
      this.rysujAwans();
      this.rysujPasekBohatera();
    }
  },

  schowajAwans() {
    this.el.ekranAwansu.classList.remove('widoczny');
    this.rysujPasekBohatera();
    Miasto.rysujNaglowek();
  },

  // ---------- pasek akcji ----------

  zbudujPasek() {
    const klasa = Bohater.klasa();
    this.el.pasek.innerHTML = '';
    this.el.pasek.appendChild(this.przyciskAkcji(UMIEJETNOSCI[klasa.atakPodstawowy], true));

    Bohater.stan.sloty.forEach(idA => {
      this.el.pasek.appendChild(
        idA && UMIEJETNOSCI[idA] ? this.przyciskAkcji(UMIEJETNOSCI[idA], false) : this.pustySlot()
      );
    });

    this.el.pasek.appendChild(this.przyciskAkcji(UMIEJETNOSCI.eliksir, false));
  },

  przyciskAkcji(um, czyPodstawowy) {
    const b = document.createElement('button');
    b.className = 'akcja' + (czyPodstawowy ? ' akcja-podstawowa' : '');
    b.dataset.umiejetnosc = um.id;
    b.innerHTML =
      `<span class="akcja-ikona">${this.ikona('umiejetnosci', um.id, um.ikona, 'ikona-akcji')}</span>` +
      `<span class="akcja-nazwa">${um.nazwa}</span>` +
      `<span class="akcja-koszt">${this.etykietaKosztu(um)}</span>` +
      `<span class="akcja-uzycia"></span>`;

    b.addEventListener('click', () => {
      this.stanZAkcji(um);
      Walka.akcjaGracza(um.id);
    });
    const pokaz = () => this.podpowiedz(um);
    b.addEventListener('mouseenter', pokaz);
    b.addEventListener('touchstart', pokaz, { passive: true });
    b.addEventListener('mouseleave', () => this.podpowiedzDomyslna());
    return b;
  },

  etykietaKosztu(um) {
    const l = Drzewko.liczbyAkcji(um.id);
    if (um.typ === 'eliksir') return '';
    if (l.kosztCaleKombo) return 'ALL';
    if (l.kosztProcentHp) return Math.round(l.kosztProcentHp * 100) + '%';
    return l.koszt > 0 ? String(l.koszt) : '';
  },

  pustySlot() {
    const b = document.createElement('button');
    b.className = 'akcja akcja-pusta';
    b.disabled = true;
    b.innerHTML = '<span class="akcja-ikona">+</span><span class="akcja-nazwa">pusty slot</span>';
    return b;
  },

  podpowiedz(um) {
    const l = Drzewko.liczbyAkcji(um.id);
    const zasob = CONFIG.zasoby[Bohater.klasa().zasob].nazwa;

    let koszt = 'bez kosztu';
    if (l.kosztCaleKombo)      koszt = 'zużywa całe Kombo';
    else if (l.kosztProcentHp) koszt = Math.round(l.kosztProcentHp * 100) + '% HP';
    else if (l.koszt > 0)      koszt = `${l.koszt} ${zasob}`;

    const galaz = um.galaz === 'podstawa' ? '' : ` · gałąź ${um.galaz}`;
    this.el.podpowiedz.innerHTML =
      `<strong>${um.nazwa}</strong> <span class="podpowiedz-meta">${koszt}${galaz}</span><br>${um.opis}`;
  },

  podpowiedzDomyslna() {
    this.el.podpowiedz.innerHTML =
      '<span class="podpowiedz-meta">Najedź lub dotknij przycisku, żeby zobaczyć, co robi.</span>';
  },

  // ---------- grafiki bohatera na arenie ----------
  //  Stany: postawa (domyślny), atak, garda, trafienie, smierc.
  //  Atak i trafienie są chwilowe — same wracają do stanu bazowego.

  stanPostaci: null,
  stanChwilowy: false,
  timerStanu: null,
  grafikiKlasy: null,

  grafiki() {
    if (typeof GRAFIKI_POSTACI === 'undefined' || !Bohater.stan) return null;
    return GRAFIKI_POSTACI[Bohater.stan.klasa] || null;
  },

  // Klasa bez grafik gra po staremu, na emoji.
  przygotujGrafiki() {
    const g = this.grafiki();
    // Klasa może mieć sam portret do menu, a nie mieć jeszcze póz bojowych —
    // wtedy arena chowa się tak samo jak przy klasie zupełnie bez grafik.
    this.el.arena.classList.toggle('bez-grafiki', !(g && g.postawa));
    this.stanPostaci = null;
    this.stanChwilowy = false;
    clearTimeout(this.timerStanu);

    if (!g || !g.portret) {
      this.el.graczPostac.removeAttribute('src');
      this.el.graczSylwetka.classList.remove('z-portretem');
    } else {
      Sylwetki.ustaw(this.el.graczPortret, g.portret)
        .then(ok => this.el.graczSylwetka.classList.toggle('z-portretem', !!ok));
    }

    if (!g || !g.postawa) return;

    this.ustawStanPostaci('postawa');
    // Reszta stanów w tle, żeby pierwszy cios nie czekał na obrazek.
    Sylwetki.przygotuj([g.atak, g.garda, g.trafienie, g.smierc]);
  },

  ustawStanPostaci(stan, czasMs) {
    const g = this.grafiki();
    if (!g || !g[stan]) return;

    clearTimeout(this.timerStanu);
    this.stanChwilowy = !!czasMs;

    if (this.stanPostaci !== stan) {
      this.stanPostaci = stan;
      this.el.arena.dataset.stan = stan;
      // Stała wysokość razy skala pozy — postać jest tej samej wielkości
      // niezależnie od tego, czy grafika jest pionowa, czy pozioma.
      // Klasa moze miec wlasne skale (g.skale), bo kazda inaczej sie rozkłada
      // na obrazku. Czego nie nadpisze, bierze z SKALE_POZ.
      const wlasne = g.skale && g.skale[stan];
      const skala = wlasne || (typeof SKALE_POZ !== 'undefined' && SKALE_POZ[stan]) || 1;
      this.el.graczPostac.style.setProperty('--skala', skala);
      Sylwetki.ustaw(this.el.graczPostac, g[stan]);
    }

    const postac = this.el.graczPostac;
    postac.classList.remove('zmiana');
    void postac.offsetWidth;
    postac.classList.add('zmiana');

    if (czasMs) {
      this.timerStanu = setTimeout(() => {
        this.stanChwilowy = false;
        this.ustawStanPostaci(this.stanBazowy());
      }, czasMs);
    }
  },

  stanBazowy() {
    const s = Walka.stan;
    if (s && s.koniec && s.wynik === 'przegrana') return 'smierc';
    if (s && s.gracz && s.gracz.gardaAktywna) return 'garda';
    return 'postawa';
  },

  odswiezStanPostaci() {
    if (!this.stanChwilowy) this.ustawStanPostaci(this.stanBazowy());
  },

  // Wywoływane z paska akcji, zanim silnik policzy cios.
  stanZAkcji(um) {
    if (um.typ === 'garda' || um.typ === 'postawa') return;  // gardę pokaże stan bazowy
    this.ustawStanPostaci('atak', (CONFIG.ui && CONFIG.ui.czasAtakuMs) || 700);
  },

  // ---------- odswiezanie walki ----------

  odswiez() {
    const s = Walka.stan;
    if (!s) return;

    this.rysujWrogow(s);
    this.rysujPupile(s);
    this.el.graczIkona.textContent = s.gracz.ikona;

    // Grafiki wczytujemy raz na klasę, potem tylko przełączamy stany.
    if (this.grafikiKlasy !== Bohater.stan.klasa) {
      this.grafikiKlasy = Bohater.stan.klasa;
      this.przygotujGrafiki();
    }
    this.odswiezStanPostaci();
    this.rysujArenaWrogow(s);
    this.ustawTlo(s);

    this.el.graczNazwa.textContent = `${s.gracz.nazwa} · poz. ${Bohater.stan.poziom}`;
    this.ustawPasek(this.el.graczHpPasek, s.gracz.hp, s.gracz.maxHp);
    this.el.graczHpTekst.textContent = `${s.gracz.hp} / ${s.gracz.maxHp}`;
    this.rysujStatusy(this.el.graczStatusy, s.gracz);

    const z = s.gracz.zasob;
    this.ustawPasek(this.el.graczZasPasek, z.wartosc, z.max);
    this.el.graczZasPasek.className = 'pasek-wypelnienie zasob-' + z.id;
    this.el.graczZasTekst.textContent = `${z.nazwa}  ${z.wartosc} / ${z.max}`;

    this.el.graczKarta.classList.toggle('w-gardzie', s.gracz.gardaAktywna);

    this.el.runda.textContent = `Runda ${s.runda}`;

    // Wskaźnik dystansu — tylko wtedy, gdy w ogóle jest o co grać
    if (Bohater.klasa().dystansowa) {
      const daleko = s.dystans === 'daleko';
      this.el.dystans.textContent = daleko
        ? `🏹 DALEKO (${Math.ceil(s.dobiegniecie)})`
        : '⚔ ZWARCIE';
      this.el.dystans.className = daleko ? 'daleko' : 'zwarcie';
    } else {
      this.el.dystans.textContent = '';
      this.el.dystans.className = '';
    }
    this.el.tura.textContent = s.koniec
      ? (s.wynik === 'wygrana' ? 'Zwycięstwo' : 'Porażka')
      : (s.czekamNaGracza ? 'Twoja tura' : 'Tura przeciwnika');

    this.el.pasek.querySelectorAll('.akcja[data-umiejetnosc]').forEach(b => {
      const um = UMIEJETNOSCI[b.dataset.umiejetnosc];
      b.disabled = !s.czekamNaGracza || s.koniec || Walka.dlaczegoNieMozna(s.gracz, um) !== null;

      const zostalo = um.typ === 'eliksir'
        ? Bohater.stan.eliksiry
        : Walka.pozostaleUzycia(s.gracz, um);
      const znacznik = b.querySelector('.akcja-uzycia');
      znacznik.textContent = zostalo === null ? '' : zostalo;
      znacznik.classList.toggle('wyczerpane', zostalo === 0);
    });
  },

  // ---------- ikony przedmiotów w mieście ----------

  // HTML do wstawienia w miejsce emoji. Gdy przedmiot nie ma jeszcze ikony,
  // albo plik się nie wczyta, zostaje emoji — nic się nie psuje.
  // grupa: przedmioty | artefakty | budynki | materialy
  ikona(grupa, id, emoji, klasa) {
    const ma = typeof IKONY !== 'undefined' && IKONY[grupa] && IKONY[grupa].includes(id);
    if (!ma) return emoji;
    return `<img class="${klasa || 'ikona-przedmiotu'}" data-ikona="assets/${grupa}/${id}.jpg" alt="">` +
           `<span class="ikona-zapas">${emoji}</span>`;
  },

  ikonaPrzedmiotu(p) { return this.ikona('przedmioty', p.id, p.ikona); },
  ikonaArtefaktu(a)  { return this.ikona('artefakty',  a.id, a.ikona); },
  ikonaBudynku(b)    { return this.ikona('budynki',    b.id, b.ikona, 'ikona-budynku'); },
  ikonaMaterialu(id, def) { return this.ikona('materialy', id, def.ikona, 'ikona-mala'); },

  wypelnijIkony() {
    document.querySelectorAll('img[data-ikona]:not([src])').forEach(obraz => {
      const sciezka = obraz.dataset.ikona;
      obraz.setAttribute('src', '');   // znacznik, żeby nie brać go drugi raz
      Sylwetki.ustaw(obraz, sciezka).then(ok => {
        if (ok) obraz.classList.add('gotowa');
        else obraz.remove();
      });
    });
  },

  // Tło areny. Walka z czempionem dostaje własne, zmierzchowe.
  tloWalki: null,

  ustawTlo(s) {
    if (typeof TLA_WALKI === 'undefined') return;
    // Znacznik czempiona jest w danych wroga, nie w obiekcie z walki.
    const czempion = s.wrogowie.some(w => WROGOWIE[w.id] && WROGOWIE[w.id].czempion);
    // Prolog dzieje sie w kamieniolomie, nie na arenie.
    const tlo = Bohater.czyProlog() ? TLA_WALKI.kamieniolom
              : czempion            ? TLA_WALKI.czempion
              :                       TLA_WALKI.domyslne;
    if (this.tloWalki === tlo) return;

    this.tloWalki = tlo;
    this.el.arena.style.backgroundImage = `url("${tlo}")`;
    this.el.arena.classList.toggle('tlo-czempiona', czempion);
  },

  // Prawa część areny: od jednego do trzech przeciwników obok siebie.
  // Wróg z grafikami dostaje trzy pozy, reszta stoi jako duża ikona.
  stanyWrogow: [],

  grafikiWroga(wrog) {
    if (typeof GRAFIKI_WROGOW === 'undefined' || !wrog) return null;
    return GRAFIKI_WROGOW[wrog.id] || null;
  },

  rysujArenaWrogow(s) {
    const pojemnik = this.el.miejscaWrogow;
    const ilu = Math.min(s.wrogowie.length, 3);
    pojemnik.className = 'wrogow-' + ilu;

    if (pojemnik.childElementCount !== s.wrogowie.length) {
      pojemnik.innerHTML = '';
      this.stanyWrogow = [];

      s.wrogowie.forEach((w, i) => {
        const miejsce = document.createElement('span');
        miejsce.className = 'arena-wrog';
        miejsce.dataset.indeks = i;
        miejsce.innerHTML = '<img class="wrog-postac" alt=""><span class="wrog-ikona"></span>';
        if (s.wrogowie.length > 1) miejsce.addEventListener('click', () => Walka.obierzCel(i));
        pojemnik.appendChild(miejsce);

        this.stanyWrogow[i] = { stan: null, chwilowy: false, timer: null };
        if (this.grafikiWroga(w)) this.ustawStanWroga(i, 'postawa');
      });
    }

    s.wrogowie.forEach((w, i) => {
      const miejsce = pojemnik.children[i];
      const grafiki = this.grafikiWroga(w);

      miejsce.classList.toggle('z-grafika', !!grafiki);
      miejsce.querySelector('.wrog-ikona').textContent = w.hp <= 0 ? '💀' : w.ikona;
      miejsce.classList.toggle('martwy', w.hp <= 0);
      miejsce.classList.toggle('obrany', s.wrogowie.length > 1 && w.hp > 0 && i === s.celIndeks);

      // Wróg w gardzie: podświetlona postawa zamiast osobnej grafiki (sekcja 7 biblii)
      miejsce.classList.toggle('w-gardzie', !!w.gardaAktywna);

      if (grafiki && !this.stanyWrogow[i].chwilowy) this.ustawStanWroga(i, this.stanBazowyWroga(i));
    });
  },

  // Stan spoczynkowy wroga: szarża albo garda, jeśli ma na nie własną grafikę.
  // Bez grafiki gardy zostaje postawa plus efekt błysku (sekcja 7 biblii).
  stanBazowyWroga(indeks) {
    const s = Walka.stan;
    const wrog = s && s.wrogowie[indeks];
    const grafiki = this.grafikiWroga(wrog);
    if (!wrog || !grafiki) return 'postawa';

    if (wrog.faza === 2    && grafiki.faza2)  return 'faza2';   // czempion odrzucił tarczę
    if (wrog.wSzale        && grafiki.szal)   return 'szal';    // szał trwa do końca walki
    if (wrog.szykujeSzarze && grafiki.szarza) return 'szarza';
    if (wrog.gardaAktywna  && grafiki.garda)  return 'garda';
    return 'postawa';
  },

  ustawStanWroga(indeks, stan, czasMs) {
    const s = Walka.stan;
    const wrog = s && s.wrogowie[indeks];
    const grafiki = this.grafikiWroga(wrog);
    const zapis = this.stanyWrogow[indeks];
    const miejsce = this.el.miejscaWrogow.children[indeks];
    if (!grafiki || !grafiki[stan] || !zapis || !miejsce) return;

    clearTimeout(zapis.timer);
    zapis.chwilowy = !!czasMs;

    if (zapis.stan !== stan) {
      zapis.stan = stan;
      miejsce.dataset.stan = stan;
      const odbij = (grafiki.odbij || []).includes(stan);
      // skala pozy razy wzrost wroga z danych (bossowie bywają więksi)
      const skala = ((typeof SKALE_POZ_WROGA !== 'undefined' && SKALE_POZ_WROGA[stan]) || 1)
                  * (grafiki.skala || 1);
      const obraz = miejsce.querySelector('.wrog-postac');
      obraz.style.setProperty('--skala', skala);
      Sylwetki.ustaw(obraz, grafiki[stan], odbij);
    }

    if (czasMs) {
      zapis.timer = setTimeout(() => {
        zapis.chwilowy = false;
        this.ustawStanWroga(indeks, this.stanBazowyWroga(indeks));
      }, czasMs);
    }
  },

  // Jedna furtka dla silnika: „pokaż tę postać w tym stanie".
  poza(postac, stan, czasMs) {
    if (!Walka.stan || !postac) return;
    if (postac.czyGracz) {
      if (stan !== 'atak' || !this.stanChwilowy) this.ustawStanPostaci(stan, czasMs);
      return;
    }
    const i = Walka.stan.wrogowie.indexOf(postac);
    if (i >= 0) this.ustawStanWroga(i, stan, czasMs);
  },

  // Błysk tarczy przy zablokowanym ciosie — zamiast grafiki gardy.
  blysnijBlokiem(postac) {
    if (!Walka.stan || !postac) return;
    const element = postac.czyGracz
      ? this.el.miejsceGracza
      : this.el.miejscaWrogow.children[Walka.stan.wrogowie.indexOf(postac)];
    if (!element) return;

    element.classList.remove('blok-efekt');
    void element.offsetWidth;
    element.classList.add('blok-efekt');
    setTimeout(() => element.classList.remove('blok-efekt'), 600);
  },

  // Środek postaci na scenie — stąd wylatują pływające liczby.
  srodekPostaci(postac) {
    const arena = this.el.arena.getBoundingClientRect();
    let element = this.el.miejsceGracza;

    if (postac && !postac.czyGracz && Walka.stan) {
      const i = Walka.stan.wrogowie.indexOf(postac);
      element = this.el.miejscaWrogow.children[i] || this.el.miejscaWrogow;
    }

    const pole = element.getBoundingClientRect();
    return pole.left - arena.left + pole.width / 2;
  },

  // Jedna karta na przeciwnika. Przy watasze klikasz, żeby obrać cel.
  rysujWrogow(s) {
    const pojemnik = this.el.wrogowie;
    const wataha = s.wrogowie.length > 1;

    // Przebudowujemy tylko wtedy, gdy zmienił się skład — inaczej migotałoby.
    if (pojemnik.childElementCount !== s.wrogowie.length) {
      pojemnik.innerHTML = '';
      s.wrogowie.forEach((w, i) => {
        const karta = document.createElement('section');
        karta.className = 'karta karta-wroga' + (wataha ? ' w-watasze' : '');
        karta.innerHTML = `
          <div class="karta-opis">
            <h2></h2>
            <p class="tytul"></p>
          </div>
          <div class="sylwetka sylwetka-wroga"></div>
          <div class="pasek-tlo pasek-hp">
            <div class="pasek-wypelnienie hp"></div>
            <span class="pasek-tekst"></span>
          </div>
          <div class="lista-statusow"></div>`;
        if (wataha) karta.addEventListener('click', () => Walka.obierzCel(i));
        pojemnik.appendChild(karta);
      });
    }

    s.wrogowie.forEach((w, i) => {
      const karta = pojemnik.children[i];
      const martwy = w.hp <= 0;

      karta.querySelector('h2').textContent = w.nazwa;
      karta.querySelector('.tytul').textContent = martwy ? 'pokonany' : w.tytul;
      karta.querySelector('.sylwetka').textContent = martwy ? '💀' : w.ikona;
      karta.querySelector('.pasek-tekst').textContent = `${w.hp} / ${w.maxHp}`;
      this.ustawPasek(karta.querySelector('.pasek-wypelnienie'), w.hp, w.maxHp);
      this.rysujStatusy(karta.querySelector('.lista-statusow'), w);

      karta.classList.toggle('martwy', martwy);
      karta.classList.toggle('obrany', wataha && !martwy && i === s.celIndeks);
      karta.classList.toggle('w-gardzie', w.gardaAktywna);
      karta.classList.toggle('szykuje-szarze', !!w.szykujeSzarze);
    });

    // Drganie kieruj na kartę obranego celu
    this.el.wrogSylwetka = pojemnik.children[s.celIndeks]
      ? pojemnik.children[s.celIndeks].querySelector('.sylwetka')
      : this.el.graczSylwetka;
  },

  // Przywołania druida — po jednej wąskiej karcie na bestię.
  rysujPupile(s) {
    const zywe = (s.pupile || []).filter(p => p.hp > 0);
    this.el.pupile.innerHTML = zywe.map(p => `
      <div class="pupil">
        <span class="pupil-ikona">${p.ikona}</span>
        <span class="pupil-tresc">
          <strong>${p.nazwa}</strong>
          <span class="pasek-tlo pasek-pupila">
            <span class="pasek-wypelnienie hp" style="width:${(p.hp / p.maxHp) * 100}%"></span>
            <span class="pasek-tekst">${p.hp} / ${p.maxHp} · ${p.tury} tur</span>
          </span>
        </span>
      </div>`).join('');
  },

  ustawPasek(elementPaska, wartosc, max) {
    const procent = max > 0 ? Math.max(0, (wartosc / max) * 100) : 0;
    elementPaska.style.width = procent + '%';
    elementPaska.classList.toggle('nisko', procent <= 30);
  },

  rysujStatusy(pojemnik, postac) {
    pojemnik.innerHTML = '';
    postac.statusy.forEach(s => {
      const def = STATUSY[s.id];
      if (!def) return;

      const chip = document.createElement('span');
      chip.className = 'status ' + def.rodzaj;

      let tekst = `${def.ikona} ${def.opisKrotki}`;
      if (def.modyfikatorObrony)           tekst += ` −${s.moc}`;
      if (def.modyfikatorZrecznosci)       tekst += ` −${s.moc}`;
      if (def.obrazeniaNaTure)             tekst += ` ${s.moc * (s.stacki || 1)}/turę`;
      if (def.stackowalny && s.stacki > 1) tekst += ` ×${s.stacki}`;
      chip.textContent = `${tekst} (${s.tury})`;

      pojemnik.appendChild(chip);
    });
  },

  // ---------- pływające liczby nad postaciami ----------
  //  Obrażenia, leczenie i krótkie hasła (KRYT, PUDŁO, BLOK) wyskakują
  //  nad tym, kogo dotyczą, i znikają same.

  liczba(postac, tekst, rodzaj) {
    if (!this.el.liczby || this.el.arena.classList.contains('bez-grafiki')) return;

    const babel = document.createElement('span');
    babel.className = 'liczba ' + (rodzaj || '');
    babel.textContent = tekst;

    // Liczba leci nad tym, kogo dotyczy — także nad właściwym wrogiem z watahy.
    // Lekki rozrzut, żeby kilka liczb pod rząd na siebie nie nachodziło.
    const rozrzut = Math.random() * 22 - 11;
    babel.style.left = (this.srodekPostaci(postac) + rozrzut) + 'px';

    this.el.liczby.appendChild(babel);
    setTimeout(() => babel.remove(), 1100);
  },

  // ---------- dziennik: jedna linijka z ostatnim zdarzeniem ----------

  // Mniej ważne wpisy nie kasują świeżej, ważnej wiadomości.
  wazne: ['krytyk', 'wygrana', 'przegrana', 'info', 'garda', 'status'],
  czasWpisu: 0,

  dziennik(tekst, rodzaj) {
    const teraz = Date.now();
    const drobny = !this.wazne.includes(rodzaj || '');
    if (drobny && teraz - this.czasWpisu < 700) return;

    this.czasWpisu = teraz;
    const pasek = this.el.dziennik;
    pasek.className = 'wpis ' + (rodzaj || '');
    pasek.textContent = tekst;

    pasek.classList.remove('nowy');
    void pasek.offsetWidth;
    pasek.classList.add('nowy');
  },

  wyczyscDziennik() {
    this.el.dziennik.textContent = '';
    this.el.dziennik.className = '';
    this.czasWpisu = 0;
    if (this.el.liczby) this.el.liczby.innerHTML = '';
  },

  drgnij(kto) {
    // Bohater oberwał — pokaż grafikę trafienia i wróć do postawy.
    if (kto !== 'wrog') {
      this.ustawStanPostaci('trafienie', (CONFIG.ui && CONFIG.ui.czasTrafieniaMs) || 600);
    }

    const karta = kto === 'wrog' ? this.el.wrogSylwetka : this.el.graczSylwetka;
    karta.classList.remove('drgniecie');
    void karta.offsetWidth;
    karta.classList.add('drgniecie');
  },

  // ---------- ekran konca walki ----------

  koniecWalki(wynik) {
    const s = Walka.stan;
    this.schowajPomoc();
    // Przegrana zostaje na ekranie: bohater klęczy, dopóki nie wyjdziesz z walki.
    this.stanChwilowy = false;
    this.ustawStanPostaci(wynik === 'przegrana' ? 'smierc' : 'postawa');
    this.el.ekranKonca.classList.add('widoczny');
    this.el.koncaLup.innerHTML = '';
    this.el.koncaPrzyciski.innerHTML = '';

    if (wynik === 'wygrana') {
      const rundy = s.runda === 1 ? '1 rundzie' : `${s.runda} rundach`;
      const n = s.nagroda;

      const czempion = s.wrogowie.some(w => w.id === 'verrus');
      this.el.koncaTytul.textContent = czempion ? 'CZEMPION POKONANY' : 'ZWYCIĘSTWO';
      this.el.koncaTytul.className = 'wygrana';
      const kogo = s.wataha ? WATAHY[s.wataha].nazwa : s.wrogowie[0].nazwa;
      this.el.koncaOpis.textContent =
        `${kogo} — pokonani w ${rundy}. Zostało Ci ${s.gracz.hp} z ${s.gracz.maxHp} HP.`;

      const materialy = Object.entries(n.materialy)
        .map(([k, ile]) => `<span class="lup">${UI.ikonaMaterialu(k, MATERIALY[k])} ${MATERIALY[k].nazwa} ×${ile}</span>`).join('')
        + Object.entries(n.esencje || {})
        .map(([k, ile]) => `<span class="lup esencja">${UI.ikonaMaterialu(k, ESENCJE[k])} ${ESENCJE[k].nazwa} ×${ile}</span>`).join('');

      this.el.koncaLup.innerHTML = `
        <div class="lupy">
          <span class="lup">🪙 ${n.zloto} złota</span>
          <span class="lup">✨ ${n.xp} XP</span>
          ${materialy}
        </div>
        ${n.awanse > 0 ? `<p class="awans-info">AWANS! Poziom ${Bohater.stan.poziom} — masz ${Bohater.stan.punktyDoRozdania} pkt cech i ${Bohater.stan.pu} PU do wydania.</p>` : ''}
        ${n.bonusPU ? `<p class="awans-info">Za pokonanie bossa: +${n.bonusPU} punktu umiejętności.</p>` : ''}
        ${n.artefakt ? `<p class="artefakt-info">ARTEFAKT: ${UI.ikonaArtefaktu(ARTEFAKTY[n.artefakt])} ${ARTEFAKTY[n.artefakt].nazwa} — ${ARTEFAKTY[n.artefakt].efekt}</p>` : ''}`;

      // Podwojenie lupu reklama — tylko po wygranej i tylko raz na walke.
      if (n.zloto > 0 && Reklama.mozna('podwojLup')) {
        this.przyciskKonca(`📺 Podwój łup (+${n.zloto} złota)`, (zdarzenie) => {
          const przycisk = zdarzenie.currentTarget;
          przycisk.disabled = true;
          Reklama.obejrzyj('podwojLup', () => {
            Bohater.stan.zloto += n.zloto;
            Zapis.zapisz();
            przycisk.textContent = `Łup podwojony: +${n.zloto} złota`;
          });
        }, false);
      }

      // Po awansie masz dwie rzeczy do wydania — cechy i punkty umiejetnosci.
      // Oba prowadza wprost stad, zeby nie szukac ich w karcie bohatera.
      if (n.awanse > 0) this.przyciskKonca('Rozdaj punkty cech', () => this.pokazAwans(), true);
      if (Bohater.stan.pu > 0) {
        this.przyciskKonca(`Wydaj ${Bohater.stan.pu} pkt umiejętności`,
                           () => EkranDrzewka.pokaz(), n.awanse === 0);
      }
      if (czempion) {
        this.el.koncaOpis.textContent =
          `Verrus pada. Przepustka do Galii jest Twoja — region 2 ukończony. ` +
          `Zostało Ci ${s.gracz.hp} z ${s.gracz.maxHp} HP.`;
      }
    } else {
      this.el.koncaTytul.textContent = 'PORAŻKA';
      this.el.koncaTytul.className = 'przegrana';
      this.el.koncaOpis.textContent =
        `Padłeś w rundzie ${s.runda}. Bez nagrody — wróć silniejszy.`;
    }

    // Koniec prologu: nie ma dokąd wracać, bo miasto dopiero przed Tobą.
    if (Bohater.czyProlog() && Bohater.czyPrologSkonczony()) {
      this.przyciskKonca('Dalej', () => this.pokazKoniecPrologu(), true);
      return;
    }

    this.przyciskKonca(Bohater.czyProlog() ? 'Dalej' : 'Wróć do miasta',
                       () => Gra.pokazMiasto(), wynik === 'przegrana');
    if (wynik === 'wygrana' && Walka.stan.wrogowie[0].bestia) {
      this.przyciskKonca('Poluj dalej', () => { Gra.pokazMiasto(); Miasto.wejdz('jama'); }, false);
    } else if (wynik === 'wygrana' && !Walka.stan.wrog.czempion) {
      this.przyciskKonca('Do areny', () => Gra.pokazDrabine(), false);
    }
  },

  // Domknięcie prologu z design/arena_regiony.md: uciekasz w dzicz,
  // łowca niewolników Cię łapie i sprzedaje do ludusu w Kapui.
  pokazKoniecPrologu() {
    this.el.koncaTytul.textContent = 'WOLNOŚĆ';
    this.el.koncaTytul.className = 'wygrana';
    this.el.koncaOpis.textContent =
      'Nadzorca leży w pyle, brama stoi otworem. Biegniesz w dzicz — trzy dni ' +
      'i trzy noce. Czwartego łapie Cię łowca niewolników i sprzedaje do ' +
      'prowincjonalnego ludusu w Kapui. Uciekłeś z więzienia wprost na arenę. ' +
      'Ale tu, po raz pierwszy, dadzą Ci broń do ręki — i powód, żeby jej użyć.';
    this.el.koncaLup.innerHTML = '';
    this.el.koncaPrzyciski.innerHTML = '';

    this.przyciskKonca('Do Kapui', () => {
      Bohater.przejdzDoKapui();
      Zapis.zapisz();
      this.schowajEkranKonca();
      Gra.pokazMiasto();
    }, true);
  },

  przyciskKonca(tekst, akcja, glowny) {
    const b = document.createElement('button');
    b.className = glowny ? 'przycisk-glowny' : 'przycisk-poboczny';
    b.textContent = tekst;
    b.addEventListener('click', akcja);
    this.el.koncaPrzyciski.appendChild(b);
  },

  schowajEkranKonca() { this.el.ekranKonca.classList.remove('widoczny'); },

  // ---------- pomoc ----------

  pokazPomoc() {
    const klasa = Bohater.klasa();
    const idki = [klasa.atakPodstawowy, ...Bohater.stan.sloty.filter(Boolean), 'eliksir'];

    let html = idki.map(idA => {
      const um = UMIEJETNOSCI[idA];
      const l = Drzewko.liczbyAkcji(idA);
      let koszt = 'bez kosztu';
      if (l.kosztCaleKombo)      koszt = 'całe Kombo';
      else if (l.kosztProcentHp) koszt = Math.round(l.kosztProcentHp * 100) + '% HP';
      else if (l.koszt > 0)      koszt = `${l.koszt} ${CONFIG.zasoby[klasa.zasob].nazwa}`;

      return `<div class="pomoc-wpis">
                <div class="pomoc-glowa">
                  <span class="pomoc-ikona">${um.ikona}</span>
                  <strong>${um.nazwa}</strong>
                  <span class="pomoc-koszt">${koszt}</span>
                </div>
                <p>${um.opis}</p>
              </div>`;
    }).join('');

    const pasywy = Object.entries(Bohater.stan.wezly)
      .filter(([id, r]) => r > 0 && !Drzewko.wezly()[id].akcja);

    if (pasywy.length) {
      html += '<h2 class="pomoc-naglowek">Pasywy z drzewka (działają zawsze)</h2>' +
        pasywy.map(([id, ranga]) => {
          const w = Drzewko.wezly()[id];
          return `<div class="pomoc-wpis">
                    <div class="pomoc-glowa">
                      <span class="pomoc-ikona">${w.ikona}</span><strong>${w.nazwa}</strong>
                      <span class="pomoc-koszt">ranga ${ranga}/${w.rangi}</span>
                    </div>
                    <p>${w.opis}</p>
                  </div>`;
        }).join('');
    }

    this.el.pomocTresc.innerHTML = html;
    this.el.pomocEkran.classList.add('widoczny');
  },

  schowajPomoc() { this.el.pomocEkran.classList.remove('widoczny'); }
};
