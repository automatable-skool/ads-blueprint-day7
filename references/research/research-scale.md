# Research dossier - scaling a Google Ads Search account for local lead gen
Researched 28 August 2026 · 74 sources (Google official, Optmyzr, Adalysis, Search Engine Land, Search Engine Journal, agencies, r/googleads and r/PPC) · findings graded, myths dated, 32 rules
Next: fold the graded findings into `references/scaling.md` (draft at `ref-scaling.md`), then wire `/scale-account` to it.

## How claims are graded

- **(a)** Official Google documentation, API reference or a named Google spokesperson
- **(b)** A study with a stated sample size
- **(c)** Practitioner convention, one or more named practitioners
- **[V]** Vendor-published - a tool company's own data or product page
- **[snippet]** Only the search snippet was readable; the page itself was blocked

Research note: WebSearch was unavailable, DuckDuckGo served captchas, Bing returned navigational junk and Brave rate-limited after every batch. Google help pages were fetched by known URL; everything else came through Brave result lists and direct article fetches. Three Google help pages could not be reached (learning-period duration, seasonality adjustments, the budget report) - those claims are graded (c) and flagged.

---

## Sources

**Google official**

1. About average daily budgets - support.google.com/google-ads/answer/6385083. Daily spend cap is 2x the average daily budget, monthly cap is 30.4x. (a)
2. Impression share - support.google.com/google-ads/answer/2497703. Definition of Search impression share. (a)
3. About Target CPA bidding - support.google.com/google-ads/answer/6268632. "Last 30 days, including at least 30 conversions"; recommended target is the 30-day average adjusted for delay; be comfortable spending 2x daily budget. (a)
4. About Maximize conversions - support.google.com/google-ads/answer/7381968. "Designed to spend the full daily budget, and are 'limited by budget' by design"; use the budget simulator, not Lost IS (budget). (a)
5. How AI Max for Search works - support.google.com/google-ads/answer/15910187. Search term matching, text customization, final URL expansion. (a)
6. About bid strategy statuses - support.google.com/google-ads/answer/6263057. Learning triggers: new strategy, setting change, composition change. "You may not want to measure performance until the learning period is over." (a)
7. About Smart Bidding - support.google.com/google-ads/answer/7065882. "At least 30 conversions, such as a month or longer (50 for Target ROAS)" for measuring; portfolio strategies pool campaigns. (a)
8. About broad match - support.google.com/google-ads/answer/2407779. "Critical to use Smart Bidding with broad match." (a)
9. About custom experiments - support.google.com/google-ads/answer/6261395. 50% split suggested; one experiment at a time per campaign; changes mid-experiment muddy results. (a)
10. Ad group and asset group prioritization - support.google.com/google-ads/answer/2756257. Identical exact match wins, then identical phrase or broad, then AI relevance, then Ad Rank. (a)
11. About Performance Max - support.google.com/google-ads/answer/10724817. Lead gen is a supported goal; campaign-level negative keywords now exist. (a)
12. Google Ads API reporting and GAQL overview - developers.google.com/google-ads/api/docs/reporting/overview and /docs/query/overview. `campaign.status`, `ad_group.status`, `segments.date DURING LAST_30_DAYS`, v25 current. (a)

**Optmyzr data studies [V]**

13. Bidding strategies study, 14,584 accounts, 24 September 2024 - optmyzr.com/blog/impact-of-ppc-bidding-strategies. 50+ conversions in 30 days is the predictability threshold; under 25 is volatile; Max Conversions WITHOUT a target beat those with one on CPA. (b)
14. Performance Max study, 9,199 accounts and 24,702 campaigns, 7 October 2024 - optmyzr.com/blog/performance-max-study. Search outperforms PMax in accounts running both; PMax sweet spot 10-25% of budget; 60+ conversions a month for reliable PMax. (b)
15. PMax 2025 updates re-read of the 24,702 set, 16 June 2025 - optmyzr.com/blog/performance-max-2025-updates-study-analysis. 82% run PMax beside Search; campaign-level negatives up to 10,000; 60+ conversions a month. (b)
16. Is PMax cannibalizing Search, 503 accounts / 5,768 Search campaigns / 40,642 ad groups, 31 July 2025 - optmyzr.com/blog/is-pmax-cannibalizing-search. 91.45% of accounts overlap; where they overlap Search wins conversion rate 18.91% of the time versus PMax 6.17%, no difference 74.92%. (b)
17. State of PPC 2024, 7,100+ accounts, 13 March 2024 - optmyzr.com/blog/optmyzr-state-of-ppc-study. Exact beat broad on CPA in 73.84% of accounts; gap "closed quite a bit". (b)
18. Match type performance, 30,000 Search accounts, February 2026 data, 11 May 2026 - optmyzr.com/blog/google-ads-match-type-performance. Lead gen: phrase holds the largest share of spend and conversions; broad's efficiency gap widens without value signals. (b)
19. Q1 2026 benchmark, 21,425 accounts, 13 May 2026 - optmyzr.com/blog/google-ads-benchmark-report-q1-2026. Impressions down 11% year on year, CTR up 21%, CVR down 0.9%, CPA up 4.5%; "scaling campaigns took more effort for less return". (b)
20. Smart Bidding budget caps guide, Frederick Vallaeys, 11 August 2026 - optmyzr.com/blog/smart-bidding-budget-caps-guide. From 17 August 2026 budget-limited target campaigns deliver toward the target instead of beating it. (a via Google announcement, c for advice)
21. When to stop using Smart Bidding, Vallaeys, 28 May 2026 - optmyzr.com/blog/when-to-stop-using-smart-bidding. Below 50 conversions in 30 days the algorithm is "in perpetual training mode". (b, c)

