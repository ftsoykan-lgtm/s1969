import Link from 'next/link'

/* Paylaşılan premium sezon seçici — takvim, geçmiş maçlar vb. aynı bileşeni kullanır.
   Güncel sezon URL'de sezon parametresi taşımaz (kanonik). */
export default function SeasonPills({
  seasons, active, current, basePath, label = 'Sezon',
}: {
  seasons: string[]
  active: string
  current: string
  basePath: string
  label?: string
}) {
  if (seasons.length <= 1) return null
  return (
    <div className="flex items-center gap-2">
      <span className="hidden sm:block text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#7aab8e]">{label}</span>
      <div className="flex items-center gap-1 bg-white border border-[#ddeae2] rounded-full p-1 shadow-sm">
        {seasons.map((s) => {
          const isCurrent = s === current
          const isActive = s === active
          return (
            <Link
              key={s}
              href={isCurrent ? basePath : `${basePath}?sezon=${s}`}
              className={`relative px-4 py-2 rounded-full text-[12px] font-extrabold tracking-wide tabular-nums transition-all ${
                isActive
                  ? 'bg-gradient-to-b from-ugreen to-ugreend text-white shadow-[0_4px_12px_-4px_rgba(12,46,34,0.5)]'
                  : 'text-utxt2 hover:bg-[#f5f9f6] hover:text-ugreenm'
              }`}
            >
              {s}
              {isCurrent && (
                <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${isActive ? 'bg-ugold' : 'bg-ugreen/50'}`} />
              )}
            </Link>
          )
        })}
      </div>
    </div>
  )
}
