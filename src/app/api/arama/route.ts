import { unstable_cache } from 'next/cache'
import { getNews } from '@/lib/supabase/news-server'
import { getPages } from '@/lib/supabase/pages-server'
import { getSeasonPlayers, getProfileSeasonsServer } from '@/lib/supabase/player-profiles-server'
import { getSitePlayers } from '@/lib/supabase/players-server'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import { matchHref } from '@/lib/tff'
import { pageHref, groupLabel } from '@/lib/pages-meta'
import { normalize, runSearch, type SearchDoc } from '@/lib/search'

/* Arama indeksi. Veri hacmi küçük (birkaç yüz kayıt) ve maç verisi jsonb
   blob içinde tutulduğu için SQL `ilike` ile aranamıyor → indeks bellekte
   kurulup JS'te taranıyor. Bu aynı zamanda Supabase boşken devreye giren
   statik fallback'leri de kapsar.

   Not: `use cache` direktifi bu projede kullanılamıyor (next.config'de
   cacheComponents açık değil), bu yüzden unstable_cache kullanıldı. */

const stripHtml = (s: string | null | undefined) =>
  (s || '').replace(/<[^>]*>/g, ' ').replace(/&[a-z]+;/gi, ' ')

/** jsonb `data` alanındaki yapılandırılmış sayfa içeriğinden düz metin toplar. */
function collectText(value: unknown, depth = 0): string {
  if (depth > 4 || value == null) return ''
  if (typeof value === 'string') return value
  if (typeof value === 'number' || typeof value === 'boolean') return String(value)
  if (Array.isArray(value)) return value.map((v) => collectText(v, depth + 1)).join(' ')
  if (typeof value === 'object') return Object.values(value as Record<string, unknown>)
    .map((v) => collectText(v, depth + 1)).join(' ')
  return ''
}

const doc = (
  d: Omit<SearchDoc, 'nTitle' | 'nBody'>, bodyParts: (string | null | undefined)[],
): SearchDoc => ({
  ...d,
  nTitle: normalize(d.title),
  nBody: normalize([d.title, d.subtitle, d.meta, ...bodyParts].filter(Boolean).join(' ')),
})

async function buildIndex(): Promise<SearchDoc[]> {
  const docs: SearchDoc[] = []

  // ─── Haberler ────────────────────────────────────────────────
  try {
    for (const n of await getNews()) {
      const t = n.date ? new Date(n.date).getTime() : undefined
      docs.push(doc({
        type: 'haber', title: n.title, subtitle: n.excerpt || undefined,
        meta: n.category || undefined, href: `/haberler/${n.slug}`,
        imageUrl: n.imageUrl || null, ts: Number.isFinite(t) ? t : undefined,
      }, [stripHtml(n.content)]))
    }
  } catch { /* haber yoksa diğer türler yine aranabilsin */ }

  // ─── Oyuncular ───────────────────────────────────────────────
  // kadro/page.tsx ile aynı öncelik: sezon profilleri varsa onlar, yoksa TFF kadrosu.
  try {
    const seasons = await getProfileSeasonsServer()
    if (seasons.length > 0) {
      const { players } = await getSeasonPlayers()
      for (const p of players) {
        const no = p.number != null ? `${p.number} numara` : ''
        docs.push(doc({
          type: 'oyuncu', title: p.name,
          subtitle: p.position || undefined,
          meta: p.number != null ? `#${p.number}` : undefined,
          href: `/oyuncu/${p.slug}`, imageUrl: p.photoUrl || null,
        }, [no, p.nationality, p.prevTeam, p.club, p.birthPlace, p.bio, p.description]))
      }
    } else {
      const { players } = await getSitePlayers()
      for (const p of players) {
        const no = p.number != null ? `${p.number} numara` : ''
        docs.push(doc({
          type: 'oyuncu', title: p.name,
          subtitle: p.position || undefined,
          meta: p.number != null ? `#${p.number}` : undefined,
          href: `/oyuncu/${p.slug}`, imageUrl: p.photoUrl || null,
        }, [no, p.nationality]))
      }
    }
  } catch { /* kadro yoksa atla */ }

  // ─── Maçlar (canlı sezon + arşiv) ────────────────────────────
  try {
    const [live, seasons] = await Promise.all([getLiveTff(), getSeasons()])
    const archived = await Promise.all(seasons.map((s) => getTffBySeason(s)))
    const all = [...live.matches, ...archived.flatMap((a) => a?.matches ?? [])]
    const seen = new Set<string>()
    for (const m of all) {
      const key = m.macId || `${m.homeTeam}|${m.awayTeam}|${m.date}`
      if (seen.has(key)) continue
      seen.add(key)
      const skor = m.isCompleted && m.homeScore != null && m.awayScore != null
        ? `${m.homeScore}-${m.awayScore}` : null
      docs.push(doc({
        type: 'mac', title: `${m.homeTeam} — ${m.awayTeam}`,
        subtitle: [m.date, m.roundLabel].filter(Boolean).join(' · ') || undefined,
        meta: skor || (m.competition || undefined),
        href: matchHref(m), imageUrl: m.homeTeamLogo || m.awayTeamLogo || null,
      }, [m.competition, m.venue, m.roundLabel, skor]))
    }
  } catch { /* fikstür yoksa atla */ }

  // ─── Bilgi sayfaları ─────────────────────────────────────────
  try {
    for (const p of await getPages()) {
      docs.push(doc({
        type: 'sayfa', title: p.title, subtitle: p.subtitle || undefined,
        meta: groupLabel(p.navGroup), href: pageHref(p.slug),
        imageUrl: p.heroImage || null,
      }, [stripHtml(p.body), collectText(p.data)]))
    }
  } catch { /* sayfa yoksa atla */ }

  return docs
}

/* İndeks 5 dakika önbelleklenir: her tuş vuruşunda tüm sezonları yeniden
   çekmemek için. Haber/fikstür güncellemesi en geç 5 dk içinde aramaya yansır. */
const getIndex = unstable_cache(buildIndex, ['arama-indeksi-v1'], {
  revalidate: 300,
  tags: ['arama'],
})

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const q = (searchParams.get('q') || '').slice(0, 80)
  // DİKKAT: Number(null) === 0 ve isFinite(0) true — parametre yokken
  // varsayılana düşmeyip limiti 1'e kilitliyordu. Önce varlığını kontrol et.
  const limitParam = searchParams.get('limit')
  const limitRaw = limitParam === null ? NaN : Number(limitParam)
  const limit = Number.isFinite(limitRaw) ? Math.min(Math.max(limitRaw, 1), 50) : 30

  if (normalize(q).length < 2) {
    return Response.json({ q, hits: [], toplam: 0 })
  }

  try {
    const index = await getIndex()
    const hits = runSearch(index, q, limit)
    return Response.json({ q, hits, toplam: hits.length })
  } catch {
    return Response.json({ q, hits: [], toplam: 0, hata: 'Arama şu anda kullanılamıyor.' }, { status: 503 })
  }
}
