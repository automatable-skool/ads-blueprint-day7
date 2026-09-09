#!/usr/bin/env python3
"""Mine campaign-level negatives from a search terms pull.

Judges on INTENT, never on cost - a $3 term that is wrong is still wrong, and one
phrase negative on a token kills every term that carries it. Written 1 September 2026
after a run dismissed $30,884 as "noise" because each row was under one target CPL.

Seven buckets, in the order Jono named them:
  1 service      - something DJing.ca does not sell (emcee, violin, party rentals, coordinator)
  2 marketplace  - lead directories reselling 50 services (gigsalad, cueup, thumbtack)
  3 out of area  - a place outside the campaign's drivable service list (nanaimo, kelowna)
  4 trade        - another DJ shopping for tools, gear or research (apps, controllers, software)
  5 informational- nobody is booking (what to ask, playlists, reddit)
  6 competitor   - a named rival or performer (music by starlite, dj kwake, van dj co)
  7 niche        - FLAG only, never auto-negated: segments under ~1% of the population

Every candidate is then conflict-checked:
  - against every ENABLED keyword in the whole account (account-wide, always)
  - against every term that CONVERTED in that same campaign (campaign-scoped, because
    a campaign negative only bites inside its campaign)
A token that converts in a DIFFERENT campaign is kept but carries a warning.
"""
import json, re, sys, collections

TARGET = "code/cache/search-terms.json"
NEGS   = "code/cache/negatives-existing.json"

# Campaign -> (city, drivable service list). No ferries, roughly 150km.
CAMPAIGNS = {
 "Weddings - Calgary - Ads 6 - search only": ("Calgary",
   ["calgary","airdrie","okotoks","cochrane","chestermere","canmore","banff","strathmore","high river","kananaskis"]),
 "Weddings - Edmonton - Ads 6 - search only #2": ("Edmonton",
   ["edmonton","st albert","sherwood park","leduc","spruce grove","fort saskatchewan","beaumont","stony plain","devon"]),
 "Weddings - Montreal - Ads 6 - search only": ("Montreal",
   ["montreal","laval","longueuil","brossard","rive sud","rive nord","west island","terrebonne","repentigny",
    "saint jerome","st jerome","vaudreuil","mont tremblant","tremblant","montreal-est","montérégie","monteregie"]),
 "Weddings - Toronto - Ads 7 - search only #3": ("Toronto",
   ["toronto","mississauga","brampton","scarborough","markham","vaughan","etobicoke","north york","oakville",
    "burlington","milton","hamilton","guelph","kitchener","waterloo","cambridge","barrie","oshawa","whitby",
    "ajax","pickering","richmond hill","newmarket","aurora","gta","niagara","st catharines","caledon","bolton"]),
 "Weddings - Vancouver - Ads 6 - search only #2": ("Vancouver",
   ["vancouver","surrey","burnaby","richmond","abbotsford","langley","coquitlam","delta","maple ridge",
    "new westminster","north vancouver","west vancouver","port moody","white rock","chilliwack","mission",
    "squamish","whistler","fraser valley","lower mainland","pitt meadows","tsawwassen"]),
 "Weddings - Winnipeg - Ads 6 - search only": ("Winnipeg",
   ["winnipeg","steinbach","selkirk","stonewall","niverville","oakbank","headingley","manitoba"]),
 "Weddings - ottawa - Ads 6 - search only": ("Ottawa",
   ["ottawa","gatineau","kanata","orleans","nepean","barrhaven","stittsville","outaouais","aylmer","hull",
    "carleton place","almonte","rockland","embrun","perth","smiths falls","kemptville","arnprior"]),
}

SERVICE = ["emcee","mc for","wedding mc","mc services","mc and","master of ceremonies","host for wedding",
 "violin","violinist","saxophon","sax player","harpist","pianist","cellist","string trio","string quartet",
 "mariachi","bagpipe","drummer","guitarist","singer","live band","cover band","choir",
 "photo booth","photobooth","photo-booth","360 booth","dance floor","uplighting","up lighting","led wall",
 "cold spark","dry ice","confetti","photo bus","decor","decorator","flooring","draping","backdrop",
 "centrepiece","centerpiece","balloon","party rental","event rental","chair rental","table rental",
 "tent rental","linen","cutlery","glassware","wedding planner","wedding coordinator","event coordinator",
 "day of coordinator","day-of coordinator","caterer","catering","bartend","food truck","cake","florist",
 "flowers","limo","shuttle","officiant","celebrant","videograph","photograph","invitation","stationery",
 "makeup","hair stylist","cleaning","security guard","bouncy","magician","comedian","dancer","fireworks",
 "venue","banquet hall","wedding dress","tuxedo","suit rental","ring","honeymoon"]

