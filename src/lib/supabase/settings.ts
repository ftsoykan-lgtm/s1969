'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { ClubInfo } from '@/data/club'
import { clubInfo as defaultClub } from '@/data/club'

function client() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}

/* ─── SİTE AYARLARI ─────────────────────────────────────────── */

/** Ayarları Supabase'den çek; yoksa statik varsayılana düş */
export async function getSettings(): Promise<ClubInfo> {
  try {
    const { data, error } = await client()
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single()
    if (error || !data?.data || Object.keys(data.data).length === 0) return defaultClub
    return { ...defaultClub, ...(data.data as Partial<ClubInfo>) }
  } catch {
    return defaultClub
  }
}

/** Ayarları kaydet (upsert id=1) */
export async function saveSettings(value: ClubInfo): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client()
      .from('site_settings')
      .upsert({ id: 1, data: value, updated_at: new Date().toISOString() })
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/* ─── TAKIM LOGOLARI ────────────────────────────────────────── */

export async function getTeamLogos(): Promise<Record<string, string>> {
  console.log('🔵 [getTeamLogos] Supabase\'den logolar çekiliyor...')
  try {
    const { data, error } = await client().from('team_logos').select('team_name, logo_url')
    if (error) {
      console.error('🔴 [getTeamLogos] HATA:', error.message, '| kod:', error.code, '| detay:', error.details)
      return {}
    }
    console.log('🟢 [getTeamLogos] Başarılı —', data?.length ?? 0, 'logo bulundu:', data)
    return Object.fromEntries((data ?? []).map((r) => [r.team_name, r.logo_url ?? '']))
  } catch (e) {
    console.error('🔴 [getTeamLogos] BEKLENMEYEN HATA:', e)
    return {}
  }
}

export async function saveTeamLogo(teamName: string, logoUrl: string): Promise<{ ok: boolean; error?: string }> {
  console.log('🔵 [saveTeamLogo] Kaydediliyor →', teamName, '=', logoUrl)
  try {
    const { error } = await client()
      .from('team_logos')
      .upsert({ team_name: teamName, logo_url: logoUrl, updated_at: new Date().toISOString() }, { onConflict: 'team_name' })
    if (error) {
      console.error('🔴 [saveTeamLogo] HATA:', error.message, '| kod:', error.code, '| detay:', error.details)
      return { ok: false, error: error.message }
    }
    console.log('🟢 [saveTeamLogo] Kaydedildi:', teamName)
    return { ok: true }
  } catch (e) {
    console.error('🔴 [saveTeamLogo] BEKLENMEYEN HATA:', e)
    return { ok: false, error: (e as Error).message }
  }
}

/* ─── TFF KADRO (canlı, salt-okunur) ───────────────────────── */

export async function getTffSquad(): Promise<{ season: string | null; players: { name: string; tffId: string | null }[] }> {
  try {
    const { data, error } = await client().from('tff_data').select('data').eq('id', 1).single()
    const sq = (data?.data as { squad?: { season: string | null; players: { name: string; tffId: string | null }[] } })?.squad
    if (!error && sq?.players?.length) return sq
  } catch {}
  return { season: null, players: [] }
}

/* ─── SPONSORLAR (admin yönetir) ───────────────────────────── */

export interface SponsorRow {
  id?: number
  name: string
  logo_url?: string | null
  website?: string | null
  tier: 'ana' | 'resmi' | 'destekci'
  active?: boolean
  sort_order?: number | null
}

export async function getSponsorsAdmin(): Promise<SponsorRow[]> {
  try {
    const { data, error } = await client().from('sponsors').select('*').order('sort_order', { ascending: true })
    if (error || !data) return []
    return data as SponsorRow[]
  } catch {
    return []
  }
}

export async function saveSponsor(s: SponsorRow): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = {
      ...(s.id ? { id: s.id } : {}),
      name: s.name,
      logo_url: s.logo_url ?? null,
      website: s.website ?? '#',
      tier: s.tier,
      active: s.active ?? true,
      sort_order: s.sort_order ?? 0,
    }
    const { error } = await client().from('sponsors').upsert(row)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

