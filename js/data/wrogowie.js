// ============================================================
//  DANE: wrogowie — pełna drabina 15 rang (design/arena_region1.md)
//
//  Liczby cech dobrane tak, żeby "groźba (cios)" z dokumentu
//  zgadzała się po odjęciu pancerza referencyjnego gracza.
//
//  ai.typ:  'prosty'     — tylko bije
//           'blokujacy'  — czasem staje w gardzie
//           'szarza'     — telegrafuje i szarżuje (Rufus)
//           'siec'       — zarzuca sieć: ogłuszenie / spowolnienie
//           'trujacy'    — czasem tnie jadem
//           'krytyczny'  — częściej krytykuje
//           'szal'       — poniżej progu HP wpada w szał
//           'leczacy'    — raz w walce się opatruje
//           'klatwa'     — rzuca klątwę osłabiającą
//           'fazy'       — zmienia statystyki po przekroczeniu progu (Verrus)
// ============================================================

const WROGOWIE = {

  balbus: {
    id: 'balbus', ranga: 1, nazwa: 'Balbus Nowicjusz', ikona: '🪖',
    tytul: 'Ranga 1 — Ludus w Kapui',
    opis: 'Świeży rekrut. Żywy worek treningowy.',
    hp: 32,
    cechy: { sila: 3, atak: 3, obrona: 1, zrecznosc: 3, witalnosc: 4, charyzma: 1, wola: 1 },
    bron: { nazwa: 'Drewniany miecz', obrazenia: 3 },
    pancerz: { nazwa: 'Przepaska', obrona: 0 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 15, xp: 20, materialy: { zelaznyZlom: 2 } }
  },

  sura: {
    id: 'sura', ranga: 2, nazwa: 'Sura Zbieg', ikona: '🏃',
    tytul: 'Ranga 2 — Ludus w Kapui',
    opis: 'Zwinny i wystraszony. Często się wywija — celność ma znaczenie.',
    hp: 36,
    cechy: { sila: 4, atak: 4, obrona: 1, zrecznosc: 6, witalnosc: 4, charyzma: 2, wola: 1 },
    bron: { nazwa: 'Nóż', obrazenia: 3 },
    pancerz: { nazwa: 'Łachmany', obrona: 0 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 18, xp: 28, materialy: { zelaznyZlom: 1, skora: 1 } }
  },

  porcius: {
    id: 'porcius', ranga: 3, nazwa: 'Porcius Opasły', ikona: '🍖',
    tytul: 'Ranga 3 — Ludus w Kapui',
    opis: 'Powolna góra mięsa. Zasłania się i czeka, aż się zmęczysz. Lekcja cierpliwości.',
    hp: 48,
    cechy: { sila: 5, atak: 4, obrona: 3, zrecznosc: 2, witalnosc: 6, charyzma: 2, wola: 1 },
    bron: { nazwa: 'Maczuga', obrazenia: 3 },
    pancerz: { nazwa: 'Gruby kaftan', obrona: 1 },
    ai: { typ: 'blokujacy', szansaGardy: 0.35 },
    nagroda: { zloto: 20, xp: 36, materialy: { zelaznyZlom: 1, rudaZelaza: 1 } }
  },

  decimus: {
    id: 'decimus', ranga: 4, nazwa: 'Decimus Włócznik', ikona: '🔱',
    tytul: 'Ranga 4 — Ludus w Kapui',
    opis: 'Włócznia daje mu zasięg — prawie zawsze uderza pierwszy.',
    hp: 46,
    cechy: { sila: 5, atak: 5, obrona: 2, zrecznosc: 5, witalnosc: 5, charyzma: 2, wola: 1 },
    bron: { nazwa: 'Włócznia', obrazenia: 3 },
    pancerz: { nazwa: 'Skórzany kaftan', obrona: 1 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 22, xp: 45, materialy: { zelaznyZlom: 1, rudaZelaza: 1 } }
  },

  rufus: {
    id: 'rufus', ranga: 5, nazwa: 'Rufus Byk', ikona: '🐂', miniboss: true,
    tytul: 'Ranga 5 ★ Miniboss',
    opis: 'Byk w ludzkiej skórze. Co kilka tur szykuje szarżę — widać to po nim. Zdąż stanąć w gardzie.',
    hp: 60,
    cechy: { sila: 7, atak: 6, obrona: 3, zrecznosc: 3, witalnosc: 6, charyzma: 3, wola: 2 },
    bron: { nazwa: 'Ciężki topór', obrazenia: 3 },
    pancerz: { nazwa: 'Bycza skóra', obrona: 1 },
    ai: { typ: 'szarza', coIleTur: 3 },
    artefakty: { amuletLwa: 0.35 },
    nagroda: { zloto: 40, xp: 90, materialy: { skoraByka: 2, skora: 2 } }
  },

  gemina: {
    id: 'gemina', ranga: 6, nazwa: 'Gemina Siatkarka', ikona: '🕸',
    tytul: 'Ranga 6 — Ludus w Kapui',
    opis: 'Retiarius. Zarzuca sieć — tracisz turę albo zwalniasz na kilka rund.',
    hp: 58,
    cechy: { sila: 6, atak: 6, obrona: 3, zrecznosc: 5, witalnosc: 6, charyzma: 3, wola: 2 },
    bron: { nazwa: 'Trójząb', obrazenia: 3 },
    pancerz: { nazwa: 'Naramiennik', obrona: 1 },
    ai: { typ: 'siec', szansaSieci: 0.30 },
    nagroda: { zloto: 25, xp: 70, materialy: { skora: 1 } }
  },

  lucius: {
    id: 'lucius', ranga: 7, nazwa: 'Blady Lucius', ikona: '🧪',
    tytul: 'Ranga 7 — Ludus w Kapui',
    opis: 'Słaby cios, ale ostrze ma nasączone jadem. Trucizna omija pancerz — leczenie ma znaczenie.',
    hp: 55,
    cechy: { sila: 5, atak: 6, obrona: 2, zrecznosc: 5, witalnosc: 6, charyzma: 2, wola: 3 },
    bron: { nazwa: 'Zatruty sztylet', obrazenia: 2 },
    pancerz: { nazwa: 'Ciemna szata', obrona: 0 },
    ai: { typ: 'trujacy', szansaJadu: 0.40 },
    nagroda: { zloto: 26, xp: 80, materialy: { fiolkaJadu: 1 } }
  },

  murmillo: {
    id: 'murmillo', ranga: 8, nazwa: 'Murmillo Castor', ikona: '🛡',
    tytul: 'Ranga 8 — Ludus w Kapui',
    opis: 'Ciężka tarcza i hełm z rybim grzebieniem. Wysoka Obrona, często blokuje — trzeba przebić gardę.',
    hp: 64,
    cechy: { sila: 6, atak: 7, obrona: 4, zrecznosc: 4, witalnosc: 8, charyzma: 3, wola: 2 },
    bron: { nazwa: 'Gladius', obrazenia: 3 },
    pancerz: { nazwa: 'Ciężka tarcza', obrona: 2 },
    ai: { typ: 'blokujacy', szansaGardy: 0.30 },
    nagroda: { zloto: 30, xp: 95, materialy: { brazowyZlom: 1, rudaZelaza: 1 } }
  },

  vala: {
    id: 'vala', ranga: 9, nazwa: 'Vala Łowczyni', ikona: '🎯',
    tytul: 'Ranga 9 — Ludus w Kapui',
    opis: 'Szuka szpar w pancerzu. Bardzo często trafia krytycznie — jeden cios potrafi zaboleć.',
    hp: 60,
    cechy: { sila: 7, atak: 7, obrona: 3, zrecznosc: 6, witalnosc: 7, charyzma: 3, wola: 2 },
    bron: { nazwa: 'Wygięty tasak', obrazenia: 3 },
    pancerz: { nazwa: 'Lekka zbroja', obrona: 1 },
    ai: { typ: 'krytyczny', bonusKrytyka: 0.22 },
    artefakty: { kielWilka: 0.30, amuletLwa: 0.15 },
    nagroda: { zloto: 32, xp: 105, materialy: { skora: 1 } }
  },

  hister: {
    id: 'hister', ranga: 10, nazwa: 'Hister Kat', ikona: '🪒', miniboss: true,
    tytul: 'Ranga 10 ★ Miniboss',
    opis: 'Kat ludusu. Poniżej 40% HP wpada w szał: bije o połowę mocniej, ale przestaje się kryć.',
    hp: 95,
    cechy: { sila: 11, atak: 8, obrona: 5, zrecznosc: 6, witalnosc: 10, charyzma: 4, wola: 3 },
    bron: { nazwa: 'Katowski topór', obrazenia: 2 },
    pancerz: { nazwa: 'Kolczuga', obrona: 1 },
    ai: { typ: 'szal', progSzalu: 0.40, mnoznikObrazen: 1.5, mnoznikObrony: 0.5 },
    artefakty: { pierscienGniewu: 0.60 },
    nagroda: { zloto: 70, xp: 190, materialy: { stalLudusu: 2, brazowyZlom: 1 } }
  },

  juba: {
    id: 'juba', ranga: 11, nazwa: 'Juba Nubijczyk', ikona: '💪',
    tytul: 'Ranga 11 — Ludus w Kapui',
    opis: 'Czysta siła, zero finezji. Po prostu bardzo mocno bije.',
    hp: 78,
    cechy: { sila: 10, atak: 7, obrona: 4, zrecznosc: 4, witalnosc: 9, charyzma: 3, wola: 2 },
    bron: { nazwa: 'Wielki młot', obrazenia: 2 },
    pancerz: { nazwa: 'Skórznia', obrona: 1 },
    ai: { typ: 'prosty' },
    nagroda: { zloto: 35, xp: 130, materialy: { rudaZelaza: 2, skora: 1 } }
  },

  aulus: {
    id: 'aulus', ranga: 12, nazwa: 'Aulus Weteran', ikona: '🍷',
    tytul: 'Ranga 12 — Ludus w Kapui',
    opis: 'Stary wyjadacz. Raz w walce opatruje rany — dokładnie jak Ty eliksirem.',
    hp: 82,
    cechy: { sila: 8, atak: 8, obrona: 5, zrecznosc: 5, witalnosc: 9, charyzma: 4, wola: 3 },
    bron: { nazwa: 'Wysłużony gladius', obrazenia: 2 },
    pancerz: { nazwa: 'Lorica', obrona: 2 },
    ai: { typ: 'leczacy', progLeczenia: 0.45, leczenieProcent: 0.30 },
    artefakty: { kamienGospody: 0.25 },
    nagroda: { zloto: 40, xp: 145, materialy: { brazowyZlom: 1 } }
  },

  kaplanka: {
    id: 'kaplanka', ranga: 13, nazwa: 'Kapłanka Dis', ikona: '🕯',
    tytul: 'Ranga 13 — Ludus w Kapui',
    opis: 'Służka bogów podziemia. Rzuca klątwę, która osłabia Twoje ciosy na kilka tur.',
    hp: 80,
    cechy: { sila: 7, atak: 8, obrona: 4, zrecznosc: 6, witalnosc: 9, charyzma: 5, wola: 6 },
    bron: { nazwa: 'Obsydianowy sierp', obrazenia: 2 },
    pancerz: { nazwa: 'Szata kapłanki', obrona: 1 },
    ai: { typ: 'klatwa', szansaKlatwy: 0.35, oslabienieAtaku: 3, turyKlatwy: 3 },
    artefakty: { amuletKrwiopijcy: 0.30, skorzanyTalizman: 0.20 },
    nagroda: { zloto: 35, xp: 155, materialy: { fiolkaJadu: 1 } }
  },

  straznik: {
    id: 'straznik', ranga: 14, nazwa: 'Strażnik Cesarski', ikona: '🦅',
    tytul: 'Ranga 14 — Ludus w Kapui',
    opis: 'Najlepszy sprzęt w regionie i pełne wyszkolenie. Wszechstronny i groźny.',
    hp: 92,
    cechy: { sila: 10, atak: 9, obrona: 6, zrecznosc: 6, witalnosc: 10, charyzma: 4, wola: 3 },
    bron: { nazwa: 'Cesarski gladius', obrazenia: 2 },
    pancerz: { nazwa: 'Lorica segmentata', obrona: 2 },
    ai: { typ: 'blokujacy', szansaGardy: 0.22 },
    artefakty: { znakMarsa: 0.35 },
    nagroda: { zloto: 45, xp: 175, materialy: { stalLudusu: 1 } }
  },

  verrus: {
    id: 'verrus', ranga: 15, nazwa: 'Verrus Żelazna Ręka', ikona: '⚙', czempion: true,
    tytul: 'Ranga 15 ☠ Czempion regionu',
    opis: 'Weteran z żelazną protezą zamiast dłoni. Faza 1: mur nie do przebicia. Poniżej połowy HP odrzuca tarczę i wpada w furię — traci pancerz, ale przyspiesza i bije mocniej.',
    hp: 145,
    cechy: { sila: 12, atak: 9, obrona: 11, zrecznosc: 5, witalnosc: 13, charyzma: 5, wola: 4 },
    bron: { nazwa: 'Żelazna pięść', obrazenia: 3 },
    pancerz: { nazwa: 'Tarcza czempiona', obrona: 0 },
    ai: {
      typ: 'fazy',
      szansaGardy: 0.35,          // w fazie 1 czesto blokuje
      progFazy: 0.50,
      faza2: { obrona: 5, zrecznosc: 8, mnoznikObrazen: 1.3, szansaGardy: 0 }
    },
    artefakty: { talizmanFortuny: 1.0 },
    nagroda: { zloto: 150, xp: 350, materialy: { przepustkaDoGalii: 1, stalLudusu: 2 } }
  }
};

