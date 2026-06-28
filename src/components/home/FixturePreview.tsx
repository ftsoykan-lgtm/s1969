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

  const accentTop = result === 'G' ? 'border-t-ugreen' : result === 'M' ? 'border-t-[#d01b2a]' : 'border-t-ugold'
  const Logo = ({ src, alt }: { src: string; alt: string }) => (
    <div className="h-16 w-16 rounded-2xl bg-white ring-1 ring-[#e2ece6] shadow-[0_4px_12px_-6px_rgba(15,74,40,0.4)] flex items-center justify-center p-2">
      <div className="relative w-full h-full"><Image src={src} alt={alt} fill className="object-contain" /></div>
    </div>
  )

  const Inner = (
    <div className={`card-premium p-5 h-full flex flex-col border-t-4 ${accentTop}`}>
      {/* Üst: hafta + sonuç rozeti */}
      <div className="flex items-center justify-between gap-2 mb-3 min-h-[28px]">
        <span className="text-[11px] font-extrabold tracking-widest uppercase text-ugold leading-snug line-clamp-1">
          {match.roundLabel ?? (match.week ? `${match.week}. Hafta` : match.competition)}
        </span>
        {result && (
          <span className={`flex h-6 px-2 items-center justify-center rounded-full text-[11px] font-extrabold shadow-sm leading-none gap-1 ${
            result === 'G' ? 'bg-ugreen text-white' : result === 'M' ? 'bg-[#d01b2a] text-white' : 'bg-ugold text-ugreend'
          }`}>{result === 'G' ? 'Galibiyet' : result === 'M' ? 'Mağlubiyet' : 'Beraberlik'}</span>
        )}
      </div>
      <p className="text-[11px] text-[#7aab8e] font-bold uppercase tracking-wide mb-4">{formatDate(match.date)}</p>

      {/* Logolar + skor */}
      <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-2">
        <div className="flex justify-center"><Logo src={match.homeTeamLogo} alt={match.homeTeam} /></div>
        <div className="flex items-center gap-1.5 px-1">
          {match.isCompleted ? (
            <>
              <span className="w-11 h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-ugreen to-ugreend text-2xl font-extrabold text-white tabular-nums shadow-[0_6px_14px_-6px_rgba(15,74,40,0.6)]">{match.homeScore}</span>
              <span className="w-11 h-12 flex items-center justify-center rounded-xl bg-gradient-to-b from-ugreen to-ugreend text-2xl font-extrabold text-white tabular-nums shadow-[0_6px_14px_-6px_rgba(15,74,40,0.6)]">{match.awayScore}</span>
            </>
          ) : (
            <span className="h-12 flex items-center text-sm font-extrabold text-ugold px-3 rounded-xl bg-ugold/10 ring-1 ring-ugold/25">VS</span>
          )}
        </div>
        <div className="flex justify-center"><Logo src={match.awayTeamLogo} alt={match.awayTeam} /></div>
      </div>

      {/* Takım isimleri */}
      <div className="grid grid-cols-[1fr_auto_1fr] gap-2 mt-3 items-start">
        <span className={`text-[12px] font-extrabold text-center leading-tight line-clamp-2 min-h-[30px] ${urfaIsHome ? 'text-ugreen' : 'text-ugreenm'}`}>{match.homeTeam}</span>
        <span className="w-[94px]" />
        <span className={`text-[12px] font-extrabold text-center leading-tight line-clamp-2 min-h-[30px] ${!urfaIsHome ? 'text-ugreen' : 'text-ugreenm'}`}>{match.awayTeam}</span>
      </div>

      {/* Stat — alta sabit */}
      <div className="mt-auto pt-3.5 border-t border-[#edf7f2] flex items-center justify-center gap-1.5">
        <span className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-utxt2 bg-[#f4faf0] px-3 py-1.5 rounded-full">
          <MapPin size={12} className="text-ugreen shrink-0" />
          <span className="truncate max-w-[180px]">{match.venue || '—'}</span>
        </span>
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
    <section className="reveal relative py-20 md:py-24 bg-[#f8faf9] overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -top-6 left-0 font-heading text-[18vw] leading-none font-extrabold text-ugreen/[0.04] select-none hidden md:block">MAÇ</span>
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Başlık + sıradaki maç geri sayımı */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 mb-3">
              <span className="block h-2.5 w-2.5 rounded-full bg-ugold" />
              <span className="text-[12px] font-extrabold tracking-[0.25em] uppercase text-ugold">{meta.league} · {meta.season}</span>
            </span>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-ugreenm tracking-[-0.03em] leading-[0.92]">
              MAÇ <span className="text-ugreen">MERKEZİ</span>
            </h2>
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
