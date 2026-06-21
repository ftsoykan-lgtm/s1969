import Link from 'next/link'
import { getLiveTff } from '@/lib/supabase/tff-server'

export default async function SquadPreview() {
  const { squad } = await getLiveTff()
  const featured = squad.players.slice(0, 12)

  return (
    <section className="py-16 bg-[#0f4a28]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <span className="block w-6 h-0.5 bg-[#FFD100]" />
              <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">
                Profesyonel Takım{squad.season ? ` · ${squad.season}` : ''}
              </p>
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

        {featured.length === 0 ? (
          <div className="bg-white/5 border border-white/10 rounded-2xl p-10 text-center">
            <p className="text-white font-bold">Kadro Güncelleniyor...</p>
            <p className="text-white/40 text-sm mt-1">Güncel sezon kadrosu yakında yayınlanacak.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {featured.map((p, i) => {
              const initials = p.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
              return (
                <div key={`${p.name}-${i}`}
                  className="flex items-center gap-3 rounded-2xl bg-white/5 border border-white/10 hover:border-[#FFD100]/50 hover:bg-white/8 transition-all p-3.5">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FFD100] text-[#0f4a28] text-sm font-black shrink-0">
                    {initials}
                  </div>
                  <div className="min-w-0">
                    <p className="text-white text-sm font-bold truncate">{p.name}</p>
                    <p className="text-[#FFD100]/60 text-[11px] font-bold">Profesyonel</p>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </section>
  )
}
