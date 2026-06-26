'use client'

import { createBrowserClient } from '@supabase/ssr'
import type { ClubInfo } from '@/data/club'
import { clubInfo as defaultClub } from '@/data/club'
import { canonicalCompetition } from '@/lib/tff'

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
    const saved = data.data as Partial<ClubInfo>
    const footer = { ...defaultClub.footer, ...(saved.footer ?? {}) }
    return { ...defaultClub, ...saved, footer }
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

/* ─── HABERLER (admin yönetir) ─────────────────────────────── */

export interface NewsRow {
  id?: number
  title: string
  slug: string
  excerpt?: string | null
  content?: string | null
  image_url?: string | null
  category: string
  featured?: boolean
  published?: boolean
  published_at?: string | null
}

const slugifyTr = (s: string) =>
  s.toLocaleLowerCase('tr-TR')
    .replace(/ç/g, 'c').replace(/ğ/g, 'g').replace(/ı/g, 'i').replace(/ö/g, 'o').replace(/ş/g, 's').replace(/ü/g, 'u')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80)

export async function getNewsAdmin(): Promise<NewsRow[]> {
  try {
    const { data, error } = await client().from('news').select('*').order('published_at', { ascending: false })
    if (error || !data) return []
    return data as NewsRow[]
  } catch { return [] }
}

