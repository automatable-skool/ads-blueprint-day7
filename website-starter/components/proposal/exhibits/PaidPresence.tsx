// The paid-presence chart - who has been in the auction all year and who has
// not. Every point is COUNTED: live creatives that month, derived from the
// first-shown and last-shown dates the Ads Transparency Center publishes.
// An estimated series, if one is ever added, renders dashed and says so.
import type { PaidPresenceExhibit } from "../types";
import { Scroller, chart, text, line } from "../ui";

const W = 760;
const H = 300;
const PAD = { top: 16, right: 190, bottom: 28, left: 54 };

export function PaidPresence({ data }: { data: PaidPresenceExhibit }) {
  const n = data.monthLabels.length;
  const nums = data.series.flatMap((s) => s.values.filter((v): v is number => v !== null));
  const max = Math.max(1, ...nums);
  const x = (i: number) => PAD.left + (i / Math.max(1, n - 1)) * (W - PAD.left - PAD.right);
  const y = (v: number) => PAD.top + (1 - v / max) * (H - PAD.top - PAD.bottom);

  // End labels collide whenever two series finish on nearby values - "Legendary
  // Events · 3" sat straight on top of "High Life Event Group · 2" on the
  // the first real pull. Lay them out once, top to bottom, pushing any that land
  // closer together than one line of text.
  const LABEL_GAP = 15;
  const endPoints = data.series.map((s) => {
    const lastIdx = s.values.reduce<number>((acc, v, i) => (v === null ? acc : i), 0);
    return { name: s.name, lastIdx, lastVal: s.values[lastIdx] };
  });
  const labelY = new Map<string, number>();
  endPoints
    .filter((e) => e.lastVal !== null)
    .map((e) => ({ ...e, y: y(e.lastVal as number) + 4 }))
    .sort((a, b) => a.y - b.y)
    .forEach((e, i, arr) => {
      const prev = i > 0 ? labelY.get(arr[i - 1].name) ?? e.y : null;
      labelY.set(e.name, prev !== null && e.y - prev < LABEL_GAP ? prev + LABEL_GAP : e.y);
    });

  let compIdx = -1;
  return (
    <figure style={{ margin: 0, background: "#fff", border: line.hairline, borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)", minWidth: 0, maxWidth: "100%" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700 }}>
        Ads running, month by month
      </p>
      <Scroller>
        <svg
          viewBox={`0 0 ${W} ${H}`}
          style={{ minWidth: 620, width: "100%", display: "block", marginTop: 10 }}
          role="img"
          aria-label="Live ads per month, this business against its competitors"
        >
          {[0, 0.5, 1].map((f) => (
            <g key={f}>
              <line x1={PAD.left} x2={W - PAD.right} y1={y(f * max)} y2={y(f * max)} stroke={chart.grid} strokeWidth={1} />
              <text x={PAD.left - 8} y={y(f * max) + 4} textAnchor="end" fontSize={11} fill={chart.label}>
                {Math.round(f * max)}
              </text>
            </g>
          ))}
          <text x={PAD.left} y={H - 6} fontSize={11} fill={chart.label}>{data.monthLabels[0]}</text>
          <text x={W - PAD.right} y={H - 6} textAnchor="end" fontSize={11} fill={chart.label}>{data.monthLabels[n - 1]}</text>

          {data.series.map((s) => {
            const color = s.isClient ? chart.client : chart.competitors[(compIdx += 1) % chart.competitors.length];
            const pts = s.values
              .map((v, i) => (v === null ? null : `${x(i)},${y(v)}`))
              .filter(Boolean)
              .join(" ");
            const lastIdx = s.values.reduce<number>((acc, v, i) => (v === null ? acc : i), 0);
            const lastVal = s.values[lastIdx];
            const flat = s.values.every((v) => v === 0 || v === null);
            return (
              <g key={s.name}>
                <polyline
                  points={pts}
                  fill="none"
                  stroke={color}
                  strokeWidth={s.isClient ? 3 : 2}
                  strokeDasharray={s.isEstimate ? "5 4" : undefined}
                  strokeLinejoin="round"
                />
                {lastVal !== null ? (
                  <text
                    x={x(lastIdx) + 8}
                    y={labelY.get(s.name) ?? y(lastVal) + 4}
                    fontSize={12}
                    fontWeight={s.isClient ? 800 : 500}
                    fill={s.isClient ? chart.client : chart.label}
                  >
                    {s.name} &middot; {lastVal}
                    {s.isEstimate ? " (est.)" : ""}
                    {s.isClient && flat ? " - nothing running" : ""}
                  </text>
                ) : null}
              </g>
            );
          })}
        </svg>
      </Scroller>
      <figcaption style={{ margin: "12px 0 0", borderTop: line.hairline, paddingTop: 12 }}>
        <p style={{ margin: 0, fontSize: 13.5, color: text.body, lineHeight: 1.6 }}>{data.readout}</p>
        <p style={{ margin: "6px 0 0", fontSize: 12, color: text.muted, lineHeight: 1.5 }}>{data.methodLine}</p>
      </figcaption>
    </figure>
  );
}
