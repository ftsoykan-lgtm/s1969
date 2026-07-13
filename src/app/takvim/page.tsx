import type { Metadata } from 'next'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import CalendarView, { type CalMatch } from '@/components/takvim/CalendarView'
import FixtureWeekList from '@/components/takvim/FixtureWeekList'

export const metadata: Metadata = {
  title: 'Maç Takvimi',
  description: 'Şanlıurfaspor maç takvimi — ay görünümü ve telefon takvimi senkronizasyonu.',
}

export const revalidate = 60

export default async function TakvimPage() {
  const [{ matches: raw, meta }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(raw, logoMap)

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
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugold/60">{meta.league} · {meta.season}</p>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Maç <span className="text-ugold">Takvimi</span>
          </h1>
          <p className="mt-3 text-[11px] text-white/40">TFF fikstüründen otomatik · {matches.length} maç</p>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-12">
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
