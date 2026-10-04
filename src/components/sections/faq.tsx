import { Container } from "@/components/shared/container";
import { JsonLd } from "@/components/shared/json-ld";
import { FaqList } from "@/components/sections/faq-list";
import { faqs, faqSchema } from "@/content/faqs";

export function Faq() {
  return (
    <section id="faq" className="py-20 md:py-28">
      <JsonLd data={faqSchema} />
      <Container className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr]">
        <div>
          <h2 className="font-display text-3xl font-extrabold tracking-tight text-navy sm:text-4xl md:text-5xl">
            Questions students ask
          </h2>
          <p className="mt-4 text-lg text-navy/70">
            Can't find your answer? Call or message us and we'll help.
          </p>
        </div>
        <FaqList items={faqs} />
      </Container>
    </section>
  );
}
