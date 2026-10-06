// ============================================================
//  MAG — umiejętności, liczby i drzewko
//  (design/arena_klasy_magiczne.md)
//
//  Szklana armata na pancerz: żywioły OMIJAJĄ pancerz, więc
//  opancerzony boss, który jest ścianą dla wojownika, dla maga
//  jest celem idealnym. Ale dwa dobre ciosy i mag leży.
// ============================================================

Object.assign(CONFIG.akcje, {
  iskra:      { koszt: 0, mnoznikObrazen: 1.0, zwrotZasobu: 1, zywiol: 'blyskawica' },

  medytacja:  { koszt: 0, zwrotZasobu: 12, redukcjaObrazen: 0, turyDzialania: 2 },

  // --- Ogień ---
  kulaOgnia:  { koszt: 5, mnoznikObrazen: 1.5, zywiol: 'ogien',
                obrazeniaPodpalenia: 5, turyDzialania: 3, celeObszarowe: 0 },
  pozoga:     { koszt: 7, mnoznikObrazen: 1.0, zywiol: 'ogien',
                obrazeniaPodpalenia: 9, turyDzialania: 4 },
  kataklizm:  { koszt: 14, mnoznikObrazen: 1.6, zywiol: 'ogien',
                celeObszarowe: 3, detonujePodpalenia: 1.5 },

  // --- Lód ---
  odlamkiLodu:  { koszt: 5, mnoznikObrazen: 1.4, zywiol: 'lod',
                  oslabienieZrecznosci: 2, turyDzialania: 3, szansaZamrozenia: 0 },
  lodowaZbroja: { koszt: 6, pochlanianie: 22, turyDzialania: 4 },
  absolutneZero:{ koszt: 12, mnoznikObrazen: 2.2, zywiol: 'lod',
                  turyOgluszenia: 2, bonusNaZmarznietych: 0.8 },

  // --- Błyskawica ---
  grom:            { koszt: 6, mnoznikObrazen: 1.8, zywiol: 'blyskawica',
                     oslabienieCelnosci: 3, turyDzialania: 3, szansaOgluszenia: 0 },
  lancuchBlyskawic:{ koszt: 7, mnoznikObrazen: 1.2, zywiol: 'blyskawica', celeObszarowe: 1 },
  gniewJowisza:    { koszt: 14, mnoznikObrazen: 2.4, zywiol: 'blyskawica',
                     progObronyWroga: 5, bonusNaOpancerzonych: 0.8, turyOgluszenia: 2 }
});

Object.assign(UMIEJETNOSCI, {

  iskra: {
    id: 'iskra', nazwa: 'Iskra', ikona: '✨',
    typ: 'atak', klasa: 'mag', galaz: 'podstawa',
    opis: 'Atak podstawowy: słaby pocisk z dystansu. Nic nie kosztuje i dokłada Many.'
  },

  medytacja: {
    id: 'medytacja', nazwa: 'Medytacja', ikona: '🧘',
    typ: 'postawa', klasa: 'mag', galaz: 'Rdzeń', nakladaStatus: 'kanalizowanie',
    opis: 'Generator. Zużywasz turę, żeby odzyskać dużo Many.'
  },

  kulaOgnia: {
    id: 'kulaOgnia', nazwa: 'Kula ognia', ikona: '🔥',
    typ: 'atak', klasa: 'mag', galaz: 'Ogień', nakladaStatus: 'podpalenie',
    opis: 'Ognisty pocisk: obrażenia omijające pancerz i Podpalenie.'
  },

  pozoga: {
    id: 'pozoga', nazwa: 'Pożoga', ikona: '🌋',
    typ: 'atak', klasa: 'mag', galaz: 'Ogień', nakladaStatus: 'podpalenie',
    opis: 'Słaby cios, ale zostawia ciężkie, długie Podpalenie.'
  },

  kataklizm: {
    id: 'kataklizm', nazwa: 'Kataklizm', ikona: '☄',
    typ: 'atak', klasa: 'mag', galaz: 'Ogień',
    opis: 'Zwieńczenie Ognia: obszarowy wybuch, który detonuje wszystkie Podpalenia naraz.'
  },

  odlamkiLodu: {
    id: 'odlamkiLodu', nazwa: 'Odłamki lodu', ikona: '❄',
    typ: 'atak', klasa: 'mag', galaz: 'Lód', nakladaStatus: 'wychlodzenie',
    opis: 'Lodowe drzazgi spowalniają — a spowolniony wolniej do Ciebie biegnie.'
  },

  lodowaZbroja: {
    id: 'lodowaZbroja', nazwa: 'Lodowa zbroja', ikona: '🧊',
    typ: 'postawa', klasa: 'mag', galaz: 'Lód', nakladaStatus: 'bariera',
    opis: 'Bariera z lodu pochłania obrażenia, zanim sięgną Twojego HP.'
  },

  absolutneZero: {
    id: 'absolutneZero', nazwa: 'Absolutne zero', ikona: '🌨',
    typ: 'atak', klasa: 'mag', galaz: 'Lód', nakladaStatus: 'ogluszenie',
    opis: 'Zwieńczenie Lodu: zamraża cel i rozłupuje. Wobec już zmarzniętych bije znacznie mocniej.'
  },

  grom: {
    id: 'grom', nazwa: 'Grom', ikona: '⚡',
    typ: 'atak', klasa: 'mag', galaz: 'Błyskawica', nakladaStatus: 'porazenie',
    opis: 'Wysoki burst i Porażenie — wróg zaczyna pudłować.'
  },

  lancuchBlyskawic: {
    id: 'lancuchBlyskawic', nazwa: 'Łańcuch błyskawic', ikona: '🌩',
    typ: 'atak', klasa: 'mag', galaz: 'Błyskawica',
    opis: 'Trafia cel i przeskakuje na kolejnych. Odpowiedź na watahy.'
  },

  gniewJowisza: {
    id: 'gniewJowisza', nazwa: 'Gniew Jowisza', ikona: '👑',
    typ: 'atak', klasa: 'mag', galaz: 'Błyskawica', nakladaStatus: 'ogluszenie',
    opis: 'Zwieńczenie Błyskawicy: miażdżący cios. Wobec opancerzonych bonus i pewne ogłuszenie.'
  }
});