**Adalysis (Brad Geddes)**

22. Impression share analysis for conversions, 20 March 2024 - adalysis.com/blog/how-to-use-impression-share-analysis-to-get-more-google-ads-conversions. Move budget from high-CPA to low-CPA campaigns losing IS to budget; non-brand IS above 80% is "excellent"; many profitable accounts sit at 10-30% IS. (c)
23. How to evaluate AI Max performance, 20 August 2026 - adalysis.com/blog/evaluate-ai-max-performance. Prerequisites: 30 conversions a month in the test campaign, no budget-related impression loss, proven broad-match profitability; AI Max out of beta April 2026; DSA migrating into AI Max. (c)
24. PPC budget management tools, 28 July 2026 - adalysis.com/blog/ppc-budget-management-tools. Google can spend 2x daily; set "low" maximum percentage changes and limit update frequency on Smart Bidding campaigns to avoid new learning phases. (c) [V]

**Search Engine Land**

25. Google Ads for lead gen: 9 tips to scale low-spending campaigns, Menachem Ani, 10 January 2024 - searchengineland.com/google-ads-for-lead-gen-9-tips-to-scale-low-spending-campaigns-436378. Order: locations, keywords, spend, pages, page tests, form tests, lead qualification, Enhanced Conversions, PMax last with offline tracking. (c)
26. Data: PMax stable, Search CPCs rising, Anu Adegbola, 11 November 2024 - searchengineland.com/data-pmax-performance-search-cpcs-448186. Search CPC up 22% year on year, conversion rate up 21%. (b)
27. How campaign structure shapes performance, Heather Brousell, 1 July 2026 - searchengineland.com/how-campaign-structure-shapes-google-ads-performance-481332. "Typically 30 to 50 conversions per campaign per month" to exit learning; consolidate, separate with negatives not campaigns. (c)

**Search Engine Journal**

28. Google clarifies its stance on campaign consolidation, Brooke Osmundson, 12 February 2026 - searchenginejournal.com/google-clarifies-its-stance-on-campaign-consolidation/567295. Brandon Ervin (Google): "Consolidation is not necessarily the goal itself"; Google's stated benchmark is 15 conversions in 30 days, which portfolio bidding and shared budgets can aggregate. (a)
29. Optmyzr report: engagement rising, efficiency flat, 4 May 2026 - searchenginejournal.com/optmyzr-report-finds-google-ads-engagement-rising-while-efficiency-holds/573718. 21,000+ accounts; Search CTR 12.15%; PMax volume up 15.7% with CPA up. (b)
30. Google is bringing Local Services Ads into Google Ads, Osmundson, 20 July 2026 - searchenginejournal.com/google-is-bringing-local-services-ads-into-google-ads/582816. LSAs become PMax pay-per-lead campaigns; weekly budgets become daily; manual CPL bidding removed; August 2026 US home services first. (a)
31. Target-based bidding update, Tony Adam, 27 July 2026 - searchenginejournal.com/google-ads-target-based-bidding-update-for-ecommerce/581801. From 17 August 2026 budget-limited target campaigns "deliver more consistently toward the target you set instead of overshooting it"; Search included. (a)
32. Google is ending target overperformance, Osmundson, 12 August 2026 - searchenginejournal.com/google-is-ending-target-overperformance-what-to-fix-before-august-17/584875. Audit budget-limited tCPA campaigns; if you were getting $35 leads on a $50 target, reset the target. (a, c)
33. New Search and AI Max experimentation tools, Osmundson, 24 August 2026 - searchenginejournal.com/google-ads-launches-new-search-and-ai-max-experimentation-tools/586549. Multi-campaign budget and target experiments rolling out September 2026; Performance Planner one-click apply. (a)

**Agencies and practitioners with numbers**

