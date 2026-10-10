// ============================================================
//  GRAFIKI POSTACI
//  Same ścieżki do plików — żadnej logiki. Klasa bez wpisu gra
//  po staremu, na ikonie emoji.
//
//  Grafiki robi narzedzia/grafika.js, zasady w design/arena_biblia_stylu.md.
//  Stany bojowe są w widoku 3/4, postać zwrócona w prawo (sekcja 6 biblii).
// ============================================================

// Ile miejsca w pionie zajmuje postać w danej pozie względem swobodnego stania.
// Grafiki są przycinane do samej sylwetki, więc bez tego wypad w ataku
// (postać przykucnięta) rozciągnąłby się do wzrostu stojącego gladiatora.
// Liczby są do strojenia okiem — od nich zależy, czy postać „nie skacze".
const SKALE_POZ = {
  postawa:   1.00,
  atak:      0.86,
  garda:     0.94,
  trafienie: 0.97,
  smierc:    0.62
};

// Tła areny. Duże oryginały zostają w repo, gra ładuje lekkie wersje "_male"
// (zrobione skryptem narzedzia/zmniejsz.ps1).
const TLA_WALKI = {
  domyslne: 'assets/tla/arena_kapua_B_male.jpg',   // region 2, jasne południe
  czempion: 'assets/tla/arena_kapua_A_male.jpg',   // zmierzch i pochodnie
  kamieniolom: 'assets/tla/kamieniolom_male.jpg'   // prolog — kamieniołom
};

// To samo dla wrogów — ich pozy są mniej skrajne niż u bohatera.
const SKALE_POZ_WROGA = {
  postawa:   1.00,
  atak:      0.88,
  trafienie: 0.95,
  szarza:    0.80,  // kucnięcie przed szarżą — postać niżej przy ziemi
  garda:     0.92,  // skulenie za tarczą
  szal:      1.00,  // szał — postać wyprostowana
  klatwa:    1.02,  // rzucanie klątwy — postać wyprostowana, ręce w górze
  faza2:     1.05   // czempion bez tarczy, wyprostowany w furii
};

// Gdzie na mapie okolicy (assets/tla/mapa_kapua.jpg) stoi ktory budynek.
// Liczby to procent szerokosci i wysokosci mapy — latwo przesunac, gdy cos
// wypada na drzewie albo na drodze.
const MAPA_PUNKTY = {
  sklep:      { x: 43, y: 30 },
  gospoda:    { x: 79, y: 26 },
  arena:      { x: 73, y: 43 },
  kuznia:     { x: 82, y: 59 },
  trening:    { x: 33, y: 47 },
  zlecenia:   { x: 40, y: 11 },
  czarodziej: { x: 30, y: 70 },
  jama:       { x: 78, y: 82 }
};