DRZEWKA.mag = {
  galezie: {
    rdzen:      { nazwa: 'Arkana',     ikona: '🔮', opis: 'To, co ma każdy mag' },
    ogien:      { nazwa: 'Ogień',      ikona: '🔥', opis: 'Spalanie i DoT' },
    lod:        { nazwa: 'Lód',        ikona: '❄',  opis: 'Kontrola i obrona' },
    blyskawica: { nazwa: 'Błyskawica', ikona: '⚡', opis: 'Burst i anty-pancerz' }
  },

  wezly: {
    // --- Arkana ---
    medytacja: {
      nazwa: 'Medytacja', ikona: '🧘', typ: 'generator', galaz: 'rdzen',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'medytacja',
      opis: 'Generator Many. Bez niej szybko zostajesz z samą iskrą.',
      naRange: [{}, { zwrotZasobu: 4 }, { zwrotZasobu: 4, redukcjaObrazen: 0.30 }]
    },
    iskra: {
      nazwa: 'Iskra', ikona: '✨', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'medytacja', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Twój atak podstawowy bije mocniej i daje więcej Many.',
      mod: { obrazeniaProcent: 0.05, zwrotZasobuPodstawowego: 1 }
    },
    arkanicznaWydajnosc: {
      nazwa: 'Arkaniczna wydajność', ikona: '📘', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'medytacja', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Więcej Many i tańsze czary.',
      mod: { maxZasobu: 6 }
    },
    wyczucieSlabosci: {
      nazwa: 'Wyczucie słabości', ikona: '🔎', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'iskra', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Gdy trafiasz w żywiołową słabość celu, bijesz jeszcze mocniej.',
      mod: { bonusZaSlabosc: 0.15 }
    },

    // --- Ogień ---
    kulaOgnia: {
      nazwa: 'Kula ognia', ikona: '🔥', typ: 'aktywna', galaz: 'ogien',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'kulaOgnia',
      opis: 'Podstawowy czar ognia z Podpaleniem.',
      naRange: [{}, { obrazeniaPodpalenia: 3 }, { celeObszarowe: 1 }]
    },
    pozoga: {
      nazwa: 'Pożoga', ikona: '🌋', typ: 'aktywna', galaz: 'ogien',
      rodzic: 'kulaOgnia', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'pozoga',
      opis: 'Ciężkie, długie Podpalenie — paliwo pod Kataklizm.',
      naRange: [{}, { obrazeniaPodpalenia: 4 }, { turyDzialania: 2 }]
    },
    zar: {
      nazwa: 'Żar', ikona: '♨', typ: 'pasywna', galaz: 'ogien',
      rodzic: 'kulaOgnia', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Twój ogień pali mocniej i dłużej.',
      mod: { mocStatusowZywiolowych: 1, turyStatusowZywiolowych: 1 }
    },
    piromancja: {
      nazwa: 'Piromancja', ikona: '🔆', typ: 'pasywna', galaz: 'ogien',
      rodzic: 'zar', odPoziomu: 4, rangi: 2, kosztPU: 1,
      opis: 'Podpalenie przeskakuje na kolejne cele w grupie.',
      mod: { rozprzestrzenieniePodpalenia: 1 }
    },
    kataklizm: {
      nazwa: 'Kataklizm', ikona: '☄', typ: 'zwienczenie', galaz: 'ogien',
      rodzic: 'piromancja', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'kataklizm',
      opis: 'Obszarowy wybuch, który detonuje wszystkie Podpalenia naraz.'
    },

    // --- Lód ---
    odlamkiLodu: {
      nazwa: 'Odłamki lodu', ikona: '❄', typ: 'aktywna', galaz: 'lod',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'odlamkiLodu',
      opis: 'Obrażenia i Wychłodzenie — Twój sposób na przetrwanie.',
      naRange: [{}, { oslabienieZrecznosci: 1 }, { szansaZamrozenia: 0.30 }]
    },
    lodowaZbroja: {
      nazwa: 'Lodowa zbroja', ikona: '🧊', typ: 'aktywna', galaz: 'lod',
      rodzic: 'odlamkiLodu', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'lodowaZbroja',
      opis: 'Bariera pochłaniająca obrażenia. Dla kogoś z papieru — bezcenna.',
      naRange: [{}, { pochlanianie: 12 }, { pochlanianie: 12, turyDzialania: 2 }]
    },
    zimnaKrew: {
      nazwa: 'Zimna krew', ikona: '🥶', typ: 'pasywna', galaz: 'lod',
      rodzic: 'odlamkiLodu', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Mocniejszy lód, a spowolnieni zadają Ci mniej obrażeń.',
      mod: { obrazeniaProcent: 0.04, redukcjaObrazenProcent: 0.04 }
    },
    zamrozenie: {
      nazwa: 'Zamrożenie', ikona: '🧊', typ: 'pasywna', galaz: 'lod',
      rodzic: 'zimnaKrew', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Chłód działa mocniej, a zmarznięci obrywają więcej.',
      mod: { mocStatusowZywiolowych: 1, bonusNaZmarznietych: 0.10 }
    },
    absolutneZero: {
      nazwa: 'Absolutne zero', ikona: '🌨', typ: 'zwienczenie', galaz: 'lod',
      rodzic: 'zamrozenie', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'absolutneZero',
      opis: 'Zamraża cel i rozłupuje go za wielki bonus.'
    },

    // --- Błyskawica ---
    grom: {
      nazwa: 'Grom', ikona: '⚡', typ: 'aktywna', galaz: 'blyskawica',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'grom',
      opis: 'Wysoki burst i Porażenie — wróg zaczyna pudłować.',
      naRange: [{}, { mnoznikObrazen: 0.3 }, { szansaOgluszenia: 0.25 }]
    },
    lancuchBlyskawic: {
      nazwa: 'Łańcuch błyskawic', ikona: '🌩', typ: 'aktywna', galaz: 'blyskawica',
      rodzic: 'grom', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'lancuchBlyskawic',
      opis: 'Przeskakuje między celami — czyści watahy.',
      naRange: [{}, { celeObszarowe: 1 }, { mnoznikObrazen: 0.3 }]
    },
    naladowanie: {
      nazwa: 'Naładowanie', ikona: '🔋', typ: 'pasywna', galaz: 'blyskawica',
      rodzic: 'grom', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Błyskawice biją mocniej i częściej krytycznie.',
      mod: { obrazeniaProcent: 0.05, szansaKrytyka: 0.03 }
    },
    przewodzenie: {
      nazwa: 'Przewodzenie', ikona: '🔗', typ: 'pasywna', galaz: 'blyskawica',
      rodzic: 'naladowanie', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Opancerzeni przewodzą prąd — obrywają od Ciebie więcej.',
      mod: { bonusNaOpancerzonych: 0.10 }
    },
    gniewJowisza: {
      nazwa: 'Gniew Jowisza', ikona: '👑', typ: 'zwienczenie', galaz: 'blyskawica',
      rodzic: 'przewodzenie', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'gniewJowisza',
      opis: 'Miażdżący cios. Wobec opancerzonych bonus i pewne ogłuszenie.'
    }
  }
};