export async function saveNews(n: NewsRow): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = {
      title: n.title,
      slug: n.slug || slugifyTr(n.title),
      excerpt: n.excerpt ?? null,
      content: n.content ?? null,
      image_url: n.image_url ?? null,
      category: n.category,
      featured: n.featured ?? false,
      published: n.published ?? true,
      published_at: n.published_at || new Date().toISOString().slice(0, 10),
      updated_at: new Date().toISOString(),
    }
    const supabase = client()
    const { error } = n.id
      ? await supabase.from('news').update(row).eq('id', n.id)
      : await supabase.from('news').insert(row)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deleteNews(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('news').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export interface CategoryRow { id?: number; name: string; slug: string; sort_order?: number }

export async function getCategoriesAdmin(): Promise<CategoryRow[]> {
  try {
    const { data, error } = await client().from('news_categories').select('*').order('sort_order', { ascending: true })
    if (error || !data) return []
    return data as CategoryRow[]
  } catch { return [] }
}

export async function saveCategory(c: CategoryRow): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = { name: c.name, slug: c.slug || slugifyTr(c.name), sort_order: c.sort_order ?? 0 }
    const supabase = client()
    const { error } = c.id
      ? await supabase.from('news_categories').update(row).eq('id', c.id)
      : await supabase.from('news_categories').insert(row)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deleteCategory(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('news_categories').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
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
    // id 'generated always as identity' olduğu için payload'a id koymuyoruz
    const row = {
      name: s.name,
      logo_url: s.logo_url ?? null,
      website: s.website ?? '#',
      tier: s.tier,
      active: s.active ?? true,
      sort_order: s.sort_order ?? 0,
    }
    const supabase = client()
    const { error } = s.id
      ? await supabase.from('sponsors').update(row).eq('id', s.id)   // mevcut → güncelle
      : await supabase.from('sponsors').insert(row)                  // yeni → ekle
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
    // Kanonik adla tekilleştir: play-off + grup aynı lig logosunu paylaşır
    return Array.from(new Set(fixtures.map((f) => canonicalCompetition(f.competition)).filter(Boolean)))
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
    // Tahmin edilemez rastgele dosya adı (orijinal isim/zaman damgası sızmaz)
    const rid = (typeof crypto !== 'undefined' && crypto.randomUUID)
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`
    const path = `${folder}/${rid}.png`
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

/* ─── Sayfalar CMS ─────────────────────────────────────────────── */
export interface AdminPage {
  slug: string
  title: string
  subtitle?: string | null
  hero_image?: string | null
  body?: string | null
  nav_group?: string
  sort?: number
  published?: boolean
}

export async function getPagesAdmin(): Promise<AdminPage[]> {
  try {
    const { data, error } = await client().from('site_pages').select('*').order('nav_group').order('sort')
    if (error || !data) return []
    return data as AdminPage[]
  } catch { return [] }
}

export async function getPageAdmin(slug: string): Promise<AdminPage | null> {
  try {
    const { data, error } = await client().from('site_pages').select('*').eq('slug', slug).single()
    if (error || !data) return null
    return data as AdminPage
  } catch { return null }
}

export async function savePage(p: AdminPage, originalSlug?: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = {
      slug: p.slug,
      title: p.title,
      subtitle: p.subtitle ?? null,
      hero_image: p.hero_image ?? null,
      body: p.body ?? null,
      nav_group: p.nav_group ?? 'kulup',
      sort: p.sort ?? 0,
      published: p.published ?? true,
      updated_at: new Date().toISOString(),
    }
    const supabase = client()
    // slug birincil anahtar; düzenleme = update, yeni = insert
    const { error } = originalSlug
      ? await supabase.from('site_pages').update(row).eq('slug', originalSlug)
      : await supabase.from('site_pages').insert(row)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deletePage(slug: string): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('site_pages').delete().eq('slug', slug)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/* ─── OYUNCU PROFİLLERİ (sezon bazlı) ──────────────────────────── */
export interface AdminPlayer {
  id?: number
  season: string
  tff_id?: string | null
  slug?: string
  name: string
  position?: string | null
  number?: number | null
  birth_date?: string | null
  birth_place?: string | null
  nationality?: string | null
  flag_code?: string | null
  license_no?: string | null
  club?: string | null
  photo_tff?: string | null
  photo?: string | null
  bio?: string | null
  height?: string | null
  weight?: string | null
  prev_team?: string | null
  description?: string | null
  instagram?: string | null
  twitter?: string | null
  active?: boolean
  sort_order?: number
  manual?: boolean
}

function slugifyName(s: string): string {
  return (s || '').toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Bir sezonun tüm oyuncuları (admin — pasifler dahil) */
export async function getPlayerProfilesAdmin(season: string): Promise<AdminPlayer[]> {
  try {
    const { data, error } = await client().from('player_profiles').select('*')
      .eq('season', season).order('sort_order').order('number', { nullsFirst: false }).order('name')
    if (error || !data) return []
    return data as AdminPlayer[]
  } catch { return [] }
}

/** Profil tablosundaki sezon listesi */
export async function getProfileSeasons(): Promise<string[]> {
  try {
    const { data, error } = await client().from('player_profiles').select('season')
    if (error || !data) return []
    return Array.from(new Set(data.map((r) => r.season as string))).sort().reverse()
  } catch { return [] }
}

export async function savePlayerProfile(p: AdminPlayer): Promise<{ ok: boolean; error?: string }> {
  try {
    const row = {
      season: p.season, tff_id: p.tff_id ?? null, slug: p.slug || slugifyName(p.name),
      name: p.name, position: p.position ?? null, number: p.number ?? null,
      birth_date: p.birth_date ?? null, birth_place: p.birth_place ?? null,
      nationality: p.nationality ?? null, flag_code: p.flag_code ?? null,
      license_no: p.license_no ?? null, club: p.club ?? null, photo_tff: p.photo_tff ?? null,
      photo: p.photo ?? null, bio: p.bio ?? null, height: p.height ?? null, weight: p.weight ?? null,
      prev_team: p.prev_team ?? null, description: p.description ?? null,
      instagram: p.instagram ?? null, twitter: p.twitter ?? null,
      active: p.active ?? true, sort_order: p.sort_order ?? 0, manual: p.manual ?? false,
      updated_at: new Date().toISOString(),
    }
    const supabase = client()
    const { error } = p.id
      ? await supabase.from('player_profiles').update(row).eq('id', p.id)
      : await supabase.from('player_profiles').insert(row)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

export async function deletePlayerProfile(id: number): Promise<{ ok: boolean; error?: string }> {
  try {
    const { error } = await client().from('player_profiles').delete().eq('id', id)
    if (error) return { ok: false, error: error.message }
    return { ok: true }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}

/** TFF ile senkronize et — en güncel taranmış kadroyu profillere uygular.
 *  Sadece TFF alanlarını günceller; admin alanları (foto/bio vs.) KORUNUR. */
export async function syncPlayersFromTff(season?: string): Promise<{ ok: boolean; error?: string; count?: number; season?: string }> {
  try {
    const supabase = client()
    const { data } = await supabase.from('tff_data').select('data').eq('id', 1).single()
    const d = data?.data as { season?: string; squad?: { season?: string; players?: any[] } } | undefined
    const squad = d?.squad
    if (!squad?.players?.length) return { ok: false, error: 'TFF kadrosu bulunamadı (önce scraper çalışmalı)' }
    const s = season || squad.season || d?.season || ''
    if (!s) return { ok: false, error: 'Sezon belirlenemedi' }

    const rows = squad.players.filter((p) => p.tffId).map((p) => ({
      season: s, tff_id: String(p.tffId), slug: slugifyName(p.name),
      name: p.name, position: p.position ?? null, number: p.number ?? null,
      birth_date: p.birthDate ?? null, birth_place: p.birthPlace ?? null,
      nationality: p.nationality ?? null, flag_code: p.flagCode ?? null,
      license_no: p.licenseNo ?? null, club: p.club ?? null, photo_tff: p.photo ?? null,
      active: true, updated_at: new Date().toISOString(),
    }))
    if (!rows.length) return { ok: false, error: 'Kadroda tff_id olan oyuncu yok' }

    const { error } = await supabase.from('player_profiles').upsert(rows, { onConflict: 'season,tff_id' })
    if (error) return { ok: false, error: error.message }

    // Ayrılanları pasifleştir — GÜVENLİ id-bazlı yöntem (aktifleri yanlışlıkla kapatmaz)
    const currentIds = new Set(rows.map((r) => r.tff_id))
    const { data: existing } = await supabase.from('player_profiles')
      .select('id, tff_id, manual, active').eq('season', s)
    const departedIds = (existing ?? [])
      .filter((r) => r.active && !r.manual && r.tff_id && !currentIds.has(String(r.tff_id)))
      .map((r) => r.id)
    if (departedIds.length) {
      await supabase.from('player_profiles').update({ active: false }).in('id', departedIds)
    }

    return { ok: true, count: rows.length, season: s }
  } catch (e) { return { ok: false, error: (e as Error).message } }
}
