import { Navbar } from "@/components/layout/navbar";
import { Footer } from "@/components/layout/footer";
import { StickyContactBar } from "@/components/layout/sticky-contact-bar";
import { ScrollToTop } from "@/components/layout/scroll-to-top";

export default function SiteLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <Navbar />
      <main>{children}</main>
      <Footer />
      <StickyContactBar />
      <ScrollToTop />
    </>
  );
}
