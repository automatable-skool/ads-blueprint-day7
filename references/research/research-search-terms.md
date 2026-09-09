# Research dossier: Google Ads search terms report + negative keywords for lead-gen / local service accounts

Compiled 2026-08-28. Scope: the daily/weekly search-term review loop. Evidence grades used throughout:

- **(a)** Google official documentation, Google blog, Google Ads Liaison statements, Google Ads API docs
- **(b)** A study or case with a stated sample and numbers
- **(c)** Practitioner convention (named practitioner, agency, tool vendor, conference talk); no stated sample

Access note: Reddit (r/PPC) could not be fetched from this environment (both old.reddit.com and www.reddit.com are blocked, and search indexes return no thread URLs). Practitioner-forum evidence therefore comes from PPC Chat recaps, Hero Conf UK 2026, and named practitioners quoted in Search Engine Land / Karooya. Four pages returned 403 (WordStream n-gram script, WordStream 2024 performance study, PPC Hero 2020 piece, Skai guide) and are cited only where a search-index summary was available; they are marked as such.

---

## Part 1: Numbered source list (70 sources, no duplicates)

### Google official (a)

1. **About the search terms report** - https://support.google.com/google-ads/answer/2472708 - live 2026 - Report shows "search terms that a significant number of people have used"; match type column shows exact/phrase/broad plus close-variant designations; insights labels use last 56 days.
2. **About negative keywords** - https://support.google.com/google-ads/answer/2453972 - live 2026 - Negative broad/phrase/exact defined; "Negative keywords won't match to close variants or other expansions"; "automatically account for casing and misspellings"; must add plurals/synonyms yourself; 16-word limit.
3. **About account-level negative keywords** - https://support.google.com/google-ads/answer/11396330 - live 2026 - 1,000 cap; applies to Search, PMax, App, Shopping, Smart, Local on search and shopping inventory; broad/phrase/exact supported.
4. **About negative keyword lists** - https://support.google.com/google-ads/answer/2453983 - live 2026 - 20 lists per account, 5,000 negatives per list; changes propagate to all attached campaigns.
5. **Fix issues with negative keywords** - https://support.google.com/google-ads/answer/9701952 - live 2026 - Negatives do not match reordering/synonyms; only first 16 words of a query count (was 10 before Oct 2019); keyword diagnostic only tests exact form.
6. **About the broad match keywords campaign setting** - https://support.google.com/google-ads/answer/13389795 - live 2026 - Setting converts all keywords to broad; only with conversion-based Smart Bidding; keywords "prioritized as if they are both exact and broad"; auto-upgrade to AI Max from September 2026.
7. **Keyword close variants: definition** - https://support.google.com/google-ads/answer/9342105 - live 2026 - Lists every close-variant type for positive keywords; "By default, all keyword match types are eligible to match to close variants. There's no way to opt out."
8. **Improving the search terms report while maintaining user privacy** - https://support.google.com/google-ads/answer/11127882 - 2021-09-09 - More queries shown from Feb 1 2021 onward; pre-Sept-1-2020 sub-threshold history removed Feb 1 2022; "only reporting on terms that have seen sufficient search volume across all Google searches."
9. **About the search terms report in Performance Max** - https://support.google.com/google-ads/answer/16327396 - 2025 - PMax search terms available from March 2023 data; negatives at account or campaign level for Search/Shopping; content exclusions for Display/Video.
10. **About search terms insights** - https://support.google.com/google-ads/answer/11386930 - live 2026 - Groups queries into intent categories; includes data hidden from the search terms report; "processed differently ... minor differences between the 2 reports."
11. **About brand settings for Search and Performance Max** - https://support.google.com/google-ads/answer/13721847 - live 2026 - Inclusions Search-only; exclusions Search + PMax; brand variants across spellings and languages handled automatically.
12. **Apply brand exclusions to PMax or Search** - https://support.google.com/google-ads/answer/14505308 - live 2026 - PMax option "Allow Shopping ads on searches that mention excluded brands"; Search brand exclusions upgrading into AI Max from May 27 2025.
13. **Apply brand inclusions to Search campaigns** - https://support.google.com/google-ads/answer/14453047 - live 2026 - Requires broad match setting; warns negatives that overlap the included brand reduce performance; AI Max migration from May 27 2025.
14. **Negative keywords in Performance Max campaigns** - https://support.google.com/google-ads/answer/15726455 - 2025 - PMax negatives apply to Search and Shopping inventory only; shared lists supported; account-level negatives also apply; predicted-impact preview.
15. **About data freshness** - https://support.google.com/google-ads/answer/2544985 - live 2026 - Clicks/impressions/cost 1-hour SLO; search terms refreshed later in the day (example: 6:00 AM Monday SF for Sunday); non-last-click conversions up to 15 hours; GA imports 12-24 hours.
16. **Add negative keywords to campaigns** - https://support.google.com/google-ads/answer/7102995 - live 2026 - "Make sure that your negative keywords don't overlap with your regular keywords"; Display/Video negatives are broad-only, max 1,000 considered.
17. **2024 Google Ads recap** - https://support.google.com/google-ads/answer/15639790 - 2024-11-18 - One negative now blocks misspelled variants (1.5M variants of "YouTube"); misspelled queries reported with the correct spelling, making ~9% of previously hidden terms visible; brand inclusions/exclusions launched.
18. **Get negative keyword ideas using the search terms report** - https://support.google.com/google-ads/answer/7102466 - live 2026 - "Add as negative keyword" from the report defaults to **negative exact match**; destination can be ad group, campaign, existing list, or new list.
19. **About reporting in AI Max for Search** - https://support.google.com/google-ads/answer/16470459 - 2025 - "Source" column and "AI Max" match-type filter; filter ignores "Other search terms"; wait at least 2 weeks after enabling AI Max before adding negatives.
20. **Create exclusions for Dynamic Search Ads** - https://support.google.com/google-ads/answer/7185083 - live 2026 - Negative dynamic ad targets (URL/page rules) plus normal negative keywords both apply to DSA; DSA auto-upgrades to AI Max from Feb 2027.
21. **Grow your Smart Bidding campaigns with broad match** - https://support.google.com/google-ads/answer/10195720 - live 2026 - Google internal 2020 data: ~25% more conversions (tCPA) and ~12% more conversion value (tROAS) when adding broad match.
22. **Google Ads Editor 2.11 release notes** - https://support.google.com/google-ads/editor/answer/16663512 - 2025 - Campaign-level negative keyword lists for PMax now editable in Editor.
23. **Google Ads API: Shared sets guide** - https://developers.google.com/google-ads/api/docs/targeting/shared-sets - live - SharedSet type NEGATIVE_KEYWORDS, SharedCriterion, CampaignSharedSet; ACCOUNT_LEVEL_NEGATIVE_KEYWORDS via CustomerNegativeCriterion.negative_keyword_list.
24. **Google Ads API: Query cookbook** - https://developers.google.com/google-ads/api/docs/query/cookbook - live - Canonical search_term_view GAQL replicating the UI, with segments.keyword.info.match_type and search_term_view.status.
25. **Google Ads API sample: Add customer negative criteria** - https://developers.google.com/google-ads/api/samples/add-customer-negative-criteria - live - CustomerNegativeCriterionService pattern; customer-level keyword negatives go through negative_keyword_list, not a bare KeywordInfo.
26. **Google Ads API: Limits and quotas** - https://developers.google.com/google-ads/api/docs/best-practices/quotas - live - Max 10,000 operations per mutate request (TOO_MANY_MUTATE_OPERATIONS); batch jobs recommend <=1,000 ops per AddBatchJobOperationsRequest.
27. **Google Ads API fields v25: search_term_view** - https://developers.google.com/google-ads/api/fields/v25/search_term_view - live - Confirms segments.search_term_match_type, segments.keyword.info.text / match_type, segments.date, segments.week; sibling views campaign_search_term_view, dynamic_search_ads_search_term_view, ai_max_search_term_ad_combination_view.
28. **Search Ads 360 Help: Use the search terms report to harvest keywords** - https://support.google.com/searchads/answer/6399068 - live - Filter "Exact Keyword Matches (Account) < 1" to find converting queries not yet covered by an exact keyword; set date range to match harvest cadence.
29. **Google blog: Kick off 2025 with new Performance Max features** - https://blog.google/products/ads-commerce/new-performance-max-features-2025/ - 2025-01-23 - Campaign-level PMax negatives rolling out to all; search term "Source" column; brand exclusions split Search-text vs Shopping.

