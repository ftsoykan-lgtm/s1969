import type { SitePlayer } from '@/lib/supabase/players-server'

/** Ülke kodu → bayrak emoji */
export function flagEmoji(code?: string | null): string {
  if (!code) return ''
  const map: Record<string, string> = {
    tr: '🇹🇷', br: '🇧🇷', pt: '🇵🇹', sn: '🇸🇳', it: '🇮🇹', fr: '🇫🇷', de: '🇩🇪',
    es: '🇪🇸', ar: '🇦🇷', nl: '🇳🇱', be: '🇧🇪', ng: '🇳🇬', ci: '🇨🇮', gh: '🇬🇭',
    cm: '🇨🇲', ml: '🇲🇱', gm: '🇬🇲', ro: '🇷🇴', rs: '🇷🇸', hr: '🇭🇷', gr: '🇬🇷',
    bg: '🇧🇬', ua: '🇺🇦', ru: '🇷🇺', pl: '🇵🇱', us: '🇺🇸', gb: '🇬🇧', co: '🇨🇴',
    cd: '🇨🇩', dz: '🇩🇿', ma: '🇲🇦', tn: '🇹🇳', mk: '🇲🇰', al: '🇦🇱', xk: '🇽🇰',
  }
  return map[code.toLowerCase()] ?? '🌍'
}

export default function PlayerCard({ player }: { player: SitePlayer }) {
  const initials = player.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  const hasPhoto = !!player.photoUrl

  return (
    <div className="group relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1A6B3C] to-[#0b3a20] shadow-lg hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 ring-1 ring-white/5">
      {/* Görsel / fallback */}
      <div className="relative aspect-[3/4] overflow-hidden">
        {hasPhoto ? (
          <img src={player.photoUrl!} alt={player.name}
            className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-[radial-gradient(circle_at_50%_30%,#1f7a45,#0b3a20)]">
            <span className="text-5xl font-black text-white/15 select-none">{initials}</span>
          </div>
        )}

        {/* Üst parlama */}
        <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-b from-black/40 to-transparent" />
        {/* Bayrak */}
        {player.flagCode && (
          <div className="absolute top-3 left-3 text-2xl drop-shadow-lg leading-none">{flagEmoji(player.flagCode)}</div>
        )}
        {/* Numara — büyük, köşe */}
        {player.number != null && (
          <div className="absolute top-1 right-3 text-5xl font-black text-white/90 drop-shadow-lg leading-none tabular-nums italic">
            {player.number}
          </div>
        )}
        {/* Alt degrade */}
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-[#0b3a20] via-[#0b3a20]/70 to-transparent" />
      </div>

      {/* İsim + mevki */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <p className="text-white font-black text-base uppercase leading-tight tracking-wide line-clamp-1">{player.name}</p>
        <div className="mx-auto my-2 h-0.5 w-8 bg-[#FFD100] rounded-full group-hover:w-14 transition-all duration-300" />
        <p className="text-[#FFD100] text-[11px] font-bold uppercase tracking-[0.15em]">{player.position || 'Profesyonel'}</p>
      </div>
    </div>
  )
}
