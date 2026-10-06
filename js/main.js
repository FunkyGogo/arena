// ============================================================
//  START GRY
//  Najmniejszy możliwy plik: spina ekrany z silnikiem.
//
//  Przepływ: wybór klasy → MIASTO (hub) → arena / sklep / kuźnia / gospoda
//  Stan zapisuje się sam po każdej ważnej zmianie.
// ============================================================

const Gra = {

  start() {
    UI.start();
    Miasto.start();
    EkranDrzewka.start();
    UI.podpowiedzDomyslna();

    // Jest zapis? Wracamy dokładnie tam, gdzie skończyliśmy.
    if (Zapis.wczytaj()) {
      UI.zbudujPasek();
      this.pokazMiasto();
    } else {
      UI.pokazWyborKlasy();
    }
  },

  wybierzKlase(idKlasy) {
    Bohater.stworz(idKlasy);
    Zapis.zapisz();
    UI.schowajWyborKlasy();
    UI.zbudujPasek();
    this.pokazMiasto();
  },

  pokazMiasto() {
    UI.schowajEkranKonca();
    UI.schowajDrabine();
    Miasto.pokaz();
    Zapis.zapisz();
  },

  pokazDrabine() {
    UI.schowajEkranKonca();
    Miasto.schowaj();
    UI.pokazDrabine();
  },

  // HP NIE wraca przed walką — wchodzisz na arenę z tym, co masz.
  // idWroga może być pojedynczym wrogiem albo watahą.
  walcz(idWroga) {
    Bohater.odswiezRegeneracje();
    UI.schowajDrabine();
    UI.schowajEkranKonca();
    Miasto.schowaj();
    Walka.rozpocznij(idWroga);
  },

  // Kasowanie postępu — pyta, zanim skasuje.
  nowaGra() {
    if (!confirm('Skasować postęp i zacząć od nowa? Tego nie da się cofnąć.')) return;
    Zapis.usun();
    Bohater.stan = null;
    Miasto.schowaj();
    UI.schowajDrabine();
    UI.schowajEkranKonca();
    UI.pokazWyborKlasy();
  }
};

window.addEventListener('DOMContentLoaded', () => Gra.start());
