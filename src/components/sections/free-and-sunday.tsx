import { CalendarClock, MessageCircle } from "lucide-react";
import { Container } from "@/components/shared/container";
import { freeExtras } from "@/content/free-extras";
import { sessionSubjects, sundaySessions } from "@/content/sessions";
import { whatsappLink } from "@/content/site";

export function FreeAndSunday() {
  return (
    <section
      id="sunday"
      className="hero-bg relative overflow-hidden rounded-[2.5rem] py-20 text-white md:py-28"
    >
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight sm:text-4xl md:text-5xl">
            Free with every seat. Doubts cleared every Sunday.
          </h2>
          <p className="mt-4 text-lg text-white/70">
            Members get mock tests, notes and counselling at no extra cost, plus
            a weekly session to settle every doubt.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 md:grid-cols-3">
          {freeExtras.map(({ title, text, icon: Icon }) => (
            <li
              key={title}
              className="rounded-3xl border border-white/15 bg-white/[0.07] p-6 backdrop-blur"
            >
              <div className="flex items-center justify-between">
                <span className="grid size-12 place-items-center rounded-2xl bg-gold text-navy">
                  <Icon className="size-6" aria-hidden />
                </span>
                <span className="rounded-full bg-gold px-3 py-1 text-xs font-extrabold text-navy">
                  FREE
                </span>
              </div>
              <h3 className="mt-8 font-display text-xl font-extrabold">
                {title}
              </h3>
              <p className="mt-2 text-sm leading-relaxed text-white/70">
                {text}
              </p>
            </li>
          ))}
        </ul>

        <div className="mt-6 grid gap-8 rounded-3xl border-2 border-gold/70 bg-navy-deep/60 p-6 backdrop-blur md:p-10 lg:grid-cols-[1fr_1fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full bg-gold px-4 py-1.5 text-sm font-extrabold text-navy">
              <CalendarClock className="size-4" aria-hidden />{" "}
              {sundaySessions.day}
            </p>
            <h3 className="mt-5 font-display text-3xl font-extrabold leading-tight md:text-4xl">
              Doubt sessions, {sundaySessions.time}
            </h3>
            <p className="mt-3 max-w-md text-white/70">
              {sundaySessions.description}
            </p>
            <a
              href={whatsappLink(
                "Hi, I want to join the Sunday doubt session at The Study Syndicate Library.",
              )}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-flex items-center gap-2 rounded-xl bg-gold px-6 py-3.5 font-bold text-navy transition hover:brightness-95"
            >
              <MessageCircle className="size-5" aria-hidden /> Ask about this
              Sunday
            </a>
          </div>

          <ul className="grid grid-cols-2 gap-3">
            {sessionSubjects.map(({ label, icon: Icon }) => (
              <li
                key={label}
                className="flex flex-col gap-6 rounded-2xl bg-white p-5 text-navy"
              >
                <Icon className="size-7 text-cabin" aria-hidden />
                <span className="font-display text-xl font-extrabold">
                  {label}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
