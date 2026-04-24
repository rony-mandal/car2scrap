import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Truck, FileCheck2, Banknote, Recycle, ShieldCheck, Wrench } from "lucide-react";
import { LeadFormDialog } from "@/components/LeadFormDialog";

const SERVICES = [
  {
    icon: Truck,
    title: "Free Doorstep Pickup",
    desc: "Our team and tow truck come to your home, office or parking — anywhere in India. Zero pickup charges.",
  },
  {
    icon: Banknote,
    title: "Instant UPI Payment",
    desc: "Get paid to your bank account on the spot, before our truck leaves with your vehicle.",
  },
  {
    icon: FileCheck2,
    title: "RC Cancellation",
    desc: "End-to-end RTO paperwork for vehicle deregistration and Certificate of Deposit (CoD) — included free.",
  },
  {
    icon: Recycle,
    title: "Eco-Certified Recycling",
    desc: "Every car is dismantled at MoRTH-authorized facilities following strict environmental standards.",
  },
  {
    icon: ShieldCheck,
    title: "Insurance Refund Help",
    desc: "We assist with NCB transfer and pending insurance refund processing where applicable.",
  },
  {
    icon: Wrench,
    title: "All Vehicle Types",
    desc: "Hatchbacks, sedans, SUVs, pickup trucks, accident cars, non-running vehicles — we accept everything.",
  },
];

export default function Services() {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    document.title = "Services | Car2Scrap — Scrap, Pickup, RC Cancellation";
  }, []);

  return (
    <div>
      <section className="bg-gradient-hero text-primary-foreground">
        <div className="container py-14 md:py-20 text-center max-w-3xl mx-auto">
          <span className="inline-block rounded-full bg-white/10 border border-white/15 text-xs font-semibold px-3 py-1 uppercase tracking-wide">
            Services
          </span>
          <h1 className="text-3xl md:text-5xl font-bold mt-4 font-[Poppins]">
            Everything you need to scrap your car —{" "}
            <span className="text-accent-green">handled for you</span>
          </h1>
          <p className="text-primary-foreground/80 mt-4">
            From quote to RC cancellation, we own every step so you don't have to lift a finger.
          </p>
        </div>
      </section>

      <section className="container py-14 md:py-20">
        <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
          {SERVICES.map((s) => (
            <Card
              key={s.title}
              className="p-6 shadow-card hover:shadow-elegant transition-base group"
            >
              <div className="h-12 w-12 rounded-xl bg-accent-green-soft text-accent-green flex items-center justify-center mb-4 group-hover:scale-105 transition-base">
                <s.icon className="h-6 w-6" />
              </div>
              <h3 className="font-bold text-lg font-[Poppins]">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-2 leading-relaxed">{s.desc}</p>
            </Card>
          ))}
        </div>

        <div className="mt-14 text-center">
          <Button variant="cta" size="xl" onClick={() => setOpen(true)}>
            Get Started — Free Quote
          </Button>
        </div>
      </section>

      <LeadFormDialog open={open} onOpenChange={setOpen} source="services-page" />
    </div>
  );
}
