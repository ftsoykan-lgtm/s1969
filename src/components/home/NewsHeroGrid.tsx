import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { SiteNews } from '@/lib/supabase/news-server'
import MotionReveal from '@/components/ui/MotionReveal'

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-ugold text-ugreend">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}

function MainCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-2xl overflow-hidden h-[420px] md:h-full shadow-xl shadow-black/10">
      <Image src={item.imageUrl} alt={item.title} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/97 via-ugreend/45 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-ugold transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
        <Badge label={label} />
        <h2 className="mt-3 text-white text-3xl md:text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.02em] line-clamp-3">{item.title}</h2>
        <p className="mt-3 text-white/60 text-base md:text-lg line-clamp-2 max-w-xl">{item.excerpt}</p>
        <p className="mt-4 text-[12px] text-ugold font-bold uppercase tracking-widest">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

function SideCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-xl overflow-hidden flex-1 min-h-[130px] shadow-md shadow-black/10">
      <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/97 via-ugreend/55 to-transparent" />
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-ugreen transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <Badge label={label} />
        <h3 className="mt-1.5 text-white text-sm font-bold leading-snug line-clamp-2">{item.title}</h3>
        <p className="mt-1 text-[11px] text-white/40 font-medium">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

function GridCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-2xl overflow-hidden card-premium border-t-4 border-t-ugold">
      <div className="relative h-44 overflow-hidden bg-[#edf7f2]">
        <Image src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover media-zoom" />
        <div className="absolute top-3 left-3"><Badge label={label} /></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-extrabold text-ugreenm leading-tight tracking-tight line-clamp-2 group-hover:text-ugreen transition-colors">{item.title}</h3>
        <p className="mt-2.5 text-[11px] font-bold uppercase tracking-wide text-ugold">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

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
