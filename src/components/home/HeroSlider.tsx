'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ArrowRight } from 'lucide-react'
import { newsData } from '@/data/news'

const slides = [
  {
    id: 1,
    title: 'Yeni Sezon,\nYeni Hedefler',
    subtitle: '2026-27 Sezonu',
    description: 'Şanlıurfaspor olarak şampiyonluk için sahaya çıkıyoruz. Birlikte daha güçlüyüz.',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
    cta: { label: 'Maç Merkezi', href: '/fikstur' },
  },
  {
    id: 2,
    title: 'Yıldız Transfer\nKadromuzda',
    subtitle: 'Transfer',
    description: 'Kadromuza güç katan yeni transferlerimizle yeni sezona iddialı giriyoruz.',
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
    cta: { label: 'Kadroyu Gör', href: '/kadro' },
  },
  {
    id: 3,
    title: 'Tribünde\nBuluşalım',
    subtitle: 'Taraftar',
    description: 'Her maçta tribünleri dolduruyoruz. Biletini al, takımının yanında ol.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
    cta: { label: 'Bilet Al', href: '/bilet' },
  },
]

const INTERVAL = 7000

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)
  const latest = newsData.slice(0, 3)

  const goTo = useCallback((idx: number) => {
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 350)
  }, [])

  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, INTERVAL)
    return () => clearInterval(t)
  }, [next, current])

  const slide = slides[current]

  return (
    <section className="relative h-[620px] md:h-[760px] overflow-hidden bg-[#0f4a28]">
      {/* Arka plan */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <Image src={slide.imageUrl} alt="" fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#071f10] via-[#0f4a28]/85 to-[#0f4a28]/20" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#071f10] via-transparent to-[#071f10]/30" />
      </div>

      {/* Sol tricolor aksan */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col z-10">
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-white/40" />
      </div>

      {/* İçerik */}
      <div className="relative h-full mx-auto max-w-7xl px-8 sm:px-10 lg:px-12 flex items-center">
        <div className={`max-w-2xl transition-all duration-500 ${fading ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>
          <div className="inline-flex items-center gap-2 mb-6 px-3.5 py-1.5 rounded-full bg-[#FFD100]/15 border border-[#FFD100]/40 backdrop-blur-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
            <span className="text-[#FFD100] text-[11px] font-black tracking-[0.2em] uppercase">{slide.subtitle}</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white leading-[0.95] tracking-tight mb-6 whitespace-pre-line drop-shadow-2xl">
            {slide.title}
          </h1>

          <p className="text-white/70 text-lg md:text-xl leading-relaxed mb-9 max-w-lg">{slide.description}</p>

          <div className="flex items-center gap-3 flex-wrap">
            <Link href={slide.cta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFD100] px-7 py-4 text-sm font-black text-[#0f4a28] hover:bg-[#e8c000] transition-all hover:scale-105 shadow-xl shadow-[#FFD100]/25 uppercase tracking-wide">
              {slide.cta.label}
              <ArrowRight size={16} />
            </Link>
            <Link href="/haberler"
              className="inline-flex items-center gap-2 text-sm font-bold text-white border border-white/30 px-7 py-4 rounded-xl hover:bg-white/10 hover:border-white/60 transition-all uppercase tracking-wide">
              Haberler
            </Link>
          </div>
        </div>
      </div>

      {/* Slayt göstergesi — ilerleme çubuklu */}
      <div className="absolute bottom-8 left-10 lg:left-12 z-10 flex items-center gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => goTo(i)} aria-label={`Slayt ${i + 1}`}
            className="h-1 rounded-full overflow-hidden transition-all duration-300 bg-white/25"
            style={{ width: i === current ? '44px' : '16px' }}>
            {i === current && (
              <span key={current} className="block h-full bg-[#FFD100]"
                style={{ animation: `heroProg ${INTERVAL}ms linear` }} />
            )}
          </button>
        ))}
      </div>

      {/* Altta öne çıkan haber şeridi (kulüp sitesi tarzı) */}
      <div className="hidden lg:flex absolute bottom-7 right-12 z-10 gap-2">
        {latest.map((n) => (
          <Link key={n.id} href={`/haberler/${n.slug}`}
            className="group relative w-44 h-24 rounded-xl overflow-hidden border border-white/15 hover:border-[#FFD100]/60 transition-all shadow-lg">
            <Image src={n.imageUrl} alt={n.title} fill sizes="180px" className="object-cover group-hover:scale-105 transition-transform duration-500" />
            <div className="absolute inset-0 bg-gradient-to-t from-[#071f10] via-[#071f10]/40 to-transparent" />
            <p className="absolute bottom-0 left-0 right-0 p-2.5 text-white text-[11px] font-bold leading-tight line-clamp-2">{n.title}</p>
          </Link>
        ))}
      </div>

      <style jsx global>{`
        @keyframes heroProg { from { width: 0% } to { width: 100% } }
      `}</style>
    </section>
  )
}
