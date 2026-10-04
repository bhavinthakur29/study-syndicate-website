import Image from "next/image";
import {
  CalendarClock,
  Clock3,
  MessageCircle,
  ShieldCheck,
  Snowflake,
  Wifi,
} from "lucide-react";
import { Container } from "@/components/shared/container";
import { whatsappLink } from "@/content/site";
import { offer, rupees } from "@/content/offer";
import { sundaySessions } from "@/content/sessions";

const chips = [
  { icon: Clock3, label: "Open 24 hours" },
  { icon: Snowflake, label: "Fully AC" },
  { icon: Wifi, label: "High-speed Wi-Fi" },
  { icon: ShieldCheck, label: "CCTV secured" },
];

export function Hero() {
  return (
    <section className="relative overflow-hidden">
      <div
        aria-hidden
        className="pointer-events-none absolute -right-32 -top-32 size-[28rem] rounded-full bg-gold/25 blur-3xl"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute -left-40 top-1/2 size-[24rem] rounded-full bg-navy/10 blur-3xl"
      />

      <Container className="relative grid items-center gap-12 py-10 md:py-16 lg:grid-cols-[1.1fr_0.9fr]">
        <div>
          <p
            className="rise inline-flex items-center gap-2 rounded-full bg-gold-soft px-4 py-1.5 text-sm font-semibold text-navy"
            style={{ ["--i" as string]: 0 }}
          >
            <span className="size-2 rounded-full bg-cabin" aria-hidden />
            Premium 24-hour study library in Shastri Nagar, Jammu
          </p>

          <h1
            className="rise mt-5 font-display text-5xl font-extrabold leading-[1.02] tracking-tight text-navy sm:text-6xl lg:text-7xl"
            style={{ ["--i" as string]: 1 }}
          >
            A space to learn, a place to{" "}
            <span className="text-gold">grow.</span>
          </h1>

          <p
            className="rise mt-5 max-w-xl text-lg leading-relaxed text-navy/70"
            style={{ ["--i" as string]: 2 }}
          >
            Personal numbered cabins, a silent AC hall, free mock tests and
            notes, and doubt sessions every Sunday. Everything a serious
            aspirant needs under one roof.
          </p>

          <div
            className="rise mt-8 flex flex-wrap gap-3"
            style={{ ["--i" as string]: 3 }}
          >
            <a
              href={whatsappLink(
                "Hi, I want to reserve a cabin at The Study Syndicate Library.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-xl bg-navy px-6 py-3.5 font-bold text-white transition hover:bg-navy-deep"
            >
              <MessageCircle className="size-5" aria-hidden /> Reserve your
              cabin
            </a>
            <a
              href="#plans"
              className="inline-flex items-center rounded-xl border-2 border-navy px-6 py-3.5 font-bold text-navy transition hover:bg-navy hover:text-white"
            >
              See the offer
            </a>
          </div>

          <ul
            className="rise mt-8 flex flex-wrap gap-x-5 gap-y-3"
            style={{ ["--i" as string]: 4 }}
          >
            {chips.map(({ icon: Icon, label }) => (
              <li
                key={label}
                className="flex items-center gap-2 text-sm font-medium text-navy/80"
              >
                <Icon className="size-4 text-gold" aria-hidden /> {label}
              </li>
            ))}
          </ul>
        </div>

        <div
          className="rise relative mx-auto w-full max-w-md lg:max-w-none"
          style={{ ["--i" as string]: 2 }}
        >
          <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] border-4 border-navy shadow-2xl">
            <Image
              src="/images/cabins.jpeg"
              alt="Rows of numbered red study cabins with lamps inside The Study Syndicate Library"
              fill
              priority
              sizes="(min-width: 1024px) 480px, 90vw"
              className="object-cover"
            />
          </div>

          <div className="absolute -left-3 top-8 rounded-2xl bg-navy p-4 text-white shadow-xl sm:-left-8">
            <p className="text-xs font-medium text-white/70">{offer.label}</p>
            <p className="font-display text-4xl font-extrabold leading-none text-gold">
              {rupees(offer.price)}
            </p>
            <p className="mt-1 text-xs text-white/80">
              {offer.period}, <s>{rupees(offer.regularPrice)}</s>/month
            </p>
          </div>

          <div className="absolute -bottom-5 right-2 flex max-w-[15rem] items-start gap-3 rounded-2xl bg-white p-4 shadow-xl sm:-right-6">
            <CalendarClock
              className="mt-0.5 size-6 shrink-0 text-cabin"
              aria-hidden
            />
            <div>
              <p className="text-sm font-bold text-navy">
                {sundaySessions.day} doubt sessions
              </p>
              <p className="text-xs text-navy/70">
                {sundaySessions.time}. {sundaySessions.subjects.join(", ")}.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </section>
  );
}
