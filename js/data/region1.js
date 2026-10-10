// ============================================================
//  REGION 1 — KAMIENIOŁOMY (prolog)
//  design/arena_regiony.md, sekcja "Region 1"
//
//  Samouczek: pięć walk, słaby boss, wyjście proste i szybkie.
//  Każda walka czegoś uczy, a przeciwnicy są celowo łagodni —
//  nowy gracz ma poczuć rytm swojej klasy, a nie odbić się od ściany.
//
//  Tu NIE MA miasta. Jesteś niewolnikiem w kamieniołomie: nie ma
//  sklepu, gospody ani kuźni. Rany goją się same, z czasem.
// ============================================================

// Nagrody sa CELOWO male. Prolog ma wypuscic Cie do Kapui mniej wiecej
// na 2. poziomie i z groszami w sakiewce — inaczej pierwsze rangi Kapui
// robia sie bez wyzwania. Sprawdzone: przy dwukrotnie wyzszych nagrodach
// wchodzilo sie na 4. poziomie z 255 zlota.
const WROGOWIE_R1 = {

  straznikKamieniolomu: {
    id: 'straznikKamieniolomu', region: 1, ranga: 1, nazwa: 'Strażnik z biczem', ikona: '🪨',
    tytul: 'Walka 1 — bunt w kamieniołomie',
    opis: 'Leniwy, zaspany, pewny swego. Nie spodziewa się, że niewolnik odda cios.',
    uczy: 'Naciśnij atak podstawowy. To wszystko, czego teraz trzeba.',
    hp: 22,
    cechy: { sila: 2, atak: 2, obrona: 0, zrecznosc: 2, witalnosc: 3, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Krótki bicz', obrazenia: 1 },
    pancerz: { nazwa: 'Skórzany kaftan', obrona: 0 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 5, xp: 10, materialy: {} }
  },

  straznikZbrojowni: {
    id: 'straznikZbrojowni', region: 1, ranga: 2, nazwa: 'Strażnik zbrojowni', ikona: '🗝',
    tytul: 'Walka 2 — zbrojownia',
    opis: 'Stoi między Tobą a bronią. Po nim zostanie zardzewiały gladius.',
    uczy: 'Użyj swojej drugiej akcji — tej, która ładuje albo wydaje zasób klasy.',
    hp: 28,
    cechy: { sila: 3, atak: 3, obrona: 1, zrecznosc: 2, witalnosc: 3, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Pałka', obrazenia: 2 },
    pancerz: { nazwa: 'Skórzany kaftan', obrona: 1 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 8, xp: 14, materialy: { zelaznyZlom: 1 } }
  },

  straznikKoszar: {
    id: 'straznikKoszar', region: 1, ranga: 3, nazwa: 'Strażnik koszar', ikona: '🛡',
    tytul: 'Walka 3 — koszary',
    opis: 'Tym razem nie jest sam. Dwóch naraz to już prawdziwa walka.',
    uczy: 'Wrzuć umiejętność z drzewka na wolny slot i użyj jej.',
    hp: 26,
    cechy: { sila: 3, atak: 3, obrona: 1, zrecznosc: 3, witalnosc: 3, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Krótka włócznia', obrazenia: 2 },
    pancerz: { nazwa: 'Skórzany kaftan', obrona: 1 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 10, xp: 18, materialy: { zelaznyZlom: 1 } }
  },

  weteranBramy: {
    id: 'weteranBramy', region: 1, ranga: 4, nazwa: 'Weteran przy bramie', ikona: '🚪',
    tytul: 'Walka 4 — brama',
    opis: 'Stary żołnierz, nie strażnik. Bierze zamach, który widać z daleka — zdąż się zasłonić.',
    uczy: 'Gdy szykuje cios, stań w gardzie albo wypij eliksir. Nie bij na ślepo.',
    hp: 46,
    cechy: { sila: 5, atak: 4, obrona: 2, zrecznosc: 3, witalnosc: 5, charyzma: 2, wola: 2 },
    bron: { nazwa: 'Stary gladius', obrazenia: 3 },
    pancerz: { nazwa: 'Przetarta lorica', obrona: 2 },
    ai: { typ: 'szarza', coIleTur: 3 },
    nagroda: { zloto: 16, xp: 26, materialy: { zelaznyZlom: 2 } }
  },

  nadzorca: {
    id: 'nadzorca', region: 1, ranga: 5, nazwa: 'Nadzorca kamieniołomu', ikona: '🔥', miniboss: true,
    tytul: 'Walka 5 ★ Nadzorca',
    opis: 'Okrutny, ale nie wojownik. Trzaska biczem, żeby odebrać Ci celność — i liczy, że to wystarczy.',
    uczy: 'Jego bicz psuje Ci celność na kilka tur. Przeczekaj to w gardzie albo bij mimo wszystko.',
    hp: 62,
    cechy: { sila: 5, atak: 5, obrona: 2, zrecznosc: 4, witalnosc: 6, charyzma: 4, wola: 3 },
    bron: { nazwa: 'Bicz nadzorcy', obrazenia: 3 },
    pancerz: { nazwa: 'Kaftan z ćwiekami', obrona: 2 },
    ai: { typ: 'bicz', szansaBicza: 0.35 },
    // Po pierwszym pokonaniu gracz wybiera JEDNA z trzech rzeczy.
    // Lista jest filtrowana pod klase, wiec luk nie trafi do maga,
    // a tarcza do lucznika. Pokazujemy pierwsze trzy, ktore pasuja.
    lupDoWyboru: ['skorzanyHelm', 'lekkaTarcza', 'skorzaneNagolenniki', 'skorzanaUprzaz'],
    nagroda: { zloto: 25, xp: 40, materialy: { zelaznyZlom: 3 } }
  }
};

// Walka 3 to dwóch strażników naraz — pierwszy raz, gdy trzeba wybierać cel.
const WATAHY_R1 = {
  koszary: {
    id: 'koszary', region: 1, ranga: 3, nazwa: 'Dwóch strażników', ikona: '🛡',
    tytul: 'Walka 3 — koszary',
    uczy: 'Dwóch naraz. Wrzuć umiejętność z drzewka na wolny slot i użyj jej.',
    sklad: ['straznikKoszar', 'straznikKoszar']
  }
};

Object.assign(WROGOWIE, WROGOWIE_R1);
Object.assign(WATAHY, WATAHY_R1);
