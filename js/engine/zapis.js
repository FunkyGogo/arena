// ============================================================
//  ZAPIS I WCZYTYWANIE
//  Cały stan gry to jeden obiekt (Bohater.stan), więc zapis
//  to po prostu wrzucenie go do localStorage przeglądarki.
//
//  localStorage działa też w aplikacji na Androida po opakowaniu
//  Capacitorem — dlatego od razu tego używamy.
// ============================================================

const Zapis = {

  KLUCZ: 'arena-zapis',
  WERSJA: 1,

  // Zapis jest cichy: jeśli przeglądarka blokuje pamięć (tryb prywatny),
  // gra ma dalej działać, tylko bez zapamiętywania.
  zapisz() {
    if (!Bohater.stan) return false;
    try {
      localStorage.setItem(this.KLUCZ, JSON.stringify({
        wersja: this.WERSJA,
        zapisano: Date.now(),
        bohater: Bohater.stan
      }));
      return true;
    } catch (blad) {
      return false;
    }
  },

  odczytaj() {
    try {
      const surowy = localStorage.getItem(this.KLUCZ);
      if (!surowy) return null;

      const dane = JSON.parse(surowy);
      if (dane.wersja !== this.WERSJA) return null;   // stary format — ignorujemy
      if (!dane.bohater || !KLASY[dane.bohater.klasa]) return null;

      return dane;
    } catch (blad) {
      return null;
    }
  },

  istnieje() { return this.odczytaj() !== null; },

  wczytaj() {
    const dane = this.odczytaj();
    if (!dane) return false;

    Bohater.stan = dane.bohater;
    this.uzupelnijBraki();
    Bohater.odswiezRegeneracje();     // rany goiły się też, gdy gra była zamknięta
    return true;
  },

  // Gdyby zapis pochodził z wcześniejszej wersji tej samej liczby —
  // dokładamy pola, których mogło nie być, żeby nic się nie wysypało.
  uzupelnijBraki() {
    const b = Bohater.stan;
    const klasa = KLASY[b.klasa];

    if (b.materialy === undefined) b.materialy = {};
    if (b.pokonani === undefined) b.pokonani = [];
    if (b.eliksiry === undefined) b.eliksiry = 0;
    if (b.ulepszenieBroni === undefined) b.ulepszenieBroni = 0;
    if (b.posiadane === undefined) b.posiadane = [klasa.bronStartowa, klasa.pancerzStartowy];
    if (b.bron === undefined || !PRZEDMIOTY[b.bron]) b.bron = klasa.bronStartowa;
    if (b.pancerz === undefined || !PRZEDMIOTY[b.pancerz]) b.pancerz = klasa.pancerzStartowy;
    if (b.czasOstatniejRegeneracji === undefined) b.czasOstatniejRegeneracji = Date.now();
    if (b.esencje === undefined) b.esencje = {};
    if (b.artefakty === undefined) b.artefakty = [];
    if (b.artefakt === undefined) b.artefakt = null;
    if (b.pu === undefined) b.pu = CONFIG.drzewko.puNaStart;
    if (b.wezly === undefined) b.wezly = {};
    if (b.sloty === undefined) b.sloty = [null, null, null, null];
    if (b.hp === undefined) b.hp = Bohater.maxHp();
    if (b.klejnoty === undefined) b.klejnoty = 0;
    if (b.helm === undefined) b.helm = null;
    if (b.tarcza === undefined) b.tarcza = null;
    if (b.nagolenniki === undefined) b.nagolenniki = null;
  },

  usun() {
    try { localStorage.removeItem(this.KLUCZ); return true; }
    catch (blad) { return false; }
  },

  // Opis do pokazania na ekranie startowym ("wróć do gry")
  opisZapisu() {
    const dane = this.odczytaj();
    if (!dane) return null;

    const b = dane.bohater;
    const klasa = KLASY[b.klasa];
    const ranga = Math.min(DRABINA.length, b.najwyzszaRanga);

    return {
      ikona: klasa.ikona,
      nazwa: klasa.nazwa,
      opis: `Poziom ${b.poziom} · ranga ${ranga}/${DRABINA.length} · 🪙 ${b.zloto}`
    };
  }
};
