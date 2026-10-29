import type { Metadata } from 'next'
import Link from 'next/link'
import { getNews, getCategories } from '@/lib/supabase/news-server'
import { newsListHref, paginate, parsePage } from '@/lib/news'
import NewsPagination from '@/components/news/NewsPagination'
import { NewsMainCard, NewsSideCard, NewsGridCard } from '@/components/news/NewsTiles'
import { categoryName } from '@/components/news/categoryTone'

export const metadata: Metadata = {
  title: 'Haberler',
  description: 'Şanlıurfaspor güncel haberleri, transferler, maç raporları.',
}

export const revalidate = 60

/* Manşet bloğu: 1 büyük + 3 yan kart (ana sayfadaki "Kulüp Haberleri" ile aynı) */
const TOP_COUNT = 4

type Props = { searchParams: Promise<{ kategori?: string | string[]; sayfa?: string | string[] }> }

export default async function HaberlerPage({ searchParams }: Props) {
  const sp = await searchParams
  const [news, categories] = await Promise.all([getNews(), getCategories()])

  const rawCat = Array.isArray(sp.kategori) ? sp.kategori[0] : sp.kategori
  const kategori = rawCat && categories.some((c) => c.slug === rawCat) ? rawCat : null
  const filtered = kategori ? news.filter((n) => n.category === kategori) : news
  const label = (slug: string) => categoryName(slug, categories)

  // 1. sayfa: manşet bloğu + ızgara; sonraki sayfalar yalnız ızgara
  const [main, ...sides] = filtered.slice(0, TOP_COUNT)
  const { items, page, totalPages } = paginate(filtered.slice(TOP_COUNT), parsePage(sp.sayfa))
  const showTop = !!main && page === 1

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Kulüp <span className="text-ugold">Haberleri</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Kategori hapları — URL tabanlı (paylaşılabilir, geri tuşuyla çalışır) */}
        <nav aria-label="Haber kategorileri" className="flex flex-wrap gap-2 mb-10">
          <Pill href={newsListHref({})} active={!kategori}>Tümü</Pill>
          {categories.map((c) => (
            <Pill key={c.slug} href={newsListHref({ kategori: c.slug })} active={kategori === c.slug}>{c.name}</Pill>
          ))}
        </nav>

        {filtered.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#ddeae2] p-12 text-center">
            <p className="text-sm font-bold text-ugreenm">Bu kategoride haber bulunmuyor</p>
          </div>
        ) : (
          <div className="space-y-4">
            {showTop && (
              sides.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-3 md:h-[460px]">
                  <NewsMainCard item={main} label={label(main.category)} />
                  <div className="flex flex-col gap-3">
                    {sides.map((n) => <NewsSideCard key={n.id} item={n} label={label(n.category)} />)}
                  </div>
                </div>
              ) : (
                <div className="md:h-[460px]"><NewsMainCard item={main} label={label(main.category)} /></div>
              )
            )}

            {items.length > 0 && (
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                {items.map((n) => <NewsGridCard key={n.id} item={n} label={label(n.category)} />)}
              </div>
            )}

            <div className="pt-8">
              <NewsPagination page={page} totalPages={totalPages} kategori={kategori} />
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

function Pill({ href, active, children }: { href: string; active: boolean; children: React.ReactNode }) {
  return (
    <Link href={href} aria-current={active ? 'page' : undefined}
      className={`px-5 py-2.5 rounded-full text-sm font-extrabold tracking-wide transition-all ${
        active ? 'bg-ugreen text-white shadow-sm' : 'bg-white border border-[#ddeae2] text-utxt2 hover:border-ugreen/40'
      }`}>
      {children}
    </Link>
  )
}