### Trade press and Ads Liaison statements

30. **SEL: Google Ads to limit search terms reporting, citing privacy** - https://searchengineland.com/google-ads-to-limit-search-terms-reporting-citing-privacy-340137 - 2020-09-02 - Google: "you may see fewer terms in your report going forward"; threshold never defined.
31. **SEL: Google search terms report adds historical query data for impressions without clicks** - https://searchengineland.com/google-search-terms-report-adds-historical-query-data-for-impressions-without-clicks-374323 - 2021-09-09 - Search and DSA campaigns; coverage from Feb 1 2021.
32. **SEJ: Google Ads Liaison explains "Other" search terms issue** - https://www.searchenginejournal.com/google-ads-liaison-explains-other-search-terms-issue/506349/ - 2024-01-24 - Ginny Marvin: sub-threshold queries "are aggregated in within the 'other' search terms line"; one exact-match account reported 80% of spend and 90% of conversions in "Other".
33. **SEJ: How to get more out of search terms reporting in the age of privacy** - https://www.searchenginejournal.com/search-terms-reporting-privacy-and-automation/469333/ - 2022-11-02 - Ginny Marvin on Search Terms Insights as the privacy-safe route; argues for a "looser approach" to negatives under Smart Bidding.
34. **SEL: Google Ads doubles negative keyword list limit: glitch or quiet policy change?** - https://searchengineland.com/google-ads-doubles-negative-keyword-list-limit-glitch-or-quiet-policy-change-462361 - 2025-09-22 - Lists accepting >5,000; Marvin: "The threshold remains 5,000 ... there may be some cases in which lists a bit over the limit are accepted."
35. **SEL: Google Ads search terms report: 5 tips** - https://searchengineland.com/google-ads-search-terms-report-tips-465174 - 2025-11-26 (Jyll Saskin Gales) - Search terms carry their own match type; adding >=10% of search terms as negatives is a red flag; analyse the "Other" row; add the Keyword column.
36. **SEL: The real strategy behind negative keywords in 2026** - https://searchengineland.com/negative-keywords-strategy-476563 - 2026-05-06 (Sarah Stemen) - Growth-mode trigger: >3x target CPA, zero conversions, 90 days; 30/90/365-day windows; "remove proven irrelevance, not theoretical inefficiency."
37. **SEL: Negative keywords in paid search: 6 strategies** - https://searchengineland.com/negative-keywords-paid-search-strategies-438960 - 2024-04-03 (Sarah Stemen) - Set cost/click thresholds; adjust match type before negating; negate interrogatives.
38. **SEL: How to use broad match without losing control** - https://searchengineland.com/broad-match-control-466444 - 2025-12-19 (Leigh Buttrey) - New Search campaigns launch with broad match on by default since July 2024; negatives are "infrastructure"; frequent review in month one.
39. **SEL: Google Ads brand settings: inclusion and exclusion** - https://searchengineland.com/google-ads-brand-settings-452578 - 2025-02-26 (Jyll Saskin Gales) - Brand exclusion as an alternative to "search term whack-a-mole"; PMax then capped at 100 negatives.
40. **SEL: Google adds search terms visibility to Performance Max** - https://searchengineland.com/google-adds-search-terms-visibility-to-performance-max-campaigns-453489 - 2025-03-21 - PMax search terms in the standard report with add-as-negative.
41. **SEL: How to manage search terms in the new match type world** - https://searchengineland.com/how-to-manage-search-terms-in-the-new-match-type-world-325805 - 2019-12-02 (Ginny Marvin quoting Brad Geddes) - Pivot + n-gram + Levenshtein workflow; negate exact duplicates across ad groups.
42. **SEL: Study finds small businesses waste 25 percent of their PPC budgets** - https://searchengineland.com/study-finds-small-businesses-waste-25-percent-of-their-ppc-budgets-173917 - 2013-10 - WordStream, 500 SMB accounts; ~25% wasted; <50% had conversion tracking.

### Optmyzr / Vallaeys

43. **Optmyzr: So Google Ads is hiding your PPC data. What now?** - https://www.optmyzr.com/blog/google-ads-hiding-search-terms-report/ - 2021-08-18 - Matthew Umbro's Aug-vs-Sept 2020 hidden-click chart; GA workaround; Google "exploring ways to share more data."
44. **Optmyzr: Negative keywords guide 2026** - https://www.optmyzr.com/blog/negative-keywords/ - 2026-02-27 - 77% of PPC pros think removing all negatives would hurt; 2024 study of 7,000+ PMax campaigns: with account-level exclusions median CPA $21.45 / ROAS 425%, without $18.55 / 423%, CVR delta 0.24%.
45. **Optmyzr: State of PPC study (match types)** - https://www.optmyzr.com/blog/optmyzr-state-of-ppc-study/ - 2024-03-13 - 7,100+ accounts, 18,000+ campaigns; exact beat broad on CPA in 73.84% of accounts, CTR 81.57%, CVR 62.12%, ROAS 74.10%; CPC roughly even.
46. **Optmyzr: Google listened: 5 PMax fixes (24,702 campaigns)** - https://www.optmyzr.com/blog/performance-max-2025-updates-study-analysis/ - 2025-06-16 - 58% of advertisers saw flat or slightly better PMax performance with no exclusions; 71% used search themes with mixed results.
47. **Optmyzr Help: Negative Keyword Finder user guide** - https://help.optmyzr.com/en/articles/3075605-negative-keyword-finder-search-user-guide - live - Default 90-day window; hides last-14-day changes; default match type when adding is **phrase**; "Turbo mode" lowers thresholds.