34. North Country Growth, How to scale without killing performance, 12 May 2026 - northcountrygrowth.com/blog/how-to-scale-google-ads-without-killing-performance. Saturation: IS above 85%, Lost IS (budget) near zero, CPC rising faster than conversions. The 20% rule with 7-10 days between steps; doubling takes 5-8 weeks; 50+ conversions a month before aggressive scaling; tracking gap over 10-15% pauses scaling; CPC up 10-20% is normal, 50%+ is a problem. (c)
35. Opascope, Scale without a CPA spike, 23 June 2026 - opascope.com/insights/scale-google-ads-without-cpa-spike. 10-20% every 7-14 days; a two-week CPA spike is normal, four weeks is structural; consolidate 20-40 campaigns to 6-10 before raising spend; browser tags lose 15-20% of conversions. (c, some case data)
36. Prooflytics, Impression share budget vs rank (undated, 2025-2026) - prooflytics.io/blog/google-ads-impression-share-budget-vs-rank. Raise budget when Lost IS (budget) exceeds rank loss; if doubling budget raises CPA by more than 30% the campaign is saturated - fix structure, not budget; 60-80% IS is the realistic band. (c)
37. RebootIQ, Search Lost IS in 2026, 30 March 2026 - rebootiq.com/understand-search-lost-is. Lost IS (budget) above 50% is a pacing problem; keep Lost IS (rank) under 20% on high-intent terms; above 80-90% IS, CPA rises and quality drops. (c)
38. Modern Marketing Institute, 2026 blueprint, April 2026 - modernmarketinginstitute.com/blog/how-to-build-a-profitable-google-ads-campaign-from-zero-a-2026-blueprint. "Incremental spend will flow toward lower-intent queries"; 30+ conversions to optimise for efficiency, 50+ for the scale phase and broad match. (c)
39. Big Flare, Limited by budget, 30 May 2025 - bigflare.com/blog/what-to-do-when-your-google-ads-campaign-is-limited-by-budget. The red flag can mean under 3% lost; 30-50 conversions a month before moving to a target; 20% weekly steps on target campaigns; daily budget about 50% above average daily spend; watch 1-4 weeks. (c)
40. Count.co metric page, undated - count.co/metric/impression-share-lost-budget. Good range 0-15%, concerning above 20-25%; raise high performers 20-30%. (c)
41. Aori, Lost IS to budget quick fix, 14 January 2023 - aori.com/blog/search-impression-share-lost-budget. Missed impressions x CTR x CPC = extra spend to fund the campaign; worked example $280 a week extra. (c)
42. Workshop Digital, Calculate your budget opportunity, 18 July 2024 - workshopdigital.com/blog/how-to-calculate-your-google-ads-budget-opportunity. Same method, at least three months of data; more budget does not fix rank. (c)
43. HawkSEM, 6 ways to improve impression share, 11 August 2025 - hawksem.com/blog/tips-to-improve-impression-share. Past 50-60% IS focus on relevance and page, not on chasing 100%. (c)
44. Trustworthy Digital, IS bidding formula, 12 January 2026 - trustworthydigital.com/articles/search-impression-share-bidding-formula. Four rules by budget-loss and rank-loss quadrant; 60-80% target band; offline conversions mandatory. (c)
45. Jyll Saskin Gales, Inside Google Ads episode 20, 13 June (year not shown) - jyll.ca/insidegoogleads/20. Diagnose before spending; 10% campaign IS floor is personal preference; 5-15 keywords per ad group. (c)
46. Store Growers, Target CPA guide, updated 6 March 2026 - storegrowers.com/target-cpa. 15 conversions minimum, Google says 30; start 10-20% above actual CPA; daily budget 3-5x target; "learning state lasts approximately seven days", check settings if it persists past two weeks. (c)
47. Grow My Ads, Max Conversions to tCPA, 16 March 2026 - growmyads.com/switch-from-maximize-conversions-to-target-cpa. 30 in 30 minimum, 50+ smoother; set target 5-10% above; stair-step down; wait a week per step. (c)
48. Store Growers, Match types, updated 9 March 2026 - storegrowers.com/keyword-match-types. Broad only with Smart Bidding, mature data and weekly search-term review; high-CPC ($15-30) accounts should avoid it; 30-40% more converting traffic claimed in ecommerce. (c)
49. PPC Mastery, Why consolidation is the key, Miles McNair, 16 July 2025 - ppcmastery.com/blog/tpe-94-why-consolidation-is-the-key-to-success-with-google-ads. 44 campaigns to 7: +345% conversion value; 19 to 4: +253% conversions, -60% CPA; eight legitimate reasons to split; brand always separate. (c with case numbers)
50. HopSkip Media, Consolidation outperforms expansion, 17 June 2026 - hopskipmedia.com/why-google-ads-consolidation-outperforms-campaign-expansion. 208 ad groups on a fixed budget was the problem; after consolidation +40.3% and +47% conversions year on year. (c with case numbers)
51. Groas, Account structure 2026, 14 February 2026 - groas.com/post/google-ads-account-structure-in-2026-the-framework-that-actually-works. 60 conversions a month total means 2-3 campaigns maximum; split only when each side keeps 15+; 7-10 ad groups per Search campaign. (c)
52. Omologist, Account structure, updated 6 August 2026 - omologist.com/google-ads/account-structure. 15 conversions minimum, 30 for stable tCPA, 50 for tROAS; under $50K a month means 4-5 campaigns total; split geos only on materially different CPA. (c)
53. Groas, Multi-location 2026, 6 May 2026 - groas.com/post/google-ads-for-multi-location-businesses-2026-campaign-structure-bidding-scale. About 30 conversions a month per location before its own automated bidding; tier locations; segment bid strategies by location group. (c)
54. Groas, Local service businesses 2026, 25 April 2026 - groas.com/post/google-ads-local-service-businesses-2026-complete-management-guide. $1,500-10,000 a month is the meaningful range; 30 conversions for Smart Bidding; 4-6 weeks learning under 30; 5-15% conversion rate is healthy. (c)
55. Groas, PMax vs Search 2025, 17 November 2025 - groas.com/post/performance-max-vs-search-campaigns-which-converts-better-in-2025. 247 accounts, $18.7M; lead gen: Search $68 per lead at 4.3% versus PMax $73 at 4.1%; author recommends 60/40 Search for lead gen. (b, small vendor sample) [V]
56. Nav43, Search vs PMax for lead gen, 5 May 2026 - nav43.com/blog/search-vs-performance-max-for-lead-gen-scale-guide-2026. Cites Adalysis: Search had the higher conversion rate 84% of the time on shared terms; phases 80/20 then 70/30 then 50-60/40-50; 30-50 Search conversions and $100-150 a day before PMax. (c, citing b)
57. Smarter Ecommerce, State of PMax 2025, 2 April 2025 - smarter-ecommerce.com/blog/en/google-ads/state-of-performance-max-campaigns-2025. 4,000+ campaigns; 30 conversions minimum, 60+ optimal. (b)
58. LocalIQ search advertising benchmarks 2026, 1 June 2026 - localiq.com/blog/search-advertising-benchmarks. Home and home improvement: $8.33 CPC, 6.47% CTR, 8.05% conversion rate, $90.92 per lead; cost per lead fell overall for the first time in five years. (b)
59. Hook Agency, Home services PPC handbook, 17 April 2026 - hookagency.com/blog/home-services-ppc-handbook. $144 average B2C home-service lead; plumbing 12-16% conversion, HVAC and roofing 3-7%; map high-value ZIPs before expanding geos. (c)
60. PPC Land, Google folds LSAs into Google Ads, 2026 - ppc.land/google-folds-local-services-ads-into-google-ads-cuts-historical-reports. Weekly budget ÷ 7 becomes daily; Ginny Marvin: "Performance Max is the only campaign type that serves on both Search and Maps"; export history before migration. (a)
61. George Tsiros, AI Max practitioner guide, 15 April 2026 - georgetsiros.gr/blog/ai-max-for-search-campaigns-guide. Do not enable under 30-50 conversions a month; six-week controlled test on the top two or three campaigns; 15-40% more impressions, 8-20% better CPA claimed. (c)
62. Lachi Media, Scaling lead gen with value bidding, 3 May 2026 - lachimedia.com/blog/lead-generation/how-to-scale-google-ads-lead-gen-campaigns-using-maximize-conversion-value-and-troas. Volume-only optimisation hits a "margin ceiling"; home services case: +30% scale at +12% ROAS with value uploads. (c with case data)
63. LaunchCodex, Google Ads management, 2025-2026 - launchcodex.com/blog/performance-marketing/google-ads-management. 20% steps, 7-14 days, "each new change resets the clock"; readiness: stable CPA for 2-3 weeks, Lost IS (budget) above zero. (c)
64. Factors.ai, B2B strategy 2026 - factors.ai/blog/google-ads-strategy. Scale only after a proven cost per qualified lead; under 30 conversions stay manual or Max Clicks; 70/20/10 budget split. (c)
65. SavvyRevenue, Andrew Lolk, scaling framework rebuttal, 6 January 2026 - savvyrevenue.com/blog/google-ads-scaling-framework-rebuttal. Start broader to gather data faster in small markets; expect planned losses before break-even; product range is the real ceiling. (c, ecommerce)
66. Define Digital Academy, Scale the right way, 17 November 2025 - definedigitalacademy.com/blog/how-to-scale-google-ads-the-right-way. Only two mechanisms; add campaigns only when existing ones show CPC resistance, plateau or capped IS. (c)
67. Austin Bryant Consulting, Search vs PMax for leads, 2026 - austinbryantconsulting.com/blog/search-vs-performance-max-better-leads. Search first, PMax with the remainder; no hard numbers. (c)