MARKET = ["gigsalad","gig salad","cueup","cue up","thumbtack","bark.com","bark ","the bash","bash.com","poptop",
 "weddingwire","wedding wire","eventective","wedding.com","yelp","kijiji","craigslist","fiverr","upwork",
 "airtasker","jiji","yellow pages","yellowpages","angi","homestars"]

TRADE = ["app","software","serato","rekordbox","virtual dj","djay","traktor","mixxx","controller","cdj","ddj",
 "xdj","mixer","turntable","headphone","cartridge","crate","stem separation","sound system","pa system",
 "subwoofer","amplifier","lighting rig","moving head","gear","equipment","for sale","second hand","used ",
 "buy ","contract template","invoice template","price list template","business plan","how to start",
 "start a dj","marketing for dj","get more gigs","dj insurance","dj website","booking software","crm for"]

JOB = ["job","hiring","vacancy","salary","wage","apprentice","course","training","certificat","lesson",
 "class","academy","school","learn","tutorial","wikihow","become a dj","career","internship","volunteer"]

INFO = ["what to ask","questions to ask","what does a dj","what is a","how do i","how does","how to choose",
 "why do","tips for","checklist","guide to","ideas for","playlist","song list","songs for","top 100",
 "best songs","first dance songs","meaning of","reddit","forum","wikipedia","difference between","etiquette",
 "timeline template","seating chart"]

NICHE = ["persian","greek","desi","punjabi","tamil","gujarati","arabic","lebanese","filipino","portuguese",
 "jewish","hebrew","korean","vietnamese","chinese","japanese","polish","ukrainian","russian","somali",
 "ethiopian","nigerian","ghanaian","african","caribbean","jamaican","latin","salsa","bollywood","bhangra",
 "hindu","sikh","muslim","nikkah","mehndi","sangeet","quinceanera","bar mitzvah","karaoke","silent disco",
 "country music","edm","techno","house music","emo","goth","anime","k-pop","kpop",
 "arab","afro","afrobeats","reggae","soca","dancehall","south asian","middle eastern","siavash"]

# Words that can appear in a normal buyer search. Anything left over in a 2+ word
# term that also names a DJ business is very likely a competitor's name.
GENERIC = set("""dj djs dj's djing deejay disc jockey wedding weddings marriage bride groom brides grooms
 party parties event events corporate reception ceremony birthday anniversary prom gala christmas holiday
 near me my local best top good cheap affordable budget cost price prices pricing rate rates quote quotes
 hire hiring rent rental rentals rents book booking booked find finding get a an the for of in on with and
 to from at is are how much what where when who service services company companies business pro professional
 experienced reviews review rated rating list lists number phone contact website site online today tonight
 weekend saturday friday sunday day night evening hour hours package packages deal deals special
 music sound audio lights lighting speaker speakers mic microphone setup set up small large big
 indoor outdoor beach garden backyard barn rustic modern classic mobile
 private first dance under over per hour hourly half full inexpensive low lowest high highest
 female male student highschool university college school kid kids teen adult senior
 micro mini large space venue area around all after before during know need want looking
 entertainment entertainer entertainers entertaining musician musicians performer performers
 directory listing maximum minimum cheapest nearby city town neighbourhood neighborhood
 bc ab sk mb qc ns nb pei nl yyc yeg yvr yow ywg yul yyz canada canadian
 reviews rated rating star stars recommended recommend recommendation
 wedding's weddings' dj-ing djing available availability free trial demo sample
 same last minute emergency urgent asap quick fast
 place places spot spots venue venues location locations idea ideas theme themes
 birthday bday graduation retirement engagement stag stagette bachelor bachelorette
 anniversary shower reunion fundraiser charity office staff holiday xmas newyear
 mike mic dance floor music entertainment do to go get have make take put""".split())

def load(path):
    with open(path) as f: return json.load(f)

def word_hit(tok, text):
    return re.search(r"\b" + re.escape(tok), text.lower()) is not None

PLACES_SORTED = []

