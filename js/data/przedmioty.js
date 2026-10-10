// ============================================================
//  DANE: przedmioty, przepisy kuźni i budynki miasta
//  Ceny i efekty z design/arena_region1.md (sekcje 5 i 8).
// ============================================================

const PRZEDMIOTY = {

  // ---------- bronie startowe (po jednej na klasę) ----------

  zardzewialyGladius: {
    id: 'zardzewialyGladius', nazwa: 'Zardzewiały gladius', ikona: '🗡',
    typ: 'bron', obrazenia: 2, startowa: true,
    opis: 'Tępy i szczerbaty, ale to wciąż żelazo.'
  },
  obosiecznyTopor: {
    id: 'obosiecznyTopor', nazwa: 'Obosieczny topór', ikona: '🪓',
    typ: 'bron', obrazenia: 2, startowa: true,
    opis: 'Ciężki i nieporęczny. Zamach boli obie strony.'
  },
  // Zabójca ma najmniej HP w grze, więc jego broń startowa nie może być
  // jeszcze słabsza od pozostałych — przy 1 obrażeniu wychodził gorszy
  // od każdej innej klasy na obu osiach naraz. Krytyk niesie jego
  // tożsamość od pierwszej tury, zamiast czekać na drzewko.
  paraSztyletow: {
    id: 'paraSztyletow', nazwa: 'Para sztyletów', ikona: '🔪',
    typ: 'bron', obrazenia: 2, bonusKrytyka: 0.10, startowa: true,
    opis: 'Krótkie ostrza. Siły nie dodają, ale znajdują szpary.'
  },

  // ---------- bronie ze sklepu ----------

  zelaznyGladius: {
    id: 'zelaznyGladius', nazwa: 'Żelazny gladius', ikona: '⚔',
    typ: 'bron', obrazenia: 5, cena: 80,
    opis: 'Porządna, wyważona klinga. Pierwszy prawdziwy skok mocy.'
  },
  wloczniaZKapui: {
    id: 'wloczniaZKapui', nazwa: 'Włócznia z Kapui', ikona: '🔱',
    typ: 'bron', obrazenia: 6, bonusCelnosci: 0.05, cena: 140,
    opis: 'Zasięg daje przewagę — trafiasz częściej.'
  },

  // ---------- pancerze ----------

  tunika: {
    id: 'tunika', nazwa: 'Tunika', ikona: '👕',
    typ: 'pancerz', obrona: 0, startowa: true,
    opis: 'Kawałek płótna. Lepsze to niż nic.'
  },
  skory: {
    id: 'skory', nazwa: 'Skóry', ikona: '🟫',
    typ: 'pancerz', obrona: 0, startowa: true,
    opis: 'Surowe skóry narzucone na barki.'
  },
  ciemneLachy: {
    id: 'ciemneLachy', nazwa: 'Ciemne łachy', ikona: '🥷',
    typ: 'pancerz', obrona: 0, startowa: true,
    opis: 'Nie chronią. Za to nie szeleszczą.'
  },
  skorzanaUprzaz: {
    id: 'skorzanaUprzaz', nazwa: 'Skórzana uprząż', ikona: '🦺',
    typ: 'pancerz', obrona: 3, cena: 70,
    opis: 'Utwardzana skóra na piersi i barkach.'
  },
  napiersnikZCwiekami: {
    id: 'napiersnikZCwiekami', nazwa: 'Napierśnik z ćwiekami', ikona: '🛡',
    typ: 'pancerz', obrona: 5, cena: 150,
    opis: 'Najlepsze, co da się kupić za złoto w Kapui.'
  },

  // ---------- hełmy, tarcze i nagolenniki ----------
  // Każda część daje mało, ale razem robią różnicę. Pełny komplet kosztuje
  // tyle, co kilkanaście walk — ma być celem na pół regionu, nie zakupem na start.

  skorzanyHelm: {
    id: 'skorzanyHelm', nazwa: 'Skórzany hełm', ikona: '🪖',
    typ: 'helm', obrona: 1, cena: 60,
    opis: 'Zszyta skóra z wyściółką. Lepsze to niż nic.'
  },
  brazowyHelm: {
    id: 'brazowyHelm', nazwa: 'Brązowy hełm', ikona: '🪖',
    typ: 'helm', obrona: 2, cena: 130,
    opis: 'Z osłoną karku i policzkami. Cios w głowę przestaje kończyć walkę.'
  },

  lekkaTarcza: {
    id: 'lekkaTarcza', nazwa: 'Lekka tarcza', ikona: '🛡',
    typ: 'tarcza', obrona: 1, cena: 55,
    opis: 'Deski i skóra. Zatrzyma pierwszy cios, może drugi.'
  },
  okutaTarcza: {
    id: 'okutaTarcza', nazwa: 'Okuta tarcza', ikona: '🛡',
    typ: 'tarcza', obrona: 3, cena: 160,
    opis: 'Żelazna obręcz i umbo. Trzyma nawet pod toporem.'
  },

  skorzaneNagolenniki: {
    id: 'skorzaneNagolenniki', nazwa: 'Skórzane nagolenniki', ikona: '🥾',
    typ: 'nagolenniki', obrona: 1, cena: 50,
    opis: 'Owijki z twardej skóry. Nogi w arenie obrywają pierwsze.'
  },
  zelazneNagolenniki: {
    id: 'zelazneNagolenniki', nazwa: 'Żelazne nagolenniki', ikona: '🥾',
    typ: 'nagolenniki', obrona: 2, cena: 120,
    opis: 'Kute blachy na goleniach. Ciężkie, ale po nich nie kuleje się do gospody.'
  },

  // ---------- sprzęt z kuźni (sufit regionu) ----------

  gladiusLudusu: {
    id: 'gladiusLudusu', nazwa: 'Gladius Ludusu', ikona: '⚔',
    typ: 'bron', obrazenia: 9, bonusKrytyka: 0.05, zKuzni: true,
    opis: 'Kuty ze stali ludusu. Najlepsza broń regionu.'
  },
  loricaZByczejSkory: {
    id: 'loricaZByczejSkory', nazwa: 'Lorica z byczej skóry', ikona: '🛡',
    typ: 'pancerz', obrona: 7, zKuzni: true,
    opis: 'Ze skóry Rufusa. Ciężka, ale nie krępuje ruchów.'
  },

  // ---------- oręż MAGICZNY (z esencji, u Czarodzieja) ----------
  //  Broń żywiołowa OMIJA pancerz, ale podlega odpornościom celu.

  ognistyGladius: {
    id: 'ognistyGladius', nazwa: 'Ognisty gladius', ikona: '🔥',
    typ: 'bron', obrazenia: 7, zywiol: 'ogien', zEsencji: true,
    opis: 'Klinga przesycona ogniem Psa Hadesa. Pali hydry i dziki — ale nie próbuj nią na tym, co ogniem żyje.'
  },

  gromowyMlot: {
    id: 'gromowyMlot', nazwa: 'Gromowy młot', ikona: '⚡',
    typ: 'bron', obrazenia: 7, zywiol: 'blyskawica', zEsencji: true,
    opis: 'W rdzeniu golema wciąż trzaska burza. Kamień i metal przewodzą — pancerz nic tu nie da.'
  },

  jadowiteOstrze: {
    id: 'jadowiteOstrze', nazwa: 'Jadowite ostrze', ikona: '🌿',
    typ: 'bron', obrazenia: 6, zywiol: 'natura', bonusKrytyka: 0.05, zEsencji: true,
    opis: 'Ostrze nasączone jadem pająka. Omija pancerz, ale nieumarłym i kamieniowi niestraszne.'
  }
};

