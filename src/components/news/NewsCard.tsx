import Link from 'next/link'
import Image from 'next/image'
import { CalendarDays, Clock } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import { readingMinutes } from '@/lib/news'
import type { SiteNews } from '@/lib/supabase/news-server'
import type { CategoryTone } from './categoryTone'

type Props = {
  item: SiteNews
  categoryLabel: string
  tone: CategoryTone
  /** compact: İlgili Haberler'deki küçük 4'lü kart (özet yok) */
  compact?: boolean
}

/* Haber kartı — görsel (16:10) + kategori rozeti, başlık, özet, tarih · okuma süresi.
   Kartın tamamı tek link; hover'da görsel yakınlaşır, başlık yeşile döner. */
export default function NewsCard({ item, categoryLabel, tone, compact = false }: Props) {
  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-[#e3ede7] bg-white shadow-[0_1px_2px_rgba(16,63,46,0.04)] transition-all duration-300 hover:-translate-y-0.5 hover:border-ugreen/25 hover:shadow-[0_14px_34px_-16px_rgba(16,63,46,0.28)]">
      <div className="relative aspect-[16/10] overflow-hidden bg-[#edf5f0]">
        {item.imageUrl && (
          <Image src={item.imageUrl} alt="" fill sizes={compact ? '(min-width:1024px) 280px, 50vw' : '(min-width:1024px) 400px, 100vw'}
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]" />
        )}
        <span className={`absolute left-3 top-3 rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.12em] shadow-sm ${tone.badge}`}>
          {categoryLabel}
        </span>
      </div>

      <div className={`flex flex-1 flex-col ${compact ? 'p-4' : 'p-5'}`}>
        <h3 className={`font-heading font-extrabold leading-snug tracking-tight text-ugreenm transition-colors group-hover:text-ugreen line-clamp-2 ${compact ? 'text-[15px]' : 'text-lg'}`}>
          <Link href={`/haberler/${item.slug}`} className="after:absolute after:inset-0 focus-visible:outline-none focus-visible:after:rounded-2xl focus-visible:after:ring-2 focus-visible:after:ring-ugold">
            {item.title}
          </Link>
        </h3>
        {!compact && item.excerpt && <p className="mt-2 text-sm leading-relaxed text-utxt2 line-clamp-3">{item.excerpt}</p>}
        <div className="mt-auto flex items-center gap-3 pt-4 text-[11px] font-bold uppercase tracking-wide text-[#7aab8e]">
          <span className="inline-flex items-center gap-1.5"><CalendarDays size={12} aria-hidden />{formatDate(item.date)}</span>
          {!compact && <span className="inline-flex items-center gap-1.5"><Clock size={12} aria-hidden />{readingMinutes(item.content)} dk</span>}
        </div>
      </div>
    </article>
  )
}
