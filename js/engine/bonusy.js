// ============================================================
//  BONUSY — jeden worek modyfikatorów
//  Pasywy z drzewka i założone artefakty mówią tym samym językiem,
//  więc silnik walki pyta o wszystko w jednym miejscu.
//
//  Silnik NIE wie, skąd bierze się bonus — to pozwala dokładać
//  kolejne źródła (mikstury, buffy z miasta) bez zmian w walce.
// ============================================================

const Bonusy = {

  // Suma wszystkich modyfikatorów: drzewko + założony artefakt.
  wszystkie() {
    const suma = Drzewko.modyfikatory();

    const art = Artefakty.zalozony();
    if (art && art.mod) {
      Object.entries(art.mod).forEach(([klucz, wartosc]) => {
        suma[klucz] = (suma[klucz] || 0) + wartosc;
      });
    }
    return suma;
  },

  mod(nazwa) { return this.wszystkie()[nazwa] || 0; }
};


// ============================================================
//  ARTEFAKTY — posiadanie i zakładanie
// ============================================================

const Artefakty = {

  posiadane() { return Bohater.stan.artefakty || []; },

  zalozony() {
    const id = Bohater.stan.artefakt;
    return id ? ARTEFAKTY[id] : null;
  },

  ma(id) { return this.posiadane().includes(id); },

  // Zmiana artefaktu jest DARMOWA — design chce zachęcać do eksperymentów.
  zaloz(id) {
    if (id !== null && !this.ma(id)) return false;
    Bohater.stan.artefakt = id;
    return true;
  },

  dodaj(id) {
    if (!ARTEFAKTY[id]) return false;
    if (this.ma(id)) return false;            // duplikat trafia do skupu
    Bohater.stan.artefakty.push(id);
    if (!Bohater.stan.artefakt) Bohater.stan.artefakt = id;   // pierwszy zakładamy sami
    return true;
  },

  kup(id) {
    const a = ARTEFAKTY[id];
    if (!a || !a.cena || this.ma(id)) return false;
    if (Bohater.stan.zloto < a.cena) return false;

    Bohater.stan.zloto -= a.cena;
    this.dodaj(id);
    return true;
  },

  cenaSkupu(id) {
    const a = ARTEFAKTY[id];
    const podstawa = a.cena || CENA_UMOWNA_RZADKIEGO;
    return Math.round(podstawa * CENY_SKUPU[a.rzadkosc]);
  },

  sprzedaj(id) {
    if (!this.ma(id)) return false;
    Bohater.stan.zloto += this.cenaSkupu(id);
    Bohater.stan.artefakty = this.posiadane().filter(x => x !== id);
    if (Bohater.stan.artefakt === id) Bohater.stan.artefakt = Bohater.stan.artefakty[0] || null;
    return true;
  },

  // Losowanie łupu z wroga: { id: szansa }
  losujZWroga(wrog) {
    if (!wrog.artefakty) return null;
    for (const [id, szansa] of Object.entries(wrog.artefakty)) {
      if (this.ma(id)) continue;                  // nie dublujemy dropów
      if (Math.random() < szansa) return id;
    }
    return null;
  }
};
