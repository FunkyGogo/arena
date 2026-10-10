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
    opisKrotki: 'Obrona obniżona',
    opis: 'Pancerz pęknięty — ciosy przechodzą przez niego łatwiej, niż powinny.'
  },

  krwawienie: {
    id: 'krwawienie',
    nazwa: 'Krwawienie',
    ikona: '🩸',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,           // rani co turę
    omijaPancerz: false,             // fizyczny DoT — pancerz częściowo chroni
    opisKrotki: 'Krwawi',
    opis: 'Rana nie chce się zamknąć. Ubywa HP na początku każdej tury.'
  },

  zatrucie: {
    id: 'zatrucie',
    nazwa: 'Zatrucie',
    ikona: '🧪',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,
    omijaPancerz: true,              // jad omija pancerz — odpowiedź Zabójcy na opancerzonych
    stackowalny: true,               // kolejne użycia dokładają stacki
    opisKrotki: 'Zatruty',
    opis: 'Jad w krwiobiegu. Rani co turę i omija pancerz.'
  },

  oslabienieAtaku: {
    id: 'oslabienieAtaku',
    nazwa: 'Klątwa',
    ikona: '🕯',
    rodzaj: 'oslabienie',
    modyfikatorObrazen: -1,          // -1 * moc / 10 = o tyle procent slabsze ciosy
    opisKrotki: 'Ciosy słabsze',
    opis: 'Klątwa ciąży na ramionach — Twoje ciosy zadają mniej obrażeń.'
  },

  ogluszenie: {
    id: 'ogluszenie',
    nazwa: 'Ogłuszenie',
    ikona: '💫',
    rodzaj: 'oslabienie',
    pomijaTure: true,
    opisKrotki: 'Tracisz turę',
    opis: 'W głowie dzwoni. Tracisz najbliższą turę.'
  },

  spowolnienie: {
    id: 'spowolnienie',
    nazwa: 'Spowolnienie',
    ikona: '🕸',
    rodzaj: 'oslabienie',
    modyfikatorZrecznosci: -1,
    opisKrotki: 'Zręczność w dół',
    opis: 'Ruchy jak w wodzie — trudniej unikać i tracisz inicjatywę.'
  },

  oslabienieCelnosci: {
    id: 'oslabienieCelnosci',
    nazwa: 'Ogłuszający wrzask',
    ikona: '📢',
    rodzaj: 'oslabienie',
    modyfikatorCelnosci: -0.05,      // -0.05 za punkt mocy
    opisKrotki: 'Celność w dół',
    opis: 'W uszach piszczy. Częściej chybiasz.'
  },

  wychlodzenie: {
    id: 'wychlodzenie',
    nazwa: 'Wychłodzenie',
    ikona: '❄',
    rodzaj: 'oslabienie',
    modyfikatorZrecznosci: -1,
    spowalniaDobieganie: true,       // mróz wydłuża drogę do Ciebie
    zywiol: 'lod',
    opisKrotki: 'Zmarznięty',
    opis: 'Mróz zbiera mięśnie. Ruszasz się wolniej.'
  },

  usidlenie: {
    id: 'usidlenie',
    nazwa: 'Sidła',
    ikona: '🪤',
    rodzaj: 'oslabienie',
    blokujeDobieganie: true,         // nie skróci dystansu, póki trwa
    opisKrotki: 'W sidłach',
    opis: 'Nogi w pętli. Nie odskoczysz i trudniej się bronić.'
  },

  wziecieNaCel: {
    id: 'wziecieNaCel',
    nazwa: 'Wzięty na cel',
    ikona: '🎯',
    rodzaj: 'wzmocnienie',
    gwarantowanyKrytyk: true,
    opisKrotki: 'Na muszce',
    opis: 'Cel wzięty na muszkę — następny strzał trafi pewniej i mocniej.'
  },

  porazenie: {
    id: 'porazenie', nazwa: 'Porażenie', ikona: '⚡',
    rodzaj: 'oslabienie',
    modyfikatorCelnosci: -0.04,
    przewodziBlyskawice: true,
    opisKrotki: 'Porażony',
    opis: 'Prąd skacze po mięśniach. Co jakiś czas tracisz kontrolę.'
  },

  // ---- wzmocnienia gracza ----

  regeneracja: {
    id: 'regeneracja', nazwa: 'Regeneracja', ikona: '💚',
    rodzaj: 'wzmocnienie',
    leczenieNaTure: true,
    opisKrotki: 'Goi się',
    opis: 'Rany zasklepiają się same. Odzyskujesz HP na początku każdej tury.'
  },

  bariera: {
    id: 'bariera', nazwa: 'Lodowa zbroja', ikona: '🧊',
    rodzaj: 'wzmocnienie',
    pochlaniaObrazenia: true,
    opisKrotki: 'Bariera',
    opis: 'Tafla lodu wokół ciała pochłania część każdego ciosu.'
  },

  ciernie: {
    id: 'ciernie', nazwa: 'Ciernie', ikona: '🌵',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    odbicieObrazen: true,
    opisKrotki: 'Kolce',
    opis: 'Kto uderzy, sam się pokaleczy.'
  },

  kanalizowanie: {
    id: 'kanalizowanie', nazwa: 'Kanalizowanie', ikona: '🧘',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    opisKrotki: 'Skupiony',
    opis: 'Zbierasz moc. Następne zaklęcie będzie silniejsze.'
  },

  formaNiedzwiedzia: {
    id: 'formaNiedzwiedzia', nazwa: 'Postać niedźwiedzia', ikona: '🐻',
    rodzaj: 'wzmocnienie',
    forma: true,
    modyfikatorObrony: -1,           // moc jest ujemna -> podnosi Obrone
    bonusObrazen: true,
    opisKrotki: 'Niedźwiedź',
    opis: 'Postać niedźwiedzia: więcej HP i siły, mniej zręczności.'
  },

  formaWilka: {
    id: 'formaWilka', nazwa: 'Postać wilka', ikona: '🐺',
    rodzaj: 'wzmocnienie',
    forma: true,
    modyfikatorZrecznosci: 1,
    bonusKrytyka: true,
    bonusObrazen: true,
    opisKrotki: 'Wilk',
    opis: 'Postać wilka: szybszy i zwinniejszy, ale kruchszy.'
  },

  podpalenie: {
    id: 'podpalenie',
    nazwa: 'Podpalenie',
    ikona: '🔥',
    rodzaj: 'oslabienie',
    obrazeniaNaTure: true,
    omijaPancerz: true,
    zywiol: 'ogien',
    opisKrotki: 'Płonie',
    opis: 'Płoniesz. Ogień rani co turę i omija pancerz.'
  },

  odslona: {
    id: 'odslona',
    nazwa: 'Odsłona',
    ikona: '🎲',
    rodzaj: 'oslabienie',
    modyfikatorObrony: 1,            // moc jest ujemna, więc to obniża Obronę
    opisKrotki: 'Odsłonięty',
    opis: 'Odsłona po zamachu — następny cios w Ciebie trafi mocniej.'
  },

  // ---- wzmocnienia (dobre dla tego, kto je ma) ----

  mur: {
    id: 'mur',
    nazwa: 'Mur',
    ikona: '🧱',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,           // siłę bierze z pola moc (ułamek)
    opisKrotki: 'Za tarczą',
    opis: 'Zza tarczy zbierasz dużo mniej obrażeń.'
  },

  niezlomnosc: {
    id: 'niezlomnosc',
    nazwa: 'Niezłomna postawa',
    ikona: '🗿',
    rodzaj: 'wzmocnienie',
    redukcjaObrazen: true,
    odpornoscNaOgluszenie: true,
    opisKrotki: 'Niezłomny',
    opis: 'Stoisz jak głaz: duża redukcja obrażeń i odporność na ogłuszenie.'
  },


  ukrycie: {
    id: 'ukrycie',
    nazwa: 'Ukrycie',
    ikona: '🌑',
    rodzaj: 'wzmocnienie',
    gwarantowanyKrytyk: true,        // następny atak na pewno krytyczny
    unikNastepnego: true,            // następny cios wroga chybia
    opisKrotki: 'W cieniu',
    opis: 'Wtopiony w cień. Następny cios będzie pewnym krytykiem.'
  },

  riposta: {
    id: 'riposta',
    nazwa: 'Riposta',
    ikona: '↩',
    rodzaj: 'wzmocnienie',
    unikNastepnego: true,
    kontraPoUniku: true,             // po uniku od razu kontrujesz
    opisKrotki: 'Postawa kontry',
    opis: 'Czekasz na ruch przeciwnika. Gdy uderzy, oddasz mu od razu.'
  }
};
