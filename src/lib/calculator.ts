// Calculator data + pricing logic for car2scrap
// Brand → Model based catalog

export type Condition = "excellent" | "good" | "poor";
export type FuelType = "petrol" | "diesel" | "cng" | "lpg" | "electric";

export interface CarBrand {
  id: string;
  label: string;
  /** fallback weight if a specific model is not found */
  defaultWeight: number;
}

export interface CarModel {
  id: string;
  label: string;
  brand: string; // brand id
  weight: number; // kerb weight in kg
}

export const CAR_BRANDS: CarBrand[] = [
  { id: "maruti", label: "Maruti Suzuki", defaultWeight: 950 },
  { id: "hyundai", label: "Hyundai", defaultWeight: 1050 },
  { id: "tata", label: "Tata", defaultWeight: 1150 },
  { id: "mahindra", label: "Mahindra", defaultWeight: 1700 },
  { id: "honda", label: "Honda", defaultWeight: 1100 },
  { id: "toyota", label: "Toyota", defaultWeight: 1400 },
  { id: "renault", label: "Renault", defaultWeight: 1050 },
  { id: "ford", label: "Ford", defaultWeight: 1250 },
  { id: "nissan", label: "Nissan", defaultWeight: 1100 },
  { id: "chevrolet", label: "Chevrolet", defaultWeight: 1100 },
  { id: "skoda", label: "Skoda", defaultWeight: 1250 },
  { id: "volkswagen", label: "Volkswagen", defaultWeight: 1250 },
  { id: "kia", label: "Kia", defaultWeight: 1350 },
  { id: "mg", label: "MG", defaultWeight: 1500 },
  { id: "datsun", label: "Datsun", defaultWeight: 800 },
  { id: "fiat", label: "Fiat", defaultWeight: 1100 },
  { id: "mitsubishi", label: "Mitsubishi", defaultWeight: 1500 },
  { id: "jeep", label: "Jeep", defaultWeight: 1600 },
  { id: "bmw", label: "BMW", defaultWeight: 1600 },
  { id: "mercedes", label: "Mercedes-Benz", defaultWeight: 1700 },
  { id: "other", label: "Other (not listed)", defaultWeight: 1200 },
];

