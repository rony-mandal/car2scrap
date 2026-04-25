import { Link, NavLink as RouterNavLink } from "react-router-dom";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Menu, X, Instagram, Facebook } from "lucide-react";
import { LeadFormDialog } from "@/components/LeadFormDialog";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo-transparent.png";

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
        <div className="container flex h-16 items-center justify-between gap-4">

          {/* Logo */}
          <Link to="/" className="flex items-center gap-3 shrink-0">
            <img src={logo} className="h-10 w-auto object-contain" />
            <span className="text-lg font-bold font-[Poppins] tracking-tight">
              Car<span className="text-accent-green">2</span>Scrap
            </span>
          </Link>

          {/* Desktop nav */}
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

          {/* Desktop right side: social icons + CTA */}
          <div className="hidden md:flex items-center gap-3">
            {/* Social icons */}
            <a
              href="https://www.instagram.com/car2scrap?igsh=MTU0Y2l3aGhyOG9n&utm_source=ig_contact_invite"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow car2scrap on Instagram"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-white hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] transition-all duration-200"
            >
              <Instagram className="h-4 w-4" />
            </a>
            <a
              href="https://www.facebook.com/share/1B5hpxZR8V/?mibextid=wwXIfr"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Follow car2scrap on Facebook"
              className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground hover:text-white hover:bg-[#1877f2] transition-all duration-200"
            >
              <Facebook className="h-4 w-4" />
            </a>

            {/* Divider */}
            <div className="h-5 w-px bg-border" />

            <Button variant="cta" size="sm" onClick={() => setLeadOpen(true)}>
              Get Best Price
            </Button>
          </div>

          {/* Mobile hamburger */}
          <button
            className="md:hidden p-2 rounded-md hover:bg-accent"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>

        {/* Mobile menu */}
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

              {/* Social icons row in mobile menu */}
              <div className="flex items-center gap-2 px-3 pt-2 pb-1">
                <a
                  href="https://www.instagram.com/car2scrap?igsh=MTU0Y2l3aGhyOG9n&utm_source=ig_contact_invite"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-white hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] transition-all duration-200"
                >
                  <Instagram className="h-4 w-4" />
                </a>
                <a
                  href="https://www.facebook.com/share/1B5hpxZR8V/?mibextid=wwXIfr"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-muted text-muted-foreground hover:text-white hover:bg-[#1877f2] transition-all duration-200"
                >
                  <Facebook className="h-4 w-4" />
                </a>
              </div>

              <Button
                variant="cta"
                className="mt-1"
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