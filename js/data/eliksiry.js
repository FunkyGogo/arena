// ============================================================
//  DANE: eliksiry — jednorazowe flakony z plecaka
//
//  Do tej pory był jeden rodzaj (leczący). Teraz jest ich kilka,
//  a w walce wybierasz, który wypić albo rzucić. Sztuki liczone
//  osobno dla każdego rodzaju: Bohater.stan.eliksiry = { maly: 2, ... }
//
//  `dzialanie` mówi silnikowi, co zrobić:
//    leczenie — odzyskujesz HP
//    status   — nakłada status na WROGA (ogień, jad)
//    wzmocnienie — nakłada status na CIEBIE
// ============================================================

const ELIKSIRY = {

  maly: {
    id: 'maly', nazwa: 'Mały eliksir', ikona: '🧪', cena: 40, maks: 5,
    dzialanie: 'leczenie',
    procentMaxHp: 0.30,
    opis: 'Leczy 30% maksymalnego HP. Działa też w trakcie walki.'
  },

  ognisty: {
    id: 'ognisty', nazwa: 'Ognisty flakon', ikona: '🔥', cena: 70, maks: 3,
    dzialanie: 'status',
    status: 'podpalenie', moc: 4, tury: 3,
    opis: 'Rzucasz nim w przeciwnika. Płonie 3 tury, a ogień omija pancerz.'
  },

  jad: {
    id: 'jad', nazwa: 'Fiolka jadu', ikona: '🧫', cena: 65, maks: 3,
    dzialanie: 'status',
    status: 'zatrucie', moc: 3, tury: 4,
    opis: 'Jad w oczy. Truje 4 tury i omija pancerz.'
  },

  silaByka: {
    id: 'silaByka', nazwa: 'Wywar siły', ikona: '💪', cena: 90, maks: 2,
    dzialanie: 'wzmocnienie',
    status: 'regeneracja', moc: 5, tury: 3,
    opis: 'Gorzki wywar z ziół. Przez 3 tury rany goją się same.'
  }
};

// Kolejność na pasku wyboru — od najczęściej używanego.
const ELIKSIRY_KOLEJNOSC = ['maly', 'ognisty', 'jad', 'silaByka'];
