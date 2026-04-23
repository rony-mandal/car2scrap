import { useMemo, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Sparkles, Info, IndianRupee } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAR_CATEGORIES,
  CAR_MODELS,
  CONDITION_LABELS,
  Condition,
  MAX_YEAR,
  MIN_YEAR,
  SCRAP_RATE_PER_KG,
  calculatePrice,
  formatINR,
} from "@/lib/calculator";
import { LeadFormDialog } from "@/components/LeadFormDialog";

interface PriceCalculatorProps {
  variant?: "card" | "embedded";
  source?: string;
}

export function PriceCalculator({ variant = "card", source = "calculator" }: PriceCalculatorProps) {
  const [category, setCategory] = useState("sedan");
  const [modelId, setModelId] = useState<string>("");
  const [year, setYear] = useState(MAX_YEAR - 8);
  const [condition, setCondition] = useState<Condition>("good");
  const [open, setOpen] = useState(false);

  const filteredModels = useMemo(
    () => CAR_MODELS.filter((m) => m.category === category),
    [category],
  );

  const result = useMemo(
    () => calculatePrice({ category, modelId: modelId || undefined, year, condition }),
    [category, modelId, year, condition],
  );

  const Wrapper = variant === "card" ? Card : "div";

  return (
    <>
      <Wrapper
        className={cn(
          variant === "card" &&
            "p-6 md:p-7 shadow-elegant border-2 bg-card",
        )}
      >
        <div className="flex items-center gap-2 mb-5">
          <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-blue-soft text-accent-blue">
            <Sparkles className="h-5 w-5" />
          </span>
          <div>
            <h3 className="font-bold text-lg font-[Poppins]">Instant Price Calculator</h3>
            <p className="text-xs text-muted-foreground">Get an estimate in seconds</p>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <Label className="text-sm">Car type</Label>
            <Select
              value={category}
              onValueChange={(v) => {
                setCategory(v);
                setModelId("");
              }}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {CAR_CATEGORIES.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label className="text-sm">
              Model <span className="text-muted-foreground text-xs font-normal">(optional)</span>
            </Label>
            <Select
              value={modelId || "_none"}
              onValueChange={(v) => setModelId(v === "_none" ? "" : v)}
            >
              <SelectTrigger className="mt-1.5">
                <SelectValue placeholder="Choose your model" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="_none">Skip — use category average</SelectItem>
                {filteredModels.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <Label className="text-sm">Manufacturing year</Label>
              <span className="text-sm font-semibold text-primary">{year}</span>
            </div>
            <Slider
              value={[year]}
              min={MIN_YEAR}
              max={MAX_YEAR}
              step={1}
              onValueChange={([v]) => setYear(v)}
              className="mt-3"
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1.5">
              <span>{MIN_YEAR}</span>
              <span>{MAX_YEAR}</span>
            </div>
          </div>

          <div>
            <Label className="text-sm">Condition</Label>
            <div className="grid grid-cols-3 gap-2 mt-1.5">
              {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setCondition(c)}
                  className={cn(
                    "py-2.5 rounded-lg border text-sm font-medium transition-base",
                    condition === c
                      ? "border-accent-green bg-accent-green-soft text-accent-green"
                      : "border-border hover:border-primary/30",
                  )}
                >
                  {CONDITION_LABELS[c]}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 rounded-xl bg-gradient-hero text-primary-foreground p-5 text-center">
          <p className="text-xs uppercase tracking-wide opacity-80">
            Estimated scrap value
          </p>
          <p className="mt-1 text-3xl md:text-4xl font-bold font-[Poppins] flex items-center justify-center gap-1">
            <IndianRupee className="h-6 w-6" />
            {result.min.toLocaleString("en-IN")} – {result.max.toLocaleString("en-IN")}
          </p>
          <p className="text-xs opacity-80 mt-2 flex items-center justify-center gap-1">
            <Info className="h-3 w-3" />
            Final price may vary after physical inspection
          </p>
        </div>

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
              <span>Age adjustment ({MAX_YEAR - year} yrs)</span>
              <span className={result.ageAdjustment < 0 ? "text-destructive" : ""}>
                {result.ageAdjustment >= 0 ? "+" : ""}{formatINR(result.ageAdjustment)}
              </span>
            </div>
            <div className="flex justify-between">
              <span>Condition adjustment</span>
              <span className={result.conditionAdjustment < 0 ? "text-destructive" : "text-accent-green"}>
                {result.conditionAdjustment >= 0 ? "+" : ""}{formatINR(result.conditionAdjustment)}
              </span>
            </div>
          </div>
        </details>

        <Button
          variant="cta"
          size="lg"
          className="w-full mt-4"
          onClick={() => setOpen(true)}
        >
          Book Free Pickup at This Price
        </Button>
      </Wrapper>

      <LeadFormDialog
        open={open}
        onOpenChange={setOpen}
        source={source}
        prefill={{
          car_category: category,
          car_model: modelId,
          year,
          condition,
        }}
      />
    </>
  );
}
