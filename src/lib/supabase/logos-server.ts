import { createClient } from '@/lib/supabase/server'
import type { Match, StandingRow } from '@/types'
import { normTeam } from '@/lib/tff'

/** map → normalize anahtarlı yardımcı harita (isim varyasyonları için) */
function normMapOf(map: Record<string, string>): Record<string, string> {
  const out: Record<string, string> = {}
  for (const [k, v] of Object.entries(map)) { if (v) out[normTeam(k)] = v }
  return out
}

/**
 * Sunucu tarafında kayıtlı takım logolarını Supabase'den okur.
 * Hata olursa boş döner (site yine de çalışır).
 */
export async function getTeamLogoMap(): Promise<Record<string, string>> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('team_logos').select('team_name, logo_url')
    if (error || !data) return {}
    return Object.fromEntries(
      data.filter((r) => r.logo_url).map((r) => [r.team_name, r.logo_url as string])
    )
  } catch {
    return {}
  }
}

/** Puan tablosu satırlarına kayıtlı logoları uygular (normalize eşleşmeli) */
export function applyLogosToStandings(rows: StandingRow[], map: Record<string, string>): StandingRow[] {
  if (!Object.keys(map).length) return rows
  const nm = normMapOf(map)
  return rows.map((r) => {
    const hit = map[r.team] || nm[normTeam(r.team)]
    return hit ? { ...r, teamLogo: hit } : r
  })
}

/** Maçlara kayıtlı logoları uygular (ev + deplasman, normalize eşleşmeli) */
export function applyLogosToMatches(matches: Match[], map: Record<string, string>): Match[] {
  if (!Object.keys(map).length) return matches
  const nm = normMapOf(map)
  return matches.map((m) => ({
    ...m,
    homeTeamLogo: map[m.homeTeam] || nm[normTeam(m.homeTeam)] || m.homeTeamLogo,
    awayTeamLogo: map[m.awayTeam] || nm[normTeam(m.awayTeam)] || m.awayTeamLogo,
  }))
}
