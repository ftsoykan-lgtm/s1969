import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match, StandingRow } from '@/types'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { getTeamLogoMap, applyLogosToMatches, applyLogosToStandings } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'

/* ─── Tek maç kartı ─────────────────────────────────────────── */
function MatchCard({ match }: { match: Match }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-4 hover:shadow-md transition-all">
      {/* Üst: hafta + tarih */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-[10px] font-black tracking-widest uppercase text-[#1A6B3C]">
          {match.week ? `${match.week}. Hafta` : match.competition}
        </span>
      </div>
      <p className="text-[11px] text-[#7aab8e] font-semibold mb-3">{formatDate(match.date)}</p>

      {/* Takımlar + skor */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
          </div>
        </div>
        <div className="flex items-center gap-1 px-1">
          <span className="w-8 h-9 flex items-center justify-center rounded-lg bg-[#f5f9f6] text-xl font-black text-[#092d18] tabular-nums">{match.homeScore}</span>
          <span className="text-[#7aab8e] font-black">-</span>
          <span className="w-8 h-9 flex items-center justify-center rounded-lg bg-[#f5f9f6] text-xl font-black text-[#092d18] tabular-nums">{match.awayScore}</span>
        </div>
        <div className="flex justify-center">
          <div className="relative w-12 h-12">
            <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
          </div>
        </div>
      </div>

      {/* Stat */}
      <div className="mt-4 pt-3 border-t border-[#edf7f2] flex items-center gap-1.5 text-[11px] text-[#7aab8e]">
        <MapPin size={11} className="text-[#1A6B3C] shrink-0" />
        <span className="truncate">{match.venue}</span>
      </div>
    </div>
  )
}

/* ─── Mini puan durumu ──────────────────────────────────────── */
function MiniStandings({ standings }: { standings: StandingRow[] }) {
  const ourIdx = standings.findIndex((s) => s.isCurrentTeam)
  // Bizi içerecek şekilde ~6 satır göster
  let shown = standings.slice(0, 6)
  if (ourIdx >= 6) shown = [...standings.slice(0, 5), standings[ourIdx]]

  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm overflow-hidden">
      <div className="grid grid-cols-[1fr_56px_48px] gap-2 px-5 py-3.5 border-b border-[#edf7f2]">
        <span className="text-xs font-black text-[#092d18]">Takım</span>
        <span className="text-[11px] font-bold text-[#7aab8e] text-center">Averaj</span>
        <span className="text-[11px] font-bold text-[#7aab8e] text-center">Puan</span>
      </div>
      {shown.map((row) => {
        const av = row.goalsFor - row.goalsAgainst
        return (
          <div key={row.rank}
            className={`grid grid-cols-[1fr_56px_48px] gap-2 items-center px-5 py-3.5 transition-colors ${
              row.isCurrentTeam ? 'bg-[#092d18]' : 'border-b border-[#edf7f2] last:border-0'
            }`}>
            <div className="flex items-center gap-3 min-w-0">
              <span className={`flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-black shrink-0 ${
                row.isCurrentTeam ? 'bg-[#FFD100] text-[#092d18]' : 'bg-[#f5f9f6] text-[#7aab8e]'
              }`}>{row.rank}</span>
              <span className={`text-sm font-bold truncate ${row.isCurrentTeam ? 'text-white' : 'text-[#092d18]'}`}>{row.team}</span>
            </div>
            <span className={`text-xs text-center tabular-nums ${row.isCurrentTeam ? 'text-white/80' : 'text-[#3d6b52]'}`}>
              {av > 0 ? `+${av}` : av}
            </span>
            <span className={`text-sm font-black text-center tabular-nums ${row.isCurrentTeam ? 'text-[#FFD100]' : 'text-[#092d18]'}`}>{row.points}</span>
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
    <section className="py-16 bg-[#f8faf9]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">

        {/* Başlık */}
        <div className="flex items-center gap-4 mb-8">
          <span className="block w-1.5 h-9 bg-[#FFD100] rounded-full" />
          <h2 className="text-3xl md:text-4xl font-black text-[#092d18] tracking-tight">Maç Merkezi</h2>
          <span className="ml-auto text-xs font-bold text-[#7aab8e] hidden sm:block">{meta.league} · {meta.season}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-6">
          {/* Sol: son 3 maç */}
          <div>
            {lastThree.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
        <div className="flex justify-center mt-8">
          <Link href="/fikstur"
            className="inline-flex items-center gap-2 bg-white border border-[#ddeae2] hover:border-[#1A6B3C]/40 hover:shadow-md text-[#092d18] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all">
            Maç Merkezine Git
            <ArrowUpRight size={16} className="text-[#1A6B3C]" />
          </Link>
        </div>
      </div>
    </section>
  )
}