### Adalysis / Brad Geddes

48. **Adalysis: N-grams, the secret to managing search terms** - https://adalysis.com/blog/n-gram-analysis-the-secret-to-scalable-search-term-management-in-google-ads/ - 2025-04-16 - Millions of terms collapse to 30-50K n-grams; filters "clicks >150 and conversions = 0" or "conversions = 0 sorted by cost."
49. **Adalysis: How to steer the Google Ads machine with negative keywords** - https://adalysis.com/blog/how-to-steer-the-machine-with-negative-keywords/ - 2022-05-17 - "how" queries at >$1,000 CPA vs $300 target after 10,000+ clicks in 90 days under Smart Bidding; negatives are the steering wheel.
50. **Adalysis: Find and fix common negative keyword problems** - https://adalysis.com/blog/find-fix-common-negative-keyword-problems-ppc-accounts/ - 2017-02-23 - Inconsistent application, conflicts, duplicate ad-group negatives, plus-sign malformed negatives, insufficient data.
51. **Adalysis: How to diagnose and work with keyword conflicts** - https://adalysis.com/blog/diagnose-work-keyword-conflicts/ - 2017-05-04 - Google's conflict report "does not include campaign negative lists. It also doesn't always find your conflicts."
52. **Adalysis: The hidden challenges of AI Max search term reporting** - https://adalysis.com/blog/ai-max-search-term-reporting/ - 2025-12-02 - AI Max claims credit for exact/phrase traffic; some AI Max terms show no keyword; add top terms as exact keywords.
53. **Adalysis docs: Negative keywords from search terms alert** - https://docs.adalysis.com/tools/audit/prebuilt-alert-list/search-terms/negative-keywords-from-search-terms - live - Default alert: zero conversions and >150 clicks in last 90 days.

### Other named practitioners and scripts

54. **ZATO (Kirk Williams): Keyword match type segmentation is dead** - https://zatomarketing.com/blog/keyword-match-type-segmentation-is-dead - 2022-05-04 - You can no longer confine search terms to an ad group by match type; use thematic groups plus DSA with negatives.
55. **Karooya: PPCChat, Google Ads questions answered by Ginny Marvin** - https://www.karooya.com/blog/ppcchat-google-ads-questions-answered-by-ginny-marvin/ - 2025-12-16 - Identical keyword/query preferred, then exact over phrase/broad; only broad/keywordless eligible for AI Overviews.
56. **Karooya: Blocking misspelled searches just got easier** - https://www.karooya.com/blog/blocking-misspelled-searches-just-got-easier-google-ads-update/ - 2024-07-04 - One negative blocks up to 1.5M misspellings; one-way (misspelled negative does not block the correct spelling); 9% more terms visible.
57. **Karooya: Change to search terms report and reaction** - https://www.karooya.com/blog/reaction-google-ads-limits-search-terms-report/ - 2020-09-03 - CJ Slattery, $120K/180 days: 30% of budget on terms clicked once; 44% on <5 clicks; implied 30-51% could vanish.
58. **Karooya: Negative keyword match types with examples** - https://www.karooya.com/blog/negative-keyword-match-types-with-examples-in-google-ads/ - 2022-01-28 - Must add plurals/stems/acronyms as separate negatives.
59. **Nils Rooijmans: Brainlabs n-gram script (GAQL update v2.2)** - https://nilsrooijmans.com/updated-google-ads-script-brainlabs-search-query-mining-for-n-gram-analysis/ - 2025-03-15 - 1/2/3-grams by campaign, ad group, account; word-count sheet; default 10-impression floor.
60. **Nils Rooijmans: Negative keyword suggestions script** - https://nilsrooijmans.com/google-ads-script-negative-keyword-suggestions/ - live - Defaults: >=60 clicks, >=$5 cost, <0.5 conversions, LAST_90_DAYS; checks against existing negatives with broad/phrase/exact logic.
61. **negator.io: Google Ads Scripts 101, automated negatives** - https://www.negator.io/post/google-ads-scripts-101-copy-paste-negative-keyword-automation-runs-while-you-sleep - 2025-12-29 - Thresholds by account size: <$5K/mo 5 clicks/$10; $5-50K 10 clicks/$20; >$50K 20 clicks/$50; 7-day lookback; adds as exact; preview mode first.
62. **negator.io: Hybrid negative keyword architecture for LSA + Search (home services)** - https://www.negator.io/post/local-service-ads-traditional-search-campaigns-hybrid-negative-keyword-architecture-home-services - 2025-12-29 - Universal 300-500 terms, search-specific 200-400; home services Search CVR 7.33%; 15-30% typical waste; 90% of LSA leads by phone.
63. **negator.io: 2025 algorithm update survival guide** - https://www.negator.io/post/google-ads-2025-algorithm-update-survival-guide-negative-keyword-strategies - 2025 - AI Max May 2025; PMax 10,000 March 2025; phrase CPCs +43% vs broad +29% Jun 2023-Jun 2025; Monday export cadence.
64. **Precisionly (Dez Calton), Hero Conf UK 2026 recap** - https://precisionly.co.uk/proactively-managing-negative-keywords-to-drive-ppc-efficiency-hero-conf-uk-2026/ - 2026-05-18 - Hidden search terms: +38% CPC, -35% CTR, materially higher CPA; MCC-level lists.
65. **ppc.io: Negative keyword conflicts** - https://ppc.io/blog/negative-keyword-conflicts - 2026-03-19 - "-free" broad negative in a shared list silently killed a "free trial" campaign; Google's recommendation misses shared-list conflicts.
66. **ppc.io: 139 negative keyword examples by industry** - https://ppc.io/blog/negative-keywords-examples - 2025-12-22 - Category taxonomy; warns not to auto-negate "free consultation"/"pro bono."
67. **Volado Labs: Negative keywords for home services** - https://voladolabs.ai/the-complete-guide-to-google-ads-negative-keywords-for-home-services/ - 2026 - 150-400 negatives typical; caveats on "free estimate," "reviews," "cheap plumber near me," license terms; broad for DIY/jobs, phrase for "how to fix."
68. **groas: PMax negative keywords 2025, finally here but still broken** - https://www.groas.com/post/google-performance-max-negative-keywords-2025-finally-here-but-still-broken - 2025-08-14 - Timeline late-2024 beta at 100, Jan 2025 GA, March 2025 10,000; case: 847 negatives cut irrelevant traffic only 8%.
69. **groas: Negative keyword list limit, what changed in 2025** - https://www.groas.com/post/google-ads-negative-keyword-list-limit-what-changed-in-2025-how-to-use-it - 2025-10-14 - Limits table: account 1,000; 20 x 5,000 lists (10,000 observed); PMax 10,000 per campaign.
70. **Adthena: How hidden search terms are impacting your Google Ads** - https://www.adthena.com/resources/blog/how-hidden-search-terms-are-impacting-your-google-ads/ - 2024-10-07 - Average 51% of spend in "Other"; PMax only 26% search-term visibility; one account with GBP 5M hidden.