export const CAR_MODELS: CarModel[] = [
  // Maruti Suzuki
  { id: "alto", label: "Alto", brand: "maruti", weight: 750 },
  { id: "wagonr", label: "WagonR", brand: "maruti", weight: 880 },
  { id: "swift", label: "Swift", brand: "maruti", weight: 920 },
  { id: "dzire", label: "Dzire", brand: "maruti", weight: 1010 },
  { id: "baleno", label: "Baleno", brand: "maruti", weight: 935 },
  { id: "brezza", label: "Brezza", brand: "maruti", weight: 1195 },
  { id: "ertiga", label: "Ertiga", brand: "maruti", weight: 1240 },
  { id: "ciaz", label: "Ciaz", brand: "maruti", weight: 1075 },
  { id: "celerio", label: "Celerio", brand: "maruti", weight: 825 },
  { id: "spresso", label: "S-Presso", brand: "maruti", weight: 770 },
  { id: "eeco", label: "Eeco", brand: "maruti", weight: 935 },
  { id: "omni", label: "Omni", brand: "maruti", weight: 785 },
  { id: "maruti-800", label: "800", brand: "maruti", weight: 665 },

  // Hyundai
  { id: "santro", label: "Santro", brand: "hyundai", weight: 870 },
  { id: "i10", label: "i10", brand: "hyundai", weight: 920 },
  { id: "grandi10", label: "Grand i10", brand: "hyundai", weight: 950 },
  { id: "i20", label: "i20", brand: "hyundai", weight: 1020 },
  { id: "verna", label: "Verna", brand: "hyundai", weight: 1180 },
  { id: "creta", label: "Creta", brand: "hyundai", weight: 1340 },
  { id: "venue", label: "Venue", brand: "hyundai", weight: 1170 },
  { id: "xcent", label: "Xcent", brand: "hyundai", weight: 1025 },
  { id: "accent", label: "Accent", brand: "hyundai", weight: 1010 },
  { id: "eon", label: "Eon", brand: "hyundai", weight: 725 },

  // Tata
  { id: "indica", label: "Indica", brand: "tata", weight: 980 },
  { id: "indigo", label: "Indigo", brand: "tata", weight: 1100 },
  { id: "tiago", label: "Tiago", brand: "tata", weight: 1012 },
  { id: "tigor", label: "Tigor", brand: "tata", weight: 1052 },
  { id: "nexon", label: "Nexon", brand: "tata", weight: 1280 },
  { id: "punch", label: "Punch", brand: "tata", weight: 1100 },
  { id: "harrier", label: "Harrier", brand: "tata", weight: 1675 },
  { id: "safari", label: "Safari", brand: "tata", weight: 1825 },
  { id: "sumo", label: "Sumo", brand: "tata", weight: 1735 },
  { id: "zest", label: "Zest", brand: "tata", weight: 1110 },

  // Mahindra
  { id: "bolero", label: "Bolero", brand: "mahindra", weight: 1615 },
  { id: "scorpio", label: "Scorpio", brand: "mahindra", weight: 2055 },
  { id: "xuv300", label: "XUV300", brand: "mahindra", weight: 1280 },
  { id: "xuv500", label: "XUV500", brand: "mahindra", weight: 1925 },
  { id: "xuv700", label: "XUV700", brand: "mahindra", weight: 1875 },
  { id: "thar", label: "Thar", brand: "mahindra", weight: 1750 },
  { id: "kuv100", label: "KUV100", brand: "mahindra", weight: 1110 },
  { id: "tuv300", label: "TUV300", brand: "mahindra", weight: 1620 },
  { id: "marazzo", label: "Marazzo", brand: "mahindra", weight: 1640 },
  { id: "verito", label: "Verito", brand: "mahindra", weight: 1180 },

  // Honda
  { id: "city", label: "City", brand: "honda", weight: 1153 },
  { id: "amaze", label: "Amaze", brand: "honda", weight: 990 },
  { id: "civic", label: "Civic", brand: "honda", weight: 1310 },
  { id: "jazz", label: "Jazz", brand: "honda", weight: 1064 },
  { id: "wrv", label: "WR-V", brand: "honda", weight: 1107 },
  { id: "brv", label: "BR-V", brand: "honda", weight: 1255 },
  { id: "brio", label: "Brio", brand: "honda", weight: 935 },
  { id: "mobilio", label: "Mobilio", brand: "honda", weight: 1230 },
  { id: "crv", label: "CR-V", brand: "honda", weight: 1640 },

  // Toyota
  { id: "innova", label: "Innova", brand: "toyota", weight: 1755 },
  { id: "etios", label: "Etios", brand: "toyota", weight: 1045 },
  { id: "liva", label: "Liva", brand: "toyota", weight: 940 },
  { id: "corolla", label: "Corolla", brand: "toyota", weight: 1290 },
  { id: "fortuner", label: "Fortuner", brand: "toyota", weight: 2135 },
  { id: "yaris", label: "Yaris", brand: "toyota", weight: 1115 },
  { id: "glanza", label: "Glanza", brand: "toyota", weight: 935 },
  { id: "urbancruiser", label: "Urban Cruiser", brand: "toyota", weight: 1195 },
  { id: "qualis", label: "Qualis", brand: "toyota", weight: 1620 },

  // Renault
  { id: "kwid", label: "Kwid", brand: "renault", weight: 800 },
  { id: "duster", label: "Duster", brand: "renault", weight: 1280 },
  { id: "triber", label: "Triber", brand: "renault", weight: 947 },
  { id: "kiger", label: "Kiger", brand: "renault", weight: 1012 },
  { id: "lodgy", label: "Lodgy", brand: "renault", weight: 1395 },
  { id: "pulse", label: "Pulse", brand: "renault", weight: 970 },
  { id: "scala", label: "Scala", brand: "renault", weight: 1075 },

  // Ford
  { id: "ecosport", label: "EcoSport", brand: "ford", weight: 1325 },
  { id: "figo", label: "Figo", brand: "ford", weight: 1041 },
  { id: "aspire", label: "Aspire", brand: "ford", weight: 1067 },
  { id: "endeavour", label: "Endeavour", brand: "ford", weight: 2394 },
  { id: "ikon", label: "Ikon", brand: "ford", weight: 1085 },
  { id: "fiesta", label: "Fiesta", brand: "ford", weight: 1115 },

  // Nissan
  { id: "micra", label: "Micra", brand: "nissan", weight: 965 },
  { id: "sunny", label: "Sunny", brand: "nissan", weight: 1080 },
  { id: "magnite", label: "Magnite", brand: "nissan", weight: 1014 },
  { id: "terrano", label: "Terrano", brand: "nissan", weight: 1290 },
  { id: "kicks", label: "Kicks", brand: "nissan", weight: 1295 },

  // Chevrolet
  { id: "beat", label: "Beat", brand: "chevrolet", weight: 945 },
  { id: "spark", label: "Spark", brand: "chevrolet", weight: 845 },
  { id: "sail", label: "Sail", brand: "chevrolet", weight: 1090 },
  { id: "cruze", label: "Cruze", brand: "chevrolet", weight: 1455 },
  { id: "tavera", label: "Tavera", brand: "chevrolet", weight: 1730 },
  { id: "aveo", label: "Aveo", brand: "chevrolet", weight: 1095 },

  // Skoda
  { id: "rapid", label: "Rapid", brand: "skoda", weight: 1180 },
  { id: "octavia", label: "Octavia", brand: "skoda", weight: 1370 },
  { id: "fabia", label: "Fabia", brand: "skoda", weight: 1105 },
  { id: "superb", label: "Superb", brand: "skoda", weight: 1490 },
  { id: "kushaq", label: "Kushaq", brand: "skoda", weight: 1271 },

  // Volkswagen
  { id: "polo", label: "Polo", brand: "volkswagen", weight: 1090 },
  { id: "vento", label: "Vento", brand: "volkswagen", weight: 1175 },
  { id: "ameo", label: "Ameo", brand: "volkswagen", weight: 1135 },
  { id: "jetta", label: "Jetta", brand: "volkswagen", weight: 1395 },
  { id: "taigun", label: "Taigun", brand: "volkswagen", weight: 1271 },

  // Kia
  { id: "seltos", label: "Seltos", brand: "kia", weight: 1320 },
  { id: "sonet", label: "Sonet", brand: "kia", weight: 1175 },
  { id: "carens", label: "Carens", brand: "kia", weight: 1410 },
  { id: "carnival", label: "Carnival", brand: "kia", weight: 2110 },

  // MG
  { id: "hector", label: "Hector", brand: "mg", weight: 1655 },
  { id: "astor", label: "Astor", brand: "mg", weight: 1305 },
  { id: "zsev", label: "ZS EV", brand: "mg", weight: 1532 },

  // Datsun
  { id: "go", label: "Go", brand: "datsun", weight: 769 },
  { id: "goplus", label: "Go+", brand: "datsun", weight: 825 },
  { id: "redigo", label: "Redi-Go", brand: "datsun", weight: 670 },

  // Fiat
  { id: "punto", label: "Punto", brand: "fiat", weight: 1115 },
  { id: "linea", label: "Linea", brand: "fiat", weight: 1230 },
  { id: "palio", label: "Palio", brand: "fiat", weight: 1050 },

  // Mitsubishi
  { id: "lancer", label: "Lancer", brand: "mitsubishi", weight: 1245 },
  { id: "pajero", label: "Pajero", brand: "mitsubishi", weight: 2105 },
  { id: "outlander", label: "Outlander", brand: "mitsubishi", weight: 1565 },

  // Jeep
  { id: "compass", label: "Compass", brand: "jeep", weight: 1485 },
  { id: "meridian", label: "Meridian", brand: "jeep", weight: 1715 },
  { id: "wrangler", label: "Wrangler", brand: "jeep", weight: 1875 },

  // BMW
  { id: "bmw3", label: "3 Series", brand: "bmw", weight: 1545 },
  { id: "bmw5", label: "5 Series", brand: "bmw", weight: 1655 },
  { id: "bmwx1", label: "X1", brand: "bmw", weight: 1530 },
  { id: "bmwx3", label: "X3", brand: "bmw", weight: 1750 },

  // Mercedes-Benz
  { id: "mbcclass", label: "C-Class", brand: "mercedes", weight: 1545 },
  { id: "mbeclass", label: "E-Class", brand: "mercedes", weight: 1680 },
  { id: "mbgla", label: "GLA", brand: "mercedes", weight: 1505 },
  { id: "mbglc", label: "GLC", brand: "mercedes", weight: 1735 },

  // Other
  { id: "other-model", label: "Other / Not sure", brand: "other", weight: 1200 },
];