// Ikony rysowane: grupa -> lista identyfikatorow, ktore maja juz plik
// w assets/<grupa>/<id>.jpg. Czego tu nie ma, zostaje na emoji.
const IKONY = {
  przedmioty: [
    'berloPierwszegoOgnia',
    'brazowyHelm',
    'ciemneLachy',
    'gladiusLudusu',
    'gromowyMlot',
    'helmPretorianina',
    'jadowiteOstrze',
    'kosturZKapui',
    'kosturZSercaChimery',
    'kurtaLowcy',
    'lekkaTarcza',
    'loricaZByczejSkory',
    'lukMysliwski',
    'lukZHydry',
    'lukZKapui',
    'lukZlotegoSwitu',
    'mlotBurzy',
    'nagolennikiWichru',
    'napiersnikZCwiekami',
    'obosiecznyTopor',
    'ognistyGladius',
    'okutaTarcza',
    'ostrzeZGwiezdnejStali',
    'pancerzLegionuCieni',
    'paraSztyletow',
    'prostyKostur',
    'prostyLuk',
    'sekatyKij',
    'skoraNiedzwiedzia',
    'skory',
    'skorzanaUprzaz',
    'skorzaneNagolenniki',
    'skorzanyHelm',
    'szataAdepta',
    'szeptSkrytobojcy',
    'tarczaAegis',
    'tunika',
    'wloczniaZKapui',
    'zardzewialyGladius',
    'zelazneNagolenniki',
    'zelaznyGladius'
  ],
  artefakty: [
    'amuletKrwiopijcy',
    'amuletLwa',
    'kamienGospody',
    'kielWilka',
    'pierscienGniewu',
    'skorzanyTalizman',
    'talizmanFortuny',
    'znakMarsa'
  ],
  budynki: [
    'arena',
    'czarodziej',
    'gospoda',
    'jama',
    'kuznia',
    'sklep',
    'trening',
    'zlecenia'
  ],
  umiejetnosci: [
    'absolutneZero',
    'alfa',
    'celnyStrzal',
    'ciecie',
    'ciernie',
    'cios',
    'ciosKonarem',
    'deszczZywiolow',
    'drugiOddech',
    'egzekucja',
    'eliksir',
    'garda',
    'gniewJowisza',
    'gradStrzal',
    'grom',
    'iskra',
    'kataklizm',
    'krwawaOfiara',
    'krwawyWir',
    'kulaOgnia',
    'lancuchBlyskawic',
    'lodowaStrzala',
    'lodowaZbroja',
    'medytacja',
    'mur',
    'nieostroznyCios',
    'niezlomnaPostawa',
    'odlamkiLodu',
    'odskok',
    'ognistaStrzala',
    'pchniecie',
    'postacNiedzwiedzia',
    'postacWilka',
    'poteznyCios',
    'pozoga',
    'przebijajacyGrot',
    'przyzwijBestie',
    'riposta',
    'rozlupujacyCios',
    'rozprucie',
    'roztrzaskanie',
    'seriaPchniec',
    'sidla',
    'skrytobojczyCios',
    'strzal',
    'szal',
    'szarzaGracza',
    'uzdrowienie',
    'wezNaCel',
    'wiezZNatura',
    'zabojczyStrzal',
    'zaraza',
    'zatruteOstrze',
    'zatrutyGrot',
    'zejscieWCien',
    'zewWatahy'
  ],
  materialy: [
    'brazowyZlom',
    'fiolkaJadu',
    'jadPajaka',
    'kielWilka',
    'klyDzika',
    'krewHydry',
    'ognistaEsencja',
    'pioroHarpii',
    'przepustkaDoGalii',
    'rdzenGolema',
    'rudaZelaza',
    'serceChimery',
    'skora',
    'skoraByka',
    'stalLudusu',
    'zelaznyZlom'
  ]
};

