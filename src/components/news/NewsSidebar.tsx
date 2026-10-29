import Link from 'next/link'
import { newsListHref, categoryCounts } from '@/lib/news'
import { formatDate } from '@/lib/utils'
import type { SiteNews, NewsCategory } from '@/lib/supabase/news-server'
import { categoryTone } from './categoryTone'

function SideBox({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="rounded-2xl border border-[#e3ede7] bg-white p-5">
      <h2 className="mb-3 border-b-2 border-[#edf5f0] pb-3 font-heading text-[13px] font-extrabold uppercase tracking-[0.16em] text-ugreenm">
        <span className="relative">{title}<span aria-hidden className="absolute -bottom-[14px] left-0 h-[2px] w-full bg-ugold" /></span>
      </h2>
      {children}
    </section>
  )
}

/* Kategoriler — renkli nokta + ad + sayı rozeti; aktif olan yeşil zeminli. */
export function CategoryBox({ news, categories, active }: { news: readonly SiteNews[]; categories: readonly NewsCategory[]; active: string | null }) {
  const counts = categoryCounts(news)
  const rows = [
    { slug: null, name: 'Tüm Haberler', count: news.length, dot: 'bg-ugreenm' },
    ...categories
      .map((c) => ({ slug: c.slug, name: c.name, count: counts.get(c.slug) ?? 0, dot: categoryTone(c.slug, categories).dot }))
      .filter((c) => c.count > 0 || c.slug === active),
  ]
  return (
    <SideBox title="Kategoriler">
      <ul className="-mx-2 space-y-0.5">
        {rows.map((c) => {
          const isActive = c.slug === active
          return (
            <li key={c.slug ?? 'tum'}>
              <Link href={newsListHref({ kategori: c.slug })} aria-current={isActive ? 'page' : undefined}
                className={`group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-bold transition-colors ${isActive ? 'bg-ugreen text-white' : 'text-ugreenm hover:bg-[#f2f8f4]'}`}>
                <i aria-hidden className={`h-2 w-2 shrink-0 rounded-full ${isActive ? 'bg-ugold' : c.dot}`} />
                <span className="flex-1 truncate">{c.name}</span>
                <b className={`rounded-full px-2 py-0.5 text-[11px] font-extrabold tabular-nums ${isActive ? 'bg-ugold text-ugreend' : 'bg-[#edf5f0] text-utxt2 group-hover:bg-white'}`}>{c.count}</b>
              </Link>
            </li>
          )
        })}
      </ul>
    </SideBox>
  )
}

/* Son Haberler — numaralı liste (okunma verisi olmadığı için "En Çok Okunanlar" yerine). */
export function LatestBox({ news, excludeId }: { news: readonly SiteNews[]; excludeId?: string }) {
  const items = news.filter((n) => n.id !== excludeId).slice(0, 5)
  if (!items.length) return null
  return (
    <SideBox title="Son Haberler">
      <ol className="divide-y divide-[#edf5f0]">
        {items.map((n, i) => (
          <li key={n.id} className="flex gap-3.5 py-3 first:pt-1 last:pb-0">
            <span aria-hidden className="font-heading text-2xl font-extrabold leading-none text-ugold tabular-nums">{String(i + 1).padStart(2, '0')}</span>
            <div className="min-w-0">
              <Link href={`/haberler/${n.slug}`} className="text-sm font-bold leading-snug text-ugreenm transition-colors hover:text-ugreen line-clamp-2">{n.title}</Link>
              <p className="mt-1 text-[11px] font-semibold text-[#7aab8e]">{formatDate(n.date)}</p>
            </div>
          </li>
        ))}
      </ol>
    </SideBox>
  )
}