Supporting sources also read (not counted above, all (c)): Store Growers negative keywords guide (upd. 2026-03-06, "phrase match is my go-to," weekly 10-15 min review); Hop Skip Media (2026-05-11, week 1 daily / weeks 2-4 twice weekly / month 2+ weekly); keywordme general list (2025, 8 categories; "free trial/free quote" match-type rule); keywordme local (2025, geo negatives for unserved cities); TLC Ads (2025-03-01 upd. 2026-04-29, 30-40% zero-intent spend in audits, twice-weekly first 30-60 days); aubado (~40% hidden, >80% on broad); Marlin SEM (54% impressions / 51% clicks hidden in a 7-day example); 360OM (2024-04-07); SpyFu (2021-05-17); Semrush negative keywords (2024-02-02); LeadUp (2026-07-30); get-ryze (2026-05-09, 20-40% waste); Rocket Clicks (2009-12-11, "no magic number"); The Paid Media Mix (2025-03-10, CPA >150% of account average over 90 days); evo.agency (2025-10-13); PEMAVOR n-gram; KeyCommerce negative dynamic ad targets; ppc.io GAQL guide; HawkSEM; Jyll Saskin Gales PMax search terms (2025-05-19); AdNabu PMax negatives; Skai (403, index summary only); WordStream 2024 study of 17,000+ accounts (403, index summary: 20-40% wasted on irrelevant clicks); Wikipedia / Statology "rule of three."

---

## Part 2: Findings by area

### Area 1: Search terms report mechanics 2024-2026

**What is hidden and why**
- (a) Since Sept 1 2020 the report "only includes terms that a significant number of users searched for." Google has never published the number. Sub-threshold queries roll into one row, "Other search terms." [30, 8, 32]
- (a) Sept 9 2021 partial reversal: Google began showing more queries (Search + DSA), including impression-only terms, retroactive to Feb 1 2021. Pre-Sept-2020 low-volume history was purged Feb 1 2022. Trade press reported ~6.5x more query data on average; Google's own page does not state a multiplier. [8, 31]
- (a) Jun/Jul 2024: misspelled queries are now reported under the correctly spelled query, which Google says moved ~9% of previously hidden terms into view. [17, 56]
- (b) Hidden share measured by third parties: Adthena (Oct 2024) average 51% of spend in "Other"; PMax only 26% visibility. Marlin SEM example: 54% of impressions, 51% of clicks hidden in a 7-day window. Karooya/CJ Slattery (Sept 2020, $120K over 180 days): 30% of budget on single-click terms, so 30-51% likely to disappear. Practitioner rule of thumb: ~40% hidden, above 80% on broad match keywords. [70, 63, 57, aubado]
- (b) Extreme case reported to the Ads Liaison (Jan 2024): an exact-match campaign with 80% of spend and 90% of conversions in "Other." [32]
- (b) Hidden terms perform worse: Hero Conf UK 2026 data showed hidden terms at +38% CPC and -35% CTR vs visible terms. [64]
- (a) Google's official answer to hidden data is Search Terms Insights (Search, PMax, Shopping): intent categories built from all queries including sub-threshold ones, 56-day labels, custom ranges back to March 2023, but "processed differently" so totals will not tie to the search terms report. [10, 1, 33]

**Match type of the search term vs the keyword**
- (a) The report has its own "Match type" column that describes how the *search term* related to the keyword (exact, phrase, broad, and close-variant flavours), which can differ from the keyword's match type. In the API this is segments.search_term_match_type (BROAD, EXACT, PHRASE, NEAR_EXACT, NEAR_PHRASE) alongside segments.keyword.info.match_type. [1, 27, 35]
- (a) Close variants apply to every positive match type and cannot be turned off: misspellings, singular/plural, stemming, abbreviations, accents, reordering, dropped function words, implied words, synonyms/paraphrase, same intent. [7]
- (a) Keyword selection order when several are eligible: identical keyword/query first, then exact over phrase/broad (Ginny Marvin, Dec 2025). Under the campaign-level broad match setting, keywords are "prioritized as if they are both exact and broad." [55, 6]

**Broad match defaults**
- (c, with (a) corroboration) New Search campaigns using Smart Bidding have launched with the "broad match keywords" campaign setting toggled on since July 2024; the help page still describes the setting as off by default for existing campaigns and only available with conversion-based Smart Bidding. Turning it on converts all phrase/exact keywords to broad. Campaigns using that setting auto-upgrade to AI Max in September 2026. [38, 6]
- (a) AI Max for Search (May 2025): its own search terms view ("Search terms and landing pages from AI Max"), a Source column, negatives are respected, Google asks for a 2-week ramp before adding negatives. The AI Max filter excludes "Other search terms," so its totals understate. [19]
- (c) Adalysis (Dec 2025): AI Max reporting claims credit for traffic exact/phrase keywords already had, and some AI Max terms show no keyword at all; de-duplicate before judging incrementality. [52]

**Data freshness (matters for a daily job)**
- (a) Clicks/impressions/cost: 1-hour SLO. Search terms rows are refreshed later (Google's example: yesterday's search terms complete by 6:00 AM local Monday for Sunday in San Francisco; later for London/Tokyo). Non-last-click conversions lag up to 15 hours; GA-imported conversions 12-24 hours. Data can be restated for invalid traffic and late conversions. [15]
- (a) PMax search terms report data exists from March 2023 onward only. [9]

### Area 2: Negative keyword mechanics

**Match types (negatives are literal)**
- (a) Negative broad (default when typed manually): blocks when every word is present in any order. Negative phrase: exact words in order, extra words allowed around. Negative exact: only that exact query. [2]
- (a) "Negative keywords won't match to close variants or other expansions." Broad negative "flowers" does not block "red flower." Reordering and synonyms are not covered. You must add plurals, stems, and synonyms yourself. [2, 3, 5]
- (a) Exception since Jun/Jul 2024: casing and **misspellings** are covered automatically ("YouTube" blocks 1.5M misspellings). It is one-way: a misspelled negative blocks its own variants but not the correctly spelled term. [17, 56]
- (a) Only the first 16 words of a query are evaluated for negatives (raised from 10 in Oct 2019). Symbols: plus-sign "modified broad" syntax is not valid for negatives. [5, 50]
- (a) "Add as negative keyword" from the search terms report defaults to **negative exact**. Optmyzr's finder defaults to **phrase**. Practitioners (Store Growers, Hop Skip Media, Optmyzr guide) converge on phrase as the everyday default and broad only for words that are never wanted anywhere. [18, 47, 44]
- (a) Display/Video negatives behave differently: broad only, max 1,000 considered. [2, 16]

