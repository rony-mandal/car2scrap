import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Recycle } from "lucide-react";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { cn } from "@/lib/utils";

const navItems = [
  { to: "/", label: "Home" },
  { to: "/calculator", label: "Price Calculator" },
  { to: "/services", label: "Services" },
  { to: "/how-it-works", label: "How It Works" },
  { to: "/contact", label: "Contact" },
];

export function Header() {
  const [open, setOpen] = useState(false);
  const [leadOpen, setLeadOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-border/60 bg-background/85 backdrop-blur supports-[backdrop-filter]:bg-background/70">
        <div className="container flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta text-accent-green-foreground">
              <Recycle className="h-5 w-5" />
            </span>
            <span className="font-[Poppins]">
              Car<span className="text-accent-green">2</span>Scrap
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-1">
            {navItems.map((item) => (
              <RouterNavLink
                key={item.to}
                to={item.to}
                end={item.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-3 py-2 rounded-md text-sm font-medium transition-base",
                    isActive
                      ? "text-primary"
                      : "text-muted-foreground hover:text-primary hover:bg-accent",
                  )
                }
              >
                {item.label}
              </RouterNavLink>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-2">
            <Button variant="cta" size="sm" onClick={() => setLeadOpen(true)}>
              Get Best Price
            </Button>
          </div>

          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {open && (
          <div className="md:hidden border-t border-border bg-background animate-fade-in">
            <div className="container py-3 flex flex-col gap-1">
              {navItems.map((item) => (
                <RouterNavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === "/"}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    cn(
                      "px-3 py-2.5 rounded-md text-sm font-medium",
                      isActive
                        ? "bg-accent text-primary"
                        : "text-muted-foreground hover:bg-accent",
                    )
                  }
                >
                  {item.label}
                </RouterNavLink>
              ))}
              <Button
                variant="cta"
                className="mt-2"
                onClick={() => {
                  setOpen(false);
                  setLeadOpen(true);
                }}
              >
                Get Best Price
              </Button>
            </div>
          </div>
        )}
      </header>

      <LeadFormDialog open={leadOpen} onOpenChange={setLeadOpen} />
    </>
  );
}
