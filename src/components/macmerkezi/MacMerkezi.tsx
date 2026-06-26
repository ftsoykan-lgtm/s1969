'use client'

import { useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { MapPin, Calendar } from 'lucide-react'
import type { Match, StandingRow } from '@/types'
import { competitionLogo } from '@/lib/tff'
import StandingsTable from '@/components/standings/StandingsTable'

/* Tarih + saat → "24.08.2025 19:00" */
function tarihSaat(dateISO: string, time?: string): string {
  if (!dateISO) return time || ''
  const [y, m, d] = dateISO.split('-')
  const g = d && m && y ? `${d}.${m}.${y}` : dateISO
  return time ? `${g}  ${time}` : g
}

/* ─── Maç kartı (Trabzonspor tarzı) ─────────────────────────── */
export function MatchCard({ match, logos }: { match: Match; logos: Record<string, string> }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null
  const tournamentLogo = competitionLogo(logos, match.competition)
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
            {match.roundLabel ?? (match.week ? `${match.week}. Hafta` : match.competition)}
          </span>
        </div>
        {result && (
          <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-black shrink-0 shadow-sm ${
            result === 'G' ? 'bg-[#1A6B3C] text-white' : result === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-[#FFD100] text-[#0f4a28]'
          }`} title={result === 'G' ? 'Galibiyet' : result === 'M' ? 'Mağlubiyet' : 'Beraberlik'}>{result}</span>
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

/* ─── Puan tablosu — tek paylaşılan bileşen (site geneli aynı tasarım) ─── */
export { StandingsTable }

/* ─── Maç Merkezi ───────────────────────────────────────────── */
export default function MacMerkezi({
  all, standings, season, logos = {}, limit, showFilter = true,
}: {
  all: Match[]
  standings: StandingRow[]
  season?: string
  logos?: Record<string, string>
  limit?: number
  showFilter?: boolean
}) {
  const [tournament, setTournament] = useState<string>('hepsi')

  const tournaments = Array.from(new Set(all.map((m) => m.competition).filter(Boolean)))
  let matches = all
    .filter((m) => tournament === 'hepsi' || m.competition === tournament)
    .slice()
    .reverse() // en yeni maç üstte
  if (limit) {
    // Son N maç: önce oynanmışlar, yoksa fikstürden
    const played = matches.filter((m) => m.isCompleted)
    matches = (played.length >= limit ? played : matches).slice(0, limit)
  }

  return (
    <div>
      {/* Filtre çubuğu */}
      <div className={`flex flex-wrap items-end gap-4 mb-8 ${showFilter ? '' : 'hidden'}`}>
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
