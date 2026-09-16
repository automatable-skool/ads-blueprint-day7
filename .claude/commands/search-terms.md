---
description: The search terms pass - searches googled for intent, junk staged as phrase negatives, winners harvested as keywords, both pushed only after your yes
argument-hint: [--yesterday | --days N] [campaign ID, optional] [focus: pull | judge | stage | harvest | push | ngrams]
---

Run the search terms pass: $ARGUMENTS. **Default is LIFETIME** - every term the account has ever shown for. A pass that only reads yesterday depends on somebody running it every single day, and the first skipped week becomes a hole nothing goes back for. Terms already handled (status EXCLUDED = negated, ADDED = it is a keyword) are filtered out by the script, so a lifetime pull is the same work with nothing missed, not more work. Use `--days N` only for a deliberate recent slice.

**Read `context/audit-results.md` if it exists** - the "For /search-terms" section carries the watch list, the negative starter list (full, not a count), the ask-first block, and any negative already blocking a keyword you bid on. Start from it rather than rebuilding it.

**Read `references/search-terms.md` FIRST** - the threshold math, the junk taxonomy with its over-blocking warnings, the SERP scoring rule, the limits, and the 21 rules at the bottom. Do not invent thresholds or categories.

**Every conflict check in this command is account-wide, never local.** A negative does not stay where you put it: an account-list negative hits every campaign, and a campaign negative hits every ad group inside it. So a proposed negative is tested against **every enabled keyword in the whole account**, not just the campaign the term came from, and the batch names the campaign and ad group of anything it would kill. The most expensive mistake this command can make is negating junk in one campaign and silently switching off a keyword that was working in another. The harvest side of the pass runs the same check pointed the other way (step 4).

Open with the roadmap: 5 steps, about 5 minutes on a daily run, 2 stops (the negatives batch, then the keyword batch), one file out - `search-terms-plan.md`. Then start.

**Requires the API connection** - `code/test_connection.py` first. Not live yet, or the account has no spend in the window → say so and stop; this command earns its keep once traffic flows.

---

**0. The numbers every threshold depends on.** Read `context/business.md` → `## The economics` for
**Target cost per lead**. Gate 3, gate 5 and every harvest rule are multiples of it, so without it this
command is inventing its own thresholds. Blank or a placeholder → **ask once, in one line, and write the
answer back to `context/business.md`**: *"What's the most you can pay for a lead and still be happy? If
you're not sure, tell me what one closed job is worth and roughly what share of leads close, and I'll work
it out."* If I decline, use the account's own trailing cost per lead as the target, **grade every
threshold-based finding `Assumed`, and say the assumption inline every time a number depends on it.**

Also read the business name for `--brand`. Brand terms convert far better than cold traffic, so one
blended target mis-grades both sides - brand junk survives and non-brand winners look like losers.

