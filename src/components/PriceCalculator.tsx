import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Sparkles, Info, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAR_BRANDS,
  CAR_MODELS,
  CONDITION_LABELS,
  Condition,
  FUEL_TYPES,
  FuelType,
  YEAR_OPTIONS,
  SCRAP_RATE_PER_KG,
  MAX_YEAR,
  calculatePrice,
  formatINR,
} from "@/lib/calculator";
import { LeadFormDialog } from "@/components/LeadFormDialog";

interface PriceCalculatorProps {
  variant?: "card" | "embedded";
  source?: string;
}

export function PriceCalculator({ variant = "card", source = "calculator" }: PriceCalculatorProps) {
  const [brand, setBrand] = useState<string>("");
  const [modelId, setModelId] = useState<string>("");
  const [year, setYear] = useState<number | "">("");
  const [condition, setCondition] = useState<Condition | "">("");
  const [km, setKm] = useState<string>("");
  const [fuel, setFuel] = useState<FuelType | "">("");
  const [notes, setNotes] = useState("");
  const [open, setOpen] = useState(false);

  const filteredModels = useMemo(
    () => CAR_MODELS.filter((m) => m.brand === brand),
    [brand],
  );

  const allRequiredFilled =
    !!brand && !!modelId && !!fuel && year !== "" && !!condition && km !== "" && Number(km) >= 0;

  const result = useMemo(
    () =>
      allRequiredFilled
        ? calculatePrice({
            brand,
            modelId,
            year: Number(year),
            condition: condition as Condition,
          })
        : null,
    [allRequiredFilled, brand, modelId, year, condition],
  );

  const Wrapper = variant === "card" ? Card : "div";

  return (
    <>
      <Wrapper
        className={cn(
          variant === "card" && "p-6 md:p-7 shadow-elegant border-2 bg-card",
        )}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue-soft text-accent-blue">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-lg font-[Poppins]">Tell us about your car</h3>
            <p className="text-xs text-muted-foreground">All fields required for accurate estimate</p>
          </div>
        </div>

        <div className="grid sm:grid-cols-2 gap-4">
          {/* Brand */}
          <div>
            <Label className="text-sm">Brand</Label>
            <Select
              value={brand}
              onValueChange={(v) => {
                setBrand(v);
                setModelId("");
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select brand" />
              </SelectTrigger>
              <SelectContent>
                {CAR_BRANDS.map((b) => (
                  <SelectItem key={b.id} value={b.id}>
                    {b.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Model */}
          <div>
            <Label className="text-sm">Model</Label>
            <Select value={modelId} onValueChange={setModelId} disabled={!brand}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder={brand ? "Select model" : "Select brand first"} />
              </SelectTrigger>
              <SelectContent>
                {filteredModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Year */}
          <div>
            <Label className="text-sm">Manufacturing year</Label>
            <Select
              value={year === "" ? "" : String(year)}
              onValueChange={(v) => setYear(Number(v))}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select year" />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {YEAR_OPTIONS.map((y) => (
                  <SelectItem key={y} value={String(y)}>
                    {y}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Condition */}
          <div>
            <Label className="text-sm">Condition</Label>
            <Select value={condition} onValueChange={(v) => setCondition(v as Condition)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select condition" />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                  <SelectItem key={c} value={c}>
                    {CONDITION_LABELS[c]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Kilometers driven */}
          <div>
            <Label className="text-sm">Kilometers driven</Label>
            <Input
              type="number"
              inputMode="numeric"
              min={0}
              value={km}
              onChange={(e) => setKm(e.target.value)}
              placeholder="e.g. 85000"
              className="mt-1.5"
            />
          </div>

          {/* Fuel type */}
          <div>
            <Label className="text-sm">Fuel type</Label>
            <Select value={fuel} onValueChange={(v) => setFuel(v as FuelType)}>
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Select fuel type" />
              </SelectTrigger>
              <SelectContent>
                {FUEL_TYPES.map((f) => (
                  <SelectItem key={f.id} value={f.id}>
                    {f.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Notes */}
          <div className="sm:col-span-2">
            <Label className="text-sm">
              Additional notes <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <Textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Any damage, missing parts, accident history…"
              rows={3}
              maxLength={500}
              className="mt-1.5 resize-none"
            />
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gradient-hero text-primary-foreground p-5 text-center">
          <p className="text-xs uppercase tracking-wide opacity-80">Estimated scrap value</p>
          {result ? (
            <>
              <p className="mt-1 text-3xl md:text-4xl font-bold font-[Poppins] flex items-center justify-center gap-1">
                <IndianRupee className="h-6 w-6" />
                {result.min.toLocaleString("en-IN")} – {result.max.toLocaleString("en-IN")}
              </p>
              <p className="text-xs opacity-80 mt-2 flex items-center justify-center gap-1">
                <Info className="h-3 w-3" />
                Final price may vary after physical inspection
              </p>
            </>
          ) : (
            <p className="mt-2 text-sm opacity-90">
              Fill all fields above to see your estimate
            </p>
          )}
        </div>

        {result && (
          <details className="mt-4 rounded-lg border bg-muted/30 px-4 py-3 text-sm">
            <summary className="cursor-pointer font-medium">Price breakdown</summary>
            <div className="mt-3 space-y-1.5 text-muted-foreground">
              <div className="flex justify-between">
                <span>Vehicle weight</span>
                <span>{result.weight} kg</span>
              </div>
              <div className="flex justify-between">
                <span>Metal value @ ₹{SCRAP_RATE_PER_KG}/kg</span>
                <span>{formatINR(result.basePrice)}</span>
              </div>
              <div className="flex justify-between">
                <span>Age adjustment ({MAX_YEAR - Number(year)} yrs)</span>
                <span className={result.ageAdjustment < 0 ? "text-destructive" : ""}>
                  {result.ageAdjustment >= 0 ? "+" : ""}
                  {formatINR(result.ageAdjustment)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Condition adjustment</span>
                <span className={result.conditionAdjustment < 0 ? "text-destructive" : "text-accent-green"}>
                  {result.conditionAdjustment >= 0 ? "+" : ""}
                  {formatINR(result.conditionAdjustment)}
                </span>
              </div>
            </div>
          </details>
        )}

        <Button
          variant="cta"
          size="lg"
          className="w-full mt-4"
          disabled={!allRequiredFilled}
          onClick={() => setOpen(true)}
        >
          {allRequiredFilled ? "Book Free Pickup at This Price" : "Fill all fields to continue"}
        </Button>
      </Wrapper>

      <LeadFormDialog
        open={open}
        onOpenChange={setOpen}
        source={source}
        prefill={{
          brand,
          car_model: modelId,
          fuel_type: (fuel || undefined) as FuelType | undefined,
          year: year === "" ? undefined : Number(year),
          condition: (condition || undefined) as Condition | undefined,
          km_driven: km === "" ? undefined : Number(km),
          notes,
        }}
      />
    </>
  );
}
