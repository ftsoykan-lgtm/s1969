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
      className="group relative block rounded-2xl overflow-hidden bg-gradient-to-b from-ugreen to-[#0b3a20] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ring-1 ring-white/5">
      <div className="relative aspect-[3/4] overflow-hidden">
        {hasPhoto ? (
          <img src={player.photoUrl!} alt={player.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#1f7a45,#0b3a20)]">
            <span className="text-6xl font-extrabold text-white/15 select-none">{initials}</span>
          </div>
        )}

        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-black/40 to-transparent" />

        {/* Bayrak — gerçek görsel */}
        {code && (
          <img src={`https://flagcdn.com/h24/${code}.png`} alt={code}
            className="absolute top-3.5 left-3.5 h-5 w-auto rounded-[3px] shadow-md ring-1 ring-black/20" />
        )}
        {/* Numara */}
        {player.number != null && (
          <div className="absolute top-1 right-3.5 text-6xl font-extrabold text-white/90 drop-shadow-lg leading-none tabular-nums italic">
            {player.number}
          </div>
        )}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0b3a20] via-[#0b3a20]/70 to-transparent" />
      </div>

      <div className="absolute inset-x-0 bottom-0 p-5 text-center">
        <p className="text-white font-extrabold text-lg uppercase leading-tight tracking-wide line-clamp-1">{player.name}</p>
        <div className="mx-auto my-2.5 h-0.5 w-9 bg-ugold rounded-full group-hover:w-16 transition-all duration-300" />
        <p className="text-ugold text-xs font-bold uppercase tracking-[0.15em]">{player.position || 'Profesyonel'}</p>
      </div>
    </Link>
  )
}
