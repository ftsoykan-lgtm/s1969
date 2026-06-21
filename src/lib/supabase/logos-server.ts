import { createClient } from '@/lib/supabase/server'
import type { Match, StandingRow } from '@/types'

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

/** Puan tablosu satırlarına kayıtlı logoları uygular */
export function applyLogosToStandings(rows: StandingRow[], map: Record<string, string>): StandingRow[] {
  if (!Object.keys(map).length) return rows
  return rows.map((r) => (map[r.team] ? { ...r, teamLogo: map[r.team] } : r))
}

/** Maçlara kayıtlı logoları uygular (ev + deplasman) */
export function applyLogosToMatches(matches: Match[], map: Record<string, string>): Match[] {
  if (!Object.keys(map).length) return matches
  return matches.map((m) => ({
    ...m,
    homeTeamLogo: map[m.homeTeam] ?? m.homeTeamLogo,
    awayTeamLogo: map[m.awayTeam] ?? m.awayTeamLogo,
  }))
}
