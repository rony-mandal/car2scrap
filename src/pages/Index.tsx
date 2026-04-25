import { Link } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, ArrowRight, ShieldCheck, IndianRupee, Truck } from "lucide-react";
import { PriceCalculator } from "@/components/PriceCalculator";
import { TrustBadges } from "@/components/TrustBadges";
import { Testimonials } from "@/components/Testimonials";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { LiveActivity } from "@/components/LiveActivity";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import CustomerCarousel from "@/components/CustomerCarousel";

const Index = () => {
  const [open, setOpen] = useState(false);

  return (
    <div>
      {/* HERO */}
      <section className="relative overflow-hidden bg-gradient-hero text-primary-foreground">
        <div
          className="absolute inset-0 opacity-[0.07] bg-[radial-gradient(circle_at_30%_20%,white_1px,transparent_1px)]"
          style={{ backgroundSize: "24px 24px" }}
        />

        {/*
          LAYOUT STRATEGY:
          - All screens: single column, text on top, image below
          - lg (1024px+): two columns side by side using CSS grid with explicit column sizes
          
          We avoid flex-1 / auto sizing that caused the tablet breakage.
          On desktop, left col = 55% (text), right col = 45% (image).
          Carousel container always has a FIXED pixel height — never percentage or auto.
        */}
        <div className="container relative py-10 lg:py-20">

          {/* ── MOBILE + TABLET: stacked layout ── */}
          <div className="block lg:hidden space-y-8">
            {/* Text block */}
            <div className="space-y-5 animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-green" />
                Govt. Authorized Vehicle Recycler
              </div>

              <h1 className="text-3xl sm:text-4xl font-extrabold leading-[1.1] font-[Poppins]">
                Get the <span className="text-accent-green">Best Price</span> for Your Old Car
              </h1>

              <p className="text-base text-primary-foreground/80">
                Free doorstep pickup, instant UPI payment, and complete RC cancellation —
                all handled by India's most trusted scrap car platform.
              </p>

              <ul className="space-y-2">
                {[
                  "Instant transparent quote",
                  "Free doorstep pickup",
                  "Payment before pickup",
                  "RC cancellation included",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-accent-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <Button variant="cta" size="lg" className="w-full sm:w-auto" onClick={() => setOpen(true)}>
                  Get Best Price <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="lg"
                  className="w-full sm:w-auto bg-white/10 text-primary-foreground border-white/20 hover:bg-white/15 hover:text-primary-foreground"
                >
                  <Link to="/calculator">Try the Calculator</Link>
                </Button>
              </div>

              <LiveActivity />
            </div>

            {/* Image block — fixed height so Swiper always has something to measure */}
            <div
              className="relative rounded-2xl shadow-elegant overflow-hidden w-full"
              style={{ height: "280px" }}
            >
              <CustomerCarousel />
            </div>
          </div>

          {/* ── DESKTOP (lg+): two-column grid ── */}
          <div
            className="hidden lg:grid items-center gap-10"
            style={{ gridTemplateColumns: "55% 45%" }}
          >
            {/* Left: Text */}
            <div className="space-y-6 animate-slide-up">
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-4 py-1.5 text-xs font-medium backdrop-blur">
                <ShieldCheck className="h-3.5 w-3.5 text-accent-green" />
                Govt. Authorized Vehicle Recycler
              </div>

              <h1 className="text-5xl xl:text-6xl font-extrabold leading-[1.1] font-[Poppins]">
                Get the <span className="text-accent-green">Best Price</span> for Your Old Car
              </h1>

              <p className="text-lg text-primary-foreground/80 max-w-xl">
                Free doorstep pickup, instant UPI payment, and complete RC cancellation —
                all handled by India's most trusted scrap car platform.
              </p>

              <ul className="grid grid-cols-2 gap-2 max-w-xl">
                {[
                  "Instant transparent quote",
                  "Free doorstep pickup",
                  "Payment before pickup",
                  "RC cancellation included",
                ].map((f) => (
                  <li key={f} className="flex items-center gap-2 text-sm text-primary-foreground/90">
                    <CheckCircle2 className="h-4 w-4 text-accent-green shrink-0" />
                    {f}
                  </li>
                ))}
              </ul>

              <div className="flex flex-wrap gap-3 pt-2">
                <Button variant="cta" size="xl" onClick={() => setOpen(true)}>
                  Get Best Price <ArrowRight className="h-5 w-5" />
                </Button>
                <Button
                  asChild
                  variant="outline"
                  size="xl"
                  className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/15 hover:text-primary-foreground"
                >
                  <Link to="/calculator">Try the Calculator</Link>
                </Button>
              </div>

              <LiveActivity />
            </div>

            {/* Right: Carousel — fixed pixel height, no percentage */}
            <div className="relative">
              <div
                className="absolute -inset-6 bg-accent-green/15 blur-3xl rounded-full pointer-events-none"
                aria-hidden
              />
              <div
                className="relative rounded-2xl shadow-elegant overflow-hidden w-full"
                style={{ height: "480px" }}
              >
                <CustomerCarousel />
              </div>
            </div>
          </div>

        </div>

        {/* Stats strip */}
        <div className="border-t border-white/10 bg-black/20">
          <div className="container py-5 grid grid-cols-3 gap-4 text-center">
            <Stat value="10,000+" label="Cars scrapped" />
            <Stat value="50+" label="Cities served" />
            <Stat value="₹4.5 Cr+" label="Paid to customers" />
          </div>
        </div>
      </section>

      {/* CALCULATOR */}
      <section className="container py-16 md:py-20 grid lg:grid-cols-5 gap-10 items-start">
        <div className="lg:col-span-2 space-y-5">
          <span className="inline-block rounded-full bg-accent-blue-soft text-accent-blue text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            Price Calculator
          </span>
          <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
            Know your car's scrap value <span className="text-accent-green">in seconds</span>
          </h2>
          <p className="text-muted-foreground leading-relaxed">
            Our calculator uses real metal recovery rates, vehicle weight, age depreciation
            and condition to give you a transparent quote — the same one our buyers offer
            on inspection.
          </p>
          <ul className="space-y-2">
            {[
              "Based on actual metal weight & current scrap rates",
              "No spam — calculate without sharing details",
              "Lock in your price by booking pickup",
            ].map((f) => (
              <li key={f} className="flex items-start gap-2 text-sm">
                <CheckCircle2 className="h-4 w-4 text-accent-green mt-0.5 shrink-0" />
                {f}
              </li>
            ))}
          </ul>
        </div>
        <div className="lg:col-span-3">
          <PriceCalculator source="landing-calculator" />
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section className="bg-gradient-soft border-y">
        <div className="container py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="inline-block rounded-full bg-accent-green-soft text-accent-green text-xs font-semibold px-3 py-1 uppercase tracking-wide">
              How It Works
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 font-[Poppins]">
              Scrap your car in 3 simple steps
            </h2>
            <p className="text-muted-foreground mt-3">
              From quote to UPI payment — most pickups completed within 24 hours.
            </p>
          </div>
          <HowItWorksSteps />
        </div>
      </section>

      {/* TRUST */}
      <section className="container py-16 md:py-20">
        <div className="text-center max-w-2xl mx-auto mb-10">
          <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
            Trusted, transparent, certified
          </h2>
          <p className="text-muted-foreground mt-3">
            We follow MoRTH End-of-Life Vehicle guidelines and partner only with
            government-authorized recycling facilities.
          </p>
        </div>
        <TrustBadges />
      </section>

      {/* TESTIMONIALS */}
      <section className="bg-gradient-soft border-y">
        <div className="container py-16 md:py-20">
          <div className="text-center max-w-2xl mx-auto mb-10">
            <span className="inline-block rounded-full bg-accent-blue-soft text-accent-blue text-xs font-semibold px-3 py-1 uppercase tracking-wide">
              Customer Stories
            </span>
            <h2 className="text-3xl md:text-4xl font-bold mt-3 font-[Poppins]">
              Real customers, real payouts
            </h2>
          </div>
          <Testimonials />
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="container py-16 md:py-20">
        <div className="rounded-3xl bg-gradient-hero text-primary-foreground p-10 md:p-14 text-center shadow-elegant overflow-hidden relative">
          <div
            className="absolute inset-0 opacity-[0.06] bg-[radial-gradient(circle_at_70%_80%,white_1px,transparent_1px)]"
            style={{ backgroundSize: "24px 24px" }}
            aria-hidden
          />
          <div className="relative max-w-2xl mx-auto space-y-5">
            <h2 className="text-3xl md:text-4xl font-bold font-[Poppins]">
              Ready to scrap your old car?
            </h2>
            <p className="text-primary-foreground/80">
              Get an instant quote, free pickup, and payment in under 24 hours.
            </p>
            <div className="flex flex-wrap gap-3 justify-center pt-2">
              <Button variant="cta" size="xl" onClick={() => setOpen(true)}>
                <IndianRupee className="h-5 w-5" />
                Get My Best Price
              </Button>
              <Button
                asChild
                variant="outline"
                size="xl"
                className="bg-white/10 text-primary-foreground border-white/20 hover:bg-white/15 hover:text-primary-foreground"
              >
                <Link to="/contact">
                  <Truck className="h-5 w-5" />
                  Talk to Our Team
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <LeadFormDialog open={open} onOpenChange={setOpen} source="landing-hero" />
    </div>
  );
};

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <div>
      <div className="text-xl md:text-2xl font-bold font-[Poppins]">{value}</div>
      <div className="text-xs uppercase tracking-wide text-primary-foreground/70 mt-0.5">
        {label}
      </div>
    </div>
  );
}

export default Index;