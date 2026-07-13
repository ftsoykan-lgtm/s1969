import Link from 'next/link'
import Image from 'next/image'
import { Newspaper, ArrowRight } from 'lucide-react'
import type { SiteNews } from '@/lib/supabase/news-server'

/* İlgili haberler — maç detayında, rakip adına göre otomatik eşleşen haberler.
   Merkezî haber verisinden (getNews) beslenir; elle bağlama gerekmez. */

function fmtDate(iso: string): string {
  if (!iso) return ''
  const [y, m, d] = iso.split('-')
  return d && m && y ? `${d}.${m}.${y}` : iso
}

export default function RelatedNews({ news }: { news: SiteNews[] }) {
  if (!news.length) return null
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
      <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
        <Newspaper size={14} className="text-ugreen" />
        <span className="inline-block w-1 h-4 bg-ugold rounded-full" />İlgili Haberler
      </h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {news.map((n) => (
          <Link key={n.id} href={`/haberler/${n.slug}`}
            className="group flex items-center gap-3 rounded-xl border border-[#edf7f2] p-2.5 hover:border-ugreen/30 hover:bg-[#f8faf9] transition-all">
            <div className="relative w-16 h-16 shrink-0 rounded-lg overflow-hidden bg-[#f5f9f6]">
              {n.imageUrl
                ? <Image src={n.imageUrl} alt="" fill unoptimized sizes="64px" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                : <span className="flex h-full w-full items-center justify-center text-[#7aab8e]"><Newspaper size={18} /></span>}
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[13px] font-bold text-ugreenm leading-tight line-clamp-2 group-hover:text-ugreen transition-colors">{n.title}</p>
              <p className="text-[10px] text-[#7aab8e] mt-1 flex items-center gap-1">{fmtDate(n.date)}<ArrowRight size={10} className="opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all text-ugreen" /></p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
