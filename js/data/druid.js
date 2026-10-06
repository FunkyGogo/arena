// ============================================================
//  DRUID — umiejętności, liczby, przywołania i drzewko
//  (design/arena_klasy_magiczne.md)
//
//  Nie zabija szybko — po prostu NIE UMIERA, aż wróg padnie.
//  W modelu HP-na-wyczerpanie to ostateczny ocalały: jego leczenie
//  błyszczy właśnie dlatego, że zdrowie nie wraca samo.
// ============================================================

Object.assign(CONFIG.akcje, {
  ciosKonarem:  { koszt: 0, mnoznikObrazen: 1.0, zwrotZasobu: 1, zywiol: 'natura' },

  wiezZNatura:  { koszt: 0, zwrotZasobu: 11, leczenieNaTure: 2, turyDzialania: 3 },

  // --- Przyzywanie ---
  przyzwijBestie: { koszt: 6, pupil: 'wilkDruida' },
  zewWatahy:      { koszt: 8, pupil: 'wilczek', liczbaPupili: 2 },
  alfa:           { koszt: 12, pupil: 'alfa', uzyciNaWalke: 1, redukcjaZaPupila: 0.20 },

  // --- Przemiana ---
  postacNiedzwiedzia: { koszt: 7, turyDzialania: 4, bonusObrony: 4,
                        bonusObrazen: 0.30, leczenieNaTure: 0 },
  postacWilka:        { koszt: 7, turyDzialania: 4, bonusZrecznosci: 3,
                        bonusKrytyka: 0.20, bonusObrazen: 0.15 },

  // --- Życie i zaraza ---
  uzdrowienie: { koszt: 6, leczenieProcentMaxHp: 0.28, leczenieNaTure: 3, turyDzialania: 3 },
  zaraza:      { koszt: 5, mnoznikObrazen: 0.7, zywiol: 'natura',
                 obrazeniaZatrucia: 5, skalowanieOdSily: 0.3, maksStackow: 4, turyDzialania: 4 },
  ciernie:     { koszt: 4, odbicieObrazen: 0.35, redukcjaObrazen: 0.15, turyDzialania: 4 }
});

Object.assign(UMIEJETNOSCI, {

  ciosKonarem: {
    id: 'ciosKonarem', nazwa: 'Cios konarem', ikona: '🌳',
    typ: 'atak', klasa: 'druid', galaz: 'podstawa',
    opis: 'Atak podstawowy: obrażenia natury (omijają pancerz). Dokłada Many.'
  },

  wiezZNatura: {
    id: 'wiezZNatura', nazwa: 'Więź z naturą', ikona: '🌿',
    typ: 'postawa', klasa: 'druid', galaz: 'Rdzeń', nakladaStatus: 'regeneracja',
    opis: 'Generator. Odzyskujesz Manę i zaczynasz się powoli goić.'
  },

  przyzwijBestie: {
    id: 'przyzwijBestie', nazwa: 'Przyzwij bestię', ikona: '🐺',
    typ: 'przyzwanie', klasa: 'druid', galaz: 'Przyzywanie',
    opis: 'Towarzysz z własnym HP. Bije sam i przejmuje część uwagi wroga.'
  },

  zewWatahy: {
    id: 'zewWatahy', nazwa: 'Zew watahy', ikona: '🐾',
    typ: 'przyzwanie', klasa: 'druid', galaz: 'Przyzywanie',
    opis: 'Kilka słabszych bestii naraz — więcej ciał między Tobą a wrogiem.'
  },

  alfa: {
    id: 'alfa', nazwa: 'Alfa', ikona: '🐻',
    typ: 'przyzwanie', klasa: 'druid', galaz: 'Przyzywanie',
    opis: 'Zwieńczenie: potężna bestia raz na walkę. Póki żyje, obrywasz mniej.'
  },

  postacNiedzwiedzia: {
    id: 'postacNiedzwiedzia', nazwa: 'Postać niedźwiedzia', ikona: '🐻',
    typ: 'postawa', klasa: 'druid', galaz: 'Przemiana', nakladaStatus: 'formaNiedzwiedzia',
    opis: 'Zmieniasz się w niedźwiedzia: więcej pancerza i mocniejsze ciosy.'
  },

  postacWilka: {
    id: 'postacWilka', nazwa: 'Postać wilka', ikona: '🐺',
    typ: 'postawa', klasa: 'druid', galaz: 'Przemiana', nakladaStatus: 'formaWilka',
    opis: 'Zmieniasz się w wilka: szybszy, celniejszy, częściej krytykujesz.'
  },

  uzdrowienie: {
    id: 'uzdrowienie', nazwa: 'Uzdrowienie', ikona: '💚',
    typ: 'leczenie', klasa: 'druid', galaz: 'Życie', nakladaStatus: 'regeneracja',
    opis: 'Silne leczenie i Regeneracja na kilka tur. Twój sposób na przetrwanie serii walk.'
  },

  zaraza: {
    id: 'zaraza', nazwa: 'Zaraza', ikona: '☠',
    typ: 'atak', klasa: 'druid', galaz: 'Życie', nakladaStatus: 'zatrucie',
    opis: 'Ciężkie Zatrucie omijające pancerz. Zabija powoli, ale nieuchronnie.'
  },

  ciernie: {
    id: 'ciernie', nazwa: 'Ciernie', ikona: '🌵',
    typ: 'postawa', klasa: 'druid', galaz: 'Życie', nakladaStatus: 'ciernie',
    opis: 'Kolczasta skorupa: obrywasz mniej i odbijasz część obrażeń w atakującego.'
  }
});

