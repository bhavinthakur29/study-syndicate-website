export const site = {
  name: "The Study Syndicate Library",
  shortName: "The Study Syndicate",
  tagline: "A space to learn, a place to grow",
  description:
    "Premium 24-hour AC study library in Shastri Nagar, Jammu with personal cabins, high-speed Wi-Fi, free mock tests, notes and Sunday doubt sessions.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000",
  phone: "+919055066867",
  phoneDisplay: "+91 90550 66867",
  instagram: "https://www.instagram.com/thestudysyndicate",
  instagramHandle: "@thestudysyndicate",
  address: {
    line1: "Above Choudhary Car Accessories, Digiana",
    line2: "Near Jandyal Bakers, Shastri Nagar",
    city: "Jammu",
    region: "Jammu and Kashmir",
    postalCode: "180004",
    country: "IN",
  },
  hours: "Open 24 hours, every day",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=The+Study+Syndicate+Library+Shastri+Nagar+Jammu",
  credit: {
    name: "TekSquad",
    url: "https://teksquad.tech/",
  },
} as const;

export const navLinks = [
  { label: "Facilities", href: "/#facilities" },
  { label: "Doubt sessions", href: "/#sunday" },
  { label: "Plans", href: "/#plans" },
  { label: "FAQ", href: "/#faq" },
  { label: "Contact", href: "/#contact" },
] as const;

export function whatsappLink(
  message = "Hi, I want to know more about The Study Syndicate Library.",
) {
  return `https://wa.me/${site.phone.replace("+", "")}?text=${encodeURIComponent(message)}`;
}
