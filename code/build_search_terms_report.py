#!/usr/bin/env python3
"""Assemble the search-terms report from the pull + the per-term verdicts.

Step 3 of the pipeline. Step 1 is search_terms_report.py (the pull), step 2 is
judge_terms.py (every zero-lead live term read individually). This script turns
the verdicts into the staged batches inside search-terms-report.html - the job
that was done by hand on 1 September 2026, which skipped the conflict check and
staged "wedding" as a phrase negative in Ottawa. That would have blocked terms
carrying 154 leads. Every rule this script enforces exists because of that day:

  - brand terms ("djing") are never negatives
  - a candidate that phrase-blocks ANY enabled keyword in the account is dropped
  - a candidate that phrase-blocks a term that CONVERTED in its campaign is dropped
  - NAME and MARKET verdicts go EXACT, never phrase - "gigsalad" phrase would
    block "gigsalad dj", a buyer. Exact conflicts only on an exact match.
  - rival names show only when their CPC beats the account's average visible CPC
  - NICHE is flagged, never staged - segment size alone never cuts a segment
  - BUY is never touched

Usage (from the repo root):
  python3 code/build_search_terms_report.py                # all campaigns
  python3 code/build_search_terms_report.py --campaign Winnipeg --campaign Ottawa
  python3 code/build_search_terms_report.py --min-cost 1   # skip the $0 tail
"""
import argparse, json, re, sys, collections

PULL     = "code/cache/search-terms.json"
VERDICTS = "code/cache/term-verdicts.json"
NEGS     = "code/cache/negatives-existing.json"
REPORT   = "search-terms-report.html"

LABEL = {"SERVICE": "a service you do not sell", "MARKET": "a lead marketplace",
         "PLACE": "a place you do not serve", "TRADE": "another DJ shopping for tools",
         "JOB": "job, course or DIY", "INFO": "informational, nobody is booking"}
EXACT_VERDICTS = {"NAME", "MARKET"}   # names and brands over-block at phrase

def phrase_blocks(neg, text):
    """Phrase-negative semantics: blocks any query containing the word sequence."""
    return re.search(r"\b" + re.escape(neg.lower()) + r"\b", text.lower()) is not None

def load_report(path):
    s = open(path).read()
    m = re.search(r'(<script id="st-data" type="application/json">)(.*?)(</script>)', s, re.S)
    if not m: sys.exit(f"no st-data block in {path}")
    return s, m, json.loads(m.group(2))

