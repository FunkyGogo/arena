// ============================================================
//  DANE: żywioły
//  Fizyczny blokuje pancerz. Żywiołowy go OMIJA, ale wchodzi
//  w kamień-papier-nożyce ze słabościami i odpornościami celu.
//  (design/arena_fundament_walki.md sekcja 4)
// ============================================================

const ZYWIOLY = {
  fizyczny:   { id: 'fizyczny',   nazwa: 'Fizyczny',    ikona: '⚔',  omijaPancerz: false },
  ogien:      { id: 'ogien',      nazwa: 'Ogień',       ikona: '🔥', omijaPancerz: true },
  lod:        { id: 'lod',        nazwa: 'Lód',         ikona: '❄',  omijaPancerz: true },
  blyskawica: { id: 'blyskawica', nazwa: 'Błyskawica',  ikona: '⚡', omijaPancerz: true },
  natura:     { id: 'natura',     nazwa: 'Natura',      ikona: '🌿', omijaPancerz: true }
};
