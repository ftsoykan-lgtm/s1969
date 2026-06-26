import Image from 'next/image'
import type { StandingRow } from '@/types'

/* ════════════════════════════════════════════════════════════════
   Tek kaynak — sitenin HER yerinde aynı puan durumu tasarımı
   (ana sayfa, maç merkezi, fikstür …). Yeşil-altın kurumsal kimlik.
   ════════════════════════════════════════════════════════════════ */

const COLS = 'grid-cols-[26px_1fr_24px_24px_24px_24px_34px_30px]'

// Sıra renk barı: 1 şampiyon · 2–5 play-off · son 3 küme düşme
function barColor(rank: number, total: number) {
  if (rank === 1) return 'bg-[#1b5e44]'
  if (rank >= 2 && rank <= 5) return 'bg-[#f5c400]'
  if (total > 0 && rank > total - 3) return 'bg-[#d01b2a]'
  return 'bg-transparent'
}

export default function StandingsTable({
  standings,
  season,
  title = false,
  limit,
}: {
  standings: StandingRow[]
  season?: string
  title?: boolean
  limit?: number
}) {
  const total = standings.length
  let shown = standings
  if (limit && standings.length > limit) {
    const ourIdx = standings.findIndex((s) => s.isCurrentTeam)
    shown = ourIdx >= limit ? [...standings.slice(0, limit - 1), standings[ourIdx]] : standings.slice(0, limit)
  }

  return (
    <div>
      {/* Başlık — eyebrow sezon + büyük LİG TABLOSU */}
      {title && (
        <div className="mb-4">
          <p className="text-[11px] font-black tracking-[0.18em] uppercase text-[#154836]">
            Sezon {season ? <span className="text-[#f5c400] bg-[#1b5e44] px-1.5 py-0.5 rounded">{season}</span> : ''}
          </p>
          <h3 className="font-heading text-3xl md:text-4xl font-black text-[#154836] tracking-tight leading-none mt-2">LİG TABLOSU</h3>
        </div>
      )}

      <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
        {/* Başlık şeridi — yeşil */}
        <div className={`grid ${COLS} gap-1 items-center px-3 py-3 bg-[#1b5e44]`}>
          <span className="text-[11px] font-black text-white/50 text-center">#</span>
          <span className="text-[11px] font-black tracking-wide uppercase text-white pl-1">Kulüpler</span>
          {['O', 'G', 'B', 'M', 'AV'].map((c) => (
            <span key={c} className="text-[11px] font-black text-white/60 text-center">{c}</span>
          ))}
          <span className="text-[11px] font-black text-[#f5c400] text-center">P</span>
        </div>

        {shown.map((row, i) => {
          const av = row.goalsFor - row.goalsAgainst
          const cur = row.isCurrentTeam
          return (
            <div key={row.rank}
              className={`relative grid ${COLS} gap-1 items-center px-3 py-2.5 transition-colors ${
                cur ? 'bg-[#154836]' : i % 2 === 1 ? 'bg-[#f5f9f6] hover:bg-[#eef5f0]' : 'bg-white hover:bg-[#f5f9f6]'
              }`}>
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${barColor(row.rank, total)}`} />
              <span className={`text-xs font-black text-center tabular-nums ${cur ? 'text-[#f5c400]' : 'text-[#154836]'}`}>{row.rank}</span>
              <div className="flex items-center gap-2 min-w-0 pl-1">
                <div className="relative w-5 h-5 shrink-0"><Image src={row.teamLogo} alt={row.team} fill className="object-contain" /></div>
                <span className={`text-[12px] font-bold truncate ${cur ? 'text-white' : 'text-[#154836]'}`}>{row.team}</span>
              </div>
              <span className={`text-[11px] text-center tabular-nums ${cur ? 'text-white/70' : 'text-[#356152]'}`}>{row.played}</span>
              <span className={`text-[11px] text-center tabular-nums ${cur ? 'text-white/70' : 'text-[#356152]'}`}>{row.won}</span>
              <span className={`text-[11px] text-center tabular-nums ${cur ? 'text-white/70' : 'text-[#356152]'}`}>{row.drawn}</span>
              <span className={`text-[11px] text-center tabular-nums ${cur ? 'text-white/70' : 'text-[#356152]'}`}>{row.lost}</span>
              <span className={`text-[11px] text-center tabular-nums ${cur ? 'text-white/80' : 'text-[#356152]'}`}>{av > 0 ? `+${av}` : av}</span>
              <span className={`text-[13px] font-black text-center tabular-nums ${cur ? 'text-[#f5c400]' : 'text-[#154836]'}`}>{row.points}</span>
            </div>
          )
        })}
      </div>

      {/* Açıklama — renk barı anlamları */}
      <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 mt-3 px-1">
        <Legend color="bg-[#1b5e44]" label="Şampiyon" />
        <Legend color="bg-[#f5c400]" label="Play-Off" />
        <Legend color="bg-[#d01b2a]" label="Küme Düşme" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#7aab8e]">
      <span className={`w-2.5 h-2.5 rounded-sm ${color}`} />{label}
    </span>
  )
}
