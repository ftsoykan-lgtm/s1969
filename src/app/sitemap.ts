import type { MetadataRoute } from 'next'
import { clubInfo } from '@/data/club'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import { getNews } from '@/lib/supabase/news-server'
import { matchSlug } from '@/lib/tff'

// Saatte bir yenilenir; TFF'den yeni maç/haber geldikçe otomatik büyür.
export const revalidate = 3600

const BASE = (process.env.NEXT_PUBLIC_SITE_URL || clubInfo.website || 'https://www.sanliurfaspor.org').replace(/\/+$/, '')

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  const staticPaths = [
    '', '/haberler', '/kadro', '/takvim', '/mac-merkezi', '/mac-merkezi/gecmis-maclar',
    '/fikstur', '/kulup/tarihce', '/kulup/yonetim', '/iletisim',
  ]
  const staticEntries: MetadataRoute.Sitemap = staticPaths.map((p) => ({
    url: `${BASE}${p}`, lastModified: now, changeFrequency: 'daily', priority: p === '' ? 1 : 0.7,
  }))

  // TÜM maçlar — güncel sezon + arşiv sezonları (benzersiz macId, premium URL)
  const matchEntries: MetadataRoute.Sitemap = []
  try {
    const [live, seasons] = await Promise.all([getLiveTff(), getSeasons()])
    const archived = await Promise.all(seasons.map((s) => getTffBySeason(s)))
    const all = [...live.matches, ...archived.flatMap((a) => a?.matches ?? [])]
    const seen = new Set<string>()
    for (const m of all) {
      if (!m.macId || seen.has(m.macId)) continue
      seen.add(m.macId)
      matchEntries.push({ url: `${BASE}/mac/${matchSlug(m)}`, lastModified: now, changeFrequency: 'weekly', priority: 0.6 })
    }
  } catch { /* veri yoksa sadece statik + haber */ }

  // Haberler
  const newsEntries: MetadataRoute.Sitemap = []
  try {
    for (const n of await getNews()) {
      const d = n.date ? new Date(n.date) : now
      newsEntries.push({ url: `${BASE}/haberler/${n.slug}`, lastModified: isNaN(d.getTime()) ? now : d, changeFrequency: 'weekly', priority: 0.6 })
    }
  } catch { /* yoksa atla */ }

  return [...staticEntries, ...matchEntries, ...newsEntries]
}