**Levels and limits (as of 2025-2026)**
- (a) Account-level negatives: 1,000 max; apply to Search, PMax, App, Shopping, Smart, Local on search and shopping inventory; broad/phrase/exact supported; acts as one implicit list. [3]
- (a) Shared negative keyword lists: 20 per account, 5,000 per list; attach to Search, Shopping, and (since 2025) PMax. Sept 2025: lists over 5,000 observed working; Marvin says the threshold "remains 5,000" but "lists a bit over the limit" may be accepted. [4, 34, 69]
- (a/c) PMax campaign-level negatives: beta late 2024 at 100, GA Jan 2025, raised to 10,000 per campaign March 2025; Search/Shopping inventory only (not YouTube, Display, Gmail, Discover, Maps). Editor 2.11 supports PMax lists. [29, 14, 68, 22]
- (a) API mutate cap: 10,000 operations per request. [26]
- (c) Practitioner architecture: account-level for the small universal set, shared lists for category blocks (jobs, DIY, education, other trades), campaign-level for intent boundaries and geo, ad-group-level only for sculpting. Typical local-service account carries 150-400 negatives (Volado) or 300-500 universal + 200-400 search-specific (negator.io). [67, 62, hopskip]

**Conflicts**
- (a) Google warns that overlapping negatives block your own keywords. Google's "Remove conflicting negative keywords" recommendation checks ad-group and campaign negatives but is documented by Adalysis and ppc.io as missing shared-list conflicts and not always finding conflicts at all. The keyword diagnostic only tests the exact keyword form. [16, 51, 65, 5]
- (c) Fix order: tighten match type (broad to phrase/exact) before deleting; move the negative down to the specific ad group; never auto-apply the recommendation. [65, 51]

**Brand lists**
- (a) Brand inclusions (Search only, needs the broad match setting) restrict serving to queries containing listed brands; brand exclusions (Search + PMax) block queries for listed brands including misspellings, other spellings and languages, with a PMax option to keep Shopping ads on excluded-brand searches. Negatives that overlap an included brand hurt performance. Both upgraded into AI Max from May 27 2025. [11, 12, 13]
- (c) Brand exclusion is the practical substitute for competitor negatives in PMax where limits used to bite (Jyll Saskin Gales, Feb 2025). [39]

### Area 3: Intent classification of search terms

- (c) Every local-service guide converges on the same buckets: **hire** (service + location/urgency), **research** (reviews, best, vs, comparison, cost, how much), **DIY** (how to, fix, tutorial, video, YouTube, parts, Home Depot/Lowes/Amazon), **job seeker** (jobs, hiring, salary, apprentice, careers), **education** (school, course, certification, license, training), **wrong service/trade** (adjacent trades, suppliers, wholesale, rental), **competitor**, **geo out-of-area**. [66, 67, 62, keywordme]
- (c) Judging intent: sort by cost not clicks; bucket into relevant-converting / relevant-non-converting / irrelevant; look at SERP features of the query itself (map pack + ads = buyer, job boards = job seeker, wikiHow/YouTube = DIY). The SERP-as-signal method is standard in SEO intent-mapping literature (local pack = local intent, video results = how-to) and is applied by PPC practitioners informally; no PPC source quantifies it. [aubado, TLC, SEO intent sources]
- (c) Negate the *pattern* not the query: use aspects of a term (e.g. the "how do I" prefix) rather than the whole string (HawkSEM); Geddes: negate root terms after n-gram check to avoid conflicts. [HawkSEM, 41]
- (b/c) N-grams: millions of terms collapse to 30-50K 1/2/3-grams; 1-2 word n-grams find negatives, 3-4 word n-grams find keywords; n-grams also cover hidden and future queries that share the token (Adalysis, PEMAVOR, Brainlabs script updated Mar 2025 with 10-impression floor). Adalysis default alert: 0 conversions and >150 clicks in 90 days. [48, 59, 53, PEMAVOR]
- (c) Geddes' "conventional" example: high-CPA n-gram that was really comparison intent got its own ad group instead of a negative. Don't negate an intent you could serve better. [48]
- (c) Ginny Marvin (2022) and Optmyzr (2026) both push intent-category thinking (Search Terms Insights, theme-level review) over line-by-line whack-a-mole. [33, 44]

### Area 4: Decision thresholds

**Statistical basis (derived, then cross-checked with (b) sources)**
- The probability of seeing zero conversions in n clicks when the true CVR is p is (1-p)^n. Setting that to 5% gives n_min = ln(0.05) / ln(1-p). This is the standard "rule of three" (zero events in n trials => 95% upper bound on the rate of ~3/n) [Wikipedia, Statology]. Worked values:
  - CVR 2% -> 148 clicks
  - CVR 3% -> 98 clicks
  - CVR 5% -> 58 clicks
  - CVR 7.33% (negator.io home-services Search benchmark) -> 39 clicks
  - CVR 10% -> 28 clicks
- Key identity: spend of 3x target CPA with zero conversions equals 3 x (CPC / CVR) in spend, i.e. about 3/CVR clicks. **The "3x target CPA, zero conversions" rule is the rule of three expressed in money.** It is statistically defensible at ~95% confidence for a term whose *true* CVR equals the account target CVR. (Derived from [36] + rule of three.)
- Practitioner thresholds line up with this: Adalysis 150 clicks / 0 conv / 90 days (~2% CVR world); Nils Rooijmans 60 clicks / $5 / <0.5 conv / 90 days (~5% CVR world); negator.io by account size 5-20 clicks with a $10-50 floor on 7 days (deliberately aggressive, preview-first); Search Engine Land 2026 growth-mode "more than 3x target CPA with zero conversions over 90 days," efficiency-mode "more than $X, period"; TLC Ads "spending twice the average CPC with no conversions warrants immediate negation" (too aggressive by the math above unless intent is obviously wrong). [53, 60, 61, 36, TLC]
- (c) Windows: 30 days aggressive, 90 days balanced default, 365 for long cycles (SEL 2026). Optmyzr finder and Adalysis default to 90 days. [36, 47, 53]

**Intent overrides statistics**
- (c) Universal convention: a clearly wrong-intent term (jobs, DIY, wrong trade, out of area) is negated on sight at one click or even zero clicks; statistics only govern *ambiguous* terms. SEL 2026: "remove proven irrelevance, not theoretical inefficiency." Optmyzr: don't add "proactive" negatives without significance *unless* the intent is plainly wrong. [36, 44, 37]
- (c) Sanity check on volume: adding 10% or more of your search terms as negatives means the targeting is wrong, fix keywords/match types first (Jyll Saskin Gales, Nov 2025; SEL 2024 "adjust match types first"). [35, 37]

