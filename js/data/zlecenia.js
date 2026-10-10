// ============================================================
//  DANE: zlecenia z tablicy w Kapui
//
//  Praca dla gladiatora poza areną: pilnowanie, eskorty, pokazy.
//  Lecą w czasie rzeczywistym — bierzesz zlecenie i idziesz walczyć.
//
//  `poIlu` to liczba WYKONANYCH zleceń, po której dane zlecenie
//  pojawia się na tablicy. Dzięki temu praca sama się poprawia:
//  im więcej masz za sobą, tym lepiej płatne rzeczy Ci powierzają.
//
//  Stawka za godzinę rośnie z poziomem zlecenia — to jest ta nagroda
//  za wyrobioną opinię, a nie samo "dłużej = więcej".
// ============================================================

const ZLECENIA = [
  {
    id: 'stragan', nazwa: 'Pilnowanie straganu', poIlu: 0,
    minuty: 15, zloto: 35,
    opis: 'Handlarz oliwą boi się złodziei. Wystarczy, że stoisz i patrzysz groźnie.'
  },
  {
    id: 'eskortaKupca', nazwa: 'Eskorta kupca na targ', poIlu: 0,
    minuty: 30, zloto: 80,
    opis: 'Droga do Kapui bywa niespokojna. Kupiec płaci za spokój ducha.'
  },
  {
    id: 'sparing', nazwa: 'Sparing z nowicjuszami', poIlu: 3,
    minuty: 45, zloto: 140,
    opis: 'Lanista chce, żeby żółtodzioby oberwały od kogoś, kto wie jak.',
    materialy: { zelaznyZlom: 1 }
  },
  {
    id: 'uczta', nazwa: 'Ochrona uczty patrycjusza', poIlu: 8,
    minuty: 90, zloto: 320,
    opis: 'Bogacz chce mieć gladiatora przy drzwiach. Bardziej dla podziwu niż dla bezpieczeństwa.'
  },
  {
    id: 'transport', nazwa: 'Eskorta transportu broni', poIlu: 15,
    minuty: 180, zloto: 720,
    opis: 'Wóz ze stalą do ludusa. Po tej drodze już raz zniknął cały ładunek.',
    materialy: { rudaZelaza: 2, zelaznyZlom: 2 }
  },
  {
    id: 'pokaz', nazwa: 'Pokaz dla senatora', poIlu: 25,
    minuty: 360, zloto: 1620,
    opis: 'Cały dzień na nogach przed gośćmi z Rzymu. Płacą tyle, ile to upokorzenie warte.'
  }
];
