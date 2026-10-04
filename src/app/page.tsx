import { Hero } from "@/components/sections/hero";
import { Facilities } from "@/components/sections/facilities";

export default function Home() {
  return (
    <>
      <Hero />
      <Facilities />
      {["sunday", "plans", "faq"].map((id) => (
        <section key={id} id={id} className="py-24 text-center text-navy/40">
          Section coming soon: {id}
        </section>
      ))}
    </>
  );
}