const GRAFIKI_POSTACI = {

  wojownik: {
    portret:   'assets/postacie/wojownik_wzor.jpg',      // frontalny — pasek na dole i menu
    postawa:   'assets/postacie/wojownik_wzor_boj.jpg',  // domyślny stan na arenie
    atak:      'assets/postacie/wojownik_atak.jpg',
    garda:     'assets/postacie/wojownik_garda.jpg',
    trafienie: 'assets/postacie/wojownik_trafienie.jpg',
    smierc:    'assets/postacie/wojownik_smierc.jpg'
  },

  berserker: {
    portret:   'assets/postacie/klasy/berserker_portret.jpg',    // frontalny — menu
    postawa:   'assets/postacie/klasy/berserker_postawa.jpg',
    atak:      'assets/postacie/klasy/berserker_atak.jpg',
    garda:     'assets/postacie/klasy/berserker_garda.jpg',
    trafienie: 'assets/postacie/klasy/berserker_trafienie.jpg',
    smierc:    'assets/postacie/klasy/berserker_smierc.jpg',
    // Berserker w ataku mocno sie pochyla, wiec podnosimy mu skale,
    // zeby nie "kurczyl sie" przy ciosie.
    skale: { atak: 1.02, garda: 0.98, trafienie: 1.02, smierc: 0.70 }
  },

  zabojca: {
    portret:   'assets/postacie/klasy/zabojca_portret.jpg',      // frontalny — menu
    postawa:   'assets/postacie/klasy/zabojca_postawa.jpg',
    atak:      'assets/postacie/klasy/zabojca_atak.jpg',
    garda:     'assets/postacie/klasy/zabojca_garda.jpg',
    trafienie: 'assets/postacie/klasy/zabojca_trafienie.jpg',
    smierc:    'assets/postacie/klasy/zabojca_smierc.jpg',
    // Zabojca atakuje w glebokim wypadzie — po wysokosci jest wtedy duzo nizszy.
    skale: { atak: 1.10, garda: 1.00, trafienie: 1.00, smierc: 0.72 }
  },

  lucznik: {
    portret:   'assets/postacie/klasy/lucznik_portret.jpg',      // frontalny — menu
    postawa:   'assets/postacie/klasy/lucznik_postawa.jpg',
    atak:      'assets/postacie/klasy/lucznik_atak.jpg',
    garda:     'assets/postacie/klasy/lucznik_garda.jpg',
    trafienie: 'assets/postacie/klasy/lucznik_trafienie.jpg',
    smierc:    'assets/postacie/klasy/lucznik_smierc.jpg',
    skale: { atak: 1.00, garda: 1.00, trafienie: 1.00, smierc: 0.72 }
  },

  mag: {
    portret:   'assets/postacie/klasy/mag_portret.jpg',          // frontalny — menu
    postawa:   'assets/postacie/klasy/mag_postawa.jpg',
    atak:      'assets/postacie/klasy/mag_atak.jpg',
    garda:     'assets/postacie/klasy/mag_garda.jpg',
    trafienie: 'assets/postacie/klasy/mag_trafienie.jpg',
    smierc:    'assets/postacie/klasy/mag_smierc.jpg',
    skale: { atak: 1.05, garda: 1.00, trafienie: 1.00, smierc: 0.72 }
  },

  druid: {
    portret:   'assets/postacie/klasy/druid_portret.jpg',        // frontalny — menu
    postawa:   'assets/postacie/klasy/druid_postawa.jpg',
    atak:      'assets/postacie/klasy/druid_atak.jpg',
    garda:     'assets/postacie/klasy/druid_garda.jpg',
    trafienie: 'assets/postacie/klasy/druid_trafienie.jpg',
    smierc:    'assets/postacie/klasy/druid_smierc.jpg',
    skale: { atak: 1.05, garda: 1.00, trafienie: 1.00, smierc: 0.72 }
  }
};

