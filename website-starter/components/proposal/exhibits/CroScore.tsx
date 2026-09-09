// The CRO read - their landing page against the cheatsheet, worked top to
// bottom (each item is bigger than the ones below it), plus real Core Web
// Vitals from PageSpeed Insights. Everything visible from outside.
//
// Styled to match the Automatable audit's "Website performance" section
// exactly - dark slate card, rounded score tiles, emerald/rose values - so a
// prospect who has seen one recognises the other (Jono, 1 September 2026).
import { Check, X, HelpCircle, Gauge } from "lucide-react";
import type { CroExhibit } from "../types";

// The Automatable audit palette (Tailwind slate/emerald/amber/rose), inlined.
const a = {
  card: "#0f172a",
  cardBorder: "1px solid #1e293b",
  tile: "rgba(30,41,59,.3)",
  tileBorder: "1px solid rgba(51,65,85,.3)",
  label: "#64748b",
  strong: "#f1f5f9",
  body: "#cbd5e1",
  muted: "#94a3b8",
  good: "#34d399",
  bad: "#fb7185",
  none: "#64748b",
};

function Vital({ label, sub, value, good }: { label: string; sub: string; value: string | null; good: boolean | null }) {
  return (
    <div style={{ background: a.tile, border: a.tileBorder, borderRadius: 12, padding: "14px 16px" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: a.label }}>{label}</p>
      <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: value === null ? a.none : good ? a.good : a.bad, fontVariantNumeric: "tabular-nums" }}>
        {value ?? "n/a"}
      </p>
      <p style={{ margin: "4px 0 0", fontSize: 10, color: a.label }}>{sub}</p>
    </div>
  );
}

export function CroScore({ exhibit }: { exhibit: CroExhibit }) {
  const v = exhibit.vitals;
  const checks = [...exhibit.checks].sort((a2, b) => a2.rank - b.rank);
  // A row of four "n/a" tiles is furniture, not information - when nothing was
  // measured, the tiles are not drawn at all (Jono, 1 September 2026).
  const anyVital = v.lcpSeconds !== null || v.inpMs !== null || v.cls !== null || v.mobileScore !== null;
  // The audit idiom: only what needs doing gets a card. Passes collapse to one
  // line, the way the repo's own audit reports do.
  const problems = checks.filter((c) => c.status !== "pass");
  const passes = checks.filter((c) => c.status === "pass");
  return (
    <div style={{ background: a.card, border: a.cardBorder, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 3px rgba(2,6,23,.4)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: a.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <Gauge size={12} aria-hidden /> The page, scored
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 15, fontWeight: 800, color: a.strong, lineHeight: 1.4 }}>{exhibit.headline}</p>

      {anyVital ? (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 12, marginTop: 14 }}>
          <Vital label="Load" sub="Largest Contentful Paint" value={v.lcpSeconds === null ? null : `${v.lcpSeconds}s`} good={v.lcpSeconds === null ? null : v.lcpSeconds <= 2.5} />
          <Vital label="Response" sub="Interaction to Next Paint" value={v.inpMs === null ? null : `${v.inpMs}ms`} good={v.inpMs === null ? null : v.inpMs <= 200} />
          <Vital label="Stability" sub="Cumulative Layout Shift" value={v.cls === null ? null : `${v.cls}`} good={v.cls === null ? null : v.cls <= 0.1} />
          <Vital label="Mobile score" sub="PageSpeed, out of 100" value={v.mobileScore === null ? null : `${v.mobileScore}`} good={v.mobileScore === null ? null : v.mobileScore >= 80} />
        </div>
      ) : null}
      {anyVital && v.basis ? (
        <p style={{ margin: "8px 0 0", fontSize: 11.5, color: a.muted }}>
          {v.basis === "field" ? "Measured on real Chrome users visiting this page, via Google's PageSpeed Insights." : "Simulated lab measurement via Google's PageSpeed Insights - no real-user data exists for this page yet."}
        </p>
      ) : null}

      {/* The checklist, in the audit's card idiom: one rounded slate card per
          item, the pass/fail badge top-right. */}
      <div style={{ display: "grid", gap: 10, marginTop: 14 }}>
        {problems.map((c) => (
          <div key={c.name} style={{ position: "relative", background: a.tile, border: a.tileBorder, borderRadius: 12, padding: "14px 16px" }}>
            <span
              aria-hidden
              style={{
                position: "absolute",
                top: 12,
                right: 12,
                width: 26,
                height: 26,
                borderRadius: 6,
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                background: c.status === "pass" ? "rgba(16,185,129,.2)" : c.status === "fail" ? "rgba(244,63,94,.2)" : "rgba(51,65,85,.4)",
              }}
            >
              {c.status === "pass" ? (
                <Check size={14} style={{ color: a.good }} />
              ) : c.status === "fail" ? (
                <X size={14} style={{ color: a.bad }} />
              ) : (
                <HelpCircle size={14} style={{ color: a.none }} />
              )}
            </span>
            <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: "#fff", paddingRight: 36 }}>{c.name}</p>
            <p style={{ margin: "4px 0 0", fontSize: 12.5, color: a.muted, lineHeight: 1.5, paddingRight: 36 }}>{c.detail}</p>
          </div>
        ))}
      </div>
      {passes.length > 0 ? (
        <p style={{ margin: "12px 0 0", fontSize: 12.5, color: a.muted, lineHeight: 1.55, display: "flex", gap: 8, alignItems: "flex-start" }}>
          <Check size={14} style={{ color: a.good, flexShrink: 0, marginTop: 2 }} aria-hidden />
          <span>
            <strong style={{ color: a.body }}>{passes.length} of {checks.length} pass:</strong>{" "}
            {passes.map((c) => c.name.toLowerCase()).join(" · ")}.
          </span>
        </p>
      ) : null}
      <p style={{ margin: "12px 0 0", fontSize: 12.5, color: a.body, lineHeight: 1.55 }}>{exhibit.upsideNote}</p>
      <p style={{ margin: "6px 0 0", fontSize: 11.5, color: a.label }}>Read from {exhibit.urlChecked}, {exhibit.checkedOn}. Ordered biggest leak first.</p>
    </div>
  );
}
