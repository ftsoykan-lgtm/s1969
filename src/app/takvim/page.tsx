import type { Metadata } from 'next'
import { getLiveTff, getSeasons, getTffBySeason } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import CalendarView, { type CalMatch } from '@/components/takvim/CalendarView'
import FixtureWeekList from '@/components/takvim/FixtureWeekList'
import SeasonPills from '@/components/macmerkezi/SeasonPills'

export const metadata: Metadata = {
  title: 'Maç Takvimi',
  description: 'Şanlıurfaspor maç takvimi — güncel ve geçmiş sezonlar, ay görünümü ve telefon takvimi senkronizasyonu.',
}

export const revalidate = 60

interface Props { searchParams: Promise<{ sezon?: string }> }

export default async function TakvimPage({ searchParams }: Props) {
  const { sezon } = await searchParams
  const [live, seasons, logoMap] = await Promise.all([getLiveTff(), getSeasons(), getTeamLogoMap()])
  // Seçili sezon arşivde varsa onu, yoksa güncel sezonu göster
  const archived = sezon && sezon !== live.meta.season ? await getTffBySeason(sezon) : null
  const src = archived ?? live
  const meta = src.meta
  const matches = applyLogosToMatches(src.matches, logoMap)
  const activeSeason = archived ? sezon! : live.meta.season
  const allSeasons = Array.from(new Set([live.meta.season, ...seasons])).filter(Boolean)

  // Sezon özeti — hero istatistik bandı için (takvim odaklı: fikstür kompozisyonu)
  const playedCount = matches.filter((m) => m.isCompleted).length
  const homeCount = matches.filter((m) => m.isHome).length
  const stats: { label: string; value: number | string; accent?: boolean }[] = [
    { label: 'Toplam Maç', value: matches.length },
    { label: 'Oynanan', value: playedCount },
    { label: 'Kalan', value: matches.length - playedCount, accent: true },
    { label: 'İç Saha', value: homeCount },
    { label: 'Deplasman', value: matches.length - homeCount },
  ]

  const items: CalMatch[] = matches.filter((m) => m.date).map((m) => {
    const urfaHome = m.homeTeam === 'Şanlıurfaspor'
    return {
      date: m.date,
      time: m.time,
      macId: m.macId ?? null,
      opponent: urfaHome ? m.awayTeam : m.homeTeam,
      opponentLogo: urfaHome ? m.awayTeamLogo : m.homeTeamLogo,
      isHome: urfaHome,
      isCompleted: m.isCompleted,
      homeScore: m.homeScore,
      awayScore: m.awayScore,
      homeTeam: m.homeTeam,
      awayTeam: m.awayTeam,
      roundLabel: m.roundLabel ?? null,
      venue: m.venue,
    }
  })

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Maç <span className="text-ugold">Takvimi</span>
          </h1>
          <p className="mt-3 text-[11px] font-bold tracking-wide uppercase text-white/45">{meta.league} · {activeSeason}{archived ? ' · Arşiv' : ''}</p>

          {/* Sezon özeti — premium istatistik bandı */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2.5 sm:gap-3">
            {stats.map((s) => (
              <div key={s.label} className="rounded-2xl border border-white/10 bg-white/[0.07] px-4 py-3 backdrop-blur-sm">
                <p className="mb-1 text-[10px] font-extrabold uppercase tracking-widest text-white/40">{s.label}</p>
                <p className={`text-2xl font-extrabold tabular-nums ${s.accent ? 'text-ugold' : 'text-white'}`}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Sezon seçici — güncel + geçmiş sezonlar (tüm arşiv) */}
        {allSeasons.length > 1 && (
          <div className="flex justify-end mb-6">
            <SeasonPills seasons={allSeasons} active={activeSeason} current={live.meta.season} basePath="/takvim" />
          </div>
        )}
        {/* Tarihli maç varsa takvim; TFF tarih vermediyse hafta-hafta fikstür listesi */}
        {items.length > 0 ? (
          <CalendarView items={items} season={meta.season} league={meta.league} />
        ) : (
          <FixtureWeekList matches={matches} />
        )}
      </div>
    </div>
  )
}
