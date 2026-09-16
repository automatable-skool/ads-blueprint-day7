#!/usr/bin/env python3
"""Step 2 of /search-terms: read EVERY zero-lead search term and give it one verdict.

No pattern scanning. Pattern matching kept missing whole categories - business
names most of all, because "entertainment", "sound" and "company" are ordinary
words and nothing distinctive was left to trigger a rule. So every distinct
zero-lead term is read, one by one, and judged against the business described in
context/business.md. Nothing is skipped for being cheap: a $3 term that is wrong
is wrong, and it recurs.

Nothing about the business lives in this file. What they sell, what they refuse
and where they serve come from context/business.md; the brand comes from --brand
or BUSINESS_NAME in .env. (First written 1 September 2026 with one business written
into it; rewritten 16 September 2026 so it reads the business from the file.)

Two ways to judge, same brief, same cache:

  python3 code/judge_terms.py
      Builds the queue from code/cache/search-terms.json (the pull): every distinct
      zero-lead term in the enabled campaigns, brand terms set aside, anything
      already judged skipped. Writes code/cache/judge/todo.md - the brief plus the
      terms, numbered, worst spend first. Claude Code judges them in the session
      and writes code/cache/judge/verdicts.txt as  <index>|<VERDICT>|<reason>.
      No API key needed.

  python3 code/judge_terms.py --ingest
      Reads verdicts.txt, validates every line, merges it into
      code/cache/term-verdicts.json, and rewrites todo.md with what is left.
      (Every run does this first, so nothing written is ever lost.)

  python3 code/judge_terms.py --api
      The same brief sent to the Claude API in batches of 120. Needs
      ANTHROPIC_API_KEY in .env. Worth it past a few hundred terms.

Other flags: --brand "name,variant" · --all-campaigns (paused ones too) ·
--limit N (only the N worst terms this run).

Step 3, build_search_terms_report.py, reads code/cache/term-verdicts.json and
enforces every safety rule before anything is staged.
"""
import argparse
import collections
import json
import os
import sys
import time
import urllib.error
import urllib.request

from _business import brand_tokens, is_brand, read as read_business

MODEL = "claude-sonnet-4-6"
BATCH = 120
MAX_BUSINESS_CHARS = 15000

PULL = "code/cache/search-terms.json"
QUEUE = "code/cache/terms-to-judge.json"        # every zero-lead term - the assembler reads this
CACHE = "code/cache/term-verdicts.json"         # term -> verdict, resumes across runs
TODO = "code/cache/judge/todo.md"               # the brief + the numbered terms still unjudged
ORDER = "code/cache/judge/queue.json"           # index -> term, for the todo file
VERDICT_FILE = "code/cache/judge/verdicts.txt"  # what Claude writes in the session

VERDICTS = ("BUY", "SERVICE", "NAME", "PLACE", "MARKET", "TRADE", "JOB", "INFO", "NICHE")

TAXONOMY = """For each term return exactly one verdict:

BUY      - somebody trying to hire or buy what this business sells. Price shopping
           ("how much does X cost"), "near me", city + service, "affordable X" and
           brand searches all count. When unsure between BUY and anything else,
           choose BUY. Never negate a buyer.
SERVICE  - wants a service this business does not sell: anything on its "don't do"
           list, or clearly outside what the file says it does.
NAME     - a named rival, a specific company or a specific person. A term is NAME
           when it reads like a business or a performer rather than a description
           of a service. This is the one pattern matching misses.
PLACE    - names a town or region outside the service area in the file.
MARKET   - a lead marketplace or directory that resells the enquiry: thumbtack,
           bark, angi, homestars, yelp, kijiji, craigslist, the knot, gigsalad.
TRADE    - someone in the same trade shopping for tools, software, gear, suppliers,
           templates or business advice - a practitioner, not a customer.
JOB      - looking for work, a course, a class, a licence, or how to get into the trade.
INFO     - informational only, no buying signal: how-to, what-is, ideas, checklists,
           reddit threads. Price questions are NOT info - they are BUY.
NICHE    - a real but small slice of the market (a language, culture, format or
           occasion). Flagged for the owner, never negated on size alone.

Reply with one line per term, in the same order, formatted exactly:
<index>|<VERDICT>|<four words of reason>
No preamble, no numbering beyond the index, no blank lines."""


def brief(business_md, brand):
    """The system prompt. The business file IS the brief - nothing else is assumed."""
    body = business_md.strip()
    if len(body) > MAX_BUSINESS_CHARS:
        body = body[:MAX_BUSINESS_CHARS] + "\n\n[business file truncated here - the rest is packages and plumbing, not services]"
    return (
        "You judge Google Ads search terms for ONE business. Everything you know about it is in "
        "the business file below: what it sells, what it refuses, where it serves, who it is for. "
        "A service the file does not list is a service it does not sell. A place outside the stated "
        "service area is not served - when the file gives a radius, use it, and ferries and borders "
        "count against reach. Do not assume anything the file does not say.\n\n"
        "===== context/business.md =====\n"
        f"{body}\n"
        "===== end of business file =====\n\n"
        f"Brand terms ({', '.join(brand)}) are never negatives and have already been removed from the list.\n\n"
        f"{TAXONOMY}"
    )


