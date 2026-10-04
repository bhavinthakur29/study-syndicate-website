import { Hero } from "@/components/sections/hero";
import { Facilities } from "@/components/sections/facilities";
import { FreeAndSunday } from "@/components/sections/free-and-sunday";
import { Plans } from "@/components/sections/plans";

export default function Home() {
  return (
    <>
      <Hero />
      <Facilities />
      <FreeAndSunday />
      <Plans />
      <section id="faq" className="py-24 text-center text-navy/40">
        Section coming soon: faq
      </section>
    </>
  );
}
