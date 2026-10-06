// ============================================================
//  ŁUCZNIK — umiejętności, liczby i drzewko
//  (design/arena_klasa_lucznik.md)
//
//  Klasa-pomost: fizyczna i z dystansu, ale strzały żywiołowe
//  dają statusy jak magowi — bez zarządzania maną.
//  Całą jej grą jest kontrola dystansu: "nie daj się dopaść".
//
//  Wszystko w jednym pliku, bo to zamknięta całość — łatwiej
//  stroić i łatwiej będzie dołożyć maga i druida tym samym wzorem.
// ============================================================

// ---------- liczby (dokładane do CONFIG.akcje) ----------

Object.assign(CONFIG.akcje, {
  strzal:      { koszt: 0, mnoznikObrazen: 1.0, zwrotZasobu: 1 },

  // Czas 2, nie 1: statusy odliczaja sie na poczatku Twojej tury,
  // wiec przy 1 wziecie na cel wygaslo by przed strzalem.
  wezNaCel:    { koszt: 0, zwrotZasobu: 5, turyDzialania: 2 },

  celnyStrzal: { koszt: 4, mnoznikObrazen: 1.7, bonusSzansyKrytyka: 0.20 },

  przebijajacyGrot: { koszt: 4, mnoznikObrazen: 1.3, przebiciePancerza: 0.75 },

  ognistaStrzala: { koszt: 4, mnoznikObrazen: 1.0, zywiol: 'ogien',
                    obrazeniaPodpalenia: 5, turyDzialania: 3, celeObszarowe: 0 },

  lodowaStrzala:  { koszt: 4, mnoznikObrazen: 1.0, zywiol: 'lod',
                    oslabienieZrecznosci: 2, turyDzialania: 3, szansaZamrozenia: 0 },

  zatrutyGrot:    { koszt: 3, mnoznikObrazen: 0.8, zywiol: 'natura',
                    obrazeniaZatrucia: 3, skalowanieOdSily: 0.3,
                    maksStackow: 3, turyDzialania: 3 },

  odskok:      { koszt: 3, mnoznikObrazen: 0.8 },

  sidla:       { koszt: 5, turyDzialania: 3 },

  gradStrzal:  { koszt: 6, mnoznikObrazen: 0.9, celeObszarowe: 1 },

  zabojczyStrzal: { koszt: 8, mnoznikObrazen: 2.2, bonusZDaleka: 0.8,
                    bonusSzansyKrytyka: 0.15, progDobicia: 0.15 },

  deszczZywiolow: { koszt: 10, mnoznikObrazen: 1.2,
                    obrazeniaPodpalenia: 4, oslabienieZrecznosci: 2,
                    obrazeniaZatrucia: 3, maksStackow: 3, turyDzialania: 3 }
});

// ---------- umiejętności ----------

