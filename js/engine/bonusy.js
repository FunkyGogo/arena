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

    // Trzy gniazda naraz: amulet i dwa pierścienie. Ich modyfikatory
    // się sumują, więc dwa takie same pierścienie podwajają efekt —
    // dlatego tego samego nie da się założyć dwa razy (patrz Artefakty.zaloz).
    Artefakty.zalozone().forEach(art => {
      if (!art || !art.mod) return;
      Object.entries(art.mod).forEach(([klucz, wartosc]) => {
        suma[klucz] = (suma[klucz] || 0) + wartosc;
      });
    });
    return suma;
  },

  mod(nazwa) { return this.wszystkie()[nazwa] || 0; }
};


// ============================================================
//  ARTEFAKTY — posiadanie i zakładanie
// ============================================================

const Artefakty = {

  posiadane() { return Bohater.stan.artefakty || []; },

  // Trzy gniazda: amulet, pierścień na lewej i na prawej ręce.
  GNIAZDA: ['amulet', 'pierscienL', 'pierscienP'],

  // Jakiego typu artefakt wchodzi do danego gniazda.
  typGniazda(gniazdo) { return gniazdo === 'amulet' ? 'amulet' : 'pierscien'; },

  wGniezdzie(gniazdo) {
    const id = Bohater.stan[gniazdo];
    return id ? ARTEFAKTY[id] : null;
  },

  zalozone() {
    return this.GNIAZDA.map(g => this.wGniezdzie(g)).filter(Boolean);
  },

  // Zgodność ze starym kodem: „ten założony" to amulet.
  zalozony() { return this.wGniezdzie('amulet'); },

  ma(id) { return this.posiadane().includes(id); },

  // W którym gnieździe siedzi dany artefakt (albo null).
  gniazdoArtefaktu(id) {
    return this.GNIAZDA.find(g => Bohater.stan[g] === id) || null;
  },

  // Zmiana artefaktu jest DARMOWA — design chce zachęcać do eksperymentów.
  //  Ten sam przedmiot nie może siedzieć w dwóch gniazdach naraz, bo
  //  modyfikatory się sumują i dwa identyczne pierścienie podwajałyby efekt.
  zaloz(id, gniazdo) {
    const a = id === null ? null : ARTEFAKTY[id];
    if (id !== null && (!a || !this.ma(id))) return false;

    const cel = gniazdo || (a ? (a.typ === 'pierscien' ? this.wolnePierscien() : 'amulet') : 'amulet');
    if (a && this.typGniazda(cel) !== a.typ) return false;

    if (a) {
      const gdzieIndziej = this.gniazdoArtefaktu(id);
      if (gdzieIndziej && gdzieIndziej !== cel) Bohater.stan[gdzieIndziej] = null;
    }
    Bohater.stan[cel] = id;
    return true;
  },

  // Pierwszy wolny palec, a jak oba zajęte — lewy.
  wolnePierscien() {
    return !Bohater.stan.pierscienL ? 'pierscienL'
         : !Bohater.stan.pierscienP ? 'pierscienP'
         : 'pierscienL';
  },

  dodaj(id) {
    if (!ARTEFAKTY[id]) return false;
    if (this.ma(id)) return false;            // duplikat trafia do skupu
    Bohater.stan.artefakty.push(id);
    // Pierwszy artefakt danego rodzaju zakładamy sami — zeby gracz od razu
    // zobaczyl, ze cos sie dzieje.
    const a = ARTEFAKTY[id];
    const gniazdo = a.typ === 'pierscien' ? this.wolnePierscien() : 'amulet';
    if (!Bohater.stan[gniazdo]) Bohater.stan[gniazdo] = id;
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
    // Sprzedany artefakt znika takze z palca albo z szyi.
    this.GNIAZDA.forEach(g => { if (Bohater.stan[g] === id) Bohater.stan[g] = null; });
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
