// Calculator data + pricing logic for car2scrap

export type Condition = "excellent" | "good" | "poor";

export interface CarCategory {
  id: string;
  label: string;
  weight: number; // kerb weight in kg
}

export interface CarModel {
  id: string;
  label: string;
  category: string;
  weight: number;
}

export const CAR_CATEGORIES: CarCategory[] = [
  { id: "hatchback", label: "Hatchback", weight: 900 },
  { id: "sedan", label: "Sedan", weight: 1200 },
  { id: "suv", label: "SUV", weight: 1600 },
  { id: "pickup", label: "Pickup / Truck", weight: 1800 },
];

export const CAR_MODELS: CarModel[] = [
  // Hatchback
  { id: "alto", label: "Maruti Alto", category: "hatchback", weight: 750 },
  { id: "wagonr", label: "Maruti WagonR", category: "hatchback", weight: 880 },
  { id: "swift", label: "Maruti Swift", category: "hatchback", weight: 920 },
  { id: "baleno", label: "Maruti Baleno", category: "hatchback", weight: 935 },
  { id: "i10", label: "Hyundai i10 / Grand i10", category: "hatchback", weight: 920 },
  { id: "i20", label: "Hyundai i20", category: "hatchback", weight: 1020 },
  { id: "kwid", label: "Renault Kwid", category: "hatchback", weight: 800 },
  { id: "tiago", label: "Tata Tiago", category: "hatchback", weight: 1012 },
  { id: "santro", label: "Hyundai Santro", category: "hatchback", weight: 870 },
  // Sedan
  { id: "dzire", label: "Maruti Dzire", category: "sedan", weight: 1010 },
  { id: "amaze", label: "Honda Amaze", category: "sedan", weight: 990 },
  { id: "city", label: "Honda City", category: "sedan", weight: 1153 },
  { id: "verna", label: "Hyundai Verna", category: "sedan", weight: 1180 },
  { id: "etios", label: "Toyota Etios", category: "sedan", weight: 1045 },
  { id: "indigo", label: "Tata Indigo", category: "sedan", weight: 1100 },
  // SUV
  { id: "nexon", label: "Tata Nexon", category: "suv", weight: 1280 },
  { id: "creta", label: "Hyundai Creta", category: "suv", weight: 1340 },
  { id: "brezza", label: "Maruti Brezza", category: "suv", weight: 1195 },
  { id: "ecosport", label: "Ford EcoSport", category: "suv", weight: 1325 },
  { id: "scorpio", label: "Mahindra Scorpio", category: "suv", weight: 2055 },
  { id: "xuv500", label: "Mahindra XUV500", category: "suv", weight: 1925 },
  { id: "innova", label: "Toyota Innova", category: "suv", weight: 1755 },
  { id: "bolero", label: "Mahindra Bolero", category: "suv", weight: 1615 },
  { id: "duster", label: "Renault Duster", category: "suv", weight: 1280 },
  // Pickup
  { id: "pickup-generic", label: "Pickup / Mini Truck", category: "pickup", weight: 1800 },
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
  category: string;
  modelId?: string;
  year: number;
  condition: Condition;
}): PriceBreakdown {
  const cat = CAR_CATEGORIES.find((c) => c.id === opts.category) ?? CAR_CATEGORIES[1];
  const model = opts.modelId ? CAR_MODELS.find((m) => m.id === opts.modelId) : undefined;
  const weight = model?.weight ?? cat.weight;

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
