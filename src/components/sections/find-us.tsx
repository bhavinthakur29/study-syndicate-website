import Image from "next/image";
import { Clock, MapPin, MessageCircle, Navigation, Phone } from "lucide-react";
import { Container } from "@/components/shared/container";
import { site, whatsappLink } from "@/content/site";

export function FindUs() {
  const a = site.address;

  return (
    <section id="visit" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-5xl">
            Find us in Shastri Nagar, Jammu
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Look for Choudhary Car Accessories, near Jandyal Bakers. The library
            is on the floor above.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="relative min-h-80 overflow-hidden rounded-3xl lg:min-h-full">
            <Image
              src="/images/entrance.jpeg"
              alt="The entrance of The Study Syndicate Library in Shastri Nagar, Jammu, with a balloon arch and a staircase leading up"
              fill
              sizes="(min-width: 1024px) 500px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="flex flex-col gap-6">
            <address className="rounded-3xl border border-navy/10 bg-white p-6 not-italic md:p-8">
              <h3 className="font-display text-xl font-extrabold text-navy">
                {site.name}
              </h3>
              <ul className="mt-5 space-y-4 text-navy">
                <li className="flex gap-3">
                  <MapPin
                    className="mt-0.5 size-5 shrink-0 text-cabin"
                    aria-hidden
                  />
                  <span>
                    {a.line1}, {a.line2}, {a.city}, {a.region} {a.postalCode}
                  </span>
                </li>
                <li className="flex gap-3">
                  <Clock
                    className="mt-0.5 size-5 shrink-0 text-cabin"
                    aria-hidden
                  />
                  <span>{site.hours}</span>
                </li>
                <li className="flex gap-3">
                  <Phone
                    className="mt-0.5 size-5 shrink-0 text-cabin"
                    aria-hidden
                  />
                  <a
                    href={`tel:${site.phone}`}
                    className="font-semibold hover:underline"
                  >
                    {site.phoneDisplay}
                  </a>
                </li>
              </ul>

              <div className="mt-6 flex flex-wrap gap-3">
                <a
                  href={site.mapsUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-navy px-5 py-3 font-bold text-white transition hover:bg-navy-deep"
                >
                  <Navigation className="size-4" aria-hidden /> Get directions
                </a>
                <a
                  href={whatsappLink(
                    "Hi, I want to visit The Study Syndicate Library.",
                  )}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-xl bg-gold px-5 py-3 font-bold text-navy transition hover:brightness-95"
                >
                  <MessageCircle className="size-4" aria-hidden /> Plan a visit
                </a>
              </div>
            </address>

            <div className="overflow-hidden rounded-3xl border border-navy/10">
              <iframe
                title="Map showing The Study Syndicate Library in Shastri Nagar, Jammu"
                src={site.mapEmbedUrl}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="h-64 w-full border-0"
              />
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
