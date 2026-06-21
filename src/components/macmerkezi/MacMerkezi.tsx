'use client'

import { useState } from 'react'
import Image from 'next/image'
import { MapPin } from 'lucide-react'
import { formatDate } from '@/lib/utils'
import type { Match, StandingRow } from '@/types'

type Tab = 'fikstur' | 'sonuclar' | 'puan'

const TABS: { key: Tab; label: string }[] = [
  { key: 'fikstur', label: 'Fikstür' },
  { key: 'sonuclar', label: 'Sonuçlar' },
  { key: 'puan', label: 'Puan Durumu' },
]

function MatchRow({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result: 'G' | 'M' | 'B' | null = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null

  const rowStyle =
    result === 'G' ? 'border-[#1A6B3C]/40 bg-[#edf7f2]'
    : result === 'M' ? 'border-red-200 bg-red-50'
    : 'border-[#ddeae2] bg-white'
  const scoreColor =
    result === 'G' ? 'text-[#1A6B3C]'
    : result === 'M' ? 'text-red-600'
    : 'text-[#092d18]'

  return (
    <div className={`flex items-center gap-3 p-4 rounded-xl border-2 transition-all hover:shadow-sm ${rowStyle}`}>
      <div className="w-20 shrink-0 text-center hidden sm:block">
        {match.week ? (
          <p className="text-[10px] font-black text-[#1A6B3C] uppercase tracking-wide">{match.week}. Hafta</p>
        ) : (
          <p className="text-[9px] font-black text-[#7aab8e] uppercase tracking-wide">Kupa</p>
        )}
        <p className="text-[11px] text-[#3d6b52] font-medium">{formatDate(match.date)}</p>
      </div>

      <div className="flex flex-1 items-center gap-2 min-w-0">
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className={`text-sm font-bold truncate text-right ${urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.homeTeam}</span>
          <div className="relative w-8 h-8 shrink-0">
            <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
          </div>
        </div>

        <div className="shrink-0 px-2 text-center w-16">
          {match.isCompleted ? (
            <span className={`text-xl font-black tabular-nums whitespace-nowrap ${scoreColor}`}>
              {match.homeScore}<span className="text-[#7aab8e] mx-0.5">-</span>{match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-bold text-[#7aab8e]">vs</span>
          )}
        </div>

        <div className="flex items-center gap-2 flex-1 min-w-0">
          <div className="relative w-8 h-8 shrink-0">
            <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
          </div>
          <span className={`text-sm font-bold truncate ${!urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.awayTeam}</span>
        </div>
      </div>

      <div className="hidden lg:flex items-center gap-1 w-40 shrink-0">
        <MapPin size={11} className="text-[#7aab8e] shrink-0" />
        <span className="text-[11px] text-[#3d6b52] truncate">{match.venue}</span>
      </div>
    </div>
  )
}

function StandingsTable({ standings }: { standings: StandingRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
      <div className="grid grid-cols-[28px_1fr_32px_32px_32px_32px_40px] gap-2 px-4 py-3 border-l-4 border-l-transparent bg-[#0f4a28] text-[10px] font-black tracking-widest uppercase text-white/60">
        <span>#</span><span>Takım</span>
        <span className="text-center">O</span><span className="text-center">G</span>
        <span className="text-center">B</span><span className="text-center">M</span>
        <span className="text-center text-[#FFD100]">P</span>
      </div>
      {standings.map((row) => (
        <div key={row.rank}
          className={`grid grid-cols-[28px_1fr_32px_32px_32px_32px_40px] gap-2 items-center px-4 py-3 border-b border-l-4 border-[#edf7f2] last:border-b-0 transition-colors ${
            row.isCurrentTeam ? 'bg-[#edf7f2] border-l-[#1A6B3C]' : 'border-l-transparent hover:bg-[#f5f9f6]'
          }`}>
          <span className={`text-xs font-black ${row.rank <= 3 ? 'text-[#1A6B3C]' : 'text-[#7aab8e]'}`}>{row.rank}</span>
          <div className="flex items-center gap-2 min-w-0">
            <div className="relative w-5 h-5 shrink-0">
              <Image src={row.teamLogo} alt={row.team} fill className="object-contain" />
            </div>
            <span className={`text-xs font-bold truncate ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.team}</span>
          </div>
          <span className="text-xs text-[#3d6b52] text-center">{row.played}</span>
          <span className="text-xs text-[#3d6b52] text-center">{row.won}</span>
          <span className="text-xs text-[#3d6b52] text-center">{row.drawn}</span>
          <span className="text-xs text-[#3d6b52] text-center">{row.lost}</span>
          <span className={`text-sm font-black text-center ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.points}</span>
        </div>
      ))}
    </div>
  )
}

export default function MacMerkezi({
  upcoming, completed, standings, initialTab = 'fikstur',
}: {
  upcoming: Match[]
  completed: Match[]
  standings: StandingRow[]
  initialTab?: Tab
}) {
  const [tab, setTab] = useState<Tab>(initialTab)

  return (
    <div>
      {/* Sekmeler */}
      <div className="flex gap-1 bg-white border border-[#ddeae2] rounded-2xl p-1.5 shadow-sm mb-8 max-w-md">
        {TABS.map((t) => (
          <button key={t.key} onClick={() => setTab(t.key)}
            className={`flex-1 py-2.5 px-3 text-sm font-black rounded-xl transition-all ${
              tab === t.key ? 'bg-[#1A6B3C] text-white shadow-sm' : 'text-[#3d6b52] hover:bg-[#f5f9f6]'
            }`}>
            {t.label}
          </button>
        ))}
      </div>

      {/* Fikstür (yaklaşan) */}
      {tab === 'fikstur' && (
        <div className="space-y-2 max-w-3xl">
          {upcoming.length > 0 ? (
            upcoming.map((m) => <MatchRow key={m.id} match={m} />)
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
              <p className="text-sm font-bold text-[#092d18]">Yaklaşan maç bulunmuyor</p>
              <p className="text-xs text-[#7aab8e] mt-1">Yeni sezon fikstürü açıklandığında burada görünecek.</p>
            </div>
          )}
        </div>
      )}

      {/* Sonuçlar (oynanan) */}
      {tab === 'sonuclar' && (
        <div className="space-y-2 max-w-3xl">
          {completed.length > 0 ? (
            [...completed].reverse().map((m) => <MatchRow key={m.id} match={m} />)
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
              <p className="text-sm font-bold text-[#092d18]">Henüz oynanmış maç yok</p>
            </div>
          )}
        </div>
      )}

      {/* Puan durumu */}
      {tab === 'puan' && (
        <div className="max-w-2xl">
          <StandingsTable standings={standings} />
        </div>
      )}
    </div>
  )
}
