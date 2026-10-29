import Link from 'next/link'
import type { SiteNews } from '@/lib/supabase/news-server'
import MotionReveal from '@/components/ui/MotionReveal'
import { NewsMainCard as MainCard, NewsSideCard as SideCard, NewsGridCard as GridCard } from '@/components/news/NewsTiles'

export default function NewsHeroGrid({ news, catName }: { news: SiteNews[]; catName: (slug: string) => string }) {
  if (!news.length) return null
  const [mainItem, ...rest] = news
  const sideItems = rest.slice(0, 3)
  const gridItems = rest.slice(3, 7)

  return (
    <section className="reveal relative py-20 md:py-24 bg-white overflow-hidden">
      {/* arkada dev soluk filigran */}
      <span aria-hidden className="pointer-events-none absolute -top-6 right-2 font-heading text-[18vw] leading-none font-extrabold text-ugreen/[0.06] select-none hidden md:block">HABER</span>
      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-ugreenm tracking-[-0.03em] leading-[0.92]">
              KULÜP<br /><span className="text-ugreen">HABERLERİ</span>
            </h2>
          </div>
          <Link href="/haberler"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold uppercase tracking-wide text-white bg-ugreen px-6 py-3.5 rounded-xl hover:bg-ugreend transition-colors shadow-[0_10px_24px_-10px_rgba(12,46,34,0.5)]">
            Tüm Haberler →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-3 md:h-[460px]">
          <MainCard item={mainItem} label={catName(mainItem.category)} />
          <div className="flex flex-col gap-3">
            {sideItems.map((item, i) => (
              <MotionReveal key={item.id} delay={i * 0.1} className="flex-1 flex">
                <SideCard item={item} label={catName(item.category)} />
              </MotionReveal>
            ))}
          </div>
        </div>

        {gridItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {gridItems.map((item, i) => (
              <MotionReveal key={item.id} delay={i * 0.08}>
                <GridCard item={item} label={catName(item.category)} />
              </MotionReveal>
            ))}
          </div>
        )}
      </div>
    </section>
  )
}
