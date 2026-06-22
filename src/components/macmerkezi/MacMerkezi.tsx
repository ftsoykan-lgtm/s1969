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
      <div className="grid grid-cols-[28px_1fr_30px_30px_30px_30px_44px_40px] gap-1.5 px-4 py-3 border-l-4 border-l-transparent bg-[#0f4a28] text-[10px] font-black tracking-widest uppercase text-white/60">
        <span>#</span><span>Takım</span>
        <span className="text-center">O</span><span className="text-center">G</span>
        <span className="text-center">B</span><span className="text-center">M</span>
        <span className="text-center">Av</span>
        <span className="text-center text-[#FFD100]">P</span>
      </div>
      {standings.map((row) => {
        const av = row.goalsFor - row.goalsAgainst
        return (
          <div key={row.rank}
            className={`grid grid-cols-[28px_1fr_30px_30px_30px_30px_44px_40px] gap-1.5 items-center px-4 py-3 border-b border-l-4 border-[#edf7f2] last:border-b-0 transition-colors ${
              row.isCurrentTeam ? 'bg-[#edf7f2] border-l-[#1A6B3C]' : 'border-l-transparent hover:bg-[#f5f9f6]'
            }`}>
            <span className={`text-xs font-black ${row.rank <= 3 ? 'text-[#1A6B3C]' : 'text-[#7aab8e]'}`}>{row.rank}</span>
            <div className="flex items-center gap-2 min-w-0">
              <div className="relative w-5 h-5 shrink-0">
                <Image src={row.teamLogo} alt={row.team} fill className="object-contain" />
              </div>
              <span className={`text-xs font-bold truncate ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.team}</span>
            </div>
            <span className="text-xs text-[#3d6b52] text-center tabular-nums">{row.played}</span>
            <span className="text-xs text-[#3d6b52] text-center tabular-nums">{row.won}</span>
            <span className="text-xs text-[#3d6b52] text-center tabular-nums">{row.drawn}</span>
            <span className="text-xs text-[#3d6b52] text-center tabular-nums">{row.lost}</span>
            <span className="text-xs text-[#3d6b52] text-center tabular-nums">{av > 0 ? `+${av}` : av}</span>
            <span className={`text-sm font-black text-center tabular-nums ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.points}</span>
          </div>
        )
      })}
    </div>
  )
}

export default function MacMerkezi({
  all, completed, standings, season, initialTab = 'fikstur',
}: {
  all: Match[]
  completed: Match[]
  standings: StandingRow[]
  season?: string
  initialTab?: Tab
}) {
  const [tab, setTab] = useState<Tab>(initialTab)
  const [tournament, setTournament] = useState<string>('hepsi')

  // Maçlardaki farklı turnuvalar (lig, kupa...)
  const tournaments = Array.from(new Set(all.map((m) => m.competition).filter(Boolean)))
  const byTournament = (m: Match) => tournament === 'hepsi' || m.competition === tournament

  const fikstur = all.filter(byTournament)
  const sonuclar = [...completed].filter(byTournament).reverse()

  return (
    <div>
      {/* Filtre çubuğu — Sezon + Turnuva */}
      <div className="flex flex-wrap items-end gap-4 mb-6">
        <div>
          <label className="block text-[10px] font-black tracking-widest uppercase text-[#7aab8e] mb-1.5">Sezon</label>
          <div className="flex items-center gap-2 bg-white border border-[#ddeae2] rounded-xl px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-[#1A6B3C]" />
            <span className="text-sm font-bold text-[#092d18]">{season ?? '2025-2026'}</span>
          </div>
        </div>
        {tournaments.length > 1 && (
          <div>
            <label className="block text-[10px] font-black tracking-widest uppercase text-[#7aab8e] mb-1.5">Turnuva</label>
            <select value={tournament} onChange={(e) => setTournament(e.target.value)}
              className="bg-white border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm font-bold text-[#092d18] shadow-sm focus:outline-none focus:border-[#1A6B3C] transition-colors min-w-[180px]">
              <option value="hepsi">Tüm Turnuvalar</option>
              {tournaments.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>

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

      {/* Fikstür (tüm maçlar) */}
      {tab === 'fikstur' && (
        <div className="space-y-2 max-w-3xl">
          {fikstur.length > 0 ? (
            fikstur.map((m) => <MatchRow key={m.id} match={m} />)
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
              <p className="text-sm font-bold text-[#092d18]">Fikstür bulunmuyor</p>
              <p className="text-xs text-[#7aab8e] mt-1">Sezon fikstürü açıklandığında burada görünecek.</p>
            </div>
          )}
        </div>
      )}

      {/* Sonuçlar (oynanan) */}
      {tab === 'sonuclar' && (
        <div className="space-y-2 max-w-3xl">
          {sonuclar.length > 0 ? (
            sonuclar.map((m) => <MatchRow key={m.id} match={m} />)
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
