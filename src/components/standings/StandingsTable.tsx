import Image from 'next/image'
import { Trophy } from 'lucide-react'
import type { StandingRow } from '@/types'

/* ════════════════════════════════════════════════════════════════
   Tek kaynak — sitenin HER yerinde aynı puan durumu tasarımı
   (ana sayfa, maç merkezi, fikstür …). Premium yeşil-altın kimlik.
   `title` verilirse panelin üstüne koyu-yeşil premium başlık kapağı
   (kupa + PUAN DURUMU + altın sezon rozeti) gelir; verilmezse tüketici
   kendi bölüm başlığını kullanır (çakışma olmaz).
   ════════════════════════════════════════════════════════════════ */

const COLS = 'grid-cols-[26px_1fr_24px_24px_24px_24px_34px_30px]'

// Sıra renk barı: 1 şampiyon · 2–5 play-off · son 3 küme düşme
function barColor(rank: number, total: number) {
  if (rank === 1) return 'bg-ugreen'
  if (rank >= 2 && rank <= 5) return 'bg-ugold'
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
      <div
        className="overflow-hidden rounded-2xl border border-[#dce9e2] bg-white"
        style={{ boxShadow: '0 2px 6px rgba(12, 46, 34, 0.05), 0 28px 56px -28px rgba(12, 46, 34, 0.32)' }}
      >
        {/* Premium başlık kapağı — yalnız title verildiğinde */}
        {title && (
          <div className="relative flex items-center justify-between gap-2 overflow-hidden bg-gradient-to-r from-ugreen to-ugreend px-4 py-3.5">
            <div aria-hidden className="pointer-events-none absolute -top-8 -right-6 h-24 w-24 rounded-full bg-ugold/10 blur-2xl" />
            <span className="relative inline-flex items-center gap-2">
              <Trophy size={17} className="text-ugold" />
              <span className="font-heading text-lg font-extrabold uppercase tracking-wide text-white">Puan Durumu</span>
            </span>
            {season && (
              <span className="relative rounded-full bg-ugold px-2.5 py-1 text-[11px] font-extrabold tabular-nums text-ugreend">{season}</span>
            )}
          </div>
        )}

        {/* Sütun başlıkları — kapak varsa açık, yoksa yeşil */}
        <div className={`grid ${COLS} items-center gap-1 px-3 py-2.5 ${title ? 'border-b border-[#e6efe9] bg-[#eef5f0]' : 'bg-gradient-to-r from-ugreen to-ugreend'}`}>
          <span className={`text-center text-[11px] font-extrabold ${title ? 'text-[#7aab8e]' : 'text-white/50'}`}>#</span>
          <span className={`pl-1 text-[11px] font-extrabold uppercase tracking-wide ${title ? 'text-ugreenm' : 'text-white'}`}>Kulüpler</span>
          {['O', 'G', 'B', 'M', 'AV'].map((c) => (
            <span key={c} className={`text-center text-[11px] font-extrabold ${title ? 'text-[#7aab8e]' : 'text-white/60'}`}>{c}</span>
          ))}
          <span className={`text-center text-[11px] font-extrabold ${title ? 'text-ugreen' : 'text-ugold'}`}>P</span>
        </div>

        {shown.map((row, i) => {
          const av = row.goalsFor - row.goalsAgainst
          const cur = row.isCurrentTeam
          return (
            <div key={row.rank}
              className={`relative grid ${COLS} items-center gap-1 px-3 py-2.5 transition-colors ${
                cur ? 'bg-ugreenm' : i % 2 === 1 ? 'bg-[#f5f9f6] hover:bg-[#eef5f0]' : 'bg-white hover:bg-[#f5f9f6]'
              }`}>
              <span className={`absolute left-0 top-0 bottom-0 w-1 ${barColor(row.rank, total)}`} />
              <span className={`text-center text-xs font-extrabold tabular-nums ${cur ? 'text-ugold' : 'text-ugreenm'}`}>{row.rank}</span>
              <div className="flex min-w-0 items-center gap-2 pl-1">
                <div className="relative h-5 w-5 shrink-0"><Image src={row.teamLogo} alt={row.team} fill unoptimized sizes="20px" className="object-contain" /></div>
                <span className={`truncate text-[12px] font-bold ${cur ? 'text-white' : 'text-ugreenm'}`}>{row.team}</span>
              </div>
              <span className={`text-center text-[11px] tabular-nums ${cur ? 'text-white/70' : 'text-utxt2'}`}>{row.played}</span>
              <span className={`text-center text-[11px] tabular-nums ${cur ? 'text-white/70' : 'text-utxt2'}`}>{row.won}</span>
              <span className={`text-center text-[11px] tabular-nums ${cur ? 'text-white/70' : 'text-utxt2'}`}>{row.drawn}</span>
              <span className={`text-center text-[11px] tabular-nums ${cur ? 'text-white/70' : 'text-utxt2'}`}>{row.lost}</span>
              <span className={`text-center text-[11px] tabular-nums ${cur ? 'text-white/80' : 'text-utxt2'}`}>{av > 0 ? `+${av}` : av}</span>
              <span className={`text-center text-[13px] font-extrabold tabular-nums ${cur ? 'text-ugold' : 'text-ugreen'}`}>{row.points}</span>
            </div>
          )
        })}
      </div>

      {/* Açıklama — renk barı anlamları */}
      <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1.5 px-1">
        <Legend color="bg-ugreen" label="Şampiyon" />
        <Legend color="bg-ugold" label="Play-Off" />
        <Legend color="bg-[#d01b2a]" label="Küme Düşme" />
      </div>
    </div>
  )
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 text-[10px] font-bold text-[#7aab8e]">
      <span className={`h-2.5 w-2.5 rounded-sm ${color}`} />{label}
    </span>
  )
}
