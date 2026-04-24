import { useEffect } from "react";
import { PriceCalculator } from "@/components/PriceCalculator";
import { TrustBadges } from "@/components/TrustBadges";
import { CheckCircle2 } from "lucide-react";

export default function CalculatorPage() {
  useEffect(() => {
    document.title = "Scrap Car Price Calculator | Car2Scrap";
  }, []);

  return (
    <div className="container py-12 md:py-16 max-w-5xl">
      <div className="text-center max-w-2xl mx-auto mb-10">
        <span className="inline-block rounded-full bg-accent-blue-soft text-accent-blue text-xs font-semibold px-3 py-1 uppercase tracking-wide">
          Price Calculator
        </span>
        <h1 className="text-3xl md:text-5xl font-bold mt-3 font-[Poppins]">
          Find your car's <span className="text-accent-green">scrap value</span>
        </h1>
        <p className="text-muted-foreground mt-3">
          Select your brand, model, year and condition to get an honest, weight-based estimate using current metal recovery rates. No login required.
        </p>
      </div>

      <div className="grid lg:grid-cols-5 gap-8 items-start">
        <div className="lg:col-span-3">
          <PriceCalculator source="calculator-page" />
        </div>
        <aside className="lg:col-span-2 space-y-6 lg:sticky lg:top-24">
          <div className="rounded-xl border bg-card p-6 shadow-card">
            <h3 className="font-bold mb-3 font-[Poppins]">How we calculate</h3>
            <ul className="space-y-2.5 text-sm text-muted-foreground">
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-green mt-0.5 shrink-0" />
                Brand &amp; model-specific kerb weight × current scrap metal rate
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-green mt-0.5 shrink-0" />
                Age-based depreciation (~1.8% per year)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-green mt-0.5 shrink-0" />
                Condition multiplier (Excellent / Good / Poor)
              </li>
              <li className="flex gap-2">
                <CheckCircle2 className="h-4 w-4 text-accent-green mt-0.5 shrink-0" />
                Final price confirmed at physical inspection
              </li>
            </ul>
          </div>
          <TrustBadges />
        </aside>
      </div>
    </div>
  );
}
