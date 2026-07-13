import type { Metadata } from 'next'
import { getTeamLogoMap, applyLogosToStandings, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getLiveTff } from '@/lib/supabase/tff-server'
import MatchCard from '@/components/macmerkezi/MatchCard'
import StandingsTable from '@/components/standings/StandingsTable'
import MatchTabs from '@/components/macmerkezi/MatchTabs'

export const metadata: Metadata = {
  title: 'Maç Merkezi',
  description: 'Şanlıurfaspor son maçlar, yaklaşan maçlar ve puan durumu — TFF 2. Lig Beyaz Grup.',
}

export const revalidate = 60

function SectionTitle({ children, note }: { children: React.ReactNode; note?: string }) {
  return (
    <div className="flex items-center gap-3 mb-5">
      <span className="block w-1.5 h-7 bg-ugold rounded-full" />
      <h2 className="font-heading text-2xl font-extrabold text-ugreenm tracking-tight">{children}</h2>
      {note && <span className="ml-auto text-xs font-bold text-[#7aab8e]">{note}</span>}
    </div>
  )
}

export default async function MacMerkeziPage() {
  const [{ standings: rawStandings, matches: rawMatches, meta }, logoMap] =
    await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(rawMatches, logoMap)
  const standings = applyLogosToStandings(rawStandings, logoMap)

  const completed = matches.filter((m) => m.isCompleted)
  const last5 = completed.slice(-5).reverse()
  const upcoming = matches.filter((m) => !m.isCompleted && m.date)
    .sort((a, b) => a.date.localeCompare(b.date)).slice(0, 6)

  // Şanlıurfaspor özet (puan tablosundan)
  const sfk = standings.find((s) => s.isCurrentTeam)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Başlık */}
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugold/60">{meta.league} · {meta.season}</p>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Maç <span className="text-ugold">Merkezi</span>
          </h1>

          {/* Özet kutuları */}
          {sfk && (
            <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl">
              <Stat label="Sıra" value={`${sfk.rank}.`} />
              <Stat label="Puan" value={sfk.points} highlight />
              <Stat label="Oynanan" value={sfk.played} />
              <Stat label="Averaj" value={(sfk.goalsFor - sfk.goalsAgainst) > 0 ? `+${sfk.goalsFor - sfk.goalsAgainst}` : `${sfk.goalsFor - sfk.goalsAgainst}`} />
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
        <MatchTabs />

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_400px] gap-8">
          {/* Sol: maçlar */}
          <div className="space-y-12">
            {/* Son maçlar */}
            <section>
              <SectionTitle note={`${completed.length} maç oynandı`}>Son Maçlar</SectionTitle>
              {last5.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {last5.map((m, i) => <MatchCard key={m.id} match={m} logos={logoMap} index={i} />)}
                </div>
              ) : <Empty>Henüz oynanmış maç yok.</Empty>}
            </section>

            {/* Yaklaşan maçlar */}
            <section>
              <SectionTitle note={`${upcoming.length} maç`}>Yaklaşan Maçlar</SectionTitle>
              {upcoming.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {upcoming.map((m, i) => <MatchCard key={m.id} match={m} logos={logoMap} index={i} />)}
                </div>
              ) : <Empty>Yaklaşan maç bulunmuyor.</Empty>}
            </section>
          </div>

          {/* Sağ: puan durumu */}
          <div className="lg:sticky lg:top-24 self-start">
            <SectionTitle>Puan Durumu</SectionTitle>
            <StandingsTable standings={standings} />
          </div>
        </div>
      </div>
    </div>
  )
}

function Stat({ label, value, highlight }: { label: string; value: string | number; highlight?: boolean }) {
  return (
    <div className="rounded-2xl bg-white/[0.07] border border-white/10 px-4 py-3">
      <p className="text-[10px] font-extrabold tracking-widest uppercase text-white/40 mb-1">{label}</p>
      <p className={`text-2xl font-extrabold tabular-nums ${highlight ? 'text-ugold' : 'text-white'}`}>{value}</p>
    </div>
  )
}

function Empty({ children }: { children: React.ReactNode }) {
  return <div className="bg-white rounded-2xl border border-[#ddeae2] p-10 text-center text-sm font-bold text-[#7aab8e]">{children}</div>
}