**Snippet-only (page blocked, Brave result text only)**

68. r/googleads, "How do you scale Google Ads?" (2026) - 20-30% every 2-3 weeks before Smart Bidding destabilises. (c) [snippet]
69. r/googleads, "Best way to scale without breaking performance" (2025) - 15-20% every 3-4 days, duplicate proven campaigns rather than edit them. (c) [snippet]
70. r/googleads, "How do you decide ad budget?" (2025) - 10 clicks a day minimum for usable data. (c) [snippet]
71. r/googleads, "Stuck at the B2B ceiling" (2026) - when volume plateaus despite budget, widen match type. (c) [snippet]
72. Stackmatix, Budget scaling strategy - vertical (more budget, wider match) versus horizontal (new campaigns, geos, channels). (c) [snippet]
73. WordStream, How to scale success and when, 4 April 2023 - prerequisites: consistent CPA and trustworthy tracking before any scaling. (c) [snippet]
74. Atlant Digital, Budget planning - when Lost IS (budget) exceeds 10%, add 10-15%. (c) [snippet]

---

## Findings by area

### 1. Budget-fit and right-sized testing

- **The daily budget math is fixed by Google.** Monthly ÷ 30.4 = daily; Google may spend 2x daily on any day but never more than 30.4x daily in a month. (a, source 1)
- **Google's own floors:** tCPA wants 30 conversions in the last 30 days (a, 3); measurement wants 30+ conversions over a month or longer (a, 7); Google's 2026 consolidation benchmark is 15 conversions in 30 days, which portfolios and shared budgets can pool (a, 28).
- **The stronger evidence says 50.** Optmyzr's 14,584-account study: 50+ conversions in 30 days is where every bidding strategy becomes predictable, under 25 is volatile (b, 13). Vallaeys 2026: under 50 the algorithm never leaves training (b, 21).
- **Clicks-to-verdict.** No study fixes 100 clicks; it is the low-volume practitioner floor (Adalysis low-traffic tier: 350 impressions, 300 clicks, 7 conversions per ad; Clix and Adalysis 80% confidence) adopted by this repo's ad-testing.md as Jono's ruling. Reddit's "10 clicks a day" floor (c, 70) is the same idea at the daily grain. (c)
- **How many groups a budget can test.** Nobody publishes a formula; the pieces are: clicks per month = budget ÷ CPC; one ad group needs about 100 clicks per fortnightly read; a campaign needs 30 conversions in 30 days to graduate to a target. Worked at LocalIQ's 2026 home-improvement medians ($8.33 CPC, 8.05% conversion rate, source 58): $3,000 a month buys about 360 clicks, about 29 leads. That is ONE ad group's worth of verdict-grade data, which is why the deck launches one group with the whole budget. (b for the inputs, c for the composition)
- **Consolidation case data all points the same way:** 44 campaigns to 7 gave +345% conversion value; 19 to 4 gave +253% conversions at -60% CPA (c with numbers, 49); 208 ad groups on a fixed budget was the diagnosis in HopSkip's case, +40-47% conversions after merging (50). Groas: 60 conversions a month total means 2-3 campaigns maximum (c, 51).
- **Ad group volume floor:** this repo's stag.md uses 1,000 impressions a week; PPC Mastery uses 2,000 impressions a month per ad group for asset labels (c, 49). Google's asset-rating floor is 2,000 ad impressions over 30 days (a, in ad-testing.md).

