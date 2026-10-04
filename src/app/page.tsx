import { Hero } from "@/components/sections/hero";
import { Facilities } from "@/components/sections/facilities";
import { FreeAndSunday } from "@/components/sections/free-and-sunday";
import { Plans } from "@/components/sections/plans";
import { FindUs } from "@/components/sections/find-us";
import { Faq } from "@/components/sections/faq";

export default function Home() {
  return (
    <>
      <Hero />
      <Facilities />
      <FreeAndSunday />
      <Plans />
      <FindUs />
      <Faq />
    </>
  );
}