// ---------- przepisy kuźni ----------
//  koszt: { materialy: { idMaterialu: ile }, zloto: n }

const PRZEPISY = {

  gladiusLudusu: {
    id: 'gladiusLudusu', przedmiot: 'gladiusLudusu',
    koszt: { materialy: { stalLudusu: 3, zelaznyZlom: 5 }, zloto: 120 }
  },

  loricaZByczejSkory: {
    id: 'loricaZByczejSkory', przedmiot: 'loricaZByczejSkory',
    koszt: { materialy: { skoraByka: 2, skora: 4 }, zloto: 100 }
  },

  ognistyGladius: {
    id: 'ognistyGladius', przedmiot: 'ognistyGladius', zEsencji: true,
    koszt: { esencje: { ognistaEsencja: 2, krewHydry: 1 }, materialy: { stalLudusu: 1 }, zloto: 150 }
  },

  gromowyMlot: {
    id: 'gromowyMlot', przedmiot: 'gromowyMlot', zEsencji: true,
    koszt: { esencje: { rdzenGolema: 2 }, materialy: { rudaZelaza: 4 }, zloto: 150 }
  },

  lukZHydry: {
    id: 'lukZHydry', przedmiot: 'lukZHydry', zEsencji: true,
    koszt: { esencje: { krewHydry: 2, kielWilka: 2 }, materialy: { skora: 3 }, zloto: 140 }
  },

  kosturZSercaChimery: {
    id: 'kosturZSercaChimery', przedmiot: 'kosturZSercaChimery', zEsencji: true,
    koszt: { esencje: { serceChimery: 1, ognistaEsencja: 1 }, zloto: 200 }
  },

  jadowiteOstrze: {
    id: 'jadowiteOstrze', przedmiot: 'jadowiteOstrze', zEsencji: true,
    koszt: { esencje: { jadPajaka: 2, kielWilka: 1 }, zloto: 120 }
  },

  // Ulepszenia działają na AKTUALNIE założoną broń — kumulują się do +2
  ulepszenieBroni: {
    id: 'ulepszenieBroni', ulepszenie: true, maksPoziom: 2,
    nazwa: 'Ulepszenie broni',
    ikona: '🔨',
    opis: 'Podbija obrażenia założonej broni. Można ulepszyć dwa razy.',
    poziomy: [
      { bonusObrazen: 2, koszt: { materialy: { rudaZelaza: 3, stalLudusu: 1 }, zloto: 40 } },
      { bonusObrazen: 4, koszt: { materialy: { rudaZelaza: 6, stalLudusu: 1 }, zloto: 80 } }
    ]
  }
};