### 2. When to raise budget

- **The 20% rule is convention, not Google policy.** North Country: no more than 20% per step, 7-10 days between (c, 34). Opascope: 10-20% every 7-14 days (c, 35). LaunchCodex: 20%, 7-14 days (c, 63). Big Flare: 20% weekly on target campaigns (c, 39). Reddit ranges from 15-20% every 3-4 days to 20-30% every 2-3 weeks (c, 68-69). Adalysis says "low" maximum percentage changes to avoid new learning phases (c, 24). This repo's ad-testing.md already treats a budget move above about 20% as a learning trigger.
- **Preconditions every source agrees on:** campaign at or under target cost per lead; tracking trustworthy (gap under 10-15%, source 34); stable CPA for 2-3 weeks (63); Lost IS (budget) materially above zero and higher than Lost IS (rank) (22, 36, 37, 44).
- **Lost IS (budget) thresholds vary:** above 10% add 10-15% (74); 0-15% fine, 20-25% concerning (40); above 50% is a pacing problem (37, 44). Non-brand IS above 80% is excellent and profitable accounts often run at 10-30% (22).
- **Google's own caveat:** on Maximize Conversions the campaign is "limited by budget by design" and Lost IS (budget) uses a different definition - use the budget simulator (a, 4). So Lost IS (budget) is a stronger signal on a tCPA campaign than on a no-target one.
- **Diminishing returns are structural, not a bug.** Extra spend flows to lower-intent queries (c, 38); if doubling budget raises CPA more than 30% the campaign is saturated (c, 36); CPC up 10-20% during scaling is normal, 50%+ is a problem (c, 34); above 80-90% IS, CPA rises and quality drops (c, 37). Optmyzr Q1 2026: impressions down 11% year on year, so the pool itself shrank (b, 19).
- **The budget-opportunity formula:** missed impressions = impressions ÷ IS x Lost IS (budget); x CTR = missed clicks; x CPC = extra spend needed (c, 41, 42). Use at least three months of data (42).

