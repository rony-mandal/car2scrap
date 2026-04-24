# Restructure price calculator to brand → model dropdowns

Replace the current "category + slider" calculator with a structured dropdown-driven form matching your reference image.

## New form fields (all required)

1. **Brand** — dropdown (~20 brands)
2. **Model** — dropdown, filtered by selected brand
3. **Fuel type** — dropdown: Petrol, Diesel, CNG, LPG, Electric
4. **Manufacturing year** — dropdown, current year → 1995 (newest first)
5. **Condition** — dropdown: Excellent, Good, Poor (kept as buttons or moved to dropdown for consistency — will use dropdown to match the reference)
6. **Kilometers driven** — number input
7. **Additional notes** — textarea (optional)

The **"Calculate Price" CTA stays disabled** until brand, model, fuel type, year, condition, and km are filled. Pricing logic stays as today (weight × ₹38/kg × age factor × condition factor) — fuel and km are collected for the lead but don't change the estimate, per your decision.

## Brand & model catalog

Restructure `src/lib/calculator.ts` around brands instead of body-type categories. ~20 brands with their popular India models:

```text
Maruti Suzuki  → Alto, WagonR, Swift, Dzire, Baleno, Brezza, Ertiga, Ciaz, Celerio, S-Presso, Eeco, Omni, 800
Hyundai        → Santro, i10, Grand i10, i20, Verna, Creta, Venue, Xcent, Accent, Eon
Tata           → Indica, Indigo, Tiago, Tigor, Nexon, Punch, Harrier, Safari, Sumo, Zest
Mahindra       → Bolero, Scorpio, XUV300, XUV500, XUV700, Thar, KUV100, TUV300, Marazzo, Verito
Honda          → City, Amaze, Civic, Jazz, WR-V, BR-V, Brio, Mobilio, CR-V
Toyota         → Innova, Etios, Liva, Corolla, Fortuner, Yaris, Glanza, Urban Cruiser, Qualis
Renault        → Kwid, Duster, Triber, Kiger, Lodgy, Pulse, Scala
Ford           → EcoSport, Figo, Aspire, Endeavour, Ikon, Fiesta
Nissan         → Micra, Sunny, Magnite, Terrano, Kicks
Chevrolet      → Beat, Spark, Sail, Cruze, Tavera, Aveo
Skoda          → Rapid, Octavia, Fabia, Superb, Kushaq
Volkswagen     → Polo, Vento, Ameo, Jetta, Taigun
Kia            → Seltos, Sonet, Carens, Carnival
MG             → Hector, Astor, ZS EV
Datsun         → Go, Go+, Redi-Go
Fiat           → Punto, Linea, Palio
Mitsubishi     → Lancer, Pajero, Outlander
Jeep           → Compass, Meridian, Wrangler
BMW            → 3 Series, 5 Series, X1, X3
Mercedes-Benz  → C-Class, E-Class, GLA, GLC
Other(not listed)
```

Each model keeps its kerb weight (existing weights reused where possible; sensible defaults for the rest based on body type). `Other` option added at the end of brand and model lists for fallback.

## Pricing (unchanged behavior, confirmed)

```text
estimate = weight × ₹38/kg × ageFactor × conditionFactor
ageFactor       = max(0.55, 1 − years_old × 0.018)
conditionFactor = Excellent 1.10 / Good 1.00 / Poor 0.85
range           = ±8% around estimate, rounded to nearest ₹100
```

Fuel type, km, and notes are stored on the lead but don't alter the displayed estimate.

## Files touched

- `**src/lib/calculator.ts**` — replace `CAR_CATEGORIES` with `CAR_BRANDS`, expand `CAR_MODELS` with `brand` field + weights, add `FUEL_TYPES` constant. Keep `calculatePrice()` signature compatible (accepts `modelId` + `year` + `condition`).
- `**src/components/PriceCalculator.tsx**` — full rewrite of the form: 6 dropdowns + km input + notes textarea, two-column grid on desktop matching the reference layout. Year slider removed. Estimate panel and breakdown drawer kept. CTA disabled until required fields are filled.
- `**src/components/LeadFormDialog.tsx**` — Step 1 ("Car details") updated to the same dropdown structure so prefill from the calculator flows through cleanly. Adds fuel/km/notes capture.
- `**src/lib/validation.ts**` — extend `leadSchema`: add `brand` (required), make `car_model` required, add `fuel_type` enum, add `km_driven` number (≥0), add `notes` (optional, max 500). `car_category` removed.
- `**src/pages/Calculator.tsx**` — minor: update the "How we calculate" sidebar copy to mention brand/model selection.
- **Database** — add nullable columns to `leads`: `brand text`, `fuel_type text`, `km_driven integer`, `notes text`. Existing rows stay valid; new submissions populate them.

## Layout

Two-column grid on desktop (mirrors your reference), single column on mobile:

```text
┌────────────── Tell us about your car ──────────────┐
│ [Brand ▾]              [Model ▾]                   │
│ [Year ▾]               [Condition ▾]               │
│ [Kilometers driven]    [Fuel type ▾]               │
│ [Additional notes ──────────────────────────────]  │
│                                                    │
│ ┌──────── Estimated scrap value ────────┐          │
│ │           ₹ XX,XXX – ₹ XX,XXX         │          │
│ └───────────────────────────────────────┘          │
│ [ Book Free Pickup at This Price ]                 │
└────────────────────────────────────────────────────┘
```