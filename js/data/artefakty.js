// ============================================================
//  DANE: artefakty — trzeci, PASYWNY slot wyposażenia
//  Katalog regionu 2 z design/arena_artefakty.md (sekcja 4).
//
//  Zasada z dokumentu: artefakt daje POMYSŁ NA POSTAĆ, a nie
//  kolejne "więcej tych samych liczb". Zmiana jest darmowa.
//
//  Pole `mod` używa tych samych nazw co pasywy drzewka —
//  sumuje je js/engine/bonusy.js.
// ============================================================

const ARTEFAKTY = {

  // ---------- zwykłe (C) ----------

  amuletLwa: {
    id: 'amuletLwa', nazwa: 'Amulet Lwa', ikona: '🦁', rzadkosc: 'zwykly',
    opis: 'Kieł lwa oprawiony w brąz. Uczy szukać miękkich miejsc.',
    efekt: '+8% szansy na krytyka',
    dlaKogo: 'Zabójca',
    cena: 120,
    mod: { szansaKrytyka: 0.08 }
  },

  pierscienGniewu: {
    id: 'pierscienGniewu', nazwa: 'Pierścień Gniewu', ikona: '💢', rzadkosc: 'zwykly',
    opis: 'Im bliżej śmierci, tym jaśniej się żarzy.',
    efekt: 'Obrażenia rosną, im niżej masz HP (do +25%)',
    dlaKogo: 'Berserker',
    cena: 140,
    mod: { obrazeniaPrzyNiskimHp: 0.25 }
  },

  znakMarsa: {
    id: 'znakMarsa', nazwa: 'Znak Marsa', ikona: '⚔', rzadkosc: 'zwykly',
    opis: 'Blaszka z wizerunkiem boga wojny. Uczy oddawać cios.',
    efekt: '15% szansy na kontrę po otrzymaniu ciosu',
    dlaKogo: 'Wojownik',
    cena: 130,
    mod: { szansaKontry: 0.15 }
  },

  kielWilka: {
    id: 'kielWilka', nazwa: 'Kieł wilka', ikona: '🐺', rzadkosc: 'zwykly',
    opis: 'Wilk nie ostrzega. Po prostu gryzie.',
    efekt: 'Pierwszy cios w walce zadaje +60% obrażeń',
    dlaKogo: 'Zabójca, Berserker',
    cena: 110,
    mod: { bonusPierwszegoCiosu: 0.60 }
  },

  skorzanyTalizman: {
    id: 'skorzanyTalizman', nazwa: 'Skórzany talizman', ikona: '🧿', rzadkosc: 'zwykly',
    opis: 'Zwykły rzemyk z węzłem. Podobno nosił go ktoś, kto przeżył.',
    efekt: '−5% otrzymywanych obrażeń i +8 maksymalnego HP',
    dlaKogo: 'Każdy kruchy',
    cena: 100,
    mod: { redukcjaObrazenProcent: 0.05, maxHp: 8 }
  },

  // ---------- rzadkie (R) ----------

  talizmanFortuny: {
    id: 'talizmanFortuny', nazwa: 'Talizman Fortuny', ikona: '🍀', rzadkosc: 'rzadki',
    opis: 'Fortuna sprzyja odważnym. Raz.',
    efekt: 'Raz na walkę przeżywasz śmiertelny cios z 1 HP',
    dlaKogo: 'Każdy',
    zDropu: true,
    mod: { oszukanieSmierci: 1 }
  },

  amuletKrwiopijcy: {
    id: 'amuletKrwiopijcy', nazwa: 'Amulet krwiopijcy', ikona: '🩸', rzadkosc: 'rzadki',
    opis: 'Ciepły w dotyku, choć nikt go nie grzał.',
    efekt: 'Leczysz 8% zadanych obrażeń',
    dlaKogo: 'Berserker, agresywne buildy',
    zDropu: true,
    mod: { kradziezZycia: 0.08 }
  },

  kamienGospody: {
    id: 'kamienGospody', nazwa: 'Kamień gospody', ikona: '🏠', rzadkosc: 'rzadki',
    opis: 'Gładki otoczak z paleniska. Pachnie domem, którego nie masz.',
    efekt: 'Rany goją się o 40% szybciej poza walką',
    dlaKogo: 'Każdy — ulga w modelu na wyczerpanie',
    zDropu: true,
    mod: { przyspieszenieRegeneracji: 0.40 }
  }
};

// Ile Czarodziej płaci za duplikat — ułamek ceny (rzadkie mają cenę umowną)
const CENY_SKUPU = { zwykly: 0.4, rzadki: 0.5 };
const CENA_UMOWNA_RZADKIEGO = 220;
