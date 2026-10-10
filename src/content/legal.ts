import { site } from "@/content/site";

export const legal = {
  updated: "10 October 2026", // update on the day you go live
  contactEmail: "", // add a real address when the library has one
};

export type LegalSection = { heading: string; blocks: (string | string[])[] };

const a = site.address;

export const privacy: LegalSection[] = [
  {
    heading: "Who we are",
    blocks: [
      `${site.name} runs the library at ${a.line1}, ${a.line2}, ${a.city}, ${a.region} ${a.postalCode}. In this policy, "we" means the library. You can reach us on ${site.phoneDisplay}.`,
    ],
  },
  {
    heading: "What we collect",
    blocks: [
      "On this website:",
      [
        "Anonymous visit statistics, such as pages viewed, device type and rough location. Our analytics does not use cookies and does not follow you across other sites.",
        "How many times the Call and WhatsApp buttons are tapped. We count taps, not who tapped.",
      ],
      "When you join the library:",
      [
        "Your name, mobile number and the exam you are preparing for, and your email if you give it.",
        "Your cabin, dates, fees paid and receipts.",
        "If you are under 18, your parent or guardian's name and mobile number.",
        "Notes our staff add to help run your booking.",
      ],
    ],
  },
  {
    heading: "Why we use it",
    blocks: [
      [
        "To give you a cabin and keep track of your booking.",
        "To issue receipts and keep our accounts.",
        "To remind you about renewals or dues by WhatsApp or phone.",
        "To keep the library safe and orderly.",
        "To follow the law.",
      ],
      "We do not sell your details.",
    ],
  },
  {
    heading: "Students under 18",
    blocks: [
      "If you are under 18, we ask for a parent or guardian's name and mobile number, and we take their consent before keeping your details. A parent or guardian can ask to see, correct or delete the details at any time.",
    ],
  },
  {
    heading: "Who can see your details",
    blocks: [
      "Only the owner and approved staff can see student records. They sign in with a Google account that we have approved. We use these services to run the library:",
      [
        "Netlify, which hosts this website.",
        "Convex, which stores our records on servers outside India, in the United States.",
        "Clerk and Google, which handle staff sign-in. Google Maps also shows the map on this website.",
        "WhatsApp, for messages you send us or we send you.",
        "A privacy-friendly analytics service for the visit statistics above.",
      ],
      "We share details with the authorities only where the law requires it.",
    ],
  },
  {
    heading: "How we protect it",
    blocks: [
      "Access is limited to approved accounts, changes to records are logged, and backups are kept privately. No system is completely secure. If we find that your details were exposed, we will tell you as the law requires.",
    ],
  },
  {
    heading: "How long we keep it",
    blocks: [
      "We keep your details while you are a member, and afterwards only for as long as we need them for accounts, receipts and legal reasons. After that we delete or anonymise them.",
    ],
  },
  {
    heading: "Your choices",
    blocks: [
      "You can ask what we hold about you, ask us to correct it, ask us to delete it, or withdraw your consent. Ask at the front desk, call us or message us on WhatsApp, and we will reply within a reasonable time. If you are unhappy with our answer, tell us first. You can also complain to the Data Protection Board of India, as the law allows.",
    ],
  },
  {
    heading: "Other websites",
    blocks: [
      "Links to WhatsApp, Instagram and Google Maps take you to services with their own privacy policies, which we do not control.",
    ],
  },
  {
    heading: "Changes",
    blocks: [
      "If we change this policy, we will update the date at the top of this page.",
    ],
  },
];

export const terms: LegalSection[] = [
  {
    heading: "About these terms",
    blocks: [
      `By using this website you agree to these terms. The website belongs to ${site.name}, ${a.city}.`,
    ],
  },
  {
    heading: "Using this website",
    blocks: [
      "The information here is for general guidance. Offers, prices, timings and facilities can change, and cabin availability changes daily. Call or message us to confirm before you rely on anything.",
    ],
  },
  {
    heading: "Cabins and fees",
    blocks: [
      "Asking for a cabin through the website, WhatsApp or phone is a request, not a booking. We confirm your cabin once we agree the dates and fee with you. Fees are paid at the library by cash or UPI, and we give a receipt for every payment. Refunds and cancellations follow the rules we explain when you join.",
    ],
  },
  {
    heading: "Library rules",
    blocks: [
      "The library is a quiet study space. Please keep silence, respect other students and the staff, and look after the furniture and equipment. The library is open 24 hours and has CCTV for safety. We may end a membership if someone repeatedly breaks the rules.",
    ],
  },
  {
    heading: "Your belongings",
    blocks: [
      "Please look after your own books, devices and valuables. We take care of the space but are not responsible for loss or damage to personal belongings, except where the law says otherwise.",
    ],
  },
  {
    heading: "Mock tests, notes and doubt sessions",
    blocks: [
      "We provide these to support your preparation. We cannot promise any exam result, rank or selection.",
    ],
  },
  {
    heading: "Our content",
    blocks: [
      "The logo, text, photos and design of this website belong to the library. Notes and test papers we give you are for your own study and should not be copied or sold.",
    ],
  },
  {
    heading: "Limits on our responsibility",
    blocks: [
      "To the extent the law allows, we are not responsible for losses that come from using this website or from relying on its information.",
    ],
  },
  {
    heading: "Changes and governing law",
    blocks: [
      "We may update these terms, and the date at the top of the page will change. These terms are governed by the laws of India, and the courts at Jammu will handle any dispute.",
    ],
  },
];
