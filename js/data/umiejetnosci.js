// ============================================================
//  DANE: umiejętności (co robią przyciski na pasku)
//  Tu są nazwy, ikony i opisy. Wszystkie LICZBY siedzą
//  w js/config.js (sekcja "akcje") — tam je stroisz.
// ============================================================

const A = CONFIG.akcje;                       // skrót, żeby opisy się mieściły
const proc = x => Math.round(x * 100) + '%';

const UMIEJETNOSCI = {

  // ============ WOJOWNIK (zasób: Wigor) ============

  cios: {
    id: 'cios', nazwa: 'Cios', ikona: '⚔',
    typ: 'atak', klasa: 'wojownik', galaz: 'podstawa',
    opis: `Atak podstawowy. Nic nie kosztuje i dokłada +${A.cios.zwrotZasobu} Wigoru.`
  },

  garda: {
    id: 'garda', nazwa: 'Garda', ikona: '🛡',
    typ: 'garda', klasa: 'wojownik', galaz: 'Tarcza',
    opis: `Generator. Nie zadaje obrażeń: daje +${A.garda.zwrotZasobu} Wigoru i zmniejsza obrażenia o ${proc(A.garda.redukcjaObrazen)} do Twojej następnej tury.`
  },

  poteznyCios: {
    id: 'poteznyCios', nazwa: 'Potężny cios', ikona: '🪓',
    typ: 'atak', klasa: 'wojownik', galaz: 'Oręż',
    opis: `Zamaszyste uderzenie za ×${A.poteznyCios.mnoznikObrazen} obrażeń. Twój główny sposób na wydanie Wigoru.`
  },

  roztrzaskanie: {
    id: 'roztrzaskanie', nazwa: 'Roztrzaskanie', ikona: '💥',
    typ: 'atak', klasa: 'wojownik', galaz: 'Oręż',
    nakladaStatus: 'roztrzaskanie',
    opis: `Cios łamiący pancerz: normalne obrażenia i −${A.roztrzaskanie.oslabienieObrony} do Obrony wroga na ${A.roztrzaskanie.turyDzialania} jego tury. Klucz do opancerzonych przeciwników.`
  },

  drugiOddech: {
    id: 'drugiOddech', nazwa: 'Drugi oddech', ikona: '💨',
    typ: 'leczenie', klasa: 'wojownik', galaz: 'Hart',
    opis: `Łapiesz oddech i leczysz ${proc(A.drugiOddech.leczenieProcentMaxHp)} maksymalnego HP. ${A.drugiOddech.uzyciNaWalke} użycia na walkę.`
  },

  // ============ BERSERKER (zasób: Furia) ============

  ciecie: {
    id: 'ciecie', nazwa: 'Cięcie', ikona: '🪚',
    typ: 'atak', klasa: 'berserker', galaz: 'podstawa',
    opis: 'Atak podstawowy. Furii nie daje wprost — rośnie od zadanych i oberwanych obrażeń.'
  },

  krwawaOfiara: {
    id: 'krwawaOfiara', nazwa: 'Krwawa ofiara', ikona: '🗡',
    typ: 'ofiara', klasa: 'berserker', galaz: 'Krew',
    opis: `Generator. Poświęcasz ${proc(A.krwawaOfiara.kosztProcentHp)} maksymalnego HP i natychmiast dostajesz +${A.krwawaOfiara.zwrotZasobu} Furii. Płacisz życiem za moc.`
  },

  szal: {
    id: 'szal', nazwa: 'Szał', ikona: '🔥',
    typ: 'atak', klasa: 'berserker', galaz: 'Furia',
    opis: `Lawinowe uderzenie za ×${A.szal.mnoznikObrazen} obrażeń. Twój najcięższy młot.`
  },

  krwawyWir: {
    id: 'krwawyWir', nazwa: 'Krwawy wir', ikona: '🌀',
    typ: 'atak', klasa: 'berserker', galaz: 'Furia',
    nakladaStatus: 'krwawienie',
    opis: `Rozcięcie, które nie chce się zabliźnić: obrażenia i Krwawienie po ${A.krwawyWir.obrazeniaKrwawienia} HP na turę przez ${A.krwawyWir.turyDzialania} tury.`
  },

  egzekucja: {
    id: 'egzekucja', nazwa: 'Egzekucja', ikona: '☠',
    typ: 'atak', klasa: 'berserker', galaz: 'Krew',
    opis: `Wobec zdrowego wroga tylko ×${A.egzekucja.mnoznikObrazen}. Ale poniżej ${proc(A.egzekucja.progHpCelu)} jego HP — ×${A.egzekucja.mnoznikEgzekucji}. Dobijaj, nie otwieraj.`
  },

  // ============ ZABÓJCA (zasób: Kombo) ============

  pchniecie: {
    id: 'pchniecie', nazwa: 'Pchnięcie', ikona: '🗡',
    typ: 'atak', klasa: 'zabojca', galaz: 'podstawa',
    opis: 'Atak podstawowy. Każde trafienie to +1 punkt Kombo. Pudło albo oberwanie zeruje Kombo.'
  },

  zejscieWCien: {
    id: 'zejscieWCien', nazwa: 'Zejście w cień', ikona: '🌑',
    typ: 'ukrycie', klasa: 'zabojca', galaz: 'Cień',
    nakladaStatus: 'ukrycie',
    opis: `Generator. +${A.zejscieWCien.zwrotZasobu} Kombo, następny cios wroga chybia, a Twój następny atak jest na pewno krytyczny.`
  },

  zatruteOstrze: {
    id: 'zatruteOstrze', nazwa: 'Zatrute ostrze', ikona: '🧪',
    typ: 'atak', klasa: 'zabojca', galaz: 'Trucizny',
    nakladaStatus: 'zatrucie',
    opis: `Słabe cięcie (×${A.zatruteOstrze.mnoznikObrazen}), ale nakłada Zatrucie: ${A.zatruteOstrze.obrazeniaZatrucia} HP na turę za każdy stack, do ${A.zatruteOstrze.maksStackow} stacków. Jad OMIJA pancerz.`
  },

  skrytobojczyCios: {
    id: 'skrytobojczyCios', nazwa: 'Skrytobójczy cios', ikona: '✹',
    typ: 'finiszer', klasa: 'zabojca', galaz: 'Ostrza',
    opis: `Finiszer: zużywa CAŁE Kombo. Obrażenia rosną z każdym punktem (×${A.skrytobojczyCios.mnoznikZaPunktKombo} za punkt) i ma +${proc(A.skrytobojczyCios.bonusSzansyKrytyka)} szansy na krytyka.`
  },

  // ============ AKCJE Z DALSZYCH WĘZŁÓW DRZEWKA ============

  // Wojownik
  mur: {
    id: 'mur', nazwa: 'Mur', ikona: '🧱',
    typ: 'postawa', klasa: 'wojownik', galaz: 'Tarcza', nakladaStatus: 'mur',
    opis: `Zapierasz się tarczą: przez ${A.mur.turyDzialania} tury obrywasz o ${proc(A.mur.redukcjaObrazen)} mniej.`
  },
  niezlomnaPostawa: {
    id: 'niezlomnaPostawa', nazwa: 'Niezłomna postawa', ikona: '🗿',
    typ: 'postawa', klasa: 'wojownik', galaz: 'Hart', nakladaStatus: 'niezlomnosc',
    opis: `Przez ${A.niezlomnaPostawa.turyDzialania} tury obrywasz o ${proc(A.niezlomnaPostawa.redukcjaObrazen)} mniej i nie da się Cię ogłuszyć.`
  },
  rozlupujacyCios: {
    id: 'rozlupujacyCios', nazwa: 'Rozłupujący cios', ikona: '⚡',
    typ: 'atak', klasa: 'wojownik', galaz: 'Oręż',
    opis: `Zwieńczenie Oręża: ×${A.rozlupujacyCios.mnoznikObrazen} obrażeń, a wobec opancerzonych jeszcze mocniej i zwraca Wigor.`
  },

  // Berserker
  szarzaGracza: {
    id: 'szarzaGracza', nazwa: 'Szarża', ikona: '🐂',
    typ: 'atak', klasa: 'berserker', galaz: 'Nieustraszoność', nakladaStatus: 'ogluszenie',
    opis: `Uderzenie barkiem za ×${A.szarzaGracza.mnoznikObrazen} obrażeń, które ogłusza wroga.`
  },
  nieostroznyCios: {
    id: 'nieostroznyCios', nazwa: 'Nieostrożny cios', ikona: '🎲',
    typ: 'atak', klasa: 'berserker', galaz: 'Nieustraszoność', nakladaStatus: 'odslona',
    opis: `Zamach na oślep: ×${A.nieostroznyCios.mnoznikObrazen} obrażeń, ale do następnej tury masz obniżoną Obronę.`
  },

  // Zabójca
  seriaPchniec: {
    id: 'seriaPchniec', nazwa: 'Seria pchnięć', ikona: '🔪',
    typ: 'seria', klasa: 'zabojca', galaz: 'Ostrza',
    opis: `${A.seriaPchniec.liczbaCiosow} szybkie trafienia po ×${A.seriaPchniec.mnoznikObrazen} — najszybszy sposób na zbudowanie Kombo.`
  },
  rozprucie: {
    id: 'rozprucie', nazwa: 'Rozprucie', ikona: '💢',
    typ: 'detonacja', klasa: 'zabojca', galaz: 'Trucizny',
    opis: `Finiszer: detonuje całe Zatrucie wroga, zadając od razu ×${A.rozprucie.mnoznikDetonacji} jego obrażeń za każdą pozostałą turę.`
  },

  // ============ ELIKSIR (wspólny dla wszystkich klas) ============

  eliksir: {
    id: 'eliksir', nazwa: 'Eliksir', ikona: '🧪',
    typ: 'eliksir', klasa: 'wspolna', galaz: 'podstawa',
    opis: `Leczy ${proc(CONFIG.ekonomia.eliksir.leczenieProcentMaxHp)} maksymalnego HP. Kupujesz go w sklepie — masz tyle, ile nosisz.`
  },

  // ============ AKCJE BESTII ============

  ugryzienie:      { id: 'ugryzienie',      nazwa: 'Ugryzienie',      ikona: '🦷', typ: 'atak', klasa: 'wrog', nakladaStatus: 'krwawienie', opis: 'Kły szarpią ranę.' },
  uderzenieGolema: { id: 'uderzenieGolema', nazwa: 'Kamienna pięść',  ikona: '🗿', typ: 'atak', klasa: 'wrog', nakladaStatus: 'ogluszenie', opis: 'Wolne, ale ogłuszające.' },
  zioniecie:       { id: 'zioniecie',       nazwa: 'Zionięcie ogniem',ikona: '🔥', typ: 'atak', klasa: 'wrog', zywiol: 'ogien', nakladaStatus: 'podpalenie', opis: 'Podmuch żaru — omija pancerz i podpala.' },
  wrzask:          { id: 'wrzask',          nazwa: 'Wrzask',          ikona: '📢', typ: 'klatwa', klasa: 'wrog', nakladaStatus: 'oslabienieCelnosci', opis: 'Przeraźliwy krzyk psuje celność.' },
  wielePaszczy:    { id: 'wielePaszczy',    nazwa: 'Wiele paszczy',   ikona: '🐉', typ: 'seria', klasa: 'wrog', opis: 'Kilka głów kąsa naraz.' },

  // ============ AKCJE WROGÓW (gracz ich nie ma na pasku) ============

  szarza:        { id: 'szarza',        nazwa: 'Szarża',         ikona: '🐂', typ: 'atak',     klasa: 'wrog', opis: 'Rozpędzone uderzenie barkiem.' },
  szykowanieSzarzy:{ id: 'szykowanieSzarzy', nazwa: 'Szykuje szarżę', ikona: '⚠', typ: 'telegraf', klasa: 'wrog', opis: 'Grzebie nogą w piachu — zaraz uderzy.' },
  siec:          { id: 'siec',          nazwa: 'Sieć',           ikona: '🕸', typ: 'atak',     klasa: 'wrog', opis: 'Zarzuca sieć.' },
  jadowityCios:  { id: 'jadowityCios',  nazwa: 'Jadowity cios',  ikona: '🧪', typ: 'atak',     klasa: 'wrog', nakladaStatus: 'zatrucie', opis: 'Cięcie zatrutym ostrzem.' },
  klatwa:        { id: 'klatwa',        nazwa: 'Klątwa Dis',     ikona: '🕯', typ: 'klatwa',   klasa: 'wrog', nakladaStatus: 'oslabienieAtaku', opis: 'Osłabia ciosy przeciwnika.' },
  opatrunek:     { id: 'opatrunek',     nazwa: 'Opatrunek',      ikona: '🩹', typ: 'leczenie', klasa: 'wrog', opis: 'Zaciska rany.' },

  riposta: {
    id: 'riposta', nazwa: 'Riposta', ikona: '↩',
    typ: 'postawa', klasa: 'zabojca', galaz: 'Cień',
    nakladaStatus: 'riposta',
    opis: `Postawa kontry za ${A.riposta.koszt} Kombo: następny cios wroga chybia, a Ty od razu kontrujesz krytycznym ciosem.`
  }
};
