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
import { Progress } from "@/components/ui/progress";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { toast } from "sonner";
import { CheckCircle2, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  CAR_CATEGORIES,
  CAR_MODELS,
  CONDITION_LABELS,
  Condition,
  MAX_YEAR,
  MIN_YEAR,
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
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      car_category: "sedan",
      car_model: "",
      year: MAX_YEAR - 8,
      condition: "good",
      ...prefill,
    },
    mode: "onChange",
  });

  // Reset state when dialog opens
  useEffect(() => {
    if (open) {
      setStep(0);
      setSubmitted(false);
      form.reset({
        name: "",
        phone: "",
        city: "",
        car_category: "sedan",
        car_model: "",
        year: MAX_YEAR - 8,
        condition: "good",
        ...prefill,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const values = form.watch();

  const filteredModels = useMemo(
    () => CAR_MODELS.filter((m) => m.category === values.car_category),
    [values.car_category],
  );

  const breakdown = useMemo(
    () =>
      calculatePrice({
        category: values.car_category,
        modelId: values.car_model || undefined,
        year: Number(values.year),
        condition: values.condition,
      }),
    [values.car_category, values.car_model, values.year, values.condition],
  );

  async function handleSubmit(data: LeadInput) {
    setSubmitting(true);
    try {
      const { error } = await supabase.from("leads").insert({
        name: data.name,
        phone: data.phone,
        city: data.city,
        car_category: data.car_category,
        car_model: data.car_model || null,
        year: data.year,
        condition: data.condition,
        estimated_price_min: breakdown.min,
        estimated_price_max: breakdown.max,
        source,
        status: "new",
      });
      if (error) throw error;

      // Fire and forget admin notification
      supabase.functions
        .invoke("notify-admin-lead", {
          body: {
            ...data,
            estimated_price_min: breakdown.min,
            estimated_price_max: breakdown.max,
            source,
          },
        })
        .catch(() => {/* silent */});

      setSubmitted(true);
      toast.success("Request received! Our team will call you within 30 minutes.");
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
      valid = await form.trigger(["car_category", "year", "condition"]);
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
            <p className="text-muted-foreground">
              Estimated quote: <strong className="text-primary">{formatINR(breakdown.min)} – {formatINR(breakdown.max)}</strong>
            </p>
            <p className="text-sm text-muted-foreground">
              Our team will call you on <strong>{values.phone}</strong> within 30 minutes
              to confirm pickup.
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
                <div className="space-y-4 animate-fade-in">
                  <div>
                    <Label>Car type</Label>
                    <Select
                      value={values.car_category}
                      onValueChange={(v) => {
                        form.setValue("car_category", v);
                        form.setValue("car_model", "");
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
                    <Label>
                      Model <span className="text-muted-foreground text-xs font-normal">(optional, more accurate)</span>
                    </Label>
                    <Select
                      value={values.car_model || "_none"}
                      onValueChange={(v) =>
                        form.setValue("car_model", v === "_none" ? "" : v)
                      }
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
                      <Label>Manufacturing year</Label>
                      <span className="text-sm font-semibold text-primary">
                        {values.year}
                      </span>
                    </div>
                    <Slider
                      value={[values.year]}
                      min={MIN_YEAR}
                      max={MAX_YEAR}
                      step={1}
                      onValueChange={([v]) => form.setValue("year", v)}
                      className="mt-3"
                    />
                  </div>

                  <div>
                    <Label>Condition</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => form.setValue("condition", c)}
                          className={cn(
                            "py-2.5 rounded-lg border text-sm font-medium transition-base",
                            values.condition === c
                              ? "border-accent-green bg-accent-green-soft text-accent-green"
                              : "border-border hover:border-primary/30",
                          )}
                        >
                          {CONDITION_LABELS[c]}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-lg bg-gradient-soft border p-4 text-center">
                    <p className="text-xs text-muted-foreground uppercase tracking-wide">
                      Estimated price
                    </p>
                    <p className="text-2xl font-bold text-primary mt-1 font-[Poppins]">
                      {formatINR(breakdown.min)} – {formatINR(breakdown.max)}
                    </p>
                  </div>
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
                      value={
                        (values.car_model
                          ? CAR_MODELS.find((m) => m.id === values.car_model)?.label
                          : CAR_CATEGORIES.find((c) => c.id === values.car_category)?.label) ?? "—"
                      }
                    />
                    <Row label="Year" value={String(values.year)} />
                    <Row label="Condition" value={CONDITION_LABELS[values.condition]} />
                  </div>

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
                  <Button
                    type="button"
                    variant="cta"
                    onClick={next}
                    className="flex-1"
                  >
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
