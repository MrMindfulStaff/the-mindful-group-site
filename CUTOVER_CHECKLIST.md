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

## 3. Add domain to Vercel

In Vercel → the-mindful-group-site → Settings → Domains:

- [ ] Add `themindfulgroupinc.org`
- [ ] Add `www.themindfulgroupinc.org` (it will redirect to apex by default)
- [ ] Note the A record and CNAME Vercel asks for — typically:
  - Apex: `A 76.76.21.21` (or whatever Vercel shows)
  - www:  `CNAME cname.vercel-dns.com`

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

- [ ] Wix dashboard → Bookings → Settings → Online Booking → set to
  **off** the moment DNS flips. Have this tab open and ready.
- [ ] Note any forms / contact widgets you'll need to recreate elsewhere
  (you have inquiry forms + contact form + complaint form on the new site
  already — confirm no Wix-only intake you forgot)
- [ ] Export any data you want to keep (we already migrated 303 orientation
  bookings)

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
