import { createClient } from '@/lib/supabase/public'
import {
  buildStandings, buildMatches, buildMeta, buildSquad, staticRaw, type TffRaw, type TffSquad,
} from '@/lib/tff'
import type { Match, StandingRow } from '@/types'

/**
 * TFF verisini ÖNCE Supabase tff_data tablosundan (canlı, GitHub Actions
 * günceller) okur; yoksa/başarısızsa build-time JSON'a (yedek) düşer.
 */
export async function getLiveTff(): Promise<{
  standings: StandingRow[]
  matches: Match[]
  meta: ReturnType<typeof buildMeta>
  squad: TffSquad
}> {
  let raw: TffRaw = staticRaw
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_data')
      .select('data')
      .eq('id', 1)
      .single()
    if (!error && data?.data && (data.data as TffRaw).standings?.length) {
      raw = data.data as TffRaw
    }
  } catch {
    // sessizce yedek veriye düş
  }
  // Kadro Supabase'de henüz yoksa statik yedekten al
  let squad = buildSquad(raw)
  if (!squad.players.length) squad = buildSquad(staticRaw)
  return {
    standings: buildStandings(raw),
    matches: buildMatches(raw),
    meta: buildMeta(raw),
    squad,
  }
}

/* ─── Sezon arşivi (tff_seasons) ───────────────────────────────── */

/** Arşivdeki sezonların listesi (yeniden eskiye) */
export async function getSeasons(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_seasons')
      .select('season')
      .order('season', { ascending: false })
    if (error || !data) return []
    return data.map((r) => r.season as string)
  } catch {
    return []
  }
}

/** Belirli bir sezonun verisi (geçmiş sezon görüntüleme); yoksa null */
export async function getTffBySeason(season: string): Promise<{
  standings: StandingRow[]
  matches: Match[]
  meta: ReturnType<typeof buildMeta>
  squad: TffSquad
} | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_seasons')
      .select('data')
      .eq('season', season)
      .single()
    if (error || !data?.data) return null
    const raw = data.data as TffRaw
    return {
      standings: buildStandings(raw),
      matches: buildMatches(raw),
      meta: buildMeta(raw),
      squad: buildSquad(raw),
    }
  } catch {
    return null
  }
}
