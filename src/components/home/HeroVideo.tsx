import Link from 'next/link'
import { ChevronDown } from 'lucide-react'
import type { ClubInfo } from '@/data/club'

export default function HeroVideo({ club, src }: { club: ClubInfo; src: string }) {
  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')

  return (
    <section className="relative bg-[#092d18] overflow-hidden">
      <div className="relative h-[60vh] min-h-[420px] md:h-[78vh] md:max-h-[760px]">
        {/* Video */}
        <video
          className="absolute inset-0 w-full h-full object-cover"
          src={src}
          autoPlay
          muted
          loop
          playsInline
          preload="auto"
        />

        {/* Karartma katmanları (okunabilirlik) */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#04130b] via-[#04130b]/30 to-[#04130b]/40" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#04130b]/60 to-transparent" />

        {/* İçerik */}
        <div className="relative h-full mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-14 md:pb-20">
          <div className="flex items-center gap-4 mb-5">
            {hasLogo ? (
              <img src={club.logoUrl} alt={club.name} className="h-16 w-16 md:h-20 md:w-20 rounded-2xl object-contain bg-white/5 ring-1 ring-white/15 shadow-2xl" />
            ) : (
              <div className="flex h-16 w-16 md:h-20 md:w-20 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FFD100] to-[#d4ad00] text-[#0f4a28] font-black text-xl shadow-2xl">{club.shortCode}</div>
            )}
            <div>
              <p className="text-[10px] md:text-[11px] font-black tracking-[0.3em] uppercase text-[#FFD100]/70 mb-1">
                Est. {club.founded} · {club.nickname} · {club.league}
              </p>
              <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight uppercase leading-[0.95] drop-shadow-2xl">
                {club.name}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <Link href="/mac-merkezi"
              className="inline-flex items-center gap-2 bg-[#FFD100] hover:bg-[#e8c000] text-[#0f4a28] font-black text-[12px] tracking-wide uppercase px-5 py-3 rounded-full transition-all shadow-lg shadow-[#FFD100]/20">
              Maç Merkezi
            </Link>
            <Link href="/haberler"
              className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm border border-white/20 text-white font-black text-[12px] tracking-wide uppercase px-5 py-3 rounded-full transition-all">
              Haberler
            </Link>
          </div>
        </div>

        {/* Aşağı oku */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 text-white/40 animate-bounce">
          <ChevronDown size={22} />
        </div>
      </div>

      {/* Alt altın hat */}
      <div className="h-1 bg-gradient-to-r from-[#1A6B3C] via-[#FFD100] to-[#1A6B3C]" />
    </section>
  )
}
