import { Star } from "lucide-react";
import { Card } from "@/components/ui/card";

const TESTIMONIALS = [
  {
    name: "Anil Kumar",
    city: "Delhi",
    quote:
      "Got ₹26,500 for my 2009 WagonR. They picked it up the same day and paid me on UPI before the truck even left. Smooth experience!",
  },
  {
    name: "Meera Joshi",
    city: "Noida",
    quote:
      "I was worried about RC cancellation paperwork for our old Indica. car2scrap handled everything end-to-end. Super professional.",
  },
  {
    name: "Ravi Verma",
    city: "Ghaziabad",
    quote:
      "Best quote among 4 companies I checked. Free pickup, no haggling on the spot. Highly recommended for old vehicles.",
  },
];

export function Testimonials() {
  return (
    <div className="grid gap-5 md:grid-cols-3">
      {TESTIMONIALS.map((t) => (
        <Card key={t.name} className="p-6 shadow-card hover:shadow-elegant transition-base">
          <div className="flex gap-0.5 text-accent-green mb-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="h-4 w-4 fill-current" />
            ))}
          </div>
          <p className="text-sm leading-relaxed text-foreground/85">"{t.quote}"</p>
          <div className="mt-4 pt-4 border-t">
            <p className="font-semibold text-sm">{t.name}</p>
            <p className="text-xs text-muted-foreground">{t.city}</p>
          </div>
        </Card>
      ))}
    </div>
  );
}