// ---------- przywołania ----------
//  Pupil to pełnoprawny uczestnik walki: własne HP i własna tura.

const PUPILE = {
  wilkDruida: {
    id: 'wilkDruida', nazwa: 'Przyzwany wilk', ikona: '🐺',
    hp: 30, tury: 5,
    cechy: { sila: 7, atak: 6, obrona: 1, zrecznosc: 6, witalnosc: 5, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Kły', obrazenia: 2 }
  },
  wilczek: {
    id: 'wilczek', nazwa: 'Wilczek', ikona: '🐕',
    hp: 16, tury: 4,
    cechy: { sila: 5, atak: 6, obrona: 0, zrecznosc: 7, witalnosc: 3, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Małe kły', obrazenia: 1 }
  },
  alfa: {
    id: 'alfa', nazwa: 'Bestia alfa', ikona: '🐻',
    hp: 60, tury: 6,
    cechy: { sila: 10, atak: 7, obrona: 3, zrecznosc: 4, witalnosc: 9, charyzma: 2, wola: 2 },
    bron: { nazwa: 'Pazury', obrazenia: 3 }
  }
};

DRZEWKA.druid = {
  galezie: {
    rdzen:       { nazwa: 'Natura',    ikona: '🌿', opis: 'To, co ma każdy druid' },
    przyzywanie: { nazwa: 'Przyzwanie', ikona: '🐺', opis: 'Drugie ciało w walce' },
    przemiana:   { nazwa: 'Przemiana', ikona: '🐻', opis: 'Formy zwierzęce' },
    zycie:       { nazwa: 'Życie',     ikona: '💚', opis: 'Leczenie i zaraza' }
  },

  wezly: {
    // --- Natura ---
    wiezZNatura: {
      nazwa: 'Więź z naturą', ikona: '🌿', typ: 'generator', galaz: 'rdzen',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'wiezZNatura',
      opis: 'Generator Many. Przy okazji zaczynasz się goić.',
      naRange: [{}, { zwrotZasobu: 3 }, { zwrotZasobu: 3, leczenieNaTure: 2 }]
    },
    naturalnaOdpornosc: {
      nazwa: 'Naturalna odporność', ikona: '🍃', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'wiezZNatura', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Więcej maksymalnego HP i mniej obrywasz.',
      mod: { maxHp: 7, redukcjaObrazenProcent: 0.03 }
    },
    druidycznaWiedza: {
      nazwa: 'Druidyczna wiedza', ikona: '📜', typ: 'pasywna', galaz: 'rdzen',
      rodzic: 'wiezZNatura', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Silniejsze leczenie i twardsze przywołania.',
      mod: { mocLeczenia: 0.10, mocPupili: 0.12 }
    },

    // --- Przyzywanie ---
    przyzwijBestie: {
      nazwa: 'Przyzwij bestię', ikona: '🐺', typ: 'aktywna', galaz: 'przyzywanie',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'przyzwijBestie',
      opis: 'Towarzysz z własnym HP, który bije sam.',
      naRange: [{}, { mocPupilaAkcji: 0.25 }, { mocPupilaAkcji: 0.25 }]
    },
    zewWatahy: {
      nazwa: 'Zew watahy', ikona: '🐾', typ: 'aktywna', galaz: 'przyzywanie',
      rodzic: 'przyzwijBestie', odPoziomu: 4, rangi: 3, kosztPU: 1, akcja: 'zewWatahy',
      opis: 'Kilka słabszych bestii naraz.',
      naRange: [{}, { liczbaPupili: 1 }, { liczbaPupili: 1 }]
    },
    wiezKrwi: {
      nazwa: 'Więź krwi', ikona: '🩸', typ: 'pasywna', galaz: 'przyzywanie',
      rodzic: 'przyzwijBestie', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Twoje przywołania leczą Cię częścią zadanych obrażeń.',
      mod: { wampiryzmPupili: 0.15 }
    },
    panZwierzat: {
      nazwa: 'Pan zwierząt', ikona: '👑', typ: 'pasywna', galaz: 'przyzywanie',
      rodzic: 'wiezKrwi', odPoziomu: 4, rangi: 3, kosztPU: 1,
      opis: 'Przywołania mają więcej HP, biją mocniej i żyją dłużej.',
      mod: { mocPupili: 0.15, turyPupili: 1 }
    },
    alfa: {
      nazwa: 'Alfa', ikona: '🐻', typ: 'zwienczenie', galaz: 'przyzywanie',
      rodzic: 'panZwierzat', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'alfa',
      opis: 'Potężna bestia raz na walkę. Póki żyje, obrywasz mniej.'
    },

    // --- Przemiana ---
    postacNiedzwiedzia: {
      nazwa: 'Postać niedźwiedzia', ikona: '🐻', typ: 'aktywna', galaz: 'przemiana',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'postacNiedzwiedzia',
      opis: 'Forma obronna: pancerz i mocniejsze ciosy.',
      naRange: [{}, { turyDzialania: 2 }, { leczenieNaTure: 3 }]
    },
    postacWilka: {
      nazwa: 'Postać wilka', ikona: '🐺', typ: 'aktywna', galaz: 'przemiana',
      rodzic: 'postacNiedzwiedzia', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'postacWilka',
      opis: 'Forma szybka: inicjatywa, krytyki, tempo.',
      naRange: [{}, { turyDzialania: 2 }, { bonusKrytyka: 0.10 }]
    },
    dzikaKrew: {
      nazwa: 'Dzika krew', ikona: '❤', typ: 'pasywna', galaz: 'przemiana',
      rodzic: 'postacNiedzwiedzia', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'W zwierzęcej formie regenerujesz HP co turę.',
      mod: { regenWFormie: 2 }
    },
    pradawnaForma: {
      nazwa: 'Pradawna forma', ikona: '🗿', typ: 'pasywna', galaz: 'przemiana',
      rodzic: 'dzikaKrew', odPoziomu: 4, rangi: 2, kosztPU: 1,
      opis: 'Formy trwają dłużej i kosztują mniej.',
      mod: { turyForm: 1, znizkaKosztu: 1 }
    },
    wcieleniePradawnego: {
      nazwa: 'Wcielenie pradawnego', ikona: '🌟', typ: 'zwienczenie', galaz: 'przemiana',
      rodzic: 'pradawnaForma', odPoziomu: 7, rangi: 1, kosztPU: 2,
      opis: 'W formie jesteś znacznie twardszy i regenerujesz się szybciej.',
      mod: { redukcjaWFormie: 0.20, regenWFormie: 3 }
    },

    // --- Życie i zaraza ---
    uzdrowienie: {
      nazwa: 'Uzdrowienie', ikona: '💚', typ: 'aktywna', galaz: 'zycie',
      rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'uzdrowienie',
      opis: 'Silne leczenie i Regeneracja.',
      naRange: [{}, { leczenieProcentMaxHp: 0.08 }, { leczenieNaTure: 3 }]
    },
    zaraza: {
      nazwa: 'Zaraza', ikona: '☠', typ: 'aktywna', galaz: 'zycie',
      rodzic: null, odPoziomu: 2, rangi: 3, kosztPU: 1, akcja: 'zaraza',
      opis: 'Ciężkie Zatrucie omijające pancerz.',
      naRange: [{}, { maksStackow: 1 }, { rozprzestrzenienie: 1 }]
    },
    ciernie: {
      nazwa: 'Ciernie', ikona: '🌵', typ: 'aktywna', galaz: 'zycie',
      rodzic: 'uzdrowienie', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'ciernie',
      opis: 'Odbijasz część obrażeń w atakującego.',
      naRange: [{}, { odbicieObrazen: 0.15 }, { turyDzialania: 2 }]
    },
    zyciodajnosc: {
      nazwa: 'Życiodajność', ikona: '🌱', typ: 'pasywna', galaz: 'zycie',
      rodzic: 'uzdrowienie', odPoziomu: 2, rangi: 3, kosztPU: 1,
      opis: 'Leczysz więcej, a Regeneracja trwa dłużej.',
      mod: { mocLeczenia: 0.12, regenHpNaTure: 1 }
    },
    odrodzenie: {
      nazwa: 'Odrodzenie', ikona: '🌸', typ: 'zwienczenie', galaz: 'zycie',
      rodzic: 'zyciodajnosc', odPoziomu: 7, rangi: 1, kosztPU: 2,
      opis: 'Raz na walkę śmiertelny cios zamiast zabić — leczy Cię.',
      mod: { oszukanieSmierci: 1, leczenieZOszukaniaSmierci: 0.35 }
    }
  }
};
