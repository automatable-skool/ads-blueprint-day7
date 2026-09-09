# Ad testing - champion versus challenger, and how to read the result
Researched August 2026 across 94 sources (Google help and API docs first, then Optmyzr's 2023, 2024 and 2026 datasets, Adalysis, Search Engine Land, Ginny Marvin, and named practitioners) · two ads per ad group, what the asset report can and cannot tell you, the thresholds, and what changed in 2025
Next: run `/ad-tests` on any ad group with two live ads and about 100 clicks since the last read.

Read this before touching an ad that is already running.

## How every claim is graded

**(a)** Official Google documentation or API reference. **(b)** A study with a stated sample size. **(c)** Practitioner convention. **[V]** Vendor-published.

The mechanics here are (a) and firm. The thresholds are (c) with (b) support, and they disagree with each other at the margins - the file says which one this repo uses and why.

---

## The setup - two ads, and why not three

**Every ad group runs exactly two responsive search ads: the champion and the challenger.** Same keywords, same landing page, same final URL - only the copy differs. Google rotates both.

- The hard limit is 3 enabled RSAs per ad group (a). Google's own uplift numbers: a second RSA adds about 6.6% conversions, a third about 3.7% (a, no sample stated).
- **Two is the sweet spot.** Optmyzr, 13,671 accounts and 93,055 RSAs (2023, (b)[V]): impressions rise with each RSA, but "ad groups with two RSAs experience a surge in conversion rate that single-RSA and three-RSA ad groups don't." Three only when testing three distinct themes.
- The pair holds 30 headlines and 8 descriptions between them. That is the pool one round tests.

**"Rotate evenly" does not exist.** Removed September 2017. Only "Optimize" and "Do not optimize" remain, and under Smart Bidding Google forces Optimize regardless (a). Expect uneven serving - the incumbent gets most impressions, a new challenger under-serves for its first one to two weeks - and log it rather than fighting it.

**The challenger is a NEW ad, never an edit.** Since about October 2024 editing an RSA keeps the same ad ID and merges the stats across versions (a). So an edit does not reset the numbers - it does something worse: it blends old and new copy into one row and contaminates the test. Create the challenger fresh, pause the loser, never edit in place, never delete (history stays readable).

---

## What "View asset details" actually tells you (a)

Ads → the ad → View asset details. Two tabs: Assets and Combinations.

**Per asset you now get:** impressions, clicks, cost, conversions, conversion value, plus click-through, average cost per click and a Pinned column at campaign level.

**Only for dates on or after 5 June 2025.** Google: "Full performance statistics is only available for dates on or after June 5, 2025." The UI surfaced it July to October 2025. Any guide claiming per-asset conversions existed in 2024 is wrong; before that the table showed impressions and a label. **Never query a window that starts before 5 June 2025 and expect conversions per asset.**

**The Low / Good / Best labels are gone.** "The Performance label column has been deprecated as full performance statistics for each asset are now available." Any guide that says "replace every Low asset" is stale. The API enum still exists (PENDING, LEARNING, LOW, GOOD, BEST); ignore it.

**The attribution rule that breaks spreadsheets:** metrics are credited per asset SERVED. One impression showing three headlines credits each headline one impression; one conversion credits every served asset a whole conversion. So asset numbers do not sum to the ad's numbers, and Google says asset-level click-through, cost per click and cost per conversion "should be used as directional indicators only." Rank assets on conversions and conversions per impression, relative to each other. Never add them up.

**Asset Learning:** an asset needs about 500 impressions, inside an ad with about 2,000 impressions in Google Search: Top over 30 days, before Google rates it (a, 2023 guide onward). The old 5,000 figure is from 2022. Do not judge an asset below that floor.

**The Combinations tab shows impressions only**, and Google says not to build static ads from it - the most-shown combination is not the proven-best one. Since February 2025 it also shows headlines that served in sitelink slots.

**Ad Strength is not a factor in the auction (a)** and does not predict performance: Optmyzr's 1M-ad set (2024, (b)[V]) had Average beating Excellent on cost per lead ($29.87 versus $33.42), and the 2026 set (about 20,000 accounts) had Average at $12.43 versus Excellent at $28.68. Log it, never optimise for it.

---

## Which number decides the test

**Judge on CLICK-THROUGH RATE (Jono's ruling, 2026-08-31). Cost per conversion is reported as a cross-check, never as the verdict.**

Google's rotation already optimises toward clicks. The human job is the other half. Adalysis's worked example: an ad converting at 36% produced 4 conversions while an ad converting at 7.7% produced 12, because its click-through was 14 times higher. The reverse happens too - a great click-through with no conversions costs money faster than a line nobody clicks. Both Adalysis and Optmyzr call judging on click-through, or on conversion rate alone, "the single largest mistake."

**Why the ruling overrides the literature below.** Everything in this section was written for accounts with conversion volume. A local account at 20-40 conversions a month cannot resolve a cost-per-conversion verdict between two ads inside a fortnight, so the test never finishes and nothing is ever learned. A test you never call teaches you less than a test called on a weaker metric. Click-through is the metric that is always available, always fast, and genuinely reflects the thing ad copy controls - whether the click happens.

**What is kept, so the known failure mode stays visible:** when BOTH ads have real conversion data, the report checks whether the cheaper cost per conversion belongs to the other ad. If it does, that contradiction is printed beside the verdict. It never auto-overrides the call, and it is never dropped silently - it exists so a human can look before promoting.

Conversions per impression is still computed and reported, and is the right read at asset level where cost per conversion is directionally inflated by shared credit.

**Cost per click, conversion rate and cost per conversion explain WHY. Click-through decides.** A challenger that wins click-through while the champion is cheaper per conversion is still the winner on the ruling - but that contradiction gets said out loud, in those words, before anything is promoted.

---

## When to call it - the thresholds, and Jono's ruling

The textbook answer: 95% confidence, at least 100 conversions per variant, 14 days minimum and 28 preferred, and a sample-size formula that at a 3% conversion rate wants about 13,000 clicks per variant to detect a 20% lift (c). For a local account spending $500 a month that is roughly 12 months and 3,500 results per test - nine extra months paying for the loser, about $4,500 at a $500-a-month delta.

**Jono's ruling (2026-08-26): call it at 80% confidence, about 100 clicks per test, read fortnightly. "Do not do in 12 months what you could have done in 3."** 80% is the floor the low-volume practitioners already use (c: Clix, Adalysis for low-traffic tiers) and the trade-off is explicit: one test in five will be called wrong, and the next round catches it. Label every verdict with its confidence so nobody mistakes 80% for certainty.

The floors that still apply under the ruling:
- **Never read an ad before 7 days of data**, whatever the click count (c, Adalysis).
- **Both ads need real serving.** The Adalysis low-traffic floor is 350 impressions, 300 clicks and 7 conversions per ad; below about 100 clicks across the pair nothing is callable.
- **A new challenger gets one to two weeks of grace** before it is read - Optimize under-serves new ads and the RSA starts in asset Learning (a, c).
- **Zero conversions on both ads is not an ad test.** It is a landing page or tracking problem - route to `/landing-page`, which owns both the page and the tracking, before touching copy.
- **No provisional tier.** The old rule called verdicts on conversions per impression under 100 conversions per variant and re-checked at 28 days. It is gone: click-through decides at any conversion count, and the confidence percentage carries the uncertainty instead.

**Confidence, computed:** a two-proportion z-test on CLICK-THROUGH between the two ads - the same metric the call is made on. Testing significance on one metric and calling the winner on another produces verdicts that never reproduce. The script does this; the command reports the percentage and the verdict together.

---

## Reading the assets - swap the zeros

After the fortnightly read, inside the winner AND the loser:

- **Swap candidates are PROPORTIONAL, not threshold-based (Jono, 2026-08-31).** However many challenger lines won, that many of the worst champion lines come out - a line only leaves because a proven replacement arrived for its slot. The old absolute rule (100+ clicks and zero conversions) is REMOVED: it fires on conversion data the verdict no longer uses, and it pulls lines with nothing to replace them. Zero impressions for two to three weeks still flags a line as not serving (a). Rank worst-first on click-through, within pin buckets only, and never touch a line below the ~500-impression learning floor - that one is untested, not a loser.
- **Excluded from every ranking:**
  - The asset pinned alone to HEADLINE_1 (or any single-pinned position) - it serves on every impression by force, so its numbers prove nothing. Compare multi-pinned assets only against others on the same pin.
  - Assets with source AUTOMATICALLY_CREATED - Google's own text, labelled "Added by: Google". Keep text customization OFF during a test (Campaigns → Settings → AI Max → Asset optimization → untick Text customization) or filter them out of the read.
- **Swap a few at a time, not the whole ad.** The RSA's own learning and the test both need to stay readable.

**The library loop:** the champion's worst line falls out; the challenger's one winner moves in; the challenger's other lines go back to `ad-library.md` tagged tested-and-lost with the date; the next untested batch steps up as the new challenger. You cannot find a top-1% line in 30 tries (best of 30 is about top 3%). About 100 tries to expect one outlier - which is why the library holds hundreds of lines and the challenger keeps turning over.

**The volume target (Jono's ruling, 2026-09-01): 1,500 unique headlines tested account-wide over 6-12 months.** That is the pace that finds 99th-percentile lines instead of settling for the best of 30. The math: 1,500 lines over 12 months is ~125 new lines a month, ~8 challenger rotations - with 10+ live ad groups reading fortnightly there are 20+ challenger slots a month, so the ceiling is real. The account-wide number is reached through pooling - the same text is the same asset ID everywhere, so a line running in many groups clears its 500-impression floor many times faster.

**Generate in waves of ~300, never all 1,500 up front (Jono's ruling, 2026-09-01).** Proof points, offers and social-proof numbers change over the year - lines written today around today's subscriber count or guarantee go stale before they ever serve. Write ~300 lines into `ad-library.md` now, spend them down through challenger rotations, and write the next ~300 only when the untested pool runs low - always from the CURRENT `context/proof.md`. Every wave goes through the full `/write-ads` gates before it enters the library: ranked against the live competitor ads it has to beat, gate-culled, compliance-checked, every claim traced to `context/proof.md`. No line skips the gates just because it was written in a wave instead of on day one. The running count is tracked from the tags in `ad-library.md` (tested-and-lost + promoted + in test + untested), and the `/ad-tests` scoreboard prints it against the 1,500 target every read.

---

## What the challenger should be made of (b unless noted)

Optmyzr's 2026 dataset (about 20,000 accounts, [V]) plus the 2024 one (1M+ ads):

- **Sentence case.** Headlines in sentence case ran at $7.46 cost per lead against $27.47 for Title Case. Sentence case won every primary metric in both years. Title Case is a test variable, not a default.
- **Descriptions of 61 to 70 characters** had the best click-through (12.3%), best return on ad spend and 9.2% conversion rate. 81 to 90 characters was the worst bucket ($20.11). The cap is 90; write to 61-70.
- **Headlines under 20 characters** ran at $9.35 cost per lead against $18.27 for 21-30. Shorter wins where the meaning survives.
- **Partial pinning wins, full pinning loses.** Partial pin $13.68 cost per lead against $32.57 fully pinned; full pinning also cuts impressions about 3.9x (2023). Pin the keyword headline to position 1, leave everything else free. Google's own advice when pinning: pin 2-3 assets per position, never single-pin every slot.
- **Dynamic keyword insertion:** more impressions, fewer conversions (2023); no significant improvement (2024). Avoid in a challenger unless it IS the test.
- **8 to 10 distinct headlines and 3 descriptions** is Ginny Marvin's working default (a); more raises impressions but a handful of lines take 70-90% of serves. The repo's `/write-ads` fills 15 - that is fine for the champion; a challenger built to converge fast can run leaner.
- **Angles, not synonyms.** Fifteen rewordings of the same promise give Google nothing to test. See `references/google-ads.md` for the six angles.

---

## What does and does not reset learning (a)

Smart Bidding's Learning status is triggered by a new bid strategy, a bid-strategy setting change, a composition change (campaigns, ad groups or keywords added or removed), or a Shopping ad-group target change. **Ad edits, adding an RSA, pausing an ad, adding negatives are not on the list** - practitioners agree they do not reset learning. What does: switching strategy, jumping the target, changing conversion actions, pausing and re-enabling the campaign, and budget moves above roughly 20%.

So: during a test window, change nothing but the ads. The RSA's own asset Learning is a separate, shorter clock (the 500 / 2,000 impression floor above).

---

## The alternatives, and when they beat a manual pair

- **Ad Variations** (Experiments → Ad variations, RSA-only, cookie split, 84 days maximum, UI only - no write API): one change across many ad groups at once - a CTA wording, a price mention, a pin. Use it for account-wide single-variable questions.
- **Multi-ad-group testing:** for low-volume accounts, aggregate the same line across every ad group it appears in and judge the line, not the ad group (c, Adalysis). This is what the ad library's angle tags make possible.
- **Custom experiments** (campaign level, 50/50 split): for bidding and settings, not for copy.

---

## Myths that still circulate

1. "Set rotation to rotate evenly for tests" - removed September 2017; Smart Bidding forces Optimize.
2. "Google added asset-level conversions in 2024" - data begins 5 June 2025, UI arrived July to October 2025.
3. "Replace every asset labelled Low" - the labels are deprecated.
4. "An asset needs 5,000 impressions to be rated" - 500 asset and 2,000 ad impressions in Search Top over 30 days, since 2023.
5. "Editing an RSA resets its stats" - the ad ID persists and stats merge; the risk is contamination, not reset.
6. "Higher Ad Strength performs better" - not an auction factor, and Average beats Excellent in both Optmyzr datasets.
7. "Never pin" - Google's own guidance is 2-3 per position when needed; partial pinning wins on cost per lead.
8. "Pick the higher click-through" - was the myth under the old cost-per-conversion ruling. Superseded 2026-08-31: click-through IS the verdict, with a conversion cross-check reported alongside. The surviving warning is narrower - never promote on click-through without SHOWING the cost-per-conversion comparison.
9. "Three RSAs because Google allows three" - two is the conversion-rate sweet spot.
10. "Asset conversions add up to the ad's" - every served asset gets full credit.
11. "The combinations report shows what converts" - impressions only.
12. "Automatically created assets is an opt-in you can ignore" - now AI Max text customization, on by default when AI Max is on, force-upgraded September 2026.
13. "Title Case looks professional and wins" - sentence case won 2024 and 2026.
14. "Changing ad copy resets Smart Bidding" - not a trigger.

---

## The rules the command enforces

**Structure**
1. Exactly two enabled RSAs per ad group; refuse a challenger when three are enabled; never leave an ad group with zero. (a, b)
2. The challenger is a new ad with the champion's final URL; the loser is paused, never edited, never deleted. (a, c)
3. Everything the script creates lands PAUSED; the owner enables it. (repo rule)

**Reading**
4. Per-asset numbers only from 5 June 2025 onward. (a)
5. Judge the pair on CLICK-THROUGH. Cost per conversion, conversion rate and cost per click are reported as context; when both ads have conversion data, a cheaper-cost-per-conversion loser is flagged beside the verdict and never hidden. (Jono's ruling 2026-08-31, overriding Adalysis and Optmyzr who assume conversion volume this account will not have)
6. Call it at 80% confidence, about 100 clicks per test, fortnightly - labelled with its confidence. (Jono's ruling)
7. Never before 7 days; never before both ads have real serving; a new challenger gets 1-2 weeks of grace. (c, a)
8. Zero conversions on both ads routes to the page and tracking, not to copy. (c)
9. Re-verify a provisional verdict at 28 days before it becomes final. (c)

**Assets**
10. Swap candidates: 100+ clicks and zero conversions, or zero impressions for 2-3 weeks; never under 50 clicks. (a, c)
11. Single-pinned assets and Google's auto-created assets are excluded from every ranking. (a, c)
12. Swap a few lines per round, not the ad. (c)
13. Losers go back to the library tagged with the date; the champion's worst line drops when the challenger's winner moves in. (repo rule)

**Copy**
14. Sentence case; descriptions 61-70 characters; headlines short where meaning allows; no DKI unless it is the test; pin only the keyword headline to position 1. (b)

**Hygiene**
15. Text customization off during a test, or its assets filtered out. (a, c)
16. During the window change nothing but the ads - no strategy, target, conversion-action or budget move above about 20%. (a, c)
17. Ad Strength is logged, never optimised for. (a, b)
18. Every test is logged: start date, ad IDs, hypothesis, metric, confidence, verdict, swap list. (c)
