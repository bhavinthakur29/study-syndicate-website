import Link from "next/link";
import { Clock, MapPin, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { navLinks, site, whatsappLink } from "@/content/site";
import Image from "next/image";

export function Footer() {
  const a = site.address;
  return (
    <footer
      id="contact"
      className="bg-navy-deep pb-28 pt-14 text-white/80 md:pb-10"
    >
      <Container>
        <div className="grid gap-10 md:grid-cols-3">
          <div>
            <Link
              href="/"
              aria-label={`${site.name} home`}
              className="inline-block rounded-2xl p-3 shadow-lg"
            >
              <Image
                src="/footer-logo.png"
                alt={site.name}
                width={666}
                height={275}
                className="h-auto w-48 sm:w-56"
              />
            </Link>
            <p className="mt-4 max-w-xs text-sm leading-relaxed">
              {site.description}
            </p>
          </div>

          <div>
            <h2 className="font-display text-base font-bold text-white">
              Explore
            </h2>
            <ul className="mt-3 space-y-2 text-sm">
              {navLinks.map((l) => (
                <li key={l.href}>
                  <Link href={l.href} className="hover:text-gold">
                    {l.label}
                  </Link>
                </li>
              ))}
              <li>
                <a
                  href={site.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-gold"
                >
                  Instagram {site.instagramHandle}
                </a>
              </li>
            </ul>
          </div>

          <address className="space-y-3 text-sm not-italic">
            <h2 className="font-display text-base font-bold text-white">
              Visit us
            </h2>
            <p className="flex gap-2">
              <MapPin
                className="mt-0.5 size-4 shrink-0 text-gold"
                aria-hidden
              />
              <span>
                {a.line1}, {a.line2}, {a.city}, {a.region} {a.postalCode}
              </span>
            </p>
            <p className="flex gap-2">
              <Phone className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <a href={`tel:${site.phone}`} className="hover:text-gold">
                {site.phoneDisplay}
              </a>
            </p>
            <p className="flex gap-2">
              <Clock className="mt-0.5 size-4 shrink-0 text-gold" aria-hidden />
              <span>{site.hours}</span>
            </p>
            <a
              href={site.mapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block font-semibold text-gold underline-offset-4 hover:underline"
            >
              Get directions
            </a>
            {" · "}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-gold underline-offset-4 hover:underline"
            >
              WhatsApp
            </a>
          </address>
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-white/10 pt-6 text-xs text-white/50 sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {site.name}. Shastri Nagar, Jammu.
          </p>
          <p>
            Designed and developed by{" "}
            {site.credit.url ? (
              <a
                href={site.credit.url}
                target="_blank"
                rel="noopener"
                className="font-semibold text-gold hover:underline"
              >
                {site.credit.name}
              </a>
            ) : (
              <span className="font-semibold text-gold">
                {site.credit.name}
              </span>
            )}
          </p>
        </div>
      </Container>
    </footer>
  );
}