def load_json(path, default):
    if not os.path.exists(path):
        return default
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def save_json(path, data):
    os.makedirs(os.path.dirname(path) or ".", exist_ok=True)
    with open(path, "w", encoding="utf-8") as f:
        json.dump(data, f, indent=1, ensure_ascii=False)


def build_queue(pull, brand, all_campaigns):
    """Every distinct zero-lead term, cost and clicks summed across campaigns, brand set aside."""
    rows = pull.get("unjudged_terms") or []
    has_status = any("campaign_status" in r for r in rows)
    agg, skipped_brand, skipped_paused = {}, 0, 0
    for r in rows:
        if (r.get("conversions") or 0) > 0:
            continue
        if has_status and not all_campaigns and r.get("campaign_status") != "ENABLED":
            skipped_paused += 1
            continue
        if r.get("brand") is True or is_brand(r["term"], brand):
            skipped_brand += 1
            continue
        a = agg.setdefault(r["term"], {"t": r["term"], "c": 0.0, "k": 0, "camp": []})
        a["c"] = round(a["c"] + (r.get("cost") or 0), 2)
        a["k"] += r.get("clicks") or 0
        if r["campaign"] not in a["camp"]:
            a["camp"].append(r["campaign"])
    queue = sorted(agg.values(), key=lambda x: -x["c"])
    return queue, skipped_brand, skipped_paused, has_status


def parse_verdict_lines(lines, order, cache):
    """<index>|<VERDICT>|<reason> lines -> the cache. Returns (merged, problems)."""
    got, bad = 0, []
    for ln, line in enumerate(lines, 1):
        line = line.strip()
        if not line:
            continue
        parts = line.split("|")
        if len(parts) < 3:
            bad.append(f"line {ln}: needs index|VERDICT|reason, got {line[:60]!r}")
            continue
        try:
            idx = int(parts[0].strip().rstrip("."))
        except ValueError:
            bad.append(f"line {ln}: index {parts[0].strip()!r} is not a number")
            continue
        if idx < 0 or idx >= len(order):
            bad.append(f"line {ln}: index {idx} is not in the todo (0-{len(order) - 1})")
            continue
        v = parts[1].strip().upper()
        if v not in VERDICTS:
            bad.append(f"line {ln}: {parts[1].strip()!r} is not one of {', '.join(VERDICTS)}")
            continue
        cache[order[idx]] = {"v": v, "why": "|".join(parts[2:]).strip()[:80]}
        got += 1
    return got, bad


def ingest_session_file(order, cache):
    if not os.path.exists(VERDICT_FILE):
        return 0, []
    with open(VERDICT_FILE, encoding="utf-8") as f:
        return parse_verdict_lines(f.readlines(), order, cache)


def write_todo(todo, system):
    os.makedirs(os.path.dirname(TODO), exist_ok=True)
    save_json(ORDER, [t["t"] for t in todo])
    with open(TODO, "w", encoding="utf-8") as f:
        f.write("# Judge these search terms\n\n")
        f.write(system)
        f.write(f"\n\nWrite the verdicts to {VERDICT_FILE}, one line per term, then run "
                f"`python3 code/judge_terms.py --ingest`.\n\n")
        f.write(f"## Terms · {len(todo):,} · worst spend first\n\n")
        for i, t in enumerate(todo):
            f.write(f"{i}. {t['t']}\n")
    open(VERDICT_FILE, "w", encoding="utf-8").close()   # fresh file for this todo's indices


def api_key():
    key = os.environ.get("ANTHROPIC_API_KEY", "").strip()
    if key:
        return key
    if os.path.exists(".env"):
        for line in open(".env", encoding="utf-8"):
            if line.startswith("ANTHROPIC_API_KEY"):
                return line.split("=", 1)[1].split("#")[0].strip().strip('"').strip("'")
    return ""


