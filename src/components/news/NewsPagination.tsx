import Link from 'next/link'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { newsListHref, pageNumbers } from '@/lib/news'

const BOX = 'flex h-11 min-w-11 items-center justify-center rounded-xl px-3 text-sm font-extrabold tabular-nums transition-colors'

/* Numaralı sayfalama — URL tabanlı (?sayfa=), kategori filtresi korunur. */
export default function NewsPagination({ page, totalPages, kategori }: { page: number; totalPages: number; kategori: string | null }) {
  if (totalPages <= 1) return null
  const href = (p: number) => newsListHref({ kategori, sayfa: p })
  const idle = `${BOX} border border-[#ddeae2] bg-white text-ugreenm hover:border-ugreen hover:text-ugreen focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold`

  return (
    <nav aria-label="Sayfalama" className="flex flex-wrap items-center justify-center gap-2">
      {page > 1 && <Link href={href(page - 1)} className={idle} aria-label="Önceki sayfa"><ChevronLeft size={16} /></Link>}
      {pageNumbers(page, totalPages).map((p, i) =>
        p === '…'
          ? <span key={`gap-${i}`} aria-hidden className={`${BOX} text-[#9cbcaa]`}>…</span>
          : p === page
            ? <span key={p} aria-current="page" className={`${BOX} bg-ugreen text-white shadow-[0_6px_16px_-8px_rgba(27,94,68,0.8)]`}>{p}</span>
            : <Link key={p} href={href(p)} className={idle}>{p}</Link>,
      )}
      {page < totalPages && <Link href={href(page + 1)} className={idle} aria-label="Sonraki sayfa"><ChevronRight size={16} /></Link>}
    </nav>
  )
}
