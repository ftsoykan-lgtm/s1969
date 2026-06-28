import type { Metadata } from 'next'
import Link from 'next/link'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import MacMerkezi from '@/components/macmerkezi/MacMerkezi'
import MatchTabs from '@/components/macmerkezi/MatchTabs'

export const metadata: Metadata = {
  title: 'Tüm Maçlar — Maç Merkezi',
  description: 'Şanlıurfaspor tüm maçlar, fikstür ve sonuçlar — sezon arşivi dahil.',
}

export const dynamic = 'force-dynamic'

interface Props { searchParams: Promise<{ sezon?: string }> }

export default async function TumMaclarPage({ searchParams }: Props) {
  const { sezon } = await searchParams
  const [live, seasons, logoMap] = await Promise.all([getLiveTff(), getSeasons(), getTeamLogoMap()])

  // Seçili sezon arşivde varsa onu, yoksa güncel sezonu göster
  const archived = sezon && sezon !== live.meta.season ? await getTffBySeason(sezon) : null
  const src = archived ?? live
  const matches = applyLogosToMatches(src.matches, logoMap)
  const standings = applyLogosToStandings(src.standings, logoMap)

  // Sezon listesi: arşiv + güncel (tekilleştir, yeniden eskiye)
  const allSeasons = Array.from(new Set([live.meta.season, ...seasons])).filter(Boolean)
  const activeSeason = archived ? sezon! : live.meta.season

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugold/60">{src.meta.league} · {activeSeason}</p>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Tüm <span className="text-ugold">Maçlar</span>
          </h1>
          <p className="mt-3 text-[11px] text-white/40">Sezonun tüm fikstürü ve sonuçları{archived ? ' · Arşiv' : ''}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <MatchTabs />
          {allSeasons.length > 1 && (
            <div className="flex items-center gap-1.5 bg-white border border-[#ddeae2] rounded-full p-1.5 shadow-sm">
              {allSeasons.map((s) => {
                const isCurrent = s === live.meta.season
                const active = s === activeSeason
                return (
                  <Link key={s} href={isCurrent ? '/mac-merkezi/gecmis-maclar' : `/mac-merkezi/gecmis-maclar?sezon=${s}`}
                    className={`px-4 py-2 rounded-full text-[12px] font-extrabold tracking-wide transition-all ${
                      active ? 'bg-ugreend text-white' : 'text-utxt2 hover:bg-[#f5f9f6]'
                    }`}>
                    {s}{isCurrent ? '' : ''}
                  </Link>
                )
              })}
            </div>
          )}
        </div>
        <MacMerkezi all={matches} standings={standings} season={activeSeason} logos={logoMap} />
      </div>
    </div>
  )
}