// ---------- budynki miasta (rosną razem z postępem) ----------
//  odblokowanePoRandze: ile rang trzeba pokonać, żeby budynek się otworzył

const BUDYNKI = {
  arena:   { id: 'arena',   nazwa: 'Arena',   ikona: '⚔',  odblokowanePoRandze: 0,
             opis: 'Drabina walk. Tu zdobywasz złoto, XP i materiały.' },
  gospoda: { id: 'gospoda', nazwa: 'Gospoda', ikona: '🍺', odblokowanePoRandze: 2,
             opis: 'Pełne leczenie za złoto. Alternatywa dla czekania.' },
  kuznia:  { id: 'kuznia',  nazwa: 'Kuźnia',  ikona: '🔨', odblokowanePoRandze: 3,
             opis: 'Najlepszy sprzęt regionu — z materiałów, nie za złoto.' },
  sklep:   { id: 'sklep',   nazwa: 'Sklep',   ikona: '🏺', odblokowanePoRandze: 0,
             opis: 'Podstawowy oręż, pancerze i eliksiry za złoto.' },
  czarodziej: { id: 'czarodziej', nazwa: 'Czarodziej', ikona: '🔮', odblokowanePoRandze: 5,
             opis: 'Artefakty: kupno, sprzedaż i zakładanie. Trzeci, pasywny slot.' },
  zlecenia: { id: 'zlecenia', nazwa: 'Tablica zleceń', ikona: '📜', odblokowanePoRandze: 1,
             opis: 'Praca dla gladiatora poza areną. Złoto za czas, nie za krew.' },
  trening: { id: 'trening', nazwa: 'Plac treningowy', ikona: '🏋', odblokowanePoRandze: 1,
             opis: 'Podnoś cechy za złoto. Wcześnie od ręki, później trzeba odczekać.' },
  jama:    { id: 'jama',    nazwa: 'Jama łowów', ikona: '🕳', odblokowanePoRandze: 8,
             opis: 'Bestie zamiast ludzi. Żywioły, esencje i materiały — poza fabułą, ile chcesz.' }
};