export const FUEL_TYPES: { id: FuelType; label: string }[] = [
  { id: "petrol", label: "Petrol" },
  { id: "diesel", label: "Diesel" },
  { id: "cng", label: "CNG" },
  { id: "lpg", label: "LPG" },
  { id: "electric", label: "Electric" },
];

export const SCRAP_RATE_PER_KG = 38; // INR

export const CONDITION_LABELS: Record<Condition, string> = {
  excellent: "Excellent",
  good: "Good",
  poor: "Poor",
};

export const CONDITION_FACTORS: Record<Condition, number> = {
  excellent: 1.1,
  good: 1.0,
  poor: 0.85,
};

export const MIN_YEAR = 1995;
export const MAX_YEAR = new Date().getFullYear();

/** Year list, newest first, for the year dropdown */
export const YEAR_OPTIONS: number[] = Array.from(
  { length: MAX_YEAR - MIN_YEAR + 1 },
  (_, i) => MAX_YEAR - i,
);

export interface PriceBreakdown {
  weight: number;
  basePrice: number;
  ageFactor: number;
  ageAdjustment: number;
  conditionFactor: number;
  conditionAdjustment: number;
  estimate: number;
  min: number;
  max: number;
}

export function calculatePrice(opts: {
  brand?: string;
  modelId?: string;
  year: number;
  condition: Condition;
}): PriceBreakdown {
  const model = opts.modelId ? CAR_MODELS.find((m) => m.id === opts.modelId) : undefined;
  const brand = opts.brand ? CAR_BRANDS.find((b) => b.id === opts.brand) : undefined;
  const weight = model?.weight ?? brand?.defaultWeight ?? 1200;

  const basePrice = weight * SCRAP_RATE_PER_KG;
  const age = Math.max(0, MAX_YEAR - opts.year);
  const ageFactor = Math.max(0.55, 1 - age * 0.018);
  const ageAdjustment = basePrice * (ageFactor - 1);

  const conditionFactor = CONDITION_FACTORS[opts.condition];
  const afterAge = basePrice * ageFactor;
  const conditionAdjustment = afterAge * (conditionFactor - 1);

  const estimate = basePrice * ageFactor * conditionFactor;
  const min = Math.round((estimate * 0.92) / 100) * 100;
  const max = Math.round((estimate * 1.08) / 100) * 100;

  return {
    weight,
    basePrice: Math.round(basePrice),
    ageFactor,
    ageAdjustment: Math.round(ageAdjustment),
    conditionFactor,
    conditionAdjustment: Math.round(conditionAdjustment),
    estimate: Math.round(estimate),
    min,
    max,
  };
}

export function formatINR(n: number): string {
  return "₹" + n.toLocaleString("en-IN");
}
