// The shape of one Google Ads proposal - the 7-section spec, ads edition.
//
// ⛔ ZERO ACCESS is the rule the whole shape rests on. We never see the
// prospect's Google Ads account, so there is no waste number anywhere in here.
// The spine is MISSED REVENUE: what the market is worth by Google's own search
// estimates, opened in the hero, adjustable by the prospect in section 02, and
// the fee in 05 sits under it. Every number on the page is one of three things
// and says which: publicly observable, Google's estimate, or a figure the
// member supplied. Hard rule everywhere: an exhibit whose data failed to pull
// is null and the section says which number is missing. Never a fake.
//
// Where a proposal lives: one row in the Supabase `proposals` table (data is
// this object as JSON), or - with no Supabase keys set - one file in
// website/content/proposals/<slug>.ts for local preview. See lib/proposals.ts.

export interface ScorePillar {
  name: string;
  /** 1-100. null = honestly not applicable (shown unscored, with the reason). */
  score: number | null;
  reason: string;
}

/** Section 02. The prospect ADJUSTS these - every input is a slider, and the
 * number recalculates live. Nothing here is a reading of their ad account.
 * Exactly one input has role "volume" (it starts the funnel), one has role
 * "value" (it prices what is left), and everything between is a "rate". */
export interface RevenueInput {
  key: string;
  role: "volume" | "rate" | "value";
  /** Plain words under the number, e.g. "searches a month across your 8 cities". */
  label: string;
  /** Where it came from, printed verbatim: "Google's estimate", "planning
   * assumption", or "your number". A number with no source is not shippable. */
  source: string;
  /** The starting position. Rounded DOWN at every step - never flattering. */
  value: number;
  min: number;
  max: number;
  step: number;
}

export interface MissedRevenue {
  /** The five inputs, in the order they multiply. All adjustable. */
  inputs: RevenueInput[];
  /** What is going elsewhere, e.g. "Bookings going elsewhere". */
  headline: string;
  /** The word for one conversion: booking, job, case, patient. */
  unitLabel: string;
  /** The starting total, spelled out, e.g. "$8,400". The hero and the stat pill
   * render this on the server; the slider recomputes it live from `inputs`.
   * It MUST equal the product of the starting values or the page contradicts
   * itself the moment someone scrolls. */
  startingMonthly: string;
  /** The honesty line under the arithmetic - what was rounded down and why. */
  note: string;
  /** The zero-access line printed above the calculator, always. */
  accessNote: string;
  /** One footnote naming the sources and the pull date. */
  sourcesLine: string;
}

/** One audit finding, written as a consequence with its price tag and its fix. */
export interface Finding {
  /** One line: what is happening and what it costs them. */
  text: string;
  /** The dollars a month, e.g. "$1,840 a month" - or "settings only" for unpriced probes. */
  dollars: string;
  /** The named fix that lands in the timeline, e.g. "Negatives build - week 1". */
  fix: string;
  status: "positive" | "caution" | "critical";
}

/** A competitor's LIVE ad from the Ads Transparency Center - real copy, real
 * run length. Never rewritten, never reordered. Sorted by daysRunning desc. */
export interface CompetitorAd {
  advertiser: string;
  /** The display URL Google prints under "Sponsored", e.g. "www.acme.com/emergency". */
  displayUrl: string;
  headline: string;
  description?: string;
  daysRunning: number;
  /** Sitelink labels, verbatim. Google shows up to 6 on desktop. */
  sitelinks?: string[];
  /** Callout text, verbatim - the dot-separated line under the description. */
  callouts?: string[];
  /** Seller rating where the ad carries one, e.g. { stars: 4.8, count: 412 }. */
  rating?: { stars: number; count: number };
  /** True when the ad shows a phone number / call asset. */
  hasCallAsset?: boolean;
}
export interface CompetitorAdsExhibit {
  keyword: string;
  ads: CompetitorAd[];
  /** One sentence on what the set says, e.g. "6 of 8 run a call asset. You don't." */
  readout: string;
}

/** Their landing page scored against references/cro-cheatsheet.md, plus real
 * Core Web Vitals from the PageSpeed Insights API (free, no account needed).
 * Everything here is visible from outside - this is the CRO audit a stranger
 * can run, and it is what /landing-page fixes in week one. */
