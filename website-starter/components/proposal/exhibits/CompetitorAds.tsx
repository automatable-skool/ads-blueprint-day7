// The competitor ads exhibit - their LIVE ads from the Ads Transparency
// Center, rendered the way Google renders a text ad, longest-running first.
// Real copy only. An ad that has run 300 days is an ad that pays; that is the
// whole argument of this card.
import { Phone } from "lucide-react";
import type { CompetitorAdsExhibit } from "../types";
import { text, line } from "../ui";

export function CompetitorAds({ exhibit }: { exhibit: CompetitorAdsExhibit }) {
  const ads = [...exhibit.ads].sort((a, b) => b.daysRunning - a.daysRunning).slice(0, 4);
  return (
    <div style={{ background: "#fff", border: line.hairline, borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700 }}>
        Who is buying &ldquo;{exhibit.keyword}&rdquo; right now
      </p>
      <div style={{ display: "grid", gap: 12, marginTop: 14 }}>
        {ads.map((ad) => (
          <div key={`${ad.advertiser}-${ad.headline}`} style={{ borderTop: line.hairline, paddingTop: 12 }}>
            <div style={{ display: "flex", justifyContent: "space-between", gap: 10, alignItems: "baseline" }}>
              <span style={{ fontSize: 12, color: text.muted, fontWeight: 700 }}>
                <span style={{ color: text.strong }}>Sponsored</span> &middot; {ad.advertiser}
              </span>
              <span style={{ fontSize: 12, color: text.muted, whiteSpace: "nowrap" }}>{ad.daysRunning} days running</span>
            </div>
            <p style={{ margin: "4px 0 0", color: "#202124", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12.5 }}>{ad.displayUrl}</p>
            <p style={{ margin: "2px 0 0", color: "#1a0dab", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 17, lineHeight: 1.3 }}>{ad.headline}</p>
            {ad.rating ? (
              <p style={{ margin: "2px 0 0", color: "#4d5156", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12.5 }}>
                <span style={{ color: "#fbbc04" }}>{"★".repeat(Math.round(ad.rating.stars))}</span> {ad.rating.stars} ({ad.rating.count})
              </p>
            ) : null}
            {ad.description ? (
              <p style={{ margin: "3px 0 0", color: "#4d5156", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13.5, lineHeight: 1.5 }}>{ad.description}</p>
            ) : null}
            {ad.callouts?.length ? (
              <p style={{ margin: "3px 0 0", color: "#4d5156", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 12.5 }}>{ad.callouts.join(" · ")}</p>
            ) : null}
            {ad.sitelinks?.length ? (
              <p style={{ margin: "5px 0 0", color: "#1a0dab", fontFamily: "Arial, Helvetica, sans-serif", fontSize: 13 }}>
                {ad.sitelinks.map((sl, i) => (
                  <span key={sl}>{i > 0 ? <span style={{ color: "#4d5156" }}> &middot; </span> : null}{sl}</span>
                ))}
              </p>
            ) : null}
            {ad.hasCallAsset ? (
              <p style={{ margin: "6px 0 0", display: "inline-flex", alignItems: "center", gap: 6, fontSize: 12.5, color: "#1a0dab", fontFamily: "Arial, Helvetica, sans-serif" }}>
                <Phone size={12} aria-hidden /> Call
              </p>
            ) : null}
          </div>
        ))}
      </div>
      <p style={{ margin: "14px 0 0", fontSize: 13, color: text.body, borderTop: line.hairline, paddingTop: 12 }}>{exhibit.readout}</p>
    </div>
  );
}