// Materiały wypadające z wrogów — przydadzą się w kuźni (krok 5)
const MATERIALY = {
  zelaznyZlom:       { nazwa: 'Żelazny złom',        ikona: '🔩' },
  skora:             { nazwa: 'Skóra',               ikona: '🟫' },
  rudaZelaza:        { nazwa: 'Ruda żelaza',         ikona: '⛏' },
  skoraByka:         { nazwa: 'Skóra byka',          ikona: '🐂' },
  fiolkaJadu:        { nazwa: 'Fiolka jadu',         ikona: '🧪' },
  brazowyZlom:       { nazwa: 'Brązowy złom',        ikona: '🟠' },
  stalLudusu:        { nazwa: 'Stal ludusu',         ikona: '⚔' },
  przepustkaDoGalii: { nazwa: 'Przepustka do Galii', ikona: '📜' }
};

// Drabina areny: identyfikatory wrogów w kolejności rang 1..15
// Drabina liczona per region. Region 1 to prolog (kamieniołomy, 5 walk),
// region 2 to Ludus w Kapui (15 rang). Wrogowie bez pola `region`
// należą do regionu 2 — to było pierwsze, co powstało.
function drabinaRegionu(nr) {
  // Tylko wrogowie Z RANGĄ. Bestie dołączają do WROGOWIE później
  // (js/data/bestie.js) i rangi nie mają — ich miejsce jest w Jamie
  // łowów, nie na drabinie.
  const lista = Object.values(WROGOWIE)
    .filter(w => w.ranga && (w.region || 2) === nr)
    .sort((a, b) => a.ranga - b.ranga);

  // Walka grupowa zastępuje w drabinie pojedynczego wroga o tej randze.
  return lista.map(w => {
    const wataha = typeof WATAHY !== 'undefined'
      ? Object.values(WATAHY).find(x => x.ranga && (x.region || 2) === nr && x.ranga === w.ranga)
      : null;
    return wataha ? wataha.id : w.id;
  }).filter((id, i, tab) => tab.indexOf(id) === i);
}

// Zgodność ze starym kodem: DRABINA to wciąż region 2.
const DRABINA = Object.values(WROGOWIE)
  .filter(w => (w.region || 2) === 2)
  .sort((a, b) => a.ranga - b.ranga).map(w => w.id);
