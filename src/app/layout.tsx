import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, DM_Sans } from "next/font/google";
import { site } from "@/content/site";
import { JsonLd } from "@/components/shared/json-ld";
import { localBusinessSchema } from "@/lib/seo";
import { geo } from "@/content/site";
import { Analytics } from "@/components/shared/analytics";
import { ContactTracker } from "@/components/shared/contact-tracker";
import "./globals.css";

const display = Bricolage_Grotesque({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-bricolage",
  display: "swap",
});
const body = DM_Sans({
  subsets: ["latin"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Library in Shastri Nagar, Jammu | The Study Syndicate Library",
    template: "%s | The Study Syndicate Library",
  },
  description: site.description,
  applicationName: site.name,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: site.name,
    title: "The Study Syndicate Library, Shastri Nagar, Jammu",
    description: site.description,
    url: "/",
  },
  robots: { index: true, follow: true },
  authors: [{ name: "TekSquad" }],
  creator: "TekSquad",
  keywords: [
    "library in Shastri Nagar Jammu",
    "study library Jammu",
    "24 hour library Jammu",
    "self study space Jammu",
    "reading room Jammu",
    "library near me Jammu",
  ],
  category: "education",
  other: {
    "geo.region": "IN-JK",
    "geo.placename": "Shastri Nagar, Jammu",
    ...(geo && {
      "geo.position": `${geo.lat};${geo.lng}`,
      ICBM: `${geo.lat}, ${geo.lng}`,
    }),
  },
  verification: process.env.NEXT_PUBLIC_GSC_TOKEN
    ? { google: process.env.NEXT_PUBLIC_GSC_TOKEN }
    : undefined,
};

export const viewport: Viewport = {
  themeColor: "#14193f",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en-IN" className={`${display.variable} ${body.variable}`}>
      <body className="font-sans antialiased">
        <JsonLd data={localBusinessSchema()} />
        {children}
        <Analytics />
        <ContactTracker />
      </body>
    </html>
  );
}
