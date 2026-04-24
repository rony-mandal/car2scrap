import { ShieldCheck, Banknote, Truck, FileCheck2, Leaf } from "lucide-react";

const BADGES = [
  {
    icon: ShieldCheck,
    title: "Government Authorized",
    desc: "Fully compliant with scrapping laws",
  },
  {
    icon: Banknote,
    title: "Instant Payment",
    desc: "UPI payment within minutes",
  },
  {
    icon: Truck,
    title: "Free Pickup",
    desc: "Doorstep vehicle collection",
  },
  {
    icon: FileCheck2,
    title: "RC Cancellation",
    desc: "We handle all paperwork",
  },
  {
    icon: Leaf,
    title: "Eco Certified",
    desc: "Environment-safe recycling",
  },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
      {BADGES.map(({ icon: Icon, title, desc }) => (
        <div
          key={title}
          className="group relative bg-white rounded-xl p-4 border shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
        >
          {/* Icon */}
          <div className="w-10 h-10 flex items-center justify-center rounded-full bg-accent-green/10 mb-3 group-hover:scale-110 transition">
            <Icon className="h-5 w-5 text-accent-green" />
          </div>

          {/* Title */}
          <h3 className="text-sm font-semibold">{title}</h3>

          {/* Description */}
          <p className="text-xs text-muted-foreground mt-1">
            {desc}
          </p>
        </div>
      ))}
    </div>
  );
}
