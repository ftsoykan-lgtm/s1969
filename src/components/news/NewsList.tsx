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
        <div className="bg-white border border-[#e2ece6] p-12 text-center">
          <p className="text-sm font-bold text-[#0e2a1c]">Bu kategoride haber bulunmuyor</p>
        </div>
      ) : (
        <>
          {/* Öne çıkan */}
          {featured && active === 'hepsi' && (
            <Link href={`/haberler/${featured.slug}`}
              className="group relative block overflow-hidden h-[340px] md:h-[440px] mb-5 bg-[#092d18]">
              <Image src={featured.imageUrl} alt={featured.title} fill priority sizes="100vw" className="object-cover transition-transform duration-[800ms] ease-out group-hover:scale-[1.04]" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/35 to-transparent" />
              <span className="absolute bottom-0 left-0 h-[3px] w-0 bg-[#FFD100] transition-all duration-500 group-hover:w-full" />
              <div className="absolute bottom-0 left-0 right-0 p-7 md:p-9 max-w-3xl">
                <span className="inline-block px-2 py-1 text-[10px] font-bold tracking-[0.16em] uppercase bg-white/15 text-white backdrop-blur-sm">{catName(featured.category)}</span>
                <h2 className="mt-3 text-white text-2xl md:text-[2.2rem] font-bold leading-[1.12] tracking-tight line-clamp-3">{featured.title}</h2>
                <p className="mt-2.5 text-white/60 text-[15px] line-clamp-2 max-w-2xl">{featured.excerpt}</p>
                <p className="mt-4 text-[12px] text-white/45 font-medium uppercase tracking-wide">{formatDate(featured.date)}</p>
              </div>
            </Link>
          )}

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {(active === 'hepsi' ? rest : filtered).map((n) => (
              <Link key={n.id} href={`/haberler/${n.slug}`}
                className="group relative block bg-white border border-[#e2ece6] hover:border-[#1A6B3C]/35 hover:shadow-[0_14px_34px_-20px_rgba(9,45,24,0.4)] transition-all">
                <span className="absolute top-0 left-0 h-[3px] w-0 bg-[#1A6B3C] transition-all duration-400 group-hover:w-full z-10" />
                <div className="relative h-48 overflow-hidden bg-[#edf7f2]">
                  <Image src={n.imageUrl} alt={n.title} fill sizes="33vw" className="object-cover group-hover:scale-105 transition-transform duration-500" />
                  <div className="absolute bottom-0 left-0">
                    <span className="inline-block px-2 py-1 text-[10px] font-bold tracking-[0.16em] uppercase bg-[#1A6B3C] text-white">{catName(n.category)}</span>
                  </div>
                </div>
                <div className="p-5">
                  <h3 className="text-[15px] font-bold text-[#0e2a1c] leading-snug line-clamp-2 group-hover:text-[#1A6B3C] transition-colors">{n.title}</h3>
                  <p className="mt-2 text-sm text-[#3d6b52] line-clamp-2">{n.excerpt}</p>
                  <p className="mt-3 text-[11px] text-[#7aab8e] font-medium uppercase tracking-wide">{formatDate(n.date)}</p>
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
      className={`px-4 py-2 text-[13px] font-semibold tracking-wide transition-colors ${
        active ? 'bg-[#1A6B3C] text-white' : 'bg-white border border-[#e2ece6] text-[#3d6b52] hover:border-[#1A6B3C]/40'
      }`}>
      {children}
    </button>
  )
}
