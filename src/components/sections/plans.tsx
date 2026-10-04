import { Check } from "lucide-react";
import { Container } from "@/components/shared/container";
import { CabinAvailability } from "@/components/sections/cabin-availability";
import { offer, rupees } from "@/content/offer";
import { planIncludes } from "@/content/plans";

export function Plans() {
  return (
    <section id="plans" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-5xl">
            Simple pricing. Pick your cabin.
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            One plan with everything included. Choose a cabin and we'll confirm
            availability on WhatsApp.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-2">
          <div className="rounded-3xl border-2 border-gold bg-white p-7 md:p-9">
            <span className="inline-block rounded-full bg-cabin px-3 py-1 text-xs font-extrabold text-white">
              {offer.label}
            </span>
            <p className="mt-5 font-display text-6xl font-extrabold leading-none text-navy md:text-7xl">
              {rupees(offer.price)}
            </p>
            <p className="mt-3 text-navy/70">
              for your {offer.period}, instead of{" "}
              <s>{rupees(offer.regularPrice)}</s> a month.
            </p>
            <ul className="mt-7 space-y-3">
              {planIncludes.map((item) => (
                <li key={item} className="flex gap-3 text-navy">
                  <span className="mt-0.5 grid size-5 shrink-0 place-items-center rounded-full bg-gold">
                    <Check className="size-3.5 text-navy" aria-hidden />
                  </span>
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-3xl bg-gold-soft p-7 md:p-9">
            <h3 className="font-display text-2xl font-extrabold text-navy">
              Cabin availability
            </h3>
            <p className="mb-6 mt-2 text-navy/70">
              Every seat is a personal, numbered cabin. Book early to get the
              spot you like.
            </p>
            <CabinAvailability />
          </div>
        </div>
      </Container>
    </section>
  );
}
