import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { HowItWorksSteps } from "@/components/HowItWorksSteps";
import { TrustBadges } from "@/components/TrustBadges";
import { LeadFormDialog } from "@/components/LeadFormDialog";

export default function HowItWorks() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.title = "How It Works | car2scrap";
  }, []);

  return (
    <div>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container py-14 md:py-20 text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-white/10 border border-white/15 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            How It Works
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 font-[Poppins]">
            From quote to UPI payment — <span className="text-accent-green">in 3 steps</span>
          </h1>
          <p className="text-primary-foreground/80 mt-4">
            Most pickups complete within 24 hours of your first call. Here's exactly what happens.
          </p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <HowItWorksSteps />
      </section>

      <section className="bg-gradient-soft border-y">
        <div className="container py-14 md:py-16 max-w-3xl mx-auto">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-3 font-[Poppins]">
            Documents you'll need
          </h2>
          <p className="text-center text-muted-foreground mb-8">
            Don't worry if some are missing — we can guide you through alternatives.
          </p>
          <ul className="grid sm:grid-cols-2 gap-3 text-sm">
            {[
              "Original RC (Registration Certificate)",
              "PAN card (for payment)",
              "Aadhaar card (ID proof)",
              "Cancelled cheque or UPI ID",
              "Insurance copy (if available)",
              "Pollution certificate (if available)",
            ].map((d) => (
              <li
                key={d}
                className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-card"
              >
                <span className="h-2 w-2 rounded-full bg-accent-green" />
                {d}
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <TrustBadges />
        <div className="mt-12 text-center">
          <Button variant="cta" size="xl" onClick={() => setOpen(true)}>
            Book Free Pickup
          </Button>
        </div>
      </section>

      <LeadFormDialog open={open} onOpenChange={setOpen} source="how-it-works" />
    </div>
  );
}
