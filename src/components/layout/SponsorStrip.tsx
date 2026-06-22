import { sponsorsData } from '@/data/sponsors'

export default function SponsorStrip() {
  if (!sponsorsData.length) return null
  return (
    <section className="bg-white border-t border-[#ddeae2] py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 mb-5 justify-center">
          <span className="block w-6 h-0.5 bg-[#FFD100]" />
          <p className="text-[11px] font-black tracking-[0.2em] uppercase text-[#7aab8e]">Sponsorlarımız</p>
          <span className="block w-6 h-0.5 bg-[#FFD100]" />
        </div>
        <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
          {sponsorsData.map((s) => (
            <a key={s.id} href={s.website} target="_blank" rel="noopener noreferrer"
              title={s.name}
              className="grayscale opacity-60 hover:grayscale-0 hover:opacity-100 transition-all duration-300">
              <img src={s.logoUrl} alt={s.name} className="h-9 sm:h-10 w-auto object-contain" />
            </a>
          ))}
        </div>
      </div>
    </section>
  )
}
