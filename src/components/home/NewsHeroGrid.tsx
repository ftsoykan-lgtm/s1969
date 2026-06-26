import Link from 'next/link'
import Image from 'next/image'
import { ArrowUpRight } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { SiteNews } from '@/lib/supabase/news-server'

/* Kategori etiketi — düz, keskin, kurumsal (altın değil) */
function Tag({ label, light = false }: { label: string; light?: boolean }) {
  return (
    <span className={`inline-block text-[10px] font-bold tracking-[0.16em] uppercase px-2 py-1 ${
      light ? 'bg-white/15 text-white backdrop-blur-sm' : 'bg-[#1A6B3C] text-white'
    }`}>
      {label}
    </span>
  )
}

/* Manşet — büyük medya kartı */
function MainCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block overflow-hidden h-[440px] md:h-full bg-[#092d18]">
      <Image src={item.imageUrl} alt={item.title} fill priority sizes="(max-width: 768px) 100vw, 60vw"
        className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]" />
      <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/35 to-transparent" />
      {/* alt altın hairline — sadece hover'da */}
      <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#FFD100] transition-all duration-500 group-hover:w-full" />
      <div className="absolute inset-x-0 bottom-0 p-6 md:p-8">
        <Tag label={label} light />
        <h2 className="mt-3 text-white text-2xl md:text-[2rem] font-bold leading-[1.12] tracking-tight line-clamp-3">{item.title}</h2>
        <p className="mt-2.5 text-white/60 text-[15px] leading-relaxed line-clamp-2 max-w-xl">{item.excerpt}</p>
        <p className="mt-4 text-[12px] text-white/45 font-medium tracking-wide uppercase">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

/* Yan kart — yatay medya satırı */
function SideCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative flex gap-4 bg-white border border-[#e2ece6] hover:border-[#1A6B3C]/35 transition-colors p-2.5 flex-1 min-h-0">
      <div className="relative w-28 sm:w-32 shrink-0 overflow-hidden bg-[#edf7f2]">
        <Image src={item.imageUrl} alt={item.title} fill sizes="160px"
          className="object-cover transition-transform duration-500 group-hover:scale-105" />
      </div>
      <div className="min-w-0 flex flex-col justify-center pr-2 py-1">
        <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#1A6B3C] mb-1.5">{label}</span>
        <h3 className="text-[#0e2a1c] text-sm font-bold leading-snug line-clamp-2 group-hover:text-[#1A6B3C] transition-colors">{item.title}</h3>
        <p className="mt-1.5 text-[11px] text-[#7aab8e] font-medium uppercase tracking-wide">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

/* Alt ızgara kartı — dikey medya kartı */
function GridCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block bg-white border border-[#e2ece6] hover:border-[#1A6B3C]/35 hover:shadow-[0_14px_34px_-20px_rgba(9,45,24,0.4)] transition-all">
      <span className="absolute top-0 left-0 h-[3px] w-0 bg-[#1A6B3C] transition-all duration-400 group-hover:w-full z-10" />
      <div className="relative h-44 overflow-hidden bg-[#edf7f2]">
        <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width:1024px) 50vw, 25vw"
          className="object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute bottom-0 left-0"><Tag label={label} /></div>
      </div>
      <div className="p-4">
        <h3 className="text-[15px] font-bold text-[#0e2a1c] leading-snug line-clamp-2 group-hover:text-[#1A6B3C] transition-colors">{item.title}</h3>
        <p className="mt-2.5 text-[11px] text-[#7aab8e] font-medium uppercase tracking-wide">{formatDate(item.date)}</p>
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
    <section className="u-sec bg-white">
      <div className="u-wrap">
        <div className="flex items-end justify-between mb-9">
          <div>
            <span className="u-eyebrow">Son Dakika</span>
            <h2 className="u-h2 mt-2">Kulüp Haberleri</h2>
          </div>
          <Link href="/haberler" className="hidden sm:inline-flex u-btn u-btn--ghost">
            Tüm Haberler <ArrowUpRight size={16} className="text-[#1A6B3C]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-[60fr_40fr] gap-3 md:h-[460px]">
          <MainCard item={mainItem} label={catName(mainItem.category)} />
          <div className="flex flex-col gap-3">
            {sideItems.map((item) => <SideCard key={item.id} item={item} label={catName(item.category)} />)}
          </div>
        </div>

        {gridItems.length > 0 && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-3">
            {gridItems.map((item) => <GridCard key={item.id} item={item} label={catName(item.category)} />)}
          </div>
        )}

        <div className="sm:hidden mt-6">
          <Link href="/haberler" className="u-btn u-btn--ghost w-full justify-center">
            Tüm Haberler <ArrowUpRight size={16} className="text-[#1A6B3C]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
