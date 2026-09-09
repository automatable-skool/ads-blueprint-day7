#!/usr/bin/env python3
"""Read EVERY live-campaign search term and judge it. No pattern scanning.

Written 1 September 2026. Pattern matching kept missing whole categories - business
names most of all, because "entertainment", "sound" and "company" are ordinary words
and nothing distinctive was left to trigger a rule. `soundfonix`, `van dj co`,
`extreme entertainment` and `oxygen entertainment` all walked straight through.

So every distinct zero-lead term in a live campaign is read, in batches, and given
one verdict. Nothing is skipped for being cheap: a $3 term that is wrong is wrong.
"""
import json, os, sys, time, urllib.request, collections

MODEL = "claude-sonnet-4-6"
BATCH = 120
CACHE = "code/cache/term-verdicts.json"

SYSTEM = """You judge Google Ads search terms for a WEDDING DJ company in Canada.

They sell ONE thing: a DJ for a wedding or private event. Music, sound, lights.
They do NOT sell: MC/emcee as a standalone service, live musicians (violin, sax,
harp, piano, singers, bands), photo booths, dance floors, uplighting, decor,
flooring, draping, party/chair/table/tent rentals, catering, bartending, cake,
flowers, limos, officiants, photography, videography, planning or coordination,
venues, magicians, or cleaning.

They run 7 city campaigns: Calgary, Edmonton, Montreal, Toronto, Vancouver,
Winnipeg, Ottawa. They serve each city and roughly 150km around it by road.
No ferries. So Nanaimo and Victoria are NOT served from Vancouver; Kelowna and
Kamloops are NOT served; Abbotsford, Surrey and Chilliwack ARE.

For each term return exactly one verdict:

BUY        - somebody trying to hire a wedding or event DJ. Includes price
             shopping ("dj cost for wedding"), "near me", city+dj, "affordable
             dj", brand searches. When unsure between BUY and anything else,
             choose BUY. Never negate a buyer.
SERVICE    - wants a service listed above that they do not sell.
NAME       - a named rival, DJ, band or entertainment company. This is the one
             pattern matching misses. "soundfonix", "van dj co", "extreme
             entertainment", "oxygen entertainment", "dj kwake", "music by
             starlite" are all NAME. A term is NAME if it reads like a specific
             business or performer rather than a description of a service.
PLACE      - names a town or region outside the 150km road radius of all 7 cities.
MARKET     - a lead marketplace or directory: gigsalad, cueup, thumbtack, bark,
             weddingwire, kijiji, yelp, craigslist.
TRADE      - another DJ shopping for gear, software, apps, courses, templates or
             business advice. "wedding dj app", "serato", "dj controller".
JOB        - looking for work, a course, a class or how to become a DJ.
INFO       - informational only, no buying signal. "what to ask a dj",
             "first dance songs", playlists, reddit threads.
NICHE      - a cultural or format segment likely under ~1% of the population:
             persian, filipino, desi, greek, arabic, punjabi, caribbean, bar
             mitzvah, quinceanera, silent disco, karaoke.

Reply with one line per term, in the same order, formatted exactly:
<index>|<VERDICT>|<four words of reason>
No preamble, no numbering beyond the index, no blank lines."""

def call(key, terms):
    body = json.dumps({
        "model": MODEL, "max_tokens": 8000, "system": SYSTEM,
        "messages": [{"role": "user", "content": "\n".join(
            f"{i}. {t}" for i, t in enumerate(terms))}],
    }).encode()
    req = urllib.request.Request("https://api.anthropic.com/v1/messages", data=body,
        headers={"x-api-key": key, "anthropic-version": "2023-06-01",
                 "content-type": "application/json"})
    for attempt in range(5):
        try:
            with urllib.request.urlopen(req, timeout=180) as r:
                return json.load(r)["content"][0]["text"]
        except Exception as e:
            if attempt == 4: raise
            time.sleep(2 ** attempt)

def main():
    key = None
    for envfile in (".env", os.path.expanduser("~/Documents/Jono Catliff Business/.env")):
        if not os.path.exists(envfile): continue
        for line in open(envfile):
            if line.startswith("ANTHROPIC_API_KEY"):
                key = line.split("=", 1)[1].strip().strip('"').strip("'")
    if not key: sys.exit("no ANTHROPIC_API_KEY found")

    terms = json.load(open("code/cache/terms-to-judge.json"))
    # Brand searches are never candidates - "djing" is the business's own name
    # (djing.ca), and on 1 Sep 2026 "djing ca reviews" reached the staged list.
    terms = [t for t in terms if "djing" not in t["t"].lower()
             and "dj ing" not in t["t"].lower()]
    done = json.load(open(CACHE)) if os.path.exists(CACHE) else {}
    todo = [t for t in terms if t["t"] not in done]
    print(f"{len(terms):,} terms · {len(done):,} already judged · {len(todo):,} to go",
          file=sys.stderr)

    for i in range(0, len(todo), BATCH):
        chunk = todo[i:i + BATCH]
        txt = call(key, [c["t"] for c in chunk])
        got = 0
        for line in txt.strip().split("\n"):
            parts = line.split("|")
            if len(parts) < 3: continue
            try: idx = int(parts[0].strip().rstrip("."))
            except ValueError: continue
            if idx >= len(chunk): continue
            done[chunk[idx]["t"]] = {"v": parts[1].strip().upper(),
                                     "why": parts[2].strip()}
            got += 1
        json.dump(done, open(CACHE, "w"))
        print(f"  {i + len(chunk):>6,}/{len(todo):,}  (+{got})", file=sys.stderr)
    print(f"done · {len(done):,} judged", file=sys.stderr)

if __name__ == "__main__":
    main()
