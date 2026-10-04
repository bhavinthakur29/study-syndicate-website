import { offer, rupees } from "@/content/offer";
import { sundaySessions } from "@/content/sessions";
import { cabins } from "@/content/plans";
import { site } from "@/content/site";

export const faqs = [
  {
    q: "What are the timings of The Study Syndicate Library?",
    a: "The library is open 24 hours a day, every day, so you can study when you focus best.",
  },
  {
    q: "Where is the library located?",
    a: `We are above Choudhary Car Accessories in Shastri Nagar, Jammu ${site.address.postalCode}, near Jandyal Bakers.`,
  },
  {
    q: "How much does it cost?",
    a: `The opening offer is ${rupees(offer.price)} for your ${offer.period}, instead of ${rupees(offer.regularPrice)} a month. It is a limited-time offer, so message us to confirm, it is still available.`,
  },
  {
    q: "How do I reserve a cabin?",
    a: `Message us on WhatsApp or call ${site.phoneDisplay}. We have ${cabins.total} personal numbered cabins, and we will confirm your cabin number once you reserve.`,
  },
  {
    q: "What facilities do I get?",
    a: "A personal numbered cabin with a lamp and power point, a fully air-conditioned silent hall, high-speed Wi-Fi, CCTV surveillance, RO water, a refreshment zone, and books and study resources.",
  },
  {
    q: "Are mock tests, notes and counselling really free?",
    a: `Yes. Mock tests in ${sundaySessions.subjects.join(", ")} are conducted and checked by us, and study notes and career counselling are included with your seat at no extra cost.`,
  },
  {
    q: "What are the Sunday doubt sessions?",
    a: `${sundaySessions.day} from ${sundaySessions.time}, you can bring your doubts in ${sundaySessions.subjects.join(", ")}, along with general questions about competitive exams.`,
  },
  {
    q: "Can I visit before joining?",
    a: "Yes. Call or message us on WhatsApp to plan a visit and see the library for yourself.",
  },
] as const;

export const faqSchema = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqs.map(({ q, a }) => ({
    "@type": "Question",
    name: q,
    acceptedAnswer: { "@type": "Answer", text: a },
  })),
};
