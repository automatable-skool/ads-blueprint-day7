---
description: The finished client proposal - a live page on your own site, ready to send
argument-hint: [client website URL]
---

Build a **finished, send-ready proposal** for the prospect at $ARGUMENTS (if empty, ask whose website it is). Not a draft, not a template with gaps. When this run ends the user has a link they can paste into an email to a prospect.

Read `references/persuasion.md` and `references/proposal-blueprint.md` first - it holds the 7-section spec (score + money lost → findings → timeline → price → proof → FAQ → one click, and NOTHING else), the data sources, and the positioning rules.

**⛔ ZERO ACCESS. This is a sales lead magnet, not an audit.** You will never have the prospect's Google Ads account, and you must never ask for it. Everything on this page is built from public data: their live ads in the Ads Transparency Center, the live search results page, their website, and Google's own search-volume estimates pulled through the MEMBER's account. **Never run `/audit` against anyone's account for this. Never read the member's own account either - it is not the subject.** If any instinct says "I need their account to price this", the answer is no: price it off the market, exactly like the SEO proposal does.

**1. Gate on pricing.** Open `context/business.md`. If the packages table is still empty, stop and walk the user through filling it right now, one field at a time. A proposal with a blank price is not a proposal.

**2. Gate on context.** `context/proof.md` feeds the proof section (06). Empty? Run `/context-layer` first, then come back. Never write a proposal with nobody's proof. **There is no voice file on the ads side** - the proposal is written from the proof and the numbers, not from a personal register.

**3. Gate on the keys, then pull the data.** Check `.env` BEFORE the first paid call:
- `APIFY_TOKEN` should already exist from `/scrape-competitors` - only if genuinely missing, run the 30-second apify.com walkthrough and save it.
- The member's own Google Ads API connection (from `/api-setup`) is what reads Keyword Planner volumes. Explorer access cannot pull Planner volume - if the member is still on Explorer, say so and take the CSV lane in `/keywords` instead. **This is the member's account, used to size a market. It is never the prospect's account and never reads anything about them.**
- Never start the pull with a key missing, and never silently skip a source because its key was not there - a section that runs keyless degrades per the blueprint AND says the key was the reason.

Then pull, free tier first, per the blueprint's source table:
- **Their live ads** - Ads Transparency Center via Apify (`solidcode/ads-transparency-scraper`), searched by DOMAIN. Record every creative, its first and last shown dates, and how many days it has been running. **An empty result means "not verified or not advertising", never "no ads"** - say which, and check the domain a second way before claiming absence.
- **The live SERP** - their money keywords with the location pinned inside their service area, mobile and desktop, one pass. Who is bidding, how many advertisers, whether the prospect appears at all, whether the LSA block sits above everything.
- **Search volume** - Keyword Planner through the member's account, for the prospect's services × their city. This is Google's own estimate for a keyword and is always labelled as Google's estimate, never as a measurement of the prospect.
- **Their landing experience** - fetch the page their ad lands on (or their homepage if they run no ads): does the ad land on the homepage or a matched page, is there a tap-to-call above the fold, how many form fields, is there one clear call to action. Capture a PHONE-WIDTH screenshot of it, saved locally - it renders in section 03 with the faults marked, and a screenshot beats any rebuild because it is undeniably their page.
- **Their tracking, from the page source** - grep the fetched HTML for the Google tag (`gtag/js`, `googletagmanager`), an Ads conversion (`AW-`), Conversion Linker, the call-tracking phone snippet, GA4 (`G-`) and the Meta pixel (`fbq(`). Report found/not-found per tag with what each absence costs. ⛔ Presence is not proof it fires - the exhibit's limit line says we read the source, not the account.
- **Their speed and CRO score** - the free PageSpeed Insights API for LCP, INP, CLS and the mobile score (field data preferred, labelled lab when that is all there is), then the page against `references/cro-cheatsheet.md` top to bottom. This is the CRO audit a stranger can run, and it is what `/landing-page` fixes in week one.
- **The paid-presence chart** - from the Transparency Center pull, derive live-ads-per-month for the prospect AND the top competitors across the last 12 months, counted from first-shown and last-shown dates. Counted, never estimated - the method line prints under the chart.
- **The copy matchup** - where the prospect runs ads, put each of their lines beside the market's best in the same angle (verbatim, days running on both) and read theirs against the six qualities from `references/persuasion.md`. No 1-10 score - the ranking and the named gap are the verdict. Where they run none, the matchup is replaced by the not-advertising lane.
- **The ad images** - where image assets exist in the pulled creatives, judge each: real photo, stock, AI or illustration, high or low quality, with the tells named. ⛔ Assert "AI generated" only when Google's "How this ad was made" panel discloses it; otherwise it is a read and renders as one.

Any source that fails degrades the section and says so in the report. **It never becomes an estimate.**

