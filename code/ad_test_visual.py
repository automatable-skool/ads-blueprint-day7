"""The swap visual for /ad-tests - champion vs challenger, line by line.

Reads the report cache (ad_test_report.py) and, when given, the swap plan
(the JSON ad_test_apply.py reads) and writes one self-contained HTML page:
both ads with every headline and description, impressions and click-through
per line, and a button that animates the swap.

Colour rules (the whole point of the page):
  green  - a line that WON its audition: a champion line that held its slot,
           or a challenger line being promoted into the champion
  red    - a line that LOST: a champion line being swapped out, or a
           challenger line going back to the library tagged tested-and-lost
  yellow - under the ~500-impression learning floor: untested, never judged

Usage (from the project root):
  python3 code/ad_test_visual.py --report code/cache/ad-tests.json \
      --ad-group 199836476317 --plan code/cache/ad-test-plan-x.json \
      --out code/cache/ad-test-visual.html
Without --plan the page still renders both ads and the floor colouring,
but no win/lose calls and no swap button - that is the not-callable view.
"""

import argparse
import html as html_mod
import json
import webbrowser

FLOOR = 500


def esc(s):
    return html_mod.escape(str(s), quote=True)


def line_stats(lines, field, text):
    for ln in lines:
        if ln["field"] == field and ln["text"] == text:
            return ln
    return None


def classify(text, imp, role, winners, losers, judged):
    """green / red / yellow / '' for one line."""
    if imp < FLOOR:
        return "floor", "untested"
    if not judged:
        return "", ""
    if role == "champion":
        return ("lose", "out") if text in losers else ("win", "held")
    return ("win", "promoted") if text in winners else ("lose", "lost")


def render_rows(ad, lines, role, calls, judged):
    """calls: {"HEADLINE": (winners, losers), "DESCRIPTION": (winners, losers)}"""
    out = []
    for kind, field, items in (("h", "HEADLINE", ad["headlines"]),
                               ("d", "DESCRIPTION", ad["descriptions"])):
        label = "Headlines" if kind == "h" else "Descriptions"
        out.append(f'<tr class="sect"><td colspan="3">{label}</td></tr>')
        w, l = calls.get(field, ([], []))
        for it in items:
            st = line_stats(lines, field, it["text"])
            imp = st["impressions"] if st else 0
            ctr = st["ctr"] if st else 0.0
            cls, tag = classify(it["text"], imp, role, w, l, judged)
            pin = '<span class="pintag">PIN 1</span>' if it.get("pinned") else ""
            tag_html = f'<span class="tag">{esc(tag)}</span>' if tag else ""
            out.append(
                f'<tr class="{cls}" data-kind="{kind}"><td>{esc(it["text"])}{pin}{tag_html}</td>'
                f'<td class="num">{imp:,}</td><td class="num serif">{ctr}%</td></tr>')
    return "".join(out)