Object.assign(UMIEJETNOSCI, {

  strzal: {
    id: 'strzal', nazwa: 'Strzał', ikona: '🏹',
    typ: 'atak', klasa: 'lucznik', galaz: 'podstawa',
    opis: 'Atak podstawowy z dystansu. Nic nie kosztuje i dokłada Skupienia.'
  },

  wezNaCel: {
    id: 'wezNaCel', nazwa: 'Weź na cel', ikona: '🎯',
    typ: 'ukrycie', klasa: 'lucznik', galaz: 'Rdzeń', nakladaStatus: 'wziecieNaCel',
    opis: 'Generator. Ładuje Skupienie, a następny strzał jest pewny i krytyczny.'
  },

  celnyStrzal: {
    id: 'celnyStrzal', nazwa: 'Celny strzał', ikona: '🎯',
    typ: 'atak', klasa: 'lucznik', galaz: 'Celność',
    opis: 'Mierzony strzał o wysokiej szansie na krytyka.'
  },

  przebijajacyGrot: {
    id: 'przebijajacyGrot', nazwa: 'Przebijający grot', ikona: '⛏',
    typ: 'atak', klasa: 'lucznik', galaz: 'Celność',
    opis: 'Ciężki grot ignoruje większość pancerza. Odpowiedź na opancerzonych bez magii.'
  },

  ognistaStrzala: {
    id: 'ognistaStrzala', nazwa: 'Ognista strzała', ikona: '🔥',
    typ: 'atak', klasa: 'lucznik', galaz: 'Strzały żywiołowe', nakladaStatus: 'podpalenie',
    opis: 'Płonący grot: obrażenia ognia (omijają pancerz) i Podpalenie.'
  },

  lodowaStrzala: {
    id: 'lodowaStrzala', nazwa: 'Lodowa strzała', ikona: '❄',
    typ: 'atak', klasa: 'lucznik', galaz: 'Strzały żywiołowe', nakladaStatus: 'wychlodzenie',
    opis: 'Mróz spowalnia wroga — król kitingu. Dłużej dobiega, Ty dłużej strzelasz.'
  },

  zatrutyGrot: {
    id: 'zatrutyGrot', nazwa: 'Zatruty grot', ikona: '🌿',
    typ: 'atak', klasa: 'lucznik', galaz: 'Strzały żywiołowe', nakladaStatus: 'zatrucie',
    opis: 'Słaby strzał, ale jad omija pancerz i narasta.'
  },

  odskok: {
    id: 'odskok', nazwa: 'Odskok', ikona: '💨',
    typ: 'odskok', klasa: 'lucznik', galaz: 'Łowca',
    opis: 'Odpychasz się z powrotem na Daleko i strzelasz w biegu. Serce kitingu.'
  },

  sidla: {
    id: 'sidla', nazwa: 'Sidła', ikona: '🪤',
    typ: 'postawa', klasa: 'lucznik', galaz: 'Łowca', nakladaStatus: 'usidlenie',
    opis: 'Zastawiasz pułapkę: wróg nie zdoła skrócić dystansu, dopóki się nie wyrwie.'
  },

  gradStrzal: {
    id: 'gradStrzal', nazwa: 'Grad strzał', ikona: '🌧',
    typ: 'atak', klasa: 'lucznik', galaz: 'Łowca',
    opis: 'Salwa w całą grupę. Odpowiedź na watahy.'
  },

  zabojczyStrzal: {
    id: 'zabojczyStrzal', nazwa: 'Zabójczy strzał', ikona: '💀',
    typ: 'atak', klasa: 'lucznik', galaz: 'Celność',
    opis: 'Zwieńczenie Celności: miażdżący strzał, z Daleka jeszcze mocniejszy. Ciężko rannych dobija.'
  },

  deszczZywiolow: {
    id: 'deszczZywiolow', nazwa: 'Deszcz żywiołów', ikona: '🌈',
    typ: 'salwa', klasa: 'lucznik', galaz: 'Strzały żywiołowe',
    opis: 'Zwieńczenie: salwa, która nakłada naraz Podpalenie, Wychłodzenie i Zatrucie.'
  }
});

// ---------- drzewko ----------

