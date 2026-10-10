// ============================================================
//  REGION 1 — KAMIENIOŁOMY (prolog)
//  design/arena_regiony.md, sekcja "Region 1"
//
//  Samouczek: TRZY walki, słaby boss, wyjście proste i szybkie.
//  Dokument mówił o pięciu, ale przy graniu wyszło, że to za długo
//  jak na pokazanie, o co chodzi. Zostały trzy wyraźne kroki:
//  cios, reakcja na telegrafowany zamach, boss.
//
//  Tu NIE MA miasta. Jesteś niewolnikiem w kamieniołomie: nie ma
//  sklepu, gospody ani kuźni. Za to po KAŻDEJ wygranej wracasz do
//  pełni sił (patrz Bohater.poWalcePrologu) — bez dostępu do leczenia
//  prolog robił się nie do przejścia.
//
//  Nagrody są celowo małe: prolog ma wypuścić Cię do Kapui mniej
//  więcej na 2. poziomie i z groszami w sakiewce.
// ============================================================

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
    nagroda: { zloto: 8, xp: 16, materialy: { zelaznyZlom: 1 } }
  },

  weteranBramy: {
    id: 'weteranBramy', region: 1, ranga: 2, nazwa: 'Weteran przy bramie', ikona: '🚪',
    tytul: 'Walka 2 — brama',
    opis: 'Stary żołnierz, nie strażnik. Bierze zamach, który widać z daleka — zdąż się zasłonić.',
    uczy: 'Gdy szykuje cios, stań w gardzie albo użyj umiejętności. Nie bij na ślepo.',
    hp: 42,
    cechy: { sila: 4, atak: 4, obrona: 2, zrecznosc: 3, witalnosc: 5, charyzma: 2, wola: 2 },
    bron: { nazwa: 'Stary gladius', obrazenia: 3 },
    pancerz: { nazwa: 'Przetarta lorica', obrona: 2 },
    ai: { typ: 'szarza', coIleTur: 3 },
    nagroda: { zloto: 20, xp: 34, materialy: { zelaznyZlom: 2 } }
  },

  nadzorca: {
    id: 'nadzorca', region: 1, ranga: 3, nazwa: 'Nadzorca kamieniołomu', ikona: '🔥', miniboss: true,
    tytul: 'Walka 3 ★ Nadzorca',
    opis: 'Okrutny, ale nie wojownik. Trzaska biczem, żeby odebrać Ci celność — i liczy, że to wystarczy.',
    uczy: 'Jego bicz psuje Ci celność na kilka tur. Przeczekaj to w gardzie albo bij mimo wszystko.',
    hp: 58,
    cechy: { sila: 5, atak: 5, obrona: 2, zrecznosc: 4, witalnosc: 6, charyzma: 4, wola: 3 },
    bron: { nazwa: 'Bicz nadzorcy', obrazenia: 3 },
    pancerz: { nazwa: 'Kaftan z ćwiekami', obrona: 2 },
    ai: { typ: 'bicz', szansaBicza: 0.35 },
    // Po pierwszym pokonaniu gracz wybiera JEDNĄ z trzech rzeczy.
    // Lista jest filtrowana pod klasę, więc tarcza nie trafi do łucznika.
    // Broń najpierw, żeby wybór był prawdziwy: atak albo obrona.
    // Trzy pozycje dla każdej klasy — melee dostaje gladius,
    // łucznik łuk, mag i druid kostur.
    lupDoWyboru: ['zelaznyGladius', 'lukMysliwski', 'kosturZKapui',
                  'skorzanaUprzaz', 'skorzanyHelm'],
    nagroda: { zloto: 34, xp: 56, materialy: { zelaznyZlom: 3 } }
  }
};

Object.assign(WROGOWIE, WROGOWIE_R1);
