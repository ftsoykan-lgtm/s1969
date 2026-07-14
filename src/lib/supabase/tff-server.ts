import { cache } from 'react'
import { createClient } from '@/lib/supabase/public'
import {
  buildStandings, buildMatches, buildMeta, buildSquad, staticRaw, normTeam, matchSlug, type TffRaw, type TffSquad,
} from '@/lib/tff'
import type { Match, StandingRow } from '@/types'

const US_NORM = normTeam('Şanlıurfaspor')
import archive20252026 from '@/data/tff-2025-2026.json'

/* Statik sezon arşivleri — DB arşivi bozuk/eksikse yedek olarak kullanılır.
   2025-2026 puan tablosu eski scraper hatasıyla DB'de bozulmuştu; TFF geçmiş
   sezon tablosunu artık sunmadığından, git anlık görüntüsünden (doğru 932 puanlı
   final tablo) buraya paketlendi. Sunucu-only bundle; istemciye gitmez. */
const STATIC_ARCHIVES: Record<string, TffRaw> = {
  '2025-2026': archive20252026 as unknown as TffRaw,
}

/** DB arşiv verisi bozuk mu? Oynanmış maç var ama puan tablosu tümüyle sıfır/boşsa. */
function isArchiveCorrupt(raw: TffRaw | null | undefined): boolean {
  if (!raw) return true
  const played = (raw.sanliurfasporFixtures ?? []).some((f) => f.homeScore != null)
  const standingsHaveData = (raw.standings ?? []).some((s) => (s.points || 0) > 0 || (s.played || 0) > 0)
  return played && !standingsHaveData
}

/**
 * TFF verisini ÖNCE Supabase tff_data tablosundan (canlı, GitHub Actions
 * günceller) okur; yoksa/başarısızsa build-time JSON'a (yedek) düşer.
 * React cache() ile istek başına tekilleştirilir.
 */
export const getLiveTff = cache(async (): Promise<{
  standings: StandingRow[]
  matches: Match[]
  meta: ReturnType<typeof buildMeta>
  squad: TffSquad
}> => {
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
})

/* ─── Sezon arşivi (tff_seasons) ───────────────────────────────── */

/** Arşivdeki sezonların listesi (yeniden eskiye) */
export const getSeasons = cache(async (): Promise<string[]> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_seasons')
      .select('season')
      .order('season', { ascending: false })
    const dbSeasons = error || !data ? [] : data.map((r) => r.season as string)
    // Statik yedeği olan sezonlar da listede olsun (yeniden eskiye)
    return Array.from(new Set([...dbSeasons, ...Object.keys(STATIC_ARCHIVES)]))
      .sort((a, b) => b.localeCompare(a))
  } catch {
    return Object.keys(STATIC_ARCHIVES)
  }
})

/** Belirli bir sezonun verisi (geçmiş sezon görüntüleme); yoksa null */
export const getTffBySeason = cache(async (season: string): Promise<{
  standings: StandingRow[]
  matches: Match[]
  meta: ReturnType<typeof buildMeta>
  squad: TffSquad
} | null> => {
  let raw: TffRaw | null = null
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_seasons')
      .select('data')
      .eq('season', season)
      .single()
    if (!error && data?.data) raw = data.data as TffRaw
  } catch {
    raw = null
  }
  // DB arşivi yok ya da bozuksa (puan tablosu sıfırlanmış) statik yedeğe düş
  if (isArchiveCorrupt(raw) && STATIC_ARCHIVES[season]) raw = STATIC_ARCHIVES[season]
  if (!raw) return null
  return {
    standings: buildStandings(raw),
    matches: buildMatches(raw),
    meta: buildMeta(raw),
    squad: buildSquad(raw),
  }
})

/** macId ile maçı bul — ÖNCE güncel sezon, sonra arşiv sezonları (yeniden eskiye).
 *  Geçmiş sezon maçları arşivde olduğu için /mac/[macId] artık 404 vermez. */
export const findMatchByMacId = cache(async (macId: string): Promise<Match | null> => {
  const live = await getLiveTff()
  const inLive = live.matches.find((m) => m.macId === macId)
  if (inLive) return inLive
  const seasons = await getSeasons()
  for (const s of seasons) {
    const arch = await getTffBySeason(s)
    const m = arch?.matches.find((x) => x.macId === macId)
    if (m) return m
  }
  return null
})

/** URL slug ile maçı bul (güncel + arşiv). Yeni kanonik slug (takım-vs-takım-tarih)
 *  ile tam eşleşme; bulunamazsa eski ID'li URL'ler için sondaki sayıyı macId olarak
 *  dener (geriye dönük uyumluluk → sayfa kanonik URL'e yönlendirir). */
export const findMatchBySlug = cache(async (param: string): Promise<Match | null> => {
  const slug = decodeURIComponent(param || '').replace(/\/+$/, '')
  const live = await getLiveTff()
  const seasons = await getSeasons()
  const archived = await Promise.all(seasons.map((s) => getTffBySeason(s)))
  const all = [...live.matches, ...archived.flatMap((a) => a?.matches ?? [])]
  const bySlug = all.find((m) => matchSlug(m) === slug)
  if (bySlug) return bySlug
  const idMatch = slug.match(/(\d+)$/)
  if (idMatch) {
    const byId = all.find((m) => m.macId === idMatch[1])
    if (byId) return byId
  }
  return null
})

/** Şanlıurfaspor'un belirli bir rakibe karşı TÜM karşılaşmaları (güncel + arşiv),
 *  en yeni üstte. Sponsor öneki/isim farklarına dayanıklı (normalize eşleşme). */
export const getMatchesVsOpponent = cache(async (opponent: string): Promise<Match[]> => {
  const oppNorm = normTeam(opponent)
  if (!oppNorm || oppNorm === US_NORM) return []
  const [live, seasons] = await Promise.all([getLiveTff(), getSeasons()])
  const archived = await Promise.all(seasons.map((s) => getTffBySeason(s)))
  const all = [...live.matches, ...archived.flatMap((a) => a?.matches ?? [])]
  const seen = new Set<string>()
  const out: Match[] = []
  for (const m of all) {
    const hn = normTeam(m.homeTeam), an = normTeam(m.awayTeam)
    const hasUs = hn === US_NORM || an === US_NORM
    const other = hn === US_NORM ? an : hn
    if (!hasUs || other !== oppNorm) continue
    const key = m.macId || `${m.date}|${hn}|${an}`
    if (seen.has(key)) continue
    seen.add(key)
    out.push(m)
  }
  return out.sort((a, b) => (b.date || '').localeCompare(a.date || ''))
})