**4. Do the money maths out loud - and build it as SLIDERS.** Section 02 is the one that closes. Ask the user for the prospect's average job value and close rate if they are not already known - **do not substitute an industry average.** Show the arithmetic on screen before it goes in the document: searches a month → the share that clicks a paid result → the share that becomes an enquiry → close rate → job value. Every input is either Google's published estimate (labelled) or a number the member supplied (labelled), every starting value is rounded DOWN, and **each input ships as an adjustable slider** (`missedRevenue.inputs` in `components/proposal/types.ts`) so the prospect can drag any number they doubt and watch the total move. Set `startingMonthly` to the product of the starting values - the hero prints it, and it must match what the slider shows on load. **Nothing on this page is ever presented as a measurement of the prospect's account, because you have not seen it.**

**5. Build it. The proposal lives in Supabase, and the URL is dynamic.**

**Where the data lives:** one row in the `proposals` table, never a file in the repo. The route fetches it by slug at request time, so editing a row shows up on the next page load with no rebuild and no redeploy.

**Three keys, all from `.env`** (`references/proposal-blueprint.md` has the dashboard paths):
- `SUPABASE_DB_URL` - build-time only. Runs the DDL on first setup. Never read by the running site.
- `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` - what the server reads on every request.

Any missing? Stop and walk me through getting them - the connection string is Connect → **Session pooler** (never Direct; it is IPv6-only and fails on most networks), the other two are Settings → API.

**First run only - the setup, in this order:**

1. **Create the table** over `SUPABASE_DB_URL`:
   ```sql
   create table if not exists public.proposals (
     slug        text primary key,
     client_name text not null,
     data        jsonb not null,
     expires_at  date,
     created_at  timestamptz not null default now(),
     updated_at  timestamptz not null default now()
   );
   alter table public.proposals enable row level security;
   revoke all on public.proposals from anon, authenticated;
   ```
   **RLS on with ZERO policies is deliberate, not unfinished.** Anon cannot read a single row; `service_role` bypasses RLS. Never add a policy to "make it work" - if a read fails, the key is wrong.
   The body is `jsonb` because `ProposalData` in `components/proposal/types.ts` is the contract. Never explode it into columns.

   **⛔ The SEO repo shares this table.** Its rows carry a different `data` shape. Never assume a row you did not write is readable by this renderer, and keep the random-hex slugs so the two never collide.

2. **Confirm `next.config.mjs` has no `output: "export"`.** The template ships without it precisely so this route works - just check. A static export has no server to read the row.

3. **Write `lib/supabase.ts`** - a server-only client built from `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY`. **Never import it from a `"use client"` file, and never prefix either key with `NEXT_PUBLIC_`.**

4. **Build the chassis if it does not exist:** `app/proposal/[slug]/page.tsx` plus the section components in `components/proposal/`.

**The route - dynamic, not prebuilt:**
- **Delete `generateStaticParams()` and `dynamicParams = false`.** They are what froze the slug list at build time.
- `export const revalidate = 0` so an edited row appears immediately.
- Fetch `.eq('slug', slug).maybeSingle()`. No row, or any error → `notFound()`. Never an error page that reveals whether the row was missing or the query failed.
- `generateMetadata` keeps `robots: { index: false, follow: false }` on every path, including the not-found one.

**⛔ Slugs must be unguessable: `<client-slug>-<8 random hex>`,** e.g. `joes-plumbing-a7f3c9e2`.

**Every run after the first writes ONE ROW** - upsert on `slug`, setting `client_name`, `data` and `expires_at`. No file in `content/proposals/`, no registry edit, no commit, no redeploy.

Design comes from the site's existing styles so it wears the member's brand, not this repo's. Hero carries the prospect's favicon, their name, a prepared-by line, the date, and an expiry 14 days out.

**6. noindex, three places.** Metadata on the proposal page exports `robots: { index: false, follow: false }`, the `/proposal` tree is excluded from `app/sitemap.ts`, and `app/robots.ts` disallows `/proposal/`. Verify all three.

**7. Test it.** Run the build and load the LIVE page before saying a word about it - a green build no longer proves the data resolves, because the data is fetched at request time. Also verify: a wrong slug returns 404 rather than an error page, and `SUPABASE_SERVICE_ROLE_KEY` appears nowhere in the HTML or any JS chunk (`curl` and grep - if it is there, stop and rotate the key). Screenshot it.

**8. Score it, honestly.** The 9 out of 10 gate covers the whole document: does section 02 produce a number that hurts, does section 03 make the gap urgent, is every exhibit real or honestly null, and would the member send this to their best prospect. Under a 9, say what is dragging it down and fix it.

**9. Hand it over.** Give the live URL, the local preview URL, and a clickable link to every file written. Then the one thing that closes it: send the link, never an attachment, and follow up.

**Focus mode:** `/proposal <slug> pricing` rewrites section 05 from the current `context/business.md` · `/proposal <slug> competitors` refreshes section 03's data · `/proposal <slug> refresh` re-pulls all data and resets the date and the expiry.
