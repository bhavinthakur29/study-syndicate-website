import { Hero } from "@/components/sections/hero";

export default function Home() {
  return (
    <>
      <Hero />
      {["facilities", "sunday", "plans", "faq"].map((id) => (
        <section key={id} id={id} className="py-24 text-center text-navy/40">
          Section coming soon: {id}
        </section>
      ))}
    </>
  );
}
