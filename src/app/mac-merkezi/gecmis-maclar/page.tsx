import type { Metadata } from 'next'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import MacMerkezi from '@/components/macmerkezi/MacMerkezi'
import MatchTabs from '@/components/macmerkezi/MatchTabs'
import SeasonPills from '@/components/macmerkezi/SeasonPills'
import SeasonStats from '@/components/macmerkezi/SeasonStats'

export const metadata: Metadata = {
  title: 'Tüm Maçlar — Maç Merkezi',
  description: 'Şanlıurfaspor tüm maçlar, fikstür ve sonuçlar — sezon arşivi dahil.',
}

export const revalidate = 60

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

  // Arşiv puan durumu koruması: maçlar oynanmış ama tablo tümüyle sıfırsa arşiv bozuk/eksiktir
  // (eski scraper hatası bazı arşivlerin standings'ini boş bırakmış olabilir) → yanıltıcı sıfır
  // tablo yerine not göster. Güncel sezon başındaki gerçek sıfır tablo bundan etkilenmez.
  const hasPlayed = matches.some((m) => m.isCompleted)
  const standingsHasData = standings.some((s) => s.played > 0 || s.points > 0)
  const standingsNote = archived && hasPlayed && !standingsHasData
    ? `${activeSeason} sezonunun puan tablosu arşivde bulunmuyor. Maç sonuçları aşağıda eksiksiz yer alıyor.`
    : undefined

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Tüm <span className="text-ugold">Maçlar</span>
          </h1>
          <p className="mt-3 text-[11px] text-white/40">Sezonun tüm fikstürü ve sonuçları{archived ? ' · Arşiv' : ''}</p>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <MatchTabs />
          <SeasonPills seasons={allSeasons} active={activeSeason} current={live.meta.season} basePath="/mac-merkezi/gecmis-maclar" />
        </div>
        <div className="mb-8">
          <SeasonStats matches={matches} season={activeSeason} />
        </div>
        <MacMerkezi all={matches} standings={standings} season={activeSeason} logos={logoMap} standingsNote={standingsNote} />
      </div>
    </div>
  )
}
