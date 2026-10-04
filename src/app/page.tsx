import { Container } from "@/components/shared/container";

export default function Home() {
  return (
    <Container className="py-24">
      <h1 className="font-display text-5xl font-extrabold text-navy md:text-7xl">
        A space to learn, a place to <span className="text-gold">grow.</span>
      </h1>
      <p className="mt-4 text-navy/70">
        Phase 2 layout check. Real sections arrive in Phase 3.
      </p>
      {["facilities", "sunday", "plans", "faq"].map((id) => (
        <section key={id} id={id} className="py-24 text-navy/50">
          Section: {id}
        </section>
      ))}
    </Container>
  );
}
