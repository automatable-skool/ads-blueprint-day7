// Where their ad actually lands - a phone-width screenshot with the visible
// faults marked. A screenshot, not a rebuild: the point is that this is really
// their page. No screenshot = the panel says so; it never renders a fake.
//
// Drawn as the Automatable audit graphic (Jono, 1 September 2026): one rounded
// tile per fault with the X badge top-right, the audit's checklist idiom - but
// on the proposal's light palette, never a black card.
import { Smartphone, X } from "lucide-react";
import type { LandingShotExhibit } from "../types";

// The audit graphic's tile layout on the proposal's own LIGHT palette -
// never a black card on this page (Jono, 1 September 2026).
const a = {
  card: "#ffffff",
  cardBorder: "1px solid #e3e2de",
  tile: "#f7f6f4",
  tileBorder: "1px solid #e3e2de",
  strong: "#1a1a19",
  body: "#3f3f3c",
  muted: "#73726e",
  label: "#9a9995",
  bad: "#d93a2f",
};

export function LandingShot({ exhibit }: { exhibit: LandingShotExhibit }) {
  return (
    <div style={{ background: a.card, border: a.cardBorder, borderRadius: 16, padding: "22px 24px", boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: a.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <Smartphone size={12} aria-hidden /> Where the ad sends people
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 14, color: a.body, lineHeight: 1.5 }}>
        The ad says <strong style={{ color: a.strong }}>&ldquo;{exhibit.fromAdHeadline}&rdquo;</strong>. It lands on{" "}
        <span style={{ fontFamily: "monospace", fontSize: 13, color: a.strong }}>{exhibit.url}</span>
        {exhibit.isHomepage ? " - the homepage." : "."}
      </p>
      <div style={{ display: "flex", gap: 18, marginTop: 16, flexWrap: "wrap" }}>
        {exhibit.screenshotUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={exhibit.screenshotUrl}
            alt={`Their landing page at phone width: ${exhibit.url}`}
            style={{ width: 190, borderRadius: 12, border: "1px solid #e3e2de", alignSelf: "flex-start" }}
          />
        ) : (
          <p style={{ width: 190, fontSize: 12.5, color: a.muted, border: "1px dashed #d5d3ce", borderRadius: 12, padding: 14, margin: 0 }}>
            No screenshot captured on this pull. The faults below were read from the live page.
          </p>
        )}
        <div style={{ flex: "1 1 260px", display: "grid", gap: 10, alignContent: "start" }}>
          {exhibit.faults.map((f) => (
            <div key={f.label} style={{ position: "relative", background: a.tile, border: a.tileBorder, borderRadius: 12, padding: "14px 16px" }}>
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
                  background: "rgba(217,58,47,.1)",
                }}
              >
                <X size={14} style={{ color: a.bad }} />
              </span>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: a.strong, paddingRight: 36 }}>{f.label}</p>
              <p style={{ margin: "4px 0 0", fontSize: 12.5, color: a.muted, lineHeight: 1.5, paddingRight: 36 }}>{f.detail}</p>
            </div>
          ))}
          {exhibit.loadSeconds !== null ? (
            <div style={{ background: a.tile, border: a.tileBorder, borderRadius: 12, padding: "14px 16px" }}>
              <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.08em", textTransform: "uppercase", color: a.label }}>Load on a phone</p>
              <p style={{ margin: "4px 0 0", fontSize: 24, fontWeight: 800, color: exhibit.loadSeconds <= 2.5 ? "#067647" : a.bad, fontVariantNumeric: "tabular-nums" }}>
                {exhibit.loadSeconds}s
              </p>
              <p style={{ margin: "4px 0 0", fontSize: 10, color: a.label }}>Google&rsquo;s bar for &ldquo;good&rdquo; is 2.5</p>
            </div>
          ) : null}
        </div>
      </div>
      <p style={{ margin: "16px 0 0", fontSize: 13.5, color: a.body, borderTop: "1px solid #e3e2de", paddingTop: 12, lineHeight: 1.6 }}>{exhibit.readout}</p>
    </div>
  );
}
