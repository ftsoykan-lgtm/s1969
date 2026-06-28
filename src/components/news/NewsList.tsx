'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import type { SiteNews, NewsCategory } from '@/lib/supabase/news-server'

export default function NewsList({ news, categories }: { news: SiteNews[]; categories: NewsCategory[] }) {
  const [active, setActive] = useState('hepsi')
  const catName = (slug: string) => categories.find((c) => c.slug === slug)?.name ?? slug
  const filtered = active === 'hepsi' ? news : news.filter((n) => n.category === active)

  const [featured, ...rest] = filtered

  return (
    <div>
      {/* Kategori filtreleri */}
      <div className="flex flex-wrap gap-2 mb-10">
        <Pill active={active === 'hepsi'} onClick={() => setActive('hepsi')}>Tümü</Pill>
        {categories.map((c) => (
          <Pill key={c.slug} active={active === c.slug} onClick={() => setActive(c.slug)}>{c.name}</Pill>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="bg-white rounded-2xl border border-[#ddeae2] p-12 text-center">
          <p className="text-sm font-bold text-ugreenm">Bu kategoride haber bulunmuyor</p>
        </div>
      ) : (
        <>
          {/* Öne çıkan */}
          {featured && active === 'hepsi' && (
            <Link href={`/haberler/${featured.slug}`}
              className="group relative block rounded-2xl overflow-hidden h-[340px] md:h-[420px] mb-6 shadow-xl shadow-black/10">
              <Image src={featured.imageUrl} alt={featured.title} fill priority sizes="100vw" className="object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/97 via-ugreend/40 to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9 max-w-3xl">
                <span className="inline-block px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase bg-ugold text-ugreend">{catName(featured.category)}</span>
                <h2 className="mt-3 text-white text-2xl md:text-4xl font-black leading-snug tracking-tight line-clamp-3">{featured.title}</h2>
                <p className="mt-2 text-white/60 text-base line-clamp-2 max-w-2xl">{featured.excerpt}</p>
                <p className="mt-3 text-[12px] text-ugold/70 font-medium">{formatDate(featured.date)}</p>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {(active === 'hepsi' ? rest : filtered).map((n) => (
              <Link key={n.id} href={`/haberler/${n.slug}`}
                className="group block rounded-2xl overflow-hidden card-premium">
                <div className="relative h-48 overflow-hidden bg-[#edf7f2]">
                  <Image src={n.imageUrl} alt={n.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute top-3 left-3">
                    <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black tracking-widest uppercase bg-ugold text-ugreend">{catName(n.category)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-base font-black text-ugreenm leading-snug line-clamp-2 group-hover:text-ugreen transition-colors">{n.title}</h3>
                  <p className="mt-2 text-sm text-utxt2 line-clamp-2">{n.excerpt}</p>
                  <p className="mt-3 text-xs text-[#7aab8e] font-medium">{formatDate(n.date)}</p>
                </div>
              </Link>
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function Pill({ active, onClick, children }: { active: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button onClick={onClick}
      className={`px-5 py-2.5 rounded-full text-sm font-black tracking-wide transition-all ${
        active ? 'bg-ugreen text-white shadow-sm' : 'bg-white border border-[#ddeae2] text-utxt2 hover:border-ugreen/40'
      }`}>
      {children}
    </button>
  )
}
