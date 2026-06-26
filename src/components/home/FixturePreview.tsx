import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match, StandingRow } from '@/types'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { getTeamLogoMap, applyLogosToMatches, applyLogosToStandings } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'
import NextMatchCountdown from './NextMatchCountdown'

/* ─── Tek maç kartı — kurumsal, keskin, üst aksanlı ─────────── */
function MatchCard({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null
  const accent = result === 'G' ? 'bg-[#1A6B3C]' : result === 'M' ? 'bg-[#d01b2a]' : result === 'B' ? 'bg-[#FFD100]' : 'bg-[#dbe7e0]'

  const Inner = (
    <div className="relative bg-white border border-[#e2ece6] group-hover:border-[#1A6B3C]/35 group-hover:shadow-[0_14px_34px_-20px_rgba(9,45,24,0.4)] transition-all h-full flex flex-col">
      <span className={`block h-[3px] ${accent}`} />
      <div className="p-5 flex flex-col flex-1">
        <div className="flex items-center justify-between gap-2 mb-1">
          <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#1A6B3C] leading-snug line-clamp-1">
            {match.roundLabel ?? (match.week ? `${match.week}. Hafta` : match.competition)}
          </span>
          {result && (
            <span className={`flex h-5 w-5 shrink-0 items-center justify-center text-[11px] font-bold leading-none ${
              result === 'G' ? 'bg-[#1A6B3C] text-white' : result === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-[#FFD100] text-[#0f4a28]'
            }`}>{result}</span>
          )}
        </div>
        <p className="text-[11px] text-[#7aab8e] font-medium uppercase tracking-wide mb-4">{formatDate(match.date)}</p>

        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
          <div className="flex justify-center"><div className="relative w-12 h-12"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div></div>
          <div className="flex items-center gap-1.5">
            {match.isCompleted ? (
              <>
                <span className="w-9 h-10 flex items-center justify-center bg-[#0f4a28] text-xl font-bold text-white tabular-nums">{match.homeScore}</span>
                <span className="w-9 h-10 flex items-center justify-center bg-[#0f4a28] text-xl font-bold text-white tabular-nums">{match.awayScore}</span>
              </>
            ) : (
              <span className="h-10 flex items-center text-xs font-bold text-[#7aab8e] px-2 tracking-widest">VS</span>
            )}
          </div>
          <div className="flex justify-center"><div className="relative w-12 h-12"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div></div>
        </div>

        <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mt-3">
          <span className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 min-h-[28px] ${urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#0e2a1c]'}`}>{match.homeTeam}</span>
          <span className="w-[76px]" />
          <span className={`text-[11px] font-semibold text-center leading-tight line-clamp-2 min-h-[28px] ${!urfaIsHome ? 'text-[#1A6B3C]' : 'text-[#0e2a1c]'}`}>{match.awayTeam}</span>
        </div>

        <div className="mt-auto pt-3.5 border-t border-[#eef5f0] flex items-center justify-center gap-1.5 text-[11px] text-[#7aab8e]">
          <MapPin size={12} className="text-[#1A6B3C] shrink-0" />
          <span className="truncate">{match.venue || '—'}</span>
        </div>
      </div>
    </div>
  )

  return match.macId
    ? <Link href={`/mac/${match.macId}`} className="block group h-full">{Inner}</Link>
    : <div className="group h-full">{Inner}</div>
}

/* ─── Mini puan durumu — kurumsal tablo (koyu başlık) ───────── */
function MiniStandings({ standings }: { standings: StandingRow[] }) {
  const ourIdx = standings.findIndex((s) => s.isCurrentTeam)
  let shown = standings.slice(0, 6)
  if (ourIdx >= 6) shown = [...standings.slice(0, 5), standings[ourIdx]]

  return (
    <div className="bg-white border border-[#e2ece6] overflow-hidden">
      {/* koyu başlık şeridi — hibrit aksan */}
      <div className="bg-[#0f4a28] px-5 py-3.5 flex items-center justify-between">
        <span className="text-[11px] font-bold tracking-[0.16em] uppercase text-white">Puan Durumu</span>
        <Link href="/mac-merkezi" className="text-[10px] font-bold tracking-wide uppercase text-[#FFD100] hover:underline">Tümü</Link>
      </div>
      <div className="grid grid-cols-[1fr_48px_44px] gap-2 px-5 py-2.5 border-b border-[#eef5f0] bg-[#f7faf8]">
        <span className="text-[10px] font-bold tracking-wide uppercase text-[#7aab8e]">Takım</span>
        <span className="text-[10px] font-bold uppercase text-[#7aab8e] text-center">Av</span>
        <span className="text-[10px] font-bold uppercase text-[#7aab8e] text-center">P</span>
      </div>
      {shown.map((row) => {
        const av = row.goalsFor - row.goalsAgainst
        return (
          <div key={row.rank}
            className={`grid grid-cols-[1fr_48px_44px] gap-2 items-center px-5 py-3 ${
              row.isCurrentTeam ? 'bg-[#0f4a28]' : 'border-b border-[#eef5f0] last:border-0'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex h-6 w-6 items-center justify-center text-[11px] font-bold shrink-0 ${
                row.isCurrentTeam ? 'bg-[#FFD100] text-[#092d18]' : 'bg-[#f1f6f3] text-[#7aab8e]'
              }`}>{row.rank}</span>
              <span className={`text-sm font-semibold truncate ${row.isCurrentTeam ? 'text-white' : 'text-[#0e2a1c]'}`}>{row.team}</span>
            </div>
            <span className={`text-[13px] text-center tabular-nums ${row.isCurrentTeam ? 'text-white/75' : 'text-[#3d6b52]'}`}>{av > 0 ? `+${av}` : av}</span>
            <span className={`text-[15px] font-bold text-center tabular-nums ${row.isCurrentTeam ? 'text-[#FFD100]' : 'text-[#0e2a1c]'}`}>{row.points}</span>
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

  const upcoming = allMatches
    .filter((m) => !m.isCompleted && m.date)
    .sort((a, b) => a.date.localeCompare(b.date))
  const next = upcoming[0] ?? null
  const target = next ? `${next.date}T${next.time && /^\d{1,2}:\d{2}$/.test(next.time) ? next.time : '00:00'}:00` : null

  return (
    <section className="u-sec bg-[#f5f9f6]">
      <div className="u-wrap">
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-9">
          <div>
            <span className="u-eyebrow">{meta.league} · {meta.season}</span>
            <h2 className="u-h2 mt-2">Maç Merkezi</h2>
          </div>
          <div className="sm:ml-auto bg-white border border-[#e2ece6] px-4 py-3">
            <NextMatchCountdown target={target} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-5">
          <div>
            {lastThree.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 items-stretch">
                {lastThree.map((m) => <MatchCard key={m.id} match={m} />)}
              </div>
            ) : (
              <div className="bg-white border border-[#e2ece6] p-10 text-center text-sm text-[#7aab8e]">Henüz oynanmış maç yok.</div>
            )}
          </div>
          <MiniStandings standings={standings} />
        </div>

        <div className="flex justify-center mt-9">
          <Link href="/mac-merkezi" className="u-btn u-btn--solid">
            Maç Merkezine Git <ArrowUpRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  )
}
