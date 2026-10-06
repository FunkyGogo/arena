// ============================================================
//  DANE: klasy bohatera — trzy klasy melee wersji 1.
//  Wszystkie mają po 28 punktów cech, rozdzielonych inaczej.
//  Cechy Wojownika = referencyjny build z design/arena_region1.md
// ============================================================

const KLASY = {

  wojownik: {
    id: 'wojownik',
    nazwa: 'Wojownik',
    ikona: '🛡',
    zasob: 'wigor',
    haslo: 'Pewny i wytrzymały',
    opis: 'Przetrwanie przez obronę. Garda ładuje Wigor, Roztrzaskanie łamie pancerz, Drugi oddech trzyma Cię na nogach. Wybacza błędy — najlepszy na pierwsze przejście.',
    trudnosc: 'łatwy',

    cechy: { sila: 6, atak: 5, obrona: 4, zrecznosc: 4, witalnosc: 6, charyzma: 3, wola: 2 },

    bronStartowa:    'zardzewialyGladius',
    pancerzStartowy: 'tunika',

    atakPodstawowy: 'cios',
    startowyWezel: 'garda'        // generator dostajesz za darmo na start
  },

  berserker: {
    id: 'berserker',
    nazwa: 'Berserker',
    ikona: '🔥',
    zasob: 'furia',
    haslo: 'Lawina obrażeń, cienka skóra',
    opis: 'Furia rośnie, gdy zadajesz i gdy obrywasz — musisz przyjmować ciosy, żeby urosnąć w siłę. Leczysz się kradzieżą życia zamiast obroną, a im bliżej śmierci, tym mocniej bijesz. Wysokie ryzyko.',
    trudnosc: 'ryzykowny',

    cechy: { sila: 8, atak: 5, obrona: 2, zrecznosc: 4, witalnosc: 5, charyzma: 4, wola: 2 },

    bronStartowa:    'obosiecznyTopor',
    pancerzStartowy: 'skory',

    atakPodstawowy: 'ciecie',
    startowyWezel: 'krwawaOfiara'
  },

  zabojca: {
    id: 'zabojca',
    nazwa: 'Zabójca',
    ikona: '🗡',
    zasob: 'kombo',
    haslo: 'Krytyki, jad, uniki',
    opis: 'Budujesz Kombo trafieniami i detonujesz je finiszerem. Jad omija pancerz, cień daje pewnego krytyka, riposta karze atakującego. Ale pudło albo oberwany cios kasuje Kombo — i masz najmniej HP.',
    trudnosc: 'wymagający',

    cechy: { sila: 5, atak: 7, obrona: 2, zrecznosc: 7, witalnosc: 4, charyzma: 3, wola: 2 },

    bronStartowa:    'paraSztyletow',
    pancerzStartowy: 'ciemneLachy',

    atakPodstawowy: 'pchniecie',
    startowyWezel: 'zejscieWCien'
  },

  lucznik: {
    id: 'lucznik',
    nazwa: 'Łucznik',
    ikona: '🏹',
    zasob: 'skupienie',
    haslo: 'Nie daj się dopaść',
    opis: 'Otwierasz walkę z dystansu i strzelasz, zanim wróg dobiegnie. Spowalniasz go, łapiesz w sidła, odskakujesz. Strzały żywiołowe dają Ci statusy jak magowi — bez many. Ale w zwarciu jesteś kruchy i jeden dobry cios boli.',
    trudnosc: 'taktyczny',
    dystansowa: true,

    cechy: { sila: 5, atak: 8, obrona: 2, zrecznosc: 7, witalnosc: 4, charyzma: 2, wola: 3 },

    bronStartowa:    'prostyLuk',
    pancerzStartowy: 'kurtaLowcy',

    atakPodstawowy: 'strzal',
    startowyWezel: 'wezNaCel'
  },

  mag: {
    id: 'mag',
    nazwa: 'Mag',
    ikona: '🔮',
    zasob: 'mana',
    haslo: 'Szklana armata na pancerz',
    opis: 'Żywioły omijają pancerz, więc opancerzony boss, który jest ścianą dla wojownika, dla Ciebie jest celem idealnym. Otwierasz z dystansu i kitujesz, bo dwa dobre ciosy Cię kładą. Pusta mana = zostaje sama iskra.',
    trudnosc: 'kruchy',
    dystansowa: true,
    cechaObrazen: 'wola',

    cechy: { sila: 2, atak: 6, obrona: 2, zrecznosc: 5, witalnosc: 4, charyzma: 3, wola: 8 },

    bronStartowa:    'prostyKostur',
    pancerzStartowy: 'szataAdepta',

    atakPodstawowy: 'iskra',
    startowyWezel: 'medytacja'
  },

  druid: {
    id: 'druid',
    nazwa: 'Druid',
    ikona: '🌿',
    zasob: 'mana',
    haslo: 'Nie umiera, aż wróg padnie',
    opis: 'Nie zabijasz szybko — po prostu przeżywasz wszystko. Przyzwana bestia przejmuje uwagę wroga, zaraza truje przez pancerz, a Ty leczysz się szybciej, niż tracisz HP. W grze, gdzie zdrowie nie wraca samo, to najmocniejsza rzecz, jaką można mieć.',
    trudnosc: 'złożony',
    cechaObrazen: 'wola',

    cechy: { sila: 3, atak: 5, obrona: 3, zrecznosc: 4, witalnosc: 6, charyzma: 3, wola: 6 },

    bronStartowa:    'sekatyKij',
    pancerzStartowy: 'skoraNiedzwiedzia',

    atakPodstawowy: 'ciosKonarem',
    startowyWezel: 'wiezZNatura'
  }
};

// Opisy pasywów — pokazywane na ekranie wyboru klasy i w spisie umiejętności.
const PASYWY = {
  krwiozerczosc:  { nazwa: 'Krwiożerczość', ikona: '🩸',
                    opis: `Leczysz ${Math.round(CONFIG.pasywy.krwiozerczosc.procentKradziezyZycia * 100)}% zadanych obrażeń.` },
  krewZaKrew:     { nazwa: 'Krew za krew', ikona: '💀',
                    opis: `Im niżej masz HP, tym mocniej bijesz — do +${Math.round(CONFIG.pasywy.krewZaKrew.maksBonusObrazen * 100)}% obrażeń.` },
  zwinnosc:       { nazwa: 'Zwinność', ikona: '💨',
                    opis: `Wrogom o ${Math.round(CONFIG.pasywy.zwinnosc.bonusUniku * 100)}% trudniej Cię trafić.` },
  celnoscZabojcy: { nazwa: 'Celność zabójcy', ikona: '🎯',
                    opis: `+${Math.round(CONFIG.pasywy.celnoscZabojcy.bonusSzansyKrytyka * 100)}% szansy na krytyka.` }
};