// Wrogowie mają trzy pozy (patrz sekcja 7 biblii stylu): postawa, atak, trafienie.
// Blok pokazujemy efektem na postawie, śmierci nie generujemy.
// Klucz = id wroga z js/data/wrogowie.js.
const GRAFIKI_WROGOW = {

  // ---------- region 1: kamieniołomy (prolog) ----------
  //  Trzy pierwsze walki to ci sami umundurowani strażnicy — dzielą
  //  jeden komplet grafik. Weteran i Nadzorca mają własne.

  straznikKamieniolomu: {
    postawa:   'assets/postacie/wrogowie/straznikKopalni_wzor.jpg',
    atak:      'assets/postacie/wrogowie/straznikKopalni_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/straznikKopalni_trafienie.jpg',
    odbij: []
  },
  straznikZbrojowni: {
    postawa:   'assets/postacie/wrogowie/straznikKopalni_wzor.jpg',
    atak:      'assets/postacie/wrogowie/straznikKopalni_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/straznikKopalni_trafienie.jpg',
    odbij: []
  },
  straznikKoszar: {
    postawa:   'assets/postacie/wrogowie/straznikKopalni_wzor.jpg',
    atak:      'assets/postacie/wrogowie/straznikKopalni_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/straznikKopalni_trafienie.jpg',
    odbij: []
  },
  weteranBramy: {
    postawa:   'assets/postacie/wrogowie/weteranBramy_wzor.jpg',
    atak:      'assets/postacie/wrogowie/weteranBramy_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/weteranBramy_trafienie.jpg',
    odbij: []
  },
  nadzorca: {
    postawa:   'assets/postacie/wrogowie/nadzorca_wzor.jpg',
    atak:      'assets/postacie/wrogowie/nadzorca_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/nadzorca_trafienie.jpg',
    odbij: []
  },

  // ---------- region 2: Ludus w Kapui ----------

  balbus: {
    postawa:   'assets/postacie/wrogowie/balbus_wzor.jpg',
    atak:      'assets/postacie/wrogowie/balbus_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/balbus_trafienie.jpg',
    // Pozy narysowane w złą stronę — gra odbija je lustrzanie,
    // zamiast generować grafikę od nowa.
    odbij: ['trafienie']
  },

  sura: {
    postawa:   'assets/postacie/wrogowie/sura_wzor.jpg',
    atak:      'assets/postacie/wrogowie/sura_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/sura_trafienie.jpg',
    odbij: ['trafienie']
  },

  porcius: {
    postawa:   'assets/postacie/wrogowie/porcius_wzor.jpg',
    atak:      'assets/postacie/wrogowie/porcius_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/porcius_trafienie.jpg',
    odbij: ['atak', 'trafienie']   // zamach wyszedł w drugą stronę
  },

  decimus: {
    postawa:   'assets/postacie/wrogowie/decimus_wzor.jpg',
    atak:      'assets/postacie/wrogowie/decimus_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/decimus_trafienie.jpg',
    odbij: []   // ten już jest narysowany w dobrą stronę
  },

  rufus: {
    postawa:   'assets/postacie/wrogowie/rufus_wzor.jpg',
    atak:      'assets/postacie/wrogowie/rufus_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/rufus_trafienie.jpg',
    // Czwarta poza: telegraf szarży. Pokazuje się sama, gdy silnik
    // ustawi znacznik szykujeSzarze (sekcja 7 biblii — dodatkowa poza
    // tylko tam, gdzie opiera się na niej tozsamosc wroga).
    szarza:    'assets/postacie/wrogowie/rufus_szarza.jpg',
    odbij: [],
    skala: 1.15   // miniboss — ma górować nad bohaterem
  },

  hister: {
    postawa:   'assets/postacie/wrogowie/hister_wzor.jpg',
    atak:      'assets/postacie/wrogowie/hister_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/hister_trafienie.jpg',
    // Czwarta poza: szał po spadku ponizej progu HP — odslonieta garda.
    szal:      'assets/postacie/wrogowie/hister_szal.jpg',
    odbij: [],
    skala: 1.15   // miniboss
  },

  juba: {
    postawa:   'assets/postacie/wrogowie/juba_wzor.jpg',
    atak:      'assets/postacie/wrogowie/juba_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/juba_trafienie.jpg',
    odbij: [],
    skala: 1.08   // gora miesni
  },

  aulus: {
    postawa:   'assets/postacie/wrogowie/aulus_wzor.jpg',
    atak:      'assets/postacie/wrogowie/aulus_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/aulus_trafienie.jpg',
    odbij: ['trafienie']   // zataczal sie w strone bohatera
  },

  kaplanka: {
    postawa:   'assets/postacie/wrogowie/kaplanka_wzor.jpg',
    atak:      'assets/postacie/wrogowie/kaplanka_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/kaplanka_trafienie.jpg',
    // Czwarta poza: rzucanie klatwy — jej znak rozpoznawczy.
    klatwa:    'assets/postacie/wrogowie/kaplanka_klatwa.jpg',
    odbij: []
  },

// --- bestie z jamy łowów (skala dobrana osobno: zwierzę nie jest wzrostu człowieka) ---

  nocnyWilk: {
    postawa:   'assets/postacie/bestie/nocnyWilk_wzor.jpg',
    atak:      'assets/postacie/bestie/nocnyWilk_atak.jpg',
    trafienie: 'assets/postacie/bestie/nocnyWilk_trafienie.jpg',
    odbij: [],
    skala: 0.55   // wilk sięga człowiekowi do pasa
  },

  dzikBojowy: {
    postawa:   'assets/postacie/bestie/dzikBojowy_wzor.jpg',
    atak:      'assets/postacie/bestie/dzikBojowy_atak.jpg',
    trafienie: 'assets/postacie/bestie/dzikBojowy_trafienie.jpg',
    odbij: [],
    skala: 0.62   // niski, ale masywny
  },

  jaskiniowyPajak: {
    postawa:   'assets/postacie/bestie/jaskiniowyPajak_wzor.jpg',
    atak:      'assets/postacie/bestie/jaskiniowyPajak_atak.jpg',
    trafienie: 'assets/postacie/bestie/jaskiniowyPajak_trafienie.jpg',
    odbij: [],
    skala: 0.5   // wielkości dużego psa
  },

  kamiennyGolem: {
    postawa:   'assets/postacie/bestie/kamiennyGolem_wzor.jpg',
    atak:      'assets/postacie/bestie/kamiennyGolem_atak.jpg',
    trafienie: 'assets/postacie/bestie/kamiennyGolem_trafienie.jpg',
    odbij: [],
    skala: 1.25   // góruje nad gladiatorem
  },

  piesHadesa: {
    postawa:   'assets/postacie/bestie/piesHadesa_wzor.jpg',
    atak:      'assets/postacie/bestie/piesHadesa_atak.jpg',
    trafienie: 'assets/postacie/bestie/piesHadesa_trafienie.jpg',
    odbij: [],
    skala: 0.68   // wielki mastif
  },

  mlodaHydra: {
    postawa:   'assets/postacie/bestie/mlodaHydra_wzor.jpg',
    atak:      'assets/postacie/bestie/mlodaHydra_atak.jpg',
    trafienie: 'assets/postacie/bestie/mlodaHydra_trafienie.jpg',
    odbij: [],
    skala: 0.95   // korpus nisko, szyje w górze
  },

  harpia: {
    postawa:   'assets/postacie/bestie/harpia_wzor.jpg',
    atak:      'assets/postacie/bestie/harpia_atak.jpg',
    trafienie: 'assets/postacie/bestie/harpia_trafienie.jpg',
    odbij: [],
    skala: 0.85   // zawisa w powietrzu
  },

  chimera: {
    postawa:   'assets/postacie/bestie/chimera_wzor.jpg',
    atak:      'assets/postacie/bestie/chimera_atak.jpg',
    trafienie: 'assets/postacie/bestie/chimera_trafienie.jpg',
    odbij: [],
    skala: 1.05   // apex regionu
  },

  straznik: {
    postawa:   'assets/postacie/wrogowie/straznik_wzor.jpg',
    atak:      'assets/postacie/wrogowie/straznik_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/straznik_trafienie.jpg',
    odbij: [],
    skala: 1.05
  },

  verrus: {
    postawa:   'assets/postacie/wrogowie/verrus_wzor.jpg',
    atak:      'assets/postacie/wrogowie/verrus_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/verrus_trafienie.jpg',
    // Faza 1 to mur, wiec ma wlasna garde (wyjatek z sekcji 7).
    garda:     'assets/postacie/wrogowie/verrus_garda.jpg',
    // Faza 2: odrzuca tarcze i wpada w furie.
    faza2:     'assets/postacie/wrogowie/verrus_faza2.jpg',
    odbij: [],
    skala: 1.2    // czempion regionu
  },

  gemina: {
    postawa:   'assets/postacie/wrogowie/gemina_wzor.jpg',
    atak:      'assets/postacie/wrogowie/gemina_atak.jpg',      // zarzut sieci
    trafienie: 'assets/postacie/wrogowie/gemina_trafienie.jpg',
    odbij: []
  },

  murmillo: {
    postawa:   'assets/postacie/wrogowie/murmillo_wzor.jpg',
    atak:      'assets/postacie/wrogowie/murmillo_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/murmillo_trafienie.jpg',
    // Wyjatek z sekcji 7: jego tozsamosc to obrona, wiec ma wlasna garde.
    garda:     'assets/postacie/wrogowie/murmillo_garda.jpg',
    odbij: ['trafienie']   // zataczal sie w strone bohatera
  },

  vala: {
    postawa:   'assets/postacie/wrogowie/vala_wzor.jpg',
    atak:      'assets/postacie/wrogowie/vala_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/vala_trafienie.jpg',
    odbij: []
  },

  lucius: {
    postawa:   'assets/postacie/wrogowie/lucius_wzor.jpg',
    atak:      'assets/postacie/wrogowie/lucius_atak.jpg',
    trafienie: 'assets/postacie/wrogowie/lucius_trafienie.jpg',
    odbij: ['trafienie']   // zataczal sie w strone bohatera zamiast od niego
  }

};
