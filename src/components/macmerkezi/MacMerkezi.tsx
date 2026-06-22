'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import type { Match, StandingRow } from '@/types'

/* Tarih + saat → "24.08.2025 19:00" */
function tarihSaat(dateISO: string, time?: string): string {
  if (!dateISO) return time || ''
  const [y, m, d] = dateISO.split('-')
  const g = d && m && y ? `${d}.${m}.${y}` : dateISO
  return time ? `${g}  ${time}` : g
}

/* ─── Maç kartı (Trabzonspor tarzı) ─────────────────────────── */
function MatchCard({ match, logos }: { match: Match; logos: Record<string, string> }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null
  const tournamentLogo = logos[match.competition]
  const Wrapper = match.macId
    ? ({ children }: { children: React.ReactNode }) => <Link href={`/mac/${match.macId}`} className="block group">{children}</Link>
    : ({ children }: { children: React.ReactNode }) => <div>{children}</div>

  return (
    <Wrapper>
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm hover:shadow-md hover:border-[#1A6B3C]/30 transition-all overflow-hidden cursor-pointer">
      {/* Üst şerit: turnuva logosu + hafta */}
      <div className="flex items-center justify-between px-4 py-2.5 bg-[#f5f9f6] border-b border-[#edf7f2]">
        <div className="flex items-center gap-2 min-w-0">
          {tournamentLogo && (
            <div className="relative w-5 h-5 shrink-0">
              <Image src={tournamentLogo} alt={match.competition} fill className="object-contain" />
            </div>
          )}
          <span className="text-[10px] font-black tracking-widest uppercase text-[#1A6B3C] truncate">
            {match.week ? `${match.week}. Hafta` : 'Kupa'}
          </span>
        </div>
        {result && (
          <span className={`w-2 h-2 rounded-full shrink-0 ${result === 'G' ? 'bg-[#1A6B3C]' : result === 'M' ? 'bg-red-500' : 'bg-[#7aab8e]'}`} />
        )}
      </div>

      <div className="p-4">
        {/* Tarih + saat */}
        <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#3d6b52] font-semibold mb-4">
          <Calendar size={11} className="text-[#7aab8e]" />
          <span className="tabular-nums">{tarihSaat(match.date, match.time)}</span>
        </div>

        {/* Takımlar + skor */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex flex-col items-center gap-2 min-w-0">
            <div className="relative w-12 h-12 shrink-0">
              <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
            </div>
            <span className={`text-[11px] font-bold text-center w-full truncate ${urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.homeTeam}</span>
          </div>

          <div className="flex items-center gap-1 px-1 shrink-0">
            {match.isCompleted ? (
              <>
                <span className="w-8 h-9 flex items-center justify-center rounded-lg bg-[#0f4a28] text-lg font-black text-white tabular-nums">{match.homeScore}</span>
                <span className="w-8 h-9 flex items-center justify-center rounded-lg bg-[#0f4a28] text-lg font-black text-white tabular-nums">{match.awayScore}</span>
              </>
            ) : (
              <span className="text-sm font-black text-[#7aab8e]">vs</span>
            )}
          </div>

          <div className="flex flex-col items-center gap-2 min-w-0">
            <div className="relative w-12 h-12 shrink-0">
              <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
            </div>
            <span className={`text-[11px] font-bold text-center w-full truncate ${!urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.awayTeam}</span>
          </div>
        </div>

        {/* Stat */}
        <div className="mt-4 pt-3 border-t border-[#edf7f2] flex items-center justify-center gap-1.5 text-[11px] text-[#7aab8e]">
          <MapPin size={11} className="text-[#1A6B3C] shrink-0" />
          <span className="truncate">{match.venue}</span>
        </div>
      </div>
    </div>
    </Wrapper>
  )
}

/* ─── Puan tablosu ──────────────────────────────────────────── */
function StandingsTable({ standings }: { standings: StandingRow[] }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
      <div className="grid grid-cols-[24px_1fr_26px_26px_26px_26px_38px_34px] gap-1 px-3 py-3 bg-[#0f4a28] text-[10px] font-black tracking-wide uppercase text-white/60">
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
            className={`grid grid-cols-[24px_1fr_26px_26px_26px_26px_38px_34px] gap-1 items-center px-3 py-2.5 border-b border-l-4 border-[#edf7f2] last:border-b-0 ${
              row.isCurrentTeam ? 'bg-[#edf7f2] border-l-[#1A6B3C]' : 'border-l-transparent hover:bg-[#f5f9f6]'
            }`}>
            <span className={`text-xs font-black ${row.rank <= 3 ? 'text-[#1A6B3C]' : 'text-[#7aab8e]'}`}>{row.rank}</span>
            <div className="flex items-center gap-1.5 min-w-0">
              <div className="relative w-4 h-4 shrink-0">
                <Image src={row.teamLogo} alt={row.team} fill className="object-contain" />
              </div>
              <span className={`text-[11px] font-bold truncate ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.team}</span>
            </div>
            <span className="text-[11px] text-[#3d6b52] text-center tabular-nums">{row.played}</span>
            <span className="text-[11px] text-[#3d6b52] text-center tabular-nums">{row.won}</span>
            <span className="text-[11px] text-[#3d6b52] text-center tabular-nums">{row.drawn}</span>
            <span className="text-[11px] text-[#3d6b52] text-center tabular-nums">{row.lost}</span>
            <span className="text-[11px] text-[#3d6b52] text-center tabular-nums">{av > 0 ? `+${av}` : av}</span>
            <span className={`text-xs font-black text-center tabular-nums ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.points}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Maç Merkezi (tek sayfa, sekmesiz) ─────────────────────── */
export default function MacMerkezi({
  all, standings, season, logos = {},
}: {
  all: Match[]
  standings: StandingRow[]
  season?: string
  logos?: Record<string, string>
}) {
  const [tournament, setTournament] = useState<string>('hepsi')

  const tournaments = Array.from(new Set(all.map((m) => m.competition).filter(Boolean)))
  const matches = all
    .filter((m) => tournament === 'hepsi' || m.competition === tournament)
    .slice()
    .reverse() // en yeni maç üstte

  return (
    <div>
      {/* Filtre çubuğu */}
      <div className="flex flex-wrap items-end gap-4 mb-8">
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
              className="bg-white border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm font-bold text-[#092d18] shadow-sm focus:outline-none focus:border-[#1A6B3C] transition-colors min-w-[190px]">
              <option value="hepsi">Tüm Turnuvalar</option>
              {tournaments.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* İçerik: sol maç kartları, sağ puan tablosu */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-6">
        <div>
          {matches.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {matches.map((m) => <MatchCard key={m.id} match={m} logos={logos} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
              <p className="text-sm font-bold text-[#092d18]">Maç bulunmuyor</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          <StandingsTable standings={standings} />
        </div>
      </div>
    </div>
  )
}
