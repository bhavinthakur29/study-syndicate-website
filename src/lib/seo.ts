import { geo, site } from "@/content/site";
import { offer } from "@/content/offer";

export function localBusinessSchema() {
  const a = site.address;
  return {
    "@context": "https://schema.org",
    "@type": "Library",
    "@id": `${site.url}/#library`,
    name: site.name,
    description: site.description,
    url: site.url,
    telephone: site.phone,
    image: [`${site.url}/opengraph-image.png`],
    logo: `${site.url}/footer-logo.png`,
    priceRange: `₹${offer.price}-₹${offer.regularPrice}`,
    address: {
      "@type": "PostalAddress",
      streetAddress: `${a.line1}, ${a.line2}`,
      addressLocality: a.city,
      addressRegion: a.region,
      postalCode: a.postalCode,
      addressCountry: a.country,
    },
    ...(geo && {
      geo: { "@type": "GeoCoordinates", latitude: geo.lat, longitude: geo.lng },
    }),
    hasMap: site.mapsUrl,
    openingHoursSpecification: {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
      opens: "00:00",
      closes: "23:59",
    },
    areaServed: site.servedPostalCodes.map((code) => ({
      "@type": "Place",
      address: {
        "@type": "PostalAddress",
        postalCode: code,
        addressLocality: a.city,
        addressCountry: a.country,
      },
    })),
    sameAs: [site.instagram],
  };
}
