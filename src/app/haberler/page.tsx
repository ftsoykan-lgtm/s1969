'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { newsData, CATEGORY_LABELS, CATEGORY_VARIANT } from '@/data/news'
import { NewsItem } from '@/types'
import { formatDate } from '@/lib/utils'

const ALL_CATS = ['hepsi', ...Object.keys(CATEGORY_LABELS)] as const

function Badge({ category }: { category: NewsItem['category'] }) {
  const v = CATEGORY_VARIANT[category]
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase ${
      v === 'green' ? 'bg-[#1A6B3C] text-white' : 'bg-[#FFD100] text-[#092d18]'
    }`}>
      {CATEGORY_LABELS[category]}
    </span>
  )
}

function NewsCard({ item, featured = false }: { item: NewsItem; featured?: boolean }) {
  return (
    <Link
      href={`/haberler/${item.slug}`}
      className={`group relative block rounded-2xl overflow-hidden bg-white border border-[#ddeae2] shadow-sm hover:shadow-lg hover:border-[#1A6B3C]/40 transition-all duration-300 hover:-translate-y-0.5 ${
        featured ? 'md:col-span-2 h-[380px]' : 'h-[260px]'
      }`}
    >
      <Image
        src={item.imageUrl}
        alt={item.title}
        fill
        sizes={featured ? '(max-width: 768px) 100vw, 66vw' : '33vw'}
        className="object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/95 via-[#0f4a28]/40 to-transparent" />
      <div className="absolute inset-0 rounded-2xl border-2 border-transparent group-hover:border-[#FFD100] transition-colors duration-300 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 p-5">
        <Badge category={item.category} />
        <h2 className={`mt-2 text-white font-black leading-snug tracking-tight line-clamp-2 ${featured ? 'text-xl md:text-2xl' : 'text-base'}`}>
          {item.title}
        </h2>
        {featured && <p className="mt-1.5 text-white/60 text-sm line-clamp-2">{item.excerpt}</p>}
        <p className="mt-2 text-[11px] text-[#FFD100]/80 font-medium">{formatDate(item.date)}</p>
      </div>
    </Link>
  )
}

export default function HaberlerPage() {
  const [active, setActive] = useState<string>('hepsi')
  const filtered = active === 'hepsi' ? newsData : newsData.filter((n) => n.category === active)
  const [featured, ...rest] = filtered

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">Kulüp İletişimi</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Tüm <span className="text-[#FFD100]">Haberler</span>
          </h1>
          <div className="flex flex-wrap gap-2 mt-8">
            {ALL_CATS.map((cat) => (
              <button
                key={cat}
                onClick={() => setActive(cat)}
                className={`px-4 py-1.5 rounded-full text-xs font-black tracking-wide transition-all ${
                  active === cat
                    ? 'bg-[#FFD100] text-[#092d18]'
                    : 'border border-white/20 text-white/60 hover:border-white/50 hover:text-white'
                }`}
              >
                {cat === 'hepsi' ? 'Tümü' : CATEGORY_LABELS[cat as NewsItem['category']]}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {filtered.length === 0 ? (
          <p className="text-center py-20 text-[#3d6b52]">Bu kategoride haber bulunamadı.</p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {featured && <NewsCard item={featured} featured={filtered.length > 1} />}
            {rest.map((item) => <NewsCard key={item.id} item={item} />)}
          </div>
        )}
      </div>
    </div>
  )
}
