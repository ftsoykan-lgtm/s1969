import Link from 'next/link'
import Image from 'next/image'
import { playersData } from '@/data/players'

export default function SquadPreview() {
  const featured = playersData.slice(0, 5)

  return (
    <section className="py-16 bg-[#0f4a28]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header — beyaz ve sarı */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-6 h-0.5 bg-[#FFD100]" />
              <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">2026-27 Sezonu</p>
            </div>
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">
              Takım <span className="text-[#FFD100]">Kadrosu</span>
            </h2>
          </div>
          <Link
            href="/kadro"
            className="hidden sm:inline-flex text-sm font-bold text-[#0f4a28] bg-[#FFD100] rounded-xl px-4 py-2 hover:bg-[#d4ad00] transition-colors shadow-md"
          >
            Tüm Kadro →
          </Link>
        </div>

        {/* Oyuncu kartları — beyaz kart üzerinde */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {featured.map((player) => (
            <Link
              key={player.id}
              href={`/kadro/${player.slug}`}
              className="group relative rounded-2xl overflow-hidden bg-white border-2 border-white/10 hover:border-[#FFD100] transition-all hover:-translate-y-1.5 duration-300 shadow-lg"
            >
              <div className="relative h-52 overflow-hidden bg-[#e8f5ee]">
                <Image
                  src={player.imageUrl}
                  alt={player.name}
                  fill
                  sizes="(max-width: 640px) 50vw, 20vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Forma numarası — sarı yuvarlak */}
                <div className="absolute top-3 left-3 w-9 h-9 flex items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] text-xs font-black shadow-md border-2 border-white">
                  {player.number}
                </div>
                {/* Yeşil alt gradient */}
                <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent" />
              </div>
              <div className="p-3 bg-white">
                <p className="text-[#092d18] text-sm font-black leading-tight">{player.name}</p>
                <p className="text-[#1A6B3C] text-[11px] font-bold mt-0.5">{player.position}</p>
                {/* Mini istatistik */}
                <div className="mt-2.5 flex gap-2">
                  <div className="flex-1 text-center bg-[#f8faf9] rounded-lg py-1.5">
                    <div className="text-sm font-black text-[#1A6B3C]">{player.stats.goals}</div>
                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Gol</div>
                  </div>
                  <div className="flex-1 text-center bg-[#f8faf9] rounded-lg py-1.5">
                    <div className="text-sm font-black text-[#FFD100]">{player.stats.assists}</div>
                    <div className="text-[9px] text-gray-400 font-semibold uppercase tracking-wide">Ast</div>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
