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

/* ─── GÖRSEL YÜKLEME (Storage + otomatik boyutlandırma) ─────── */

/**
 * Görseli tarayıcıda kare tuvale çizip yeniden boyutlandırır (en-boy korunur,
 * şeffaf zemin), PNG olarak Supabase Storage 'media' bucket'ına yükler,
 * herkese açık URL döner.
 */
export async function uploadImage(
  file: File,
  opts: { folder?: string; size?: number } = {}
): Promise<{ ok: boolean; url?: string; error?: string }> {
  const { folder = 'logos', size = 256 } = opts
  console.log('🔵 [uploadImage] Başladı —', file.name, '|', Math.round(file.size / 1024), 'KB')
  try {
    const resized = await resizeToSquare(file, size)
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

/** Görseli kare tuvale ortalayıp orantılı sığdırır → PNG Blob */
function resizeToSquare(file: File, size: number): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const url = URL.createObjectURL(file)
    const img = new Image()
    img.onload = () => {
      URL.revokeObjectURL(url)
      const canvas = document.createElement('canvas')
      canvas.width = size
      canvas.height = size
      const ctx = canvas.getContext('2d')
      if (!ctx) return reject(new Error('Canvas desteklenmiyor'))
      // orantılı sığdır (contain)
      const scale = Math.min(size / img.width, size / img.height)
      const w = img.width * scale
      const h = img.height * scale
      ctx.drawImage(img, (size - w) / 2, (size - h) / 2, w, h)
      canvas.toBlob((blob) => (blob ? resolve(blob) : reject(new Error('Görsel oluşturulamadı'))), 'image/png', 0.92)
    }
    img.onerror = () => {
      URL.revokeObjectURL(url)
      reject(new Error('Görsel okunamadı'))
    }
    img.src = url
  })
}
