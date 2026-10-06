// ============================================================
//  DANE: bestie — druga kategoria wrogów (design/arena_bestiariusz_r2.md)
//
//  Różnią się od ludzi projektowo:
//   - zwykle BEZ pancerza (fizyczny działa dobrze)
//   - mają przynależność żywiołową: słabości, odporności, wchłanianie
//   - częściej wpadają w szał przy niskim HP
//   - dropią ESENCJE — surowiec na sprzęt magiczny
//
//  UWAGA: watahy (wilki 2-3, harpie 3x) czekają na walki grupowe.
//  Na razie każda bestia staje do pojedynku sama.
// ============================================================

const BESTIE = {

  nocnyWilk: {
    id: 'nocnyWilk', nazwa: 'Nocny wilk', ikona: '🐺', bestia: true,
    tytul: 'Jama łowów — zwierz',
    opis: 'Szybki i wygłodniały. Ugryzienie zostawia ranę, która nie chce się zamknąć.',
    hp: 46,
    cechy: { sila: 6, atak: 6, obrona: 0, zrecznosc: 7, witalnosc: 5, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Kły', obrazenia: 3 },
    pancerz: { nazwa: 'Futro', obrona: 0 },

    slabosci: ['ogien', 'lod'],
    odpornosci: [],

    ai: { typ: 'krwawiacy', szansaKrwawienia: 0.45, obrazeniaKrwawienia: 4, turyKrwawienia: 3 },
    nagroda: { zloto: 20, xp: 55, materialy: { skora: 1 }, esencje: { kielWilka: 1 } }
  },

  dzikBojowy: {
    id: 'dzikBojowy', nazwa: 'Dzik bojowy', ikona: '🐗', bestia: true,
    tytul: 'Jama łowów — zwierz',
    opis: 'Tona mięsa i kłów. Rozpędza się co kilka tur — widać to po nim.',
    hp: 75,
    cechy: { sila: 9, atak: 6, obrona: 2, zrecznosc: 4, witalnosc: 8, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Kły', obrazenia: 3 },
    pancerz: { nazwa: 'Twarda skóra', obrona: 1 },

    slabosci: ['ogien'],
    odpornosci: ['fizyczny'],          // gruba skóra tłumi zwykłe ostrza

    ai: { typ: 'szarza', coIleTur: 3, progSzalu: 0.35, mnoznikSzalu: 1.4 },
    nagroda: { zloto: 28, xp: 75, materialy: { skora: 2 }, esencje: { klyDzika: 1 } }
  },

  jaskiniowyPajak: {
    id: 'jaskiniowyPajak', nazwa: 'Jaskiniowy pająk', ikona: '🕷', bestia: true,
    tytul: 'Jama łowów — zwierz',
    opis: 'Sieć, potem jad. Trucizny na nim nie próbuj — sam nią żyje.',
    hp: 52,
    cechy: { sila: 5, atak: 7, obrona: 1, zrecznosc: 6, witalnosc: 6, charyzma: 1, wola: 3 },
    bron: { nazwa: 'Szczękoczułki', obrazenia: 2 },
    pancerz: { nazwa: 'Chitynowy pancerzyk', obrona: 1 },

    slabosci: ['ogien'],
    odpornosci: ['natura'],

    ai: { typ: 'siec', szansaSieci: 0.30, szansaJadu: 0.35 },
    nagroda: { zloto: 24, xp: 70, materialy: {}, esencje: { jadPajaka: 1 } }
  },

  kamiennyGolem: {
    id: 'kamiennyGolem', nazwa: 'Kamienny golem areny', ikona: '🗿', bestia: true,
    tytul: 'Jama łowów — konstrukt',
    opis: 'Ożywiony kamień. Ostrza się na nim tępią, trucizna spływa. Ale kamień przewodzi błyskawicę.',
    hp: 130,
    cechy: { sila: 11, atak: 6, obrona: 7, zrecznosc: 2, witalnosc: 12, charyzma: 1, wola: 2 },
    bron: { nazwa: 'Kamienna pięść', obrazenia: 3 },
    pancerz: { nazwa: 'Kamienna skorupa', obrona: 2 },

    slabosci: ['blyskawica'],
    odpornosci: ['fizyczny', 'natura'],
    odpornyNaKrwawienie: true,         // kamień nie krwawi

    ai: { typ: 'ogluszajacy', szansaOgluszenia: 0.30 },
    nagroda: { zloto: 60, xp: 170, materialy: { rudaZelaza: 2 }, esencje: { rdzenGolema: 1 } }
  },

  piesHadesa: {
    id: 'piesHadesa', nazwa: 'Pies Hadesa', ikona: '🔥', bestia: true,
    tytul: 'Jama łowów — bestia piekielna',
    opis: 'Zionie ogniem i ogniem się karmi. Uderz go płomieniem, a tylko go wzmocnisz.',
    hp: 70,
    cechy: { sila: 8, atak: 7, obrona: 2, zrecznosc: 6, witalnosc: 7, charyzma: 2, wola: 4 },
    bron: { nazwa: 'Rozpalone kły', obrazenia: 3 },
    pancerz: { nazwa: 'Spieczona skóra', obrona: 0 },

    slabosci: ['lod'],
    odpornosci: [],
    wchlania: ['ogien'],               // LECZY SIĘ od ognia — brutalna lekcja

    ai: { typ: 'zionacy', szansaZioniecia: 0.35, obrazeniaPodpalenia: 5, turyPodpalenia: 3 },
    nagroda: { zloto: 45, xp: 130, materialy: {}, esencje: { ognistaEsencja: 1 } }
  },

  mlodaHydra: {
    id: 'mlodaHydra', nazwa: 'Młoda hydra', ikona: '🐉', bestia: true,
    tytul: 'Jama łowów — bestia',
    opis: 'Regeneruje się co turę. Kto nie zadaje dość obrażeń, nie nadgoni jej gojenia. Ogień przypala kikuty.',
    hp: 110,
    cechy: { sila: 9, atak: 7, obrona: 3, zrecznosc: 5, witalnosc: 11, charyzma: 2, wola: 3 },
    bron: { nazwa: 'Wiele paszczy', obrazenia: 2 },
    pancerz: { nazwa: 'Łuski', obrona: 1 },

    slabosci: ['ogien'],
    odpornosci: [],

    ai: { typ: 'regenerujacy', regenNaTure: 6, blokujeRegen: 'ogien', szansaMultiCiosu: 0.40 },
    nagroda: { zloto: 55, xp: 160, materialy: { skora: 2 }, esencje: { krewHydry: 1 } }
  },

  harpia: {
    id: 'harpia', nazwa: 'Harpia', ikona: '🦅', bestia: true,
    tytul: 'Jama łowów — rój',
    opis: 'Wrzeszczy i nurkuje. Pojedynczo krucha, ale nigdy nie lata sama.',
    hp: 30,
    cechy: { sila: 5, atak: 7, obrona: 0, zrecznosc: 9, witalnosc: 4, charyzma: 2, wola: 2 },
    bron: { nazwa: 'Szpony', obrazenia: 2 },
    pancerz: { nazwa: 'Pióra', obrona: 0 },

    slabosci: ['lod', 'blyskawica'],
    odpornosci: [],
    trudnaDoTrafienia: 0.12,

    ai: { typ: 'wrzask', szansaWrzasku: 0.30 },
    nagroda: { zloto: 12, xp: 40, materialy: {}, esencje: { pioroHarpii: 1 } }
  },

  chimera: {
    id: 'chimera', nazwa: 'Chimera prowincji', ikona: '🦁', bestia: true, apex: true,
    tytul: 'Jama łowów ☠ Apex',
    opis: 'Lew, koza i wąż w jednym ciele. Faza lwa zionie ogniem i ogniem gardzi — faza węża traci tę odporność, ale odpłaca jadem. To samo ostrze działa świetnie raz, a kiepsko za chwilę.',
    hp: 150,
    cechy: { sila: 11, atak: 8, obrona: 4, zrecznosc: 6, witalnosc: 13, charyzma: 4, wola: 6 },
    bron: { nazwa: 'Pazury i kły', obrazenia: 3 },
    pancerz: { nazwa: 'Gruba sierść', obrona: 1 },

    slabosci: ['lod'],
    odpornosci: ['ogien'],

    ai: {
      typ: 'fazyZywiolowe',
      progFazy: 0.50,
      szansaZioniecia: 0.30, obrazeniaPodpalenia: 6, turyPodpalenia: 3,
      faza2: {
        slabosci: ['ogien'],
        odpornosci: ['natura'],
        szansaJadu: 0.45,
        komunikat: 'Chimera zwija się — ogon-wąż przejmuje kontrolę. Ogień przestaje jej służyć!'
      }
    },
    nagroda: { zloto: 120, xp: 300, materialy: { skora: 2 }, esencje: { serceChimery: 1 } }
  }
};

// Esencje — surowiec do sprzętu MAGICZNEGO (osobny od zwykłych materiałów)
const ESENCJE = {
  kielWilka:      { nazwa: 'Kieł wilka',      ikona: '🦷' },
  klyDzika:       { nazwa: 'Kły dzika',       ikona: '🐗' },
  jadPajaka:      { nazwa: 'Jad pająka',      ikona: '🕸' },
  rdzenGolema:    { nazwa: 'Rdzeń golema',    ikona: '💠' },
  ognistaEsencja: { nazwa: 'Ognista esencja', ikona: '🔥' },
  krewHydry:      { nazwa: 'Krew hydry',      ikona: '🩸' },
  pioroHarpii:    { nazwa: 'Pióro harpii',     ikona: '🪶' },
  serceChimery:   { nazwa: 'Serce chimery',   ikona: '💜' }
};

// Kolejność w jamie łowów — od najłatwiejszej
const JAMA_LOWOW = ['nocnyWilk', 'jaskiniowyPajak', 'dzikBojowy', 'piesHadesa',
                    'mlodaHydra', 'kamiennyGolem', 'chimera'];

// Bestie dołączają do wspólnej tablicy wrogów — DRABINA (rangi 1-15)
// powstała wcześniej, więc zostaje nietknięta.
Object.assign(WROGOWIE, BESTIE);

// ============================================================
//  WATAHY — walki grupowe
//  Kilka słabszych ciał zamiast jednego dużego. Wymaga wyboru celu
//  i nagradza obrażenia obszarowe (design/arena_bestiariusz_r2.md).
// ============================================================

const WATAHY = {
  watahaWilkow: {
    id: 'watahaWilkow', nazwa: 'Wataha wilków', ikona: '🐺',
    tytul: 'Jama łowów — wataha',
    opis: 'Trzy pyski naraz. Pojedynczy wilk to nic — wataha to problem.',
    sklad: ['nocnyWilk', 'nocnyWilk', 'nocnyWilk']
  },

  gniazdoPajakow: {
    id: 'gniazdoPajakow', nazwa: 'Gniazdo pająków', ikona: '🕷',
    tytul: 'Jama łowów — gniazdo',
    opis: 'Dwa odwłoki, cztery szczękoczułki i mnóstwo sieci.',
    sklad: ['jaskiniowyPajak', 'jaskiniowyPajak']
  },

  rojHarpii: {
    id: 'rojHarpii', nazwa: 'Rój harpii', ikona: '🦅',
    tytul: 'Jama łowów — rój',
    opis: 'Trzy wrzeszczące cienie. Trudno je trafić, a wrzask psuje Ci celność.',
    sklad: ['harpia', 'harpia', 'harpia']
  }
};

// Co można upolować: pojedyncze bestie i watahy
const LOWY = ['nocnyWilk', 'watahaWilkow', 'jaskiniowyPajak', 'gniazdoPajakow',
              'dzikBojowy', 'rojHarpii', 'piesHadesa', 'mlodaHydra',
              'kamiennyGolem', 'chimera'];
