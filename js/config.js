// ============================================================
//  ARENA — KONFIGURACJA BALANSU
//  To JEDYNY plik, w którym zmieniasz liczby. Zmień, zapisz,
//  odśwież stronę w przeglądarce (F5) — gotowe.
// ============================================================

const CONFIG = {

  // --- Jak liczymy postać z jej cech ---
  postac: {
    hpBazowe: 30,        // HP = hpBazowe + WITALNOSC * hpZaWitalnosc
    hpZaWitalnosc: 6
  },

  // --- Zasoby klas (rytm "generuj ↔ wydawaj") ---
  zasoby: {

    // WOJOWNIK — pełny na starcie pusty, rośnie powoli i pewnie
    wigor: {
      nazwa: 'Wigor',
      maxBazowy: 10,
      maxZaZrecznosc: 1,     // max = maxBazowy + ZRECZNOSC * maxZaZrecznosc
      start: 0,
      regenNaTure: 2
    },

    // BERSERKER — nie ładuje się z czasem, tylko z przemocy
    furia: {
      nazwa: 'Furia',
      max: 100,
      start: 0,
      regenNaTure: 0,
      zaZadaneObrazenia: 0.6,     // tyle Furii za każdy zadany punkt obrażeń
      zaOtrzymaneObrazenia: 0.9   // tyle za każdy oberwany punkt (obrywanie się opłaca!)
    },

    // MAG i DRUID — mana rośnie z Woli, generator ją odnawia
    mana: {
      nazwa: 'Mana',
      maxBazowy: 10,
      maxZaWole: 4,
      start: 8,
      regenNaTure: 1
    },

    // ŁUCZNIK — ładuje się celowaniem i trafieniami
    skupienie: {
      nazwa: 'Skupienie',
      maxBazowy: 8,
      maxZaZrecznosc: 1,
      start: 2,
      regenNaTure: 1
    },

    // ZABÓJCA — punkty za trafienia, tracone przy pudle i po oberwaniu
    kombo: {
      nazwa: 'Kombo',
      max: 5,
      start: 0,
      regenNaTure: 0,
      zaTrafienie: 1,
      zerujePudlo: true,        // pudło = utrata całego Kombo
      traciZaOberwanie: 2       // oberwany cios zabiera tyle punktów (99 = wszystkie)
    }
  },

  // --- Żywioły (design/arena_fundament_walki.md sekcja 4) ---
  //  Fizyczny redukuje pancerz. Żywiołowy OMIJA pancerz, ale podlega
  //  odporności i słabości celu. To jest odpowiedź na opancerzonych.
  zywioly: {
    mnoznikSlabosci: 1.5,        // słabość = +50% obrażeń
    mnoznikOdpornosci: 0.5,      // odporność = −50%
    procentWchloniecia: 0.5      // wchłanianie: cel leczy się o tyle % obrażeń
  },

  // --- Dystans (design/arena_fundament_walki.md sekcja 6) ---
  //  Bez siatki ruchu: dwa stany zaangażowania. Klasy dystansowe
  //  otwierają walkę z Daleko i próbują tam zostać.
  dystans: {
    turyDobiegania: 2,           // ile tur wróg melee traci na skrócenie dystansu
    bonusZDaleka: 0.20,          // premia do obrażeń strzelca, gdy jest Daleko
    karaWZwarciu: 0.25           // kara do obrażeń strzelca w zwarciu
  },

  // --- Przywołania (design/arena_fundament_walki.md sekcja 7) ---
  przywolania: {
    szansaAtakuNaPupila: 0.45   // jak często wróg bierze na cel bestię zamiast Ciebie
  },

  // --- Rdzeń walki ---
  walka: {
    rozrzutObrazen: 0.25,        // 0.25 = obrażenia wahają się +/- 25%
    celnoscBazowa: 0.85,         // 85% szansy na trafienie przy równych cechach
    celnoscZaPunktPrzewagi: 0.03,// każdy punkt ATK ponad ZRE wroga = +3% trafienia
    celnoscMin: 0.50,            // nigdy poniżej 50%
    celnoscMax: 0.95,            // nigdy powyżej 95%
    szansaKrytyka: 0.05,         // 5% na cios krytyczny
    mnoznikKrytyka: 1.5,         // krytyk = x1.5 obrażeń
    redukcjaZaPunktObrony: 0.5,  // każdy punkt OBR zdejmuje 0.5 obrażeń fizycznych
    maksUdzialPancerza: 0.6,     // ...ale nigdy więcej niż tyle % ciosu (0.6 = max 60%)
    minimalneObrazenia: 1        // trafienie zawsze zabiera przynajmniej tyle
  },

  // --- Akcje z paska ---
  //  Każdy wpis odpowiada umiejętności z js/data/umiejetnosci.js
  akcje: {

    // ======== WOJOWNIK ========

    cios:  { koszt: 0, mnoznikObrazen: 1.0, zwrotZasobu: 1 },

    garda: { koszt: 0, zwrotZasobu: 5, redukcjaObrazen: 0.5 },

    poteznyCios: { koszt: 5, mnoznikObrazen: 2.1 },

    roztrzaskanie: {
      koszt: 5,
      mnoznikObrazen: 1.0,
      oslabienieObrony: 3,        // o tyle spada OBR wroga
      turyDzialania: 3            // na tyle jego tur
    },

    // Leczenie w trakcie walki. UWAGA przy strojeniu: to najmocniejsza
    // rzecz w grze. Przy 25% i dwoch uzyciach (trzech na 3. randze) dawalo
    // caly drugi pasek zycia za grosze — walki przestawaly byc groźne.
    drugiOddech: {
      koszt: 6,
      leczenieProcentMaxHp: 0.18,
      zwrotZasobu: 0,            // leczenie nie moze jeszcze oddawac Wigoru
      uzyciNaWalke: 1
    },

    // ======== BERSERKER ========

    ciecie: { koszt: 0, mnoznikObrazen: 1.0, zwrotZasobu: 0 },

    krwawaOfiara: {               // generator: płacisz krwią za Furię
      koszt: 0,
      kosztProcentHp: 0.10,       // tracisz 10% maksymalnego HP...
      zwrotZasobu: 22             // ...dostajesz tyle Furii
    },

    szal:      { koszt: 40, mnoznikObrazen: 1.9 },

    krwawyWir: {
      koszt: 30,
      mnoznikObrazen: 1.0,
      obrazeniaKrwawienia: 4,     // tyle HP na turę
      turyDzialania: 3
    },

    egzekucja: {
      koszt: 25,
      mnoznikObrazen: 1.2,        // normalnie słaba...
      progHpCelu: 0.35,           // ...ale poniżej 35% HP celu:
      mnoznikEgzekucji: 3.0,      // potrójne obrażenia
      leczenieZaZabojstwo: 0.15   // zabójstwo leczy 15% Twojego max HP
    },

    // ======== ZABÓJCA ========

    pchniecie: { koszt: 0, mnoznikObrazen: 1.0 },

    zejscieWCien: {               // generator: znikasz, wracasz z gwarantowanym krytem
      koszt: 0,
      zwrotZasobu: 2,
      turyDzialania: 1
    },

    zatruteOstrze: {
      koszt: 0,
      mnoznikObrazen: 0.6,        // słaby cios, ale zostawia jad
      obrazeniaZatrucia: 2,       // bazowe obrażenia jadu na turę za stack
      skalowanieOdSily: 0.4,      // + tyle za każdy punkt Siły (jad rośnie z postacią)
      maksStackow: 3,
      turyDzialania: 3
    },

    skrytobojczyCios: {           // finiszer: zjada całe Kombo
      kosztCaleKombo: true,
      minimumKombo: 1,
      mnoznikBazowy: 0.6,
      mnoznikZaPunktKombo: 0.6,   // 5 pkt = x0.6 + 5*0.6 = x3.6
      bonusSzansyKrytyka: 0.25
    },

    riposta: {
      koszt: 2,
      turyDzialania: 1,
      mnoznikKontry: 1.0          // kontra po uniku, zawsze krytyczna
    },

    // ======== DALSZE WĘZŁY DRZEWKA ========

    mur: {
      koszt: 4,
      redukcjaObrazen: 0.45,
      turyDzialania: 2
    },

    niezlomnaPostawa: {
      koszt: 5,
      redukcjaObrazen: 0.40,
      turyDzialania: 2
    },

    rozlupujacyCios: {
      koszt: 8,
      mnoznikObrazen: 2.4,
      bonusNaOpancerzonych: 0.6,   // dodatkowy mnożnik, gdy wróg ma OBR >= progu
      progObronyWroga: 5,
      zwrotZasobu: 4
    },

    szarzaGracza: {
      koszt: 20,
      mnoznikObrazen: 1.5,
      turyOgluszenia: 2            // 2 = realnie jedna zabrana tura
    },

    nieostroznyCios: {
      koszt: 15,
      mnoznikObrazen: 2.0,
      karaObrony: -4,              // o tyle spada TWOJA Obrona
      turyKary: 2
    },

    seriaPchniec: {
      koszt: 0,
      mnoznikObrazen: 0.55,
      liczbaCiosow: 2,
      szansaKrwawienia: 0,
      obrazeniaKrwawienia: 3,
      turyKrwawienia: 3
    },

    rozprucie: {
      kosztCaleKombo: true,
      minimumKombo: 2,
      mnoznikDetonacji: 1.0,       // ile obrażeń trucizny za każdą pozostałą turę
      szansaKrwawienia: 0,
      obrazeniaKrwawienia: 3,
      turyKrwawienia: 3
    },

    // ======== WSPÓLNE ========

    eliksir: { koszt: 0 },        // kosztuje sztukę z plecaka, nie zasób klasy

    // ======== AKCJE WROGÓW ========

    szarza:           { mnoznikObrazen: 1.8 },
    szykowanieSzarzy: {},
    siec:             { mnoznikObrazen: 0.5, szansaOgluszenia: 0.45,
                        turySpowolnienia: 2, oslabienieZrecznosci: 2 },
    jadowityCios:     { mnoznikObrazen: 0.8, obrazeniaZatrucia: 3,
                        maksStackow: 3, turyDzialania: 3 },
    klatwa:           { turyDzialania: 3 },

    ugryzienie:       { mnoznikObrazen: 0.9, obrazeniaKrwawienia: 4, turyDzialania: 3 },
    uderzenieGolema:  { mnoznikObrazen: 1.1, turyOgluszenia: 2 },
    zioniecie:        { mnoznikObrazen: 0.9, obrazeniaPodpalenia: 5, turyDzialania: 3 },
    wielePaszczy:     { mnoznikObrazen: 0.55, liczbaCiosow: 3 },
    wrzask:           { turyDzialania: 3, oslabienieCelnosci: 3 },
    opatrunek:        { leczenieProcentMaxHp: 0.30 }
  },

  // --- Postęp bohatera: poziomy, XP, punkty cech ---
  postep: {
    xpNaPoziom2: 40,            // ile XP na 2. poziom
    xpPrzyrostNaPoziom: 50,     // każdy kolejny poziom kosztuje o tyle więcej
    punktyCechZaPoziom: 3,      // ile punktów cech dostajesz za awans
    hpZaPoziom: 0               // dodatkowe HP poza tym z Witalności
  },

  // --- Drzewko umiejętności ---
  drzewko: {
    puZaPoziom: 1,              // punkty umiejętności za awans
    puZaMinibossa: 1,           // bonus za rangi 5 i 10
    puZaCzempiona: 2,           // bonus za Verrusa
    puNaStart: 2,               // żeby od razu było co wybrać

    kosztResetuBazowy: 30,      // reset drzewka za złoto
    kosztResetuZaPoziom: 10
  },

  // --- Ekonomia i model HP-na-wyczerpanie ---
  ekonomia: {
    // HP NIE wraca po walce. Regeneruje się w czasie — hojnie, bo płacenie
    // ma oszczędzać czas, nigdy nie może być przymusem (design/arena_ekonomia.md).
    minutNaPelneHp: 75,          // ile minut trwa regeneracja z 0 do pełna
    hpPoPrzegranej: 1,           // z czym wstajesz po porażce

    // Ile zlota realnie dostajesz za walke: nagroda z karty wroga razy to.
    // Przy 1.0 cale przejscie regionu dawalo 453 zlota, a sam komplet
    // sprzetu ze sklepu kosztuje 315 — za ciasno.
    mnoznikZlota: 1.6,

    zwrotZeSprzedazy: 0.5,       // ile procent ceny dostajesz, sprzedając sprzęt
    wartoscSprzetuBezCeny: 70,   // ile wart jest sprzęt z kuźni (nie ma ceny sklepowej)
    wartoscSprzetuStartowego: 12, // zardzewiały gladius i tunika są warte grosze

    gospoda: {
      kosztBazowy: 8,            // koszt pełnego leczenia = (bazowy + poziom * zaPoziom)
      kosztZaPoziom: 6           // ...przemnożony przez brakującą część HP
    },

    // --- Plac treningowy (design/arena_ekonomia.md sekcja 3) ---
    //  Zasada stamtad: wczesne treningi NATYCHMIAST za zloto, pozniejsze
    //  z timerem. Nowy gracz nie moze odbic sie od sciany czekania.
    trening: {
      kosztBazowy: 30,          // złoto = bazowy + wartość cechy * zaPunkt
      kosztZaPunkt: 18,
      progCzasu: 7,             // do tej wartości cechy trening jest od ręki
      minutZaPunkt: 12,         // powyżej progu: tyle minut za każdy punkt ponad
      minutMax: 240,            // nigdy dłużej niż 4 godziny
      klejnotyZaGodzine: 6      // skrócenie czekania: tyle klejnotów za godzinę
    },

    // --- Tablica zleceń ---
    zlecenia: {
      klejnotyZaGodzine: 6,     // skrócenie czekania za klejnoty
      minutZaReklame: 30        // ile minut ścina jedna reklama
    },

    eliksir: {
      leczenieProcentMaxHp: 0.30,
      cena: 40,
      maksWPlecaku: 5
    }
  },

  // --- Pasywy klas (zawsze aktywne, nie zajmują slotu) ---
  pasywy: {
    krwiozerczosc: { procentKradziezyZycia: 0.12 },   // Berserker leczy się z zadanych obrażeń
    krewZaKrew:    { maksBonusObrazen: 0.30 },        // Berserker: im niżej HP, tym mocniej bije
    zwinnosc:      { bonusUniku: 0.10 },              // Zabójca trudniej trafić
    celnoscZabojcy:{ bonusSzansyKrytyka: 0.10 }       // Zabójca częściej krytykuje
  },

  // --- Reklamy nagradzane (design/arena_ekonomia.md sekcja 2) ---
  //  Tylko dobrowolne, zawsze za nagrodę, z limitem dziennym, żeby
  //  były bonusem, a nie drugą pracą. Zero reklam między walkami.
  reklamy: {
    limityDzienne: {
      skrocTimer:  5,        // skrócenie treningu albo zlecenia
      podwojLup:   3,        // podwojenie złota z wygranej walki
      odpocznij:   2         // darmowe pełne leczenie w gospodzie
    }
  },

  // --- Zachowanie wrogów ---
  wrogowie: {
    szansaGardyBlokujacego: 0.30, // jak często "blokujący" wróg staje w gardzie zamiast bić

    // GLOBALNA TRUDNOSC — dwa pokrętła na całą drabinę.
    // 1.0 = tak, jak zapisano na kartach wrogów. Podnieś, gdy za łatwo.
    mnoznikHp:   1.15,          // HP wszystkich przeciwników
    mnoznikSily: 1.12           // ich obrażenia
  },

  // --- Tempo interfejsu (odczucie walki) ---
  ui: {
    pauzaPrzedTuraWroga: 650,   // ms — ile czekamy, zanim wróg uderzy
    pauzaPoTurzeWroga: 450,     // ms — ile czekamy przed oddaniem tury Tobie
    czasAtakuMs: 700,           // ms — jak długo widać grafikę ataku bohatera
    czasTrafieniaMs: 600,       // ms — jak długo widać grafikę trafienia
    czasKlatwyMs: 1100          // ms — jak długo widać rzucanie klątwy
  }
};