def call_api(key, system, terms):
    body = json.dumps({
        "model": MODEL, "max_tokens": 8000, "system": system,
        "messages": [{"role": "user", "content": "\n".join(f"{i}. {t}" for i, t in enumerate(terms))}],
    }).encode()
    req = urllib.request.Request(
        "https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01", "content-type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)["content"][0]["text"]
        except urllib.error.HTTPError as e:
            detail = e.read().decode("utf-8", "replace")[:300]
            if e.code in (400, 401, 403):
                sys.exit(f"Claude API refused the request ({e.code}): {detail}")
            if attempt == 4:
                sys.exit(f"Claude API failed 5 times ({e.code}): {detail}")
        except Exception as e:  # network blips, timeouts
            if attempt == 4:
                sys.exit(f"Claude API unreachable after 5 tries: {e}")
        time.sleep(2 ** attempt)


def judge_via_api(todo, system, cache):
    key = api_key()
    if not key:
        sys.exit("--api needs ANTHROPIC_API_KEY in .env (console.anthropic.com > API keys). "
                 "Or drop --api and judge the todo file in this session.")
    for i in range(0, len(todo), BATCH):
        chunk = todo[i:i + BATCH]
        text = call_api(key, system, [c["t"] for c in chunk])
        got, bad = parse_verdict_lines(text.strip().split("\n"), [c["t"] for c in chunk], cache)
        save_json(CACHE, cache)
        print(f"  {i + len(chunk):>6,}/{len(todo):,}  (+{got}{', ' + str(len(bad)) + ' unreadable' if bad else ''})",
              file=sys.stderr)


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--ingest", action="store_true", help="merge code/cache/judge/verdicts.txt (every run does this first)")
    ap.add_argument("--api", action="store_true", help="judge via the Claude API - needs ANTHROPIC_API_KEY in .env")
    ap.add_argument("--brand", help="comma-separated brand tokens; default derived from BUSINESS_NAME in .env")
    ap.add_argument("--all-campaigns", action="store_true", help="include paused campaigns (default: enabled only)")
    ap.add_argument("--limit", type=int, help="only the N worst-spend terms this run")
    args = ap.parse_args()

    if not os.path.exists(PULL):
        sys.exit(f"no {PULL} - run step 1 first: python3 code/search_terms_report.py --out {PULL}")
    business_md = read_business()
    if not business_md.strip():
        sys.exit("context/business.md is empty or missing - the judge reads what you sell, refuse and "
                 "where you serve from it. Run /context-layer first.")
    brand = brand_tokens(args.brand)
    if not brand:
        sys.exit("no brand tokens: set BUSINESS_NAME in .env or pass --brand \"name,variant\". "
                 "A brand search once reached the staged negatives - the filter is not optional.")

    pull = load_json(PULL, {})
    cache = load_json(CACHE, {})
    order = load_json(ORDER, [])

    # 1. Merge anything already written in the session file, so a rebuilt todo never loses work.
    got, bad = ingest_session_file(order, cache)
    if got:
        save_json(CACHE, cache)
        print(f"merged {got} verdict(s) from {VERDICT_FILE}", file=sys.stderr)
    if bad:
        print(f"{len(bad)} line(s) in {VERDICT_FILE} could not be read - fix them and re-run:", file=sys.stderr)
        for b in bad[:20]:
            print("  " + b, file=sys.stderr)
        sys.exit(1)
    if args.ingest and not got:
        print(f"nothing new in {VERDICT_FILE}", file=sys.stderr)

    # 2. Rebuild the queue from the pull. The assembler reads the full list; the todo is what is left.
    queue, skipped_brand, skipped_paused, has_status = build_queue(pull, brand, args.all_campaigns)
    save_json(QUEUE, queue)
    todo = [t for t in queue if t["t"] not in cache]
    if args.limit:
        todo = todo[:args.limit]
    scope = "in enabled campaigns" if has_status and not args.all_campaigns else "in every campaign in the pull"
    print(f"brand tokens: {', '.join(brand)} · {skipped_brand} brand term(s) set aside", file=sys.stderr)
    if skipped_paused:
        print(f"{skipped_paused:,} term rows in paused campaigns skipped (--all-campaigns to include)", file=sys.stderr)
    print(f"{len(queue):,} zero-lead terms {scope} · {sum(1 for t in queue if t['t'] in cache):,} judged · "
          f"{len(todo):,} to go", file=sys.stderr)

    if not todo:
        for p in (TODO, ORDER, VERDICT_FILE):
            if os.path.exists(p):
                os.remove(p)
        print("everything judged · next: python3 code/build_search_terms_report.py", file=sys.stderr)
        return

    system = brief(business_md, brand)

    # 3a. The API path - same brief, batches of 120, cache saved after every batch.
    if args.api:
        judge_via_api(todo, system, cache)
        left = sum(1 for t in queue if t["t"] not in cache)
        print(f"done · {len(cache):,} judged · {left:,} still unjudged", file=sys.stderr)
        if not left:
            print("next: python3 code/build_search_terms_report.py", file=sys.stderr)
        return

    # 3b. The in-session path - write the todo, tell Claude what to do.
    write_todo(todo, system)
    print(f"wrote {TODO}", file=sys.stderr)
    print(f"Next: read {TODO}, judge every term against the brief in it, write one line per term to\n"
          f"      {VERDICT_FILE} as <index>|<VERDICT>|<four words of reason>,\n"
          f"      then run: python3 code/judge_terms.py --ingest", file=sys.stderr)
    if len(todo) > 500:
        print(f"      ({len(todo):,} terms is a lot for one session - add ANTHROPIC_API_KEY to .env and run "
              f"python3 code/judge_terms.py --api instead)", file=sys.stderr)


if __name__ == "__main__":
    main()
