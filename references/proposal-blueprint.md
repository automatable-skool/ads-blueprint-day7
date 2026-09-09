# Proposal blueprint - Google Ads edition
Ported from the SEO proposal blueprint, 31 August 2026 · seven sections · zero account access

The spec behind `/proposal`. This is not a draft generator, and it is not an audit. What comes out is a **sales lead magnet a member sends to a prospect the same hour**, on their own domain, in their own brand, built entirely from public data.

**⛔ The rule the whole document rests on: ZERO ACCESS.** You never have the prospect's Google Ads account, you never ask for it, and nothing on this page is ever presented as a measurement of their account. This is what gets the call, not what follows it. Every number is either something publicly observable (their live ads, the search results page, their website), Google's own published estimate for a keyword (labelled as Google's), or an input the member supplied (labelled as theirs).

The bar: if any section still has a placeholder, a `[TBD]`, a bare metric with no consequence attached, or a number that is not in `context/proof.md`, it is not finished. Ask the user for the missing piece instead of shipping a hole.

---

## Where the data comes from - all of it public

| Source | What it gives | What it CANNOT give |
|---|---|---|
| Ads Transparency Center (Apify, by domain) | Their live creatives, first and last shown, days running, formats | Spend, keywords, match types, bids, clicks, conversions |
| Live SERP, location pinned in their service area | Who is bidding, how many advertisers, whether the prospect appears, LSA block | Anything about how those ads perform |
| Google Keyword Planner (the MEMBER's account) | Search volume and cost-per-click estimates for the prospect's services x city | Anything about the prospect - it is a keyword estimate, not their data |
| Their website, fetched | Ad destination (homepage or matched page), tap-to-call, form length, mobile load, single CTA | Anything behind a login |

**An empty Transparency Center result means "not verified or not advertising", never "no ads".** Say which, and confirm the domain a second way before claiming absence.

**Two lanes, and the page says which one it is:**
- **They are not advertising.** The story is the market they are absent from: the searches happening, the competitors collecting them, what entering costs.
- **They are advertising.** The story is what is publicly visibly wrong: ads landing on the homepage, creative unchanged for months, no tap-to-call, a message mismatch between the ad and the page.

Never a waste number. Never "you are losing $X in your account". You have not seen their account and the prospect knows it - one unprovable number and the whole document goes in the bin.

---

## Where it lives

The proposal is a page on the member's OWN site, not a PDF and not an attachment. They send a link.

| Path | What it is | Built when |
|------|-----------|-----------|
| `website/app/proposal/[slug]/page.tsx` | The renderer, dynamic, fetched per request | First run only |
| `website/components/proposal/` | The 7 section components + the close | First run only |
| Supabase `proposals` row | One client's data | Every run |

**The SEO repo shares this table with a different `data` shape.** Keep the random-hex slugs so rows never collide, and never assume a row this renderer did not write is readable by it.

**noindex is mandatory**, three places: `robots: { index: false, follow: false }` in the page metadata, the `/proposal` tree excluded from `app/sitemap.ts`, and `/proposal/` disallowed in `app/robots.ts`.

**Slugs are unguessable:** `<client-slug>-<8 random hex>`.

---

## The seven sections. Nothing else.

The order IS the sales argument: score + money left on the table → the findings → timeline → price → proof → FAQ → one click. **No other section exists.** No "what we'd do" (the timeline is the plan).

Sections are numbered 01 to 07 and every one has a kicker, a title, and a one-line lead.

**01 · The scorecard.** Four pillars scored **1-100** plus one overall number, every one of them scorable from outside:
- **Presence** - do they appear on the searches that matter, on paid, on the map pack, on LSA. Absent scores low and it is the easiest thing to prove on screen.
- **Message match** - does the ad's promise survive to the page, or does it dump onto a homepage.
- **Offer** - what they claim against what the market claims. No guarantee, no price, no speed promise where competitors all carry one, scores low.
- **Conversion path** - tap-to-call above the fold, form length, mobile load, one clear call to action.

Never score anything that needs their account: no quality score, no wasted spend, no impression share. If it cannot be seen from outside, it is not a pillar.

**02 · What this is costing you.** The money section, and the most important one in the document - and it is INTERACTIVE. **Missed bookings per month** and their dollar value, derived out loud, never asserted:

> searches a month (Google's estimate) → the share that click a paid result → the share of clicks that become an enquiry → the member's stated close rate → the member's stated average job value

**Every input is a SLIDER the prospect can drag, and the total recalculates live.** Nothing is hard coded. A prospect who disagrees with a number drags it and watches the total move - a number someone set themselves is a number they argue for on the call. A Reset button appears once anything is touched. **The rows stay CONDENSED** (Jono, 2 September 2026): one line per input - value, slider, short label - with the per-row source tags collapsed into the sources footer, the helper text cut to "Drag any number - the total moves", and the rounding note one small line under the sliders, never an alert box.

**Every starting value is rounded DOWN**, and value uses the bottom of the range the member gave - the honesty line under the arithmetic says so. **Ask for average job value and close rate - never substitute an industry average**, because the one number the prospect knows cold is what a job is worth to them, and getting it wrong ends the conversation.

The zero-access line prints above the calculator, always: every number is Google's own estimate or a figure the prospect gave, and nothing is a reading of their ad account.

State it as a fact, never a threat. The line is "here is what the market is worth and where it is going instead", not "you are burning money".

**03 · The findings.** One section, two jobs: the competitor gap table, then the three to five findings that hurt most.

For each competitor: **how long their ads have been running** (a creative alive 200+ days is one that pays), **what they lead with**, and **where the ad lands** - homepage or a matched page. Then the prospect's own row, in the same table, with the same columns, so the gap reads itself.

**⛔ Competitors are selected by LOCATION + SERVICES OFFERED, never by company name.** A competitor sells the SAME service to the SAME customers in the SAME city. The list comes from the live SERP, not from the prospect's opinion of who they compete with.

Findings are the publicly visible faults, each written as a consequence: "Every ad you run lands on your homepage. Someone searching for emergency drain clearing arrives at a page about your whole business and has to go looking." Never a fault you would need their account to see.

**The seven exhibits of section 03 - every one real or honestly null, never faked:**

- **The competitor ads pull** - verbatim copy from the Transparency Center, longest-running first, days running on every ad. ⛔ It no longer renders as its own card (cut 1 September 2026 - a visual duplicate of the SERP render): the pull exists to feed the copy matchup and the paid-presence chart.
- **The paid-presence chart** - live ads per month for the prospect and each competitor across the last 12 months, COUNTED from the Center's first-shown and last-shown dates. ⛔ Never an estimated-traffic or spend line drawn as fact: spy tools under-count local advertisers badly (Semrush returned nothing for two Toronto plumbers with dozens of live creatives). An estimate may only appear as a second, dashed, labelled line.
- **The live SERP render**, as before.
- **Their landing page as a phone-width SCREENSHOT** (screenshot, never a rebuild - the point is that it is really their page), with the visible faults marked and the ad headline it fails to repeat named above it. **Drawn as the Automatable audit graphic** (Jono, 1 September 2026): one rounded tile per fault with the X badge top-right, the audit's checklist idiom - but on the proposal's LIGHT palette, never a black card. No screenshot captured → the panel says so.
- **The tracking read** - their landing page's public source, checked for the Google tag, the Ads conversion tag, Conversion Linker, the phone snippet, GA4 and the Meta pixel, each with what its absence costs. **Every row carries the tool's real logo** (inline SVG - GTM diamond, Ads mark, GA bars, Meta loop), the pass/fail check at the row's right edge (Jono, 1 September 2026). Usually the most persuasive finding in the document: buying clicks without counting them. ⛔ The limit line always prints: presence is not proof it works, we can see the tags, we cannot see the account behind them.
- **The CRO score - the pull runs, the card does NOT render** (Jono, 1 September 2026). A separate "page, scored" section repeated what the landing-page card already shows, so it was deleted from the page. The CRO read still happens: its faults feed the landing-page card and the findings list, and the vitals feed the timeline's page-rebuild argument.
- **The copy matchup** - their line beside the market's best in the SAME angle, verbatim, days running on both, read against the six qualities (specific · differentiated · instantly clear · proof-backed · tight · angle-true). **Both ads render as REAL Google ads** (Jono, 1 September 2026): Sponsored label, favicon from the advertiser's real domain, name + display URL, the three-dot menu, blue headline, grey description - never a generic quote card. The domain comes from the scout pull, never guessed. **The verdict stays SHORT** (Jono, 1 September 2026, after trying full notes on the page): pass/fail pills ("specific" / "not specific"), then the gap sentence - what they do wrong and what the rival does better - as ONE highlighted line in the accent tint. The full per-quality notes stay in the data for the sales call; a wall of verdict prose under the ads killed the exhibit. **Under each ad, a one-line CRAFT LINE** (Jono, same day): up to three observable reads on length against the character limits, ad assets (sitelinks, call button, casing), and how the line is built - counted from the pull, never judged, muted type, ` · ` separated. ⛔ No score out of 10 (Jono's ruling, 29 August 2026) - the verdict is the ranking plus the named gap. Empty angles are listed as the open lane.
- **The unused-proof card** (added 2 September 2026) - proof the prospect OWNS but never puts in an ad: up to three claims verified on their own public pages. **Each tile DRAWS the gap**: an icon per claim, then a split panel - "On your pages" with the big accent number (five gold stars on a review claim) beside "In your ads" with a red zero on a red-tinted ground - and the source under it ("above the fold of your own landing page"). The split IS the graphic; never a text-only stat card. Scope the zero honestly - "any ad we pulled", never "all 64" unless every creative's text was read. The readout is the persuasion flip of the copy matchup: the rival sells with no proof, they sit on proof and use none of it. Renders after the copy matchup. ⛔ Every claim comes off their own pages or `context/proof.md` - never invented, source named on the tile.
- **The image trust read**, where their ads or competitors' carry images - real photo, stock, AI or illustration, plus a quality call. ⛔ "AI generated" is asserted as fact only when Google's own "How this ad was made" disclosure says so; everything else is a read, printed as one, with the visible tells named.

An exhibit whose pull failed is null and the section names what is missing. The prospect-is-not-advertising lane still renders the chart, the ads and the SERP - the market running without them IS the argument.

**Show the gap. Never show the playbook.** The keyword map, the negative list, the STAG structure, the ad library - those are the deliverable the client is buying. They do not appear. A proposal that hands over the plan has sold nothing.

**The metric rule, everywhere in 01-03:** no bare number ever ships. Every metric carries a consequence clause with a rank or a dollar in it. "1,900 searches a month" is banned. "1,900 searches a month for emergency drain clearing in Barrie, and your name is on none of them" ships.

**04 · Timeline.** The plan and the schedule are one section - each phase is a row with a date and a thing the client will be able to see, written as work landing, not features. Week by week for month one, then monthly.

**05 · Investment.** Pulled from `context/business.md`. One recommended option marked - accent border and badge - with at most one smaller fallback. Never three equal options. Each shows what is included.

Terms line, four facts: ad spend is paid by the client to Google directly and is never part of the fee · month-to-month after the first month, 30 days notice · everything built stays theirs · projections are estimates, not promises.

Never a discount line - a discount says the first number was padded.

**06 · Proof.** Only from `context/proof.md`: real faces, the number big and solid-accent, a VERBATIM quote - and **the video of them saying it, whenever one exists**. A written quote beside an unused video is the weakest version of the strongest asset: the card carries the video thumbnail, a play button and a "Watch them say it" label linking to the real video. **Every result with a number carries its disclaimer on the card** - "Results vary. This is one client's outcome, not a typical or promised result." - because the FTC and Google's unreliable-claims policy both read a testimonial number as what everyone gets. No case studies yet → the section becomes credentials plus process guarantees. **Never invent a case study.**

**07 · FAQ.** Six to eight questions that kill the real objections: how long until results, what happens if I cancel, do I own the work, why not just run ads, what if I already tried SEO, who actually does the work. Answers are short and direct, in a two-column grid. Scope questions and access questions live here as single answers if they come up in real objections - they never get their own sections.

**The close.** Directly under the FAQ: one action. A solid accent button (no gradient) - a booking link or a signature block, never both and never a list of options. Above it, a single sentence restating the cost of doing nothing from section 02; under it, the expiry line.

---

## The visual evidence layer

A wall of white text loses to a chart of the same fact every time. Every exhibit renders the REAL data step 3 pulled. **The hard rule: a visual that can't be backed by pulled data degrades to nothing - never to a decorative fake.** A made-up graph in a sales document is fabricated proof in a suit. One sanctioned exception: a **labelled demo exhibit** - real data pulled for another market, under a caution alert saying exactly what it is - for a member whose own business can't produce that exhibit and wants the client to see the format. Real data, honest label, never passed off.

**Section 03 is a two-column layout (placement rulings, Jono, 1 September 2026).** LEFT: the paid-presence chart and the tracking read, stacked - never full width. RIGHT, sticky: the SERP render ONLY - the competitor-ads card was cut because beside the SERP it read as the same graphic twice, and the SERP is the keeper (its pull still feeds the copy matchup). BELOW, full width: the landing-page card, the copy matchup, then the ranked findings list CLOSES the section - the exhibits argue first, the list concludes last. A finding in the list never repeats what an exhibit already shows - the duplicate gets cut from the list, not the exhibit.

- **The gap table.** `tableLayout: fixed`, NO horizontal scroll, short plain headers: Reviews · Visitors/mo · Searches ranked · Links from other sites. Winner row: green background + inline Crown icon on the same line as the domain (inline-flex, nowrap). Client row: accent tint.
- **Warning boxes.** Every metric where the client trails gets a design-kit alert - tinted background, coloured left edge, icon, one consequence sentence.
- **No competitor-ads card** - cut 1 September 2026 as a duplicate of the SERP render; the creatives appear inside the copy matchup instead.
- **The SERP render.** The live result for the money keyword with the Sponsored block, real titles and domains, positions never invented or reordered. **Prospect absent from the paid block → the red band: "We searched [keyword] from [city]. You did not appear."** That band is the single most persuasive thing on the page and it costs nothing to prove.
- **The landing experience strip.** Their ad's destination as a phone-width screenshot with the visible faults marked: no tap-to-call above the fold, the fold line, form field count, the load time. Only faults visible without logging in.
- **Not advertising at all:** the competitor-ads and SERP exhibits still render - they show the market running without them, which IS the argument. Nothing is faked to fill a slot.

**Implementation:** exhibits are components in `website/components/proposal/` rendering inline SVG/HTML from the client's data file - no chart library, no key-gated map embeds (OSM tiles are stitched to local images at pull time). If the data behind an exhibit failed to pull, the component renders nothing and the section says plainly which number is missing and what it would take to get it.

---

## Design - light, branded, no gradients

- **LIGHT theme only**, matching the member's site kit. Never a dark page, never gradients on text or boxes. Big numbers are solid accent from the member's ramp, never gradient-clipped.
- Page container 1152px. **Hero:** centered, off-white band (the site's warm neutral) with a hairline bottom border and a faint masked grid texture - NO radial glow. A thin bar above it: "[member name] · Proposal · Confidential". The hero carries the client favicon, a gradient-free headline, the lead, then four stat pills (Score X/100 · Losing $X/mo · Build N weeks · Valid until [date]) and the prepared-by line.
- Sections alternate white / off-white full-bleed bands. Every section: tracked uppercase kicker with one Lucide icon (`npm install lucide-react` at chassis build - part of the chassis, never per-proposal), big H2, one-line lead.
- Cards: white, hairline border, 18px radius, soft shadow. Recommended/premium cards get a solid accent border - no glow ring.

## The jargon ban

Plain words a 10-year-old gets, across the whole document. Numbers stay exact; only the words simplify.

| Banned | Say instead |
|--------|-------------|
| impression share | "how often you show up when someone searches" |
| match type / broad match | "how loosely Google matches what people type" |
| negative keywords | "the searches we block so you stop paying for them" |
| quality score | "Google's rating of how well your ad and page fit the search" |
| CPC / CPA | "what a click costs" / "what a lead costs" |
| conversion tracking | "counting the calls and forms the ads actually produced" |
| landing page / message match | "the page the ad sends people to" / "the page saying what the ad promised" |
| RSA / responsive search ad | "the ad" |
| Ads Transparency Center | "Google's public library of ads that are running" |

---

## Data sources

Free tier first, always. The member must be able to run their first proposal without paying anything.

| Source | What it gives | Cost |
|--------|--------------|------|
| Their website (direct fetch) | Ad destination, tap-to-call, form length, one CTA | Free |
| PageSpeed Insights API | Mobile load time on the page the ad lands on | Free |
| Ads Transparency Center (Apify) | Their live creatives, days running, formats | ~$4 per 1,000 results |
| Live SERP capture | Who is bidding, advertiser count, LSA block, whether they appear | Free by hand, cheap by API |
| Google Keyword Planner (MEMBER's account) | Search volume and CPC estimates for their services x city | Free, needs Basic access |

**The cost guard.** The Transparency Center pull is the only paid step and it is cents per prospect. Warn before any run that would exceed roughly $2, and never re-pull data less than 24 hours old - the Center refreshes slowly and a second pull buys nothing.

**Spy-tool substitution:** Semrush or SpyFu can cross-check who is advertising, but they badly under-count local advertisers - a zero from them is a coverage gap, never evidence the prospect is absent. The Transparency Center and the live SERP are the sources; spy tools are a second opinion.

**When a source fails:** degrade, never fabricate. A Transparency Center pull that returns nothing means section 03 says "not verified or not advertising" and names which, rather than asserting they run no ads. It never means an estimated number. Any section running on partial data says which number is missing and what it would take to get it.

---

## Voice and polish

- **It has to feel premium.** The bar is a document from a firm that charges five figures without blinking: generous whitespace, a restrained palette from the member's kit, large confident numbers, real visual hierarchy, no walls of text - and the full visual evidence layer above, rendered. If a section reads like a report, cut copy until it reads like an argument; if a fact can be a chart, it is one. Look at the rendered page and ask: would a $15K/year client feel they're buying from the expensive firm or the cheap one?
- **Less writing, less technical, more sales.** Body copy across the whole proposal stays under roughly 900 words outside tables and the FAQ. Every paragraph either scores, costs, proves, or asks - a paragraph that educates gets cut. The client hires the member so they don't have to understand SEO.
- Reads from the member's own proof and numbers in `context/proof.md`, not in generic agency English. Same anti-slop layer as every other command. There is no voice file on the ads side.
- No em-dashes anywhere, in the page copy or the chat reply. Regular hyphens only.
- No emojis.
- The client's own logo (favicon) and name in the hero, with a prepared-by line, the date, and an expiry date about 14 days out. Expiry creates the deadline that makes a proposal close.
- Design comes from the site the member already built - `design/sites/` for the pre-built look, or `design/kit/` if they dropped in their own kit. It looks like their brand rather than this repo's. If neither exists yet, run `/build-website` first: the proposal is a page on their own domain and it has nothing to inherit from.
- **Mobile first - most proposals get opened on a phone, and the phone render is the one that closes or kills the deal.** The rules: everything stacks to ONE column at phone width (the findings two-column layout becomes left-column content first, then the SERP and GBP exhibits in normal flow - sticky off); pillar meters go 2x2; hero stat pills wrap; the gap table fits 390px with no horizontal scroll (fixed layout + short headers is what makes this possible); the geo grid map scales down intact; every button and FAQ row is a full-width tap target. Verify by SCREENSHOTTING at 390px and LOOKING - a page that renders at 1440px and overflows at 390px is not finished.

## The gate

The 9 out of 10 rule applies to the whole document before the link is handed over. Score it honestly on: does section 02 produce a number that hurts, does section 03 make the gap feel urgent, is the price justified by what came before it, and would the member be comfortable sending this to their best prospect. Say what is dragging it down and fix it before reporting done. Never inflate the score to finish the run.
