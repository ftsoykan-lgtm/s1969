import { sponsorsData } from '@/data/sponsors'
import type { Sponsor } from '@/types'

export default function SponsorsSection({ sponsors = sponsorsData }: { sponsors?: Sponsor[] }) {
  const ana = sponsors.filter((s) => s.tier === 'ana')
  const resmi = sponsors.filter((s) => s.tier === 'resmi')
  const destekci = sponsors.filter((s) => s.tier === 'destekci')

  if (!sponsors.length) return null

  return (
    <section className="py-16 md:py-20 bg-white border-t border-[#ddeae2]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-3 mb-2.5">
            <span className="block w-8 h-0.5 bg-ugreen" />
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugreen">Güç Birliği</p>
            <span className="block w-8 h-0.5 bg-ugreen" />
          </div>
          <h2 className="font-heading text-3xl md:text-4xl font-extrabold text-ugreenm tracking-tight">Sponsorlarımız</h2>
        </div>

        {ana.length > 0 && (
          <div className="mb-8">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] text-center mb-5">Ana Sponsor</p>
            <div className="flex flex-wrap justify-center gap-4">
              {ana.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-28 px-14 rounded-2xl border-2 border-ugold/40 bg-ugold/5 hover:border-ugold hover:bg-ugold/10 transition-all shadow-sm">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-20 w-auto opacity-90 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {resmi.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] text-center mb-4">Resmi Sponsorlar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {resmi.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-20 px-10 rounded-xl border border-ugreen/20 bg-ugreen/5 hover:border-ugreen/50 hover:bg-ugreen/10 transition-all">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-14 w-auto opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {destekci.length > 0 && (
          <div>
            <p className="text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e]/70 text-center mb-3">Destekçiler</p>
            <div className="flex flex-wrap justify-center gap-2">
              {destekci.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer" title={s.name}
                  className="flex items-center justify-center h-16 px-8 rounded-lg border border-[#ddeae2] hover:border-[#7aab8e]/40 bg-[#f5f9f6] hover:bg-[#edf7f2] transition-all">
                  <img src={s.logoUrl} alt={s.name} className="object-contain max-h-11 w-auto opacity-60 hover:opacity-90 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
