import { Container } from "@/components/shared/container";
import { legal, type LegalSection } from "@/content/legal";
import { site } from "@/content/site";

export function LegalPage({
  title,
  sections,
}: {
  title: string;
  sections: LegalSection[];
}) {
  return (
    <Container className="max-w-3xl pb-20 pt-32">
      <h1 className="font-display text-4xl font-extrabold text-navy">
        {title}
      </h1>
      <p className="mt-2 text-navy/60">Last updated {legal.updated}</p>

      <div className="mt-10 space-y-8">
        {sections.map((s) => (
          <section key={s.heading}>
            <h2 className="font-display text-xl font-extrabold text-navy">
              {s.heading}
            </h2>
            <div className="mt-2 space-y-3 text-navy/80">
              {s.blocks.map((b, i) =>
                typeof b === "string" ? (
                  <p key={i}>{b}</p>
                ) : (
                  <ul key={i} className="list-disc space-y-1 pl-5">
                    {b.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                ),
              )}
            </div>
          </section>
        ))}
      </div>

      <p className="mt-12 rounded-2xl bg-gold-soft p-5 text-navy">
        Questions? Call{" "}
        <a className="font-semibold underline" href={`tel:${site.phone}`}>
          {site.phoneDisplay}
        </a>
        {legal.contactEmail && (
          <>
            {" "}
            or write to{" "}
            <a
              className="font-semibold underline"
              href={`mailto:${legal.contactEmail}`}
            >
              {legal.contactEmail}
            </a>
          </>
        )}
        .
      </p>
    </Container>
  );
}
