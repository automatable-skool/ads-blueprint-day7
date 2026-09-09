---
description: Champion vs challenger - read the pair on click-through, rank lines on their lifetime record within pin buckets, promote proportionally, rotate the challenger. Fortnightly.
argument-hint: [ad group ID or name, optional] [--pair-days N, default 14] [focus: read | swap | promote | log]
---

Run the fortnightly ad test read: $ARGUMENTS. Every ad group runs two responsive search ads - the champion (the service's best lines) and the challenger (the next untested batch from `ad-library.md`), same keywords, same page, same final URL. This command reads the fight, calls it, and sets up the next round. `/write-ads` built the pairs; this is the loop that makes them better.

**Read `references/ad-testing.md` FIRST** - what the asset report can and cannot tell you, the 5 June 2025 data cutoff, why click-through decides and cost per conversion is context (Jono, 2026-08-31), Jono's 80%-confidence ruling, and the 18 rules at the bottom. Do not invent thresholds.

Open with the roadmap: 4 steps, about 10 minutes for a whole account, 2 stops (the verdicts, then the swap plan). Then start.

**Requires the API connection** (`code/test_connection.py`) and at least 7 days since the last change to the ads. Sooner → say so and stop; a read inside the grace period is noise dressed as a verdict.

---

**1. Pull.** `python3 code/ad_test_report.py --out code/cache/ad-tests.json` (add `--ad-group <id>` for one group). Two windows, because they answer different questions:

- **The pair window** (`--pair-days`, default 14) judges champion vs challenger. Older data belongs to an ad that no longer exists.
- **The asset window is LIFETIME** - every day per-asset data exists for, back to the 5 June 2025 floor. A headline's record does not reset because you built a new ad around it, so never pass `--asset-days` unless you deliberately want a recent-only read.

It also returns **the line view**: every headline aggregated across every ad, ad group and campaign it has ever run in. The same text is the same asset ID everywhere, so four ad groups running one line give four times the data on it. Judge the LINE, not the ad group - this is the single biggest speed lever in the whole command, and it needs the text byte-identical ("Book today" and "Book today." are two different assets).

**2. Call each test.** For every ad group with two live ads and about 100 clicks across the pair:

- **The verdict is click-through rate (Jono's ruling, 2026-08-31).** Waiting for conversion volume on a local account costs months per round, and a test you never finish teaches you nothing. Cost per click, conversion rate and cost per conversion are reported as context - they explain WHY - but click-through decides.
- **The conversion cross-check.** When both ads have real conversion data the script checks whether the cheaper cost per conversion belongs to the OTHER ad. If it does, say so plainly next to the verdict: "challenger wins on click-through, but the champion is cheaper per conversion - worth a look before you promote." It never auto-overrides the call, and it is never hidden.
- **Report the confidence**, computed on click-through - the same number the call is made on. Jono's ruling: **call it at 80%.** Under 80% → "not yet", say how many more clicks it needs, move on.
- **Zero conversions on both ads** still routes to `/landing-page` as a separate note, since it owns the tracking too - the copy test can proceed on click-through, but a page that converts nobody is the bigger problem.
- **Not callable** (fewer than 100 clicks, one live ad, under 14 days old) → list it as waiting with the number it is waiting for.

Show me the verdicts as one list: ad group · champion click-through versus challenger · confidence · any conversion cross-check flag · the call (champion holds / challenger wins / not yet / page problem).

⛔ **APPROVAL GATE.** I confirm the calls before anything is planned.

**3. Plan the swaps.** For every called group, build the next round from the asset table - never from a hunch:

- **Rank inside pin buckets, never across them.** A headline pinned to position 1 serves on every impression by force, so its numbers are not comparable with a line running free. The script returns one league table per pin position plus one for the unpinned pool - read each on its own. You cannot have 15 free-floating headlines and one pinned one in the same ranking.
- **The challenger is rebuilt EVERY round, no exceptions.** A brand new ad with a fresh batch of untested lines from `ad-library.md`. It is the audition stage, not a thing you nurse along. Winners get promoted into the champion, the rest come out, 15 new lines go in next round.
- **The champion only changes if a challenger line actually beat one of its lines.** No winners means the champion is untouched - not one line moves. There is no such thing as a routine champion refresh, and nothing comes out just because it looks weak on its own.
- **Promote PROPORTIONALLY.** However many challenger lines won, that many of the worst champion lines come out - two winners in, the two worst out. Never more swaps than you have proven replacements for. A line only leaves the champion because something better arrived to take its slot.
- **Rank champion lines on ALL their history, not just the current ad.** A line that has served across four champion ads over eight months is judged on all of it. The script's line view already aggregates by asset ID across every ad the text has run in, so use that number, never the current ad's slice - that slice resets every time you rebuild and it is why champion lines always look untested.
- **A line below the ~500-impression learning floor never got an audition.** It goes back to the library tagged **untested - insufficient data - [date]**, NOT tested-and-lost. Burning library lines that never played is how the library dies.
- **Google's auto-created assets** (source AUTOMATICALLY_CREATED) are reported but never ranked. If text customization is on, say so and give me the click path to turn it off (Campaigns → Settings → AI Max → Asset optimization → untick Text customization).
- **The next challenger:** the next untested batch from `ad-library.md`, built to the copy rules in `references/ad-testing.md` - sentence case, descriptions 61-70 characters, short headlines where the meaning survives, the keyword headline pinned to position 1 and nothing else pinned, no dynamic keyword insertion unless that is the test, five of the six angles from `references/google-ads.md`. Every claim traceable to `context/proof.md`; every line through the compliance gate in `context/compliance.md`.
- **Library bookkeeping:** the losing challenger's lines go back to `ad-library.md` tagged **tested - lost - [date]**; the champion's dropped line likewise; promoted winners get **promoted - in champion - [date]**; the new challenger's lines get **in test - [date]**. The tags are the whole memory of the 1,500-line campaign - a line tagged tested-lost or promoted NEVER auditions again, and the next batch only ever draws from untested. The library only gets smarter if the tags are written.
- **Descriptions get the identical treatment.** They are judged in their own pool, swapped proportionally, and tagged exactly like headlines - the loop never treats them as furniture.

Write the plan as one JSON per ad group in the shape `code/ad_test_apply.py` reads (`ad_group_id`, `pause_ad_ids`, `new_challenger` with headlines, pins, descriptions, the champion's final URL - plus `new_champion`, same shape, whenever challenger lines won). A round with line winners pauses BOTH ads and creates BOTH new ads: the rebuilt champion (worst N lines out, N proven winners in) and the fresh challenger. The champion is NEVER edited in place - editing an RSA merges its stats and contaminates the history. Show me the human version: which ads pause, which lines leave, and each new ad's 15 headlines and 4 descriptions with character counts.

After the plan is written, draw the swap: `python3 code/ad_test_visual.py --report code/cache/ad-tests.json --ad-group <id> --plan code/cache/ad-test-plan-<group>.json --out code/cache/ad-test-visual-<group>.html` and give me the file:// path. One page, automatable.co styling: both ads with every headline and description, impressions and click-through per line - green for lines that won (held their slot or promoted in), red for lines that lost (swapped out or back to the library), yellow for lines under the 500-impression learning floor (untested, never judged) - and a button that animates the swap. For a not-callable group, run it without `--plan` for the plain two-ad view.

⛔ **APPROVAL GATE.** Nothing is pushed until I say yes per ad group.

**4. Apply and log.** `python3 code/ad_test_apply.py --plan code/cache/ad-test-plan-<group>.json` - it pauses the losers (never removes them), creates the new ads (rebuilt champion when the plan has one, plus the challenger) landing PAUSED, and refuses to leave the group with zero enabled ads or push past three. Then I enable the new ads myself. Append the round to `ad-tests-log.md`, one block per ad group per `references/output-format.md`: date · ad IDs · the verdict and its confidence · the lines swapped out and why · the new challenger's hypothesis in one line. A provisional verdict gets a re-check date 28 days out.

**Finish:** the scoreboard - groups called, challengers promoted, lines retired, groups still waiting and what for, and **the volume count: unique headlines tested to date (tested-and-lost + promoted + in test in `ad-library.md`) against the 1,500 account-wide target**. If the untested pool is running low, say so - the next wave of ~300 gets written from the current `context/proof.md`, never recycled from stale proof. Then the two rules for the fortnight: change nothing but the ads (no strategy, target, conversion-action or budget move over about 20%), and read again in 14 days. Then: "The line that won goes in your Skool post."

**Focus mode:** `/ad-tests read` stops after the verdicts · `/ad-tests swap` plans without pushing · `/ad-tests promote <group>` runs one group end to end · `/ad-tests log` prints the running scoreboard from `ad-tests-log.md`.

**Rules that never bend:** two ads per group, never three by default · the challenger is a new ad and fully rotates, never an edit · the loser is paused, never deleted · everything lands PAUSED · click-through decides and the conversion cross-check is always shown · lines rank only against others on the same pin · swaps are proportional to wins · assets under the learning floor are untested, not losers · 80% confidence, labelled · no reads inside the 14-day window.
