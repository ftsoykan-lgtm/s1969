import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeasonPlayers, getProfileSeasonsServer, type ProfilePlayer } from '@/lib/supabase/player-profiles-server'
import { getSitePlayers } from '@/lib/supabase/players-server'
import PlayerCard, { type CardPlayer } from '@/components/players/PlayerCard'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Takım Kadrosu',
  description: 'Şanlıurfaspor profesyonel takım kadrosu — sezonluk.',
}

export const revalidate = 60

const POSITION_ORDER = ['Kaleci', 'Defans', 'Orta Saha', 'Forvet']

interface Props { searchParams: Promise<{ sezon?: string }> }

export default async function KadroPage({ searchParams }: Props) {
  const { sezon } = await searchParams
  const profileSeasons = await getProfileSeasonsServer()

  let players: CardPlayer[] = []
  let season: string | null = null
  let seasons: string[] = profileSeasons

  if (profileSeasons.length > 0) {
    // Sezon bazlı sistem (player_profiles)
    const sel = sezon && profileSeasons.includes(sezon) ? sezon : profileSeasons[0]
    const res = await getSeasonPlayers(sel)
    players = res.players.map((p: ProfilePlayer) => ({
      name: p.name, slug: p.slug, photoUrl: p.photoUrl, number: p.number, position: p.position, flagCode: p.flagCode,
    }))
    season = res.season
  } else {
    // Henüz profil yoksa eski sisteme düş (TFF canlı kadro)
    const res = await getSitePlayers()
    players = res.players
    season = res.season
    seasons = []
  }

  const groups = POSITION_ORDER.map((pos) => ({ pos, list: players.filter((p) => p.position === pos) })).filter((g) => g.list.length > 0)
  const other = players.filter((p) => !POSITION_ORDER.includes(p.position ?? ''))

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="page-hero py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">
            Takım <span className="text-ugold">Kadrosu</span>
          </h1>
          {players.length > 0 && <p className="mt-3 text-[11px] text-white/40">{players.length} oyuncu</p>}

          {/* Sezon seçici */}
          {seasons.length >= 1 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/40">Sezon:</span>
              {seasons.map((s) => (
                <Link key={s} href={s === seasons[0] ? '/kadro' : `/kadro?sezon=${s}`}
                  className={`text-xs font-extrabold px-3 py-1.5 rounded-full transition-all ${s === season ? 'bg-ugold text-ugreend' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {s}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {players.length === 0 ? (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-16 text-center max-w-xl mx-auto">
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-2xl bg-[#edf7f2] mb-5">
              <Loader2 size={28} className="text-ugreen animate-spin" />
            </div>
            <h2 className="text-xl font-extrabold text-ugreenm mb-2">Kadro Güncelleniyor...</h2>
            <p className="text-sm text-utxt2 leading-relaxed">
              Güncel sezon kadrosu TFF sisteminde henüz yayınlanmadı. Kadro açıklandığında otomatik görünecek.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((g) => (
              <div key={g.pos}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-4 h-0.5 bg-ugold" />
                  <h2 className="text-sm font-extrabold tracking-widest uppercase text-ugreen">{g.pos}</h2>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {g.list.map((p) => <PlayerCard key={p.slug} player={p} />)}
                </div>
              </div>
            ))}

            {other.length > 0 && (
              <div>
                {groups.length > 0 && (
                  <div className="flex items-center gap-3 mb-6">
                    <span className="block w-4 h-0.5 bg-ugold" />
                    <h2 className="text-sm font-extrabold tracking-widest uppercase text-ugreen">Kadro</h2>
                  </div>
                )}
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                  {other.map((p) => <PlayerCard key={p.slug} player={p} />)}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}
