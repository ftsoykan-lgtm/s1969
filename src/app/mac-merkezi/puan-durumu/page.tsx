import type { Metadata } from 'next'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import { playedMatches } from '@/lib/tff'
import { recentForm } from '@/lib/standings'
import MatchTabs from '@/components/macmerkezi/MatchTabs'
import SeasonPills from '@/components/macmerkezi/SeasonPills'
import NextMatchSide from '@/components/macmerkezi/NextMatchSide'
import FullStandingsTable from '@/components/standings/FullStandingsTable'
import StandingsSummary from '@/components/standings/StandingsSummary'
import { LastResults, ZoneGuide } from '@/components/standings/StandingsAside'

export const metadata: Metadata = {
  title: 'Puan Durumu — Maç Merkezi',
  description: 'TFF 2. Lig Beyaz Grup güncel puan durumu — Şanlıurfaspor sıra, puan ve form.',
}

export const revalidate = 60

const LAST_RESULTS = 5

interface Props { searchParams: Promise<{ sezon?: string }> }

export default async function PuanDurumuPage({ searchParams }: Props) {
  const { sezon } = await searchParams
  const [live, seasons, logoMap] = await Promise.all([getLiveTff(), getSeasons(), getTeamLogoMap()])

  // Seçili sezon arşivde varsa onu, yoksa güncel sezon (diğer maç merkezi sekmeleriyle aynı kural)
  const archived = sezon && sezon !== live.meta.season ? await getTffBySeason(sezon) : null
  const src = archived ?? live
  const standings = applyLogosToStandings(src.standings, logoMap)
  const played = playedMatches(applyLogosToMatches(src.matches, logoMap))
  const allSeasons = Array.from(new Set([live.meta.season, ...seasons])).filter(Boolean)
  const activeSeason = archived ? sezon! : live.meta.season

  const sfk = standings.find((s) => s.isCurrentTeam)
  const hasData = standings.some((s) => s.played > 0 || s.points > 0)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.2em] text-ugold/80">{live.meta.league}</p>
          <h1 className="mt-2 font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Puan <span className="text-ugold">Durumu</span>
          </h1>
          <p className="mt-3 text-[11px] font-bold uppercase tracking-wide text-white/45">{activeSeason} Sezonu{archived ? ' · Arşiv' : ''}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-8">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <MatchTabs />
          <SeasonPills seasons={allSeasons} active={activeSeason} current={live.meta.season} basePath="/mac-merkezi/puan-durumu" />
        </div>

        {sfk && <StandingsSummary row={sfk} form={recentForm(played)} />}

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <div className="min-w-0">
            {hasData ? (
              <FullStandingsTable standings={standings} season={activeSeason} />
            ) : (
              <div className="rounded-2xl border border-[#ddeae2] bg-white p-10 text-center text-sm font-bold text-[#7aab8e]">
                {archived ? `${activeSeason} sezonunun puan tablosu arşivde bulunmuyor.` : 'Puan tablosu sezonun ilk maçlarından sonra yayınlanacak.'}
              </div>
            )}
          </div>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            {!archived && <NextMatchSide />}
            <LastResults matches={played.slice(-LAST_RESULTS).reverse()} />
            <ZoneGuide />
          </aside>
        </div>
      </div>
    </div>
  )
}