DRZEWKA.lucznik = {
  galezie: {
    rdzen:     { nazwa: 'Rdzeń',    ikona: '🏹', opis: 'To, co ma każdy łucznik' },
    celnosc:   { nazwa: 'Celność',  ikona: '🎯', opis: 'Precyzja i anty-pancerz' },
    zywiolowe: { nazwa: 'Żywioły',  ikona: '🔥', opis: 'Strzały ze statusami' },
    lowca:     { nazwa: 'Łowca',    ikona: '🪤', opis: 'Dystans, kiting, pułapki' }
  },

  wezly: {
    // --- Rdzeń ---
    wezNaCel: {
      nazwa: 'Weź na cel', ikona: '🎯', typ: 'generator', galaz: 'rdzen',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'wezNaCel',
      opis: 'Generator Skupienia. Następny strzał pewny i krytyczny.',
      naRange: [{}, { zwrotZasobu: 2 }, { zwrotZasobu: 2 }]
    },
    sokoleOko: {
      nazwa: 'Sokole oko', ikona: '👁', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'wezNaCel', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Gdy jesteś Daleko, strzelasz mocniej i celniej w słabe punkty.',
      mod: { obrazeniaZDaleka: 0.08, szansaKrytyka: 0.03 }
    },
    kolczan: {
      nazwa: 'Kołczan', ikona: '🎒', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'wezNaCel', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Więcej Skupienia i tańsze strzały specjalne.',
      mod: { maxZasobu: 3 }
    },

    // --- Celność ---
    celnyStrzal: {
      nazwa: 'Celny strzał', ikona: '🎯', typ: 'aktywna', galaz: 'celnosc',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'celnyStrzal',
      opis: 'Mierzony strzał o wysokiej szansie na krytyka.',
      naRange: [{}, { mnoznikObrazen: 0.3 }, { bonusSzansyKrytyka: 0.15 }]
    },
    przebijajacyGrot: {
      nazwa: 'Przebijający grot', ikona: '⛏', typ: 'aktywna', galaz: 'celnosc',
      rodzic: 'celnyStrzal', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'przebijajacyGrot',
      opis: 'Ignoruje większość pancerza — anty-armor bez magii.',
      naRange: [{}, { przebiciePancerza: 0.15 }, { mnoznikObrazen: 0.3 }]
    },
    snajper: {
      nazwa: 'Snajper', ikona: '🔭', typ: 'pasywna', galaz: 'celnosc',
      rodzic: 'celnyStrzal', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Twoje krytyki są częstsze i mocniejsze.',
      mod: { szansaKrytyka: 0.04, mnoznikKrytyka: 0.12 }
    },
    slabyPunkt: {
      nazwa: 'Słaby punkt', ikona: '🩸', typ: 'pasywna', galaz: 'celnosc',
      rodzic: 'snajper', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Krytyk otwiera ranę — cel zaczyna krwawić.',
      mod: { krwawienieZKrytyka: 3 }
    },
    zabojczyStrzal: {
      nazwa: 'Zabójczy strzał', ikona: '💀', typ: 'zwienczenie', galaz: 'celnosc',
      rodzic: 'przebijajacyGrot', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'zabojczyStrzal',
      opis: 'Miażdżący strzał. Z Daleka bije jeszcze mocniej, a ciężko rannych dobija.'
    },

    // --- Strzały żywiołowe ---
    ognistaStrzala: {
      nazwa: 'Ognista strzała', ikona: '🔥', typ: 'aktywna', galaz: 'zywiolowe',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'ognistaStrzala',
      opis: 'Obrażenia ognia i Podpalenie.',
      naRange: [{}, { obrazeniaPodpalenia: 2 }, { celeObszarowe: 1 }]
    },
    lodowaStrzala: {
      nazwa: 'Lodowa strzała', ikona: '❄', typ: 'aktywna', galaz: 'zywiolowe',
      rodzic: null, odPoziomu: 2, rangi: 3, kosztPU: 1, akcja: 'lodowaStrzala',
      opis: 'Spowalnia wroga — dłużej do Ciebie biegnie.',
      naRange: [{}, { oslabienieZrecznosci: 1 }, { szansaZamrozenia: 0.30 }]
    },
    zatrutyGrot: {
      nazwa: 'Zatruty grot', ikona: '🌿', typ: 'aktywna', galaz: 'zywiolowe',
      rodzic: 'ognistaStrzala', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'zatrutyGrot',
      opis: 'Jad omija pancerz i narasta.',
      naRange: [{}, { maksStackow: 1 }, { turyDzialania: 2 }]
    },
    mistrzZywiolow: {
      nazwa: 'Mistrz żywiołów', ikona: '✨', typ: 'pasywna', galaz: 'zywiolowe',
      rodzic: 'lodowaStrzala', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Statusy z Twoich strzał są mocniejsze i trwają dłużej.',
      mod: { obrazeniaTrucizny: 1, turyTrucizny: 1, mocStatusowZywiolowych: 1 }
    },
    deszczZywiolow: {
      nazwa: 'Deszcz żywiołów', ikona: '🌈', typ: 'zwienczenie', galaz: 'zywiolowe',
      rodzic: 'mistrzZywiolow', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'deszczZywiolow',
      opis: 'Salwa, która nakłada naraz wszystkie Twoje statusy żywiołowe.'
    },

    // --- Łowca ---
    odskok: {
      nazwa: 'Odskok', ikona: '💨', typ: 'aktywna', galaz: 'lowca',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'odskok',
      opis: 'Wracasz na Daleko i strzelasz w biegu.',
      naRange: [{}, { mnoznikObrazen: 0.3 }, { koszt: -1 }]
    },
    sidla: {
      nazwa: 'Sidła', ikona: '🪤', typ: 'aktywna', galaz: 'lowca',
      rodzic: 'odskok', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'sidla',
      opis: 'Pułapka trzyma wroga na dystans — nie dobiegnie, póki się nie wyrwie.',
      naRange: [{}, { turyDzialania: 1 }, { turyDzialania: 1 }]
    },
    gradStrzal: {
      nazwa: 'Grad strzał', ikona: '🌧', typ: 'aktywna', galaz: 'lowca',
      rodzic: 'odskok', odPoziomu: 4, rangi: 3, kosztPU: 1, akcja: 'gradStrzal',
      opis: 'Salwa w grupę — odpowiedź na watahy.',
      naRange: [{}, { celeObszarowe: 1 }, { mnoznikObrazen: 0.3 }]
    },
    instynktLowcy: {
      nazwa: 'Instynkt łowcy', ikona: '🐾', typ: 'pasywna', galaz: 'lowca',
      rodzic: 'sidla', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Wróg dłużej do Ciebie biegnie, a Ty z dystansu bijesz mocniej.',
      mod: { turyDobiegania: 1, obrazeniaZDaleka: 0.06 }
    },
    mistrzLowow: {
      nazwa: 'Mistrz łowów', ikona: '👑', typ: 'zwienczenie', galaz: 'lowca',
      rodzic: 'instynktLowcy', odPoziomu: 7, rangi: 1, kosztPU: 2,
      opis: 'Kiting kosztuje mniej, a złapani w sidła trzymają się dłużej.',
      mod: { znizkaKosztu: 1, turyDobiegania: 1, obrazeniaZDaleka: 0.10 }
    }
  }
};
