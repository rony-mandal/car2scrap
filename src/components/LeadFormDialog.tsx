import { useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import {
  CAR_BRANDS,
  CAR_MODELS,
  CONDITION_LABELS,
  Condition,
  FUEL_TYPES,
  YEAR_OPTIONS,
  calculatePrice,
  formatINR,
} from "@/lib/calculator";
import { leadSchema, type LeadInput } from "@/lib/validation";
import { supabase } from "@/integrations/supabase/client";

interface LeadFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prefill?: Partial<LeadInput>;
  source?: string;
}

const STEPS = ["Car details", "Your contact", "Review"] as const;

const emptyDefaults: Partial<LeadInput> = {
  name: "",
  phone: "",
  city: "",
  brand: "",
  car_model: "",
  fuel_type: undefined,
  year: undefined as unknown as number,
  condition: undefined as unknown as Condition,
  km_driven: undefined as unknown as number,
  notes: "",
};

export function LeadFormDialog({
  open,
  onOpenChange,
  prefill,
  source = "website",
}: LeadFormDialogProps) {
  const [step, setStep] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: { ...emptyDefaults, ...prefill } as LeadInput,
    mode: "onChange",
  });

  useEffect(() => {
    if (open) {
      setStep(0);
      setSubmitted(false);
      form.reset({ ...emptyDefaults, ...prefill } as LeadInput);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const values = form.watch();

  const filteredModels = useMemo(
    () => CAR_MODELS.filter((m) => m.brand === values.brand),
    [values.brand],
  );

  const breakdownReady =
    !!values.brand && !!values.car_model && !!values.condition && !!values.year;

  const breakdown = useMemo(
    () =>
      breakdownReady
        ? calculatePrice({
            brand: values.brand,
            modelId: values.car_model,
            year: Number(values.year),
            condition: values.condition,
          })
        : null,
    [breakdownReady, values.brand, values.car_model, values.year, values.condition],
  );

  async function handleSubmit(data: LeadInput) {
    setSubmitting(true);
    try {
      const brandLabel = CAR_BRANDS.find((b) => b.id === data.brand)?.label ?? data.brand;
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        phone: data.phone,
        city: data.city,
        car_category: brandLabel, // legacy column kept populated with brand label
        brand: brandLabel,
        car_model: CAR_MODELS.find((m) => m.id === data.car_model)?.label ?? data.car_model,
        fuel_type: data.fuel_type,
        year: data.year,
        condition: data.condition,
        km_driven: data.km_driven,
        notes: data.notes || null,
        estimated_price_min: breakdown?.min ?? null,
        estimated_price_max: breakdown?.max ?? null,
        source,
        status: "new",
      });
      if (error) throw error;

      supabase.functions
        .invoke("notify-admin-lead", {
          body: {
            ...data,
            brand: brandLabel,
            estimated_price_min: breakdown?.min,
            estimated_price_max: breakdown?.max,
            source,
          },
        })
        .catch(() => {
          /* silent */
        });

      setSubmitted(true);
      toast.success("Request received! Our team will call you shortly.");
    } catch (e) {
      console.error(e);
      toast.error("Could not submit. Please try again or call us.");
    } finally {
      setSubmitting(false);
    }
  }

  async function next() {
    let valid = false;
    if (step === 0) {
      valid = await form.trigger([
        "brand",
        "car_model",
        "fuel_type",
        "year",
        "condition",
        "km_driven",
      ]);
    } else if (step === 1) {
      valid = await form.trigger(["name", "phone", "city"]);
    }
    if (valid) setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[92vh] overflow-y-auto">
        {submitted ? (
          <div className="py-8 text-center space-y-4">
            <div className="mx-auto h-14 w-14 rounded-full bg-accent-green-soft flex items-center justify-center">
              <CheckCircle2 className="h-8 w-8 text-accent-green" />
            </div>
            <DialogTitle className="text-2xl">Request Received!</DialogTitle>
            {breakdown && (
              <p className="text-muted-foreground">
                Estimated quote:{" "}
                <strong className="text-primary">
                  {formatINR(breakdown.min)} – {formatINR(breakdown.max)}
                </strong>
              </p>
            )}
            <p className="text-sm text-muted-foreground">
              Our team will call you on <strong>{values.phone}</strong> shortly to confirm pickup.
            </p>
            <Button onClick={() => onOpenChange(false)} className="mt-4">
              Done
            </Button>
          </div>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle className="text-2xl">Get Your Best Scrap Price</DialogTitle>
              <DialogDescription>
                Step {step + 1} of {STEPS.length}: {STEPS[step]}
              </DialogDescription>
              <Progress value={((step + 1) / STEPS.length) * 100} className="mt-2 h-1.5" />
            </DialogHeader>

            <form
              onSubmit={form.handleSubmit(handleSubmit)}
              className="space-y-4 mt-2"
              noValidate
            >
              {step === 0 && (
                <div className="grid sm:grid-cols-2 gap-4 animate-fade-in">
                  <div>
                    <Label>Brand</Label>
                    <Select
                      value={values.brand || ""}
                      onValueChange={(v) => {
                        form.setValue("brand", v, { shouldValidate: true });
                        form.setValue("car_model", "", { shouldValidate: true });
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

                  <div>
                    <Label>Model</Label>
                    <Select
                      value={values.car_model || ""}
                      onValueChange={(v) => form.setValue("car_model", v, { shouldValidate: true })}
                      disabled={!values.brand}
                    >
                      <SelectTrigger className="mt-1.5">
                        <SelectValue placeholder={values.brand ? "Select model" : "Select brand first"} />
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

                  <div>
                    <Label>Manufacturing year</Label>
                    <Select
                      value={values.year ? String(values.year) : ""}
                      onValueChange={(v) =>
                        form.setValue("year", Number(v), { shouldValidate: true })
                      }
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

                  <div>
                    <Label>Condition</Label>
                    <Select
                      value={values.condition || ""}
                      onValueChange={(v) =>
                        form.setValue("condition", v as Condition, { shouldValidate: true })
                      }
                    >
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

                  <div>
                    <Label>Kilometers driven</Label>
                    <Input
                      type="number"
                      inputMode="numeric"
                      min={0}
                      value={values.km_driven ?? ""}
                      onChange={(e) =>
                        form.setValue(
                          "km_driven",
                          e.target.value === "" ? (undefined as unknown as number) : Number(e.target.value),
                          { shouldValidate: true },
                        )
                      }
                      placeholder="e.g. 85000"
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label>Fuel type</Label>
                    <Select
                      value={values.fuel_type || ""}
                      onValueChange={(v) =>
                        form.setValue("fuel_type", v as LeadInput["fuel_type"], {
                          shouldValidate: true,
                        })
                      }
                    >
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

                  <div className="sm:col-span-2">
                    <Label>
                      Additional notes{" "}
                      <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      value={values.notes ?? ""}
                      onChange={(e) =>
                        form.setValue("notes", e.target.value, { shouldValidate: true })
                      }
                      placeholder="Any damage, missing parts, accident history…"
                      rows={3}
                      maxLength={500}
                      className="mt-1.5 resize-none"
                    />
                  </div>

                  {breakdown && (
                    <div className="sm:col-span-2 rounded-lg bg-gradient-soft border p-4 text-center">
                      <p className="text-xs text-muted-foreground uppercase tracking-wide">
                        Estimated price
                      </p>
                      <p className="text-2xl font-bold text-primary mt-1 font-[Poppins]">
                        {formatINR(breakdown.min)} – {formatINR(breakdown.max)}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {step === 1 && (
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label htmlFor="name">Full name</Label>
                    <Input
                      id="name"
                      {...form.register("name")}
                      placeholder="Rahul Sharma"
                      className="mt-1.5"
                    />
                    {form.formState.errors.name && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.name.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="phone">Mobile number</Label>
                    <div className="mt-1.5 flex items-stretch overflow-hidden rounded-md border">
                      <span className="px-3 flex items-center bg-muted text-muted-foreground text-sm border-r">
                        +91
                      </span>
                      <Input
                        id="phone"
                        type="tel"
                        inputMode="numeric"
                        maxLength={10}
                        {...form.register("phone")}
                        placeholder="98XXXXXXXX"
                        className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                      />
                    </div>
                    {form.formState.errors.phone && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.phone.message}
                      </p>
                    )}
                  </div>
                  <div>
                    <Label htmlFor="city">City</Label>
                    <Input
                      id="city"
                      {...form.register("city")}
                      placeholder="Delhi"
                      className="mt-1.5"
                    />
                    {form.formState.errors.city && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>
                </div>
              )}

              {step === 2 && (
                <div className="space-y-4 animate-fade-in">
                  <div className="rounded-lg border p-4 space-y-2 text-sm">
                    <Row label="Name" value={values.name} />
                    <Row label="Phone" value={`+91 ${values.phone}`} />
                    <Row label="City" value={values.city} />
                    <Row
                      label="Car"
                      value={`${
                        CAR_BRANDS.find((b) => b.id === values.brand)?.label ?? "—"
                      } ${CAR_MODELS.find((m) => m.id === values.car_model)?.label ?? ""}`.trim()}
                    />
                    <Row label="Year" value={String(values.year ?? "—")} />
                    <Row
                      label="Fuel"
                      value={FUEL_TYPES.find((f) => f.id === values.fuel_type)?.label ?? "—"}
                    />
                    <Row label="KM driven" value={`${values.km_driven ?? "—"} km`} />
                    <Row
                      label="Condition"
                      value={values.condition ? CONDITION_LABELS[values.condition] : "—"}
                    />
                    {values.notes && <Row label="Notes" value={values.notes} />}
                  </div>

                  {breakdown && (
                    <div className="rounded-lg bg-gradient-cta text-accent-green-foreground p-5 text-center">
                      <p className="text-xs uppercase tracking-wide opacity-90">
                        Your estimated quote
                      </p>
                      <p className="text-3xl font-bold mt-1 font-[Poppins]">
                        {formatINR(breakdown.min)} – {formatINR(breakdown.max)}
                      </p>
                      <p className="text-xs mt-2 opacity-90">
                        Final price confirmed after physical inspection
                      </p>
                    </div>
                  )}
                </div>
              )}

              <div className="flex gap-2 pt-2">
                {step > 0 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setStep((s) => s - 1)}
                    className="flex-1"
                  >
                    Back
                  </Button>
                )}
                {step < STEPS.length - 1 ? (
                  <Button type="button" variant="cta" onClick={next} className="flex-1">
                    Continue
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    variant="cta"
                    disabled={submitting}
                    className="flex-1"
                  >
                    {submitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Book Free Pickup
                  </Button>
                )}
              </div>
            </form>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-right">{value}</span>
    </div>
  );
}
