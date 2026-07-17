/** GSC returns ISO 3166-1 alpha-3 country codes (lowercase). */
const COUNTRY_NAMES: Record<string, string> = {
  usa: "United States",
  gbr: "United Kingdom",
  can: "Canada",
  aus: "Australia",
  deu: "Germany",
  fra: "France",
  ind: "India",
  irl: "Ireland",
  nld: "Netherlands",
  nzl: "New Zealand",
  esp: "Spain",
  ita: "Italy",
  bra: "Brazil",
  mex: "Mexico",
  jpn: "Japan",
  kor: "South Korea",
  sgp: "Singapore",
  swe: "Sweden",
  nor: "Norway",
  dnk: "Denmark",
  fin: "Finland",
  pol: "Poland",
  prt: "Portugal",
  bel: "Belgium",
  che: "Switzerland",
  aut: "Austria",
  zaf: "South Africa",
  are: "United Arab Emirates",
  sau: "Saudi Arabia",
  phl: "Philippines",
  idn: "Indonesia",
  mys: "Malaysia",
  tha: "Thailand",
  vnm: "Vietnam",
  tur: "Turkey",
  isr: "Israel",
  arg: "Argentina",
  chl: "Chile",
  col: "Colombia",
  rou: "Romania",
  cze: "Czechia",
  hun: "Hungary",
  grc: "Greece",
  ukr: "Ukraine",
  pak: "Pakistan",
  bgd: "Bangladesh",
  nga: "Nigeria",
  egy: "Egypt",
  hkg: "Hong Kong",
  twn: "Taiwan",
  xxx: "Unknown region",
};

export function formatGscCountry(code: string) {
  const key = code.trim().toLowerCase();
  return COUNTRY_NAMES[key] ?? code.toUpperCase();
}

export function shortPagePath(url: string) {
  try {
    const u = new URL(url);
    return u.pathname + u.search || "/";
  } catch {
    return url;
  }
}