export async function deleteSponsor(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('sponsors').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/* ─── TFF TURNUVALARI (maçlardaki farklı turnuvalar) ───────── */

export async function getTffCompetitions(): Promise<string[]> {
  try {
    const { data, error } = await client().from('tff_data').select('data').eq('id', 1).single()
    const fixtures = (data?.data as { sanliurfasporFixtures?: { competition: string }[] })?.sanliurfasporFixtures
    if (error || !fixtures) return []
    return Array.from(new Set(fixtures.map((f) => f.competition).filter(Boolean)))
  } catch {
    return []
  }
}

/* ─── OYUNCU DETAYLARI (admin düzenler) ────────────────────── */

export interface PlayerDetail {
  name: string
  tff_id?: string | null
  photo_url?: string | null
  number?: number | null
  position?: string | null
  nationality?: string | null
  flag_code?: string | null
  birth_date?: string | null
  active?: boolean
  sort_order?: number | null
  manual?: boolean
}

export async function getPlayerDetails(): Promise<Record<string, PlayerDetail>> {
  try {
    const { data, error } = await client().from('player_details').select('*')
    if (error || !data) return {}
    return Object.fromEntries(data.map((r) => [r.name, r as PlayerDetail]))
  } catch {
    return {}
  }
}

export async function savePlayerDetail(detail: PlayerDetail): Promise<{ ok: boolean; error?: string }> {
  try {
    // Sadece tablo sütunlarını gönder (id/updated_at gibi fazlalıkları ele)
    const row = {
      name: detail.name,
      tff_id: detail.tff_id ?? null,
      photo_url: detail.photo_url ?? null,
      number: detail.number ?? null,
      position: detail.position ?? null,
      nationality: detail.nationality ?? null,
      flag_code: detail.flag_code ?? null,
      birth_date: detail.birth_date || null,
      active: detail.active ?? true,
      sort_order: detail.sort_order ?? 0,
      manual: detail.manual ?? false,
      updated_at: new Date().toISOString(),
    }
    console.log('🔵 [savePlayerDetail] kaydediliyor:', row)
    const { error } = await client()
      .from('player_details')
      .upsert(row, { onConflict: 'name' })
    if (error) {
      console.error('🔴 [savePlayerDetail] HATA:', error.message, '| kod:', error.code, '| detay:', error.details)
      return { ok: false, error: error.message }
    }
    console.log('🟢 [savePlayerDetail] kaydedildi:', detail.name)
    return { ok: true }
  } catch (e) {
    console.error('🔴 [savePlayerDetail] BEKLENMEYEN:', e)
    return { ok: false, error: (e as Error).message }
  }
}

export async function deletePlayerDetail(name: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('player_details').delete().eq('name', name)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) {
    return { ok: false, error: (e as Error).message }
  }
}

/* ─── GÖRSEL YÜKLEME (Storage + otomatik boyutlandırma) ─────── */

/**
 * Görseli tarayıcıda kare tuvale çizip yeniden boyutlandırır (en-boy korunur,
 * şeffaf zemin), PNG olarak Supabase Storage 'media' bucket'ına yükler,
 * herkese açık URL döner.
 */
export async function uploadImage(
  file: File,
  opts: { folder?: string; size?: number; width?: number; height?: number; fit?: 'contain' | 'cover' } = {}
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { folder = 'logos', size = 256 } = opts
  const w = opts.width ?? size
  const h = opts.height ?? size
  const fit = opts.fit ?? 'contain'
  console.log('🔵 [uploadImage] Başladı —', file.name, '|', Math.round(file.size / 1024), 'KB')
  try {
    const resized = await resizeImage(file, w, h, fit)
    console.log('🟡 [uploadImage] Boyutlandırıldı →', size + 'px,', Math.round(resized.size / 1024), 'KB')
    const path = `${folder}/${Date.now()}-${slugify(file.name)}.png`
    console.log('🟡 [uploadImage] Storage\'a yükleniyor → media/' + path)
    const { error } = await client().storage.from('media').upload(path, resized, {
      contentType: 'image/png',
      upsert: true,
    })
    if (error) {
      console.error('🔴 [uploadImage] STORAGE HATASI:', error.message, '| tüm hata:', error)
      return { ok: false, error: error.message }
    }
    const { data } = client().storage.from('media').getPublicUrl(path)
    console.log('🟢 [uploadImage] Yüklendi! URL:', data.publicUrl)
    return { ok: true, url: data.publicUrl }
  } catch (e) {
    console.error('🔴 [uploadImage] BEKLENMEYEN HATA:', e)
    return { ok: false, error: (e as Error).message }
  }
}

function slugify(name: string): string {
  return name.replace(/\.[^.]+$/, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 40) || 'img'
}

/** Görseli hedef boyuta ölçekler (contain = orantılı sığdır, cover = doldur+kırp) */
function resizeImage(file: File, tw: number, th: number, fit: 'contain' | 'cover'): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = tw
      canvas.height = th
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas desteklenmiyor'))
      if (fit === 'cover') {
        const scale = Math.max(tw / img.width, th / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (tw - w) / 2, (th - h) / 2, w, h)
      } else {
        const scale = Math.min(tw / img.width, th / img.height)
        const w = img.width * scale
        const h = img.height * scale
        ctx.drawImage(img, (tw - w) / 2, (th - h) / 2, w, h)
      }
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Görsel oluşturulamadı'))), 'image/png', 0.92)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Görsel okunamadı'))
    }
    img.src = url
  })
}
