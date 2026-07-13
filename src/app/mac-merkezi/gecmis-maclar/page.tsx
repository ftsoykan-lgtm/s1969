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
            <div className="flex items-center gap-2">
              <span className="hidden sm:block text-[10px] font-extrabold tracking-[0.2em] uppercase text-[#7aab8e]">Sezon</span>
              <div className="flex items-center gap-1 bg-white border border-[#ddeae2] rounded-full p-1 shadow-sm">
                {allSeasons.map((s) => {
                  const isCurrent = s === live.meta.season
                  const active = s === activeSeason
                  return (
                    <Link key={s} href={isCurrent ? '/mac-merkezi/gecmis-maclar' : `/mac-merkezi/gecmis-maclar?sezon=${s}`}
                      className={`relative px-4 py-2 rounded-full text-[12px] font-extrabold tracking-wide tabular-nums transition-all ${
                        active
                          ? 'bg-gradient-to-b from-ugreen to-ugreend text-white shadow-[0_4px_12px_-4px_rgba(12,46,34,0.5)]'
                          : 'text-utxt2 hover:bg-[#f5f9f6] hover:text-ugreenm'
                      }`}>
                      {s}
                      {isCurrent && <span className={`ml-1.5 inline-block w-1.5 h-1.5 rounded-full align-middle ${active ? 'bg-ugold' : 'bg-ugreen/50'}`} />}
                    </Link>
                  )
                })}
              </div>
            </div>
          )}
        </div>
        <MacMerkezi all={matches} standings={standings} season={activeSeason} logos={logoMap} standingsNote={standingsNote} />
      </div>
    </div>
  )
}
