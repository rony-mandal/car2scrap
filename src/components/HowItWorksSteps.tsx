import { Calculator, PhoneCall, Truck } from "lucide-react";

const STEPS = [
  {
    n: 1,
    icon: Calculator,
    title: "Get Instant Quote",
    desc: "Use our calculator or fill the form. Get a transparent price estimate in under 30 seconds.",
  },
  {
    n: 2,
    icon: PhoneCall,
    title: "Schedule Free Pickup",
    desc: "Our team calls you to confirm details and book a free doorstep pickup at your convenience.",
  },
  {
    n: 3,
    icon: Truck,
    title: "Get Paid Instantly",
    desc: "We pick up the car, complete RC cancellation paperwork & pay you on UPI before our truck leaves.",
  },
];

export function HowItWorksSteps({ compact = false }: { compact?: boolean }) {
  return (
    <div className={compact ? "grid gap-5 md:grid-cols-3" : "grid gap-8 md:grid-cols-3"}>
      {STEPS.map((s) => (
        <div key={s.n} className="relative">
          <div className="flex flex-col items-start gap-4">
            <div className="relative">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-cta text-accent-green-foreground shadow-elegant">
                <s.icon className="h-7 w-7" />
              </div>
              <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-primary text-primary-foreground text-xs font-bold flex items-center justify-center shadow-card">
                {s.n}
              </span>
            </div>
            <div>
              <h3 className="font-bold text-lg font-[Poppins]">{s.title}</h3>
              <p className="text-sm text-muted-foreground mt-1.5 leading-relaxed">{s.desc}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