// ---------- wyposażenie magiczne ----------

PRZEDMIOTY.prostyKostur = {
  id: 'prostyKostur', nazwa: 'Prosty kostur', ikona: '🪄',
  typ: 'bron', obrazenia: 1, startowa: true, magiczna: true,
  opis: 'Sękaty kij z kawałkiem kwarcu. Wzmacnia to, co i tak jest w Tobie.'
};
PRZEDMIOTY.szataAdepta = {
  id: 'szataAdepta', nazwa: 'Szata adepta', ikona: '👘',
  typ: 'pancerz', obrona: 0, startowa: true,
  opis: 'Wełna. Przed ostrzem nie chroni w ogóle.'
};
PRZEDMIOTY.sekatyKij = {
  id: 'sekatyKij', nazwa: 'Sękaty kij', ikona: '🌳',
  typ: 'bron', obrazenia: 2, startowa: true, magiczna: true,
  opis: 'Wyrwany z żywego dębu. Wciąż pachnie lasem.'
};
PRZEDMIOTY.skoraNiedzwiedzia = {
  id: 'skoraNiedzwiedzia', nazwa: 'Skóra niedźwiedzia', ikona: '🐻',
  typ: 'pancerz', obrona: 1, startowa: true,
  opis: 'Ciężka i ciepła. Coś zatrzyma.'
};
PRZEDMIOTY.kosturZKapui = {
  id: 'kosturZKapui', nazwa: 'Kostur z Kapui', ikona: '🪄',
  typ: 'bron', obrazenia: 4, cena: 130, magiczna: true,
  opis: 'Okuty brązem, z prawdziwym ogniskiem mocy w głowicy.'
};
PRZEDMIOTY.kosturZSercaChimery = {
  id: 'kosturZSercaChimery', nazwa: 'Kostur z serca chimery', ikona: '💜',
  typ: 'bron', obrazenia: 7, bonusKrytyka: 0.08, magiczna: true, zEsencji: true,
  opis: 'W głowicy bije serce, które wciąż nie wie, którym jest zwierzęciem.'
};

// ---------- wyposażenie łucznika ----------

PRZEDMIOTY.prostyLuk = {
  id: 'prostyLuk', nazwa: 'Prosty łuk', ikona: '🏹',
  typ: 'bron', obrazenia: 2, bonusCelnosci: 0.05, startowa: true, dystansowa: true,
  opis: 'Cis i jelita. Niewiele, ale strzela z drugiego końca areny.'
};

PRZEDMIOTY.kurtaLowcy = {
  id: 'kurtaLowcy', nazwa: 'Kurta łowcy', ikona: '🥼',
  typ: 'pancerz', obrona: 0, startowa: true,
  opis: 'Cicha i lekka. Nie zatrzyma gladiusa.'
};

PRZEDMIOTY.lukMysliwski = {
  id: 'lukMysliwski', nazwa: 'Łuk myśliwski', ikona: '🏹',
  typ: 'bron', obrazenia: 4, bonusCelnosci: 0.05, cena: 90, dystansowa: true,
  opis: 'Porządne drewno i równy naciąg. Pierwszy skok mocy łucznika.'
};

PRZEDMIOTY.lukZKapui = {
  id: 'lukZKapui', nazwa: 'Łuk z Kapui', ikona: '🏹',
  typ: 'bron', obrazenia: 6, bonusCelnosci: 0.08, cena: 150, dystansowa: true,
  opis: 'Warstwowany, mocniejszy naciąg. Sięga dalej i celniej.'
};

PRZEDMIOTY.lukZHydry = {
  id: 'lukZHydry', nazwa: 'Łuk z ścięgien hydry', ikona: '🐉',
  typ: 'bron', obrazenia: 8, bonusCelnosci: 0.10, dystansowa: true, zEsencji: true,
  opis: 'Ścięgna, które same się zrastają. Naciąg jak u machiny oblężniczej.'
};
