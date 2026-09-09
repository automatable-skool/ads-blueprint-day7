// The copy matchup - their line beside the market's best in the same angle,
// verbatim, longest-running first. No score out of ten: the verdict is the
// ranking plus the named gap, and days running is the market's own verdict.
//
// Each ad renders as a REAL Google search ad - Sponsored label, favicon,
// advertiser name and URL, blue headline, grey description (Jono's ruling,
// 1 September 2026: "make them beautiful, very realistic"). The data is
// verbatim from the Ads Transparency Center; only the frame is drawn.
import { Check, X, PenLine } from "lucide-react";
import type { CopyAuditExhibit, CopyMatchup } from "../types";
import { text, line } from "../ui";

const arial = "Arial, Helvetica, sans-serif";

/** One ad, drawn the way Google draws it on the results page. */
function GoogleAd({
  advertiser,
  domain,
  headline,
  description,
}: {
  advertiser: string;
  domain?: string;
  headline: string;
  description?: string;
}) {
  return (
    <div style={{ background: "#fff", border: "1px solid #dadce0", borderRadius: 8, padding: "16px", fontFamily: arial }}>
      <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: "#202124", letterSpacing: "0.01em" }}>Sponsored</p>
      <div style={{ display: "flex", alignItems: "center", gap: 12, marginTop: 10 }}>
        <span
          aria-hidden
          style={{
            width: 28,
            height: 28,
            borderRadius: 999,
            background: "#f1f3f4",
            border: "1px solid #ecedef",
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            flexShrink: 0,
            overflow: "hidden",
          }}
        >
          {domain ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`} alt="" width={18} height={18} />
          ) : (
            <span style={{ fontSize: 13, fontWeight: 700, color: "#5f6368" }}>{advertiser.charAt(0)}</span>
          )}
        </span>
        <span style={{ minWidth: 0, flex: 1 }}>
          <span style={{ display: "block", fontSize: 14, color: "#202124", lineHeight: "20px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
            {advertiser}
          </span>
          {domain ? (
            <span style={{ display: "block", fontSize: 12, color: "#4d5156", lineHeight: "18px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
              https://www.{domain.replace(/^www\./, "")}
            </span>
          ) : null}
        </span>
        {/* Google's three-dot ad menu */}
        <svg width="16" height="16" viewBox="0 0 24 24" fill="#5f6368" aria-hidden style={{ flexShrink: 0 }}>
          <circle cx="12" cy="5" r="2" />
          <circle cx="12" cy="12" r="2" />
          <circle cx="12" cy="19" r="2" />
        </svg>
      </div>
      <p style={{ margin: "10px 0 0", color: "#1a0dab", fontSize: 20, lineHeight: "26px", fontWeight: 400 }}>{headline}</p>
      {description ? (
        <p style={{ margin: "4px 0 0", color: "#4d5156", fontSize: 14, lineHeight: "22px" }}>{description}</p>
      ) : null}
    </div>
  );
}

/** The craft line under an ad: observable reads on length, assets, build. */
function CraftLine({ facts }: { facts?: string[] }) {
  if (!facts?.length) return null;
  return (
    <p style={{ margin: "6px 2px 0", fontSize: 11.5, color: text.muted, lineHeight: 1.5 }}>
      {facts.join(" · ")}
    </p>
  );
}

function Matchup({ m }: { m: CopyMatchup }) {
  return (
    <div style={{ marginTop: 16, borderTop: line.hairline, paddingTop: 14 }}>
      <p style={{ margin: 0, fontSize: 11.5, letterSpacing: "0.1em", textTransform: "uppercase", color: text.muted, fontWeight: 700 }}>
        The {m.angle} angle &middot; yours ranks {m.theirRank === 1 ? "first" : `${m.theirRank} of ${2}`}
      </p>
      <div style={{ display: "grid", gap: 14, gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", marginTop: 10 }}>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11, color: "#ae4826", fontWeight: 800, letterSpacing: "0.06em" }}>
            YOURS{m.theirs.daysRunning !== null ? ` · ${m.theirs.daysRunning} days running` : ""}
          </p>
          <div style={{ border: "2px solid #d35e36", borderRadius: 14, padding: 2 }}>
            <GoogleAd advertiser={m.theirs.domain ?? "Your ad"} domain={m.theirs.domain} headline={m.theirs.headline} description={m.theirs.description} />
          </div>
          <CraftLine facts={m.theirs.facts} />
        </div>
        <div>
          <p style={{ margin: "0 0 6px", fontSize: 11, color: text.muted, fontWeight: 800, letterSpacing: "0.06em" }}>
            {m.best.advertiser.toUpperCase()} &middot; {m.best.daysRunning} DAYS RUNNING
          </p>
          <div style={{ padding: 2 }}>
            <GoogleAd advertiser={m.best.advertiser} domain={m.best.domain} headline={m.best.headline} description={m.best.description} />
          </div>
          <CraftLine facts={m.best.facts} />
        </div>
      </div>
      {/* The verdict stays SHORT (Jono, 1 September 2026): pass/fail pills,
          then the gap sentence as one highlighted line. The full per-quality
          notes live in the data for the call, never on the page. */}
      <div style={{ display: "flex", gap: 6, flexWrap: "wrap", marginTop: 12 }}>
        {m.qualities.map((q) => (
          <span
            key={q.name}
            title={q.note}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 5,
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 11.5,
              fontWeight: 600,
              background: q.passes ? "#ecfdf3" : "#fef3f2",
              color: q.passes ? "#067647" : "#b42318",
            }}
          >
            {q.passes ? <Check size={11} aria-hidden /> : <X size={11} aria-hidden />}
            {q.passes ? q.name : `not ${q.name}`}
          </span>
        ))}
      </div>
      <p style={{ margin: "10px 0 0", fontSize: 13, color: text.body, lineHeight: 1.55, background: "#fef6f3", borderLeft: "3px solid #d35e36", borderRadius: 8, padding: "10px 12px" }}>
        {m.gap}
      </p>
    </div>
  );
}

export function CopyAudit({ exhibit }: { exhibit: CopyAuditExhibit }) {
  return (
    <div style={{ background: "#fff", border: line.hairline, borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <PenLine size={12} aria-hidden /> Your words against theirs
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 800, color: text.strong, lineHeight: 1.4 }}>{exhibit.headline}</p>

      {exhibit.matchups.map((m) => (
        <Matchup key={m.angle} m={m} />
      ))}

      {exhibit.emptyAngles.length > 0 ? (
        <p style={{ margin: "14px 0 0", fontSize: 12.5, color: text.body, borderTop: line.hairline, paddingTop: 12, lineHeight: 1.55 }}>
          <strong>Nobody in this market runs:</strong> {exhibit.emptyAngles.join(" · ")}. That is the open lane.
        </p>
      ) : null}
    </div>
  );
}
