// The landing experience exhibit - the page their ad points at, drawn as a
// phone with the fold line marked and the visible faults listed beneath it.
//
// Only faults observable without logging in: what the page title says, what the
// headline says, whether the phone is above the fold, how far down the form is.
// A number that could not be pulled is named in `missing`, never estimated.
import { Check, X } from "lucide-react";

// Local shape - this draft exhibit predates LandingShotExhibit in ../types and
// is not rendered anywhere yet; the local type keeps the build honest until it
// is either wired in or replaced.
interface LandingExhibit {
  url: string;
  pageTitle: string;
  headline: string;
  faults: { label: string; value: string; bad: boolean }[];
  missing?: string | null;
}

export function LandingStrip({ data }: { data: LandingExhibit }) {
  return (
    <div style={{ background: "#fff", border: "1px solid #e3e2de", borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.16em", textTransform: "uppercase", color: "#73726e", fontWeight: 700 }}>
        The page your ad points at
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 12, color: "#4d5156", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
        {data.url}
      </p>

      {/* The phone - browser chrome, the headline as it actually reads, the fold */}
      <div style={{ margin: "14px auto 0", maxWidth: 250, border: "1px solid #dfe1e5", borderRadius: 14, overflow: "hidden", background: "#fff" }}>
        <div style={{ background: "#f1f3f4", padding: "7px 10px", display: "flex", alignItems: "center", gap: 6, borderBottom: "1px solid #e3e2de" }}>
          <span aria-hidden style={{ width: 7, height: 7, borderRadius: 999, background: "#dadce0" }} />
          <span style={{ fontSize: 10, color: "#5f6368", fontFamily: "Arial, Helvetica, sans-serif", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            Tab: {data.pageTitle}
          </span>
        </div>
        <div style={{ padding: "22px 16px 26px", textAlign: "center", background: "#2c2724" }}>
          <p style={{ margin: 0, color: "#fff", fontWeight: 900, fontSize: 17, lineHeight: 1.2 }}>{data.headline}</p>
        </div>
        <div style={{ position: "relative", height: 14, background: "#faf9f7" }}>
          <span style={{ position: "absolute", inset: "0 0 auto", borderTop: "2px dashed #d93a2f" }} />
          <span style={{ position: "absolute", right: 6, top: 2, fontSize: 8.5, fontWeight: 700, color: "#d93a2f", letterSpacing: "0.06em" }}>
            THE FOLD
          </span>
        </div>
      </div>

      {/* What was measured */}
      <div style={{ marginTop: 14 }}>
        {data.faults.map((f) => (
          <div key={f.label} style={{ display: "flex", alignItems: "flex-start", gap: 8, padding: "7px 0", borderTop: "1px solid #efedea" }}>
            {f.bad ? (
              <X size={14} style={{ color: "#d93a2f", flexShrink: 0, marginTop: 2 }} aria-hidden />
            ) : (
              <Check size={14} style={{ color: "#0d9668", flexShrink: 0, marginTop: 2 }} aria-hidden />
            )}
            <span style={{ fontSize: 12.5, color: "#3f3f3c", lineHeight: 1.45, flex: 1 }}>{f.label}</span>
            <span style={{ fontSize: 12.5, fontWeight: 800, color: f.bad ? "#b52d24" : "#0d9668", whiteSpace: "nowrap" }}>{f.value}</span>
          </div>
        ))}
      </div>

      {data.missing ? (
        <p style={{ margin: "12px 0 0", fontSize: 12, color: "#73726e", lineHeight: 1.5, borderTop: "1px solid #e3e2de", paddingTop: 10 }}>
          {data.missing}
        </p>
      ) : null}
    </div>
  );
}
