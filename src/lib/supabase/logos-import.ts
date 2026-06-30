'use server'

import { createClient } from './server'
import { getLiveTff } from './tff-server'
import { getTeamLogoMap } from './logos-server'

export interface LogoImportResult {
  ok: boolean
  imported: number
  skipped: number
  failed: string[]
  total: number
  error?: string
}

const SUPA_HOST = (process.env.NEXT_PUBLIC_SUPABASE_URL || '').replace(/^https?:\/\//, '')

/**
 * Canlı TFF verisindeki tüm takımların logolarını bir kez indirip Supabase
 * Storage'a ('media/logos/') yükler ve `team_logos` tablosuna yazar.
 * Böylece site logoları yavaş/zaman aşımına uğrayan TFF sunucusu yerine
 * kendi veritabanımızdan servis edilir. Yalnız giriş yapmış admin çalıştırabilir.
 * Tekrar çalıştırıldığında zaten Supabase'de olanları atlar (idempotent).
 */
export async function importTeamLogos(): Promise<LogoImportResult> {
  const supabase = await createClient()

  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { ok: false, imported: 0, skipped: 0, failed: [], total: 0, error: 'Yetkisiz' }

  let teamUrls: Map<string, string>
  let existing: Record<string, string>
  try {
    const [{ standings, matches }, map] = await Promise.all([getLiveTff(), getTeamLogoMap()])
    existing = map
    teamUrls = new Map<string, string>()
    for (const r of standings) if (r.team && r.teamLogo) teamUrls.set(r.team, r.teamLogo)
    for (const m of matches) {
      if (m.homeTeam && m.homeTeamLogo) teamUrls.set(m.homeTeam, teamUrls.get(m.homeTeam) ?? m.homeTeamLogo)
      if (m.awayTeam && m.awayTeamLogo) teamUrls.set(m.awayTeam, teamUrls.get(m.awayTeam) ?? m.awayTeamLogo)
    }
  } catch (e) {
    return { ok: false, imported: 0, skipped: 0, failed: [], total: 0, error: (e as Error).message }
  }

  let imported = 0
  let skipped = 0
  const failed: string[] = []

  for (const [team, url] of teamUrls) {
    const cur = existing[team]
    // Zaten kendi storage'ımızda tutuluyorsa atla (idempotent)
    if (cur && SUPA_HOST && cur.includes(SUPA_HOST)) { skipped++; continue }
    if (!/^https?:\/\//i.test(url)) { skipped++; continue }
    try {
      const res = await fetch(url, { signal: AbortSignal.timeout(15000), cache: 'no-store' })
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const ctype = res.headers.get('content-type') || ''
      const isPng = ctype.includes('png') || url.toLowerCase().split('?')[0].endsWith('.png')
      const buf = new Uint8Array(await res.arrayBuffer())
      if (buf.byteLength < 100) throw new Error('boş görsel')

      const path = `logos/${crypto.randomUUID()}.${isPng ? 'png' : 'jpg'}`
      const { error: upErr } = await supabase.storage.from('media').upload(path, buf, {
        contentType: isPng ? 'image/png' : 'image/jpeg',
        upsert: true,
      })
      if (upErr) throw upErr

      const { data } = supabase.storage.from('media').getPublicUrl(path)
      const { error: dbErr } = await supabase.from('team_logos').upsert(
        { team_name: team, logo_url: data.publicUrl, updated_at: new Date().toISOString() },
        { onConflict: 'team_name' },
      )
      if (dbErr) throw dbErr
      imported++
    } catch {
      failed.push(team)
    }
  }

  return { ok: true, imported, skipped, failed, total: teamUrls.size }
}
