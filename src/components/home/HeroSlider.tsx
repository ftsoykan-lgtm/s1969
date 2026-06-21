'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react'

const slides = [
  {
    id: 1,
    title: 'Yeni Sezon,\nYeni Hedefler',
    subtitle: '2026-27 Sezonu Başlıyor',
    description: 'Şanlıurfaspor olarak bu sezon şampiyonluk için sahaya çıkıyoruz. Birlikte daha güçlüyüz!',
    imageUrl: 'https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1600&q=80',
    cta: { label: 'Fikstürü İncele', href: '/fikstur' },
  },
  {
    id: 2,
    title: 'Yeni Transfer:\nPedro Fernandez',
    subtitle: 'Portekizli Yıldız Aramızda',
    description: "Portekiz Süper Ligi'nden gelen yıldız orta saha oyuncumuz kadromuza güç katıyor.",
    imageUrl: 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1600&q=80',
    cta: { label: 'Kadroyu Gör', href: '/kadro' },
  },
  {
    id: 3,
    title: "GAP Arena'da\nBize Katıl",
    subtitle: 'Taraftar Gücümüzle Kazanıyoruz',
    description: 'Bu sezon her maçta tribünleri dolduruyoruz. Biletini şimdi al, takımının yanında ol.',
    imageUrl: 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1600&q=80',
    cta: { label: 'Bilet Al', href: '/bilet' },
  },
]

export default function HeroSlider() {
  const [current, setCurrent] = useState(0)
  const [fading, setFading] = useState(false)

  const goTo = useCallback((idx: number) => {
    if (fading) return
    setFading(true)
    setTimeout(() => { setCurrent(idx); setFading(false) }, 350)
  }, [fading])

  const prev = () => goTo((current - 1 + slides.length) % slides.length)
  const next = useCallback(() => goTo((current + 1) % slides.length), [current, goTo])

  useEffect(() => {
    const t = setInterval(next, 6500)
    return () => clearInterval(t)
  }, [next])

  const slide = slides[current]

  return (
    <section className="relative h-[580px] md:h-[660px] overflow-hidden">
      {/* Arka plan görseli */}
      <div className={`absolute inset-0 transition-opacity duration-500 ${fading ? 'opacity-0' : 'opacity-100'}`}>
        <Image src={slide.imageUrl} alt={slide.title} fill priority sizes="100vw" className="object-cover" />
        {/* Koyu yeşil gradient — kulüp rengi */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#092d18]/95 via-[#0f4a28]/80 to-[#0f4a28]/30" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/70 via-transparent to-transparent" />
      </div>

      {/* Sol sarı–yeşil dikey aksan */}
      <div className="absolute left-0 top-0 bottom-0 w-1.5 flex flex-col">
        <div className="flex-1 bg-[#FFD100]" />
        <div className="flex-1 bg-[#1A6B3C]" />
        <div className="flex-1 bg-white/30" />
      </div>

      {/* İçerik */}
      <div className="relative h-full mx-auto max-w-7xl px-8 sm:px-10 lg:px-12 flex items-center">
        <div className={`max-w-2xl transition-all duration-500 ${fading ? 'opacity-0 translate-y-6' : 'opacity-100 translate-y-0'}`}>

          {/* Sarı badge */}
          <div className="inline-flex items-center gap-2 mb-5 px-3 py-1.5 rounded-full bg-[#FFD100]/20 border border-[#FFD100]/40">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FFD100] animate-pulse" />
            <span className="text-[#FFD100] text-xs font-black tracking-widest uppercase">{slide.subtitle}</span>
          </div>

          {/* Başlık — beyaz */}
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight mb-5 whitespace-pre-line">
            {slide.title}
          </h1>

          {/* Açıklama */}
          <p className="text-white/65 text-lg leading-relaxed mb-8 max-w-lg">{slide.description}</p>

          {/* Butonlar — sarı CTA + beyaz ikincil */}
          <div className="flex items-center gap-4 flex-wrap">
            <Link
              href={slide.cta.href}
              className="inline-flex items-center gap-2 rounded-xl bg-[#FFD100] px-6 py-3.5 text-sm font-black text-[#0f4a28] hover:bg-[#d4ad00] transition-all hover:scale-105 shadow-lg shadow-[#FFD100]/25"
            >
              {slide.cta.label}
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/haberler"
              className="inline-flex items-center gap-2 text-sm font-semibold text-white border border-white/25 px-6 py-3.5 rounded-xl hover:bg-white/10 hover:border-white/50 transition-all"
            >
              Son Haberler
            </Link>
          </div>
        </div>
      </div>

      {/* Slayt kontrolleri */}
      <div className="absolute bottom-8 left-10 flex items-center gap-3">
        <button onClick={prev} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15" aria-label="Önceki">
          <ChevronLeft size={18} />
        </button>
        <div className="flex gap-2 items-center">
          {slides.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slayt ${i + 1}`}
              className="transition-all duration-300 rounded-full"
              style={{
                width: i === current ? '28px' : '8px',
                height: '8px',
                backgroundColor: i === current ? '#FFD100' : 'rgba(255,255,255,0.3)',
              }}
            />
          ))}
        </div>
        <button onClick={next} className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-all border border-white/15" aria-label="Sonraki">
          <ChevronRight size={18} />
        </button>
      </div>

      <div className="absolute bottom-9 right-10 text-white/25 text-sm font-mono tabular-nums">
        {String(current + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}
      </div>
    </section>
  )
}