def render(group, lines, plan):
    ads = sorted(group["ads"], key=lambda a: -a["impressions"])
    champion, challenger = ads[0], ads[1]
    calls, judged, winners = {}, False, []
    if plan and plan.get("new_champion"):
        for field, key in (("HEADLINE", "headlines"), ("DESCRIPTION", "descriptions")):
            champ_texts = {h["text"] for h in champion[key]}
            new_texts = {h["text"] for h in plan["new_champion"][key]}
            calls[field] = (sorted(new_texts - champ_texts), sorted(champ_texts - new_texts))
        winners = calls["HEADLINE"][0] + calls["DESCRIPTION"][0]
        judged = True

    def card(ad, role):
        verdict = ""
        if group.get("callable"):
            won = str(ad["ad_id"]) == str(group.get("winner_ad_id"))
            verdict = (f'<span class="verdict {"good" if won else "bad"}">'
                       f'{"wins the pair" if won else "loses the pair"}</span>')
        return f'''<div class="card" id="{role}">
  <div class="cardhead"><span class="kicker">{role}</span>{verdict}
    <div class="adline">Ad {ad["ad_id"]} &middot; {ad["impressions"]:,} impressions
      &middot; {ad["clicks"]} clicks &middot; <span class="serif big">{ad["ctr"]}%</span> CTR</div>
  </div>
  <table><thead><tr><th>Line</th><th class="num">Impr.</th><th class="num">CTR</th></tr></thead>
  <tbody>{render_rows(ad, lines, role, calls, judged)}</tbody></table></div>'''

    conf = group.get("confidence_pct") or 0
    cross = group.get("conversion_crosscheck")
    sub = (f'{group["clicks"]} clicks across the pair &middot; confidence {conf:.0f}%'
           + (f' &middot; cross-check: {esc(cross)}' if cross else ''))
    n = len(winners)
    button = ""
    if judged and n:
        button = (f'<button id="swap">Run the swap - {n} in, {n} out</button>'
                  '<div class="note" id="note">Both ads pause. The rebuilt champion and a fresh '
                  'challenger are created as NEW paused ads - an RSA is never edited in place, '
                  'because edits merge the stats.</div>')

    return f'''<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>Ad test &middot; {esc(group["ad_group"])}</title>
<link rel="preconnect" href="https://fonts.googleapis.com">
<link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>
  * {{ box-sizing:border-box; margin:0; padding:0; }}
  :root {{ --canvas:#f5f4ed; --ivory:#faf9f5; --sand:#e8e6dc; --ink:#141413; --body:#5e5d59;
    --muted:#87867f; --hairline:#f0eee6; --hairline-soft:#e8e6dc; --ring:#d1cfc5;
    --terracotta:#c96442; --terracotta-active:#b05538; --coral:#d97757;
    --good:#3d7a4a; --good-bg:rgba(61,122,74,.08); --good-ring:rgba(61,122,74,.25);
    --warn:#d4a017; --warn-bg:rgba(212,160,23,.10); --warn-ring:rgba(212,160,23,.30);
    --bad:#b53333; --bad-bg:rgba(181,51,51,.07); --bad-ring:rgba(181,51,51,.22); }}
  body {{ background:var(--canvas); color:var(--ink); padding:40px 44px;
    font-family:system-ui,-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif;
    -webkit-font-smoothing:antialiased; }}
  .serif {{ font-family:"Tiempos Text",Georgia,serif; font-weight:500; }}
  .kicker, .tag, .pintag, th, .num {{ font-family:"JetBrains Mono",ui-monospace,Menlo,monospace; }}
  .kicker {{ font-size:11px; text-transform:uppercase; letter-spacing:2px; color:var(--coral); }}
  h1 {{ font-family:"Tiempos Text",Georgia,serif; font-weight:500; font-size:34px;
    letter-spacing:-.5px; margin-bottom:6px; }}
  .sub {{ color:var(--body); font-size:14px; margin-bottom:16px; }}
  .legend {{ display:flex; gap:18px; margin-bottom:24px; font-size:12.5px; color:var(--body); flex-wrap:wrap; }}
  .legend span {{ display:inline-flex; align-items:center; gap:6px; }}
  .dot {{ width:12px; height:12px; border-radius:4px; display:inline-block; }}
  .cols {{ display:flex; gap:24px; align-items:flex-start; }}
  .card {{ background:var(--ivory); border:1px solid var(--hairline); border-radius:16px; flex:1;
    box-shadow:rgba(0,0,0,.04) 0 4px 24px; overflow:hidden; }}
  .cardhead {{ padding:20px 22px 14px; border-bottom:1px solid var(--hairline-soft); }}
  .verdict {{ font-size:13px; font-weight:600; margin-left:10px; }}
  .verdict.good {{ color:var(--good); }} .verdict.bad {{ color:var(--bad); }}
  .adline {{ color:var(--body); font-size:13px; margin-top:6px; }}
  .adline .big {{ font-size:16px; color:var(--ink); }}
  table {{ width:100%; border-collapse:collapse; font-size:13.5px; }}
  th {{ font-size:10px; text-transform:uppercase; letter-spacing:1.5px; color:#6e6d66;
    text-align:left; padding:10px 16px 8px; border-bottom:1px solid var(--hairline-soft); font-weight:500; }}
  th.num, td.num {{ text-align:right; white-space:nowrap; }}
  td {{ padding:8px 16px; border-bottom:1px solid var(--hairline); transition:all .8s ease; }}
  td.num {{ font-size:12px; }}
  tr.sect td {{ padding-top:16px; font-family:"JetBrains Mono",ui-monospace,monospace; font-size:10px;
    color:var(--coral); text-transform:uppercase; letter-spacing:1.5px; border-bottom:1px solid var(--hairline-soft); }}
  tr.win td {{ background:var(--good-bg); }}
  tr.win td:first-child {{ box-shadow:inset 3px 0 0 var(--good); }}
  tr.lose td {{ background:var(--bad-bg); }}
  tr.lose td:first-child {{ box-shadow:inset 3px 0 0 var(--bad); }}
  tr.floor td {{ background:var(--warn-bg); }}
  tr.floor td:first-child {{ box-shadow:inset 3px 0 0 var(--warn); }}
  .pintag {{ font-size:9px; letter-spacing:1px; color:#fff; background:var(--ink); border-radius:4px;
    padding:1px 6px; margin-left:8px; vertical-align:1px; }}
  .tag {{ font-size:9px; letter-spacing:1px; text-transform:uppercase; border-radius:999px;
    padding:1px 7px; margin-left:8px; border:1px solid; vertical-align:1px; }}
  tr.win .tag {{ color:var(--good); border-color:var(--good-ring); background:#fff; }}
  tr.lose .tag {{ color:var(--bad); border-color:var(--bad-ring); background:#fff; }}
  tr.floor .tag {{ color:var(--warn); border-color:var(--warn-ring); background:#fff; }}
  button {{ margin:28px auto 0; display:block; font:inherit; font-size:14px; font-weight:500; color:#faf9f5;
    background:var(--terracotta); border:0; border-radius:12px; padding:12px 22px; cursor:pointer; }}
  button:hover {{ background:var(--terracotta-active); }} button:disabled {{ opacity:.5; cursor:default; }}
  tr.gone td {{ opacity:0; padding-top:0; padding-bottom:0; line-height:0; font-size:0; border:0 !important; }}
  tr.incoming td {{ background:var(--good-bg); }}
  tr.incoming td:first-child {{ box-shadow:inset 3px 0 0 var(--good); }}
  tr.promoted-away td {{ opacity:.35; }}
  .note {{ text-align:center; color:var(--body); font-size:12.5px; margin-top:12px; opacity:0;
    transition:opacity .8s ease .6s; }}
  .note.show {{ opacity:1; }}
</style></head><body>
<span class="kicker">/ad-tests &middot; {esc(group["campaign"])}</span>
<h1>{esc(group["ad_group"])} &middot; champion vs challenger</h1>
<div class="sub">{sub}</div>
<div class="legend">
  <span><span class="dot" style="background:var(--good-bg);border:1px solid var(--good-ring)"></span>won - held its slot or promoted in</span>
  <span><span class="dot" style="background:var(--bad-bg);border:1px solid var(--bad-ring)"></span>lost - swapped out or back to the library</span>
  <span><span class="dot" style="background:var(--warn-bg);border:1px solid var(--warn-ring)"></span>under {FLOOR} impressions - untested, never judged</span>
</div>
<div class="cols">{card(champion, "champion")}{card(challenger, "challenger")}</div>
{button}
<script>
const btn = document.getElementById('swap');
if (btn) btn.addEventListener('click', () => {{
  const champBody = document.querySelector('#champion tbody');
  document.querySelectorAll('#champion tr.lose').forEach(r => r.classList.add('gone'));
  document.querySelectorAll('#challenger tr.win').forEach(r => {{
    const clone = r.cloneNode(true);
    clone.classList.remove('win'); clone.classList.add('incoming');
    clone.querySelector('.tag').textContent = 'promoted in';
    if (r.dataset.kind === 'h') {{
      champBody.insertBefore(clone, champBody.querySelectorAll('tr.sect')[1]);
    }} else {{
      champBody.appendChild(clone);
    }}
    r.classList.add('promoted-away');
    r.querySelector('.tag').textContent = 'moved to champion';
  }});
  const note = document.getElementById('note');
  if (note) note.classList.add('show');
  btn.disabled = true;
}});
</script></body></html>'''


def main():
    ap = argparse.ArgumentParser(description=__doc__,
                                 formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--report", required=True)
    ap.add_argument("--ad-group", required=True)
    ap.add_argument("--plan")
    ap.add_argument("--out", required=True)
    ap.add_argument("--open", action="store_true", help="open in the browser after writing")
    args = ap.parse_args()

    with open(args.report) as f:
        report = json.load(f)
    group = next((g for g in report["ad_groups"]
                  if str(g["ad_group_id"]) == str(args.ad_group)), None)
    if group is None:
        raise SystemExit(f"ad group {args.ad_group} not in {args.report}")
    if len(group["ads"]) < 2:
        raise SystemExit("need two ads in the group to draw the pair")
    plan = None
    if args.plan:
        with open(args.plan) as f:
            plan = json.load(f)

    with open(args.out, "w") as f:
        f.write(render(group, report["lines"], plan))
    print(f"wrote {args.out}")
    if args.open:
        webbrowser.open("file://" + args.out.replace(" ", "%20")
                        if args.out.startswith("/") else args.out)


if __name__ == "__main__":
    main()
