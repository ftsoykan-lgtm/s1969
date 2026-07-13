import Link from 'next/link'
import { getSeasonPlayers, getProfileSeasonsServer } from '@/lib/supabase/player-profiles-server'
import { getSitePlayers } from '@/lib/supabase/players-server'
import type { CardPlayer } from '@/components/players/PlayerCard'
import SquadShowcase from './SquadShowcase'

export default async function SquadPreview() {
  // Önce sezon bazlı profiller; yoksa eski TFF canlı kadrosuna düş
  const profileSeasons = await getProfileSeasonsServer()
  let players: CardPlayer[] = []
  let season: string | null = null

  if (profileSeasons.length > 0) {
    const res = await getSeasonPlayers(profileSeasons[0])
    players = res.players.map((p) => ({
      name: p.name, slug: p.slug, photoUrl: p.photoUrl, number: p.number, position: p.position, flagCode: p.flagCode,
    }))
    season = res.season
  } else {
    const res = await getSitePlayers()
    players = res.players
    season = res.season
  }

  return (
    <section className="reveal relative py-20 md:py-24 overflow-hidden bg-[linear-gradient(160deg,var(--c-ugreendd)_0%,var(--c-ugreend)_55%,var(--c-ugreenm)_100%)]">
      {/* atmosfer */}
      <div className="pointer-events-none absolute -top-24 -right-24 w-[460px] h-[460px] rounded-full bg-ugreen/40 blur-[130px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-24 w-[460px] h-[460px] rounded-full bg-ugold/[0.08] blur-[130px]" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/50 to-transparent" />

      <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex items-end justify-between gap-4">
          <div>
            <span className="inline-flex items-center gap-2 mb-3">
              <span className="block h-2.5 w-2.5 rounded-full bg-ugold" />
              <span className="text-[12px] font-extrabold tracking-[0.25em] uppercase text-ugold/80">Profesyonel Takım{season ? ` · ${season}` : ''}</span>
            </span>
            <h2 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.92]">
              TAKIM <span className="text-ugold">KADROSU</span>
            </h2>
          </div>
          <Link href="/kadro"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-extrabold tracking-wide uppercase text-ugreend bg-gradient-to-b from-ugoldl to-ugold rounded-xl px-6 py-3.5 transition-all hover:-translate-y-0.5 shadow-[0_12px_28px_-10px_rgba(245,196,0,0.6)]">
            Tüm Kadro →
          </Link>
        </div>
      </div>

      {players.length === 0 ? (
        <div className="relative mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8">
          <div className="bg-white/[0.05] ring-1 ring-white/10 rounded-2xl p-10 text-center">
            <p className="text-white font-bold">Kadro Güncelleniyor...</p>
            <p className="text-white/50 text-sm mt-1">Güncel sezon kadrosu yakında yayınlanacak.</p>
          </div>
        </div>
      ) : (
        <SquadShowcase players={players} />
      )}
    </section>
  )
}
