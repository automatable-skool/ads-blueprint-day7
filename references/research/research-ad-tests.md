# RSA Testing Research Dossier (2024-2026)

Topic: Responsive Search Ad (RSA) champion vs challenger testing in Google Ads, asset-level performance reading, rotation, pinning, copy variables, API access, and learning-period resets.

Compiled: 2026-08-28. Evidence grades used throughout:

- (a) = Google official docs / Google staff statement (Ads Liaison)
- (b) = stated-sample study with numbers
- (c) = practitioner convention (no stated sample, or opinion)

Fetch notes: a few URLs returned 403/404 to the fetcher (marked "search-summary only" where I relied on the search engine's excerpt rather than the page body). Everything else was read directly.

---

## Part 1. Source list (numbered, no duplicates)

### Google official help pages

1. About the ad-level asset report for responsive search ads - https://support.google.com/google-ads/answer/9564897 - current (2025-2026) - Performance label column deprecated; per-asset impressions, clicks, cost, conversions, conv value; "full performance statistics only available for dates on or after June 5, 2025"; ratio metrics "directional indicators only".
2. About asset-level metrics - https://support.google.com/google-ads/answer/16259414 - 2025 - Metrics attributed per instance served; sums don't match ad totals; evaluate at ad group / campaign level.
3. About campaign level asset reporting for RSAs - https://support.google.com/google-ads/answer/9781208 - current - Same deprecation note; lists impressions, clicks, CTR, cost, avg CPC, conversions, conv value, "Pinned"; "If an asset receives zero impressions for several weeks, consider replacing".
4. About the combinations report for RSAs - https://support.google.com/google-ads/answer/11894820 - current - Impressions only; "shouldn't be used to create static versions of responsive search ads".
5. About responsive search ads - https://support.google.com/google-ads/answer/7684791 - current - At least 2 RSAs with Good/Excellent per ad group; 3rd RSA = +3.7% conversions; pin 2-3 per position if you must pin; Poor to Excellent = 15% more clicks and conversions.
6. Best practices for creating effective RSAs - https://support.google.com/google-ads/answer/6167122 - current - 2nd RSA = +6.6% conversions; 3rd = +3.7%; "For general ad campaigns, no" on pinning.
7. Your guide to responsive search ads - https://support.google.com/google-ads/answer/12159142 - current - Repeats the 6.6% / 3.7% / 15% figures; unique final URL per RSA.
8. About Ad Strength for responsive search ads - https://support.google.com/google-ads/answer/9921843 - updated 2025 - "not used to calculate Ad Rank, Quality Score, or auction wins"; 15% more conversions Poor to Excellent, sourced "Google Internal Data, August 15-20, 2025"; recommends opting into text customization.
9. About Ad Strength (general) - https://support.google.com/google-ads/answer/9142254 - current - Incomplete/Poor/Average/Good/Excellent definitions.
10. Use ad rotation - https://support.google.com/google-ads/answer/112876 - current - Only two options: Optimize and Do not optimize; Smart Bidding auto-applies Optimize; Do not optimize "isn't recommended for most advertisers".
11. Fix unevenly serving ads - https://support.google.com/google-ads/answer/9383195 - current - "Rotating ads evenly doesn't guarantee even serving".
12. Duration of the learning period and what affects it - https://support.google.com/google-ads/answer/13020501 - current - Up to 3 weeks or 1-2 conversion cycles; triggers listed; ad edits not listed.
13. About bid strategy statuses - https://support.google.com/google-ads/answer/6263057 - current - Learning reasons: new strategy, setting change, composition change.
14. About custom experiments - https://support.google.com/google-ads/answer/10683687 - current - Cookie vs search split; ETAs cannot be tested; "each ad slot is a new auction".
15. About ad variations - https://support.google.com/google-ads/answer/7438541 - current - RSA-only; find and replace; traffic %; end date; compare modified vs original.
16. Set up an ad variation - https://support.google.com/google-ads/answer/7439892 - current - Three variation types; cookie assignment; start/end dates.
17. About text customization in Search campaigns - https://support.google.com/google-ads/answer/11259373 - 2025 - Generated assets served only if predicted to beat yours; "Added by" column; refreshed every 48 hours; requires AI Max opt-in.
18. Turn text customization on or off - https://support.google.com/google-ads/answer/16738708 - 2025 - Renamed from automatically created assets May 26, 2025; September 2026 auto-upgrade to AI Max; turning off also disables Final URL expansion.
19. How AI Max for Search works - https://support.google.com/google-ads/answer/15910187 - 2025 - Text customization campaign-level, search term matching ad-group level; asset reporting tied to conversions/spend.
20. AI Max FAQ - https://support.google.com/google-ads/answer/15913066 - 2025 - Generated assets "will fully be automated"; you cannot edit them.
21. About Final URL expansion in Search - https://support.google.com/google-ads/answer/16230205 - 2025 - On by default with AI Max; requires text customization on.
22. About RSA campaign-level text assets - https://support.google.com/google-ads/answer/13548268 - 2025 - Up to 3 headlines + 2 descriptions at campaign level; identical text consolidates stats; unused headlines can serve as link assets.
23. About insights for responsive search ads - https://support.google.com/google-ads/answer/13353283 - current - 56-day search-category insights; "replace low-performing assets".
24. Edit your text ads / version history - https://support.google.com/google-ads/answer/2375287 and https://support.google.com/google-ads/answer/7502216 - current - Editing creates a new version, same ad; "Metrics for previous versions will still be visible".
25. Driving better performance from AI-powered Search ads with increased asset flexibility - https://support.google.com/google-ads/answer/15967262 (also business.google.com announcement) - Feb 20, 2025 - Up to 2 headlines can serve as sitelinks; single headline; pinned H1/H2/D1 still honored.
26. Ad rotation settings to get trimmed (SEL, Google announcement coverage) - https://searchengineland.com/google-adwords-ad-rotation-optimize-setting-281543 - Sept 2017 - Rotate evenly / Rotate for conversions removed; only Optimize and Do not optimize remain.

### Google Ads API docs and forums

27. Mutate ads (AdService vs AdGroupAdService) - https://developers.google.com/google-ads/api/docs/ads/mutate-ads - current - RSA headlines, descriptions, final URLs, final mobile URLs are updatable in place via AdService.MutateAds with field mask; pause via AdGroupAdService status = PAUSED.
28. Responsive search ads overview - https://developers.google.com/google-ads/api/docs/responsive-search-ads/overview - current - 3+ headlines, 2+ descriptions; AssetLink pinnedField; multiple assets on one pin rotate.
29. Creating responsive search ads - https://developers.google.com/google-ads/api/docs/responsive-search-ads/create-responsive-search-ads - current - AdGroupAdOperation create pattern; ServedAssetFieldType pins.
30. AdGroupAdAssetView (RPC reference v20) - https://developers.google.com/google-ads/api/reference/rpc/v20/AdGroupAdAssetView - Fields: resource_name (customers/{cid}/adGroupAdAssetViews/{ad_group_id}~{ad_id}~{asset_id}~{field_type}), ad_group_ad, asset, field_type, enabled, policy_summary, performance_label, pinned_field, source.
31. ad_group_ad_asset_view field reference (v21) - https://developers.google.com/google-ads/api/fields/v21/ad_group_ad_asset_view - Resource "with metrics"; supports App, Demand Gen, RSA; not responsive display ads.
32. Google Ads API forum: How to update RSA headlines and descriptions - https://groups.google.com/g/adwords-api/c/B_ic5nZris0/m/8w6iS_rkAQAJ - Clear and re-add headlines, include responsive_search_ad.headlines in update_mask; no GAQL filter on headline text.
33. Google Ads API forum: Retrieve impressions of each headline in RSA - https://groups.google.com/g/adwords-api/c/PNGFMedu-sY - Historic limitation: only asset text, pinning, performance label were exposed via the ad report.

### Optmyzr (Frederick Vallaeys) and coverage of Optmyzr data

34. The Optmyzr Study on RSA Performance - https://www.optmyzr.com/blog/optmyzr-study-responsive-search-ad-performance/ - Apr 7, 2023 - 13,671 accounts, 93,055 RSAs; 2 RSAs per ad group = conversion-rate surge; full pinning best CTR but 3.9x fewer impressions; ad strength ~3% click uplift per level, no relation to performance; DKI raises impressions, lowers conversions per ad.
35. Ad Strength & Creative Study: 1M+ Ads - https://www.optmyzr.com/blog/google-ad-strength-study/ - Sept 9, 2024 - 22K+ accounts, $1,500+/mo, 90+ days; Average ad strength best CPA/CVR/ROAS; sentence case wins; some pinning beats none on CPA/ROAS.
36. What Actually Drives RSA Performance (Hint: It's Not Ad Strength) - https://www.optmyzr.com/blog/google-rsa-performance-study/ - Apr 6, 2026 - ~20,000 accounts; sentence case $7.46 CPA vs title case $27.47; partial pinning $13.68 CPA vs full $32.57; descriptions 61-70 chars best ROAS 307.58%; headlines under 20 chars $9.35 CPA.
37. Does Ad Strength Impact RSAs? - https://www.optmyzr.com/blog/ad-strength-responsive-search-ads/ - Mar 28, 2023 - Ad strength does not change with performance; does not affect ad rank or QS.
38. The Ultimate Guide to Responsive Search Ads - https://www.optmyzr.com/guide/responsive-search-ads/ - 2023-2024 - Replace assets with no impressions in 2+ weeks; judge on conversions within CPA/ROAS limits, not conversion rate.
39. How to Create, Optimize, and Manage RSAs - https://www.optmyzr.com/blog/create-optimize-manage-google-responsive-search-ads/ - May 1, 2023 - Use Ad Variations for asset-level experiments: add, pin, swap; pin multiple CTAs to one position.
40. Optmyzr A/B Testing for Ads user guide - http://help.optmyzr.com/en/articles/3088180-ab-testing-for-ads-google-ads-user-guide - Confidence options 90/95/99%; min impressions 100/200/500/1000; metrics CTR or Conv/Impr; RSA headlines compared individually; keep min 1-2 active ads per group.
41. SEL: Google Ads ad copy: what works and what doesn't in 2024 (Anu Adegbola on Optmyzr study) - https://searchengineland.com/google-ads-ad-copy-what-works-doesnt-446650 - Sept 17, 2024 - Summary of #35.
42. SEJ: Ad Copy Tactics Backed By Study Of Over 1 Million Google Ads (Navah Hopkins) - https://www.searchenginejournal.com/ad-copy-tactics-backed-by-study-of-over-1-million-google-ads/527230/ - Oct 2, 2024 - Same study; DKI showed no significant improvement; shorter headlines better CTR and CVR.
43. SEJ: How To Optimize Google RSAs (Vallaeys) - https://www.searchenginejournal.com/how-to-optimize-google-responsive-search-ads-rsas/455057/ - June 23, 2022 - 3 RSAs max; ad groups with RSAs got 2.1x impressions; three Ad Variation test types.
44. MarTech: 5 ways you're hurting account performance with RSAs (Optmyzr sponsored) - https://martech.org/5-ways-youre-hurting-account-performance-when-it-comes-to-rsas/ - Oct 13, 2022 - Testing RSAs by conversion rate is "the single largest mistake"; seeding RSAs from best ETA copy = ~7% conversion lift.
45. SEJ: 3 Experiments To Run For RSA Testing (Ashwin Balakrishnan, Optmyzr) - https://www.searchenginejournal.com/responsive-search-ads-testing/463538/ - Oct 5, 2022 - Pinned vs unpinned twin; theme-segmented RSAs; 2 pseudo-ETAs + 1 control; judge on conversions per impression.

### Adalysis (Brad Geddes)

46. How to Test Responsive Search Ads - https://adalysis.com/blog/how-to-test-responsive-search-ads-rsa-in-google-ads-and-microsoft-ads/ - Sept 16, 2022 - Google "predominately uses CTR" to pick combinations; test 2-3 RSAs by theme or pinned vs unpinned; example: pausing a high-CTR low-conv RSA added 200+ conversions in 30 days.
47. How much data before reviewing an ad test result - https://adalysis.com/blog/how-much-data-should-you-have-before-examining-an-ad-test-result/ - Nov 10, 2015 - Minimums table: low traffic 350 impr / 300 clicks / 7 conv; mid 750 / 500 / 13; high 1,000 / 1,000 / 20; always at least one week.
48. RSA optimization series Part 1: RSAs vs ETAs - https://adalysis.com/blog/rsa-optimization-series-part-1-rsas-vs-etas/ - Feb 8, 2022 - ~1M ad groups; ETA beat RSA on CVR in 67% of ad groups, CPI in 55%, CTR in 51%; Google serves RSAs disproportionately.
49. RSA optimization series Part 2: create and test RSAs - https://adalysis.com/blog/rsa-optimization-series-part-2-learn-to-create-and-test-rsas-in-google-ads/ - 2022 - Pin keyword headline to H1, USP/CTA elsewhere, rest unpinned; asset labels "kind of useless" without conversion data; performance-based re-pinning method.
50. Inside the ad testing metrics: conversion per impression (CPI) - https://adalysis.com/blog/inside-ad-testing-metrics-conversion-per-impression-cpi/ - Mar 10, 2015 - CPI = conv / impr combines CTR and CVR; use when you want max conversions; ignores revenue.
51. Inside the ad testing metrics: conversion rate - https://adalysis.com/blog/inside-ad-testing-metrics-conversion-rate-cr/ - Feb 24, 2015 - Worked example where 36% CVR ad produces 4 conversions and 7.7% CVR ad produces 12.
52. Important Notice: Recent Google change that affects your Ad Testing & Management - https://adalysis.com/blog/important-notice-recent-google-change-that-affects-your-ad-testing-management/ - Oct 2024 (search-summary only) - Google no longer creates a new ad ID on edit; use "Copy and edit" then pause the old ad to keep tests clean.
53. SEL: Ad testing in a multi-format world (Ginny Marvin quoting Geddes) - https://searchengineland.com/ad-testing-in-a-multi-format-world-of-responsive-search-ads-three-headlines-and-more-310659 - Jan 17, 2019 - Multi-ad-group testing = aggregate a line across 500+ ad groups; Google gave no conversion stats per RSA combination at the time.

### Ginny Marvin (Google Ads Liaison) and industry press

54. SEJ: Ad Strength Deep Dive: All Your Tough Questions Answered (Ginny Marvin) - https://www.searchenginejournal.com/all-your-ad-strength-questions-answered/514092/ - Apr 22, 2024 - "Ad Strength is not a factor in the auction"; pinning lowers it; pin 2-3 per position; Poor to Excellent = 12% more conversions.
55. SEL: Ginny Marvin clarifies AI Max, AI Search ads (Anu Adegbola) - https://searchengineland.com/ginny-marvin-clarifies-ai-max-ai-search-ads-and-what-advertisers-should-prioritize-after-gml-479838 - June 10, 2026 - AI Max not required for AI Overviews eligibility; "AI Brief" negative guidance coming for text customization.
56. SEL: Google Ads adds RSA headline performance data (Anu Adegbola) - https://searchengineland.com/google-ads-rsa-headline-performance-data-459541 - July 28, 2025 - Per-headline clicks and conversions spotted in UK, NL, FR, BE accounts; replaces Good/Best labels.
57. Practical Ecommerce: Google Ads Unveils RSA Asset Stats (Matthew Umbro) - https://www.practicalecommerce.com/google-ads-unveils-rsa-asset-stats - Aug 6, 2025 - Filter 100+ clicks and 0 conversions to prune; wait for 50+ clicks before acting.
58. Honcho: Google Ads Rolls Out Headline-Level Metrics for RSAs - https://honchosearch.com/blogs/news/google-ads-rolls-out-headline-level-metrics-for-rsas - Oct 17, 2025 - Still gradual rollout in October 2025; access via Campaigns > Assets > columns.
59. ppc.land: Google releases comprehensive guide to RSA optimization - https://ppc.land/google-releases-comprehensive-guide-to-responsive-search-ads-optimization/ - Nov 2025 - Learning label needs "over 500 impressions" for the asset and "2,000 impressions in the Google Search: Top segment over 30 days" for the ad; Marvin's 8-10 headlines / 3 descriptions guidance.
60. ppc.land: Inside Google's search ad design engine (Abby Butler, Adam Bullock) - https://ppc.land/inside-googles-search-ad-design-engine-tests-assets-and-ai-in-2026/ - Feb 25, 2026 - Assets are modular; single-headline serving; "predicted to improve performance" logic.
61. SEL: Google gives RSAs more flexibility (Anu Adegbola) - https://searchengineland.com/google-responsive-search-ads-flexibility-452264 - Feb 20, 2025 - Up to 2 headlines as sitelinks; descriptions may be omitted.
62. SEJ: Google RSAs Just Got More Flexible (Brooke Osmundson) - https://www.searchenginejournal.com/google-responsive-search-ads-just-got-more-flexible/540285/ - Feb 20, 2025 - Marvin: pinned H1/H2/D1 still serve in position; stats reported at headline level not sitelink level; single-headline update was Feb 2024.
63. Cypress North: Google Now Serving RSA Headlines as Sitelinks (Greg Finn) - https://cypressnorth.com/paid-search-marketing/googles-rsa-headlines-sitelinks-update-makes-zero-sense/ - Feb 24, 2025 - Headline-as-sitelink data is folded into headline reporting; no separate control.
64. ClickGuard: RSA Update: More Flexibility and Control - https://www.clickguard.com/blog/responsive-search-ads-update-more-flexibility-and-control/ - Feb 24, 2025 - Same change; combinations report shows which headlines served as sitelinks.
65. SEL: A guide to ad variations in Google Ads (Tim Jensen) - https://searchengineland.com/google-ads-ad-variations-guide-442620 - May 29, 2024 - RSA only; max 84 days; can't edit after launch; shows percentages and confidence interval when significant.
66. SEL: How to set up a simple Google Ads testing framework (Ginny Marvin on Henderson) - https://searchengineland.com/how-to-set-up-a-simple-google-ads-testing-framework-for-continual-campaign-optimization-337264 - July 7, 2020 - Weekly Friday cadence; set rotation to Do not optimize for manual tests; label tests; ad variations good for small accounts.
67. SEL: RSAs: are they living up to the promise? (Andrea Cruz quoted) - https://searchengineland.com/google-responsive-search-ads-default-search-ad-ppc-marketers-340128 - 2020 (search-summary only) - Pin the CTA in one headline to protect conversion rate.

### Statistics and testing methodology

68. Cypress North: How To Properly Perform Statistically Relevant Split PPC Ad Testing (Greg Finn) - https://cypressnorth.com/paid-search-marketing/proper-statistical-paid-search-ad-testing-tips-tricks/ - Feb 14, 2014 - 95% standard; p 0.05-0.01; judge on conversions; set rotation to rotate indefinitely.
69. Impression: Statistical Significance: Optimise Your PPC Campaigns - https://www.impressiondigital.com/blog/statistical-significance-ppc/ - Oct 26, 2018, updated Feb 7, 2022 - 95% is convention, 90% acceptable with risk tolerance.
70. Clix Marketing: Using Statistical Significance to Your Advantage in PPC - https://clixmarketing.com/using-statistical-significance-to-your-advantage-in-ppc/ - Jan 25, 2018 - 90-95%; low volume can drop to 80%; 1-2 weeks high volume, 1-2 months low volume.
71. Dataslayer: A/B Testing for Paid Ads (2026) - https://www.dataslayer.ai/blog/how-to-use-a-b-testing - 2026 - n = 16 p(1-p)/MDE^2; at 3% CVR, 12,933 clicks per variant to detect 20% lift; 100 conversions per variant minimum; day-3 winners flip 50%+ of the time by day 14.
72. PPC Mastery TPE #87: how to A/B test ad copy with RSAs (Miles McNair) - https://www.ppcmastery.com/blog/tpe-87-how-to-a-b-test-ad-copy-with-responsive-search-ads - Apr 1, 2024 - A few headlines get 70-90% of impressions; use Ad Variations find/replace; blue star = significant.
73. PPC Mastery TPE #16: better RSAs with 3 high-impact test ideas (Miles McNair) - https://www.ppcmastery.com/blog/tpe-16-better-rsas-with-3-high-impact-test-ideas - Nov 7, 2022 - Mix & Matcher, Copywritooor (fully pinned), Micromanager (one position pinned); optimize on CPI or RPI.
74. Adpulse: Efficient A/B Ad Testing for RSAs - https://adpulse.app/blog/ppc-strategy/efficient-a-b-ad-testing-for-responsive-search-ads-in-google-ads/ - July 24, 2024 - One element at a time; pin headlines if you want conversion rate over CTR.
75. GrowMyAds: RSA Guide: 4 Expert Methods - https://growmyads.com/google-search/responsive-search-ads-guide-4-expert-methods-for-better-ctrs-and-conversion-rates/ - updated Feb 2025 - Prune Low assets; 2nd themed RSA; custom experiment 50/50 for 30 days min; ad variations 50/50.
76. Take Some Risk: Google Ads Experiments in 2025 (Scott Wright) - https://www.takesomerisk.com/google-ads-experiments-2025/ - Aug 29, 2025 - Run at least 2 weeks, ideally a month; Google flags significance.
77. Store Growers: Google Ads Experiments guide - https://www.storegrowers.com/google-ads-experiments/ - 2024-2025 - 50/50 default; 95% confidence interval displayed; Optimize text ads = find/replace, update URL, update text.
78. DataFeedWatch: Google Ads Experiments full guide - https://www.datafeedwatch.com/blog/google-ads-experiments-guide - 2024-2025 - At least 2 weeks; starts next day; sync settings; 70/30-90/10 only with 100+ conversions.

### Other practitioner and agency sources

79. ZATO (Kirk Williams' agency): ETAs Will Be Sunset Soon (Sakshi Sharma) - https://zatomarketing.com/blog/expanded-text-ads-etas-will-be-sunset-soon-are-you-ready - Mar 25, 2022 - Unpinned / partial / fully pinned taxonomy; the (then) 5,000-impression Search Top threshold for asset ratings.
80. Search South: Pinning and RSAs: When Should You Use It? - https://www.search-south.com/2026/03/11/pinning-and-responsive-search-ads-when-should-you-use-it/ - Mar 11, 2026 - Pin only for brand, compliance, promos; multi-pin keeps some choice.
81. Search South: RSA Best Practice in 2026 - https://www.search-south.com/2026/02/21/responsive-search-ads-best-practice-in-2026/ - Feb 21, 2026 - Still recommends Best/Good/Low labels (stale, see myths).
82. Store Growers: 9 Tips To Optimize RSAs - https://www.storegrowers.com/how-to-optimize-responsive-search-ads/ - updated Jan 8, 2026 - "RSA Light" (multiple headlines pinned per position) "showing the best results lately"; 2,000 Search Top impressions in 30 days for ratings.
83. Growth Minded Marketing: RSAs 2026 Guide - https://growthmindedmarketing.com/blog/responsive-search-ads/ - updated Feb 2, 2026 - 6-10 headlines, 4 descriptions; track CPI/RPI custom columns; ad strength "isn't linked to actual performance".
84. Semrush: Responsive Search Ads: The Ultimate Guide - https://www.semrush.com/blog/responsive-search-ads/ - Jan 14, 2025 - 8-10 headlines, 3 descriptions; max 3 RSAs per ad group; pin 2-3 per position.
85. Karooya: How Google creates RSAs - https://www.karooya.com/blog/how-does-google-ads-create-responsive-search-ads/ - Apr 5, 2024 - 15/4 limits; combination assembly; ad performance script.
86. Adzooma: How Effective Are RSAs? - https://adzooma.com/blog/effective-responsive-search-ads/ - Sept 2019, updated - Beta-era 53.1% CVR lift claim; recommends 5+ headlines; pairs with ETAs (dated).
87. Dotidot: Google Ads learning period: tips to avoid resets - https://www.dotidot.io/post/google-ads-learning-period-tips-to-avoid-resets - Apr 1, 2026 - Ad copy changes do not reset; budget moves over 20% do; ~7 days typical, ~50 conversions.
88. Dotidot: Ad strength: does it really matter? - https://www.dotidot.io/post/ad-strength-does-it-matter-or-not - Jan 29, 2026 - 3,600+ campaign analysis cited; Excellent often underperformed; Google's 12% claim.
89. Groas: Learning phase duration, resets - https://www.groas.com/post/google-ads-learning-phase-duration-how-long-resets-minimize-wasted-spend-2026 - Apr 23, 2026 - 3-14 days; "sweeping ad copy changes" can reset "in some cases"; individual ad edits not listed.
90. Zenweb: Learning phase reset - https://zenweb.my/blog/google-ads-learning-phase-reset/ - July 19, 2026 - "Editing ad copy or adding assets" safe; move budget in ~20% steps; reset cost roughly -22% conversions, +18% CPL.
91. David Tamachi: Google Ads AI Asset Automation defaults - https://davidtamachi.ca/blog-google-ads-ai-asset-automation-default - June 6, 2026 - Text customization and Final URL expansion both on when AI Max enabled; treat as creative controls needing QA.
92. WordStream: RSA 101 - https://www.wordstream.com/blog/responsive-search-ads - 2024-2025 (search-summary only, page 403) - 8-10 headlines, 3+ descriptions; keep testing themed RSAs.
93. Adobe Experience League: Google Ads RSA settings - https://experienceleague.adobe.com/docs/advertising/search-social-commerce/campaign-management/management/campaigns/ads/ad-settings-by-network/ad-settings-google-rsa.html - current - "Each ad group can include up to three enabled responsive search ads".
94. ROA Marketing: RSA Best Practices 2026 - https://roa-marketing.com/blog/responsive-search-ads-best-practices-google-ads-2026/ - 2026 (search-summary only) - "Since August 2025, Google Ads surfaces clicks, impressions, conversions, conversion rate and cost per conversion for each headline and description".

Not retrievable this session (listed for transparency, not counted): Search Engine Roundtable RSA click/conversion data (39827) and headline-in-sitelinks (38944) pieces returned 403; PPC Hero statistical significance post returned 403; Google community thread 57813485 body truncated; the Google RSA 2023 PDF guide could not be text-extracted.

---

## Part 2. Findings by area

### Area 1. How many RSAs per ad group and ad rotation

- Hard limit: 3 enabled RSAs per ad group. (a) Sources 43, 84, 93.
- Google's recommendation: "at least 2 RSAs with Good or Excellent Ad Strength per ad group", each with a unique final URL. Adding a second RSA = "6.6% increase in conversions at a similar cost"; adding a third = "3.7% average increase in conversions". (a) Sources 5, 6, 7. Note: these are Google internal averages with no stated sample, so treat as (a)/(c) hybrid.
- Optmyzr 2023 (13,671 accounts, 93,055 RSAs): impressions rise with each additional RSA, but "ad groups with two RSAs experience a surge in conversion rate that single-RSA and three-RSA ad groups don't." Two is the "sweet spot". (b) Source 34, 38.
- Optmyzr 2022: ad groups containing RSAs received 2.1x the impressions of ETA-only ad groups; RSAs drive ~4x the impressions of a typical ETA. (b) Sources 34, 43, 44.
- Adalysis: "you can have three RSAs in an ad group"; standard test = one control + one test (two RSAs), up to three when testing themes. (c) Sources 46, 49.
- Small / local accounts: no vendor publishes a stated-sample rule. Convention from Adalysis (low-volume ad groups "show inconsistent metrics week-to-week"; 50,000+ clicks/month is where Google's algorithm learns well), Clix (low volume: 1-2 month cycles, accept 80% confidence), and SEL/Henderson (ad variations across many campaigns for small accounts) is: run 1 RSA per ad group with enough headlines, and test at the campaign or account level (ad variations / multi-ad-group) rather than ad group vs ad group. (c) Sources 46, 66, 70.
- Ad rotation: only two settings exist, "Optimize: Prefer best performing ads" and "Do not optimize: Rotate ads indefinitely". "Rotate evenly" and "Rotate for conversions" were removed in September 2017. (a) Sources 10, 26.
- With Smart Bidding, "Google Ads will automatically use the Optimize ad rotation setting" (the rotation setting is effectively ignored). "Do not optimize" is "not recommended for most advertisers". (a) Source 10.
- Even "Do not optimize" does not guarantee even serving because "ads will enter the auction more evenly" but "aren't guaranteed to win every auction entered." (a) Source 11.
- Optimize favors the ad predicted to get more clicks (and conversions under Smart Bidding). Adalysis observed Google serving RSAs "frequently receiving most impressions ... even when underperforming in CTR" versus ETAs, and Google's RSA combination selection "predominately uses CTR". (b for the RSA/ETA share, c for the CTR claim) Sources 46, 48.

### Area 2. Asset-level reporting and labels

- Where: Ads > "View asset details" under the ad, or Campaigns > Assets with columns added. Tabs: Assets and Combinations. (a) Sources 1, 4, 58.
- What metrics exist per asset now: impressions, clicks, cost, conversions, conversion value (ad-level report), plus CTR, avg CPC, avg position, "Pinned" in the campaign-level report. (a) Sources 1, 3.
- Since when: Google says "Full performance statistics is only available for dates on or after June 5, 2025." The UI rollout of per-headline clicks/conversions was first spotted July 28, 2025 (UK, NL, FR, BE), covered as "rolling out" August 6, 2025, and still "gradual" as of October 17, 2025. So: data begins June 5, 2025; visibility arrived July-October 2025. Claims that conversions per asset existed in 2024 are wrong; before June 2025 the asset table showed impressions plus a label only. (a) Sources 1, 3; (c) 56, 57, 58, 94.
- Label retirement: "The 'Performance label' column has been deprecated as full performance statistics for each asset are now available." No standalone retirement date is published beyond the June 5, 2025 data cutoff; the column disappeared with the metrics rollout (mid/late 2025). (a) Sources 1, 3.
- What the labels were (still exist in the API enum and older docs): Pending, Learning, Low, Good, Best, Unrated. "Learning" = "doesn't yet have sufficient data to garner a rating"; revisit when the asset has over 500 impressions and the ad has over 2,000 impressions in the "Google Search: Top" segment over 30 days. "Unrated" = system can't rank because there are too few assets of that type. (a via Google guide quoted in Source 59; also Sources 82, 49.) Older 2022 material cites 5,000 impressions in Search Top over 30 days (Source 79), so that threshold changed.
- Attribution rule: metrics are attributed "per instance of the asset served within an ad": one impression with three assets credits each asset one impression; one conversion credits each served asset one conversion. Therefore "the sum of individual asset impressions, clicks, or costs may not directly match" ad totals, and "Ratio metrics at the asset level, such as CTR, CPC, CPA, ROAS, should be used as directional indicators only. These metrics don't accurately reflect the overall performance of a single asset in isolation." Google's own advice is to evaluate "at the asset group level or campaign level, rather than at the individual asset level." (a) Sources 1, 2.
- Combinations report: shows "all the ad combinations created", impressions only, and Google warns it "shouldn't be used to create static versions of responsive search ads because they're not guaranteed to perform the same". Since Feb 2025 it also flags which headlines served as sitelinks. (a) Sources 4, 62, 64.
- Ad Strength vs performance:
  - Google: "Ad Strength is not a factor in the auction"; "not used to calculate Ad Rank, Quality Score, or auction wins." Google's uplift claim has drifted: "15% more clicks & conversions" (Source 5), "12% more conversions" (Marvin, Apr 2024, Source 54), "15% more conversions" sourced to internal data Aug 15-20, 2025 (Source 8). (a)
  - Optmyzr Sept 2024 (1M+ ads, 22K accounts): RSA CVR/CPA by strength: Poor 3.2% / $32.14; Average 3.4% / $29.87 (best); Good 3.3% / $31.05; Excellent 3.1% / $33.42. (b) Source 35.
  - Optmyzr Apr 2026 (~20K accounts): Average $12.43 CPA, 12.65% CVR vs Excellent $28.68 CPA, 4.97% CVR; Poor had the best ROAS at 327.65%. (b) Source 36.
  - Optmyzr 2023: each strength level correlated with ~3% more clicks but "no relation to performance". (b) Source 34.
  - Dotidot Jan 2026 citing a 3,600+ campaign analysis: Excellent often underperformed; Good/Average balanced. (b, second-hand) Source 88.
  - Adalysis: the Best/Good/Low labels were "kind of useless" without conversion data. (c) Source 49.

### Area 3. Statistical significance and which metric to judge

- Adalysis minimum-data table (per ad, before reading a test): low traffic 350 impressions / 300 clicks / 7 conversions; mid 750 / 500 / 13; high 1,000 / 1,000 / 20; big brands 100,000 / 10,000 / 100-1,000. "You should always use a minimum of a week of data." Example: 97% confidence at 97 impressions was wrong; 99.96% at 3,163 impressions held. (c with worked numbers) Source 47.
- Optmyzr's ad A/B tool exposes 90 / 95 / 99% confidence (95% recommended) and minimum impressions of 100 / 200 / 500 / 1,000; it compares RSA headlines and descriptions individually and recommends pausing losers and rebuilding from winning components. (c) Source 40.
- Convention across Cypress North (2014), Impression (2022), Clix (2018): 95% is the default; 90% acceptable; drop to 80% only for low-volume accounts to keep velocity; p between 0.05 and 0.01; run 1-2 weeks minimum at high volume, 1-2 months at low volume. (c) Sources 68, 69, 70.
- Sample-size math (Dataslayer 2026): n = 16 p(1-p)/MDE^2 at 95% confidence and 80% power. At 3% CVR you need 12,933 clicks per variant to detect a 20% relative lift; at 5% CVR 7,600; at 1% CVR 39,600. Rule of thumb: 100 conversions per variant minimum, 300-400 for high stakes; 14 days minimum; "A test that looks like a clear winner on Day 3 has a 50%+ chance of flipping by Day 14." (c with formula) Source 71.
- Sequential / call-it-early: Google's experiments and ad variations show a confidence interval and flag significance continuously (Sources 65, 77), which is a form of peeking. Vendor guidance is to require both significance and the minimum duration (2 weeks, ideally 4). (a for the UI, c for the rule) Sources 65, 76, 77, 78.
- Why CTR winners lose on CPA: Adalysis worked example: an ad with 36.36% CVR produced 4 conversions while an ad with 7.69% CVR produced 12 because its CTR was 14x higher; the reverse also happens (high CTR, low CVR). Hence Adalysis's preferred metric is conversions per impression (CPI = conversions / impressions), which "combines both the frequency of clicks (CTR) and how often a click converts." CPI ignores revenue, so ecommerce should use revenue per impression. (c with example) Sources 50, 51, 73, 83.
- Optmyzr's version: because RSAs change impression volume, "testing RSAs by conversion rate" is "the single largest mistake"; judge on total conversions within your CPA/ROAS limit, or conversions per impression. (b context, c rule) Sources 38, 44, 45.
- Google's own selection engine leans on CTR ("predominately uses CTR" per Adalysis; Google's rotation doc says Optimize "optimizes your ads for clicks", adding conversions only under Smart Bidding). So manual review on CPA/CPI is required if conversions are the goal. (a) Source 10; (c) Source 46.
- Adalysis case: pausing a high-CTR, low-conversion RSA increased conversions "by more than 200 in the following 30 days." (c anecdote) Source 46.

### Area 4. Champion / challenger process

- Adalysis structure: one control RSA + one challenger RSA per ad group (max three). Three test designs: (1) fully pinned twin vs unpinned twin; (2) themed RSAs (price vs benefits vs CTA vs location); (3) run unpinned to find top combinations, then rebuild the winners as fully pinned ads to get real per-combination metrics. Pause the loser once significant. (c) Sources 46, 49.
- Adalysis single vs multi-ad-group testing: single ad group = classic A/B inside one ad group; multi-ad-group = the same line (headline, CTA, USP) tested across 500+ ad groups and aggregated by line, which yields customer insights (price sensitivity, shipping, location) at volumes small ad groups can't reach. (c) Source 53.
- Optmyzr structure: use Ad Variations as the champion/challenger vehicle for three actions: add assets, pin assets, swap assets. Twin-RSA tests: pinned vs unpinned; up to three theme RSAs; or two pseudo-ETAs plus one unpinned control. Judge on conversions per impression. (c) Sources 39, 43, 45.
- What to swap: Google says replace assets with "zero impressions for several weeks" (a, Source 3); Optmyzr says no impressions in "2+ weeks" (c, Source 38); Umbro says filter assets with 100+ clicks and 0 conversions, and don't touch anything under 50 clicks (c, Source 57); ppc.land quoting Google's guide: don't judge an asset before 500 asset impressions and 2,000 ad impressions in Search Top over 30 days (a, Source 59). No 5,000-impression rule appears in current Google docs; 5,000 was the 2022 threshold (Source 79).
- Cadence conventions: weekly review, iterate every 2-4 weeks (Source 83 and SEJ-style 2026 guides); Henderson's Friday weekly slot (Source 66); GrowMyAds: custom experiments 30 days minimum (Source 75); Take Some Risk: 2 weeks minimum, a month ideal (Source 76). (c)
- Retire / promote rule (convention): when the challenger wins at your confidence level on CPI or CPA with the minimum data met, pause the champion (don't delete, keep history), promote the challenger, and launch a new challenger. Adalysis notes the ad edit change (Oct 2024): editing an ad keeps the ad ID and merges stats, so build the next challenger with "Copy and edit" and pause the old one rather than editing in place. (c) Source 52; (a) Source 24.
- Pin vs unpin effect on the test: pinning reduces combinations so the machine converges faster and gives you per-position readability; full pinning turns an RSA into a pseudo-ETA with a clean ad-level metric but ~3.9x fewer impressions. (b) Source 34; (c) Sources 46, 73.

### Area 5. Pinning

- Google: "pinning isn't recommended for most advertisers and can affect ad strength"; if you must, "pin 2 or 3 unique headlines or descriptions to each position." Pinned H1, H2 and D1 continue to be honored under the 2025 asset-flexibility changes. (a) Sources 5, 8, 25, 54, 62.
- Multi-pin: "If more than one asset is pinned to a specific position, then that position will rotate text between all assets pinned to that position." (a) Source 28.
- Optmyzr 2023: full pinning produced the best CTR, but "impressions per ad group are 3.9 times higher when giving Google the flexibility with multiple texts per pinned location." (b) Source 34.
- Optmyzr 2024 (1M+ ads): "some pinning" best on CPA and ROAS; fully pinned marginally higher CTR but fewer conversions. (b) Source 35.
- Optmyzr 2026 (~20K accounts): partial pinning $13.68 CPA, 11.88% CTR, 365.15% ROAS, 10.55% CVR; fully pinned $32.57 CPA, 8.49% CTR; in a 268-account common subset, fully pinned $61.11 CPA and 4.48% CVR. Recommendation: "Pin your most important headline to position 1 ... leave room for Google to test." (b) Source 36.
- Practitioner data on pinning H1 to the keyword: no stated-sample study isolates "keyword in H1 pinned" vs not. Adalysis's convention is to pin the keyword-relevant headline to H1 and a USP/CTA elsewhere (c, Source 49); Andrea Cruz pins the CTA in one headline for conversion rate (c, Source 67); Adpulse: pin headlines if conversion rate matters more than CTR (c, Source 74); Store Growers: "RSA Light" (2-3 headlines per pinned position) "showing the best results lately" (c, Source 82).
- When pinning is right: brand name in H1, regulatory / compliance wording, time-boxed promo text. (c) Sources 80, 79.
- Effect on Ad Strength: pinning lowers it because it "restricts the number of ad combinations"; Marvin says don't let that stop necessary pinning. (a) Source 54.

### Area 6. Copy variables that test well

- Sentence case vs title case: Optmyzr 2024 (1M+ ads): sentence case "performed best on all primary advertising KPIs" for RSAs and Demand Gen; title case only edged ETAs. Optmyzr Apr 2026 (~20K accounts): headlines in sentence case $7.46 CPA, 13.35% CTR, 12.50% CVR, 346.30% ROAS vs title case $27.47 CPA; descriptions: sentence and mixed case ~$17.50 CPA vs title case $19.97. (b) Sources 35, 36, 41, 42.
- Description length: Optmyzr Apr 2026: 61-70 characters had the best CTR (12.33%), ROAS (307.58%) and 9.21% CVR at $11.49 CPA; 0-50 chars had the lowest CPA ($9.61) but lower CTR (8.90%); 81-90 chars worst ($20.11 CPA). So "ROAS peaks at 61-70 chars" is verified, source = Optmyzr Apr 6, 2026. (b) Source 36.
- Headline length: under 20 characters $9.35 CPA, 11.77% CTR, 10.39% CVR vs 21-30 characters $18.27 CPA. 2024 study: "shorter headlines consistently outperformed longer ones." (b) Sources 36, 42.
- DKI / ad customizers: 2023 study: they increase impressions but decrease conversions per ad; 2024 study: "no significant improvement." (b) Sources 34, 42.
- Keyword in headline: Google best practice to include keywords in headlines (a, Source 6) and Ad Strength scores "keyword relevance" (a, Source 54); no independent stated-sample study isolates keyword-in-H1 lift.
- Headline count: Google says provide as many as possible (up to 15); Ginny Marvin's practical guidance is "8-10 headlines and 3 descriptions for most scenarios"; Optmyzr 2023 found more headline variants = more impressions per RSA; PPC Mastery observes a few headlines take 70-90% of impressions. Some 2025 practitioners argue for ~5 strong headlines to converge faster. (a) Source 59; (b) Source 34; (c) Sources 72, 84, 92, 83.
- Numbers in headlines: no stated-sample RSA study found in this pass; keep as an account-level test variable. (c)
- Text customization / automatically created assets: Google's AI writes extra headlines and descriptions from your landing page, ads and keywords, refreshed at least every 48 hours, served only when "predicted to perform better than" yours; they carry an "Added by" = Google label in asset reporting and count toward Ad Strength. Renamed to "text customization" inside AI Max from May 26, 2025; campaigns still using legacy automatically created assets are auto-upgraded to AI Max in September 2026. You cannot edit generated assets ("these assets will fully be automated"). Turn off: Campaigns > Settings > select campaigns > AI Max > Asset optimization > untick Text customization > Save. Turning it off also turns off Final URL expansion; once legacy ACA is disabled it cannot be re-enabled in the legacy form. AI Max enabling turns both on by default. (a) Sources 17, 18, 19, 20, 21, 91.
- For clean champion/challenger tests: leave text customization off, or at minimum filter "Added by: Google" assets out of the winner ranking. (c) Sources 57, 91.

### Area 7. Reading asset combos

- Combinations tab under "View asset details": impressions per served combination; most-shown combos are not proven best, and Google explicitly says not to hard-code them. Since Feb 2025 the report shows headlines served in sitelink slots, with stats "reported at the headline and not the sitelink level." (a) Sources 4, 62.
- Identifying the asset that drives the ad: use per-asset clicks and conversions (June 5, 2025 onward), rank on conversions and conversions per impression, but remember each served asset gets full credit for the ad's conversion, so ranking is relative, not additive. (a) Sources 1, 2.
- Pinned assets in rankings: a pinned asset serves on every impression (single pin) or on a share of impressions (multi-pin), so its impressions and conversions are inflated relative to unpinned assets. Google's campaign-level asset report exposes a "Pinned" column for this reason. Convention: exclude single-pinned assets from the winner/loser ranking, or compare them only against other assets pinned to the same position. (a for the column, Source 3; c for the rule, Sources 46, 49, 82.)
- Google's Feb 2025 flexibility means an unpinned headline may appear in sitelink space or as the only headline; its per-asset stats include those placements. (a) Sources 25, 61, 62.

### Area 8. Google Ads API

- Reporting resource: ad_group_ad_asset_view. Attribute fields: resource_name (customers/{cid}/adGroupAdAssetViews/{ad_group_id}~{ad_id}~{asset_id}~{field_type}), ad_group_ad, asset, field_type (HEADLINE / DESCRIPTION for RSAs), enabled, pinned_field (ServedAssetFieldType such as HEADLINE_1, HEADLINE_2, HEADLINE_3, DESCRIPTION_1, DESCRIPTION_2, or UNSPECIFIED when unpinned), performance_label (AssetPerformanceLabel enum: UNSPECIFIED, UNKNOWN, PENDING, LEARNING, LOW, GOOD, BEST), policy_summary, source (ADVERTISER vs AUTOMATICALLY_CREATED). Supports App, Demand Gen and RSA; not responsive display ads. (a) Sources 30, 31. Note: the enum page itself 404ed at the versions tried; values are as listed on the field reference and the v20 RPC page.
- Metrics on this view: metrics.impressions, metrics.clicks, metrics.cost_micros, metrics.conversions, metrics.conversions_value, metrics.ctr, metrics.average_cpc and related ratio fields (the view is classed "with metrics"). Practical limitation: conversions/clicks/cost per asset are only populated for dates on or after June 5, 2025; earlier ranges return impressions only. Ratios are directional per Google. (a) Sources 1, 31.
- Example GAQL (shape verified against the field list):

```
SELECT
  ad_group.id, ad_group_ad.ad.id, asset.id, asset.text_asset.text,
  ad_group_ad_asset_view.field_type,
  ad_group_ad_asset_view.pinned_field,
  ad_group_ad_asset_view.enabled,
  ad_group_ad_asset_view.performance_label,
  ad_group_ad_asset_view.source,
  metrics.impressions, metrics.clicks, metrics.cost_micros,
  metrics.conversions, metrics.conversions_value
FROM ad_group_ad_asset_view
WHERE ad_group_ad.ad.type = RESPONSIVE_SEARCH_AD
  AND segments.date BETWEEN '2025-06-05' AND '2026-08-28'
  AND ad_group_ad.status = ENABLED
```

- Ad-level metrics: query ad_group_ad with metrics.* plus ad_group_ad.ad.responsive_search_ad.headlines / descriptions (text, pinned_field). Headline text is not filterable in WHERE; filter client-side. (a) Source 32.
- Combination view: ad_group_ad_asset_combination_view (served_assets, enabled) with impressions; mirrors the UI combinations report. (a) Source 31 navigation; description page 404ed at v21, fields consistent with the UI report in Source 4.
- Updating an RSA: AdService.MutateAds with an update operation on ad.responsive_search_ad.headlines / descriptions / final_urls / final_mobile_urls and a field mask. The forum answer shows clearHeadlines() then addHeadlines(...) with update_mask "responsive_search_ad.headlines". You do not have to recreate the ad to change assets. (a) Sources 27, 32.
- Does editing reset stats? No. Since roughly October 2024 Google keeps the same ad ID on edit and creates a new version; UI totals aggregate all versions in the date range, and version history shows per-version data. So "RSA edits reset stats" is false; the real problem is the opposite: edits blend old and new copy into one ad ID, which contaminates a test. Create a new ad (AdGroupAdOperation create) and pause the old one when you want a clean before/after. (a) Source 24; (c) Source 52.
- Pause an ad: AdGroupAdService.MutateAdGroupAds with an update operation setting ad_group_ad.status = PAUSED and update_mask "status". (a) Source 27.
- Add a new RSA: AdGroupAdService.MutateAdGroupAds with a create operation: ad_group_ad.ad_group = resource name, ad_group_ad.status = ENABLED, ad_group_ad.ad.final_urls, ad_group_ad.ad.responsive_search_ad.headlines[] and descriptions[] as AdTextAsset (text, optional pinned_field), path1/path2 optional. Minimum 3 headlines and 2 descriptions; the third enabled RSA in an ad group is the last one allowed. (a) Sources 28, 29, 93.
- Built-in alternatives to manual champion/challenger:
  - Ad variations (Experiments > Ad variations): RSA-only; find and replace, update text (add/remove/pin assets), update URL; cookie-based split; you pick the traffic %; maximum 84 days; cannot be edited once live; results table shows the delta and confidence interval once significant; apply = replace existing ads or create new ones. Best for one change across many campaigns. (a) Sources 15, 16; (c) 65, 72.
  - Custom experiments: campaign-level copy with a traffic split (50% recommended), search-based (faster significance) or cookie-based split; 95% confidence interval displayed; ETAs cannot be tested; shared budgets and portfolio bidding excluded; "even with a set split, one side might get more exposure" because every slot is a separate auction. (a) Source 14; (c) 77, 78.
  - In the API these are CampaignExperiment / Experiment and ExperimentArm resources; ad variations have no dedicated write API and are UI-only (the API forum and docs expose only campaign experiments). (c, inferred from docs coverage.)

### Area 9. Learning period resets

- Google: bid strategy Learning is triggered by "New strategy", "Setting change" (a bid strategy setting changed), "Composition change" (campaigns, ad groups or keywords added or removed from the strategy), and "Ad group target change" (Shopping). Duration "up to 3 weeks or 1-2 conversion cycles". Ad or creative edits are not listed as triggers. "Algorithms continue to learn even when the bidding status no longer shows Learning." Manual CPC has no learning period. (a) Sources 12, 13.
- Practitioner consensus 2026: editing ad copy, adding an RSA, pausing an ad, or adding negatives does not reset Smart Bidding learning; bid-strategy switches, target CPA/ROAS jumps, conversion-action changes, pausing then re-enabling the campaign, and budget moves above roughly 20% do. Typical settle time ~7 days, 1-2 weeks common, ~50 conversions (or 3 conversion cycles) to exit; Groas hedges that "sweeping ad copy changes" can reset "in some cases." One vendor quantifies the reset cost at roughly -22% daily conversions and +18% CPL during re-learning (no sample stated). (c) Sources 87, 89, 90.
- Note the distinction: Smart Bidding learning is separate from the RSA's own combination learning. A new RSA starts its own asset "Learning" state (500 asset / 2,000 ad Search Top impressions in 30 days before a rating) and Optimize rotation tends to favor the incumbent ad, so a challenger typically under-serves for its first 1-2 weeks. (a) Source 59; (a) Source 10; (c) Source 46.

### Area 10. Real data points (numbers and dates)

- Adalysis Feb 8, 2022, ~1M ad groups running ETA + RSA: ETA won CTR in 51%, CVR in 67%, CPA in 67%, ROAS in 69%, CPI in 55% of ad groups; RSAs got the larger impression share regardless. (b) Source 48.
- Optmyzr Apr 7, 2023, 13,671 accounts: RSAs ~4x impressions of ETAs; RSA CPA $1.48 higher when it lost, $10.96 lower when it won; 2 RSAs per ad group = CVR surge; full pinning = 3.9x fewer impressions; 92% of accounts had an RSA, 7.7% never made one. (b) Source 34.
- Optmyzr Sept 9, 2024, 1M+ ads / 22K accounts: RSA CVR by strength Poor 3.2%, Average 3.4%, Good 3.3%, Excellent 3.1%; CPA $32.14 / $29.87 / $31.05 / $33.42. (b) Source 35.
- Optmyzr Apr 6, 2026, ~20K accounts: sentence-case headlines $7.46 CPA vs title case $27.47; partial pin $13.68 CPA vs full pin $32.57; description 61-70 chars ROAS 307.58%; headline under 20 chars $9.35 CPA. (b) Source 36.
- Google: 2nd RSA +6.6% conversions, 3rd RSA +3.7%; Poor to Excellent Ad Strength +12% (Apr 2024 statement) / +15% conversions (Aug 15-20, 2025 internal data). (a) Sources 6, 8, 54.
- Google asset rating thresholds: 500 asset impressions and 2,000 ad impressions in Google Search: Top over 30 days (2023 guide onward), vs 5,000 in 2022 material. (a) Sources 59, 79.
- Per-asset conversion data: available for dates on or after June 5, 2025; UI seen July 28, 2025; still rolling out Oct 17, 2025. (a) Source 1; (c) 56, 58.
- Asset flexibility: single-headline serving Feb 2024; up to two headlines in sitelink slots from Feb 20, 2025. (a) Sources 25, 62.
- Text customization rename May 26, 2025; forced AI Max upgrade for text-customization campaigns September 2026. (a) Source 18.
- Ad variations max duration 84 days. (c) Sources 65, 72.
- Adalysis minimums: 350 / 300 / 7 (low), 750 / 500 / 13 (mid), 1,000 / 1,000 / 20 (high) impressions / clicks / conversions; one week minimum. (c) Source 47.
- Dataslayer: 12,933 clicks per variant at 3% CVR to detect a 20% lift at 95% / 80% power; 100 conversions per variant floor. (c) Source 71.
- Umbro: prune at 100+ clicks and 0 conversions; don't act under 50 clicks. (c) Source 57.

---

## Part 3. Myths and stale advice

1. "Set ad rotation to Rotate evenly for tests." Rotate evenly and Rotate for conversions were removed in September 2017; only Optimize and Do not optimize exist, and Smart Bidding overrides the setting to Optimize anyway. (Sources 10, 26.)
2. "Google added asset-level conversion metrics in 2024." False. Per-asset clicks, cost and conversions exist only for dates on or after June 5, 2025 and surfaced in the UI July-October 2025. (Sources 1, 56, 58.)
3. "Replace every asset labeled Low." The Low/Good/Best/Learning label column was deprecated in 2025; 2026 guides still telling you to chase "Best" labels (e.g. Source 81) are stale. Use conversions and conversions per impression per asset instead.
4. "An asset needs 5,000 impressions before it gets rated." That was the 2022 threshold (Source 79). Google's guide since 2023 says 500 asset impressions and 2,000 ad impressions in Search Top over 30 days (Source 59).
5. "Editing an RSA resets its stats / creates a new ad ID." Since about October 2024 the ad ID persists and stats aggregate across versions (Sources 24, 52). The API can update headlines in place (Source 27). The real risk is contamination, not reset.
6. "Higher Ad Strength = better performance." Google says it is not an auction factor; Optmyzr's 2024 and 2026 datasets show Average beating Excellent on CPA/CVR/ROAS. (Sources 8, 35, 36, 54.)
7. "Never pin." Google's own docs say pin 2-3 per position when needed and honor H1/H2/D1 pins; Optmyzr's data shows partial pinning wins on CPA/ROAS; only full single-pinning of every slot hurts. (Sources 5, 35, 36.)
8. "Pick the RSA with the higher CTR." Google already optimizes toward CTR; the human job is CPI / CPA. Adalysis and Optmyzr both call judging on CTR or on conversion rate alone the biggest mistake. (Sources 44, 50, 51.)
9. "Three RSAs per ad group is best because Google allows three." Optmyzr's 2023 data shows two is the CVR sweet spot; Google's own uplift for the third is only 3.7%. (Sources 6, 34.)
10. "Asset conversions add up to the ad's conversions." They don't; every served asset gets full credit. Ratio metrics are directional only. (Sources 1, 2.)
11. "The combinations report tells you which combo converts." It shows impressions only, and Google says not to build static ads from it. (Source 4.)
12. "Automatically created assets is a separate opt-in you can ignore." It is now AI Max text customization, on by default when AI Max is on, and legacy ACA campaigns are force-upgraded September 2026. (Sources 17, 18.)
13. "DKI reliably lifts performance." Optmyzr found more impressions but fewer conversions (2023) and no significant improvement (2024). (Sources 34, 42.)
14. "Title Case looks more professional and wins." Sentence case won across RSA datasets in 2024 and 2026. (Sources 35, 36.)
15. "Changing ad copy resets Smart Bidding." Not in Google's trigger list; practitioners agree ad edits don't reset learning. (Sources 12, 13, 87, 90.)
16. "Unpinned headlines only ever show as headlines." Since Feb 2025 they can serve as sitelink-style links or as a single headline, and descriptions can be dropped. (Sources 25, 61, 62.)

---

## Part 4. Rules that fell out (for a champion-vs-challenger command)

Grades: (a) Google official, (b) stated-sample study, (c) practitioner convention.

1. Never exceed 3 enabled RSAs per ad group; refuse to create a challenger if 3 are already enabled. (a)
2. Default structure is 1 champion + 1 challenger per ad group; only go to 3 when testing distinct themes. (b: Optmyzr 2023 two-RSA CVR sweet spot; c: Adalysis)
3. Create the challenger as a new ad (AdGroupAdOperation create); never edit the champion's assets in place during a test, because the ad ID and stats persist across versions and would blend old and new copy. (a for persistence, c for the rule)
4. Never delete the loser; set ad_group_ad.status = PAUSED so history remains queryable. (c)
5. Don't try to "rotate evenly"; the setting no longer exists and Smart Bidding forces Optimize. Expect and log the uneven serving instead. (a)
6. Only read per-asset clicks/cost/conversions for dates on or after 2025-06-05; before that, asset rows carry impressions only. (a)
7. Treat asset-level CTR/CPA/ROAS as directional; rank assets on conversions and conversions per impression, never on a summed share of the ad's conversions. (a)
8. Exclude assets that are the only asset pinned to a position from the winner/loser ranking; compare multi-pinned assets only against others on the same pin. (c, supported by Google's Pinned column)
9. Exclude assets with source = AUTOMATICALLY_CREATED (Added by: Google) from rankings, and prefer text customization off while a test runs. (c)
10. Don't judge an asset before it has 500 impressions and its ad has 2,000 Google Search: Top impressions in the last 30 days. (a)
11. Don't judge any ad before 7 days of data, and never on fewer than the Adalysis floor for its traffic tier (350/300/7, 750/500/13, 1,000/1,000/20 impressions/clicks/conversions). (c)
12. Require both statistical significance and a minimum run: 95% by default, 90% allowed, 80% only for low-volume ad groups; 14 days minimum, 28 days preferred. (c)
13. Require at least 100 conversions per variant for a CPA verdict; below that, fall back to conversions per impression with the floors in rule 11, and label the verdict "provisional." (c)
14. Primary decision metric is conversions per impression (or revenue per impression for ecommerce) within the CPA/ROAS target; CTR is a tiebreaker, never the verdict. (c, with Adalysis worked examples)
15. A challenger that wins CTR but loses CPI/CPA is a loser; flag it explicitly. (c)
16. Prune an asset when it has 100+ clicks and 0 conversions, or 0 impressions for 2-3 weeks; never act on an asset with under 50 clicks. (a for zero-impression rule, c for click thresholds)
17. When replacing assets, swap no more than a few at a time so the RSA's own learning and the test remain readable. (c)
18. Keep 8-10 distinct headlines and 3 descriptions as the working default; more assets raise impressions but a handful will take 70-90% of serves. (a Marvin guidance; b Optmyzr impressions; c)
19. Write headlines in sentence case; flag Title Case as a test variable, not a default. (b)
20. Prefer headlines under 20 characters where meaning allows; prefer descriptions of 61-70 characters; flag 81-90 character descriptions. (b)
21. Avoid DKI in a challenger unless explicitly testing it. (b)
22. Pinning policy: pin only brand, compliance or promo text; if pinning, pin 2-3 assets per position; never fully single-pin every slot in a challenger. (a, b)
23. When you need a clean per-combination read, build a fully pinned pseudo-ETA from the top combination and run it as the challenger against the unpinned champion. (c, Adalysis method)
24. Ignore Ad Strength as a gate; log it, don't optimize for it. (a for "not an auction factor", b for no performance correlation)
25. For account-wide single-variable questions (CTA wording, price mention), use Ad Variations (RSA-only, max 84 days, cookie split) instead of per-ad-group challengers. (a, c)
26. For low-volume ad groups, aggregate the same line across ad groups (multi-ad-group testing) rather than declaring per-ad-group winners. (c)
27. Give a new challenger 1-2 weeks of grace before reading it; Optimize rotation under-serves new ads and the RSA starts in asset Learning. (a, c)
28. Ad copy changes don't require a Smart Bidding learning pause, but do not change bid strategy, targets, conversion actions or budget by more than ~20% during the test window. (a for triggers, c for 20%)
29. Log every test with start date, ad IDs, hypothesis, metric, confidence, and verdict; re-verify the verdict at 28 days before promoting. (c)
30. Promote by pausing the champion, keeping the challenger live, and immediately queuing the next challenger; never run an ad group with zero enabled RSAs. (c)
