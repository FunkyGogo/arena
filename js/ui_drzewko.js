// ============================================================
//  INTERFEJS DRZEWKA
//  Ekran rozwoju klasy: trzy gałęzie, wykupywanie rang,
//  przypisywanie akcji do czterech slotów, reset za złoto.
// ============================================================

const EkranDrzewka = {

  el: {},
  wybranyGalaz: null,
  wybranySlot: null,          // gdy nie null, wybieramy akcję do tego slotu

  start() {
    const id = x => document.getElementById(x);
    this.el = {
      ekran: id('ekran-drzewka'),
      pu: id('drzewko-pu'),
      zakladki: id('drzewko-zakladki'),
      wezly: id('drzewko-wezly'),
      sloty: id('drzewko-sloty'),
      reset: id('drzewko-reset'),
      zamknij: id('drzewko-zamknij')
    };
    this.el.zamknij.addEventListener('click', () => this.schowaj());
    this.el.reset.addEventListener('click', () => this.zresetuj());
  },

  pokaz() {
    const galezie = Object.keys(Drzewko.drzewo().galezie);
    if (!this.wybranyGalaz || !galezie.includes(this.wybranyGalaz)) {
      this.wybranyGalaz = galezie[0];
    }
    this.wybranySlot = null;
    this.rysuj();
    this.el.ekran.classList.add('widoczny');
  },

  schowaj() {
    this.el.ekran.classList.remove('widoczny');
    UI.zbudujPasek();
    Miasto.rysujNaglowek();
    Zapis.zapisz();
  },

  rysuj() {
    this.rysujNaglowek();
    this.rysujZakladki();
    this.rysujWezly();
    this.rysujSloty();
  },

  rysujNaglowek() {
    const koszt = Drzewko.kosztResetu();
    this.el.pu.innerHTML = `Punkty umiejętności: <strong>${Bohater.stan.pu}</strong>`;
    this.el.reset.textContent = `Zresetuj drzewko (🪙 ${koszt})`;
    this.el.reset.disabled = Bohater.stan.zloto < koszt || Drzewko.wydanePU() === 0;
  },

  rysujZakladki() {
    const galezie = Drzewko.drzewo().galezie;
    this.el.zakladki.innerHTML = '';

    Object.entries(galezie).forEach(([id, g]) => {
      const b = document.createElement('button');
      b.className = 'zakladka' + (id === this.wybranyGalaz ? ' aktywna' : '');
      b.innerHTML = `<span class="zakladka-ikona">${g.ikona}</span>
                     <span class="zakladka-nazwa">${g.nazwa}</span>
                     <span class="zakladka-pu">${Drzewko.wydanePUwGalezi(id)} PU</span>`;
      b.addEventListener('click', () => { this.wybranyGalaz = id; this.rysuj(); });
      this.el.zakladki.appendChild(b);
    });
  },

  rysujWezly() {
    const wezly = Drzewko.wezly();
    this.el.wezly.innerHTML = '';

    Object.entries(wezly)
      .filter(([, w]) => w.galaz === this.wybranyGalaz)
      .forEach(([id, w]) => {
        const ranga = Drzewko.ranga(id);
        const blokada = Drzewko.dlaczegoNieMozna(id);
        const maks = ranga >= w.rangi;

        const kropki = Array.from({ length: w.rangi }, (_, i) =>
          `<span class="kropka ${i < ranga ? 'pelna' : ''}"></span>`).join('');

        const el = document.createElement('div');
        el.className = 'wezel'
          + (ranga > 0 ? ' wykupiony' : '')
          + (w.typ === 'zwienczenie' ? ' zwienczenie' : '')
          + (blokada && !maks ? ' niedostepny' : '');

        el.innerHTML = `
          <span class="wezel-ikona">${w.ikona}</span>
          <span class="wezel-tresc">
            <strong>${w.nazwa} <span class="wezel-typ">${this.etykietaTypu(w.typ)}</span></strong>
            <span class="wezel-opis">${w.opis}</span>
            <span class="wezel-rangi">${kropki}<span class="wezel-stan">${
              maks ? 'maksymalna ranga' : (blokada || `${w.kosztPU} PU za rangę ${ranga + 1}`)
            }</span></span>
          </span>
          ${maks ? '<span class="wezel-gotowe">✓</span>'
                 : `<button class="wezel-kup" ${blokada ? 'disabled' : ''}
                      onclick="EkranDrzewka.wykup('${id}')">+</button>`}`;

        this.el.wezly.appendChild(el);
      });
  },

  etykietaTypu(typ) {
    return {
      aktywna: 'akcja', generator: 'generator', finiszer: 'finiszer',
      pasywna: 'pasywna', zwienczenie: 'zwieńczenie'
    }[typ] || typ;
  },

  wykup(idWezla) {
    if (Drzewko.wykup(idWezla)) { this.rysuj(); Zapis.zapisz(); }
  },

  zresetuj() {
    if (!confirm('Zresetować drzewko? Punkty wrócą, złoto przepadnie.')) return;
    if (Drzewko.zresetuj()) { this.rysuj(); Zapis.zapisz(); }
  },

  // ---------- sloty ----------

  rysujSloty() {
    const sloty = Bohater.stan.sloty;
    this.el.sloty.innerHTML = '';

    // Cztery sloty
    const rzad = document.createElement('div');
    rzad.className = 'rzad-slotow';

    sloty.forEach((idAkcji, numer) => {
      const um = idAkcji ? UMIEJETNOSCI[idAkcji] : null;
      const b = document.createElement('button');
      b.className = 'slot' + (this.wybranySlot === numer ? ' wybrany' : '') + (um ? '' : ' pusty');
      b.innerHTML = um
        ? `<span class="slot-ikona">${um.ikona}</span><span class="slot-nazwa">${um.nazwa}</span>`
        : `<span class="slot-ikona">+</span><span class="slot-nazwa">pusty</span>`;
      b.addEventListener('click', () => {
        this.wybranySlot = this.wybranySlot === numer ? null : numer;
        this.rysujSloty();
      });
      rzad.appendChild(b);
    });
    this.el.sloty.appendChild(rzad);

    // Lista akcji do wstawienia, gdy slot jest wybrany
    if (this.wybranySlot === null) {
      const p = document.createElement('p');
      p.className = 'slot-podpowiedz';
      p.textContent = 'Dotknij slotu, żeby wybrać, co ma w nim być.';
      this.el.sloty.appendChild(p);
      return;
    }

    const dostepne = Drzewko.dostepneAkcje();
    const lista = document.createElement('div');
    lista.className = 'lista-akcji';

    if (!dostepne.length) {
      lista.innerHTML = '<p class="slot-podpowiedz">Nie masz jeszcze żadnych akcji — wykup węzeł w drzewku.</p>';
    } else {
      dostepne.forEach(idAkcji => {
        const um = UMIEJETNOSCI[idAkcji];
        const juzWSlocie = Bohater.stan.sloty[this.wybranySlot] === idAkcji;
        const b = document.createElement('button');
        b.className = 'akcja-do-slotu' + (juzWSlocie ? ' aktywna' : '');
        b.innerHTML = `<span class="slot-ikona">${um.ikona}</span>
                       <span class="slot-nazwa">${um.nazwa}</span>`;
        b.addEventListener('click', () => {
          Drzewko.ustawSlot(this.wybranySlot, idAkcji);
          this.wybranySlot = null;
          this.rysujSloty();
          Zapis.zapisz();
        });
        lista.appendChild(b);
      });

      const wyczysc = document.createElement('button');
      wyczysc.className = 'akcja-do-slotu pusty';
      wyczysc.innerHTML = '<span class="slot-ikona">✕</span><span class="slot-nazwa">opróżnij</span>';
      wyczysc.addEventListener('click', () => {
        Drzewko.ustawSlot(this.wybranySlot, null);
        this.wybranySlot = null;
        this.rysujSloty();
        Zapis.zapisz();
      });
      lista.appendChild(wyczysc);
    }

    this.el.sloty.appendChild(lista);
  }
};
