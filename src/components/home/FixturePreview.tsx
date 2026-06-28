import Link from 'next/link'
import Image from 'next/image'
import { formatDate } from '@/lib/utils'
import { Match } from '@/types'
import { MapPin, ArrowUpRight } from 'lucide-react'
import { getTeamLogoMap, applyLogosToMatches, applyLogosToStandings } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'
import NextMatchCountdown from './NextMatchCountdown'
import StandingsTable from '@/components/standings/StandingsTable'

/* ─── Tek maç kartı ─────────────────────────────────────────── */
function MatchCard({ match }: { match: Match }) {
  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const urfaScore = urfaIsHome ? match.homeScore : match.awayScore
  const oppScore = urfaIsHome ? match.awayScore : match.homeScore
  const result = match.isCompleted && urfaScore !== null && oppScore !== null
    ? urfaScore > oppScore ? 'G' : urfaScore < oppScore ? 'M' : 'B'
    : null

  const Inner = (
    <div className="card-premium p-5 h-full flex flex-col">
      {/* Üst: hafta + sonuç rozeti */}
      <div className="flex items-start justify-between gap-2 mb-3 min-h-[34px]">
        <span className="text-[11px] font-black tracking-widest uppercase text-ugreen leading-snug line-clamp-2">
          {match.roundLabel ?? (match.week ? `${match.week}. Hafta` : match.competition)}
        </span>
        {result && (
          <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-md text-[12px] font-black shadow-sm leading-none ${
            result === 'G' ? 'bg-ugreen text-white' : result === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'
          }`} title={result === 'G' ? 'Galibiyet' : result === 'M' ? 'Mağlubiyet' : 'Beraberlik'}>{result}</span>
        )}
      </div>
      <p className="text-[12px] text-[#7aab8e] font-semibold mb-4">{formatDate(match.date)}</p>

      {/* Logolar + skor — daima ortalı/hizalı */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex justify-center">
          <div className="relative w-14 h-14"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div>
        </div>
        <div className="flex items-center gap-1.5 px-1">
          {match.isCompleted ? (
            <>
              <span className="w-10 h-11 flex items-center justify-center rounded-lg bg-ugreend text-2xl font-black text-white tabular-nums">{match.homeScore}</span>
              <span className="w-10 h-11 flex items-center justify-center rounded-lg bg-ugreend text-2xl font-black text-white tabular-nums">{match.awayScore}</span>
            </>
          ) : (
            <span className="h-11 flex items-center text-sm font-black text-[#7aab8e] px-2">VS</span>
          )}
        </div>
        <div className="flex justify-center">
          <div className="relative w-14 h-14"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div>
        </div>
      </div>

      {/* Takım isimleri — ayrı satır, sabit yükseklik */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mt-2.5">
        <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 min-h-[30px] ${urfaIsHome ? 'text-ugreen' : 'text-ugreenm'}`}>{match.homeTeam}</span>
        <span className="w-[88px]" />
        <span className={`text-[11px] font-bold text-center leading-tight line-clamp-2 min-h-[30px] ${!urfaIsHome ? 'text-ugreen' : 'text-ugreenm'}`}>{match.awayTeam}</span>
      </div>

      {/* Stat — alta sabit */}
      <div className="mt-auto pt-3.5 border-t border-[#edf7f2] flex items-center justify-center gap-1.5 text-[12px] text-[#7aab8e]">
        <MapPin size={12} className="text-ugreen shrink-0" />
        <span className="truncate">{match.venue || '—'}</span>
      </div>
    </div>
  )

  return match.macId
    ? <Link href={`/mac/${match.macId}`} className="block group h-full">{Inner}</Link>
    : Inner
}


/* ─── Bölüm ─────────────────────────────────────────────────── */
export default async function FixturePreview() {
  const [{ matches, standings: rawStandings, meta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const allMatches = applyLogosToMatches(matches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)
  const completed = allMatches.filter((m) => m.isCompleted)
  const lastThree = completed.slice(-3)

  // Sıradaki maç: oynanmamış, tarihe göre en yakın
  const upcoming = allMatches
    .filter((m) => !m.isCompleted && m.date)
    .sort((a, b) => a.date.localeCompare(b.date))
  const next = upcoming[0] ?? null
  const target = next ? `${next.date}T${next.time && /^\d{1,2}:\d{2}$/.test(next.time) ? next.time : '00:00'}:00` : null

  return (
    <section className="py-20 md:py-24 bg-[#f8faf9]">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Başlık + sıradaki maç geri sayımı */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-5 mb-10">
          <div className="flex items-center gap-4">
            <span className="block w-1.5 h-11 bg-ugold rounded-full" />
            <div>
              <h2 className="font-heading text-4xl md:text-5xl font-black text-ugreenm tracking-tight">Maç Merkezi</h2>
              <p className="text-xs font-bold text-[#7aab8e] mt-1">{meta.league} · {meta.season}</p>
            </div>
          </div>
          <div className="sm:ml-auto bg-white border border-[#ddeae2] rounded-2xl px-4 py-3 shadow-sm">
            <NextMatchCountdown target={target} />
          </div>
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
          <StandingsTable standings={standings} season={meta.season} title limit={8} />
        </div>

        {/* Orta buton */}
        <div className="flex justify-center mt-10">
          <Link href="/mac-merkezi"
            className="inline-flex items-center gap-2 bg-white border border-[#ddeae2] hover:border-ugreen/40 hover:shadow-md text-ugreenm font-bold text-[15px] px-7 py-4 rounded-2xl transition-all">
            Maç Merkezine Git
            <ArrowUpRight size={17} className="text-ugreen" />
          </Link>
        </div>
      </div>
    </section>
  )
}