export interface CroCheck {
  /** The cheatsheet item, in the prospect's words, e.g. "The page matches the ad". */
  name: string;
  status: "pass" | "fail" | "unknown";
  /** What was actually seen. Required on a fail. */
  detail: string;
  /** Ordered by the cheatsheet - 1 is the biggest leak. */
  rank: number;
}
export interface SpeedVitals {
  /** Largest contentful paint, seconds. Good is 2.5 or under. */
  lcpSeconds: number | null;
  /** Interaction to next paint, milliseconds. Good is 200 or under. */
  inpMs: number | null;
  /** Cumulative layout shift. Good is 0.1 or under. */
  cls: number | null;
  /** PageSpeed Insights mobile performance score, 0-100. */
  mobileScore: number | null;
  /** "field" = real Chrome user data (believable). "lab" = simulated. */
  basis: "field" | "lab" | null;
}
export interface CroExhibit {
  urlChecked: string;
  checkedOn: string;
  checks: CroCheck[];
  vitals: SpeedVitals;
  /** The headline read, e.g. "Four of the seven biggest leaks are open." */
  headline: string;
  /** What a fix is worth, stated as a range with the assumption named - never
   * stacked. Largest lever at 100%, the next at 50%, the third at 25%. */
  upsideNote: string;
}

/** What their page source says about measurement. Read from the public HTML of
 * the page their ad lands on - no account access, nothing behind a login.
 * This is usually the single most persuasive finding in an ads proposal:
 * buying clicks without counting them is the most expensive thing on this list.
 *
 * ⛔ The honest limit, printed on the page: presence is not proof it WORKS. You
 * can see a tag in the source; you cannot see whether the conversion action
 * behind it is primary, correctly counted, or firing. Say "we can see X" and
 * "we cannot see Y" - never "your tracking is broken". */
export interface PixelCheck {
  /** e.g. "Google tag", "Google Ads conversion", "Conversion Linker",
   * "Phone snippet (call conversions)", "GA4", "Meta pixel". */
  name: string;
  found: boolean;
  /** What its absence costs, or what its presence means. One line. */
  meaning: string;
  /** Why it matters enough to be on the page at all. */
  weight: "critical" | "important" | "nice";
}
export interface TrackingExhibit {
  /** The exact URL whose source was read, and when. */
  urlChecked: string;
  checkedOn: string;
  checks: PixelCheck[];
  /** The headline read, e.g. "You are buying clicks and not counting them." */
  headline: string;
  /** The limit of what a source read can tell anyone. Always printed. */
  limitNote: string;
}

/** Their ad copy, put beside the market's best in the SAME angle. This is
 * `/write-ads` gate 2 pointed at a prospect: a forced comparison, because a
 * yes/no read drifts generous and a comparison against real live copy cannot.
 *
 * ⛔ No score out of 10 (Jono's ruling, 29 August 2026, google-ads.md section 9).
 * A numeric rubric measures compliance rather than persuasion. The verdict here
 * is the RANKING plus the named gap, judged on the six qualities in
 * references/persuasion.md - and days running is the market's own verdict,
 * since nobody keeps paying to run a loser. */
export interface CopyQuality {
  /** One of: specific · differentiated · instantly clear · proof-backed · tight · angle-true. */
  name: string;
  passes: boolean;
  /** Why, in the prospect's words. Required when passes is false. */
  note: string;
}
export interface CopyMatchup {
  /** The angle both ads are playing: keyword, offer, proof, speed, risk reversal, ask. */
  angle: string;
  /** `domain` renders the favicon + display URL of the Google-look ad card.
   * `facts` is the craft line under the ad - up to three OBSERVABLE reads on
   * length vs the character limits, ad assets (sitelinks, call button), and
   * how the line is built. Counted from the pull, never judged. */
  theirs: { headline: string; description?: string; daysRunning: number | null; domain?: string; facts?: string[] };
  /** The market's best in that angle, longest-running first. Verbatim, never rewritten. */
  best: { advertiser: string; headline: string; description?: string; daysRunning: number; domain?: string; facts?: string[] };
  /** 1 = theirs wins the angle. Higher = how far down it ranks. */
  theirRank: number;
  /** The six qualities, read against THEIR line. */
  qualities: CopyQuality[];
  /** The one sentence that names the gap and what it costs. */
  gap: string;
}
/** Proof the prospect OWNS but never puts in an ad - each item is a claim
 * verified on their own public pages (never invented, source named on the
 * tile), set against how many of their live ads use it: zero. The persuasion
 * flip of the copy matchup: the rival sells with no proof, they sit on proof
 * and sell with none of it. */
