import { createClient } from '@/lib/supabase/server'
import { getLiveTff } from '@/lib/supabase/tff-server'

export interface ProfilePlayer {
  id: number
  season: string
  tffId: string | null
  slug: string
  name: string
  position: string | null
  number: number | null
  birthDate: string | null
  birthPlace: string | null
  nationality: string | null
  flagCode: string | null
  licenseNo: string | null
  club: string | null
  photoUrl: string | null     // admin foto > TFF foto
  bio: string | null
  height: string | null
  weight: string | null
  prevTeam: string | null
  description: string | null
  instagram: string | null
  twitter: string | null
  active: boolean
  manual: boolean
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function map(r: any): ProfilePlayer {
  return {
    id: r.id, season: r.season, tffId: r.tff_id ?? null, slug: r.slug, name: r.name,
    position: r.position ?? null, number: r.number ?? null, birthDate: r.birth_date ?? null,
    birthPlace: r.birth_place ?? null,
    nationality: r.nationality ?? null, flagCode: r.flag_code ?? null, licenseNo: r.license_no ?? null,
    club: r.club ?? null,
    photoUrl: r.photo || r.photo_tff || null,
    bio: r.bio ?? null, height: r.height ?? null, weight: r.weight ?? null,
    prevTeam: r.prev_team ?? null, description: r.description ?? null,
    instagram: r.instagram ?? null, twitter: r.twitter ?? null,
    active: r.active ?? true, manual: r.manual ?? false,
  }
}

/** Güncel sezon (TFF meta) */
export async function currentSeason(): Promise<string | null> {
  try { const { meta } = await getLiveTff(); return meta.season ?? null } catch { return null }
}

/** Bir sezonun aktif oyuncuları (sezon verilmezse güncel sezon) */
export async function getSeasonPlayers(season?: string): Promise<{ players: ProfilePlayer[]; season: string | null }> {
  const s = season ?? (await currentSeason())
  if (!s) return { players: [], season: null }
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('season', s)
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('number', { ascending: true, nullsFirst: false })
      .order('name', { ascending: true })
    if (error || !data) return { players: [], season: s }
    return { players: data.map(map), season: s }
  } catch {
    return { players: [], season: s }
  }
}

/** Profil sayfası: slug ile (en güncel sezon) + o oyuncunun bulunduğu sezon listesi */
export async function getPlayerProfile(slug: string, season?: string): Promise<{ player: ProfilePlayer | null; seasons: string[] }> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('player_profiles')
      .select('*')
      .eq('slug', slug)
      .order('season', { ascending: false })
    if (error || !data || !data.length) return { player: null, seasons: [] }
    const seasons = data.map((r) => r.season as string)
    const row = season ? data.find((r) => r.season === season) ?? data[0] : data[0]
    return { player: map(row), seasons }
  } catch {
    return { player: null, seasons: [] }
  }
}

/** Profil tablosundaki sezonlar (yeniden eskiye) */
export async function getProfileSeasonsServer(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('player_profiles').select('season')
    if (error || !data) return []
    return Array.from(new Set(data.map((r) => r.season as string))).sort().reverse()
  } catch {
    return []
  }
}

/** Tüm profil slug'ları (statik üretim/sitemap için gerekirse) */
export async function getAllProfileSlugs(): Promise<string[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase.from('player_profiles').select('slug')
    if (error || !data) return []
    return Array.from(new Set(data.map((r) => r.slug as string)))
  } catch {
    return []
  }
}
