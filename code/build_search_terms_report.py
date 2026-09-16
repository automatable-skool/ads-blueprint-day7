#!/usr/bin/env python3
"""Assemble the search-terms report from the pull + the per-term verdicts.

Step 3 of the pipeline. Step 1 is search_terms_report.py (the pull), step 2 is
judge_terms.py (every zero-lead term read individually). This script turns the
verdicts into the staged batches inside search-terms-report.html - the job that
was done by hand on 1 September 2026, which skipped the conflict check and staged
"wedding" as a phrase negative in a city campaign. That would have blocked terms
carrying 154 leads. Every rule this script enforces exists because of that day:

  - brand terms are never negatives (tokens from --brand, else BUSINESS_NAME in .env)
  - a candidate that phrase-blocks ANY enabled keyword in the account is dropped
  - a candidate that phrase-blocks a term that CONVERTED in its campaign is dropped
  - NAME and MARKET verdicts go EXACT, never phrase - "thumbtack" phrase would
    block "thumbtack plumber", a buyer. Exact conflicts only on an exact match.
  - rival names show only when their CPC beats the account's average visible CPC
  - NICHE is flagged, never staged - segment size alone never cuts a segment
  - BUY is never touched

Nothing about the business lives in this file. Report tabs are matched to the
pull's campaign names (a tab may be the full name, or "Short · Full name"); a
judged campaign with no tab gets one, a tab matching no campaign is dropped with
a warning. The account's existing negatives and enabled keywords are pulled once
into code/cache/negatives-existing.json (--refresh-negatives to pull again).

Usage (from the repo root):
  python3 code/build_search_terms_report.py                    # all campaigns
  python3 code/build_search_terms_report.py --campaign "Plumber Dallas"
  python3 code/build_search_terms_report.py --min-cost 1       # skip the $0 tail
  python3 code/build_search_terms_report.py --brand "acme plumbing,acmeplumbing"
"""
import argparse
import collections
import json
import os
import re
import sys

from _business import brand_tokens, is_brand

PULL     = "code/cache/search-terms.json"
VERDICTS = "code/cache/term-verdicts.json"
NEGS     = "code/cache/negatives-existing.json"
QUEUE    = "code/cache/terms-to-judge.json"
REPORT   = "search-terms-report.html"
TEMPLATE = "references/search-terms-report-template.html"

LABEL = {"SERVICE": "a service you do not sell", "MARKET": "a lead marketplace",
         "PLACE": "a place you do not serve", "TRADE": "someone in your trade shopping for tools",
         "JOB": "job, course or DIY", "INFO": "informational, nobody is buying"}
EXACT_VERDICTS = {"NAME", "MARKET"}   # names and brands over-block at phrase


def phrase_blocks(neg, text):
    """Phrase-negative semantics: blocks any query containing the word sequence."""
    return re.search(r"\b" + re.escape(neg.lower()) + r"\b", text.lower()) is not None


def load_report(path):
    if not os.path.exists(path):
        sys.exit(f"no {path} yet. Copy {TEMPLATE} to {path} and fill the header from the pull "
                 f"(business, account, window, totals) - THE DELIVERABLE in the command - then run this again.")
    s = open(path, encoding="utf-8").read()
    m = re.search(r'(<script id="st-data" type="application/json">)(.*?)(</script>)', s, re.S)
    if not m:
        sys.exit(f"no st-data block in {path}")
    return s, m, json.loads(m.group(2))


def existing_negatives(pull, refresh):
    """The account's negatives at every level plus its enabled keywords, cached once."""
    if os.path.exists(NEGS) and not refresh:
        return json.load(open(NEGS, encoding="utf-8"))
    from _common import load_client, pull_existing_negatives
    client, env_cid = load_client()
    cid = str(pull.get("account") or env_cid or "").replace("-", "").strip()
    if not cid:
        sys.exit("no account id in the pull or in .env - cannot pull the existing negatives")
    print(f"pulling existing negatives + enabled keywords for account {cid} ...", file=sys.stderr)
    negs = pull_existing_negatives(client, cid)
    os.makedirs(os.path.dirname(NEGS), exist_ok=True)
    json.dump(negs, open(NEGS, "w", encoding="utf-8"), indent=1)
    print(f"  {len(negs['campaign_negs'])} campaign · {len(negs['adgroup_negs'])} ad group · "
          f"{len(negs['shared'])} shared-list negatives · {len(negs['keywords'])} enabled keywords → {NEGS}",
          file=sys.stderr)
    return negs


