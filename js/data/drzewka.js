// ============================================================
//  DANE: drzewka umiejętności (design/arena_klasy_melee.md)
//
//  Każdy węzeł ma:
//   typ:      'aktywna' | 'pasywna' | 'generator' | 'finiszer' | 'zwienczenie'
//   galaz:    do której z trzech gałęzi należy
//   rodzic:   węzeł, który trzeba mieć, żeby go odblokować (null = korzeń)
//   odPoziomu: minimalny poziom bohatera
//   rangi:    ile razy można go ulepszyć (1–3)
//   kosztPU:  ile punktów umiejętności kosztuje jedna ranga
//
//  Węzły AKTYWNE wskazują akcję z js/data/umiejetnosci.js (pole akcja)
//  i mogą podbijać jej liczby na wyższych rangach (pole naRange).
//
//  Węzły PASYWNE dają modyfikatory (pole mod) — sumują się po rangach.
//  Nazwy modyfikatorów obsługuje js/engine/drzewko.js.
// ============================================================

const DRZEWKA = {

  // ============================================================
  //  WOJOWNIK
  // ============================================================
  wojownik: {
    galezie: {
      orez:    { nazwa: 'Oręż',   ikona: '🪓', opis: 'Napór i łamanie pancerza' },
      tarcza:  { nazwa: 'Tarcza', ikona: '🛡', opis: 'Obrona i kontra' },
      hart:    { nazwa: 'Hart',   ikona: '💨', opis: 'Przetrwanie i dyscyplina' }
    },
    wezly: {
      // --- Oręż ---
      poteznyCios: {
        nazwa: 'Potężny cios', ikona: '🪓', typ: 'aktywna', galaz: 'orez',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'poteznyCios',
        opis: 'Zamaszyste uderzenie za podwyższone obrażenia.',
        naRange: [{}, { mnoznikObrazen: 0.3 }, { mnoznikObrazen: 0.3, koszt: -1 }]
      },
      roztrzaskanie: {
        nazwa: 'Roztrzaskanie', ikona: '💥', typ: 'aktywna', galaz: 'orez',
        rodzic: 'poteznyCios', odPoziomu: 2, rangi: 3, kosztPU: 1, akcja: 'roztrzaskanie',
        opis: 'Obniża Obronę wroga na kilka tur.',
        naRange: [{}, { oslabienieObrony: 2 }, { turyDzialania: 2 }]
      },
      krzepa: {
        nazwa: 'Krzepa', ikona: '💪', typ: 'pasywna', galaz: 'orez',
        rodzic: 'poteznyCios', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Wszystkie Twoje ciosy są mocniejsze.',
        mod: { obrazeniaProcent: 0.06 }
      },
      pogromcaPancerzy: {
        nazwa: 'Pogromca pancerzy', ikona: '⛏', typ: 'pasywna', galaz: 'orez',
        rodzic: 'roztrzaskanie', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Część Twoich obrażeń w ogóle nie zauważa pancerza.',
        mod: { ignorujPancerz: 0.12 }
      },
      rozlupujacyCios: {
        nazwa: 'Rozłupujący cios', ikona: '⚡', typ: 'zwienczenie', galaz: 'orez',
        rodzic: 'pogromcaPancerzy', odPoziomu: 7, rangi: 1, kosztPU: 2, akcja: 'rozlupujacyCios',
        opis: 'Potężny cios, który wobec opancerzonych bije jeszcze mocniej i zwraca Wigor.'
      },

      // --- Tarcza ---
      garda: {
        nazwa: 'Garda', ikona: '🛡', typ: 'generator', galaz: 'tarcza',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'garda',
        opis: 'Generator Wigoru. Zmniejsza obrażenia do Twojej następnej tury.',
        naRange: [{}, { zwrotZasobu: 2 }, { zwrotZasobu: 2, redukcjaObrazen: 0.1 }]
      },
      mur: {
        nazwa: 'Mur', ikona: '🧱', typ: 'aktywna', galaz: 'tarcza',
        rodzic: 'garda', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'mur',
        opis: 'Duża obrona przez dwie tury.',
        naRange: [{}, { turyDzialania: 1 }, { redukcjaObrazen: 0.1 }]
      },
      twardaSkora: {
        nazwa: 'Twarda skóra', ikona: '🦏', typ: 'pasywna', galaz: 'tarcza',
        rodzic: 'garda', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Mniej obrywasz od ciosów fizycznych.',
        mod: { redukcjaObrazenProcent: 0.05 }
      },
      zelaznePluca: {
        nazwa: 'Żelazne płuca', ikona: '🫁', typ: 'pasywna', galaz: 'tarcza',
        rodzic: 'twardaSkora', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Więcej maksymalnego HP i większy zapas zasobu.',
        mod: { maxHp: 5, maxZasobu: 2 }
      },
      niewzruszony: {
        nazwa: 'Niewzruszony', ikona: '⛰', typ: 'zwienczenie', galaz: 'tarcza',
        rodzic: 'zelaznePluca', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Przy niskim HP obrywasz znacznie mniej.',
        mod: { redukcjaPrzyNiskimHp: 0.30 }
      },

      // --- Hart ---
      drugiOddech: {
        nazwa: 'Drugi oddech', ikona: '💨', typ: 'aktywna', galaz: 'hart',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'drugiOddech',
        opis: 'Leczy część maksymalnego HP w trakcie walki.',
        naRange: [{}, { leczenieProcentMaxHp: 0.08 }, { koszt: -2, uzyciNaWalke: 1 }]
      },
      niezlomnaPostawa: {
        nazwa: 'Niezłomna postawa', ikona: '🗿', typ: 'aktywna', galaz: 'hart',
        rodzic: 'drugiOddech', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'niezlomnaPostawa',
        opis: 'Dwie tury dużej redukcji obrażeń i odporność na ogłuszenie.',
        naRange: [{}, { turyDzialania: 1 }, { redukcjaObrazen: 0.1 }]
      },
      wytrzymalosc: {
        nazwa: 'Wytrzymałość', ikona: '❤', typ: 'pasywna', galaz: 'hart',
        rodzic: 'drugiOddech', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Więcej maksymalnego HP.',
        mod: { maxHp: 8 }
      },
      ekonomiaRuchu: {
        nazwa: 'Ekonomia ruchu', ikona: '♻', typ: 'pasywna', galaz: 'hart',
        rodzic: 'wytrzymalosc', odPoziomu: 4, rangi: 2, kosztPU: 2,
        opis: 'Twoje umiejętności kosztują mniej zasobu.',
        mod: { znizkaKosztu: 1 }
      },
      weteran: {
        nazwa: 'Weteran', ikona: '🎖', typ: 'zwienczenie', galaz: 'hart',
        rodzic: 'ekonomiaRuchu', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Regenerujesz HP co turę i wszystkie cechy rosną.',
        mod: { regenHpNaTure: 2, wszystkieCechy: 1 }
      }
    }
  },

  // ============================================================
  //  BERSERKER
  // ============================================================
  berserker: {
    galezie: {
      furia:      { nazwa: 'Furia',           ikona: '🔥', opis: 'Eskalacja obrażeń' },
      krew:       { nazwa: 'Krew',            ikona: '🩸', opis: 'Kradzież życia i egzekucja' },
      nieustraszonosc: { nazwa: 'Nieustraszoność', ikona: '💀', opis: 'Tempo i lekkomyślność' }
    },
    wezly: {
      // --- Furia ---
      szal: {
        nazwa: 'Szał', ikona: '🔥', typ: 'aktywna', galaz: 'furia',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'szal',
        opis: 'Najcięższy młot w Twoim arsenale.',
        naRange: [{}, { mnoznikObrazen: 0.3 }, { kradziezZyciaAkcji: 0.25 }]
      },
      krwawyWir: {
        nazwa: 'Krwawy wir', ikona: '🌀', typ: 'aktywna', galaz: 'furia',
        rodzic: 'szal', odPoziomu: 2, rangi: 3, kosztPU: 1, akcja: 'krwawyWir',
        opis: 'Rana, która nie chce się zabliźnić.',
        naRange: [{}, { obrazeniaKrwawienia: 2 }, { turyDzialania: 2, celeObszarowe: 1 }]
      },
      gniew: {
        nazwa: 'Gniew', ikona: '😤', typ: 'pasywna', galaz: 'furia',
        rodzic: 'szal', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Im więcej masz Furii, tym mocniej bijesz.',
        mod: { obrazeniaZaZasob: 0.10 }
      },
      krewZaKrew: {
        nazwa: 'Krew za krew', ikona: '💀', typ: 'pasywna', galaz: 'furia',
        rodzic: 'gniew', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Im niżej masz HP, tym groźniejszy się stajesz.',
        mod: { obrazeniaPrzyNiskimHp: 0.12 }
      },
      nieokielznany: {
        nazwa: 'Nieokiełznany', ikona: '⚡', typ: 'zwienczenie', galaz: 'furia',
        rodzic: 'krewZaKrew', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Przy wysokiej Furii Twoje ciosy czasem trafiają dwa razy.',
        mod: { szansaDodatkowegoCiosu: 0.25 }
      },

      // --- Krew ---
      krwawaOfiara: {
        nazwa: 'Krwawa ofiara', ikona: '🗡', typ: 'generator', galaz: 'krew',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'krwawaOfiara',
        opis: 'Generator Furii. Płacisz własną krwią.',
        naRange: [{}, { zwrotZasobu: 8 }, { kosztProcentHp: -0.03 }]
      },
      krwiozerczosc: {
        nazwa: 'Krwiożerczość', ikona: '🩸', typ: 'pasywna', galaz: 'krew',
        rodzic: 'krwawaOfiara', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Leczysz się z zadanych obrażeń. Twój sposób na przetrwanie.',
        mod: { kradziezZycia: 0.05 }
      },
      egzekucja: {
        nazwa: 'Egzekucja', ikona: '☠', typ: 'aktywna', galaz: 'krew',
        rodzic: 'krwiozerczosc', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'egzekucja',
        opis: 'Dobija rannych. Wobec zdrowych prawie bezużyteczna.',
        naRange: [{}, { progHpCelu: 0.08 }, { leczenieZaZabojstwo: 0.10 }]
      },
      uczta: {
        nazwa: 'Uczta', ikona: '🍖', typ: 'pasywna', galaz: 'krew',
        rodzic: 'krwiozerczosc', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Wychodzisz z walki w lepszym stanie — zwycięstwo Cię krzepi.',
        mod: { leczenieZaZwyciestwo: 0.06 }
      },
      wampirycznySzal: {
        nazwa: 'Wampiryczny szał', ikona: '🧛', typ: 'zwienczenie', galaz: 'krew',
        rodzic: 'uczta', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Kradzież życia podwojona, gdy Furia jest wysoka.',
        mod: { kradziezZyciaPrzyWysokimZasobie: 1.0 }
      },

      // --- Nieustraszoność ---
      szarza: {
        nazwa: 'Szarża', ikona: '🐂', typ: 'aktywna', galaz: 'nieustraszonosc',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'szarzaGracza',
        opis: 'Uderzenie barkiem, które ogłusza. (Skracanie dystansu dojdzie z klasami dystansowymi.)',
        naRange: [{}, { turyOgluszenia: 1 }, { koszt: -5 }]
      },
      nieostroznyCios: {
        nazwa: 'Nieostrożny cios', ikona: '🎲', typ: 'aktywna', galaz: 'nieustraszonosc',
        rodzic: 'szarza', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'nieostroznyCios',
        opis: 'Bardzo mocne uderzenie, ale odsłaniasz się na turę.',
        naRange: [{}, { mnoznikObrazen: 0.3 }, { karaObrony: -2 }]
      },
      bezLeku: {
        nazwa: 'Bez lęku', ikona: '🏃', typ: 'pasywna', galaz: 'nieustraszonosc',
        rodzic: 'szarza', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Szybszy i trudniejszy do spowolnienia.',
        mod: { zrecznosc: 1 }
      },
      furiaBerserkera: {
        nazwa: 'Furia berserkera', ikona: '📈', typ: 'pasywna', galaz: 'nieustraszonosc',
        rodzic: 'bezLeku', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Furia narasta szybciej.',
        mod: { bonusZasobuProcent: 0.15 }
      },
      ostatniaFuria: {
        nazwa: 'Ostatnia furia', ikona: '🛡', typ: 'zwienczenie', galaz: 'nieustraszonosc',
        rodzic: 'furiaBerserkera', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Raz na walkę śmiertelny cios zostawia Cię przy życiu z 1 HP.',
        mod: { oszukanieSmierci: 1 }
      }
    }
  },

  // ============================================================
  //  ZABÓJCA
  // ============================================================
  zabojca: {
    galezie: {
      ostrza:   { nazwa: 'Ostrza',   ikona: '✹', opis: 'Krytyki i finiszery' },
      trucizny: { nazwa: 'Trucizny', ikona: '🧪', opis: 'DoT i anty-pancerz' },
      cien:     { nazwa: 'Cień',     ikona: '🌑', opis: 'Uniki i tempo' }
    },
    wezly: {
      // --- Ostrza ---
      skrytobojczyCios: {
        nazwa: 'Skrytobójczy cios', ikona: '✹', typ: 'finiszer', galaz: 'ostrza',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'skrytobojczyCios',
        opis: 'Finiszer. Zjada całe Kombo, siła rośnie z każdym punktem.',
        naRange: [{}, { mnoznikZaPunktKombo: 0.15 }, { bonusSzansyKrytyka: 0.15 }]
      },
      seriaPchniec: {
        nazwa: 'Seria pchnięć', ikona: '🔪', typ: 'aktywna', galaz: 'ostrza',
        rodzic: 'skrytobojczyCios', odPoziomu: 2, rangi: 3, kosztPU: 1, akcja: 'seriaPchniec',
        opis: 'Kilka szybkich trafień — szybko buduje Kombo.',
        naRange: [{}, { liczbaCiosow: 1 }, { szansaKrwawienia: 0.35 }]
      },
      celnoscZabojcy: {
        nazwa: 'Celność zabójcy', ikona: '🎯', typ: 'pasywna', galaz: 'ostrza',
        rodzic: 'skrytobojczyCios', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Częstsze i mocniejsze krytyki.',
        mod: { szansaKrytyka: 0.04, mnoznikKrytyka: 0.1 }
      },
      mistrzKombo: {
        nazwa: 'Mistrz kombo', ikona: '🔗', typ: 'pasywna', galaz: 'ostrza',
        rodzic: 'celnoscZabojcy', odPoziomu: 4, rangi: 2, kosztPU: 1,
        opis: 'Mieścisz więcej punktów Kombo.',
        mod: { maksKombo: 1 }
      },
      smiertelnyCios: {
        nazwa: 'Śmiertelny cios', ikona: '💀', typ: 'zwienczenie', galaz: 'ostrza',
        rodzic: 'mistrzKombo', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Finiszer z pełnym Kombo dobija ciężko rannych od ręki.',
        mod: { dobicieFiniszerem: 0.20 }
      },

      // --- Trucizny ---
      zatruteOstrze: {
        nazwa: 'Zatrute ostrze', ikona: '🧪', typ: 'aktywna', galaz: 'trucizny',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'zatruteOstrze',
        opis: 'Nakłada Zatrucie, które omija pancerz.',
        naRange: [{}, { maksStackow: 1 }, { turyDzialania: 2 }]
      },
      rozprucie: {
        nazwa: 'Rozprucie', ikona: '💢', typ: 'finiszer', galaz: 'trucizny',
        rodzic: 'zatruteOstrze', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'rozprucie',
        opis: 'Detonuje całą truciznę na wrogu, zadając jej obrażenia od razu.',
        naRange: [{}, { mnoznikDetonacji: 0.5 }, { szansaKrwawienia: 0.5 }]
      },
      jadWZylach: {
        nazwa: 'Jad w żyłach', ikona: '🐍', typ: 'pasywna', galaz: 'trucizny',
        rodzic: 'zatruteOstrze', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Twoje trucizny są mocniejsze i trwają dłużej.',
        mod: { obrazeniaTrucizny: 1, turyTrucizny: 1 }
      },
      rozprzestrzenienie: {
        nazwa: 'Rozprzestrzenienie', ikona: '☁', typ: 'pasywna', galaz: 'trucizny',
        rodzic: 'jadWZylach', odPoziomu: 4, rangi: 2, kosztPU: 1,
        opis: 'Zatrucie przeskakuje na kolejny cel w watasze.',
        mod: { rozprzestrzenienieTrucizny: 1 }
      },
      smiertelnaDawka: {
        nazwa: 'Śmiertelna dawka', ikona: '☠', typ: 'zwienczenie', galaz: 'trucizny',
        rodzic: 'jadWZylach', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Zatrucie nie wygasa, dopóki je odnawiasz — stacki zostają.',
        mod: { trwaleZatrucie: 1 }
      },

      // --- Cień ---
      zejscieWCien: {
        nazwa: 'Zejście w cień', ikona: '🌑', typ: 'generator', galaz: 'cien',
        rodzic: null, odPoziomu: 1, rangi: 3, kosztPU: 1, akcja: 'zejscieWCien',
        opis: 'Generator Kombo. Unik i gwarantowany krytyk.',
        naRange: [{}, { turyDzialania: 1 }, { zwrotZasobu: 1 }]
      },
      riposta: {
        nazwa: 'Riposta', ikona: '↩', typ: 'aktywna', galaz: 'cien',
        rodzic: 'zejscieWCien', odPoziomu: 3, rangi: 3, kosztPU: 1, akcja: 'riposta',
        opis: 'Następny cios wroga chybia, a Ty kontrujesz krytykiem.',
        naRange: [{}, { turyDzialania: 1 }, { mnoznikKontry: 0.5 }]
      },
      zwinnosc: {
        nazwa: 'Zwinność', ikona: '💨', typ: 'pasywna', galaz: 'cien',
        rodzic: 'zejscieWCien', odPoziomu: 2, rangi: 3, kosztPU: 1,
        opis: 'Trudniej Cię trafić i częściej działasz pierwszy.',
        mod: { bonusUniku: 0.04, zrecznosc: 1 }
      },
      cienWAkcji: {
        nazwa: 'Cień w akcji', ikona: '👤', typ: 'pasywna', galaz: 'cien',
        rodzic: 'zwinnosc', odPoziomu: 4, rangi: 3, kosztPU: 1,
        opis: 'Po uniku masz szansę na darmowy cios.',
        mod: { szansaCiosuPoUniku: 0.20 }
      },
      taniecOstrzy: {
        nazwa: 'Taniec ostrzy', ikona: '🌀', typ: 'zwienczenie', galaz: 'cien',
        rodzic: 'cienWAkcji', odPoziomu: 7, rangi: 1, kosztPU: 2,
        opis: 'Po krytyku masz szansę natychmiast uderzyć znowu.',
        mod: { szansaDodatkowegoCiosu: 0.30 }
      }
    }
  }
};
