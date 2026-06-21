import Image from 'next/image'
import { sponsorsData } from '@/data/sponsors'

export default function SponsorsSection() {
  const ana = sponsorsData.filter((s) => s.tier === 'ana')
  const resmi = sponsorsData.filter((s) => s.tier === 'resmi')
  const destekci = sponsorsData.filter((s) => s.tier === 'destekci')

  return (
    <section className="py-14 bg-white border-t border-gray-100">
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
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 text-center mb-5">Ana Sponsor</p>
            <div className="flex flex-wrap justify-center gap-4">
              {ana.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-16 px-8 rounded-2xl border-2 border-[#FFD100]/40 bg-[#FFD100]/5 hover:border-[#FFD100] hover:bg-[#FFD100]/10 transition-all shadow-sm">
                  <Image src={s.logoUrl} alt={s.name} width={160} height={48} className="object-contain max-h-10 opacity-80 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {resmi.length > 0 && (
          <div className="mb-6">
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-400 text-center mb-4">Resmi Sponsorlar</p>
            <div className="flex flex-wrap justify-center gap-3">
              {resmi.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-12 px-6 rounded-xl border border-[#1A6B3C]/20 bg-[#1A6B3C]/5 hover:border-[#1A6B3C]/50 hover:bg-[#1A6B3C]/10 transition-all">
                  <Image src={s.logoUrl} alt={s.name} width={140} height={40} className="object-contain max-h-8 opacity-70 hover:opacity-100 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}

        {destekci.length > 0 && (
          <div>
            <p className="text-[10px] font-black tracking-widest uppercase text-gray-300 text-center mb-3">Destekçiler</p>
            <div className="flex flex-wrap justify-center gap-2">
              {destekci.map((s) => (
                <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
                  className="flex items-center justify-center h-10 px-5 rounded-lg border border-gray-200 hover:border-gray-300 bg-gray-50 hover:bg-gray-100 transition-all">
                  <Image src={s.logoUrl} alt={s.name} width={120} height={36} className="object-contain max-h-7 opacity-50 hover:opacity-80 transition-opacity" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  )
}
