// ============================================================
//  REKLAMY NAGRADZANE — na razie ZAŚLEPKA
//
//  W grze nie ma jeszcze żadnej sieci reklamowej. Ten moduł udaje
//  obejrzenie reklamy: pokazuje planszę na ułamek sekundy i od razu
//  daje nagrodę, żeby dało się przeklikać i ocenić cały przepływ bez
//  czekania 30 sekund na film.
//
//  CO ZMIENIĆ PRZY WYDANIU NA ANDROIDA: tylko ciało metody `pokaz()` —
//  zamiast planszy-zaślepki odpalić prawdziwą reklamę i wywołać
//  `gotowe()` dopiero, gdy gracz ją dooglądał. Reszta (limity dzienne,
//  nagrody, przyciski) zostaje bez zmian.
//
//  Zasada z design/arena_ekonomia.md sekcja 2: reklamy TYLKO nagradzane,
//  zawsze dobrowolne, z limitami dziennymi. Zero reklam między walkami.
// ============================================================

const Reklama = {

  ZASLEPKA: true,            // false = prawdziwa sieć reklamowa
  CZAS_ZASLEPKI_MS: 900,     // ile trwa udawana reklama

  // ---------- limity dzienne ----------

  dzisiaj() {
    const d = new Date();
    return `${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
  },

  // Licznik siedzi w zapisie bohatera, żeby przetrwał zamknięcie gry.
  licznik() {
    const b = Bohater.stan;
    if (!b.reklamy || b.reklamy.dzien !== this.dzisiaj()) {
      b.reklamy = { dzien: this.dzisiaj(), uzyte: {} };
    }
    return b.reklamy;
  },

  limit(miejsce) { return CONFIG.reklamy.limityDzienne[miejsce] || 0; },

  zostalo(miejsce) {
    const l = this.licznik();
    return Math.max(0, this.limit(miejsce) - (l.uzyte[miejsce] || 0));
  },

  mozna(miejsce) { return this.zostalo(miejsce) > 0; },

  // ---------- obejrzenie ----------

  //  miejsce — klucz z CONFIG.reklamy.limityDzienne
  //  gotowe  — co zrobić, gdy gracz obejrzy reklamę do końca
  obejrzyj(miejsce, gotowe) {
    if (!this.mozna(miejsce)) return false;

    this.pokaz(() => {
      const l = this.licznik();
      l.uzyte[miejsce] = (l.uzyte[miejsce] || 0) + 1;
      Zapis.zapisz();
      gotowe();
    });
    return true;
  },

  // Jedyne miejsce do podmiany, gdy dojdzie prawdziwa sieć reklamowa.
  pokaz(gotowe) {
    if (!this.ZASLEPKA) return gotowe();     // tu wejdzie prawdziwa reklama

    const plansza = document.createElement('div');
    plansza.className = 'reklama-zaslepka';
    plansza.innerHTML = `
      <div class="reklama-ramka">
        <strong>MIEJSCE NA REKLAMĘ</strong>
        <span>Wersja testowa — prawdziwa reklama pojawi się w wersji na Androida.</span>
      </div>`;
    document.body.appendChild(plansza);

    setTimeout(() => {
      plansza.remove();
      gotowe();
    }, this.CZAS_ZASLEPKI_MS);
  },

  // Gotowy wiersz z przyciskiem — żeby każdy panel wyglądał tak samo.
  //  akcja — napis w JS wywoływany po kliknięciu
  wiersz(miejsce, tytul, opis, akcja) {
    const zostalo = this.zostalo(miejsce);
    const mozna = zostalo > 0;
    return `
      <div class="oferta ${mozna ? '' : 'niestac'}">
        <span class="oferta-ikona">📺</span>
        <span class="oferta-tresc">
          <strong>${tytul}</strong>
          <span>${opis} · dziś zostało ${zostalo} z ${this.limit(miejsce)}</span>
        </span>
        ${mozna
          ? `<button class="oferta-kup reklama" onclick="${akcja}">Obejrzyj</button>`
          : '<span class="oferta-stan">na dziś koniec</span>'}
      </div>`;
  }
};
