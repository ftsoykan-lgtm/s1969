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

const PLACEHOLDER = 'https://placehold.co/400x500/0f4a28/FFD100?text=%C5%9EFK'

export default function PlayerCard({ player }: { player: SitePlayer }) {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-[#0f4a28] shadow-lg hover:-translate-y-1.5 transition-all duration-300">
      {/* Fotoğraf */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[#edf7f2]">
        <img
          src={player.photoUrl || PLACEHOLDER}
          alt={player.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
        />
        {/* Bayrak — sol üst */}
        {player.flagCode && (
          <div className="absolute top-3 left-3 text-2xl drop-shadow-md leading-none">{flagEmoji(player.flagCode)}</div>
        )}
        {/* Numara — sağ üst */}
        {player.number != null && (
          <div className="absolute top-2 right-3 text-4xl font-black text-white/90 drop-shadow-lg leading-none tabular-nums">
            {player.number}
          </div>
        )}
        {/* Alt degrade */}
        <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[#0f4a28] via-[#0f4a28]/80 to-transparent" />
      </div>

      {/* İsim + mevki */}
      <div className="absolute inset-x-0 bottom-0 p-4 text-center">
        <p className="text-white font-black text-sm uppercase leading-tight tracking-wide line-clamp-1">{player.name}</p>
        <div className="mx-auto my-2 h-px w-10 bg-[#FFD100]/60" />
        <p className="text-[#FFD100] text-[11px] font-bold uppercase tracking-widest">
          {player.position || 'Profesyonel'}
        </p>
      </div>
    </div>
  )
}
