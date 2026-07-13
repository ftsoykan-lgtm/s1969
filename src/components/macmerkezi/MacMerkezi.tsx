'use client'

import { useState } from 'react'
import type { Match, StandingRow } from '@/types'
import StandingsTable from '@/components/standings/StandingsTable'
import MatchCard from './MatchCard'

/* ─── Maç Merkezi ───────────────────────────────────────────── */
export default function MacMerkezi({
  all, standings, season, logos = {}, limit, showFilter = true, standingsNote,
}: {
  all: Match[]
  standings: StandingRow[]
  season?: string
  logos?: Record<string, string>
  limit?: number
  showFilter?: boolean
  standingsNote?: string   // doluysa puan tablosu yerine bu not gösterilir (bozuk/eksik arşiv)
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
          <label className="block text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-1.5">Sezon</label>
          <div className="flex items-center gap-2 bg-white border border-[#ddeae2] rounded-xl px-4 py-2.5 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-ugreen" />
            <span className="text-sm font-bold text-ugreenm">{season ?? '2025-2026'}</span>
          </div>
        </div>
        {tournaments.length > 1 && (
          <div>
            <label className="block text-[10px] font-extrabold tracking-widest uppercase text-[#7aab8e] mb-1.5">Turnuva</label>
            <select value={tournament} onChange={(e) => setTournament(e.target.value)}
              className="bg-white border border-[#ddeae2] rounded-xl px-4 py-2.5 text-sm font-bold text-ugreenm shadow-sm focus:outline-none focus:border-ugreen transition-colors min-w-[190px]">
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
              {matches.map((m, i) => <MatchCard key={m.id} match={m} logos={logos} index={i} />)}
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center">
              <p className="text-sm font-bold text-ugreenm">Maç bulunmuyor</p>
            </div>
          )}
        </div>

        <div className="lg:sticky lg:top-24 self-start">
          {standingsNote ? (
            <div className="panel-premium p-6 text-center">
              <p className="font-heading text-lg font-extrabold text-ugreenm mb-1">Puan Tablosu</p>
              <p className="text-[12px] text-[#7aab8e] leading-relaxed">{standingsNote}</p>
            </div>
          ) : (
            <StandingsTable standings={standings} />
          )}
        </div>
      </div>
    </div>
  )
}
