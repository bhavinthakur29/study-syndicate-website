import { Container } from "@/components/shared/container";
import { facilities, type Facility } from "@/content/facilities";
import { cn } from "@/lib/utils";

const tones: Record<
  Facility["tone"],
  { card: string; icon: string; text: string }
> = {
  navy: {
    card: "bg-navy text-white",
    icon: "bg-gold text-navy",
    text: "text-white/75",
  },
  gold: {
    card: "bg-gold text-navy",
    icon: "bg-navy text-gold",
    text: "text-navy/80",
  },
  red: {
    card: "bg-cabin text-white",
    icon: "bg-white text-cabin",
    text: "text-white/85",
  },
  light: {
    card: "border border-navy/10 bg-white text-navy",
    icon: "bg-gold-soft text-navy",
    text: "text-navy/65",
  },
};

export function Facilities() {
  return (
    <section id="facilities" className="py-20 md:py-28">
      <Container>
        <div className="max-w-2xl">
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-5xl">
            A premium study space in Shastri Nagar, Jammu, built for focus
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Everything a serious aspirant needs to study for hours without
            distraction.
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {facilities.map(({ title, text, icon: Icon, tone, className }) => {
            const t = tones[tone];
            return (
              <li
                key={title}
                className={cn(
                  "flex flex-col justify-between rounded-3xl p-6 md:p-7",
                  t.card,
                  className,
                )}
              >
                <span
                  className={cn(
                    "grid size-12 place-items-center rounded-2xl",
                    t.icon,
                  )}
                >
                  <Icon className="size-6" aria-hidden />
                </span>
                <div className="mt-10">
                  <h3 className="font-display text-xl font-extrabold leading-tight md:text-2xl">
                    {title}
                  </h3>
                  <p
                    className={cn(
                      "mt-2 text-sm leading-relaxed md:text-base",
                      t.text,
                    )}
                  >
                    {text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </Container>
    </section>
  );
}
