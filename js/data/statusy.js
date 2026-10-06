// ============================================================
//  DANE: statusy (efekty działające przez kilka tur)
//  Liczby (siła, czas trwania) przychodzą z umiejętności,
//  która nakłada status — tutaj jest tylko opis, jak działa.
// ============================================================

const STATUSY = {

  // ---- osłabienia (złe dla tego, kto je ma) ----

  roztrzaskanie: {
    id: 'roztrzaskanie',
    nazwa: 'Roztrzaskany pancerz',
    ikona: '💢',
    rodzaj: 'oslabienie',
    modyfikatorObrony: -1,           // -1 * moc = o tyle spada Obrona
    opisKrotki: 'Obrona obniżona'
  },

  krwawienie: {
    id: 'krwawienie',
    nazwa: 'Krwawienie',
    ikona: '🩸',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,           // rani co turę
    omijaPancerz: false,             // fizyczny DoT — pancerz częściowo chroni
    opisKrotki: 'Krwawi'
  },

  zatrucie: {
    id: 'zatrucie',
    nazwa: 'Zatrucie',
    ikona: '🧪',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,
    omijaPancerz: true,              // jad omija pancerz — odpowiedź Zabójcy na opancerzonych
    stackowalny: true,               // kolejne użycia dokładają stacki
    opisKrotki: 'Zatruty'
  },

  oslabienieAtaku: {
    id: 'oslabienieAtaku',
    nazwa: 'Klątwa',
    ikona: '🕯',
    rodzaj: 'oslabienie',
    modyfikatorObrazen: -1,          // -1 * moc / 10 = o tyle procent slabsze ciosy
    opisKrotki: 'Ciosy słabsze'
  },

  ogluszenie: {
    id: 'ogluszenie',
    nazwa: 'Ogłuszenie',
    ikona: '💫',
    rodzaj: 'oslabienie',
    pomijaTure: true,
    opisKrotki: 'Tracisz turę'
  },

  spowolnienie: {
    id: 'spowolnienie',
    nazwa: 'Spowolnienie',
    ikona: '🕸',
    rodzaj: 'oslabienie',
    modyfikatorZrecznosci: -1,
    opisKrotki: 'Zręczność w dół'
  },

  oslabienieCelnosci: {
    id: 'oslabienieCelnosci',
    nazwa: 'Ogłuszający wrzask',
    ikona: '📢',
    rodzaj: 'oslabienie',
    modyfikatorCelnosci: -0.05,      // -0.05 za punkt mocy
    opisKrotki: 'Celność w dół'
  },

  wychlodzenie: {
    id: 'wychlodzenie',
    nazwa: 'Wychłodzenie',
    ikona: '❄',
    rodzaj: 'oslabienie',
    modyfikatorZrecznosci: -1,
    spowalniaDobieganie: true,       // mróz wydłuża drogę do Ciebie
    zywiol: 'lod',
    opisKrotki: 'Zmarznięty'
  },

  usidlenie: {
    id: 'usidlenie',
    nazwa: 'Sidła',
    ikona: '🪤',
    rodzaj: 'oslabienie',
    blokujeDobieganie: true,         // nie skróci dystansu, póki trwa
    opisKrotki: 'W sidłach'
  },

  wziecieNaCel: {
    id: 'wziecieNaCel',
    nazwa: 'Wzięty na cel',
    ikona: '🎯',
    rodzaj: 'wzmocnienie',
    gwarantowanyKrytyk: true,
    opisKrotki: 'Na muszce'
  },

  porazenie: {
    id: 'porazenie', nazwa: 'Porażenie', ikona: '⚡',
    rodzaj: 'oslabienie',
    modyfikatorCelnosci: -0.04,
    przewodziBlyskawice: true,
    opisKrotki: 'Porażony'
  },

  // ---- wzmocnienia gracza ----

  regeneracja: {
    id: 'regeneracja', nazwa: 'Regeneracja', ikona: '💚',
    rodzaj: 'wzmocnienie',
    leczenieNaTure: true,
    opisKrotki: 'Goi się'
  },

  bariera: {
    id: 'bariera', nazwa: 'Lodowa zbroja', ikona: '🧊',
    rodzaj: 'wzmocnienie',
    pochlaniaObrazenia: true,
    opisKrotki: 'Bariera'
  },

  ciernie: {
    id: 'ciernie', nazwa: 'Ciernie', ikona: '🌵',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    odbicieObrazen: true,
    opisKrotki: 'Kolce'
  },

  kanalizowanie: {
    id: 'kanalizowanie', nazwa: 'Kanalizowanie', ikona: '🧘',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    opisKrotki: 'Skupiony'
  },

  formaNiedzwiedzia: {
    id: 'formaNiedzwiedzia', nazwa: 'Postać niedźwiedzia', ikona: '🐻',
    rodzaj: 'wzmocnienie',
    forma: true,
    modyfikatorObrony: -1,           // moc jest ujemna -> podnosi Obrone
    bonusObrazen: true,
    opisKrotki: 'Niedźwiedź'
  },

  formaWilka: {
    id: 'formaWilka', nazwa: 'Postać wilka', ikona: '🐺',
    rodzaj: 'wzmocnienie',
    forma: true,
    modyfikatorZrecznosci: 1,
    bonusKrytyka: true,
    bonusObrazen: true,
    opisKrotki: 'Wilk'
  },

  podpalenie: {
    id: 'podpalenie',
    nazwa: 'Podpalenie',
    ikona: '🔥',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,
    omijaPancerz: true,
    zywiol: 'ogien',
    opisKrotki: 'Płonie'
  },

  odslona: {
    id: 'odslona',
    nazwa: 'Odsłona',
    ikona: '🎲',
    rodzaj: 'oslabienie',
    modyfikatorObrony: 1,            // moc jest ujemna, więc to obniża Obronę
    opisKrotki: 'Odsłonięty'
  },

  // ---- wzmocnienia (dobre dla tego, kto je ma) ----

  mur: {
    id: 'mur',
    nazwa: 'Mur',
    ikona: '🧱',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,           // siłę bierze z pola moc (ułamek)
    opisKrotki: 'Za tarczą'
  },

  niezlomnosc: {
    id: 'niezlomnosc',
    nazwa: 'Niezłomna postawa',
    ikona: '🗿',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    odpornoscNaOgluszenie: true,
    opisKrotki: 'Niezłomny'
  },


  ukrycie: {
    id: 'ukrycie',
    nazwa: 'Ukrycie',
    ikona: '🌑',
    rodzaj: 'wzmocnienie',
    gwarantowanyKrytyk: true,        // następny atak na pewno krytyczny
    unikNastepnego: true,            // następny cios wroga chybia
    opisKrotki: 'W cieniu'
  },

  riposta: {
    id: 'riposta',
    nazwa: 'Riposta',
    ikona: '↩',
    rodzaj: 'wzmocnienie',
    unikNastepnego: true,
    kontraPoUniku: true,             // po uniku od razu kontrujesz
    opisKrotki: 'Postawa kontry'
  }
};
