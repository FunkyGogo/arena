// ============================================================
//  DRZEWKO UMIEJĘTNOŚCI
//  Punkty umiejętności (PU), odblokowywanie węzłów, sumowanie
//  modyfikatorów z pasywów i przypisywanie akcji do 4 slotów.
//
//  Stan trzyma Bohater (żeby zapis obejmował wszystko):
//    b.pu            — ile punktów zostało do wydania
//    b.wezly         — { idWezla: ranga }
//    b.sloty         — cztery przypisane akcje (null = pusty)
// ============================================================

const Drzewko = {

  drzewo() { return DRZEWKA[Bohater.stan.klasa]; },
  wezly()  { return this.drzewo().wezly; },

  // ---------- punkty umiejętności ----------

  przyznajPU(ile) { Bohater.stan.pu += ile; },

  // ---------- odblokowywanie ----------

  ranga(idWezla) { return Bohater.stan.wezly[idWezla] || 0; },

  // Zwraca tekst powodu, jeśli nie można wykupić kolejnej rangi. Inaczej null.
  dlaczegoNieMozna(idWezla) {
    const w = this.wezly()[idWezla];
    if (!w) return 'Nie ma takiego węzła.';
    if (w.wymagaWatah) return 'Dojdzie razem z watahami bestii.';

    const ranga = this.ranga(idWezla);
    if (ranga >= w.rangi) return 'Maksymalna ranga.';
    if (Bohater.stan.poziom < w.odPoziomu) return `Wymaga poziomu ${w.odPoziomu}.`;
    if (w.rodzic && this.ranga(w.rodzic) === 0) {
      return `Najpierw: ${this.wezly()[w.rodzic].nazwa}.`;
    }
    if (Bohater.stan.pu < w.kosztPU) return `Potrzebujesz ${w.kosztPU} PU.`;
    return null;
  },

  wykup(idWezla) {
    if (this.dlaczegoNieMozna(idWezla)) return false;

    const w = this.wezly()[idWezla];
    Bohater.stan.pu -= w.kosztPU;
    Bohater.stan.wezly[idWezla] = this.ranga(idWezla) + 1;

    // Pierwszy wykup akcji: jeśli jest wolny slot, wskakuje od razu.
    if (w.akcja && this.ranga(idWezla) === 1) this.wsadzDoWolnegoSlotu(w.akcja);
    return true;
  },

  // Reset za złoto — design zakłada tani reset drzewka.
  kosztResetu() {
    return CONFIG.drzewko.kosztResetuBazowy + Bohater.stan.poziom * CONFIG.drzewko.kosztResetuZaPoziom;
  },

  zresetuj() {
    const koszt = this.kosztResetu();
    if (Bohater.stan.zloto < koszt) return false;

    let zwrot = 0;
    Object.entries(Bohater.stan.wezly).forEach(([id, ranga]) => {
      zwrot += this.wezly()[id].kosztPU * ranga;
    });

    Bohater.stan.zloto -= koszt;
    Bohater.stan.pu += zwrot;
    Bohater.stan.wezly = {};
    Bohater.stan.sloty = [null, null, null, null];
    return true;
  },

  // ---------- sloty ----------

  // Wszystkie odblokowane akcje (do wyboru na pasek).
  dostepneAkcje() {
    return Object.entries(Bohater.stan.wezly)
      .filter(([id, ranga]) => ranga > 0 && this.wezly()[id].akcja)
      .map(([id]) => this.wezly()[id].akcja);
  },

  wsadzDoWolnegoSlotu(idAkcji) {
    const sloty = Bohater.stan.sloty;
    if (sloty.includes(idAkcji)) return false;
    const wolny = sloty.indexOf(null);
    if (wolny === -1) return false;
    sloty[wolny] = idAkcji;
    return true;
  },

  // Wkłada akcję do wskazanego slotu; jeśli jest już gdzie indziej, przenosi.
  ustawSlot(numer, idAkcji) {
    const sloty = Bohater.stan.sloty;
    if (idAkcji) {
      const gdzieIndziej = sloty.indexOf(idAkcji);
      if (gdzieIndziej !== -1) sloty[gdzieIndziej] = sloty[numer];
    }
    sloty[numer] = idAkcji;
  },

  // ---------- modyfikatory z pasywów ----------

  // Sumuje wszystkie pasywy razy ich ranga. Wynik czyta silnik walki.
  modyfikatory() {
    const suma = {};
    Object.entries(Bohater.stan.wezly).forEach(([id, ranga]) => {
      const w = this.wezly()[id];
      if (!w || !w.mod) return;
      Object.entries(w.mod).forEach(([klucz, wartosc]) => {
        suma[klucz] = (suma[klucz] || 0) + wartosc * ranga;
      });
    });
    return suma;
  },

  mod(nazwa) { return this.modyfikatory()[nazwa] || 0; },

  // ---------- liczby akcji z uwzględnieniem rangi węzła ----------

  // Zwraca CONFIG.akcje[id] podbite o bonusy z rang wykupionego węzła.
  liczbyAkcji(idAkcji) {
    const bazowe = CONFIG.akcje[idAkcji] || {};

    const wpis = Object.entries(this.wezly()).find(([, w]) => w.akcja === idAkcji);
    if (!wpis) return bazowe;

    const [idWezla, wezel] = wpis;
    const ranga = this.ranga(idWezla);
    if (ranga <= 1 || !wezel.naRange) return bazowe;

    const wynik = Object.assign({}, bazowe);
    for (let r = 1; r < ranga; r++) {
      const bonus = wezel.naRange[r];
      if (!bonus) continue;
      Object.entries(bonus).forEach(([klucz, wartosc]) => {
        wynik[klucz] = (wynik[klucz] || 0) + wartosc;
      });
    }

    // Zniżka z pasywu "Ekonomia ruchu"
    const znizka = this.mod('znizkaKosztu');
    if (znizka && wynik.koszt) wynik.koszt = Math.max(0, wynik.koszt - znizka);

    return wynik;
  },

  // ---------- podsumowanie do interfejsu ----------

  wydanePU() {
    return Object.entries(Bohater.stan.wezly)
      .reduce((suma, [id, ranga]) => suma + this.wezly()[id].kosztPU * ranga, 0);
  },

  wydanePUwGalezi(idGalezi) {
    return Object.entries(Bohater.stan.wezly)
      .filter(([id]) => this.wezly()[id].galaz === idGalezi)
      .reduce((suma, [id, ranga]) => suma + this.wezly()[id].kosztPU * ranga, 0);
  }
};
