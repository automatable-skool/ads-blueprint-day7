// The image trust read - the pictures inside their ads and their competitors',
// judged on whether a stranger would believe a real business took the photo.
// "AI" is asserted only when Google's own disclosure panel says so; everything
// else is a read, printed as one, with the tells named.
import { ImageIcon } from "lucide-react";
import type { AdImageExhibit } from "../types";
import { text, line } from "../ui";

const verdictLabel: Record<string, { label: string; color: string }> = {
  real: { label: "Real photo", color: "#067647" },
  stock: { label: "Stock image", color: "#b54708" },
  ai: { label: "AI generated", color: "#b42318" },
  illustration: { label: "Illustration", color: "#b54708" },
  unknown: { label: "Unclear", color: "#73726e" },
};

export function AdImages({ exhibit }: { exhibit: AdImageExhibit }) {
  return (
    <div style={{ background: "#fff", border: line.hairline, borderRadius: 14, padding: 18, boxShadow: "0 1px 3px rgba(16,24,40,.06)" }}>
      <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.18em", textTransform: "uppercase", color: text.muted, fontWeight: 700, display: "flex", alignItems: "center", gap: 6 }}>
        <ImageIcon size={12} aria-hidden /> The pictures in the ads
      </p>
      <p style={{ margin: "8px 0 0", fontSize: 14.5, fontWeight: 800, color: text.strong, lineHeight: 1.4 }}>{exhibit.headline}</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))", gap: 12, marginTop: 12 }}>
        {exhibit.items.map((item) => {
          const v = verdictLabel[item.verdict];
          return (
            <div key={`${item.advertiser}-${item.imageUrl}`} style={{ border: item.isClient ? "2px solid #d35e36" : line.hairline, borderRadius: 12, overflow: "hidden" }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={item.imageUrl} alt={`Ad image run by ${item.advertiser}`} style={{ width: "100%", aspectRatio: "4/3", objectFit: "cover", display: "block" }} />
              <div style={{ padding: "8px 10px" }}>
                <p style={{ margin: 0, fontSize: 12, fontWeight: 700, color: text.strong }}>
                  {item.advertiser}
                  {item.isClient ? " (you)" : ""}
                </p>
                <p style={{ margin: "3px 0 0", fontSize: 12, fontWeight: 700, color: v.color }}>
                  {v.label}
                  {item.verdict === "ai" && item.basis === "disclosed" ? " - Google's own disclosure" : ""}
                  {item.basis === "read" && item.verdict !== "unknown" ? " - our read" : ""}
                  {" "}&middot; {item.quality === "high" ? "well made" : "low quality"}
                </p>
                {item.tells.length > 0 ? (
                  <p style={{ margin: "3px 0 0", fontSize: 11.5, color: text.muted, lineHeight: 1.45 }}>{item.tells.join(" · ")}</p>
                ) : null}
                <p style={{ margin: "5px 0 0", fontSize: 11.5, color: text.body, lineHeight: 1.45 }}>{item.readout}</p>
              </div>
            </div>
          );
        })}
      </div>
      <p style={{ margin: "14px 0 0", fontSize: 12.5, color: text.muted, borderTop: line.hairline, paddingTop: 12, lineHeight: 1.55 }}>{exhibit.note}</p>
    </div>
  );
}
