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
  landmarks: [
    "Above Choudhary Car Accessories",
    "Near Jandyal Bakers",
    "Shastri Nagar",
  ],
  mapEmbedUrl:
    "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d17383.751002564186!2d74.84737157236543!3d32.69063887919534!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x391e85003155e97b%3A0xb0d08e2d1c0fbca5!2sThe%20Study%20Syndicate%20Library!5e0!3m2!1sen!2suk!4v1791089689520!5m2!1sen!2suk",
  servedPostalCodes: ["180004", "180010"],
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

export const geo: { lat: number; lng: number } | null = {
  lat: 32.6906150080367,
  lng: 74.85765094485102,
};
