# DNS Cutover Checklist — Wix → Next.js

Run this in order. Don't flip DNS until everything above the DNS step is done.

## 1. Set environment variables on Vercel (the-mindful-group-site project)

Required before cutover:

- [x] `RESEND_API_KEY` — already set (confirmed working)
- [x] `BOOKINGS_WEBHOOK_SECRET` — already set
- [x] `ANTHROPIC_API_KEY` — already set (chat assistant)
- [ ] `NEXT_PUBLIC_TURNSTILE_SITE_KEY` — Cloudflare → Turnstile → Create site →
  pick "Themindfulgroupinc.org", domain `themindfulgroupinc.org`, copy site key
- [ ] `TURNSTILE_SECRET_KEY` — paste secret from the same Turnstile site

After saving these, redeploy. The widget will start appearing on the contact /
book / complaints / inquire forms; until those keys are set the forms work
without a challenge.

## 2. Set environment variables on Vercel (mindful-lms project)

For SMS reminders:

- [ ] `TWILIO_ACCOUNT_SID` — Twilio console → Account Info
- [ ] `TWILIO_AUTH_TOKEN` — same place
- [ ] `TWILIO_FROM_NUMBER` — provisioned Twilio number in E.164 (`+1...`).
  Must be 10DLC-registered for US toll-free SMS or A2P-registered for a local
  number. New numbers take 1-3 business days to register; if cutover is
  sooner, ship without SMS — email reminders still work.

No redeploy needed for env-only changes on the LMS — the cron picks them up
on its next scheduled run (13:30 UTC daily). To verify sooner, hit the cron
endpoint manually:

```
curl -H "Authorization: Bearer $CRON_SECRET" \
  https://www.victorialms.com/api/cron/orientation-reminder?dryRun=1
```

Response should show `smsBreakdown` with counts that match `emailBreakdown`.

## 3. Add domain to Vercel ✅ DONE

Both domains have been added via CLI (`npx vercel domains add`).

- [x] `themindfulgroupinc.org` — added to project the-mindful-group-site
- [x] `www.themindfulgroupinc.org` — added to project the-mindful-group-site

Vercel confirmed the DNS records needed (registrar is **GoDaddy**,
current nameservers: ns71.domaincontrol.com / ns72.domaincontrol.com):

  | Record | Host | Value |
  |--------|------|-------|
  | A      | `@`  | `76.76.21.21` |
  | CNAME  | `www` | `cname.vercel-dns.com` |

Set these at login.godaddy.com → DNS → themindfulgroupinc.org.

## 4. Smoke test on the Vercel preview URL

Before flipping DNS, walk through these against
`https://the-mindful-group-site.vercel.app`:

- [ ] `/sitemap.xml` lists `themindfulgroupinc.org` URLs (not the vercel.app
  host) including `/book-online`, three `/inquire` pages,
  `/participant-complaints`
- [ ] `/robots.txt` is served and lists the sitemap URL
- [ ] `/book-online` shows "Where & How to Arrive" panel above the form
- [ ] Submit a real booking with a valid phone. Confirm:
  - Confirmation email arrives
  - VICTORIA admin shows the booking, phone in E.164 format
  - If TWILIO is configured: SMS arrives within ~60 seconds of the cron run
    (or trigger the cron manually)
- [ ] Submit one inquiry per service (career-development, mental-health,
  financial-literacy). Confirm Info@ receives an email with the service in
  the subject line
- [ ] Chat assistant: ask "when is the next orientation". Confirm the dates
  it lists match the current upcoming Tuesdays
- [ ] If Turnstile is configured: confirm the widget appears on all four
  forms and successful submissions work

## 5. Wix prep (BEFORE flipping DNS)

Don't change Wix's domain settings yet — just prepare:

- [x] Confirmed Wix services — all have `onlineBooking.enabled: true`:

  | Service | Type | Wix ID |
  |---------|------|--------|
  | CNA/CBRF Training Orientation | CLASS | `f1065f2c-c70c-49c5-aa36-7a9c0e9f985a` |
  | Construction Training Orientation | CLASS | `86549878-aa30-4d54-9ad9-c091f9d9c820` |
  | Career Development Assistance | APPOINTMENT | `34431885-4110-46cd-8c19-1c4f4948821a` |
  | Mental Health Counseling | APPOINTMENT | `0b9f2188-ff86-402d-acce-493f79dbe018` |
  | Financial Literacy | CLASS | `09e5f493-29dd-48eb-ae2e-7f2b00c8d9a9` |
  | Phlebotomy Orientation | CLASS (hidden) | `bf4b0954-96d1-4d3a-9989-739df8082832` |

  **At DNS flip:** disable `onlineBooking` on all five visible services
  via Wix dashboard (Bookings → each service → Edit → Online Booking → off).
  Have the Wix dashboard open in a tab before you flip.

  **Alternatively**, I can call the Wix API to bulk-disable them the moment
  you give the word — no dashboard clicking required.

- [x] Old Wix `/service-page/*` and `/booking-calendar/*` URL paths are
  covered by 301 redirects in `next.config.ts` (added 2026-05-26) so Google
  and bookmarks land on the right new-site pages after flip.

- [x] Confirmed no Wix-only intake is missing: the new site has booking
  forms (CNA/CBRF + Construction orientations via /book-online), inquiry
  forms (Career Dev / Mental Health / Financial Literacy via /programs/*/inquire),
  contact form, and complaint form.

- [x] 303 orientation bookings already migrated to VICTORIA. No additional
  data export needed before cutover.

## 6. Flip DNS

At your registrar (where `themindfulgroupinc.org` is registered — check
`whois themindfulgroupinc.org`):

- [ ] Replace Wix A record(s) at apex with Vercel A record
- [ ] Replace Wix CNAME at `www` with `cname.vercel-dns.com`
- [ ] If you want the old Wix site reachable for ~14 days as a fallback,
  before flipping add a `legacy.themindfulgroupinc.org` CNAME pointing
  at the Wix site (the existing CNAME target Wix uses today)

Propagation: 5 minutes to ~2 hours typically. Watch
`dig themindfulgroupinc.org` and `dig www.themindfulgroupinc.org`.

## 7. Immediately after DNS flip

- [ ] Disable Wix online booking (the tab you had open)
- [ ] `curl -I https://themindfulgroupinc.org/book-online` — expect 200 with
  `x-vercel-id` header
- [ ] Submit one real booking on the live domain. Verify it flows through
  exactly like the smoke test
- [ ] In Vercel → Analytics, confirm visits start showing up

## 8. Search Console

- [ ] In Google Search Console, verify the new property
  `https://themindfulgroupinc.org` (DNS or HTML file method — both work
  on Vercel)
- [ ] Submit the new sitemap: `https://themindfulgroupinc.org/sitemap.xml`
- [ ] If the old Wix property is verified, submit a Change of Address
  pointing at the new property

## 9. External link sweep (post-cutover, not blocking)

Any place a link to the old Wix booking flow lives:

- [ ] Google Business Profile (booking URL field)
- [ ] Facebook, Instagram, LinkedIn page bios
- [ ] Flyers / QR codes printed in the building or for community events
- [ ] Partner sites that link to the booking page
- [ ] Any auto-replies on Gmail / phone systems that reference the old URL

Mostly fine to fix gradually — the new site keeps the same paths
(`/book-online`, `/contact`, etc.) so most direct links should keep working.

## 10. After ~30 days

- [ ] Take down the legacy.* CNAME and the Wix site itself
- [ ] Cancel Wix subscription (or downgrade to free plan if you want to keep
  it as an archive)
