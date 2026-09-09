// The tracking read - which measurement tags the page their ad pays for
// actually carries, from its public source. Presence is not proof it works,
// and the limit line under the card says so in those words.
//
// Each row carries the tool's real logo (inline SVG, no network fetch) so the
// card reads at a glance - Jono's ruling, 1 September 2026: "we also need the
// logos on this so it looks crisper".
import { Check, X, Activity } from "lucide-react";
import type { ReactNode } from "react";
import type { TrackingExhibit } from "../types";
import { text, line } from "../ui";

const weightLabel = { critical: "critical", important: "important", nice: "context" } as const;

/** The recognisable mark for each tag, matched on the check's name. */
function TagLogo({ name }: { name: string }) {
  const n = name.toLowerCase();
  let mark: ReactNode = null;

  if (n.includes("tag manager")) {
    // Google Tag Manager - the blue diamond.
    mark = (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path d="M12 1 23 12 12 23 1 12Z" fill="#4285F4" />
        <path d="M12 1 1 12l11 11V1Z" fill="#8AB4F8" />
        <path d="M12 8.2 15.8 12 12 15.8 8.2 12Z" fill="#fff" />
      </svg>
    );
  } else if (n.includes("google ads")) {
    // Google Ads - the yellow/blue strokes and the green dot.
    mark = (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <rect x="8.6" y="2" width="6.8" height="19" rx="3.4" fill="#FBBC04" transform="rotate(-30 12 11.5)" />
        <rect x="8.6" y="2" width="6.8" height="19" rx="3.4" fill="#4285F4" transform="rotate(30 12 11.5)" />
        <circle cx="5" cy="19" r="3.3" fill="#34A853" />
      </svg>
    );
  } else if (n.includes("analytics") || n.includes("ga4")) {
    // Google Analytics - the ascending orange bars.
    mark = (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <rect x="15.6" y="3" width="5.4" height="18" rx="2.7" fill="#F9AB00" />
        <rect x="9.3" y="9.8" width="5.4" height="11.2" rx="2.7" fill="#E37400" />
        <circle cx="5.7" cy="18.3" r="2.7" fill="#E37400" />
      </svg>
    );
  } else if (n.includes("meta") || n.includes("facebook") || n.includes("pixel")) {
    // Meta - the blue loop.
    mark = (
      <svg width="18" height="18" viewBox="0 0 24 24" aria-hidden>
        <path
          d="M6.6 16.4c-2.1 0-3.6-1.9-3.6-4.2S4.5 8 6.6 8c3.7 0 7.1 8.4 10.8 8.4 2.1 0 3.6-1.9 3.6-4.2S19.5 8 17.4 8c-3.7 0-7.1 8.4-10.8 8.4Z"
          fill="none"
          stroke="#0081FB"
          strokeWidth="2.3"
          strokeLinecap="round"
        />
      </svg>
    );
  }

  return (
    <span
      aria-hidden
      style={{
        width: 30,
        height: 30,
        borderRadius: 8,
        border: line.hairline,
        background: "#fff",
        display: "inline-flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {mark ?? <Activity size={15} style={{ color: text.muted }} />}
    </span>
  );
}

export function Tracking({ exhibit }: { exhibit: TrackingExhibit }) {
  const missing = exhibit.checks.filter((c) => !c.found && c.weight === "critical").length;
  return (
    <div style={{ background: "#fff", border: line.hairline, borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <Activity size={12} aria-hidden /> Is anything being counted?
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 800, color: missing > 0 ? "#b42318" : text.strong, lineHeight: 1.4 }}>
        {exhibit.headline}
      </p>
      <div style={{ marginTop: 10 }}>
        {exhibit.checks.map((c) => (
          <div key={c.name} style={{ display: "flex", gap: 12, padding: "10px 0", borderBottom: line.hairline, alignItems: "flex-start" }}>
            <TagLogo name={c.name} />
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ margin: 0, fontSize: 13.5, fontWeight: 700, color: text.strong }}>
                {c.name}
                <span style={{ fontWeight: 500, color: text.muted, fontSize: 11.5 }}> &middot; {weightLabel[c.weight]}</span>
              </p>
              <p style={{ margin: "2px 0 0", fontSize: 12.5, color: text.muted, lineHeight: 1.5 }}>{c.meaning}</p>
            </div>
            {c.found ? (
              <Check size={15} style={{ color: "#067647", flexShrink: 0, marginTop: 2 }} aria-hidden />
            ) : (
              <X size={15} style={{ color: "#b42318", flexShrink: 0, marginTop: 2 }} aria-hidden />
            )}
          </div>
        ))}
      </div>
      <p style={{ margin: "12px 0 0", fontSize: 12, color: text.muted, lineHeight: 1.55 }}>
        {exhibit.limitNote} Read from {exhibit.urlChecked}, {exhibit.checkedOn}.
      </p>
    </div>
  );
}
