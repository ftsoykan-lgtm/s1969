import Image from 'next/image'
import type { StandingRow } from '@/types'
import { zoneOf, signed } from '@/lib/standings'
import { ZONE_STYLE } from './StandingsTable'

const NUM_COLS = [
  { key: 'played', label: 'O', title: 'Oynanan' },
  { key: 'won', label: 'G', title: 'Galibiyet' },
  { key: 'drawn', label: 'B', title: 'Beraberlik' },
  { key: 'lost', label: 'M', title: 'Mağlubiyet' },
  { key: 'goalsFor', label: 'A', title: 'Attığı gol' },
  { key: 'goalsAgainst', label: 'Y', title: 'Yediği gol' },
] as const

/* Puan Durumu sayfasının tam tablosu — tüm sütunlar (A/Y dahil), bölge barı,
   kulüp satırı koyu yeşil vurgulu. Dar ekranda yatay kaydırılır. */
export default function FullStandingsTable({ standings, season }: { standings: StandingRow[]; season: string }) {
  const total = standings.length
  return (
    <div className="overflow-hidden rounded-2xl border border-[#dce9e2] bg-white shadow-[0_2px_6px_rgba(12,46,34,0.05),0_28px_56px_-28px_rgba(12,46,34,0.32)]">
      <div className="overflow-x-auto">
        <table className="w-full min-w-[640px] border-collapse text-left">
          <caption className="sr-only">{season} sezonu puan durumu</caption>
          <thead>
            <tr className="bg-gradient-to-r from-ugreen to-ugreend text-[11px] font-extrabold uppercase tracking-wide">
              <th scope="col" className="w-14 py-3.5 text-center text-white/55">#</th>
              <th scope="col" className="py-3.5 pl-1 text-white">Takım</th>
              {NUM_COLS.map((c) => (
                <th key={c.key} scope="col" className="w-11 py-3.5 text-center text-white/60"><abbr title={c.title} className="no-underline">{c.label}</abbr></th>
              ))}
              <th scope="col" className="w-14 py-3.5 text-center text-white/60"><abbr title="Averaj" className="no-underline">AV</abbr></th>
              <th scope="col" className="w-14 py-3.5 pr-2 text-center text-ugold"><abbr title="Puan" className="no-underline">P</abbr></th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row, i) => {
              const cur = !!row.isCurrentTeam
              const zone = zoneOf(row.rank, total)
              const muted = cur ? 'text-white/75' : 'text-utxt2'
              return (
                <tr key={row.rank} aria-current={cur ? 'true' : undefined}
                  className={`border-b border-[#edf5f0] last:border-0 transition-colors ${cur ? 'bg-ugreenm' : i % 2 ? 'bg-[#f8fbf9] hover:bg-[#eef5f0]' : 'bg-white hover:bg-[#f5f9f6]'}`}>
                  <td className="relative py-3 text-center">
                    {zone && <span aria-hidden className={`absolute inset-y-0 left-0 w-1 ${ZONE_STYLE[zone].bar}`} />}
                    <span className={`text-sm font-extrabold tabular-nums ${cur ? 'text-ugold' : 'text-ugreenm'}`}>{row.rank}</span>
                  </td>
                  <td className="py-3 pl-1">
                    <div className="flex min-w-0 items-center gap-3">
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-white shadow-sm ring-1 ring-black/[0.06]">
                        {row.teamLogo && <span className="relative h-6 w-6"><Image src={row.teamLogo} alt="" fill unoptimized sizes="24px" className="object-contain" /></span>}
                      </span>
                      <span className={`truncate text-[14px] font-bold ${cur ? 'text-white' : 'text-ugreenm'}`}>{row.team}</span>
                    </div>
                  </td>
                  {NUM_COLS.map((c) => (
                    <td key={c.key} className={`py-3 text-center text-[13px] tabular-nums ${muted}`}>{row[c.key]}</td>
                  ))}
                  <td className={`py-3 text-center text-[13px] font-semibold tabular-nums ${muted}`}>{signed(row.goalsFor - row.goalsAgainst)}</td>
                  <td className={`py-3 pr-2 text-center text-base font-extrabold tabular-nums ${cur ? 'text-ugold' : 'text-ugreen'}`}>{row.points}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
      <p className="border-t border-[#edf5f0] px-4 py-2.5 text-[11px] font-semibold text-[#7aab8e] md:hidden">Tüm sütunları görmek için tabloyu yana kaydırın.</p>
    </div>
  )
}
