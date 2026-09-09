// 02 - What this is costing you. The prospect DRAGS every input and the number
// moves. Nothing here reads their ad account; each slider is labelled with
// where its starting value came from, and they are free to disagree with it.
// A number someone set themselves is a number they argue for on the call.
"use client";

import { useMemo, useState } from "react";
import { CircleDollarSign } from "lucide-react";
import type { ProposalData, RevenueInput } from "./types";
import { Section, d } from "./ui";

const money = (n: number) =>
  `$${Math.round(n).toLocaleString("en-US")}`;

function display(input: RevenueInput, value: number) {
  if (input.role === "value") return money(value);
  if (input.role === "rate") return `${+(value * 100).toFixed(1)}%`;
  return Math.round(value).toLocaleString("en-US");
}

export function CostOfInaction({ data }: { data: ProposalData }) {
  const m = data.missedRevenue;
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(m.inputs.map((i) => [i.key, i.value]))
  );

  const { monthly, yearly, units } = useMemo(() => {
    const get = (i: RevenueInput) => values[i.key] ?? i.value;
    const volume = m.inputs.filter((i) => i.role === "volume").reduce((a, i) => a * get(i), 1);
    const rate = m.inputs.filter((i) => i.role === "rate").reduce((a, i) => a * get(i), 1);
    const value = m.inputs.filter((i) => i.role === "value").reduce((a, i) => a * get(i), 1);
    const u = volume * rate;
    return { monthly: u * value, yearly: u * value * 12, units: u };
  }, [values, m.inputs]);

  const reset = () => setValues(Object.fromEntries(m.inputs.map((i) => [i.key, i.value])));
  const touched = m.inputs.some((i) => (values[i.key] ?? i.value) !== i.value);

  return (
    <Section
      number="02"
      kicker="Where you stand"
      title="What this is costing you"
      lead={m.accessNote}
      icon={<CircleDollarSign size={15} />}
      panel
    >
      <div className="pp-card pp-glow" style={{ padding: "clamp(26px, 4.5vw, 42px)" }}>
        <div style={{ display: "flex", gap: "28px 56px", flexWrap: "wrap", alignItems: "flex-start" }}>
          {/* The number, live */}
          <div style={{ flex: "1 1 240px" }}>
            <p style={{ margin: 0, fontSize: 11, letterSpacing: "0.2em", textTransform: "uppercase", color: d.faint }}>
              {m.headline}
            </p>
            <p
              aria-live="polite"
              style={{ margin: "6px 0 0", fontWeight: 900, fontSize: "clamp(46px, 7.5vw, 72px)", lineHeight: 1, letterSpacing: "-0.03em", color: d.accent, fontVariantNumeric: "tabular-nums" }}
            >
              {money(monthly)}
              <span style={{ fontSize: "0.3em", fontWeight: 700, color: d.muted }}> /month</span>
            </p>
            <p style={{ margin: "12px 0 0", color: d.body, fontSize: 15 }}>
              {money(yearly)} over a year, at today&rsquo;s search volume.
            </p>
            <p style={{ margin: "6px 0 0", color: d.muted, fontSize: 13.5 }}>
              That is <strong style={{ color: d.text }}>{Math.floor(units)} {m.unitLabel}
              {Math.floor(units) === 1 ? "" : "s"}</strong> a month you are not getting.
            </p>
          </div>

          {/* The arithmetic, adjustable. CONDENSED (Jono, 2 September 2026):
              one line per input - value, slider, short label - sources live in
              the footer line, and the helper text is three words. */}
          <div style={{ flex: "1 1 340px", maxWidth: 480 }}>
            <p style={{ margin: "0 0 6px", fontSize: 12, color: d.faint }}>
              Drag any number - the total moves.
            </p>
            {m.inputs.map((input) => {
              const v = values[input.key] ?? input.value;
              return (
                <div key={input.key} style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap", padding: "7px 0", borderBottom: "1px solid #efedea" }}>
                  <span style={{ color: d.text, fontWeight: 800, fontSize: 15, minWidth: 64, fontVariantNumeric: "tabular-nums" }}>
                    {display(input, v)}
                  </span>
                  <input
                    id={`rev-${input.key}`}
                    aria-label={input.label}
                    type="range"
                    min={input.min}
                    max={input.max}
                    step={input.step}
                    value={v}
                    onChange={(e) => setValues((s) => ({ ...s, [input.key]: Number(e.target.value) }))}
                    style={{ flex: "1 1 110px", margin: 0, accentColor: d.accent, height: 18 }}
                  />
                  <label htmlFor={`rev-${input.key}`} style={{ color: d.muted, fontSize: 12, flex: "1 1 44%", lineHeight: 1.35 }}>
                    {input.label}
                  </label>
                </div>
              );
            })}
            <div style={{ display: "flex", gap: 12, alignItems: "center", marginTop: 8, flexWrap: "wrap" }}>
              <p style={{ margin: 0, fontSize: 12, color: d.faint, flex: "1 1 260px", lineHeight: 1.5 }}>{m.note}</p>
              {touched ? (
                <button
                  type="button"
                  onClick={reset}
                  style={{ background: "none", border: "1px solid #e3e2de", borderRadius: 8, padding: "6px 10px", color: d.muted, fontSize: 12, cursor: "pointer", whiteSpace: "nowrap" }}
                >
                  Reset
                </button>
              ) : null}
            </div>
          </div>
        </div>
      </div>
      <p style={{ color: d.faint, margin: "12px 0 0", fontSize: 13 }}>{m.sourcesLine}</p>
    </Section>
  );
}