export interface UnusedProofItem {
  /** The number, big: "78", "1,000+", "top 1%". */
  stat: string;
  /** What it is: "five-star reviews on Trustindex". */
  label: string;
  /** Where it was read, e.g. "above the fold of your own landing page". */
  source: string;
}
export interface UnusedProofExhibit {
  /** e.g. "Three claims you own. Zero of your 64 ads use any of them." */
  headline: string;
  items: UnusedProofItem[];
  readout: string;
}

export interface CopyAuditExhibit {
  matchups: CopyMatchup[];
  /** The count that lands it, e.g. "Their line ranks last in 3 of 4 angles." */
  headline: string;
  /** Angles nobody in the market runs - the open lane. */
  emptyAngles: string[];
  /** Null when they run no ads at all: the section says that instead. */
  notAdvertising?: boolean;
}

/** Image assets pulled from their live ads, judged on whether a stranger would
 * believe a real business took the photo. Real photography beats stock by a
 * wide margin - one swap lifted signups about 161% - and the gap is the whole
 * point of this exhibit.
 *
 * ⛔ Never assert "AI generated" as a fact about a named competitor. Google has
 * required AI disclosure since July 2026 and shows it in the ad's "How this ad
 * was made" panel: where that panel says so, the verdict is `disclosed` and
 * the source is Google. Everything else is a READ, printed as one, with the
 * tells named so the prospect can look and judge for themselves. */
export interface AdImageAudit {
  advertiser: string;
  isClient?: boolean;
  imageUrl: string;
  /** What kind of image it is. "unknown" is a valid, shippable answer. */
  verdict: "real" | "stock" | "ai" | "illustration" | "unknown";
  /** "disclosed" = Google's own AI panel said so. "read" = our judgement. */
  basis: "disclosed" | "read";
  /** Why - the visible tells, named. Required whenever basis is "read". */
  tells: string[];
  /** Craft, separate from provenance: is it sharp, lit, cropped, on-brand. */
  quality: "high" | "low";
  /** One line on what it costs them, or wins them. */
  readout: string;
}
export interface AdImageExhibit {
  items: AdImageAudit[];
  /** The count that makes the argument, e.g. "5 of 7 competitors run stock." */
  headline: string;
  /** The evidence line for why this matters at all. */
  note: string;
}

/** The paid-presence chart - who has been in the auction all year, and who
 * has not. COUNTED, not estimated: every point is how many creatives that
 * advertiser had live that month, derived from the first-shown and last-shown
 * dates the Ads Transparency Center publishes.
 *
 * ⛔ This is deliberately NOT estimated paid traffic or spend. Spy tools
 * under-count local advertisers badly - Semrush returned nothing for two
 * Toronto plumbers with dozens of live creatives - so a traffic line would be
 * a guess drawn as a fact, and one wrong number bins the whole document.
 * An estimated series may be added ONLY as a second, visibly labelled line. */
export interface PaidPresenceSeries {
  name: string;
  isClient?: boolean;
  /** Live creatives that month. null = outside the Center's coverage, not zero. */
  values: (number | null)[];
  /** True when the series is a spy-tool estimate rather than a counted one. */
  isEstimate?: boolean;
}
export interface PaidPresenceExhibit {
  monthLabels: string[];
  series: PaidPresenceSeries[];
  /** What the shape says, e.g. "Three of them have run ads every month since
   * September. You have run none." */
  readout: string;
  /** The counting method, printed under the chart so it can be checked. */
  methodLine: string;
}

/** Where their ad actually LANDS. A screenshot at phone width, because most
 * paid clicks are phones and the phone render is the one that loses the job.
 * Screenshot, not a rebuild - the point is that this is really their page. */
