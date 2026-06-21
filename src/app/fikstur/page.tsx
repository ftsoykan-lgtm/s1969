import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match } from '@/types'
import { MapPin } from 'lucide-react'
import type { Metadata } from 'next'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'

export const metadata: Metadata = {
  title: 'Fikstür & Puan Tablosu',
  description: 'Şanlıurfaspor FK fikstür ve puan tablosu — TFF 2. Lig Beyaz Grup.',
}

function MatchRow({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result: 'G' | 'M' | 'B' | null = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null

  // Sonuca göre satır rengi (G: yeşil, M: kırmızı, B: sarı)
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
        {/* Ev sahibi */}
        <div className="flex items-center gap-2 flex-1 min-w-0 justify-end">
          <span className={`text-sm font-bold truncate text-right ${urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.homeTeam}</span>
          <div className="relative w-8 h-8 shrink-0">
            <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
          </div>
        </div>

        {/* Skor — sabit, bölünmez */}
        <div className="shrink-0 px-2 text-center w-16">
          {match.isCompleted ? (
            <span className={`text-xl font-black tabular-nums whitespace-nowrap ${scoreColor}`}>
              {match.homeScore}<span className="text-[#7aab8e] mx-0.5">-</span>{match.awayScore}
            </span>
          ) : (
            <span className="text-sm font-bold text-[#7aab8e]">vs</span>
          )}
        </div>

        {/* Deplasman */}
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

export const dynamic = 'force-dynamic'

export default async function FiksturPage() {
  const [{ standings: rawStandings, matches: rawMatches, meta: fixtureMeta }, logoMap] =
    await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(rawMatches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)
  const completed = matches.filter((m) => m.isCompleted)
  const upcoming = matches.filter((m) => !m.isCompleted)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">{fixtureMeta.league} · {fixtureMeta.season}</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Fikstür & <span className="text-[#FFD100]">Puan Tablosu</span>
          </h1>
          <p className="mt-3 text-[11px] text-white/40">
            Veri kaynağı: TFF · Son güncelleme: {new Date(fixtureMeta.updatedAt).toLocaleDateString('tr-TR', { day: 'numeric', month: 'long', year: 'numeric' })}
          </p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-8">
          {/* Maçlar */}
          <div className="space-y-8">
            {upcoming.length > 0 && (
              <div>
                <h2 className="text-xs font-black tracking-widest uppercase text-[#1A6B3C] mb-4 flex items-center gap-2">
                  <span className="w-4 h-0.5 bg-[#FFD100] inline-block" />
                  Yaklaşan Maçlar
                </h2>
                <div className="space-y-2">{upcoming.map((m) => <MatchRow key={m.id} match={m} />)}</div>
              </div>
            )}
            <div>
              <h2 className="text-xs font-black tracking-widest uppercase text-[#3d6b52] mb-4 flex items-center gap-2">
                <span className="w-4 h-0.5 bg-[#ddeae2] inline-block" />
                Oynanan Maçlar
              </h2>
              <div className="space-y-2">{[...completed].reverse().map((m) => <MatchRow key={m.id} match={m} />)}</div>
            </div>
          </div>

          {/* Puan tablosu */}
          <div>
            <h2 className="text-xs font-black tracking-widest uppercase text-[#1A6B3C] mb-4 flex items-center gap-2">
              <span className="w-4 h-0.5 bg-[#FFD100] inline-block" />
              Puan Tablosu
            </h2>
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
              <div className="grid grid-cols-[24px_1fr_28px_28px_28px_36px] gap-2 px-4 py-3 border-l-4 border-l-transparent bg-[#0f4a28] text-[10px] font-black tracking-widest uppercase text-white/60">
                <span>#</span><span>Takım</span><span className="text-center">O</span>
                <span className="text-center">G</span><span className="text-center">M</span>
                <span className="text-center text-[#FFD100]">Puan</span>
              </div>
              {standings.map((row) => (
                <div key={row.rank}
                  className={`grid grid-cols-[24px_1fr_28px_28px_28px_36px] gap-2 items-center px-4 py-3 border-b border-l-4 border-[#edf7f2] last:border-b-0 transition-colors ${
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
                  <span className="text-xs text-[#3d6b52] text-center">{row.lost}</span>
                  <span className={`text-sm font-black text-center ${row.isCurrentTeam ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{row.points}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