def find_tab_campaign(tab_name, campaigns):
    """Which pull campaign a report tab is. Exact on the full name or on either side of
    'Short · Full', then a unique substring either way. None when it is not clear."""
    parts = [p.strip().lower() for p in str(tab_name).split(" · ") if p.strip()]
    by_lower = {c.lower(): c for c in campaigns}
    for p in parts:
        if p in by_lower:
            return by_lower[p]
    hits = [c for c in campaigns if any(p in c.lower() or c.lower() in p for p in parts)]
    return hits[0] if len(hits) == 1 else None


def new_tab(camp, pull):
    """A tab for a judged campaign the report did not have. Header numbers from the pull."""
    h = next((c for c in pull.get("campaigns", []) if c.get("campaign") == camp), {})
    cost, conv = h.get("cost") or 0.0, h.get("conversions") or 0.0
    return {"name": camp, "spend": round(cost), "leads": round(conv, 1),
            "cpl": round(cost / conv, 2) if conv else 0, "hiddenShare": h.get("hidden_share", 0),
            "toAction": "", "adGroups": []}


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--campaign", action="append", help="campaign name or the tab's short name; repeatable; default all")
    ap.add_argument("--min-cost", type=float, default=0.0, help="only stage terms that have cost at least this much")
    ap.add_argument("--brand", help="comma-separated brand tokens; default derived from BUSINESS_NAME in .env")
    ap.add_argument("--refresh-negatives", action="store_true", help="re-pull the account's negatives and keywords")
    args = ap.parse_args()

    for p in (PULL, VERDICTS, QUEUE):
        if not os.path.exists(p):
            sys.exit(f"no {p} - run the pull (step 1) and the judge (step 2) first")
    pull     = json.load(open(PULL, encoding="utf-8"))
    verdicts = json.load(open(VERDICTS, encoding="utf-8"))
    terms    = json.load(open(QUEUE, encoding="utf-8"))
    negs     = existing_negatives(pull, args.refresh_negatives)
    enabled  = [k for k in negs["keywords"] if k.get("status", "ENABLED") == "ENABLED"]
    brand    = brand_tokens(args.brand)
    if not brand:
        print("⚠ no brand tokens (--brand or BUSINESS_NAME in .env) - a brand search could be staged", file=sys.stderr)

    # account average visible CPC, computed - never hardcoded
    rows_all = pull["unjudged_terms"] + pull["already_handled_terms"]
    clicks = sum(r["clicks"] for r in rows_all); cost = sum(r["cost"] for r in rows_all)
    avg_cpc = round(cost / clicks, 2) if clicks else 0
    print(f"account average visible CPC: ${avg_cpc}", file=sys.stderr)
    pull_campaigns = sorted({r["campaign"] for r in rows_all})

    # converting terms per campaign - a negative may never block one of these
    conv_by_camp = collections.defaultdict(list)
    for r in rows_all:
        if (r.get("conversions") or 0) > 0:
            conv_by_camp[r["campaign"]].append(r)

    # judged rows per campaign, per verdict. Brand is filtered again here on purpose.
    by = collections.defaultdict(lambda: collections.defaultdict(list))
    for t in terms:
        if is_brand(t["t"], brand):
            continue
        v = verdicts.get(t["t"])
        if not v or v["v"] == "BUY":
            continue
        if t["c"] < args.min_cost and v["v"] != "NAME":
            continue
        for camp in t["camp"]:
            by[camp][v["v"]].append({"t": t["t"], "c": t["c"], "k": t["k"], "why": v["why"]})

    s, m, D = load_report(REPORT)
    N = D.setdefault("negatives", {})
    resolved = []
    for c in N.get("campaigns", []):
        camp = find_tab_campaign(c.get("name", ""), pull_campaigns)
        if not camp:
            print(f'  ⚠ tab "{c.get("name")}" matches no campaign in the pull - dropped', file=sys.stderr)
            continue
        resolved.append((c, camp))
    have = {camp for _, camp in resolved}
    for camp in sorted(by):
        if camp not in have:
            resolved.append((new_tab(camp, pull), camp))
            print(f'  + tab added for "{camp}" (judged terms, no tab in the report)', file=sys.stderr)
    N["campaigns"] = [c for c, _ in resolved]
    live_negs = collections.Counter(n["campaign"] for n in negs.get("campaign_negs", []))

    grand = {"neg": 0, "names": 0, "niche": 0, "dropped": 0, "single": 0, "cost": 0.0}
    for c, camp in resolved:
        short = str(c["name"]).split(" · ")[0]
        if args.campaign and not any(a.lower() in (str(c["name"]) + " " + camp).lower() for a in args.campaign):
            continue
        B = by.get(camp, {})
        converting = conv_by_camp.get(camp, [])

        neg, names, niche, dropped, single, cities = [], [], [], [], [], []
        for verdict, items in B.items():
            for r in items:
                if verdict == "NICHE":
                    niche.append(r); continue
                exact = verdict in EXACT_VERDICTS
                if exact:
                    # exact negative blocks only the exact query
                    kw_hit = any(k["text"].lower() == r["t"].lower() for k in enabled)
                    cv_hit = any(cv["term"].lower() == r["t"].lower() for cv in converting)
                else:
                    kw_hit = any(phrase_blocks(r["t"], k["text"]) for k in enabled)
                    cv_hit = any(phrase_blocks(r["t"], cv["term"]) for cv in converting)
                if kw_hit or cv_hit:
                    dropped.append((r["t"], "keyword" if kw_hit else "converted")); continue
                if verdict == "NAME":
                    if r["k"] and r["c"] / r["k"] > avg_cpc:
                        names.append(r)
                    # cheap names stay in the verdicts file, not the report
                else:
                    r["why"] = f'{LABEL.get(verdict, verdict.lower())} · {r["why"]}'
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

        c["adGroups"] = [g for g in c.get("adGroups", []) if not (
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
            for r in names:
                r["why"] = f'${r["c"] / r["k"]:.2f} a click vs the ${avg_cpc} average · {r["why"]}'
            g.append(group(f"{len(names)} rival names costing more than an average click · YOUR CALL",
                names, "EXACT", 'names go EXACT so "<name> + your service" still reaches you · nothing staged'))
        if niche:
            g.append(group(f"{len(niche)} niche-segment searches · FLAG ONLY", niche, "no match type",
                "the 1% rule · a niche can beat the account average, so size alone never cuts it"))
        c["adGroups"] = g + c["adGroups"]

        cst = sum(r["c"] for r in neg + names + niche + single + cities)
        kw = re.search(r"(\d+ keywords)", c.get("toAction") or "")
        c["toAction"] = (f'{live_negs.get(camp, 0)} live · {len(neg)} to add · {len(cities)} towns · '
                         f'{len(single)} single-word to verify · {len(names)} names to decide · '
                         f'{len(niche)} flagged · ${cst:.0f} · {kw.group(1) if kw else ""}').rstrip(" ·")
        for k2, v2 in (("neg", len(neg)), ("names", len(names)), ("niche", len(niche)),
                       ("dropped", len(dropped)), ("single", len(single))):
            grand[k2] += v2
        grand["cost"] += cst
        print(f'  {short[:28]:28s} {len(neg):4d} staged · {len(single):3d} single-word to verify · '
              f'{len(names):3d} names · {len(niche):3d} flagged · {len(dropped):3d} HELD BACK',
              file=sys.stderr)

    if not args.campaign and isinstance(N.get("finding"), dict):
        F = N["finding"]
        F["what"] = (f'Every zero-lead search term in the enabled campaigns was read one by one. '
                     f'{grand["neg"]:,} negatives are staged, and {grand["dropped"]} candidates '
                     f'were held back because they would block a live keyword or a converting term.')
        F["nowWhat"] = (f'Add the {grand["neg"]:,} negatives. Then eyeball the '
                        f'{grand["single"]} single-word terms one by one - they are '
                        f'never staged unseen. Your two calls: the {grand["names"]} rival '
                        f'names, and which niche segments you serve.')

    blob = json.dumps(D, indent=2, ensure_ascii=False)
    with open(REPORT, "w", encoding="utf-8") as f:
        f.write(s[:m.start()] + m.group(1) + "\n" + blob + "\n" + m.group(3) + s[m.end():])
    print(f'wrote {REPORT} · {grand["neg"]:,} staged · {grand["dropped"]} held back', file=sys.stderr)


if __name__ == "__main__":
    main()
