import { getTeamLogoMap, applyLogosToMatches, applyLogosToStandings } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { nextMatch, playedMatches } from '@/lib/tff'
import NextMatchCountdown from './NextMatchCountdown'
import StandingsTable from '@/components/standings/StandingsTable'
import MatchCard from '@/components/macmerkezi/MatchCard'
import MatchCenterCta from '@/components/ui/MatchCenterCta'


/* ─── Bölüm ─────────────────────────────────────────────────── */
export default async function FixturePreview() {
  const [{ matches, standings: rawStandings, meta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const allMatches = applyLogosToMatches(matches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)
  const lastThree = playedMatches(allMatches).slice(-3)

  // Sıradaki maç: en yakın oynanmamış (tarih yoksa fikstür/hafta sırasına göre)
  const next = nextMatch(allMatches)
  const nextInfo = next
    ? {
        opponent: next.isHome ? next.awayTeam : next.homeTeam,
        isHome: next.isHome,
        label: next.roundLabel ?? next.competition ?? null,
        date: next.date || null,
        time: next.time,
      }
    : null

  return (
    <section className="reveal relative py-20 md:py-24 bg-[#f8faf9] overflow-hidden">
      <span aria-hidden className="pointer-events-none absolute -top-6 left-0 font-heading text-[18vw] leading-none font-extrabold text-ugreen/[0.06] select-none hidden md:block">MAÇ</span>
      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">

        {/* Başlık + sıradaki maç geri sayımı */}
        <div className="flex flex-col sm:flex-row sm:items-end gap-5 mb-10">
          <div>
            <span className="inline-flex items-center gap-2 mb-3">
              <span className="block h-2.5 w-2.5 rounded-full bg-ugold" />
              <span className="text-[12px] font-extrabold tracking-[0.25em] uppercase text-[#8a6d00]">{meta.league} · {meta.season}</span>
            </span>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-ugreenm tracking-[-0.03em] leading-[0.92]">
              MAÇ <span className="text-ugreen">MERKEZİ</span>
            </h2>
          </div>
          <div className="sm:ml-auto bg-white border border-[#ddeae2] rounded-2xl px-4 py-3 shadow-sm">
            <NextMatchCountdown match={nextInfo} />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_410px] gap-7">
          {/* Sol: son 3 maç */}
          <div>
            {lastThree.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 items-stretch">
                {lastThree.map((m, i) => <MatchCard key={m.id} match={m} logos={logoMap} index={i} />)}
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
          <MatchCenterCta />
        </div>
      </div>
    </section>
  )
}