def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--campaign", action="append", help="city name; repeatable; default all")
    ap.add_argument("--min-cost", type=float, default=0.0,
                    help="only stage terms that have cost at least this much")
    args = ap.parse_args()

    pull     = json.load(open(PULL))
    verdicts = json.load(open(VERDICTS))
    negs     = json.load(open(NEGS))
    terms    = json.load(open("code/cache/terms-to-judge.json"))
    enabled  = [k for k in negs["keywords"] if k.get("status", "ENABLED") == "ENABLED"]

    # account average visible CPC, computed - never hardcoded
    rows_all = pull["unjudged_terms"] + pull["already_handled_terms"]
    clicks = sum(r["clicks"] for r in rows_all); cost = sum(r["cost"] for r in rows_all)
    avg_cpc = round(cost / clicks, 2) if clicks else 0
    print(f"account average visible CPC: ${avg_cpc}", file=sys.stderr)

    # converting terms per campaign - a negative may never block one of these
    conv_by_camp = collections.defaultdict(list)
    for r in rows_all:
        if (r.get("conversions") or 0) > 0:
            conv_by_camp[r["campaign"]].append(r)

    s, m, D = load_report(REPORT)
    camp_full = {c["name"].split(" · ")[0]: c["name"].split(" · ")[1]
                 for c in D["negatives"]["campaigns"]}

    by = collections.defaultdict(lambda: collections.defaultdict(list))
    for t in terms:
        if "djing" in t["t"].lower(): continue                      # brand, always
        v = verdicts.get(t["t"])
        if not v or v["v"] == "BUY": continue
        if t["c"] < args.min_cost and v["v"] != "NAME": continue
        for camp in t["camp"]:
            by[camp][v["v"]].append({"t": t["t"], "c": t["c"], "k": t["k"], "why": v["why"]})

    grand = {"neg": 0, "names": 0, "niche": 0, "dropped": 0, "cost": 0.0}
    for c in D["negatives"]["campaigns"]:
        city = c["name"].split(" · ")[0]
        if args.campaign and city not in args.campaign: continue
        camp_key = next((k for k in by if city.lower() in k.lower()), None)
        B = by.get(camp_key, {})
        full = camp_full[city]
        converting = conv_by_camp.get(full, [])

        neg, names, niche, dropped, single, cities = [], [], [], [], [], []
        for verdict, items in B.items():
            for r in items:
                if verdict == "NICHE":
                    niche.append(r); continue
                exact = verdict in EXACT_VERDICTS
                if exact:
                    # exact negative blocks only the exact query
                    kw_hit  = any(k["text"].lower() == r["t"].lower() for k in enabled)
                    cv_hit  = any(cv["term"].lower() == r["t"].lower() for cv in converting)
                else:
                    kw_hit  = any(phrase_blocks(r["t"], k["text"]) for k in enabled)
                    cv_hit  = any(phrase_blocks(r["t"], cv["term"]) for cv in converting)
                if kw_hit or cv_hit:
                    dropped.append((r["t"], "keyword" if kw_hit else "converted")); continue
                if verdict == "NAME":
                    if r["k"] and r["c"] / r["k"] > avg_cpc: names.append(r)
                    # cheap names stay in the verdicts file, not the report
                else:
                    r["why"] = f'{LABEL[verdict]} · {r["why"]}'
                    # A single-word phrase negative has the widest blast radius there
                    # is: it blocks every future query carrying the word, and the
                    # conflict check only sees the past. Jono's rule, 1 Sep 2026:
                    # one-word terms are quarantined for a manual look, never staged.
                    if " " not in r["t"].strip():
                        single.append(r)
                    elif verdict == "PLACE":
                        cities.append(r)      # its own block on the page: Cities
                    else:
                        neg.append(r)

        def rows(items, match):
            items.sort(key=lambda x: -x["c"])
            return [{"name": f'"{r["t"]}" · {match} · CAMPAIGN', "spend": round(r["c"], 2),
                     "clicks": r["k"], "note": r["why"]} for r in items]
        def group(name, items, match, caught):
            tot = round(sum(r["c"] for r in items), 2)
            return {"name": name, "visibleSpend": tot, "zeroLeadSpend": tot, "cpl": None,
                    "caughtBy": caught, "negatives": rows(items, match),
                    "keywords": None, "leaveAlone": None}

        c["adGroups"] = [g for g in c["adGroups"] if not (
            g["name"].startswith("Add these") or "rival" in g["name"]
            or "niche" in g["name"] or "single-word" in g["name"] or "towns" in g["name"])]
        g = []
        if neg:
            g.append(group(f"Add these {len(neg)} negatives", neg, "phrase",
                f"every zero-lead term read and judged individually · {len(dropped)} candidates "
                f"held back because they would block a live keyword or a term that converted"))
        if cities:
            g.append(group(f"{len(cities)} towns you do not serve · CITIES", cities, "phrase",
                "each one a campaign negative here · confirm the service area in section 04 first"))
        if single:
            g.append(group(f"{len(single)} single-word terms · VERIFY BY HAND BEFORE ADDING",
                single, "phrase", "a one-word phrase negative blocks every future query "
                "carrying the word - the conflict check only sees the past, so each of "
                "these needs a human eye first"))
        if names:
            for r in names: r["why"] = f'${r["c"]/r["k"]:.2f} a click vs the ${avg_cpc} average · {r["why"]}'
            g.append(group(f"{len(names)} rival names costing more than an average click · YOUR CALL",
                names, "EXACT", 'names go EXACT so "<name> dj" still reaches you · nothing staged'))
        if niche:
            g.append(group(f"{len(niche)} niche-segment searches · FLAG ONLY", niche, "no match type",
                "the 1% rule · several niches beat the account average, so size alone never cuts them"))
        c["adGroups"] = g + c["adGroups"]

        cst = sum(r["c"] for r in neg + names + niche + single + cities)
        live = re.search(r"(\d+) live", c["toAction"])
        kw = re.search(r"(\d+ keywords)", c["toAction"])
        c["toAction"] = (f'{live.group(1) if live else "?"} live · {len(neg)} to add · {len(cities)} towns · '
                         f'{len(single)} single-word to verify · {len(names)} names to decide · '
                         f'{len(niche)} flagged · ${cst:.0f} · {kw.group(1) if kw else ""}')
        grand.setdefault("single", 0); grand["single"] += len(single)
        for k2, v2 in (("neg", len(neg)), ("names", len(names)),
                       ("niche", len(niche)), ("dropped", len(dropped))):
            grand[k2] += v2
        grand["cost"] += cst
        print(f'  {city:10s} {len(neg):4d} staged · {len(single):3d} single-word to verify · '
              f'{len(names):3d} names · {len(niche):3d} flagged · {len(dropped):3d} HELD BACK',
              file=sys.stderr)

    if not args.campaign:
        F = D["negatives"]["finding"]
        F["what"] = (f'Every zero-lead search term in the live campaigns was read one by one. '
                     f'{grand["neg"]:,} negatives are staged, and {grand["dropped"]} candidates '
                     f'were held back because they would block a live keyword or a converting term.')
        F["nowWhat"] = (f'Add the {grand["neg"]:,} negatives. Then eyeball the '
                        f'{grand.get("single", 0)} single-word terms one by one - they are '
                        f'never staged unseen. Your two calls: the {grand["names"]} rival '
                        f'names, and which niche segments you serve.')

    blob = json.dumps(D, indent=2, ensure_ascii=False)
    open(REPORT, "w").write(s[:m.start()] + m.group(1) + "\n" + blob + "\n" + m.group(3) + s[m.end():])
    print(f'wrote {REPORT} · {grand["neg"]:,} staged · {grand["dropped"]} held back', file=sys.stderr)

if __name__ == "__main__":
    main()
