# The Study Syndicate Library: Website and Admin

Website and admin app for **The Study Syndicate Library**, a 24-hour AC study library in Shastri Nagar, Jammu (180004). Private project, built and maintained by [TekSquad](https://teksquad.tech/) for the library's owner.

- Website: https://thestudysyndicate.tekbiz.dev
- Admin: https://thestudysyndicate.tekbiz.dev/admin (Google sign-in, approved accounts only)

## Who uses what

| Who                  | Uses                                 | For                                                                        |
| -------------------- | ------------------------------------ | -------------------------------------------------------------------------- |
| Students and parents | Public website                       | Facilities, offer, location, calling or WhatsApp to reserve                |
| Owner                | Admin app                            | Admissions, cabin bookings, fees and receipts, dashboard, backups          |
| Staff (later)        | Admin app                            | Day-to-day work. The role exists in the data model, but has no screens yet |
| Developer            | Convex, Clerk and Netlify dashboards | Deployments, backups, access changes                                       |

## How it fits together

- **Website** (`src/app/(site)`): mostly static pages. It loads no database or login code.
- **Admin** (`src/app/admin`): behind Google sign-in, excluded from search engines and the contact tracker.
- **Convex** (`convex/`): database and server functions, plus a daily job at 12:30 AM IST that closes expired bookings.
- **Clerk**: proves who someone is. **The `staffUsers` table decides what they may do.** Every Convex function checks this on the server.
- **Netlify**: hosts the site. Its build command also deploys the Convex functions.

## Business rules the system enforces

- One active cabin booking per student, and one student per cabin.
- Fees are never edited. A mistake is voided with a reason, and receipt numbers are never reused.
- A fee can't exceed the amount due or carry a future date.
- A student with a current booking can't be deactivated.
- Every change goes to the activity history (no personal details in the log).
- Students under 18 need a guardian's name and mobile number.

## Environments and secrets

|                    | Local development          | Production                                                                                   |
| ------------------ | -------------------------- | -------------------------------------------------------------------------------------------- |
| Convex             | dev deployment             | `keen-akita-170`                                                                             |
| Clerk              | test keys                  | live keys, domain `thestudysyndicate.tekbiz.dev` (secondary application)                     |
| Where secrets live | `.env.local` (git-ignored) | Netlify environment variables; `CLERK_JWT_ISSUER_DOMAIN` on the Convex production deployment |

**Never put live Clerk keys in `.env.local`.** Live keys only work on the live domain, and local pages hang on "Loading". `CONVEX_DEPLOY_KEY` is scoped to Netlify's Production context only.

## Runbook (developer)

**Deploy:** push to `main` with auto-publishing on. Netlify runs `npx convex deploy --cmd-url-env-var-name NEXT_PUBLIC_CONVEX_URL --cmd 'npm run build'`. Builds cost Netlify credits on the free plan, so batch changes.

**Add an admin** (use the person's exact Google address):

```bash
bunx convex run --prod seed:seedAdmin '{"email":"ADDRESS","name":"NAME"}'
```

**Remove access:** set `active` to `false` on their row in the `staffUsers` table (Convex dashboard, production).

**Weekly backup, and before big changes:**

```bash
bunx convex export --prod --path ./backups/
```

Store copies off this machine, encrypted. `/backups` is git-ignored. Practise a restore into a throwaway project, never production. The owner's Backup page gives readable CSVs only, not a restore point.

**Change the offer or prices:** `src/content/offer.ts` (public site) and `convex/lib/plans.ts` (admin). Keep them in sync, and update `public/llms.txt`.

**Update the cabin count on the public site:** `src/content/plans.ts` (manual for now).

**Keys leaked or lost:** rotate in the Clerk or Convex dashboard, update Netlify, redeploy with the cache cleared.

## Data and privacy

- **Held:** student name, mobile, exam, optional email, cabin, dates, fees and receipts, guardian details for under-18s.
- **Where:** Convex (servers outside India), with sign-in handled by Clerk.
- **Never held:** card details, ID documents. Payments are cash or UPI at the library.
- **Pages:** `/privacy` and `/terms` read from `src/content/legal.ts`. A lawyer should review them. India's DPDP Rules, 2025 apply notice, consent and children's-data duties from about May 2027, so verifiable parental consent for under-18s needs a proper flow before then.

## Decisions

- **Seat requests stay on WhatsApp and phone.** Cabins are assigned in person, so instant online booking invites fake holds.
- **Payments are recorded, not collected online.** No payment provider, so no card data to protect.
- **Convex plus Clerk** keep the stack small and free. The free plan has hard limits and no automatic backups, hence the weekly export.
- **Business-rule errors are returned as results**, not thrown, so the console shows only real faults.
- **Content lives in `src/content/`**, so most edits need no component changes.

## Known limitations and roadmap

- [ ] Go-live with real data (blocked on Netlify credits until the next cycle)
- [ ] Verifiable parental consent flow for under-18s
- [ ] Admin design pass from the owner's feedback
- [ ] Edit a booking, move cabin, refunds
- [ ] Student history page, cabin maintenance toggle
- [ ] Photo gallery (needs real photos)
- [ ] Staff screens
- [ ] Student login and self-service booking
- Public cabin meter and prices are updated by hand.

## Working on the code

Needs [Bun](https://bun.sh). Use test Clerk keys and the dev Convex deployment.

```bash
bun install
bunx convex dev   # one terminal
bun dev           # another terminal
```

`bunx convex dev` writes the Convex values into `.env.local`. Add the Clerk **test** keys there. Seed the dev database with `seed:seedCabins` and `seed:seedAdmin` (without `--prod`).

## Project structure

```
convex/        schema, functions, daily job, seed commands (lib/ holds shared helpers)
public/        images, logos, icons, llms.txt
src/app/       (site) public pages, admin/ app, sitemap, robots, manifest, 404, share images
src/components admin/, layout/, sections/, shared/, ui/
src/content/   public site content, including legal.ts
src/lib/       SEO schema builders
src/proxy.ts   Clerk middleware, runs for /admin only
```

## Credits

Designed and developed by [TekSquad](https://teksquad.tech/). All rights reserved.
