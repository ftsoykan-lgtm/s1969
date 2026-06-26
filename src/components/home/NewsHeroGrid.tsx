import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { SiteNews } from '@/lib/supabase/news-server'

function Badge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-[#FFD100] text-[#0f4a28]">
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
      <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/97 via-[#0f4a28]/45 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FFD100] transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-7">
        <Badge label={label} />
        <h2 className="mt-3 text-white text-2xl md:text-3xl font-black leading-snug tracking-tight line-clamp-3">{item.title}</h2>
        <p className="mt-2 text-white/55 text-base line-clamp-2">{item.excerpt}</p>
        <p className="mt-3 text-[12px] text-[#FFD100]/70 font-medium">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

function SideCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-xl overflow-hidden flex-1 min-h-[130px] shadow-md shadow-black/10">
      <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/97 via-[#0f4a28]/55 to-transparent" />
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-[#1A6B3C] transition-colors duration-300 pointer-events-none" />
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
      className="group block rounded-xl overflow-hidden bg-white border border-[#ddeae2] shadow-sm hover:shadow-lg hover:border-[#1A6B3C]/30 transition-all hover:-translate-y-1 duration-300">
      <div className="relative h-44 overflow-hidden bg-[#edf7f2]">
        <Image src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute top-3 left-3"><Badge label={label} /></div>
      </div>
      <div className="p-4">
        <h3 className="text-base font-black text-[#092d18] leading-snug line-clamp-2 group-hover:text-[#1A6B3C] transition-colors">{item.title}</h3>
        <p className="mt-2 text-xs text-[#7aab8e] font-medium">{formatDate(item.date)}</p>
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
    <section className="py-16 md:py-20 bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-9">
          <div className="flex items-center gap-4">
            <span className="block w-1.5 h-10 bg-[#FFD100] rounded-full" />
            <div>
              <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#1A6B3C]/70 mb-0.5">Son Dakika</p>
              <h2 className="text-3xl md:text-5xl font-black text-[#092d18] tracking-tight">
                Kulüp <span className="text-[#1A6B3C]">Haberleri</span>
              </h2>
            </div>
          </div>
          <Link href="/haberler"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-bold text-[#1A6B3C] border-2 border-[#1A6B3C]/30 rounded-xl px-5 py-2.5 hover:bg-[#1A6B3C] hover:text-white hover:border-[#1A6B3C] transition-all">
            Tümünü Gör →
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[55fr_45fr] gap-3 md:h-[460px]">
          <MainCard item={mainItem} label={catName(mainItem.category)} />
          <div className="flex flex-col gap-3">
            {sideItems.map((item) => <SideCard key={item.id} item={item} label={catName(item.category)} />)}
          </div>
        </div>

        {gridItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-4">
            {gridItems.map((item) => <GridCard key={item.id} item={item} label={catName(item.category)} />)}
          </div>
        )}
      </div>
    </section>
  )
}
