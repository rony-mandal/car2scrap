import { useEffect, useState } from "react";
import { Activity } from "lucide-react";

const CITIES = ["Delhi", "Noida", "Gurugram", "Ghaziabad", "Faridabad", "Meerut", "Bulandshahar", "Lucknow", "Kanpur", "Agra"];
const NAMES = ["Rohit", "Priya", "Amit", "Sneha", "Vikas", "Anjali", "Suresh", "Pooja", "Rajesh", "Neha"];
const ACTIONS = ["booked a pickup", "got a quote", "scrapped their car", "received instant payment"];

function randomMessage() {
  const name = NAMES[Math.floor(Math.random() * NAMES.length)];
  const city = CITIES[Math.floor(Math.random() * CITIES.length)];
  const action = ACTIONS[Math.floor(Math.random() * ACTIONS.length)];
  const minutes = 2 + Math.floor(Math.random() * 28);
  return `${name} from ${city} ${action} ${minutes} min ago`;
}

export function LiveActivity() {
  const [msg, setMsg] = useState(randomMessage);

  useEffect(() => {
    const t = setInterval(() => setMsg(randomMessage()), 5000);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="inline-flex items-center gap-2 rounded-full border bg-card px-4 py-2 shadow-card text-sm">
      <span className="relative flex h-2.5 w-2.5">
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-accent-green opacity-75" />
        <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-accent-green" />
      </span>
      <Activity className="h-3.5 w-3.5 text-muted-foreground" />
      <span key={msg} className="text-muted-foreground animate-fade-in">{msg}</span>
    </div>
  );
}
