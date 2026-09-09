// Where a proposal's data comes from. Server-only - never import from a
// "use client" file, and never prefix the Supabase keys with NEXT_PUBLIC_.
//
// Two sources, checked in this order:
//   1. Supabase, when SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY are set in .env.
//      One row per client in the `proposals` table, read at request time, so
//      editing a row shows on the next page load with no rebuild. This is the
//      production path /proposal writes to.
//   2. The local registry in content/proposals/ - for previewing the chassis
//      and for a first proposal before Supabase is wired.
//
// Reads go straight to Supabase's REST endpoint with fetch, so no SDK is needed.
import type { ProposalData } from "@/components/proposal/types";
import { proposals as localProposals } from "@/content/proposals";

const SLUG_RE = /^[a-z0-9-]{3,80}$/;

export async function getProposal(slug: string): Promise<ProposalData | null> {
  if (!SLUG_RE.test(slug)) return null;

  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (url && key) {
    try {
      const res = await fetch(
        `${url.replace(/\/$/, "")}/rest/v1/proposals?slug=eq.${encodeURIComponent(slug)}&select=data,expires_at&limit=1`,
        {
          headers: { apikey: key, Authorization: `Bearer ${key}` },
          cache: "no-store",
        },
      );
      if (!res.ok) return null;
      const rows = (await res.json()) as { data: ProposalData; expires_at: string | null }[];
      const row = rows[0];
      if (!row) return null;
      return row.data;
    } catch {
      // A failed read is a 404, never an error page that reveals why.
      return null;
    }
  }

  return localProposals[slug] ?? null;
}
