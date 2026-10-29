import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { SiteNews } from '@/lib/supabase/news-server'

/* Ortak haber kartları — ana sayfa "Kulüp Haberleri" (NewsHeroGrid) ve /haberler
   aynı görünümü kullanır; tasarım değişikliği tek yerden iki sayfaya yansır. */

export function NewsBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-extrabold tracking-widest uppercase bg-ugold text-ugreend">
      <span className="w-1.5 h-1.5 rounded-full bg-current opacity-70" />
      {label}
    </span>
  )
}

export function NewsMainCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-2xl overflow-hidden h-[420px] md:h-full shadow-xl shadow-black/10">
      <Image src={item.imageUrl} alt={item.title} fill priority sizes="(max-width: 768px) 100vw, 55vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/97 via-ugreend/45 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-ugold transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-7 md:p-8">
        <NewsBadge label={label} />
        <h2 className="mt-3 text-white text-3xl md:text-[2.6rem] font-extrabold leading-[1.05] tracking-[-0.02em] line-clamp-3">{item.title}</h2>
        <p className="mt-3 text-white/60 text-base md:text-lg line-clamp-2 max-w-xl">{item.excerpt}</p>
        <p className="mt-4 text-[12px] text-ugold font-bold uppercase tracking-widest">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

export function NewsSideCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-xl overflow-hidden flex-1 min-h-[130px] shadow-md shadow-black/10">
      <Image src={item.imageUrl} alt={item.title} fill sizes="(max-width: 768px) 100vw, 45vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
      <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/97 via-ugreend/55 to-transparent" />
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-ugreen transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-4">
        <NewsBadge label={label} />
        <h3 className="mt-1.5 text-white text-sm font-bold leading-snug line-clamp-2">{item.title}</h3>
        <p className="mt-1 text-[11px] text-white/40 font-medium">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

export function NewsGridCard({ item, label }: { item: SiteNews; label: string }) {
  return (
    <Link href={`/haberler/${item.slug}`}
      className="group relative block rounded-2xl overflow-hidden card-premium border-t-4 border-t-ugold">
      <div className="relative h-44 overflow-hidden bg-[#edf7f2]">
        <Image src={item.imageUrl} alt={item.title} fill sizes="25vw" className="object-cover media-zoom" />
        <div className="absolute top-3 left-3"><NewsBadge label={label} /></div>
      </div>
      <div className="p-5">
        <h3 className="text-lg font-extrabold text-ugreenm leading-tight tracking-tight line-clamp-2 group-hover:text-ugreen transition-colors">{item.title}</h3>
        <p className="mt-2.5 text-[11px] font-bold uppercase tracking-wide text-ugold">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}
