# The Study Syndicate Library: Website

Official website for **The Study Syndicate Library**, a premium 24-hour AC study library in Shastri Nagar, Jammu (180004).

**Live site:** https://thestudysyndicate.tekbiz.dev

## Features

- Fast, mostly static site: every section is a server component, with client JavaScript only where interaction needs it
- Sections: hero, facilities (bento grid), free extras and Every Sunday doubt sessions, plans with cabin availability meter, find us (entrance photo and map), and FAQ
- Mobile-first design with an animated off-canvas menu, a sticky Call/WhatsApp bar, and a scroll-to-top button
- Enquiries and reservations go through WhatsApp and phone (no backend yet)
- Local SEO: `Library` and `FAQPage` JSON-LD, sitemap, robots, canonical URLs, geo metadata, Open Graph and Twitter share images
- Accessible by default: keyboard navigation, focus handling, ARIA labels, and reduced-motion support

## Tech stack

| Area            | Choice                                             |
| --------------- | -------------------------------------------------- |
| Framework       | Next.js 16 (App Router, Turbopack) and React 19    |
| Language        | TypeScript                                         |
| Styling         | Tailwind CSS v4 and shadcn/ui (Radix, Nova preset) |
| Icons           | lucide-react                                       |
| Fonts           | Bricolage Grotesque and DM Sans via `next/font`    |
| Package manager | Bun                                                |
| Hosting         | Netlify                                            |

## Getting started

Requires [Bun](https://bun.sh) and Node.js 20 or newer.

```bash
bun install
bun dev
```

Open http://localhost:3000. To check a production build:

```bash
bun run build
bun start
```

## Environment variables

| Variable                | Purpose                                                                                                                                             |
| ----------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------- |
| `NEXT_PUBLIC_SITE_URL`  | The live site URL, with no trailing slash. It feeds canonical links, the sitemap, schema and share previews. Falls back to `http://localhost:3000`. |
| `NEXT_PUBLIC_GSC_TOKEN` | Optional. The `content` value of the Google Search Console HTML-tag verification.                                                                   |

`NEXT_PUBLIC_` values are baked in at build time. After changing one on Netlify, run **Deploys, Trigger deploy, Clear cache and deploy site**.

For local development, create a `.env.local` file (it is git-ignored).

## Project structure

```
public/
  images/            cabins.jpeg, entrance.jpeg
  site-logo.svg      navbar logo
  footer-logo.png    footer logo (also used in schema)
src/
  app/               layout, page, sitemap.ts, robots.ts, share images
  components/
    layout/          navbar, footer, sticky-contact-bar, scroll-to-top
    sections/        hero, facilities, free-and-sunday, plans, find-us, faq
    shared/          container, json-ld
    ui/              shadcn primitives
  content/           site.ts, offer.ts, plans.ts, facilities.ts, free-extras.ts,
                     sessions.ts, faqs.ts
  lib/               seo.ts (schema builders), utils.ts
```

Business content lives in `src/content/`, and components only render it, so most updates need no component changes.

## Updating content

| To change                                               | Edit                         |
| ------------------------------------------------------- | ---------------------------- |
| Phone, address, hours, links, map, coordinates, credits | `src/content/site.ts`        |
| Offer price and regular price                           | `src/content/offer.ts`       |
| Total and booked cabin count, plan inclusions           | `src/content/plans.ts`       |
| Facilities tiles                                        | `src/content/facilities.ts`  |
| Free extras                                             | `src/content/free-extras.ts` |
| Sunday doubt session day, time and subjects             | `src/content/sessions.ts`    |
| FAQ questions and answers                               | `src/content/faqs.ts`        |

Keep the **booked cabin count** in `plans.ts` current, and push after each change. Business name, address and phone must match the Google Business Profile exactly.

The facilities grid has 4 columns on desktop. If you add or remove a tile, keep the total a multiple of 4 by adjusting the `className` spans in `facilities.ts`.

## SEO

- Structured data is built in `src/lib/seo.ts` (`Library`) and `src/content/faqs.ts` (`FAQPage`)
- Share images are `src/app/opengraph-image.png` and `twitter-image.png` (1200x630, keep under about 300 KB). WhatsApp caches previews, so test with a changed query string such as `/?v=2`
- Search Console: add the live URL as a URL-prefix property, then submit `/sitemap.xml`

## Deployment

The site deploys to Netlify from the `main` branch. Every push to `main` goes live, so check `bun run build` locally first.

## Git workflow

- Commit style: [Conventional Commits](https://www.conventionalcommits.org) (`feat:`, `fix:`, `seo:`, `chore:`)
- `main` is always deployable

## Roadmap

- [ ] Performance and accessibility audit (Lighthouse)
- [ ] Photo gallery (needs more real photos)
- [ ] Locality line for nearby areas (180004 and 180010)
- [ ] Headless CMS for owner-editable content
- [ ] Admin panel and student portal (subscriptions, payments, mock test tracking)

## Credits

Designed and developed by [TekSquad](https://teksquad.tech/).

All rights reserved. This is a private project for The Study Syndicate Library.
