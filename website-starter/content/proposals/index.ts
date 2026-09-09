// Local registry of proposals - the fallback lane, used only when no Supabase
// keys are set. In production /proposal writes ONE ROW to the Supabase
// `proposals` table and never touches this file.
//
// Empty on purpose. The fictional Acme Plumbing example that used to live here
// was deleted on 1 September 2026: it was built on the old "we read your
// account" waste-number model, which the current blueprint bans outright.
// ⛔ ZERO ACCESS - a proposal is never a reading of the prospect's ad account.
//
// Add a local one: create <slug>.ts next to this file, matching ProposalData,
// and register it below.
import type { ProposalData } from "@/components/proposal/types";

export const proposals: Record<string, ProposalData> = {};
