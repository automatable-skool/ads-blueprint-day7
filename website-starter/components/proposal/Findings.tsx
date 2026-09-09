// 03 - The findings. Two-column up top: the paid-presence chart and the
// tracking read on the left, the SERP render sticky on the right. Then the
// landing-page block and the copy matchup full width. The ranked findings
// list closes the section - the exhibits make the case first, the list sums
// it up last (Jono's ordering, 1 September 2026).
// Real pulled data or a named gap - never a fake.
import { Search } from "lucide-react";
import type { ProposalData, Finding } from "./types";
import { Section, Alert, d } from "./ui";
import { SerpRender } from "./exhibits/SerpRender";
import { PaidPresence } from "./exhibits/PaidPresence";
import { LandingShot } from "./exhibits/LandingShot";
import { Tracking } from "./exhibits/Tracking";
import { AdImages } from "./exhibits/AdImages";
import { CopyAudit } from "./exhibits/CopyAudit";
import { ProofUnused } from "./exhibits/ProofUnused";

const dot: Record<Finding["status"], string> = {
  positive: "#0d9668",
  caution: "#c26f09",
  critical: "#d93a2f",
};

export function Findings({ data }: { data: ProposalData }) {
  const f = data.findings;
  return (
    <Section
      number="03"
      kicker="Where you stand"
      title="The findings"
      lead="Everything below is visible from outside - your live ads, the search results page, your own website. We have not seen your account, and nothing here pretends we have."
      icon={<Search size={15} />}
    >
      <div className="pp-findings-grid">
        {/* LEFT - the deeper reads (Jono, 1 September 2026: never full width) */}
        <div style={{ display: "grid", gap: 18, alignContent: "start" }}>
          {f.paidPresence ? <PaidPresence data={f.paidPresence} /> : null}
          {f.tracking ? <Tracking exhibit={f.tracking} /> : null}
        </div>

        {/* RIGHT - the Google-look exhibit. The SERP render ONLY: the
            competitor-ads card was cut on 1 September 2026 (Jono) - beside the
            SERP it read as the same graphic twice, and the SERP is the one he
            kept. Competitor copy still shows up in the matchup below. */}
        <div className="pp-findings-right" style={{ display: "grid", gap: 18 }}>
          {f.serp ? <SerpRender data={f.serp} /> : null}
        </div>
      </div>

      {/* FULL WIDTH - the landing page block, the copy matchup, then the
          ranked findings list at the BOTTOM of the section (Jono, 1 September
          2026): the exhibits argue, the list concludes.
          ⛔ The page-scored (CRO) card was DELETED on 1 September 2026 (Jono):
          it repeated what the landing-page card already shows. Its data stays
          in the pull; it just does not render as its own section. */}
      <div style={{ display: "grid", gap: 18, marginTop: 18 }}>
        {f.landingShot ? <LandingShot exhibit={f.landingShot} /> : null}
        {f.copyAudit ? <CopyAudit exhibit={f.copyAudit} /> : null}
        {f.unusedProof ? <ProofUnused exhibit={f.unusedProof} /> : null}
        {f.adImages ? <AdImages exhibit={f.adImages} /> : null}

        <div className="pp-card" style={{ padding: "6px 22px" }}>
          {f.items.map((it, i) => (
            <div key={it.text} style={{ borderTop: i === 0 ? "none" : d.hairline, padding: "16px 0", display: "grid", gridTemplateColumns: "18px 1fr", gap: 12 }}>
              <span aria-hidden style={{ width: 10, height: 10, borderRadius: 999, background: dot[it.status], marginTop: 7 }} />
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap", alignItems: "baseline" }}>
                  <span style={{ color: d.accent, fontWeight: 900, fontSize: 18, fontVariantNumeric: "tabular-nums" }}>{it.dollars}</span>
                  <span style={{ color: d.muted, fontSize: 12.5, fontWeight: 700, letterSpacing: "0.06em", textTransform: "uppercase" }}>{it.fix}</span>
                </div>
                <p style={{ color: d.body, fontSize: 15, lineHeight: 1.6, margin: "6px 0 0" }}>{it.text}</p>
              </div>
            </div>
          ))}
        </div>

        {f.missing?.length ? (
          <div style={{ display: "grid", gap: 10 }}>
            {f.missing.map((m) => (
              <Alert key={m} tone="info">{m}</Alert>
            ))}
          </div>
        ) : null}
      </div>
    </Section>
  );
}
