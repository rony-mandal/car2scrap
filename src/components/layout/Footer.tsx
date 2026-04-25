import { Link } from "react-router-dom";
import { Recycle, Mail, Phone, MapPin, Instagram, Facebook } from "lucide-react";
import { BUSINESS } from "@/lib/business";
import logo from "@/assets/logo-transparent.png";


export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-20">
      <div className="container py-14 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-1">
          <Link to="/" className="flex items-center gap-2 font-bold text-lg">
  <img
    src={logo}
    alt="Car2Scrap Logo"
    className="h-9 w-auto object-contain rounded-lg"
  />
  <span className="font-[Poppins]">
    Car<span className="text-accent-green">2</span>Scrap
  </span>
</Link>
          <p className="mt-4 text-sm text-primary-foreground/70 leading-relaxed">
            India's trusted car scrap & recycling platform. Govt. authorized,
            instant payment, free pickup.
          </p>

          {/* Social Media */}
          <div className="mt-5">
            <p className="text-xs uppercase tracking-wide text-primary-foreground/50 mb-3">
              Follow us
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/car2scrap?igsh=MTU0Y2l3aGhyOG9n&utm_source=ig_contact_invite"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow car2scrap on Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-gradient-to-br hover:from-[#f09433] hover:via-[#e6683c] hover:to-[#dc2743] transition-all duration-200"
              >
                <Instagram className="h-4 w-4" />
              </a>
              <a
                href="https://www.facebook.com/share/1B5hpxZR8V/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Follow car2scrap on Facebook"
                className="flex h-9 w-9 items-center justify-center rounded-lg bg-white/10 hover:bg-[#1877f2] transition-all duration-200"
              >
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>
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
          <span>© {new Date().getFullYear()} Car2Scrap. All rights reserved.</span>
          <div className="flex items-center gap-4">
            <span>Govt. authorized vehicle recycling facility</span>
            <div className="flex items-center gap-3">
              <a
                href="https://www.instagram.com/car2scrap?igsh=MTU0Y2l3aGhyOG9n&utm_source=ig_contact_invite"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="hover:text-accent-green transition-colors"
              >
                <Instagram className="h-3.5 w-3.5" />
              </a>
              <a
                href="https://www.facebook.com/share/1B5hpxZR8V/?mibextid=wwXIfr"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="hover:text-accent-green transition-colors"
              >
                <Facebook className="h-3.5 w-3.5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}