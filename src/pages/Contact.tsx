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
  CAR_CATEGORIES,
  CONDITION_LABELS,
  Condition,
  MAX_YEAR,
  MIN_YEAR,
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
      car_category: "sedan",
      car_model: "",
      year: MAX_YEAR - 8,
      condition: "good",
    },
    mode: "onTouched",
  });

  async function onSubmit(data: LeadInput) {
    const { error } = await supabase.from("leads").insert({
      name: data.name,
      phone: data.phone,
      city: data.city,
      car_category: data.car_category,
      car_model: data.car_model || null,
      year: data.year,
      condition: data.condition,
      source: "contact-page",
      status: "new",
    });
    if (error) {
      toast.error("Could not submit. Please try again or call us.");
      return;
    }
    supabase.functions
      .invoke("notify-admin-lead", { body: { ...data, source: "contact-page" } })
      .catch(() => {});
    setSubmitted(true);
    toast.success("Request received! We'll call you within 30 minutes.");
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
            Call, WhatsApp, or fill the form. We respond within 30 minutes during business hours.
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
                  within 30 minutes.
                </p>
                <Button variant="outline" onClick={() => setSubmitted(false)}>
                  Submit another
                </Button>
              </div>
            ) : (
              <>
                <h2 className="text-2xl font-bold mb-1 font-[Poppins]">Request a callback</h2>
                <p className="text-sm text-muted-foreground mb-6">
                  Fill in the details and we'll reach out within 30 minutes.
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

                  <div className="grid sm:grid-cols-3 gap-4">
                    <div>
                      <Label>Car type</Label>
                      <Select
                        value={form.watch("car_category")}
                        onValueChange={(v) => form.setValue("car_category", v)}
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
                      <Label htmlFor="c-model">Model (optional)</Label>
                      <Input
                        id="c-model"
                        {...form.register("car_model")}
                        placeholder="e.g. Swift"
                        className="mt-1.5"
                      />
                    </div>
                    <div>
                      <Label htmlFor="c-year">Year</Label>
                      <Input
                        id="c-year"
                        type="number"
                        min={MIN_YEAR}
                        max={MAX_YEAR}
                        {...form.register("year", { valueAsNumber: true })}
                        className="mt-1.5"
                      />
                    </div>
                  </div>

                  <div>
                    <Label>Condition</Label>
                    <div className="grid grid-cols-3 gap-2 mt-1.5">
                      {(Object.keys(CONDITION_LABELS) as Condition[]).map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => form.setValue("condition", c)}
                          className={`py-2.5 rounded-lg border text-sm font-medium transition-base ${
                            form.watch("condition") === c
                              ? "border-accent-green bg-accent-green-soft text-accent-green"
                              : "border-border hover:border-primary/30"
                          }`}
                        >
                          {CONDITION_LABELS[c]}
                        </button>
                      ))}
                    </div>
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