### 3. When NOT to raise budget

- Lost IS (rank) dominates - fix relevance, page and assets first, bids last (c, 22, 36, 44, 43).
- Cost per lead above target - more money buys more of the same problem (c, 34, 35, 63, 64, 73).
- Bid strategy in Learning - do not measure or change (a, 6).
- Under 30 conversions - Google (a, 3) and everyone else says the campaign has not earned a target, let alone more budget.
- Tracking gap above 10-15% (c, 34); browser-only tags lose 15-20% (c, 35).
- Structure fragmented - consolidate 20-40 campaigns to 6-10 first (c, 35, 50).

### 4. Scaling paths and their order

- **Practitioner order, near-unanimous:** fix tracking and structure, raise budget on winners (vertical), then widen keywords and match type, then new intent campaigns and geos (horizontal), then PMax last with offline conversions (25, 34, 35, 66, 72). Define Digital: add campaigns only when existing ones show CPC resistance, plateau or capped IS (c, 66).
- **Broad match:** Google says it is critical to pair with Smart Bidding (a, 8). Optmyzr 2026: in lead gen, phrase holds the largest share of spend and conversions and broad's efficiency gap widens without value signals (b, 18). 2024: exact beat broad on CPA in 73.84% of accounts (b, 17). Store Growers: never under $15-30 CPCs without weekly search-term review (c, 48). Modern Marketing: 50+ conversions before broad (c, 38). This repo's stag.md already says 30-50 conversions and a mature negative list.
- **PMax as a layer for local:** Search wins where they overlap - 84% of the time on conversion rate in Adalysis data (b via 56), 18.91% versus 6.17% with 74.92% no difference in Optmyzr's (b, 16). Optmyzr's 24,702-campaign study puts the PMax sweet spot at 10-25% of budget and 60+ conversions a month (b, 14, 15). SEL: add PMax last, only with offline conversion tracking (c, 25). Groas' own lead-gen numbers had Search $68 versus PMax $73 per lead (b small, 55).
- **Geo:** own campaign only when it needs its own budget, number or CPA, and roughly 30 conversions a month on its own (c, 53, 52; matches campaigns.md). Hook: map high-value ZIPs before widening (c, 59).

### 5. Templating a proven ad group

- No study covers "stamping" directly; the evidence is inferential:
  - **Composition changes restart learning.** Adding campaigns, ad groups or keywords to a bid strategy triggers Learning (a, 6). Every stamped group costs about seven days of learning (c, 46) and Google says not to measure during it (a, 6).
  - **Keywords must be re-verified per service** - the same-ad test and the results-page check are per intent (repo stag.md). Optmyzr's match-type data shows phrase is the lead-gen workhorse, so the template's match type carries (b, 18).
  - **Negatives:** the universal list carries; service-specific negatives come from a fresh search-terms report (repo search-terms.md).
  - **Ad copy skeleton carries** (pinning, sentence case, 61-70 character descriptions - ad-testing.md (b)), but the verdict does not: a new pair needs its own 100 clicks and 7 days.
  - **Landing page blueprint carries; the conversion rate does not** - LocalIQ 8.05% is a median, plumbing converts 12-16% and roofing 3-7% (b, 58; c, 59).
  - **The tCPA target does not carry** until the new campaign has 30 conversions; a portfolio strategy pools it in the meantime (a, 7, 28).
  - **Duplicate-search guard:** Google resolves identical keywords across ad groups by exact first, then identical phrase, then AI relevance, then Ad Rank (a, 10). Anything not identical is routed by AI relevance or Ad Rank, so cross-group negatives are the only guarantee (repo stag.md step 7).

### 6. Bidding graduation as you scale