**1. Pull.** `python3 code/search_terms_report.py --customer <10-digit ID> --out code/cache/search-terms.json` (lifetime; add `--days N` only for a recent slice). The script reads `--sells`, `--not-offered` and `--serve-areas` from `context/business.md` (What we do · What we DON'T do · Service area) and `--brand` from `BUSINESS_NAME` in `.env` on its own, and prints which it filled and which came up empty. Pass a flag by hand only to override - `--brand "<name>,<variants>"` when the name has spellings the searches use.

**⛔ Confirm the account before pulling.** The connection may reach several accounts and `.env` names only
one. A report built against the wrong account looks completely normal and is completely worthless. Say
which account you are about to pull and what `context/business.md` describes; **if they are not the same
business, stop and ask.** The script prints `pulling account <id>` to stderr - quote it back in the report
header. Never edit `.env` to switch accounts; pass `--customer`. It splits the terms into `unjudged_terms` - ranked by spend, this is your queue - and `already_handled_terms`, plus the **hidden share per campaign** (keyword clicks minus visible term clicks). Judge the unjudged list only, and say how many were skipped as already handled so the number is visible rather than silently dropped. On a first lifetime run say up front that the queue may be long and that we work it worst-spend-first, not end to end.

**The pull also computes the aggregates the report is built from - use them rather than re-deriving:**
- `ad_groups[]` - spend, leads and **zero-lead spend** per ad group. Visible terms only; label it as such.
- `sources[]` - spend per keyword AND how each term matched. **This is section 03** and it is what turns
  forty negatives into one keyword fix.
- `matched_how[]` - broad vs phrase vs exact.
- `brand_split` - brand and non-brand cost per lead side by side. `available: false` means no brand tokens
  were passed, so every threshold below is blended and says so.
- `cross_ad_group_terms[]` - one search term caught by several ad groups. **Do not write that they
  compete for it** - Google says duplicate keywords "don't compete with each other in the auction" and only
  one can fire, so that phrasing is factually wrong and banned repo-wide. Say what actually goes wrong:
  **you cannot predict which ad and which landing page the searcher gets, and the performance data splits
  across every copy.** Report it under section 03 with every group named.
- Each term carries `cost_per_conversion`, `value_per_conversion`, `roas` and `ctr`. **A term at target cost
  per lead on half the average job value is a loser that looks like a winner** - check value, not just count.

Say the hidden share out loud before anything else. Above 40%, every conclusion below carries lower confidence and I say so; above 50%, the campaign gets flagged for Search Terms Insights review and tighter match types - row-by-row is fighting a minority of the problem there.

**2. ⛔ GATE 0 FIRST - judged on intent, never on cost.** This runs before every dollar threshold below,
and **cost is not part of the test.** A real run proved why: waste in a mature account is spread across
tens of thousands of terms at $1-25 each, so gate 3 dismissed 43,058 terms worth $37,405 as "noise" and
gate 5 could only ever reach 3 terms in the whole account. Judged on intent instead, the same account
showed **$5,577 across seven categories** where the cost gates found $1,377.

The pull returns these in `intent_flags`, with `by_value` naming every row behind every count:

- **`other_service`** - a different job in the same event. Saxophonist, wedding planner, emcee, violin,
  party rentals, confetti machine. Built into the script, extended by `## What we DON'T do`.
- **`combo`** - names our service AND someone else's ("saxophone and dj"). **They want a package we
  half-fill, so we do not qualify.** Flag, do not silently keep.
- **`out_of_area`** - names a place outside `## Service area`. Longest place name wins, so
  "vancouver island" is never read as Vancouver. **Surrounding municipalities are keeps; other metros are
  cuts** - confirm the radius once per campaign city, then it is mechanical forever.
- **`marketplace`** - GigSalad, Thumbtack, Bark, The Knot. They want a directory that resells the lead to
  fifty businesses.
- **`unrelated`** - same event, not the service. "rsvp", seating charts, dresses, honeymoons.
- **`informational`** - deciding WHETHER, not choosing WHO. "do i need a dj for my wedding". Price
  queries are deliberately excluded - "how much does a wedding dj cost" is a buyer.
- **`niche`** - a real but small segment ("greek djs near me", "persian dj"). **FLAG ONLY, never
  auto-negated, and never negated on segment size alone.** Whether a slice is worth serving is a business
  call and the input that decides it is not in the account.

  **⛔ Show the segment's own cost per lead before asking, because "small" and "unprofitable" are not the
  same thing.** In the account this was built against, the niche bucket carried 955 terms and $887 and
  returned **18 leads at $49** - and several segments beat the account average outright: desi $18 a lead,
  latin $31, greek $32, arabic $35. Persian, the example that prompted the rule, was the worst at $89.
  A run that negated the whole bucket on "less than 1% of the population" would have cut the best traffic
  in it. So: one line per segment - spend, leads, cost per lead - then ask which ones the business
  actually wants, and let the number lead the conversation rather than the population share.

**⛔ GATE 0 SIZES THE PROBLEM. IT DOES NOT LICENSE 12,913 NEGATIVES.** This is the rule that keeps the
whole check safe, and `references/search-terms.md` is unambiguous about why:

- **Rule 10 of that file:** more than **10% of a campaign's terms** proposed as negatives means the
  keywords or match types are wrong, and the answer is to fix those, not to stage the batch. A gate 0
  result at 29% of terms is not a big negatives batch - **it is the match-type finding**, and it gets
  reported under section 03.
- **Over-negating measurably costs money.** The largest sample available (Optmyzr, 7,100 accounts, 2024)
  found accounts WITH account-level exclusions ran a **worse** median cost per lead - $21.45 against
  $18.55. Smart Bidding already bids losing terms down to pennies; a manual negative removes the term at
  **any** price, including the one where it would have converted. **Negatives are for intent, bids are
  for efficiency.**
- **So negate the PATTERN, never the row.** Forty-five city tokens covered 2,837 out-of-area terms in the
  account this was built against; eight service words covered 3,364 more. That is a few dozen phrase
  negatives, not twelve thousand. If a category cannot be reduced to a pattern, it is a keyword problem.
- **Never negate a term triggered by a core service keyword without a human look** (rule 6 of the
  reference), and watch impression share after any batch: a drop with no cost-per-lead gain means roll it
  back.

**Two rules that stop this from becoming the over-block:**
- **A category that converted is never auto-staged.** `flag_summary` marks it `REVIEW - it converted`;
  show the converting rows and ask. Out-of-area terms in particular convert when the radius is wrong.
- **`not_offered` or `serve_areas` empty means the check DID NOT RUN.** Report it as not measured, never
  as a clean result. `intent_inputs` in the pull carries both flags.
- **Empty is a question, not a shrug.** If `--not-offered` or `--serve-areas` came up empty, ask the owner now
  ("What do you NOT sell?" · "Which places do you serve?"), write the answers into `context/business.md` under
  `## What we DON'T do` and `## Service area`, and re-run the pull. The next run reads them without asking.

**What gate 0 cannot catch: competitor and performer names.** "music by starlite" is not a pattern, it is
a name. Those come from the SERP check at gate 4, or from `competitor-ads.md` if `/scrape-competitors` has
run. Say so rather than implying the sweep was complete.

**2b. Judge the rest - a FILTER, not a taxonomy.** The default answer for any term is **leave it alone**. Most search terms are neither junk nor winners, they just are, and at lifetime scale you will have thousands of them - labelling every one to act on forty is a waste of a run. Nothing gets a bucket unless it is about to become a negative or a keyword.

Run the gates in this order and **stop at the first one that fires**. The order is deliberate: it puts the free checks before the expensive ones so nothing gets googled that did not earn it.

**Gate 1 - known junk patterns (free, no search).** Match against the junk taxonomy in `references/search-terms.md`: jobs, hiring, salary, wage, apprentice, course, training, certification, licence exam, how to, DIY, wikihow, youtube, parts, supplies, wholesale, plus the other-trade and out-of-area lists. A clear hit here needs no SERP check and no cost threshold - it goes straight to step 3 at one click. This is where most of your negatives come from and it costs nothing.

**Gate 2 - the winner conditions (free, from the pull).** Did it convert at or under target? Is it misrouted per the three kinds in step 4? Those go to the harvest. A converting term never gets negated, whatever it looks like.

**Gate 3 - is it actually costing money?** Everything still unresolved gets ONE question: has it spent without converting? If it has spent less than about 1x target cost per lead with no conversions, it is noise - **leave it, no label, no search, no tokens**. This gate is what makes a lifetime pull affordable, and it is the one that kills the old "bucket everything" behaviour.

**Gate 4 - only now, the SERP check.** For the handful that survive - real spend, no conversions, not obviously junk - use WebSearch, read the top 10 results and count how many point at ONE intent:
- **7 or more out of 10 agree** → that is the intent. Act on it.
- **5 or 6 agree** → weak. It cannot carry a negative on its own; falls through to gate 5.
- **fewer than 5 agree** → genuinely ambiguous. Leave it and let spend decide.
- **Ads plus a map pack outrank organic count for buyer intent** - somebody paid to be there, which beats ten blue links. Two or more ads plus a map pack reads as a buyer even at a 5 or 6 score.
- Say the score in the batch line ("8/10 job boards"), never just "job seeker". A number I can disagree with beats a verdict I cannot check.

**Gate 5 - the cost math, for what is left.** Negate only past **3x target cost per lead with zero conversions** (equivalently, 3-over-the-conversion-rate clicks, using the campaign's trailing-90-day rate from the pull). A term with one conversion at or under 1.5x target is untouchable. Above 3x on two or more conversions is a bid or ad-group problem, not a negative.

**Say the funnel out loud at the end of the step**, so the cost of the run is visible: "3,827 unjudged · 61 caught by junk patterns · 4 winners · 3,740 left alone as noise · 22 googled · 9 negatives proposed." If the googled number is in the hundreds, gate 3 is set too loose and I will say so.

- **Check the Keyword column on every candidate.** If the same core keyword is spawning most of the junk, the keyword or its match type is the problem - say so and propose the keyword fix instead of forty negatives.
- **Guardrail:** if the proposed negatives exceed about 10% of a campaign's terms, stop and say the targeting is wrong.
- **Per-client calls, never by default:** cheap, affordable, near me, reviews, best, cost, license, emergency. Read `context/business.md` - a budget operator keeps "cheap", a premium one does not.

**Geography gets its own block, and it is a QUESTION, not a verdict** (per `references/search-terms.md`
→ "Geography in the query"). Group every term naming a place the account may not serve, with its spend and
its leads, and present the fork explicitly: **serve it → campaign candidate; don't → geo negative.**
Grade the block `Assumed` and print the assumption inline, because which towns are served is a fact only
the owner has. Never negate a converting town on your own - off-city terms that convert at or under target
are demand, and silently blocking them is the most expensive mistake in this command. Presence targeting
does not solve this: someone inside your area searching for a town you do not cover still gets through.

Judge on intent, not on conversions: a hire-intent term that has not converted yet is not proof it will not. And never negate something just because it is unfamiliar - unresolved is a valid, cheap outcome.

---

## ⛔ THE DELIVERABLE - two files, four sections, never an essay

**The output of this command is FILES, not a chat summary.** A run that ends in prose has failed, however
good the analysis was. Write both, every run, and link both:

- **`search-terms-report.html`** - the dashboard. Built from `references/search-terms-report-template.html`.
  Top 10 per list by cost, each with a **Show all N** toggle.
- **`search-terms-plan.md`** - the full worksheet, **never truncated**, worked item by item with the Google
  Ads UI open beside it.

Both are organised the same way: **one tab per campaign, and inside each tab five blocks in the order Jono
works them - keywords, niches, competitors, cities, general negatives.** That is the order the owner has to
click in, so it is the only order the file can be in.

### ⛔ BREVITY RULES - the report is skimmed once, by a stranger

Jono cut this report twice - 1 September 2026 and again 8 September 2026 when it was about to go to a
thousand members. His words: "the right information to the right person, simply. Not fluff, not extra
stuff, just the things they need." Every rule below came from a specific thing he deleted. Break one and
the run gets sent back.

- **The page is lists, not findings.** A member does not read a headline explaining a table that is
  directly underneath it. No "what am I paying for" paragraph above the negatives, no "what's working"
  paragraph above the keywords, no hidden-share essay, no brand-vs-non-brand section.
- **One home per list.** Every list for a campaign lives inside that campaign's tab, in the fixed block
  order. Nothing is listed a second time in another section. "Promote the 132 winners" is said once.
- **Never narrate the run.** No judging funnel, no gate counts, no "the check ran", no read-only banner,
  no "what this report could not see", no "nothing was staged" boilerplate. Deleted on sight.
- **No checklist of things Claude will do anyway.** The old 06 ranked every action from the run. Members
  do not tick off work that the next command does for them. The only list of actions on the page is
  section 04, and it holds ONLY decisions the owner has to make.
- **Trust is one line, in the header banner.** "Google hides 42.7% of clicks. Every number below is a
  floor." The why-it-is-hidden paragraph, the hidden-vs-visible CPC comparison and the recovery options
  are gone from the page; they stay in `references/search-terms.md` for anyone who asks.
- **Campaigns are TABS, not a vertical scroll.** Section 01 is the tab strip. Do not add a second
  per-campaign list anywhere.
- **Every list line is 4 facts max.** `check_readable.py` enforces it. Term · money · owner · verdict.

### ⛔ THINGS THAT ARE NOT THEIR OWN SECTION

- **Off-city / geography.** Never a standalone block. Each town belongs to exactly ONE campaign; it gets
  staged as a negative in every other campaign at the level step 3 chooses (campaign in Shape B, where
  a campaign is a city or a service; account list in Shape A), in the Cities block of that campaign's tab.
  Tag each one **drivable** (within ~150km of the city that owns it, so rerouting is real) or **not
  drivable** (a keep-or-drop call, not a routing one). Ferries count against drivable. The "do you serve
  these towns" question itself is a section 04 item.
- **"What recovers the hidden half."** Not on the page. It lives in `references/search-terms.md`.
- **Hidden share per campaign.** The per-campaign number already sits in each campaign's tab header.

### ⛔ RIVAL NAMES SHOW ONLY WHEN THEY COST MORE THAN AN AVERAGE CLICK

Competitor and performer names are never auto-negated - they convert at $7-22 elsewhere in this
account. And a name that has cost less than one average click is not worth the owner's time.
So the YOUR CALL list shows only names whose cost per click beats the account's average CPC,
sorted by cost, each row leading with its actual CPC. The cheap tail stays in the verdicts file,
not the report.

### ⛔ EVERY LIVE-CAMPAIGN TERM IS READ, NEVER PATTERN-SCANNED

Pattern matching missed entire categories - business names above all, because words like
"entertainment", "sound" and "company" are ordinary and nothing distinctive was left to trigger
a rule. `soundfonix`, `van dj co` and `oxygen entertainment` all walked through a regex pass.
Jono's instruction on 1 September 2026: ALL search terms are analyzed, not just scanned.

Run `python3 code/judge_terms.py`. It builds the queue from the pull - every distinct zero-lead
term in the enabled campaigns, brand terms set aside, anything already judged skipped - and writes
`code/cache/judge/todo.md`: a brief built from `context/business.md` (what they sell, what they
refuse, where they serve - nothing about the business lives in the script) followed by every term,
numbered, worst spend first. **Judge them yourself, in this session, against that brief.** One
verdict per term - BUY / SERVICE / NAME / PLACE / MARKET / TRADE / JOB / INFO / NICHE - written to
`code/cache/judge/verdicts.txt` as `<index>|<VERDICT>|<four words of reason>`, then
`python3 code/judge_terms.py --ingest` validates every line, merges it into
`code/cache/term-verdicts.json` and rewrites the todo with what is left. Work the file top to
bottom and ingest as you go; the cache resumes, so a re-run only lists what is still unjudged.
Nothing is skipped for being cheap - a $3 term that is wrong is still wrong, and it recurs. When
unsure the judge says BUY: never negate a buyer. Brand terms (`--brand`, else `BUSINESS_NAME` in
`.env`) are removed before judging - the model once graded a "<brand> reviews" search as a
marketplace and it reached the staged list. A brand term is never a negative.

**Past a few hundred terms, use the API instead:** add `ANTHROPIC_API_KEY` to `.env` and run
`python3 code/judge_terms.py --api` - the same brief, batches of 120, the same cache. Optional; a
member without a key loses nothing but time. `--limit N` judges only the N worst-spend terms this
run, `--all-campaigns` includes paused campaigns.

Then run `python3 code/build_search_terms_report.py` - step 3, the assembler. It turns the
verdicts into the staged batches inside `search-terms-report.html` - one tab per campaign, matched
to the pull's campaign names, with a tab added for any judged campaign the report is missing - and
enforces every safety rule in code: the brand filter, EXACT for names and marketplaces, the rival
CPC floor, niche flag-only, and the conflict check that drops any candidate phrase-blocking a live
keyword or a converting term. It pulls the account's existing negatives and enabled keywords itself
into `code/cache/negatives-existing.json` (`--refresh-negatives` to pull again) and writes the
live campaign-negative count into every tab's `toAction`. The hand-assembled version of 1 September
2026 skipped that check and staged "wedding" as a phrase negative in a city campaign - it would
have blocked terms carrying 154 leads. The held-back count is printed per campaign and shown in
the report. Never assemble the report by hand.

The verdicts file is the source of truth for what goes in the report.

### ⛔ A ONE-WORD PHRASE NEGATIVE IS THE MOST DANGEROUS THING THIS COMMAND CAN WRITE

`gigsalad` as a one-word PHRASE negative on the account list does not just block `gigsalad`.
It blocks `gigsalad dj`, `gigsalad deejay`, `gigsalad wedding dj` - every one of which is a person
who found the business through that directory and is now searching for it by name. Forever, in
every campaign. Jono caught this on 1 September 2026 and it is now a hard rule.

**Before writing any single-word negative, ask what it blocks when a word is added after it.**

- **A NAME - a brand, marketplace, directory, rival or performer - goes EXACT, never phrase.**
  gigsalad, cueup, thumbtack, bark, weddingwire, and every competitor name. Exact blocks the
  bare search and leaves `<name> dj` alive.
- **A service you do not sell stays PHRASE.** photobooth, saxophonist, officiant. Any search
  carrying the word is wrong however it is worded - but confirm from the business file that the
  service really is not sold. The first account this ran on had no business file and `photo booth`
  was proposed blind; the conflict check later found `wedding dj and photo booth` had converted.
- **A place stays PHRASE, but never as a fragment.** `deer` is not Red Deer, `grande` is not
  Grande Prairie, `falls` is not Niagara Falls. Write the whole town name.
- **Never negate a bare common word.** `city`, `app`, `back`, `buy`, `centre`. If a normal buyer
  could type it in a normal search, it is not a negative at any match type.
- **Every single-word candidate is quarantined for a manual look, never staged unseen.** The
  assembler puts them in their own "VERIFY BY HAND BEFORE ADDING" group per campaign. The
  conflict check only sees past queries; a one-word phrase negative blocks every FUTURE query
  carrying the word, so a human eyeballs each one first. (Jono, 1 Sep 2026)

Every single-word negative in the batch must state its match type and why that match type.

### ⛔ EXISTING NEGATIVES ARE SHOWN PER CAMPAIGN, ALWAYS

`toAction` on each campaign must carry the **real count of campaign negatives already live**, pulled from
`negatives-existing.json` → `campaign_negs`. Writing "no campaign negatives" when the campaign has 97 of
them is the single worst bug this command has shipped - it made Jono think the whole run had missed them.
Count them, name the number, then say what is newly proposed on top.

### The four sections, in this order

The renderer in the template builds everything from `negatives.campaigns[].adGroups[]`. It routes each ad
group by name: "niche" / "FLAG ONLY" to Niches, "rival" / "YOUR CALL" to Competitors, "towns" / "CITIES"
to Cities (any "a place you do not serve" row inside another group is pulled there too), everything else
to General negatives; keyword lists from every ad group go to Keywords. The assembler writes those groups.

**Header.** Business, window, totals, the target cost per lead the thresholds use (with the brand cost
per lead in brackets when the split is available), and ONE banner line: "Google hides N% of clicks.
Every number below is a floor." Nothing else above section 01.

**01. Keywords and negatives, by campaign.** One DO line for the harvest (where the keywords go), then
one tab per campaign. The tab header carries spend, leads, cost per lead, hidden share and `toAction`.
Inside every tab, five blocks, always this order, a block simply absent when it has nothing:

1. **Keywords** - every unbid winner under the ad group that already catches it (the harvest, step 4).
2. **Niches** - segment searches, flag only, nothing staged.
3. **Competitors** - rival and performer names above the average CPC, exact match, the owner's call.
4. **Cities** - towns outside the service area, phrase.

   Every negative row carries the level step 3 chose for it (the NARROWEST level that is still true - see
   the level rules below; ad group is the default, campaign only means something in Shape B, account list
   only for junk forever). The blocks group by KIND, never by level.
5. **General negatives** - the staged batch, the single-word VERIFY BY HAND group, then the per-ad-group
   batches with their leave-alone line.

**02. Unblock these.** The existing-negatives check (step 2b): one lede line, a delete card per
negative naming what it frees, and the winners it already blocked. Nothing is removed by this command.

**03. Where the traffic comes from.** The source view from `sources[]`: one lede, one DO line, keyword
chips with match type and cost per lead. Whenever one keyword or one match type is responsible for most
of the junk, the DO line names the keyword fix - forty negatives do not fix two broad keywords.

**04. Your calls.** Only the questions Claude cannot answer: the service-area question and the
rival-name question, each with the money behind it. The rival-name question shows BOTH sides, from
`rivalCall` in the data: the count and spend of rival names with no leads, and every rival name that
DID convert (name, leads, cost per lead) as green pills - a one-line summary is not enough for a
business decision (Jono, 8 Sep 2026). No other lists here - the lists are in the tabs. If an item
could be done without asking the owner, it is not a section 04 item.

### Findings and grades live in the plan file, not on the page

The HTML shows lists. `search-terms-plan.md` is the worksheet, and there every finding still carries
the four parts - **What** (neutral), **So what** (dollars or leads), **Now what** (action and level),
**How sure** (the grade below) - because that is the file worked item by item.

### ⛔ The certainty grade - on every finding in the plan file

| Grade | Means | Presentation rule |
|---|---|---|
| **Measured** | Counted from the pull. Re-running reproduces it | May be stated as fact |
| **Inferred** | The data supports it but one reasoning step is involved - a threshold, a SERP read, a comparison | **Name the step** - "8 of 10 results are training courses", not "job seeker" |
| **Assumed** | Depends on an input we do not have - target cost per lead, service area, what a job is worth | **The assumption appears inline, in words, every time the number does** |
| **Not measured** | Hidden terms, and anything the pull could not see | Say what would close it. **Never omitted** |

**A finding is only as strong as its weakest input.** An `Assumed` number may never appear in a headline
total without its assumption beside it. The hidden share is stated once, in the header banner, and every
total under it is read as a floor.

This is a different axis from the (a)/(b)/(c) evidence grades in `references/search-terms.md`. Those grade
where a **rule** came from. This grades how sure we are about **this account**. Both appear.

### ⛔ Never a count without the items

The rule that makes the file actionable instead of interesting. Every count expands to its rows:

| A line saying | Must also carry |
|---|---|
| "29 negatives staged" | all 29, with match type, level, cost and grade |
| "321 unbid winners" | all 321, grouped by the ad group they join |
| "$6,531 of off-city demand" | the towns, with spend and leads each |
| "two broad keywords caught 11,357 terms" | both keywords, with term count and zero-lead spend |
| "18,893 left alone as noise" | one line stating the threshold - this is the one case a list is wrong |

`search-terms-plan.md` carries the full list **always**. The HTML shows the top 10 with **Show all N**.
**A count with no list anywhere is a bug**, and item-by-item approval is impossible without the items.

### The shape - copy it exactly, and it has to pass the readability gate

**⛔ This file obeys `references/file-examples.md` like every other deliverable.** No tables. Never more
than four facts on a bullet. Plain labels, never `**Bold label:**` at the start of a bullet. A label with
several values puts them underneath as sub-bullets. Every number says what it is.

```
# Search terms plan

45,124 terms · $164,075 CAD spent · 3,826 leads · lifetime to 31 August 2026
Google will not name 4 of every 10 clicks, so every total below is a floor.
Next: approve the negatives, then the keywords.

---

# 01 · Keywords and negatives, by campaign

## Campaign: Weddings Toronto

- Spent: $44,120 CAD
- Leads: 812 at $54.33 each
- Hidden share: 31% of clicks unnamed
- To action: 12 negatives, 47 keywords

### Ad group: Regular

- Spent on named terms: $22,010 CAD
- Zero-lead spend: $412 CAD
- Caught by: wedding dj near me, broad match

**Add as negatives · 4 terms · $412 CAD**

- "dj lessons" · phrase · ad group · $212
  - Why: 9 of 10 results are training courses
  - How sure: Inferred
- "dj soda" · exact · ad group · $41
  - Why: 10 of 10 results are concert tickets for a touring artist
  - How sure: Inferred

**Add as keywords · 3 terms · 56 leads**

- [ottawa dj services] · exact · 25.9 leads · $33 a lead
  - Kind: unbid winner
  - How sure: Measured
- [dj ottawa wedding] · exact · 12.4 leads · $21 a lead
  - Pair: negate "dj ottawa wedding" in Corporate, Regular
  - How sure: Measured

Leave alone · 1,204 terms · $8,100 CAD · under target with no leads

---

# 02 · Unblock these
# 03 · Where the traffic comes from

(same shape: campaign, then ad group, then the items)

---

# 04 · Your calls · 2

## 1. Do you serve these 88 towns?

- Behind it: $2,250 of off-city demand converting at $34 a lead
- If yes: they become keywords in the campaign that owns them
- If no: they become campaign negatives, tagged drivable or not
- How sure: Assumed
```

**⛔ THE GATE, before you report the run done:**

```
python3 code/check_readable.py search-terms-plan.md
```

It exits 1 on any table and any bullet carrying more than four facts. **A FAIL means the file is not
finished.** The first version of this spec failed it on every negative line, because the term, its match
type, its level, its cost, its clicks and its reason were chained onto one bullet. The reason and the
grade moved to sub-bullets; that is the shape above.

**Rules for these files:**

- **Ad group spend is summed from named terms only.** The line is `- Spent on named terms: $22,010 CAD` -
  a plain label, never `**Bold label:**` at the start of a bullet, which `check_readable.py` fails. Never
  present it as the true total; the campaign block carries that from `campaigns[]`. A number quietly
  understating by 40% is worse than no number.
- **A campaign with nothing to action does NOT get an empty block** - `references/file-examples.md` rule 9
  bans sections that exist to say "nothing here". Instead, one closing line names them all together:
  `Nothing to action this run · Corporate Vancouver, DJ Apply Search, Squeeze`. Nothing is silently dropped
  and no empty furniture gets written.
- **Ad groups sort by zero-lead spend, campaigns by spend.** The owner works down until they run out of
  time, so the expensive end goes at the top.
- **Every term carries its money and its grade.** Cost, clicks, leads, and the SERP score or threshold.
- **Negatives name match type AND level.** A negative found here but belonging at account level still
  appears under the ad group it was found in, marked `· account list`.
- **A promotion and its paired negative sit on one line** - `pair: -"term" into Old Group`.
- **Long lists collapse the way `references/output-format.md` says** - the top entries per section, then
  `+ 23 more · $412 CAD` as a single line, with the remainder under `# The rest · N more` further down the
  file. The full list always lives in this file, never only in `code/cache/`.
- **No tables anywhere, no JSON, no record IDs.** Bullets with plain labels, per
  `references/file-examples.md` - and that file wins wherever it disagrees with `output-format.md`.


**2b. What is already blocked that shouldn't be? (section 02, Unblock these).** Every other check in this command
points forward at negatives you are about to add. This one points backward at the ones already there, and
nothing else in the repo asks it. A negative added in a hurry two years ago blocks silently and forever -
the keyword just shows Active with no impressions, and no report flags it.

Pull the account's existing negatives at all three levels: `python3 code/find_campaign_negatives.py` for
campaign-level candidates already staged, plus the shared account lists and the ad group criteria. Then run
the same negative-match semantics used in step 3, pointed the other way:

- **Against every enabled keyword** - a negative matching a keyword you bid on is the silent killer. Name
  the keyword, its ad group and its campaign.
- **Against terms that CONVERTED** in `already_handled_terms` where status is `EXCLUDED`. A negated term
  with recorded conversions is money you switched off on purpose or by accident, and only you know which.

**This step never removes a negative.** It reports and asks - removal is a separate decision, and an
over-eager cleanup here undoes deliberate sculpting. Each finding: the negative · its level and match type ·
what it blocks · what that blocked thing earned before it was blocked · `Measured`.

**If nothing is blocked, say so in those words** - "0 of 137 existing negatives block a keyword you bid on
or a term that converted". A clean result is a finding; silence reads as skipped.

**3. Stage the negatives.** Write `code/cache/negatives-approved.txt` in the format `add_campaign_negatives.py` reads (campaign ID, then the term: `"quoted"` = phrase, `[bracketed]` = exact, bare = broad), and show me the batch as a legible list, grouped:

**Push every negative to the NARROWEST level where it is still true.** The default landing spot is the AD GROUP, not the campaign. For a single-city local service business the account and the campaign are nearly the same blast radius, so a campaign negative is barely more precise than an account one - all the real precision lives at ad group level, and defaulting to campaign is how you over-block. Work down the list and stop at the first level that is honestly true:

**First, check the account's SHAPE - it changes what campaign level even means.** Per `references/campaigns.md` and `references/stag.md`: CAMPAIGN = the service (budget, bid strategy, geo, schedule), AD GROUP = one STAG (one intent). City is never an ad group, and a city only becomes a campaign once it clears ~30 conversions a month on its own.

- **Shape A - ONE campaign (the documented default for a new local account).** Here a campaign negative and an account negative have the SAME blast radius. There is no middle level. Treat any campaign-level negative as a red flag: it either belongs on the account list because it is junk forever, or it belongs at ad group level. Say which, and do not use campaign level as a lazy default.
- **Shape B - one campaign per service (after a service earns its own budget).** Only now does campaign level mean anything, because it separates drain cleaning from water heaters.

Then work down and stop at the first level that is honestly true:

- **Account list** (`push_negatives.py`), phrase match - ONLY if it is junk in every campaign you will ever run: jobs, salaries, DIY, courses, licensing. Keep this list to the universal 40-60 and no further.
- **Campaign** - junk for this entire service but legitimate in another. **In Shape A this level is meaningless** - skip it.
- **Ad group - the default for everything else.** Anything only wrong for THIS STAG: a water-heater term landing in the drain-cleaning group, a term that belongs in a different STAG, a research term leaking into the Core group. If you cannot say "this is junk for the whole service", it goes here.

**The guardrail:** ad group negatives are sculpting. A handful is right and expected. If one ad group needs a pile of them, the structure is wrong, not the negatives - say so and propose the STAG fix instead of stacking more.
**MATCH TYPE - phrase is the default, and negatives do NOT behave like keywords.**

This is the rule people get wrong most often, because negative match types are not the positive ones. A negative blocks only what it literally matches: **no synonyms, no plurals, no close variants.** Misspellings are the one exception Google now covers for you.

- **PHRASE** (`"plumber jobs"`) - **the default, and what almost every negative should be.** Blocks any query containing that exact word sequence in that order. `"plumber jobs"` blocks "plumber jobs toronto" and "emergency plumber jobs", but NOT "jobs plumber" and NOT "plumber job" singular.
- **EXACT** (`[plumber salary]`) - blocks that query and nothing else. Use it in three cases:
  1. **Head terms and single words that live inside your money keywords.** This is the big one. A phrase negative on a short head term has an enormous blast radius: `-"plumbing"` as a phrase kills every query containing the word, which is most of your account. If the junk term IS a head term (bare "plumbing", "plumber", "drain"), it must be EXACT - block that bare query and nothing else.
  2. **Spillover risk.** If the phrase version would match any keyword you bid on, or any obvious buyer query, drop to exact. The conflict check below catches this, but reach for exact before it has to.
  3. **A genuine one-off** - a weird query that spent money and will never recur as a pattern.

  **The test:** say the phrase version out loud and ask what else it would block. If you cannot list the collateral confidently, use exact.
- **BROAD** (bare `apprenticeship`) - blocks any query containing all those words in any order. This is the widest and most dangerous, so it is reserved for a single token that is never wanted anywhere in the account.

**The two rules that stop over-blocking:**
- **Never a bare broad negative for: free, cheap, near me, license, reviews, cost, emergency.** Every one of those appears in buyer queries. Use phrase pairs instead - `"free course"`, `"license exam"`, `"near me hiring"` - so you kill the junk without killing "free estimate plumber".
- **Match type and level multiply each other.** A broad negative on the account list is the widest possible blast radius and the single easiest way to wreck an account. The narrower the level, the safer a wider match type becomes. If a negative needs to be broad, that is a strong argument for pushing it down to the ad group.

**Also:**
- **Add the singular and plural pair** - negatives do not cover plurals, so `"plumber job"` and `"plumber jobs"` are two entries. Never generate misspellings; Google covers those.
- **Negate the pattern, not the query.** If one token appears across many junk searches, one phrase negative on the token replaces ten exact ones - and gives Claude one line to check instead of ten.

**Conflict check before showing the batch - across the WHOLE account, not just this campaign.**

**What it actually does, so nobody over-trusts it:** one GAQL query on `ad_group_criterion` pulls every **enabled positive keyword** in the account - its text, match type, ad group and campaign. It does NOT scan search terms, and it does not predict future queries. Then for each proposed negative it applies **negative match semantics** to each keyword's text: a phrase negative matches if its word sequence appears in order inside the keyword; an exact negative matches only an identical keyword; a broad negative matches if all its words appear anywhere in the keyword. Case and punctuation are normalised, and no plurals or synonyms are inferred, because negatives do not expand.

**What it therefore cannot catch:** a negative that blocks a profitable SEARCH TERM you are not bidding on as a keyword, or a keyword you have not built yet. It proves you are not shooting a keyword you already own - which is the common, expensive mistake - not that the negative is harmless in the abstract. Say that plainly rather than implying a clean bill of health.

Scope the test to where the negative will actually land:

- **Account-list negative** → tested against every enabled keyword in every campaign. It hits all of them, so a match anywhere blocks it.
- **Campaign negative** → tested against every enabled keyword in every ad group of that campaign.
- **Ad group negative** → tested against that ad group's keywords.

Any match blocks that line, and I name the keyword, its ad group AND its campaign - "blocks `emergency plumber` in Plumber Generic → Core", never just "conflicts". Then say the fix: tighten the match type (broad to phrase), or push the negative down a level so it only bites where you meant it to. Google's own conflict recommendation misses shared lists and does not reliably catch ad-group ones, so this check is never skipped and never delegated to it.

Then write the batch into `search-terms-plan.md` in the shape above - **grouped by campaign, then ad group, never one flat list ranked by spend**. A flat list makes the owner re-sort it into the tree themselves before they can click anything.

**The bullet is the term, its match type, its level and its cost - four facts, and no more.** The reason, the SERP score and the certainty grade go UNDERNEATH as sub-bullets. Chaining them onto one line fails `check_readable.py` and is the exact thing `references/file-examples.md` bans. Show the same tree in chat, collapsed to the top three ad groups by wasted spend, and link the file.

⛔ **APPROVAL GATE 1.** No negative is pushed until I say yes to this batch. Strike lines, change match types, keep going.

**4. Harvest the winners - the positive side, EVERY run.** This step is not optional and never gets skipped for time. Negatives save pennies; a converting keyword you were not bidding on makes dollars, and Google just handed you the exact wording that worked.

**There are three kinds of winner, and status NONE only finds the first.** Check all three every run:

**A. The unbid winner (status NONE).** It converted at or under target and is not a keyword anywhere. Promote it as exact into the ad group that caught it.

**B. The misrouted winner (status ADDED, wrong group).** The term IS already a keyword, but it is being caught by the wrong one, so it serves the wrong ad and the wrong page. Status NONE never surfaces these, which is why they rot for months. Compare the term's own cost per lead against the ad group's average: trailing by more than 10% means the keyword catching it is wrong. The documented case - "car hire" being matched by the "car rental" keyword - tripled cost per lead from $12.84 to $38.52. Fix it by adding the term as exact in the RIGHT ad group, then doing C.

**C. The term that deserves its own STAG.** The intent genuinely differs from the whole ad group, not just the keyword. Bolting it into a mismatched group gives it a landing page that answers a different question, so message match dies and the click is wasted anyway.

**This step creates NOTHING in the account.** No ad group, no campaign, no keyword, no structural change of any kind - `/search-terms` never restructures an account and never calls a build script. All it does is write the candidate down. Append it to `keyword-list.md` under a `## STAG candidates (from /search-terms)` section, one line each: the term · conversions and cost per lead · the ad group it is currently landing in · which service it belongs under · what page it would need. That file is already the single source of truth for account structure, so the note is sitting where `/keywords stag` will look next time you run it.

Then say it out loud in the report - "2 STAG candidates written to keyword-list.md, nothing built" - and move on. Building it is a separate decision on a separate day, made by `/keywords stag` with your yes, not a side effect of a search terms pass.

**⛔ EVERY promotion into a new ad group needs a matching negative in the OLD one.** This is not optional and it is the step everybody misses. If you add `[burst pipe plumber]` to the Emergency group because it was leaking out of Drain Cleaning, and you do not negate it in Drain Cleaning, the term stays eligible in both groups. They do not compete in the auction - only one keyword can fire - but you can no longer predict which ad and which landing page the searcher gets, and the term's data splits across both groups. The routing got worse, not better. So every case B and every case-A term that came from a different group produces a PAIR: the keyword in the new group, and the phrase negative in the old one, staged together and approved together. The pair stays visibly together: the keyword is the bullet, and the negative is its `Pair:` sub-bullet directly underneath, so neither can be approved without seeing the other. A promotion staged without its negative gets flagged and held back.

- **Skip** when the campaign's broad-match toggle is on and an identical keyword already exists - Google already prioritises it as if exact, so adding it buys nothing.
- **The volume floor is TIERED by what the action actually risks.** One threshold for all three was wrong: adding a keyword is not the same bet as rerouting spend you are already paying for.
  - **Case A - 2 or more conversions** at or under target. This one adds a NEW surface to bid on, so it spends money you are not spending today. One conversion over 90 days is not a signal - say "not enough data yet" and leave it in the queue for next run.
  - **Case B - 1 conversion** at or under target is enough. You are not adding spend here, you are redirecting spend that is already happening to the right ad and the right page. The term is already being bought and already converting; the only question is which ad group gets it. Waiting for a second conversion just buys more clicks at the worse cost per lead.
  - **Case C - 1 conversion** is enough, because the action is writing a line in `keyword-list.md` and nothing else. A candidate list costs nothing to be wrong about, and `/keywords stag` re-checks it before anything gets built.
  - **Never harvest anything above target cost per lead**, whatever the case and whatever the conversion count. Converting expensively is not winning.
- **Conflict check in reverse, and the script does it for you:** write the batch to `code/cache/keywords-approved.txt` (ad group ID first, then the term - `[bracketed]` = exact, `"quoted"` = phrase, bare = broad), then run `python3 code/add_keywords.py --file code/cache/keywords-approved.txt --dry-run`. It tests every proposed keyword against the ad group negatives, the campaign negatives AND every shared account list, and reports the exact negative that would kill each one. Those three levels are the complete set in this direction - a keyword lives in exactly one ad group, so nothing outside them can block it, which is why the reverse check does not sweep other campaigns the way the negatives check in step 3 must. Proposing a keyword you are already blocking is the most common way this step wastes a run.
- Write the dry-run result into `search-terms-plan.md` **under the ad group each keyword joins** - the same blocks step 3 already wrote, so a group's negatives and its new keywords sit together and get approved as one picture. Within a group, sort by conversions. **The bullet is the term, its match type, its conversions and its cost per lead.** Everything else is a sub-bullet: `Kind:` (unbid, misrouted, needs its own STAG), `Pair:` (the negative and the group it lands in), `Blocked by:` (the negative that would kill it), `How sure:`. A blocked keyword is a decision for me - remove the negative, or drop the keyword.
- **The paired negatives go into the step 3 batch**, at ad group level, and they still run the account-wide conflict check like every other negative. Never push a promotion pair without both halves landing.
- **If nothing qualifies, say so explicitly** - and say it per kind: "no harvest this run: 3 converted but all are correctly routed already, 0 misrouted, 0 STAG candidates". Silence reads as forgetting, and a bare "nothing found" hides whether you actually checked B and C.

⛔ **APPROVAL GATE 2.** Separate yes from the negatives batch. Approving negatives is not approving keywords.

On approval: `python3 code/add_keywords.py --file code/cache/keywords-approved.txt`. Every keyword lands **PAUSED** - the script has no enable flag on purpose, because the ad groups are already live and an enabled keyword would spend the moment it is written. Never use `build_campaigns.py` here; it builds whole trees from scratch and is the wrong tool once an account is running. Then add each keyword to `keyword-list.md` under its ad group in the account structure section, marked with the date and the term it came from, and feed the converting terms' exact language to `/write-ads` (RSA headlines) and `/landing-page` (H1s) as a note. Finish by telling me they are in and paused, and that I flip them on in the UI when I am ready.

**5. Push the negatives and log both.** Three scripts, one per level - every negative lands at the
narrowest true level, ad group by default:

- **Ad group** (the default): `python3 code/add_adgroup_negatives.py --file code/cache/adgroup-negatives-approved.txt` - staged as `<ad group id> <term>` per line. It re-checks every term against the group's own enabled keywords at push time and REFUSES anything that would block one, naming the keyword. Routing pairs land here: the promoted keyword's negative goes in the OLD ad group.
- **Campaign**: `python3 code/add_campaign_negatives.py --file code/cache/negatives-approved.txt` - for terms wrong everywhere in one campaign (a town another campaign owns, junk on this campaign's theme).
- **Account list**: `python3 code/push_negatives.py --name "<account list name>" --terms-file <file> --attach` - only for terms wrong for the business in every city forever.

All three skip duplicates. Then append to `negatives-log.md` - one block per run, per `references/output-format.md`: date · campaign · the term · match type · the reason, the SERP score and the threshold it hit. A future "did this hurt volume" review needs this. Log the harvest in the same block: date · term · ad group · conversions · cost per lead.

**N-grams (`/search-terms ngrams`, weekly or on a 30-day pass).** Aggregate 1- and 2-word grams across 90 days; a token with 3-over-conversion-rate clicks and zero conversions is a candidate at the token level. Three- and four-word grams surface keywords, not negatives - route those into step 4, not step 3.

**Finish:** run `python3 code/check_readable.py search-terms-plan.md` and fix any FAIL before you report anything. Then **clickable links to `search-terms-report.html` and `search-terms-plan.md`** first, then the wasted spend caught today, the count pushed by level, the hidden share, **what the harvest added** (never omit it, even when it is zero), and the one thing to watch - impression share after a batch. A drop with no cost-per-lead gain means roll it back. **Keep the chat summary under about fifteen lines - the file is the deliverable, chat is the pointer.** Then: "Same time tomorrow. Monday covers the weekend."

**Rules that never bend:** `check_readable.py` passes on `search-terms-plan.md` before the run is reported done · the run ends in `search-terms-report.html` + `search-terms-plan.md`, the four sections, campaign → ad group → term, never a chat essay · **the brevity rules above are not optional: lists not findings, one home per list, no run narration, campaigns as tabs with the five blocks in order, section 04 holds owner decisions only** · **every campaign states how many negatives it already has, never "no campaign negatives"** · **off-city towns are campaign negatives inside their tab, tagged drivable or not, never a standalone section** · **every finding in the plan file carries What / So what / Now what / How sure** · **every count expands to its items, and a count with no list anywhere is a bug** · an `Assumed` number never appears without its assumption inline · the hidden share is one banner line above every total · geography is asked, never assumed · existing negatives are checked but never removed · lifetime by default, never today · already-handled terms are never re-judged · this command never creates or restructures an ad group, it only writes candidates down · every negative lands at the narrowest true level, ad group by default · every conflict check runs account-wide, scoped to the level the negative lands at · one human yes per batch, and the two batches are separate · nothing removed, only negatives added and keywords proposed · every negative carries its SERP score or its threshold, never a bare verdict · the harvest runs every time, even on a five-minute pass · no negatives on an AI Max campaign in its first two weeks · never quote a "% of budget wasted" figure, only this account's own number.
