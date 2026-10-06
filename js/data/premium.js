// ============================================================
//  DANE: towar za KLEJNOTY (waluta premium)
//
//  UWAGA PROJEKTOWA. design/arena_ekonomia.md mowi: "zarabiamy na
//  czasie, wygodzie i kosmetyce — nie na sile". Ten plik sprzedaje
//  SILE, wiec swiadomie lamie tamta zasade. Zeby nie bylo to czyste
//  pay-to-win, klejnoty sa tez do zdobycia w grze (patrz KLEJNOTY_ZA).
//  Gdybys chcial wrocic do uczciwego F2P, wystarczy obnizyc
//  statystyki ponizej do poziomu sklepowego i zostawic sam wyglad.
// ============================================================

const PRZEDMIOTY_PREMIUM = {

  // ---------- bronie ----------

  ostrzeZGwiezdnejStali: {
    id: 'ostrzeZGwiezdnejStali', nazwa: 'Ostrze z gwiezdnej stali', ikona: '⚔',
    typ: 'bron', obrazenia: 11, bonusCelnosci: 0.08, klejnoty: 120,
    opis: 'Kuta z meteorytu. Lżejsza niż żelazo i nie tępi się nigdy.'
  },
  mlotBurzy: {
    id: 'mlotBurzy', nazwa: 'Młot burzy', ikona: '🔨',
    typ: 'bron', obrazenia: 13, klejnoty: 140,
    opis: 'Ciężki jak grzech. Każde uderzenie niesie się echem po arenie.'
  },
  szeptSkrytobojcy: {
    id: 'szeptSkrytobojcy', nazwa: 'Szept skrytobójcy', ikona: '🔪',
    typ: 'bron', obrazenia: 8, bonusKrytyka: 0.15, klejnoty: 130,
    opis: 'Para ostrzy tak cienkich, że rana boli dopiero po wszystkim.'
  },
  lukZlotegoSwitu: {
    id: 'lukZlotegoSwitu', nazwa: 'Łuk złotego świtu', ikona: '🏹',
    typ: 'bron', obrazenia: 10, dystansowa: true, bonusCelnosci: 0.10, klejnoty: 130,
    opis: 'Cięciwa śpiewa. Strzała trafia tam, gdzie patrzysz.'
  },
  berloPierwszegoOgnia: {
    id: 'berloPierwszegoOgnia', nazwa: 'Berło pierwszego ognia', ikona: '🔥',
    typ: 'bron', obrazenia: 11, magiczna: true, klejnoty: 140,
    opis: 'W głowicy tli się iskra starsza niż Rzym.'
  },

  // ---------- zbroja ----------

  pancerzLegionuCieni: {
    id: 'pancerzLegionuCieni', nazwa: 'Pancerz legionu cieni', ikona: '🛡',
    typ: 'pancerz', obrona: 7, klejnoty: 110,
    opis: 'Czarna łuska, która pochłania światło. I ciosy.'
  },
  helmPretorianina: {
    id: 'helmPretorianina', nazwa: 'Hełm pretorianina', ikona: '🪖',
    typ: 'helm', obrona: 5, klejnoty: 90,
    opis: 'Złoty grzebień widać z ostatniego rzędu trybun.'
  },
  tarczaAegis: {
    id: 'tarczaAegis', nazwa: 'Tarcza Aegis', ikona: '🛡',
    typ: 'tarcza', obrona: 6, klejnoty: 100,
    opis: 'Na licu wykuta głowa Gorgony. Przeciwnicy patrzą na nią, nie na Ciebie.'
  },
  nagolennikiWichru: {
    id: 'nagolennikiWichru', nazwa: 'Nagolenniki wichru', ikona: '🦿',
    typ: 'nagolenniki', obrona: 4, klejnoty: 85,
    opis: 'Lekkie jak pióro, twarde jak kamień.'
  }
};

// Towar premium wchodzi do tej samej puli, co reszta — dzieki temu
// gniazda, zakladanie i sprzedaz dzialaja bez zadnej zmiany w logice.
// Rozpoznajemy go po polu `klejnoty` zamiast `cena`.
Object.assign(PRZEDMIOTY, PRZEDMIOTY_PREMIUM);

// ---------- skad biore sie klejnoty ----------
//  Zeby gra nie byla pay-to-win, klejnoty sa takze nagroda za granie.
//  Kazda pozycja wpada TYLKO RAZ, przy pierwszym pokonaniu.
const KLEJNOTY_ZA = {
  pierwszeZwyciestwo: 10,   // pierwsza wygrana walka w ogole
  miniboss:           25,   // rangi 5 i 10
  czempion:           60,   // Verrus
  awansPoziomu:        5    // za kazdy nowy poziom
};

// ---------- paczki do kupienia za pieniadze ----------
//  Na razie to tylko cennik. Platnosci podepniemy przy wydaniu na
//  Androida (Google Play Billing przez Capacitora) — w przegladarce
//  nie ma czego podpinac i nie udajemy, ze jest.
const PACZKI_KLEJNOTOW = [
  { id: 'garsc',   nazwa: 'Garść klejnotów',   klejnoty: 100,  cena: '9,99 zł'  },
  { id: 'sakiewka',nazwa: 'Sakiewka',          klejnoty: 320,  cena: '24,99 zł', bonus: '+7%' },
  { id: 'skrzynia',nazwa: 'Skrzynia',          klejnoty: 900,  cena: '59,99 zł', bonus: '+20%' }
];