def classify(term, served, city, place_words):
    t = term.lower()
    for p in MARKET:
        if word_hit(p, t): return ("lead marketplace, they resell 50 services", "negate", p)
    for p in JOB:
        if word_hit(p, t): return ("job, course or DIY", "negate", p)
    for p in TRADE:
        if word_hit(p, t): return ("another DJ shopping for tools or gear", "negate", p)
    for p in INFO:
        if p in t: return ("informational, nobody is booking", "negate", p)
    for p in SERVICE:
        if word_hit(p, t): return ("a service you do not offer", "negate", p)
    for p in NICHE:
        if word_hit(p, t): return ("niche segment, likely under 1% of the population", "FLAG", p)
    # Places match as WHOLE names, longest first. A fragment is never a place:
    # "deer" is not Red Deer, "place" is not Carleton Place, "valley" is not Bow Valley.
    for pl in PLACES_SORTED:
        if pl in served: continue
        if re.search(r"\b" + re.escape(pl) + r"\b", t):
            return (f"a place you do not serve from {city}", "negate", pl)
    # competitor / performer name: a leftover proper-noun token beside DJ words
    leftovers = [w for w in re.findall(r"[a-z][a-z'&-]{2,}", t)
                 if w not in GENERIC and w not in place_words]
    if leftovers and len(t.split()) >= 2:
        return ("a rival's or performer's name", "ASK", leftovers[0])
    return (None, None, None)

def main():
    d = load(TARGET); negs = load(NEGS)
    unjudged, handled = d["unjudged_terms"], d["already_handled_terms"]
    enabled = [k for k in negs["keywords"] if k.get("status", "ENABLED") == "ENABLED"]
    place_words = set()
    for _, served in CAMPAIGNS.values():
        place_words.update(served)
    place_words.update("""nanaimo victoria kelowna kamloops penticton vernon courtenay duncan sidney
      lethbridge medicine hat red deer grande prairie fort mcmurray jasper regina saskatoon moose jaw
      brandon thunder bay sudbury north bay windsor london sarnia peterborough kingston belleville
      cornwall brockville owen sound collingwood muskoka quebec city trois rivieres sherbrooke saguenay
      halifax moncton fredericton saint john charlottetown st johns yellowknife whitehorse
      seattle bellingham buffalo detroit""".split())
    place_words.update(["red deer", "grande prairie", "medicine hat", "moose jaw", "north bay",
        "thunder bay", "owen sound", "fort mcmurray", "trois rivieres", "quebec city", "saint john",
        "st johns", "richmond hill", "maple ridge", "carleton place", "bow valley", "niagara falls",
        "vancouver island", "prince george", "swift current", "sault ste marie"])
    for frag in ("deer","grande","hat","jaw","bay","sound","mcmurray","rivieres","johns","john",
                 "hill","ridge","place","valley","falls","island","george","current","marie","city","town"):
        place_words.discard(frag)
    place_words.discard("island")
    global PLACES_SORTED
    PLACES_SORTED = sorted(place_words, key=len, reverse=True)

    out = {}
    for camp, (city, served) in CAMPAIGNS.items():
        rows      = [r for r in unjudged if r["campaign"] == camp and (r.get("conversions") or 0) == 0]
        conv_here = [r for r in unjudged + handled
                     if r["campaign"] == camp and (r.get("conversions") or 0) > 0]
        conv_else = [r for r in unjudged + handled
                     if r["campaign"] != camp and (r.get("conversions") or 0) > 0]
        agg = collections.defaultdict(lambda: [0.0, 0, set()])
        for r in rows:
            if "djing" in r["term"].lower(): continue          # brand, never a negative
            why, action, tok = classify(r["term"], served, city, place_words)
            if not tok: continue
            a = agg[(tok, why, action)]
            a[0] += r["cost"]; a[1] += r["clicks"]; a[2].add(r["term"])
        items = []
        for (tok, why, action), v in sorted(agg.items(), key=lambda x: -x[1][0]):
            if v[0] < 0.5: continue
            if any(word_hit(tok, k.get("text", "")) for k in enabled): continue
            if any(word_hit(tok, r["term"]) for r in conv_here): continue
            elsewhere = sum(r["conversions"] for r in conv_else if word_hit(tok, r["term"]))
            items.append({"token": tok, "why": why, "action": action,
                          "cost": round(v[0], 2), "clicks": v[1], "terms": len(v[2]),
                          "eg": sorted(v[2])[:3], "convertedElsewhere": round(elsewhere, 1)})
        out[city] = items
    json.dump(out, sys.stdout, indent=1)

if __name__ == "__main__":
    main()
