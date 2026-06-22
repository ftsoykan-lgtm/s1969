import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match, StandingRow } from '@/types'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { getTeamLogoMap, applyLogosToMatches, applyLogosToStandings } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'

/* ─── Tek maç kartı ─────────────────────────────────────────── */
function MatchCard({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null

  const Inner = (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-5 hover:shadow-md hover:border-[#1A6B3C]/30 transition-all h-full flex flex-col">
      {/* Üst: hafta + sonuç rozeti */}
      <div className="flex items-start justify-between gap-2 mb-3 min-h-[34px]">
        <span className="text-[11px] font-black tracking-widest uppercase text-[#1A6B3C] leading-snug line-clamp-2">
          {match.week ? `${match.week}. Hafta` : match.competition}
        </span>
        {result && (
          <span className={`flex h-6 w-6 items-center justify-center rounded-md text-[12px] font-black shadow-sm ${
            result === 'G' ? 'bg-[#1A6B3C] text-white' : result === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-[#FFD100] text-[#0f4a28]'
          }`} title={result === 'G' ? 'Galibiyet' : result === 'M' ? 'Mağlubiyet' : 'Beraberlik'}>{result}</span>
        )}
      </div>
      <p className="text-[12px] text-[#7aab8e] font-semibold mb-4">{formatDate(match.date)}</p>

      {/* Takımlar + skor */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-start gap-2">
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-14 h-14"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div>
          <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 min-h-[28px] ${urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.homeTeam}</span>
        </div>
        <div className="flex items-center gap-1.5 px-1 pt-1">
          {match.isCompleted ? (
            <>
              <span className="w-10 h-11 flex items-center justify-center rounded-lg bg-[#0f4a28] text-2xl font-black text-white tabular-nums">{match.homeScore}</span>
              <span className="w-10 h-11 flex items-center justify-center rounded-lg bg-[#0f4a28] text-2xl font-black text-white tabular-nums">{match.awayScore}</span>
            </>
          ) : (
            <span className="h-11 flex items-center text-sm font-black text-[#7aab8e] px-2">VS</span>
          )}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="relative w-14 h-14"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div>
          <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 min-h-[28px] ${!urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#092d18]'}`}>{match.awayTeam}</span>
        </div>
      </div>

      {/* Stat — alta sabit */}
      <div className="mt-auto pt-3.5 border-t border-[#edf7f2] flex items-center justify-center gap-1.5 text-[12px] text-[#7aab8e]">
        <MapPin size={12} className="text-[#1A6B3C] shrink-0" />
        <span className="truncate">{match.venue || '—'}</span>
      </div>
    </div>
  )

  return match.macId
    ? <Link href={`/mac/${match.macId}`} className="block group h-full">{Inner}</Link>
    : Inner
}

/* ─── Mini puan durumu ──────────────────────────────────────── */
function MiniStandings({ standings }: { standings: StandingRow[] }) {
  const ourIdx = standings.findIndex((s) => s.isCurrentTeam)
  // Bizi içerecek şekilde ~6 satır göster
  let shown = standings.slice(0, 6)
  if (ourIdx >= 6) shown = [...standings.slice(0, 5), standings[ourIdx]]

  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_56px_48px] gap-2 px-5 py-4 border-b border-[#edf7f2]">
        <span className="text-sm font-black text-[#092d18]">Takım</span>
        <span className="text-[12px] font-bold text-[#7aab8e] text-center">Averaj</span>
        <span className="text-[12px] font-bold text-[#7aab8e] text-center">Puan</span>
      </div>
      {shown.map((row) => {
        const av = row.goalsFor - row.goalsAgainst
        return (
          <div key={row.rank}
            className={`grid grid-cols-[1fr_56px_48px] gap-2 items-center px-5 py-4 transition-colors ${
              row.isCurrentTeam ? 'bg-[#092d18]' : 'border-b border-[#edf7f2] last:border-0'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-black shrink-0 ${
                row.isCurrentTeam ? 'bg-[#FFD100] text-[#092d18]' : 'bg-[#f5f9f6] text-[#7aab8e]'
              }`}>{row.rank}</span>
              <span className={`text-[15px] font-bold truncate ${row.isCurrentTeam ? 'text-white' : 'text-[#092d18]'}`}>{row.team}</span>
            </div>
            <span className={`text-sm text-center tabular-nums ${row.isCurrentTeam ? 'text-white/80' : 'text-[#3d6b52]'}`}>
              {av > 0 ? `+${av}` : av}
            </span>
            <span className={`text-base font-black text-center tabular-nums ${row.isCurrentTeam ? 'text-[#FFD100]' : 'text-[#092d18]'}`}>{row.points}</span>
          </div>
        )
      })}
    </div>
  )
}

/* ─── Bölüm ─────────────────────────────────────────────────── */
export default async function FixturePreview() {
  const [{ matches, standings: rawStandings, meta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const allMatches = applyLogosToMatches(matches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)
  const completed = allMatches.filter((m) => m.isCompleted)
  const lastThree = completed.slice(-3)

  return (
    <section className="py-20 bg-[#f8faf9]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Başlık */}
        <div className="flex items-center gap-4 mb-10">
          <span className="block w-1.5 h-11 bg-[#FFD100] rounded-full" />
          <h2 className="font-heading text-4xl md:text-5xl font-black text-[#092d18] tracking-tight">Maç Merkezi</h2>
          <span className="ml-auto text-sm font-bold text-[#7aab8e] hidden sm:block">{meta.league} · {meta.season}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_410px] gap-7">
          {/* Sol: son 3 maç */}
          <div>
            {lastThree.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
                {lastThree.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : (
              <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center text-sm text-[#7aab8e]">
                Henüz oynanmış maç yok.
              </div>
            )}
          </div>

          {/* Sağ: puan durumu */}
          <MiniStandings standings={standings} />
        </div>

        {/* Orta buton */}
        <div className="flex justify-center mt-10">
          <Link href="/mac-merkezi"
            className="inline-flex items-center gap-2 bg-white border border-[#ddeae2] hover:border-[#1A6B3C]/40 hover:shadow-md text-[#092d18] font-bold text-[15px] px-7 py-4 rounded-2xl transition-all">
            Maç Merkezine Git
            <ArrowUpRight size={17} className="text-[#1A6B3C]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
