import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Phone, MessageCircle, MapPin, Mail, Clock, CheckCircle2, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { BUSINESS, whatsappLink } from "@/lib/business";
import { leadSchema, type LeadInput } from "@/lib/validation";
import {
  CAR_BRANDS,
  CAR_MODELS,
  CONDITION_LABELS,
  Condition,
  FUEL_TYPES,
  YEAR_OPTIONS,
} from "@/lib/calculator";
import { supabase } from "@/integrations/supabase/client";

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    document.title = "Contact Us | car2scrap";
  }, []);

  const form = useForm<LeadInput>({
    resolver: zodResolver(leadSchema),
    defaultValues: {
      name: "",
      phone: "",
      city: "",
      brand: "",
      car_model: "",
      fuel_type: undefined as unknown as LeadInput["fuel_type"],
      year: undefined as unknown as number,
      condition: undefined as unknown as Condition,
      km_driven: undefined as unknown as number,
      notes: "",
    },
    mode: "onTouched",
  });

  const values = form.watch();
  const filteredModels = CAR_MODELS.filter((m) => m.brand === values.brand);

  async function onSubmit(data: LeadInput) {
    const brandLabel = CAR_BRANDS.find((b) => b.id === data.brand)?.label ?? data.brand;
    const modelLabel = CAR_MODELS.find((m) => m.id === data.car_model)?.label ?? data.car_model;
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      city: data.city,
      car_category: brandLabel,
      brand: brandLabel,
      car_model: modelLabel,
      fuel_type: data.fuel_type,
      year: data.year,
      condition: data.condition,
      km_driven: data.km_driven,
      notes: data.notes || null,
      source: "contact-page",
      status: "new",
    });
    if (error) {
      toast.error("Could not submit. Please try again or call us.");
      return;
    }
    supabase.functions
      .invoke("notify-admin-lead", {
        body: { ...data, brand: brandLabel, source: "contact-page" },
      })
      .catch(() => {});
    setSubmitted(true);
    toast.success("Request received! We'll contact you shortly.");
  }

  return (
    <div>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container py-14 md:py-20 text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-white/10 border border-white/15 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            Contact
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 font-[Poppins]">
            Talk to a real human — <span className="text-accent-green">no bots</span>
          </h1>
          <p className="text-primary-foreground/80 mt-4">
            Call, WhatsApp, or Fill the Form.
          </p>
        </div>
      </section>

      <section className="container py-14 md:py-20 grid lg:grid-cols-5 gap-8">
        <div className="lg:col-span-2 space-y-4">
          <a
            href={`tel:${BUSINESS.phone}`}
            className="block rounded-xl border bg-card p-5 shadow-card hover:shadow-elegant transition-base"
          >
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-lg bg-accent-blue-soft text-accent-blue flex items-center justify-center">
                <Phone className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Call us</p>
                <p className="font-bold text-lg">{BUSINESS.phoneDisplay}</p>
              </div>
            </div>
          </a>

          <a
            href={whatsappLink()}
            target="_blank"
            rel="noopener noreferrer"
            className="block rounded-xl border bg-card p-5 shadow-card hover:shadow-elegant transition-base"
          >
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-lg bg-[hsl(142_70%_45%)]/15 text-[hsl(142_70%_35%)] flex items-center justify-center">
                <MessageCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">WhatsApp</p>
                <p className="font-bold text-lg">Chat with us</p>
              </div>
            </div>
          </a>

          <a
            href={`mailto:${BUSINESS.email}`}
            className="block rounded-xl border bg-card p-5 shadow-card hover:shadow-elegant transition-base"
          >
            <div className="flex items-center gap-3">
              <span className="h-11 w-11 rounded-lg bg-accent-green-soft text-accent-green flex items-center justify-center">
                <Mail className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Email</p>
                <p className="font-semibold break-all">{BUSINESS.email}</p>
              </div>
            </div>
          </a>

          <div className="rounded-xl border bg-card p-5 shadow-card">
            <div className="flex items-start gap-3">
              <span className="h-11 w-11 rounded-lg bg-muted flex items-center justify-center shrink-0">
                <MapPin className="h-5 w-5" />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-muted-foreground">Office</p>
                <p className="font-medium text-sm leading-relaxed mt-0.5">{BUSINESS.address}</p>
              </div>
            </div>
            <div className="flex items-center gap-2 mt-4 text-xs text-muted-foreground">
              <Clock className="h-3.5 w-3.5" />
              Mon – Sat, 9 AM – 8 PM
            </div>
          </div>

          <div className="rounded-xl border overflow-hidden shadow-card aspect-[4/3]">
            <iframe
              title="car2scrap location"
              src={BUSINESS.mapsEmbed}
              className="w-full h-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </div>

        <div className="lg:col-span-3">
          <Card className="p-6 md:p-8 shadow-elegant">
            {submitted ? (
              <div className="py-10 text-center space-y-4">
                <div className="mx-auto h-14 w-14 rounded-full bg-accent-green-soft flex items-center justify-center">
                  <CheckCircle2 className="h-8 w-8 text-accent-green" />
                </div>
                <h2 className="text-2xl font-bold font-[Poppins]">Request Received!</h2>
                <p className="text-muted-foreground">
                  Our team will call you on <strong>+91 {form.getValues("phone")}</strong>{" "}
                  shortly.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit another
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1 font-[Poppins]">Request a callback</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill in the details and we'll reach out to you.
                </p>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4" noValidate>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="c-name">Full name</Label>
                      <Input id="c-name" {...form.register("name")} className="mt-1.5" />
                      {form.formState.errors.name && (
                        <p className="text-xs text-destructive mt-1">
                          {form.formState.errors.name.message}
                        </p>
                      )}
                    </div>
                    <div>
                      <Label htmlFor="c-phone">Mobile number</Label>
                      <div className="mt-1.5 flex items-stretch overflow-hidden rounded-md border">
                        <span className="px-3 flex items-center bg-muted text-muted-foreground text-sm border-r">
                          +91
                        </span>
                        <Input
                          id="c-phone"
                          inputMode="numeric"
                          maxLength={10}
                          {...form.register("phone")}
                          className="border-0 rounded-none focus-visible:ring-0 focus-visible:ring-offset-0"
                        />
                      </div>
                      {form.formState.errors.phone && (
                        <p className="text-xs text-destructive mt-1">
                          {form.formState.errors.phone.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="c-city">City</Label>
                    <Input id="c-city" {...form.register("city")} className="mt-1.5" />
                    {form.formState.errors.city && (
                      <p className="text-xs text-destructive mt-1">
                        {form.formState.errors.city.message}
                      </p>
                    )}
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
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
                        onValueChange={(v) =>
                          form.setValue("car_model", v, { shouldValidate: true })
                        }
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
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
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
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="c-km">Kilometers driven</Label>
                      <Input
                        id="c-km"
                        type="number"
                        inputMode="numeric"
                        min={0}
                        value={values.km_driven ?? ""}
                        onChange={(e) =>
                          form.setValue(
                            "km_driven",
                            e.target.value === ""
                              ? (undefined as unknown as number)
                              : Number(e.target.value),
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
                  </div>

                  <div>
                    <Label htmlFor="c-notes">
                      Additional notes{" "}
                      <span className="text-muted-foreground text-xs font-normal">(optional)</span>
                    </Label>
                    <Textarea
                      id="c-notes"
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

                  <Button
                    type="submit"
                    variant="cta"
                    size="lg"
                    className="w-full"
                    disabled={form.formState.isSubmitting}
                  >
                    {form.formState.isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                    Request Callback
                  </Button>
                  <p className="text-xs text-muted-foreground text-center">
                    By submitting you agree to be contacted regarding your scrap car quote.
                  </p>
                </form>
              </>
            )}
          </Card>
        </div>
      </section>
    </div>
  );
}
