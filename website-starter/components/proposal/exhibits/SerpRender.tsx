// The search they are losing: a faithful render of the LIVE Google result.
// Real titles, real domains, real positions - it reads like Google because the
// data IS Google's. Nothing invented, nothing reordered.
//
// The red band at the bottom is the most persuasive thing on the page and it
// costs nothing to prove: we say what we searched, where we searched it from,
// and that they were not there.
import type { SerpExhibit } from "../types";

const G_FONT = "arial, sans-serif";

export function SerpRender({ data }: { data: SerpExhibit }) {
  return (
    <div style={{ margin: 0, borderRadius: 16, overflow: "hidden", background: "#fff", fontFamily: G_FONT, border: "1px solid #e3e2de", boxShadow: "0 8px 30px rgba(16,24,40,.10)" }}>
      {/* Search bar */}
      <div style={{ padding: "16px 20px 12px", borderBottom: "1px solid #ebebeb" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 12, border: "1px solid #dfe1e5", borderRadius: 24, padding: "10px 16px", boxShadow: "0 1px 6px rgba(32,33,36,.12)" }}>
          <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="#9aa0a6" strokeWidth="2" strokeLinecap="round" aria-hidden style={{ flexShrink: 0 }}>
            <circle cx="11" cy="11" r="7" />
            <path d="m20 20-3.8-3.8" />
          </svg>
          <span style={{ color: "#202124", fontSize: 15, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{data.keyword}</span>
        </div>
        <p style={{ margin: "10px 0 0", fontSize: 11.5, color: "#70757a", fontFamily: "var(--font-core, sans-serif)" }}>
          {data.searchedFrom}
        </p>
      </div>

      <div style={{ padding: "16px 20px 4px" }}>
        {data.rows.map((r) => (
          <div key={`${r.position}-${r.domain}`} style={{ margin: "0 0 20px", background: r.isClient ? "#fef6f3" : "transparent", borderRadius: 8, padding: r.isClient ? "8px 10px" : 0 }}>
            {r.isAd ? (
              <p style={{ margin: "0 0 6px", color: "#202124", fontSize: 12.5, fontWeight: 700 }}>Sponsored</p>
            ) : null}
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={`https://www.google.com/s2/favicons?domain=${r.domain.replace(/^www\./, "")}&sz=32`}
                alt=""
                width={24}
                height={24}
                style={{ borderRadius: 999, border: "1px solid #ebebeb", background: "#f1f3f4", padding: 3, flexShrink: 0 }}
              />
              <span style={{ minWidth: 0 }}>
                <span style={{ display: "block", color: "#202124", fontSize: 13, lineHeight: 1.25 }}>
                  {r.domain.replace(/^www\./, "")}
                </span>
                <span style={{ display: "block", color: "#4d5156", fontSize: 11.5, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {r.breadcrumb ?? r.domain}
                </span>
              </span>
            </div>
            <span style={{ display: "block", color: "#1a0dab", fontSize: 17, lineHeight: 1.3, margin: "6px 0 3px" }}>
              {r.title}
            </span>
          </div>
        ))}
      </div>

      {data.clientAbsent ? (
        <p style={{ margin: 0, padding: "14px 20px", background: "#fdedec", color: "#b52d24", fontWeight: 700, fontSize: 14.5, lineHeight: 1.5, fontFamily: "var(--font-core, sans-serif)" }}>
          {data.clientAbsent}
        </p>
      ) : null}
      {data.note ? (
        <p style={{ margin: 0, padding: "10px 20px", color: "#73726e", fontSize: 13, lineHeight: 1.5, borderTop: "1px solid #e3e2de", fontFamily: "var(--font-core, sans-serif)" }}>
          {data.note}
        </p>
      ) : null}
    </div>
  );
}
