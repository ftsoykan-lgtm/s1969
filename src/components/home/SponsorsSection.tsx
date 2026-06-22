import { sponsorsData } from '@/data/sponsors'
import type { Sponsor } from '@/types'

export default function SponsorsSection({ sponsors = sponsorsData }: { sponsors?: Sponsor[] }) {
  const ana = sponsors.filter((s) => s.tier === 'ana')
  const resmi = sponsors.filter((s) => s.tier === 'resmi')
  const destekci = sponsors.filter((s) => s.tier === 'destekci')

  if (!sponsors.length) return null

  return (
    <section className="py-14 bg-white border-t border-[#ddeae2]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-3 mb-2">
            <span className="block w-8 h-0.5 bg-[#1A6B3C]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#1A6B3C]">Güç Birliği</p>
            <span className="block w-8 h-0.5 bg-[#1A6B3C]" />
          </div>
          <h2 className="text-2xl font-black text-[#092d18]">Sponsorlarımız</h2>
        </div>

        {ana.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e] text-center mb-5">Ana Sponsor</p>
            <div className="flex flex-wrap justify-center gap-4">
              {ana.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-24 px-12 rounded-2xl border-2 border-[#FFD100]/40 bg-[#FFD100]/5 hover:border-[#FFD100] hover:bg-[#FFD100]/10 transition-all shadow-sm">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-16 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {resmi.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e] text-center mb-4">Resmi Sponsorlar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {resmi.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-16 px-8 rounded-xl border border-[#1A6B3C]/20 bg-[#1A6B3C]/5 hover:border-[#1A6B3C]/50 hover:bg-[#1A6B3C]/10 transition-all">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-11 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {destekci.length > 0 && (
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e]/70 text-center mb-3">Destekçiler</p>
            <div className="flex flex-wrap justify-center gap-2">
              {destekci.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-14 px-7 rounded-lg border border-[#ddeae2] hover:border-[#7aab8e]/40 bg-[#f5f9f6] hover:bg-[#edf7f2] transition-all">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-9 w-auto opacity-60 hover:opacity-90 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
