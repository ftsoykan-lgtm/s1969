import Link from 'next/link'

export interface CardPlayer {
  name: string
  slug: string
  photoUrl: string | null
  number: number | null
  position: string | null
  flagCode: string | null
}

/** Ülke kodu → bayrak emoji (yedek, çoğu sistemde görsel kullanılır) */
export function flagEmoji(code?: string | null): string {
  if (!code) return ''
  const map: Record<string, string> = {
    tr: '🇹🇷', br: '🇧🇷', pt: '🇵🇹', sn: '🇸🇳', it: '🇮🇹', fr: '🇫🇷', de: '🇩🇪',
  }
  return map[code.toLowerCase()] ?? '🌍'
}

export default function PlayerCard({ player }: { player: CardPlayer }) {
  const initials = player.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  const hasPhoto = !!player.photoUrl
  const code = player.flagCode?.toLowerCase()

  return (
    <Link href={`/oyuncu/${player.slug}`}
      className="group relative block rounded-2xl overflow-hidden bg-gradient-to-b from-ugreens to-ugreendd shadow-[0_18px_40px_-20px_rgba(9,45,24,0.7)] hover:shadow-[0_30px_60px_-24px_rgba(9,45,24,0.8)] hover:-translate-y-2 transition-all duration-300 ring-1 ring-white/5">
      {/* üst altın aksan */}
      <span className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-transparent via-ugold to-transparent z-20" />
      {/* hover'da altın çerçeve */}
      <span className="pointer-events-none absolute inset-0 rounded-2xl ring-2 ring-ugold/0 group-hover:ring-ugold/60 transition-all duration-300 z-20" />

      <div className="relative aspect-[3/4] overflow-hidden">
        {hasPhoto ? (
          <img src={player.photoUrl!} alt={player.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full relative flex items-center justify-center overflow-hidden">
            {/* atmosfer */}
            <span className="absolute h-44 w-44 rounded-full bg-ugold/10 blur-3xl" />
            <span className="absolute -top-10 -right-10 h-40 w-40 rounded-full bg-ugreen/40 blur-3xl" />
            {/* dev soluk numara/şfk filigranı */}
            <span aria-hidden className="absolute -bottom-6 -left-2 font-heading text-[7rem] leading-none font-extrabold text-white/[0.04] select-none">ŞFK</span>
            {/* altın gradient baş harfler */}
            <span className="relative font-heading text-[5.5rem] font-extrabold tracking-tight bg-gradient-to-b from-white/30 via-ugold/40 to-ugold/10 bg-clip-text text-transparent select-none drop-shadow">{initials}</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Bayrak — gerçek görsel */}
        {code && (
          <img src={`https://flagcdn.com/h24/${code}.png`} alt={code}
            className="absolute top-4 left-4 h-5 w-auto rounded-[3px] shadow-md ring-1 ring-black/20 z-10" />
        )}
        {/* Numara */}
        {player.number != null && (
          <div className="absolute top-1 right-4 text-6xl font-extrabold text-white/90 drop-shadow-lg leading-none tabular-nums italic z-10">
            {player.number}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-36 bg-gradient-to-t from-ugreendd via-ugreendd/75 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-center z-10">
        <p className="text-white font-extrabold text-lg uppercase leading-tight tracking-wide line-clamp-1 drop-shadow">{player.name}</p>
        <div className="mx-auto my-2.5 h-0.5 w-9 bg-ugold rounded-full group-hover:w-16 transition-all duration-300" />
        <p className="text-ugold text-xs font-bold uppercase tracking-[0.15em]">{player.position || (player.number != null ? `Forma ${player.number}` : 'Profesyonel')}</p>
      </div>
    </Link>
  )
}