- Start Maximize Conversions with no target (a, 4; b, 13 - no-target beat with-target on CPA).
- Add tCPA at 30 conversions in 30 days (a, 3), set 5-20% above actual (c, 46, 47), step down about 10% at a time with a week between (c, 47; repo campaigns.md).
- Portfolio when campaigns are split before they each have 30 (a, 7, 28).
- **2026 change:** from 17 August 2026 budget-limited tCPA campaigns deliver toward the target instead of beating it (a, 31, 32; c, 20). A target set as a "ceiling" now becomes the price. Set the target at the cost per lead you actually want, and give a campaign that was overperforming either a lower target or more budget.
- Value-based bidding is the next rung for lead gen once offline outcomes flow (c, 62; a, 7).

### 7. Seasonality and pacing

- Monthly cap 30.4x daily, daily up to 2x (a, 1). Mid-month raises do not pro-rate against what was already spent - the monthly cap resets on the new daily figure for the rest of the month (c, in line with 1 and 24).
- Google's seasonality-adjustment help page could not be fetched. Convention: for known short spikes of 1-7 days only, never for slow seasonal drift, and never as a budget lever (c, from this researcher's prior reading of the page - treat as unverified this run).
- Adalysis pacing tools project month-end from history, seasonality, schedules and recent budget changes (c, 24).

### 8. The status read via the API

- GAQL gives `campaign.status`, `ad_group.status`, `metrics.cost_micros`, `metrics.conversions`, `metrics.cost_per_conversion`, `segments.date DURING LAST_30_DAYS` (a, 12).
- Impression share fields: `metrics.search_impression_share`, `metrics.search_rank_lost_impression_share` at campaign and ad group level; `metrics.search_budget_lost_impression_share` at campaign level only. (a from prior API use - the v25 reference page did not render this run, confirm before wiring)
- Learning state: `campaign.bidding_strategy_system_status` carries LEARNING_NEW, LEARNING_SETTING_CHANGE, LEARNING_BUDGET_CHANGE, LEARNING_COMPOSITION_CHANGE, LEARNING_CONVERSION_TYPE_CHANGE, LEARNING_CONVERSION_SETTING_CHANGE and LIMITED_BY_BUDGET. The existence of LEARNING_BUDGET_CHANGE is the closest thing to official confirmation that a budget move restarts learning. (a from the API enum, confirm in v25)

### 9. Scaling failure modes

- Spend up, quality down: incremental queries are lower intent (c, 38); CPC creep past 50% (c, 34); IS past 80-90% (c, 37).
- Cannibalization: PMax overlaps 91% of accounts' Search keywords (b, 16); duplicate keywords route by Ad Rank not relevance (a, 10).
- Tracking breaks under volume: 15-20% browser loss (c, 35); a gap over 10-15% halts scaling (c, 34); lead quality drifts, so offline conversions are the fix (c, 25, 44, 62).
- Learning storms: stacking a budget change on a target change resets everything at once (c, 63, 24).
- Overbuilding: 208 ad groups on a fixed budget (50); 20-40 campaigns where 6-10 would do (35).

### 10. What changed 2024-2026

- June 2025: per-asset conversion data (ad-testing.md).
- 2025: PMax campaign-level negatives up to 10,000, channel reporting (b, 15).
- April 2026: AI Max out of beta; DSA migrating into it (c, 23). Text customization is on by default with AI Max and force-upgrades September 2026 (ad-testing.md).
- Q1 2026: impressions down 11% year on year (b, 19).
- 12 February 2026: Google's benchmark is 15 conversions in 30 days, poolable (a, 28).
- 17 August 2026: budget-limited target campaigns now hit the target instead of beating it (a, 31, 32).
- August 2026: LSAs migrate into Google Ads as PMax pay-per-lead, US home services first; weekly budgets become daily; manual CPL bidding gone; history not carried (a, 30, 60).
- September 2026: multi-campaign budget and target experiments (a, 33).

---

## Myths, with dates

1. "Raise budget whenever Google says Limited by budget" - the flag can mean under 3% lost (c, 39, 2025), and on Maximize Conversions the campaign is limited by budget by design (a, 4).
2. "Lost IS (budget) means you need more money" - only if Lost IS (rank) is lower and cost per lead is at target (c, 22, 36, 44, 2024-2026).
3. "Doubling budget doubles leads" - true only while IS is low; past saturation CPA jumps more than 30% (c, 36, 38).
4. "Budget changes don't reset learning" - the API has a LEARNING_BUDGET_CHANGE status; practitioners cap moves at about 20% (c, 24, 34, 63).
5. "Set a low tCPA to force cheap leads" - too low forgoes conversions (a, 3); and since 17 August 2026 a target is what you get, not a ceiling (a, 31).
6. "More ad groups means more testing" - 208 ad groups on a fixed budget was the failure (c, 50, 2026); Optmyzr's 50-conversion floor is per strategy (b, 13).
7. "Broad match is the scaling lever for local" - in lead gen phrase carries the most spend and conversions and broad's efficiency gap widens (b, 18, 2026).
8. "PMax should replace Search for lead gen" - Search wins the overlap 84% of the time (b via 56) and the PMax sweet spot is 10-25% of budget (b, 14).
9. "LSAs are a separate channel you manage weekly" - from August 2026 they are a PMax pay-per-lead campaign on a daily budget (a, 30).
10. "Google wants everything in one campaign" - Ervin: consolidation is not the goal; split on real budget, target or geo differences (a, 28, 2026).
11. "Seasonality adjustments are for the busy season" - short spikes only (c, unverified this run).
12. "A copied ad group inherits its verdict" - composition change restarts learning (a, 6) and the ad test starts at zero clicks (repo ad-testing.md).

