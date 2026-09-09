// FICTIONAL EXAMPLE - Acme Plumbing does not exist. Every number below was
// invented to show the finished SHAPE of a Google Ads proposal. Never send it
// to anyone.
//
// ⛔ Read the shape, not the story. This example still argues from a waste
// number read out of the prospect's account, which the current blueprint bans
// outright: /proposal has ZERO ACCESS and never opens a prospect's Google Ads
// account. A real proposal is built from public data only - their live ads,
// the results page, their website, and Google's search estimates.
// Flagged 1 September 2026; the copy below has not been rewritten to match.
import type { ProposalData } from "@/components/proposal/types";

export const example: ProposalData = {
  slug: "example",
  clientName: "Acme Plumbing",
  clientDomain: "acmeplumbing.example",
  clientFaviconUrl: "https://www.google.com/s2/favicons?domain=example.com&sz=64",
  preparedBy: "Your Name",
  preparedByCompany: "Your Agency",
  dateLabel: "Thursday 13 August 2026",
  expiryLabel: "Thursday 20 August 2026",
  heroLead:
    "We have not seen your ad account and we are not going to pretend we have. Everything here came from Google's public ad library, the live search results page, and your own website - the same things your customers can see.",

  sources: {
    label: "Read from Google's public ad library, the live results page and their own website",
    readOn: "13 August 2026",
  },

  scorecard: {
    overall: 38,
    overallReason:
      "The campaigns are structured sensibly and the ads are approved. The money is leaking underneath them: wrong searches, the wrong map, and two networks nobody switched off.",
    pillars: [
      { name: "Waste", score: 21, reason: "39 cents of every dollar went to a search, a suburb or a network that returned nothing." },
      { name: "Tracking", score: 45, reason: "Forms are counted. Phone calls are not, and for a plumber calls are most of the leads. Google is bidding half-blind." },
      { name: "Structure", score: 58, reason: "Emergency and drain searches share one ad group, so the emergency ad shows to people who wanted a drain cleaned." },
      { name: "Message match", score: 30, reason: "Every ad lands on the homepage. Someone who searched 'water heater repair' has to find it themselves." },
    ],
    note: "Scored from your own account data for the 30 days named above, plus a read of your landing pages. Overall is the average of the four.",
  },

  // 7,640 x 5% x 10% x 20% x $1,200 = $9,168/mo. Rounded DOWN to $8,400, and
  // priced at the bottom of the $1,200-$1,800 range the owner gave us.
  missedRevenue: {
    headline: "Bookings going elsewhere",
    unitLabel: "booking",
    startingMonthly: "$8,400",
    accessNote:
      "Every number below is either Google's own estimate or a figure you gave us. Nothing here is a reading of your ad account - we have not seen it, and we are not pretending otherwise.",
    inputs: [
      { key: "searches", role: "volume", value: 7640, min: 1000, max: 20000, step: 20,
        label: "searches a month across your 8 cities", source: "Google's estimate" },
      { key: "paidClick", role: "rate", value: 0.05, min: 0.01, max: 0.25, step: 0.005,
        label: "of searchers click a paid result", source: "planning assumption" },
      { key: "enquiry", role: "rate", value: 0.1, min: 0.02, max: 0.4, step: 0.005,
        label: "of those clicks becomes an enquiry", source: "planning assumption" },
      { key: "booking", role: "rate", value: 0.2, min: 0.05, max: 0.8, step: 0.01,
        label: "of enquiries turn into a booking", source: "your number" },
      { key: "value", role: "value", value: 1200, min: 200, max: 6000, step: 50,
        label: "an average booking is worth", source: "your number" },
    ],
    note:
      "We have rounded every step down, and used the bottom of the $1,200 to $1,800 range you gave us - the real number is higher if your average booking is. Disagree with any of it? Drag the slider and the total moves with you.",
    sourcesLine:
      "Search volume: Google Keyword Planner, your 8 cities, English, pulled 1 September 2026. Click, enquiry and booking rates are planning assumptions, not a measurement of your account. Booking value is yours.",
  },

  findings: {
    items: [
      {
        text: "312 clicks went to searches like 'plumber jobs' and 'how to fix a leaking tap'. None became a lead. There is no negative keyword list on the account.",
        dollars: "$1,840 a month",
        fix: "Negatives build - week 1",
        status: "critical",
      },
      {
        text: "Location targeting is set to 'presence or interest', so people reading about your city from anywhere see the ads. 94 clicks came from outside the service area.",
        dollars: "$760 a month",
        fix: "Targeting rebuild - week 1",
        status: "critical",
      },
      {
        text: "Both campaigns run on the Display and Search Partner networks. Those clicks converted at zero.",
        dollars: "$410 a month",
        fix: "Search only - week 1",
        status: "caution",
      },
      {
        text: "Three keywords took 60 or more clicks each and produced nothing. They are still live.",
        dollars: "$230 a month",
        fix: "Keyword cull - week 1",
        status: "caution",
      },
      {
        text: "Phone calls are not counted as conversions. Google only sees the form fills, so it is optimising for the smaller half of your leads.",
        dollars: "Settings only",
        fix: "Call tracking - week 1",
        status: "caution",
      },
      {
        text: "The good news: your best ad group, water heater repair, converts at $41 a lead. That is the template. The rest of the account should look like it.",
        dollars: "Working",
        fix: "Template - weeks 2 to 4",
        status: "positive",
      },
    ],
    competitorAds: {
      keyword: "emergency plumber toronto",
      ads: [
        { advertiser: "Rival Plumbing Co", displayUrl: "rivalplumbing.example/emergency", sitelinks: ["Upfront pricing", "24/7 emergency", "Read 612 reviews", "Book online"], callouts: ["Licensed and insured", "No overtime charges", "On site in 60 min"], rating: { stars: 4.9, count: 612 }, headline: "24/7 Emergency Plumber - On Site in 60 Minutes", description: "Licensed and insured. Upfront pricing before we start. Call now.", daysRunning: 284, hasCallAsset: true },
        { advertiser: "Metro Drain and Plumbing", displayUrl: "metrodrain.example/toronto", sitelinks: ["Flat rate pricing", "Same-day service", "Areas we serve"], callouts: ["Same price day or night", "Family owned since 2009"], headline: "Emergency Plumber Toronto - No Overtime Charges", description: "Same price day or night. 4.9 stars from 600+ reviews.", daysRunning: 191, hasCallAsset: true },
        { advertiser: "QuickFix Plumbers", displayUrl: "quickfix.example", headline: "Burst Pipe? We Answer at 2am", description: "Real people, real fast. Flat rate quoted on the phone.", daysRunning: 77, hasCallAsset: false },
      ],
      readout: "Three competitors have run the same ads for months, which means those ads pay. Two of the three show a call button on the ad. Yours does not.",
    },
    serp: {
      keyword: "emergency plumber toronto",
      rows: [
        { position: 1, title: "24/7 Emergency Plumber - On Site in 60 Minutes", domain: "rivalplumbing.example", breadcrumb: "rivalplumbing.example", snippet: "Licensed and insured. Upfront pricing before we start", isAd: true },
        { position: 2, title: "Emergency Plumber Toronto - No Overtime Charges", domain: "metrodrain.example", breadcrumb: "metrodrain.example", snippet: "Same price day or night. 4.9 stars from 600+ reviews", isAd: true },
        { position: 3, title: "Burst Pipe? We Answer at 2am", domain: "quickfix.example", breadcrumb: "quickfix.example", snippet: "Real people, real fast. Flat rate quoted on the phone", isAd: true },
      ],
      clientAbsent: "We searched this 6 times across the day. Your ad was not on the page once.",
      note: "Pulled Thursday 13 August 2026, location set to Toronto.",
    },
    landingShot: {
      fromAdHeadline: "Emergency Plumber Toronto - Same Day",
      url: "https://yourdomain.example/",
      screenshotUrl: "/images/proposal/landing-yourdomain.png",
      isHomepage: true,
      loadSeconds: 6.8,
      faults: [
        { label: "No phone number above the fold", detail: "A burst-pipe search converts on a call. There is nothing to tap without scrolling." },
        { label: "The page does not repeat the ad", detail: "The ad promises same-day emergency plumbing. The page headline says 'Welcome to Your Plumbing'." },
        { label: "Nine services listed", detail: "Someone with water coming through the ceiling has to find theirs." },
      ],
      readout: "Every emergency click you buy lands on your homepage and has to go looking. Your three competitors send theirs to a page about the exact job.",
    },
    paidPresence: {
      monthLabels: ["Sep", "Oct", "Nov", "Dec", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      series: [
        { name: "You", isClient: true, values: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0] },
        { name: "Rival Plumbing", values: [4, 4, 5, 5, 6, 6, 6, 7, 7, 7, 8, 8] },
        { name: "Metro Drain", values: [2, 2, 3, 3, 3, 4, 4, 4, 5, 5, 5, 6] },
        { name: "QuickFix", values: [null, null, null, 1, 1, 2, 2, 3, 3, 3, 4, 4] },
      ],
      readout: "Two of them have run ads every month for a year, and have been adding more. You have run none. Every month on that chart is a month their name was the only one a searcher saw.",
      methodLine: "Counted, not estimated: each point is how many of that advertiser's creatives were live that month, from the first-shown and last-shown dates Google publishes in its Ads Transparency Center. Pulled 1 September 2026.",
    },
    adImages: null,
    copyAudit: null,
    tracking: {
      urlChecked: "https://yourdomain.example/",
      checkedOn: "1 September 2026",
      headline: "There is no way for you to know which of your clicks turn into work.",
      checks: [
        { name: "Google tag", found: false, weight: "critical", meaning: "Nothing on the page tells Google a click became a lead, so its bidding is guessing." },
        { name: "Google Ads conversion", found: false, weight: "critical", meaning: "No form fill or call is being counted as a conversion anywhere." },
        { name: "Conversion Linker", found: false, weight: "important", meaning: "Even once a tag goes on, clicks would not be tied back to the ad that paid for them." },
        { name: "Phone snippet (call conversions)", found: false, weight: "critical", meaning: "Most plumbing leads are phone calls. None of yours are being counted." },
        { name: "GA4", found: true, weight: "nice", meaning: "Analytics is installed, so you can see traffic - but traffic is not leads." },
        { name: "Meta pixel", found: true, weight: "nice", meaning: "Facebook is measuring your site. Google is not." },
      ],
      limitNote: "What this is: a read of your page's public source code on the date above. We can see which tags are present. We cannot see whether a conversion action behind them is set up correctly, or whether it fires - that needs account access, and we have not asked for it.",
    },
    unusedProof: null,
    cro: {
      urlChecked: "https://yourdomain.example/",
      checkedOn: "1 September 2026",
      headline: "Four of the seven biggest leaks are open on the page your ads pay for.",
      vitals: { lcpSeconds: 6.8, inpMs: 240, cls: 0.24, mobileScore: 38, basis: "field" },
      checks: [
        { rank: 1, name: "The page matches the ad", status: "fail", detail: "The ad says 'same day emergency plumber'. The page says 'Welcome to Your Plumbing'." },
        { rank: 2, name: "One clear action above the fold", status: "fail", detail: "Nine nav links and no phone number before scrolling." },
        { rank: 3, name: "Loads in under 2 seconds on a phone", status: "fail", detail: "6.8 seconds to the main content, measured on real Chrome users." },
        { rank: 4, name: "Built for the phone first", status: "fail", detail: "The call button sits below three screens of text." },
        { rank: 5, name: "Proof where the doubt is", status: "pass", detail: "Google rating and review count are in the header." },
        { rank: 6, name: "A short form", status: "pass", detail: "Four fields, which is right." },
        { rank: 7, name: "The top objections answered", status: "unknown", detail: "No FAQ found, but you may answer these on the phone." },
      ],
      upsideNote: "Message match is the single biggest of these and it is free - the documented lift from aligning the page headline to the ad alone is 66%. We are counting that one at full value, the speed fix at half, and the phone-first fix at a quarter, because all three move the same number and stacking them would invent a figure.",
    },
    missing: ["Ad image trust read and the copy matchup are not in this example - they need a live Transparency Center pull."],
  },

  timeline: {
    rows: [
      { when: "Week 1", visible: "The four leaks above are closed: negatives in, targeting fixed, networks off, dead keywords paused. Phone calls start counting as conversions." },
      { when: "Weeks 2 to 4", visible: "The daily pass: every morning, yesterday's search terms are checked and the wrong ones blocked before they cost a second click. Two ads per group start competing." },
      { when: "Day 30", visible: "The re-audit. The same read as this one, on the same account, so you see the waste number move. That number is the report." },
      { when: "Month 2 onward", visible: "The winning ad group becomes the template and the rest of the account is rebuilt to match it, one service at a time." },
    ],
    expectation: "Month 1 is about stopping the bleed and getting Google honest data. Cost per lead moves in month 2 once Google is bidding on real conversions. Nothing here promises a number before then.",
  },

  investment: {
    options: [
      {
        name: "Stop the bleed",
        price: "$1,900",
        term: "per month, month to month. Cancel with 15 days notice.",
        included: [
          "The week-1 fixes, all four",
          "The daily search terms pass, every business day",
          "Phone call tracking wired and tested",
          "The day-30 re-audit, sent to you",
        ],
        recommended: true,
      },
      {
        name: "Stop the bleed + rebuild",
        price: "$3,000",
        term: "per month, month to month. Cancel with 15 days notice.",
        included: [
          "Everything in Stop the bleed",
          "One landing page per ad group, matched to the search",
          "Two ads per group tested every fortnight",
          "The account rebuilt around the winning template",
        ],
      },
    ],
    terms: "Ad spend is paid by you directly to Google and is not part of the fee. Everything built stays yours. Projections are modelled from your own data, not guarantees.",
    wasteReminder: "$1,900 a month to stop $3,240 a month leaving. This is not new budget. It is a share of money you are already spending, redirected to a person who watches it.",
  },

  proof: {
    items: [
      {
        name: "Jordan Kilpatrick-Smith",
        business: "Psychotherapy clinic, Toronto",
        result: "$50,000+ a year saved",
        detail: "Replaced admin staff with automated follow-up. 12+ leads a week, every one answered, with a 100% show rate.",
        quote: "Saved $50,000+ a year by replacing admin staff.",
        photoUrl: "/images/proof/jordan-kilpatrick-smith.jpg",
        videoUrl: "https://youtu.be/pwL-DXOxuOM",
        videoThumbUrl: "https://img.youtube.com/vi/pwL-DXOxuOM/hqdefault.jpg",
        disclaimer: "Results vary. This is one client's outcome, not a typical or promised result.",
      },
      {
        name: "Nate Bekmezian",
        business: "Straightline Design - exterior remodel, roofing and siding",
        result: "$45,000+ a year cut",
        detail: "Eliminated the receptionist role and cut a $26,000-a-year customer system to a fraction of it. Every lead answered.",
        quote: "Six figures a year saved in total, including a $26,000-a-year system cut to a fraction.",
        photoUrl: "/images/proof/nathan-bekmezian.jpeg",
        videoUrl: "https://youtu.be/KdSCFG56SNo",
        videoThumbUrl: "https://img.youtube.com/vi/KdSCFG56SNo/hqdefault.jpg",
        disclaimer: "Results vary. This is one client's outcome, not a typical or promised result.",
      },
    ],
    credentials: [
      "Google Ads API access on every account we run - every change is logged, nothing is done by hand.",
      "Read-only audit first, always. You saw the numbers before you saw a price.",
    ],
  },

  faq: [
    { q: "Do I have to give you control of my account?", a: "No. We work through manager access you can revoke in one click. The account, the data and the ad spend stay yours." },
    { q: "Why not just add the negatives myself?", a: "You can, and the audit tells you which ones. The value is the daily pass - new junk searches show up every day, and blocking them on day 1 costs $5 where blocking them on day 7 costs $35." },
    { q: "What if the waste comes back?", a: "Some of it tries to. That is what the daily pass is for, and the day-30 re-audit shows you the number so you never take our word for it." },
    { q: "When does my cost per lead drop?", a: "Waste stops in week 1. Cost per lead moves in month 2, once Google has 30 real conversions to learn from. Anyone promising faster is guessing." },
    { q: "What happens if I stop?", a: "Fifteen days notice, and everything built - negatives, tracking, pages - stays in your account." },
    { q: "Who actually does the work?", a: "The person you spoke to on the call. The scripts do the pulling and pushing; a human reads every search term before it is blocked." },
  ],

  close: {
    costReminder: "Every week this waits, another $750 goes to searches that will never call you.",
    ctaLabel: "Book the kickoff call",
    ctaUrl: "https://example.com/book",
  },
};
