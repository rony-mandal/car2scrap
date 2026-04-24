import { ShieldCheck, Banknote, Truck, FileCheck2, Leaf } from "lucide-react";

const BADGES = [
  { icon: ShieldCheck, label: "Govt. Authorized" },
  { icon: Banknote, label: "Instant Payment" },
  { icon: Truck, label: "Free Pickup" },
  { icon: FileCheck2, label: "RC Cancellation" },
  { icon: Leaf, label: "Eco-Certified" },
];

export function TrustBadges() {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
      {BADGES.map(({ icon: Icon, label }) => (
        <div
          key={label}
          className="flex items-center gap-2 rounded-lg border bg-card px-4 py-3 shadow-card"
        >
          <Icon className="h-5 w-5 text-accent-green shrink-0" />
          <span className="text-sm font-medium">{label}</span>
        </div>
      ))}
    </div>
  );
}