**Frequency**
- (c) Convergent cadence across Hop Skip Media, TLC Ads, Store Growers, aubado, keywordme, negator.io: **daily in week 1 of a new campaign or after enabling broad/AI Max, twice-weekly through weeks 2-4 (or first 30-60 days), weekly steady state for accounts over ~$5K/month, fortnightly under ~$2K/month with tight match types, quarterly list audit.** Monthly is called insufficient by TLC. Google's own AI Max guidance says wait 2 weeks before adding negatives after enabling it. [hopskip, TLC, Store Growers, aubado, 19]
- (a) Cost of waiting is set by data lag, not just habit: search-term rows finalize later than clicks (by ~6 AM local next day in Google's example), and non-last-click conversions lag up to 15 hours, so a *daily* job should score yesterday and earlier, not today, and should re-score the trailing 3 days for conversion arrival. [15]
- (c) Monday catch-up: negator.io's published routine is Monday export/analyse search terms, Wednesday PMax, Friday conflict check. Weekend traffic in home services is real (emergency queries), so Monday review of Fri-Sun is the practitioner norm; no source quantifies weekend waste share. [63]

### Area 5: Traps

- (a/c) **Bare word vs phrase**: broad negative "free" blocks "free estimate" and "free quote"; a shared-list "-free" killed a whole free-trial campaign (ppc.io 2026). Rule: negate "free download"/"free account" as phrase, and put risky single words on exact-only lists. Google's own doc says to check negatives against every keyword. [65, keywordme, 16]
- (c) **Negating your best terms**: check the Keyword column and the campaign's positives before adding; Google's conflict recommendation misses shared lists; run a conflict pass after every batch. [35, 51, 65]
- (c) **Over-negating strangles volume**: 58% of advertisers saw flat or better PMax with *no* exclusions (Optmyzr, 24,702 campaigns); account-level exclusions moved CVR only 0.24% in 7,000+ PMax campaigns; SEL 2026 quotes Paul DeMott ("constraining the algorithm's exploration") and Andrew Lolk ("people are just overusing negative keywords"). Impression share drops are the tell. [46, 44, 36, 62]
- (c) **Negatives under Smart Bidding**: Vallaeys: negatives are a binary switch while Smart Bidding can bid a term down; but Adalysis showed Smart Bidding kept buying "how" queries at 3x target CPA for 10,000+ clicks, so bidding does not fix intent. Use negatives for intent, bids for efficiency; consider seasonal on/off negatives when capacity-limited. [44, 49]
- (a) **PMax**: campaign-level negatives (10,000) and account-level negatives both apply, but only to Search and Shopping inventory; YouTube/Display/Gmail/Discover/Maps are untouched, which is 40-70% of spend in groas' accounts and why 847 negatives cut irrelevant traffic only 8%. Use brand exclusions and content exclusions for the rest. [14, 68, 12]
- (a) **DSA**: negative keywords apply to DSA; use negative dynamic ad targets (URL/title/content rules) for page-side exclusions such as sold-out or careers pages; DSA auto-upgrades to AI Max Feb 2027. [20, KeyCommerce]
- (a) **Brand exclusions vs negatives**: brand exclusions catch spellings/languages automatically and are the right tool for competitor blocking in PMax; negatives overlapping a brand *inclusion* reduce performance. [11, 13]
- (a) **AI Max**: negatives respected, but Google asks for a 2-week ramp; the AI Max filter hides "Other" so its numbers understate. [19]
- (c) **Copy-pasted industry lists** and legacy campaign negatives after restructures are the two most common conflict sources (ppc.io, Adalysis). [65, 50]

### Area 6: Positive-side actions

- (a) Search Ads 360 workflow: filter "Exact Keyword Matches (Account) < 1" plus conversions or volume to find winners not yet bid on as exact; add as exact with a bid that lifts impression share; run at the same cadence as the negative harvest. [28]
- (c) Modern version: any term converting at or below target CPA that is not already an exact keyword is a "Google found a winner you didn't bid on" signal; add as exact (or phrase for families). Adalysis recommends the same for AI Max terms to reclaim control and clean attribution. [aubado, 52]
- (a) "Already covered": Google's in-UI "add as keyword" will decline or flag terms already matched by an existing keyword; under the campaign broad match setting a term matched by an identical keyword is already prioritized "as if exact," so adding it again buys nothing. Kirk Williams' broader point: you cannot force a search term into one ad group via match type anymore, so harvest for bids and ad relevance, not for segmentation. [6, 54]
- (c) Jyll Saskin Gales: add the Keyword column so you decide between pausing a bad *keyword* and negating a bad *term*; often the keyword is the problem. [35]
- (c) Use converting-term language in ads and landing pages (HawkSEM); high-CPA-but-real intent n-grams get their own ad group rather than a negative (Geddes). [HawkSEM, 48]

### Area 7: Universal negative categories for local service

Consensus list (ppc.io, Volado, negator.io, groas, keywordme, get-ryze), all (c):

- **Jobs**: jobs, job, hiring, careers, salary, wage, apprentice, apprenticeship, employment, "near me hiring"
- **DIY / how-to**: DIY, how to, how do I, fix, tutorial, guide, instructions, YouTube, video, wiki, forum, Reddit, tools needed
- **Parts / suppliers / retail**: parts, supplies, Home Depot, Lowes, Amazon, wholesale, rental, rent, lease, used, refurbished
- **Education / licensing**: school, course, class, training, certification, certificate, license exam, degree, become a
- **Free / bargain**: free, cheapest, low cost, coupon, promo code, pro bono, volunteer
- **Other trades / wrong service**: sibling trades (plumbing campaign excludes HVAC terms and vice versa), commercial vs residential mismatches
- **Reputation / legal**: complaint, lawsuit, sue, scam, BBB, Yelp
- **Business-opportunity**: franchise, franchise cost, start a business, business plan, insurance (unless you sell it)
- **Geo**: neighbouring cities/states you don't serve (El Paso excludes New Mexico cities)

Per-client judgement calls, explicitly flagged by the same sources:
- "free" only as phrase pairs ("free download"), never bare, if you offer free estimates/quotes/consultations. [keywordme, 66, 67]
- "cheap"/"affordable": "cheap plumber near me" is hiring intent; block only for premium positioning. [67, keywordme]
- "near me": almost always keep; only "near me hiring"/"near me jobs" go. [groas, keywordme]
- "reviews"/"best": early-stage research; block for direct-response, keep for brand-aware campaigns. [keywordme, get-ryze]
- "license"/"licensed": "licensed electrician" is a buyer, "electrician license" is a student; use phrase negatives like "license exam," not the bare word. [67, groas]
- "emergency"/"24 hour": keep unless you don't offer it.
- "cost"/"how much": commercial intent for services; keep and answer on the landing page.

### Area 8: Google Ads API

- (a) Resource: `search_term_view` (attributes: resource_name, search_term, ad_group, status). `search_term_view.status` is the SearchTermTargetingStatus enum (NONE, ADDED, EXCLUDED, ADDED_EXCLUDED) and tells you whether the term is already a keyword or a negative in that ad group. Attributed resources: campaign, ad_group, customer. [24, 27]
- (a) Segments: `segments.search_term_match_type` (BROAD, EXACT, PHRASE, NEAR_EXACT, NEAR_PHRASE), `segments.keyword.info.text`, `segments.keyword.info.match_type`, `segments.date`, `segments.week`, `segments.day_of_week`, `segments.device`. Sibling views: `campaign_search_term_view`, `dynamic_search_ads_search_term_view`, `ai_max_search_term_ad_combination_view`, `smart_campaign_search_term_view`. [27]
- (a) Canonical query (Google cookbook, replicates the UI):
  ```
  SELECT search_term_view.search_term, segments.keyword.info.match_type,
         search_term_view.status, campaign.name, ad_group.name,
         metrics.clicks, metrics.impressions, metrics.ctr, metrics.average_cpc,
         metrics.cost_micros, campaign.advertising_channel_type
  FROM search_term_view
  WHERE segments.date DURING LAST_7_DAYS
  ```
  Daily-job variant (ppc.io pattern): add `metrics.conversions, metrics.conversions_value, segments.search_term_match_type, segments.keyword.info.text`, filter `campaign.status = 'ENABLED' AND metrics.clicks >= 1`, `segments.date BETWEEN 'YYYY-MM-DD' AND 'YYYY-MM-DD'` or `DURING LAST_30_DAYS / LAST_90_DAYS`, `ORDER BY metrics.cost_micros DESC`. Note: "Other search terms" is not a row in the API; it is the gap between campaign totals and the sum of search_term_view rows. [24, ppc.io]
- (a) Writing negatives:
  - Campaign-level: `CampaignCriterionService.MutateCampaignCriteria` with `negative=true` and `keyword {text, match_type}`.
  - Ad-group-level: `AdGroupCriterionService` with `negative=true`.
  - Shared list: `SharedSetService` (type NEGATIVE_KEYWORDS) -> `SharedCriterionService` (one SharedCriterion per keyword) -> `CampaignSharedSetService` to attach.
  - Account-level: SharedSet of type ACCOUNT_LEVEL_NEGATIVE_KEYWORDS attached via `CustomerNegativeCriterionService` with `negative_keyword_list.shared_set`; bare KeywordInfo is not accepted at customer level. [23, 25]
- (a) Limits: 10,000 operations per mutate request; keep batch-job requests at <=1,000 ops; entity caps mirror the UI (1,000 account-level, 20 lists x 5,000, PMax 10,000 per campaign). [26, 3, 4, 14]
- (a) Scripts: `AdsApp` exposes `report("SELECT ... FROM search_term_view ...")` (GAQL since the AWQL sunset), `campaign.createNegativeKeyword()`, `adGroup.createNegativeKeyword()`, and `AdsApp.negativeKeywordLists()`; the Brainlabs n-gram and Rooijmans suggestion scripts are the reference implementations. [59, 60, 61]

### Area 9: Real data points and studies

| Claim | Number | Source | Grade |
|---|---|---|---|
| Spend hidden in "Other search terms" | avg 51% of spend; PMax 26% visibility | Adthena, Oct 2024 | b |
| Hidden share, single-account examples | 54% impressions / 51% clicks (7 days) | Marlin SEM | b |
| Hidden share, exact-match account reported to Google | 80% spend, 90% conversions | SEJ, Jan 2024 | b |
| Projected hidden share when threshold rose | 30-51% of $120K/180d budget | CJ Slattery via Karooya, Sept 2020 | b |
| Practitioner rule of thumb | ~40% hidden; >80% on broad | aubado, TLC | c |
| Misspelling merge made visible | ~9% of hidden terms | Google 2024 recap | a |
| More queries after Sept 2021 change | ~6.5x (press); Google gives no number | SERoundtable/press vs Google page | c / a |
| Hidden-term quality | +38% CPC, -35% CTR | Hero Conf UK 2026 (Precisionly) | b |
| SMB wasted spend | ~25% of budget, 500 accounts | WordStream via SEL, 2013 | b |
| Wasted spend, larger sample | 20-40% on irrelevant clicks, 17,000+ accounts | WordStream 2024 (index summary; page 403) | b (unverified) |
| Home-services waste without negatives | 20-40%; 15-30% | Volado 2026; negator.io 2025 | c |
| Audited zero-intent spend | 30-40% | TLC Ads | c |
| Home-services Search CVR | 7.33% | negator.io | c |
| Exact vs broad, account-level wins | exact better CPA in 73.84%, CTR 81.57%, CVR 62.12% of 7,100 accounts | Optmyzr, Mar 2024 | b |
| PMax with vs without account-level exclusions | CPA $21.45 vs $18.55; CVR delta 0.24% (7,000+ campaigns) | Optmyzr 2024 | b |
| PMax exclusions | 58% flat or better with none (24,702 campaigns) | Optmyzr, Jun 2025 | b |
| PMax negatives effect | 847 negatives, 8% less irrelevant traffic | groas case, Aug 2025 | b (n=1) |
| Broad match + Smart Bidding lift | ~25% more conversions (tCPA), ~12% more value (tROAS), 2020 internal | Google | a (vendor) |
| Negatives-as-share-of-terms red flag | >=10% | Jyll Saskin Gales, Nov 2025 | c |
| PPC pros who think removing all negatives hurts | 77% | Optmyzr LinkedIn poll, 2026 | b |
| CPC inflation Jun 2023-Jun 2025 | phrase +43%, broad +29% | negator.io | c |
| Typical negative count, local service | 150-400; or 300-500 universal + 200-400 specific | Volado; negator.io | c |
| Smart Bidding failing on intent | "how" queries at >$1,000 CPA vs $300 target after 10,000 clicks/90d | Adalysis 2022 | b (n=1) |

---

## Part 3: Myths and stale advice

1. **"Negatives need every misspelling added by hand."** Stale since Jun/Jul 2024: one negative now blocks its misspellings (casing too). Plurals, stems, reorderings and synonyms still need separate negatives. [17, 56, 2]
2. **"Add +modified +broad negatives."** Plus-sign syntax was never valid for negatives and BMM itself was retired in 2021; lists still carry them. [50]
3. **"Negatives only look at the first 10 words."** Raised to 16 in Oct 2019. [5]
4. **"PMax has no negative keywords / only 100."** Campaign-level negatives GA Jan 2025, 10,000 per campaign since March 2025, lists supported, Editor 2.11 support. Still Search/Shopping inventory only. [29, 14, 68, 22]
5. **"PMax has no search terms report."** Added March 2025 with add-as-negative; data back to March 2023. [40, 9]
6. **"Shared lists hold 5,000, hard stop."** Since Sept 2025 lists over 5,000 are accepted in some accounts; Google says the documented limit is unchanged. Treat 5,000 as the design limit. [34]
7. **"Exact match is exact, so exact campaigns don't need search-term review."** Close variants (including same-intent paraphrase) apply to every match type with no opt-out; an exact-match account reported 80% of spend in "Other." [7, 32]
8. **"Use match-type-segmented ad groups to control which terms land where."** Dead since close-variant expansion; Kirk Williams 2022. [54]
9. **"New Search campaigns default to keyword match types."** Since July 2024, Smart Bidding campaigns launch with the broad match setting on; check the toggle at build time. [38, 6]
10. **"Google's conflict recommendation is a complete audit."** It misses shared-list conflicts and sometimes ad-group ones; verify manually. [51, 65, 5]
11. **"More negatives always equals less waste."** Optmyzr's PMax datasets show near-zero CVR delta and 58% doing fine with none; over-negation is the 2026 failure mode. [44, 46, 36]
12. **"Monthly search-term review is fine."** Every 2025-2026 practitioner source calls monthly insufficient for accounts spending >$5K/month; weekly is the floor, daily at launch. [TLC, hopskip, aubado]
13. **"The search terms report is real-time."** Search-term rows lag clicks; non-last-click conversions lag up to 15 hours; today's data is incomplete. [15]
14. **"Search Terms Insights and the search terms report should reconcile."** Google says they are processed differently and will differ. [10]
15. **"Brand inclusions are a Search setting you keep forever."** Brand inclusions/exclusions on Search migrate into AI Max from May 27 2025; the broad-match campaign setting auto-upgrades to AI Max in Sept 2026; DSA in Feb 2027. Plan the review job around AI Max views. [13, 6, 20]

---

## Part 4: Rules that fell out (for a daily search-terms command)

Grades: (a) Google doc, (b) study with numbers, (c) practitioner convention, (d) derived from the math in Area 4.

**Pulling data**
1. Query `search_term_view` with `segments.date` for yesterday and the trailing 89 days; never score "today" (search-term rows and non-last-click conversions lag). (a)
2. Always pull `search_term_view.status`, `segments.search_term_match_type`, `segments.keyword.info.text` and `campaign.advertising_channel_type` so every row knows its triggering keyword, its variant type, and whether it is already ADDED/EXCLUDED. (a)
3. Compute the "Other search terms" share per campaign as campaign cost minus the sum of visible search-term cost; alert when it exceeds 50% (Adthena average is 51%) and route those campaigns to Search Terms Insights review. (b)
4. Re-score the trailing 3 days each run so late conversions can rescue a term flagged the day before. (a)

**Classifying**
5. Bucket every term into hire / research / DIY / job / education / parts-supplier / other-trade / competitor / geo-out / unknown before looking at metrics. Intent decides first; metrics only decide the "unknown" bucket. (c)
6. Wrong-intent buckets (job, DIY, education, parts, other-trade, geo-out) are negated at first sight, one click is enough. (c)
7. Run 1-gram and 2-gram aggregation on the 90-day window; a token with >150 clicks (or >3/CVR clicks) and zero conversions is a negative candidate at the token level, not the query level. (b, d)
8. Never negate a term whose triggering keyword is your core service keyword without a human look; check the Keyword column first. (c)

**Thresholds for ambiguous terms**
9. Zero-conversion terms are negated only after n_min = ln(0.05)/ln(1-CVR) clicks using the campaign's trailing-90-day CVR (about 3/CVR), or equivalently after spend >= 3x target CPA. (d, c)
10. In efficiency mode use the campaign's own cap: spend >= 2x target CPA with zero conversions over 90 days flags for review, 3x auto-negates if intent is not hire. (c)
11. Do not negate any term with at least one conversion at or below 1.5x target CPA; if CPA is above 3x target on 2+ conversions, flag for bid or ad-group treatment, not a negative. (c)
12. If the day's proposed negatives exceed 10% of that campaign's search terms, stop and flag the keyword set or match type as the problem. (c)

**Match type and placement**
13. Default to negative **phrase** for multi-word patterns; negative **exact** for one-off bad queries added straight from the report (Google's default); negative **broad** only for single tokens that are never wanted anywhere (jobs, apprenticeship, DIY). (a, c)
14. Never add a bare broad negative for free, cheap, near me, license, reviews, cost, emergency; use phrase pairs ("free download", "license exam", "near me hiring") instead. (c)
15. Because negatives ignore plurals, stems and synonyms, generate the singular/plural pair for every new negative and add both. (a)
16. Because negatives now cover misspellings, do not generate misspelling variants. (a)
17. Place category negatives in shared lists (max 20 lists x 5,000), account-level only for the small universal set (max 1,000), campaign-level for geo and intent boundaries, ad-group-level only for sculpting. (a, c)
18. Keep every negative to 16 words or fewer and never include plus signs. (a)

**Conflicts and safety**
19. Before committing, test each new negative against every enabled keyword in the affected campaigns and against brand-inclusion lists; block the write on any match. Google's conflict recommendation does not cover shared lists. (a, c)
20. Run in preview mode for the first 2-3 weeks of a new account and require a human approval on the batch; compare false-positive rate before enabling auto-apply. (c)
21. Watch impression share after each batch; a drop with no CPA gain means over-negation, roll back the batch. (c, b)
22. Do not add negatives to an AI Max campaign in its first 2 weeks. (a)

**PMax, DSA, brand**
23. PMax negatives (campaign 10,000; account 1,000) only touch Search/Shopping inventory; pair with brand exclusions and content exclusions rather than expecting negatives to fix YouTube/Display waste. (a)
24. Use brand exclusion lists, not negatives, for competitor blocking in PMax and AI Max; they cover spellings and languages automatically. (a)
25. For DSA, route page-side problems (careers, blog, sold-out) to negative dynamic ad targets and query-side problems to negative keywords. (a)

**Harvesting**
26. Any term with a conversion at or below target CPA whose status is NONE (not ADDED) is proposed as an exact keyword in its triggering ad group; skip when the campaign-level broad match setting is on and an identical keyword exists. (a, c)
27. Feed converting-term language back to RSA headlines and landing pages as a secondary output. (c)

**Cadence**
28. Daily runs for the first 7 days of any new campaign, new broad-match toggle, or AI Max enablement; twice weekly through day 30 (60 if under ~50 conversions/month); weekly thereafter; Monday run always covers Fri-Sun. (c)
29. Quarterly: audit shared lists for conflicts, dead entries, and legacy plus-sign negatives; re-check limits against the current Google numbers. (c)
30. Log every negative added with the reason, threshold hit, and date so a future "did this hurt volume" review is possible. (c)