export interface LandingShotExhibit {
  /** The ad headline that leads here, so the mismatch reads itself. */
  fromAdHeadline: string;
  /** The URL the ad points at. Root domain = the homepage fault, named. */
  url: string;
  /** Phone-width capture, stored locally at pull time. Null = say so, never fake it. */
  screenshotUrl: string | null;
  /** True when the ad lands on the root domain or a generic hub. */
  isHomepage: boolean;
  /** Visible faults only - things provable without logging in. */
  faults: { label: string; detail: string }[];
  /** Mobile load in seconds from PageSpeed Insights. null = not pulled. */
  loadSeconds: number | null;
  /** One sentence on what the page does to the click. */
  readout: string;
}

/** The search they are paying for - a styled render of the LIVE SERP with
 * the ads block. Real titles, real domains, real positions. */
export interface SerpRow {
  position: number;
  title: string;
  domain: string;
  /** Grey URL/breadcrumb line exactly as Google shows it. */
  breadcrumb?: string;
  /** The real snippet from the pull, truncated by Google itself. */
  snippet?: string;
  isClient?: boolean;
  /** True for rows inside the Sponsored block. */
  isAd?: boolean;
}
export interface SerpExhibit {
  keyword: string;
  /** Where the search was run from, e.g. "Searched from Vancouver" - shown beside the keyword. */
  searchedFrom?: string;
  aiOverview?: string;
  rows: SerpRow[];
  /** Shown as a band when the client's ad is absent, e.g. "Your ad was not on the page." */
  clientAbsent?: string;
  note?: string;
}

export interface TimelineRow {
  when: string;
  visible: string;
}

export interface InvestmentOption {
  name: string;
  price: string;
  term: string;
  included: string[];
  recommended?: boolean;
}

export interface ProofItem {
  name: string;
  business: string;
  result: string;
  detail: string;
  /** Verbatim words from context/proof.md - never paraphrased. */
  quote?: string;
  photoUrl?: string;
  /** The video of them saying it. Where one exists it SHIPS - a written quote
   * beside an unused video is the weakest version of the strongest asset. */
  videoUrl?: string;
  videoThumbUrl?: string;
  /** Required whenever `result` carries a number. FTC Endorsement Guides and
   * Google's unreliable-claims policy both read a result as what everyone gets. */
  disclaimer?: string;
}

export interface FaqItem {
  q: string;
  a: string;
}

export interface ProposalData {
  slug: string;
  clientName: string;
  clientDomain: string;
  clientFaviconUrl: string;
  preparedBy: string;
  preparedByCompany: string;
  dateLabel: string;
  /** 7 days from send. The deadline is what makes a proposal close. */
  expiryLabel: string;
  heroLead: string;

  /** ⛔ ZERO ACCESS. This replaced an `account` block that carried the
   * prospect's monthly ad spend and the window it was read over - both of which
   * only exist INSIDE their Google Ads account, which /proposal never opens.
   * What ships instead is where the numbers on this page actually came from,
   * printed under the hero so a stranger can check them. */
  sources: {
    /** The public sources, plainly, e.g. "Read from Google's public ad library,
     * the live results page and your own website". */
    label: string;
    /** When they were read, e.g. "1 September 2026". */
    readOn: string;
  };

  scorecard: { overall: number; overallReason: string; pillars: ScorePillar[]; note?: string };
  missedRevenue: MissedRevenue;
  findings: {
    items: Finding[];
    competitorAds: CompetitorAdsExhibit | null;
    serp: SerpExhibit | null;
    landingShot: LandingShotExhibit | null;
    paidPresence: PaidPresenceExhibit | null;
    adImages: AdImageExhibit | null;
    copyAudit: CopyAuditExhibit | null;
    tracking: TrackingExhibit | null;
    cro: CroExhibit | null;
    unusedProof: UnusedProofExhibit | null;
    /** Named when an exhibit is null: which number is missing, what would get it. */
    missing?: string[];
  };
  timeline: { rows: TimelineRow[]; expectation: string };
  investment: {
    options: InvestmentOption[];
    terms: string;
    /** The one line that sells it: "$1,900 a month to stop $3,240 a month leaving." */
    wasteReminder: string;
  };
  proof: { items: ProofItem[]; credentials: string[] };
  faq: FaqItem[];
  close: { costReminder: string; ctaLabel: string; ctaUrl: string };
}
