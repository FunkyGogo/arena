// ============================================================
//  SYLWETKI
//  Grafiki z nano banana mają jednolite, jasne tło (JPEG nie umie
//  przezroczystości). Tutaj wycinamy je tło, żeby postać stała na arenie,
//  a nie w jasnym prostokącie.
//
//  Sposób: „rozlewamy" przezroczystość od krawędzi obrazu do środka,
//  dopóki piksele są podobne do koloru rogu. Dzięki temu jasna skóra
//  w środku postaci zostaje nietknięta.
// ============================================================

const Sylwetki = {

  // --- ustawienia do strojenia ---
  tolerancja: 60,       // ile piksel może się różnić od tła, żeby go wyciąć
  tolerancjaWyspy: 34,  // ciaśniejszy próg na tło zamknięte przez postać (np. między ręką a tułowiem)
  tolerancjaBrzegu: 130, // luźniejszy próg na obwódkę po kompresji JPEG
  przejsciaBrzegu: 2,   // ile razy czyścimy obwódkę
  maxBok: 900,          // obraz skalujemy w dół — telefon nie udźwignie 2K w pamięci

  pamiec: {},           // ścieżka -> gotowy obrazek (dataURL)
  wKolejce: {},         // ścieżka -> obietnica, żeby nie liczyć dwa razy

  // Zwraca gotowy obrazek z przezroczystym tłem.
  // odbij = true odwraca postać w poziomie (tańsze niż generowanie grafiki od nowa).
  pobierz(sciezka, odbij) {
    const klucz = sciezka + (odbij ? '|odbite' : '');
    if (this.pamiec[klucz]) return Promise.resolve(this.pamiec[klucz]);
    if (this.wKolejce[klucz]) return this.wKolejce[klucz];

    this.wKolejce[klucz] = this.wczytajLekka(sciezka)
      .then(obraz => {
        const gotowy = this.wytnijTlo(obraz, odbij);   // { url, szerokosc, wysokosc }
        this.pamiec[klucz] = gotowy;
        delete this.wKolejce[klucz];
        return gotowy;
      })
      .catch(blad => {
        delete this.wKolejce[klucz];
        console.warn('Sylwetki:', blad.message);
        return null;
      });

    return this.wKolejce[klucz];
  },

  // Wstawia grafikę do elementu <img>. Gdy plik nie istnieje, nic nie psuje.
  // Zwraca opis grafiki (wymiary po przycięciu) albo null.
  ustaw(element, sciezka, odbij) {
    if (!element) return Promise.resolve(null);
    return this.pobierz(sciezka, odbij).then(gotowy => {
      if (!gotowy) return null;
      element.src = gotowy.url;
      return gotowy;
    });
  },

  // Przygotowuje grafiki z góry, po kolei, żeby nie zaciąć telefonu.
  przygotuj(sciezki) {
    return sciezki.reduce((p, s) => p.then(() => this.pobierz(s)), Promise.resolve());
  },

  // Najpierw lekka kopia z assets/male/ (robi ją narzedzia/zmniejsz_postacie.ps1).
  // Gdy jej nie ma — na przykład dla świeżo wygenerowanej grafiki — wczytujemy
  // oryginał 2K, więc gra działa zawsze, tylko wolniej.
  wczytajLekka(sciezka) {
    const przedrostek = 'assets/';
    if (!sciezka.startsWith(przedrostek) || sciezka.startsWith('assets/male/')) {
      return this.wczytaj(sciezka);
    }

    const lekka = 'assets/male/' + sciezka.slice(przedrostek.length);
    return this.wczytaj(lekka).catch(() => this.wczytaj(sciezka));
  },

  // Znacznik wersji doklejany do adresu grafiki. Bez niego przegladarka
  // trzyma stary obrazek pod tym samym adresem i poprawiona poza nie
  // dociera do gracza — tak wlasnie stalo sie z Murmillem.
  // Ustawia go narzedzia/zbuduj_strone.js przy kazdej wysylce.
  wersja() {
    return (typeof window !== 'undefined' && window.WERSJA_GRAFIK)
      ? '?v=' + window.WERSJA_GRAFIK : '';
  },

  wczytaj(sciezka) {
    return new Promise((gotowe, blad) => {
      const obraz = new Image();
      obraz.onload = () => gotowe(obraz);
      obraz.onerror = () => blad(new Error('nie wczytano ' + sciezka));
      obraz.src = sciezka + this.wersja();
    });
  },

  wytnijTlo(obraz, odbij) {
    const skala = Math.min(1, this.maxBok / Math.max(obraz.width, obraz.height));
    const w = Math.max(1, Math.round(obraz.width * skala));
    const h = Math.max(1, Math.round(obraz.height * skala));

    const plotno = document.createElement('canvas');
    plotno.width = w;
    plotno.height = h;
    const kontekst = plotno.getContext('2d', { willReadFrequently: true });

    // Odbicie lustrzane: postać narysowana „w złą stronę" idzie w drugą.
    if (odbij) {
      kontekst.translate(w, 0);
      kontekst.scale(-1, 1);
    }
    kontekst.drawImage(obraz, 0, 0, w, h);
    if (odbij) kontekst.setTransform(1, 0, 0, 1, 0, 0);

    const obrazek = kontekst.getImageData(0, 0, w, h);
    const p = obrazek.data;

    // Kolor tła bierzemy z lewego górnego rogu.
    const tloR = p[0], tloG = p[1], tloB = p[2];
    const roznica = i => {
      const k = i * 4;
      return Math.abs(p[k] - tloR) + Math.abs(p[k + 1] - tloG) + Math.abs(p[k + 2] - tloB);
    };

    // 1) Rozlewanie od krawędzi w głąb obrazu.
    const wyciety = new Uint8Array(w * h);
    const stos = [];
    for (let x = 0; x < w; x++) { stos.push(x, (h - 1) * w + x); }
    for (let y = 0; y < h; y++) { stos.push(y * w, y * w + w - 1); }

    while (stos.length) {
      const i = stos.pop();
      if (wyciety[i] || roznica(i) > this.tolerancja) continue;
      wyciety[i] = 1;
      p[i * 4 + 3] = 0;

      const x = i % w, y = (i / w) | 0;
      if (x > 0)     stos.push(i - 1);
      if (x < w - 1) stos.push(i + 1);
      if (y > 0)     stos.push(i - w);
      if (y < h - 1) stos.push(i + w);
    }

    // 2) Wysepki tła zamknięte przez postać — np. prześwit między ręką
    //    a tułowiem. Rozlewanie tam nie dotrze, więc bierzemy je progiem,
    //    ciaśniejszym, żeby nie tknąć jasnej skóry.
    for (let i = 0; i < w * h; i++) {
      if (!wyciety[i] && roznica(i) <= this.tolerancjaWyspy) {
        wyciety[i] = 1;
        p[i * 4 + 3] = 0;
      }
    }

    // 3) Obwódka: JPEG rozmywa krawędź, więc dokładamy kilka pikseli
    //    z luźniejszym progiem — ale tylko przy już wyciętym tle.
    for (let przebieg = 0; przebieg < this.przejsciaBrzegu; przebieg++) {
      const doWyciecia = [];
      for (let i = 0; i < w * h; i++) {
        if (wyciety[i] || roznica(i) > this.tolerancjaBrzegu) continue;
        const x = i % w, y = (i / w) | 0;
        const sasiadWyciety =
          (x > 0     && wyciety[i - 1]) ||
          (x < w - 1 && wyciety[i + 1]) ||
          (y > 0     && wyciety[i - w]) ||
          (y < h - 1 && wyciety[i + w]);
        if (sasiadWyciety) doWyciecia.push(i);
      }
      if (!doWyciecia.length) break;
      doWyciecia.forEach(i => { wyciety[i] = 1; p[i * 4 + 3] = 0; });
    }

    kontekst.putImageData(obrazek, 0, 0);

    // 4) Przycinamy do samej postaci. Dzięki temu każda poza ma stopy
    //    dokładnie na dole obrazka i nie niesie pustego zapasu nad głową —
    //    inaczej przy zmianie pozy postać skakałaby po ekranie.
    return this.przytnij(plotno, p, w, h);
  },

  przytnij(plotno, p, w, h) {
    let lewo = w, prawo = -1, gora = h, dol = -1;

    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        if (p[(y * w + x) * 4 + 3] < 12) continue;   // prawie przezroczysty = tło
        if (x < lewo)  lewo = x;
        if (x > prawo) prawo = x;
        if (y < gora)  gora = y;
        if (y > dol)   dol = y;
      }
    }
    if (prawo < 0) return { url: plotno.toDataURL('image/png'), szerokosc: w, wysokosc: h };

    const margines = 2;
    lewo  = Math.max(0, lewo - margines);
    gora  = Math.max(0, gora - margines);
    prawo = Math.min(w - 1, prawo + margines);
    dol   = Math.min(h - 1, dol + margines);

    const szerokosc = prawo - lewo + 1;
    const wysokosc  = dol - gora + 1;

    const przyciete = document.createElement('canvas');
    przyciete.width = szerokosc;
    przyciete.height = wysokosc;
    przyciete.getContext('2d').drawImage(plotno, lewo, gora, szerokosc, wysokosc, 0, 0, szerokosc, wysokosc);

    return { url: przyciete.toDataURL('image/png'), szerokosc, wysokosc };
  }
};
