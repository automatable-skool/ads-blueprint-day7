// Proof they own that their ads never use - the persuasion flip of the copy
// matchup. Each tile DRAWS the gap: the number as it lives on their own pages
// beside the zero in their ads. Claims are verified on their public pages,
// source named on the tile - never invented.
//
// Visual pass (Jono, 2 September 2026): icon per claim, five gold stars on the
// review tile, and the on-your-pages vs in-your-ads split IS the graphic.
import { Gem, Star, CalendarDays, Award } from "lucide-react";
import type { ReactNode } from "react";
import type { UnusedProofExhibit } from "../types";
import { text, line } from "../ui";

/** The mark for each claim, matched on its label. */
function claimIcon(label: string): ReactNode {
  const l = label.toLowerCase();
  if (l.includes("review") || l.includes("star")) return <Star size={15} />;
  if (l.includes("event") || l.includes("year")) return <CalendarDays size={15} />;
  if (l.includes("%") || l.includes("roster") || l.includes("dj")) return <Award size={15} />;
  return <Gem size={15} />;
}

function GoldStars() {
  return (
    <span aria-hidden style={{ display: "inline-flex", gap: 2, marginBottom: 4 }}>
      {[0, 1, 2, 3, 4].map((i) => (
        <Star key={i} size={13} fill="#f4b400" style={{ color: "#f4b400" }} />
      ))}
    </span>
  );
}

export function ProofUnused({ exhibit }: { exhibit: UnusedProofExhibit }) {
  return (
    <div style={{ background: "#fff", border: line.hairline, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <Gem size={12} aria-hidden /> Proof you own that your ads never use
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 800, color: text.strong, lineHeight: 1.4 }}>{exhibit.headline}</p>

      <div className="pp-3col" style={{ marginTop: 14 }}>
        {exhibit.items.map((it) => {
          const isReviews = it.label.toLowerCase().includes("review");
          return (
            <div key={it.label} style={{ background: "#f7f6f4", border: line.hairline, borderRadius: 12, padding: "16px 18px", display: "flex", flexDirection: "column" }}>
              <p style={{ margin: "0 0 12px", display: "flex", alignItems: "center", gap: 8, fontSize: 13, fontWeight: 700, color: text.strong, lineHeight: 1.35 }}>
                <span
                  aria-hidden
                  style={{
                    width: 28,
                    height: 28,
                    borderRadius: 8,
                    background: "#fef6f3",
                    color: "#ae4826",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    flexShrink: 0,
                  }}
                >
                  {claimIcon(it.label)}
                </span>
                {it.label}
              </p>

              {/* The graphic: their pages against their ads */}
              <div style={{ display: "flex", background: "#fff", border: line.hairline, borderRadius: 10, overflow: "hidden" }}>
                <div style={{ flex: 1, padding: "12px 14px" }}>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: text.muted }}>On your pages</p>
                  {isReviews ? <p style={{ margin: "6px 0 0" }}><GoldStars /></p> : null}
                  <p style={{ margin: isReviews ? 0 : "6px 0 0", fontSize: 30, fontWeight: 900, color: "#ae4826", letterSpacing: "-0.02em", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                    {it.stat}
                  </p>
                </div>
                <div style={{ flex: 1, padding: "12px 14px", borderLeft: line.hairline, background: "#fdf3f2" }}>
                  <p style={{ margin: 0, fontSize: 10, letterSpacing: "0.1em", textTransform: "uppercase", color: "#b42318" }}>In your ads</p>
                  <p style={{ margin: "6px 0 0", fontSize: 30, fontWeight: 900, color: "#b42318", opacity: 0.85, letterSpacing: "-0.02em", lineHeight: 1.1, fontVariantNumeric: "tabular-nums" }}>
                    0
                  </p>
                </div>
              </div>

              <p style={{ margin: "10px 0 0", fontSize: 11.5, color: text.muted, lineHeight: 1.5 }}>{it.source}</p>
            </div>
          );
        })}
      </div>

      <p style={{ margin: "14px 0 0", fontSize: 13, color: text.body, lineHeight: 1.55, background: "#fef6f3", borderLeft: "3px solid #d35e36", borderRadius: 8, padding: "10px 12px" }}>
        {exhibit.readout}
      </p>
    </div>
  );
}
