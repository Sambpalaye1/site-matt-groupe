// Devis calculator — mimics La Providence pricing logic.
// In production, replaced by a server call to La Providence's API.

export type Categorie = "particulier" | "moto_jakarta" | "tricycle" | "scooter_plus" | "scooter_moins";
export type PuissanceFiscale = "2" | "3-6" | "7-10" | "11-14" | "15-23" | "24+";
export type Usage = "particulier" | "commercial" | "public";
export type Formule = "rc" | "rc_vol" | "tous_risques";
export type Compagnie = "allianz" | "askia" | "finafrica" | "providence";

const BASE_BY_CAT: Record<Categorie, number> = {
  particulier: 42000,
  moto_jakarta: 18000,
  tricycle: 26000,
  scooter_plus: 22000,
  scooter_moins: 15000,
};
const CV_MULT: Record<PuissanceFiscale, number> = {
  "2": 1, "3-6": 1.15, "7-10": 1.35, "11-14": 1.7, "15-23": 2.1, "24+": 2.6,
};
const USAGE_MULT: Record<Usage, number> = { particulier: 1, commercial: 1.25, public: 1.55 };
const FORMULE_MULT: Record<Formule, number> = { rc: 1, rc_vol: 1.55, tous_risques: 2.8 };
const COMPAGNIE_MULT: Record<Compagnie, number> = {
  allianz: 1.18, askia: 1.0, finafrica: 0.94, providence: 1.05,
};

export function calculateQuote(input: {
  categorie: Categorie;
  cv: PuissanceFiscale;
  usage: Usage;
  formule: Formule;
  compagnie: Compagnie;
  dureeMois: number;
}) {
  const base = BASE_BY_CAT[input.categorie];
  const annual = Math.round(
    base * CV_MULT[input.cv] * USAGE_MULT[input.usage] * FORMULE_MULT[input.formule] * COMPAGNIE_MULT[input.compagnie]
  );
  const prorata = Math.round((annual * input.dureeMois) / 12);
  const fraisDossier = 1500;
  return { annual, prorata, fraisDossier, total: prorata + fraisDossier };
}

export function formatFCFA(n: number) {
  return new Intl.NumberFormat("fr-FR").format(n) + " FCFA";
}
