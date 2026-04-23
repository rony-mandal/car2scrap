import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin } from "lucide-react";
import { BUSINESS } from "@/lib/business";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-gradient-cta">
              <Recycle className="h-5 w-5" />
            </span>
            <span className="font-[Poppins]">
              car<span className="text-accent-green">2</span>scrap
            </span>
          </Link>
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
            India's trusted car scrap & recycling platform. Govt. authorized,
            instant payment, free pickup.
          </p>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
            Quick Links
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li><Link to="/calculator" className="hover:text-accent-green">Price Calculator</Link></li>
            <li><Link to="/services" className="hover:text-accent-green">Services</Link></li>
            <li><Link to="/how-it-works" className="hover:text-accent-green">How It Works</Link></li>
            <li><Link to="/contact" className="hover:text-accent-green">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
            Services
          </h4>
          <ul className="space-y-2 text-sm text-primary-foreground/70">
            <li>End-of-life vehicle scrapping</li>
            <li>Free doorstep pickup</li>
            <li>RC cancellation support</li>
            <li>Instant UPI payment</li>
            <li>Eco-certified recycling</li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 text-sm uppercase tracking-wide">
            Reach Us
          </h4>
          <ul className="space-y-3 text-sm text-primary-foreground/70">
            <li className="flex gap-2">
              <Phone className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={`tel:${BUSINESS.phone}`} className="hover:text-accent-green">
                {BUSINESS.phoneDisplay}
              </a>
            </li>
            <li className="flex gap-2">
              <Mail className="h-4 w-4 mt-0.5 shrink-0" />
              <a href={`mailto:${BUSINESS.email}`} className="hover:text-accent-green break-all">
                {BUSINESS.email}
              </a>
            </li>
            <li className="flex gap-2">
              <MapPin className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{BUSINESS.address}</span>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="container py-5 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-primary-foreground/60">
          <span>© {new Date().getFullYear()} car2scrap. All rights reserved.</span>
          <span>Govt. authorized vehicle recycling facility</span>
        </div>
      </div>
    </footer>
  );
}