---

## Rules a scale command should enforce (graded)

**Budget fit**
1. Daily budget = monthly ÷ 30.4; show the 2x daily and 30.4x monthly caps in every budget line. (a)
2. Clicks a month = budget ÷ Planner CPC; a group needs about 100 clicks per fortnightly read; a campaign needs 30 conversions in 30 days before a target. (a for 30, c for 100)
3. Number of groups to enable = floor(monthly clicks ÷ 200), minimum 1; if that is under 1 at $100 a day, say so and show the budget that gets to 1. (c, derived)
4. Never enable more groups than the math allows; the rest are built, paused and listed as the bench. (c, 49-51)

**The four-check gate before stamping**
5. Search terms trimmed: weekly pass done for 4 weeks, n-gram waste under 10% of spend. (c, repo)
6. Ad test called on conversions at 80% confidence and about 100 clicks, never before 7 days. (repo ruling)
7. Cost per lead at or under target on 30 or more conversions in 30 days. (a)
8. Landing page A/B called on conversion rate, not clicks. (c)
9. Zero conversions with 100+ clicks routes to page and tracking, never to more budget or more groups. (c, repo)

**Stamping**
10. What carries: campaign settings, bidding strategy type, RSA skeleton, page blueprint, universal negatives, proof lines. (c, derived)
11. What is re-earned: keyword clusters (same-ad test per service), service negatives, the ad verdict, page conversion rate, the tCPA target, Quality Score. (a for target and learning, c for the rest)
12. Every stamped group starts a new learning clock; stamp in waves, never change a target or budget in the same week. (a, 6; c, 24)
13. One search, one ad group: cross-group negatives on every stamp; identical keywords across campaigns are refused. (a, 10)
14. Everything lands paused; the owner enables. (repo)

**Bench**
15. Bench activation only when an enabled group graduates (gate passed) or fails out. (c, repo)
16. Fail-out: 100+ clicks and zero conversions after page and tracking are cleared; or cost per lead above 2x target on 30 conversions; or under 1,000 impressions a week for 3 weeks (merge, not kill). (c, repo stag.md)
17. Winners fund the bench: reallocate from high-CPL to low-CPL campaigns that are losing IS to budget before adding new money. (c, 22)

**Raising budget**
18. Raise only when: at target, 30+ conversions, not in Learning, tracking gap under 10%, Lost IS (budget) above 10% and higher than Lost IS (rank). (a, c)
19. Step 20% maximum, 7-14 days between steps, one campaign at a time. (c)
20. On Maximize Conversions, use the budget simulator, not Lost IS (budget). (a)
21. After any raise, read cost per lead at 14 days; if it rose more than 30% on a doubling-equivalent, roll back one step and switch to horizontal scaling. (c)
22. Never raise budget and change a target in the same 14 days. (c, a)

**Not raising budget**
23. Lost IS (rank) above Lost IS (budget): fix assets, relevance, page; bids last. (c)
24. Cost per lead above target: no new money, run `/search-terms` and `/ad-tests` first. (c)
25. Under 15 conversions in 30 days across the account: consolidate, do not expand. (a, 28)

**Bidding**
26. Maximize Conversions with no target to 30 conversions; tCPA at 5-20% above actual; step down about 10% a week. (a, c)
27. Split campaigns share a portfolio strategy until each clears 30 on its own. (a)
28. From 17 August 2026 the target is the price: set it at the cost per lead you want, not a ceiling. (a)

**Expansion order**
29. Vertical before horizontal: budget on winners, then keywords, then match type, then new intents and geos, then PMax. (c)
30. Broad match only past 30-50 conversions a month, phrase stays the default in lead gen. (b, c)
31. PMax capped at 10-25% of budget, only with offline conversions flowing, never before Search is saturated. (b, c)
32. A geo gets its own campaign only for its own budget, number or CPA, and about 30 conversions a month on its own. (c)

**Status**
33. The status read pulls enabled versus paused, 30-day spend, conversions, cost per lead, IS, Lost IS (budget) and (rank), and bidding system status per campaign and group, and prints Learning as a blocker. (a)
34. Log every change with its date so the learning clock is auditable. (c)
