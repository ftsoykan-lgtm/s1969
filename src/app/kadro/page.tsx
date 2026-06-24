import type { Metadata } from 'next'
import Link from 'next/link'
import { getSeasonPlayers, getProfileSeasonsServer, type ProfilePlayer } from '@/lib/supabase/player-profiles-server'
import { getSitePlayers } from '@/lib/supabase/players-server'
import PlayerCard, { type CardPlayer } from '@/components/players/PlayerCard'
import { Loader2 } from 'lucide-react'

export const metadata: Metadata = {
  title: 'Takım Kadrosu',
  description: 'Şanlıurfaspor FK profesyonel takım kadrosu — sezonluk.',
}

export const dynamic = 'force-dynamic'

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
      <div className="bg-[#0f4a28] py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-[#FFD100]" />
            <p className="text-xs font-black tracking-widest uppercase text-[#FFD100]/60">
              Profesyonel Takım{season ? ` · ${season}` : ''}
            </p>
          </div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight">
            Takım <span className="text-[#FFD100]">Kadrosu</span>
          </h1>
          {players.length > 0 && <p className="mt-3 text-[11px] text-white/40">{players.length} oyuncu</p>}

          {/* Sezon seçici */}
          {seasons.length >= 1 && (
            <div className="flex flex-wrap items-center gap-2 mt-5">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/40">Sezon:</span>
              {seasons.map((s) => (
                <Link key={s} href={s === seasons[0] ? '/kadro' : `/kadro?sezon=${s}`}
                  className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${s === season ? 'bg-[#FFD100] text-[#0f4a28]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
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
              <Loader2 size={28} className="text-[#1A6B3C] animate-spin" />
            </div>
            <h2 className="text-xl font-black text-[#092d18] mb-2">Kadro Güncelleniyor...</h2>
            <p className="text-sm text-[#3d6b52] leading-relaxed">
              Güncel sezon kadrosu TFF sisteminde henüz yayınlanmadı. Kadro açıklandığında otomatik görünecek.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {groups.map((g) => (
              <div key={g.pos}>
                <div className="flex items-center gap-3 mb-6">
                  <span className="block w-4 h-0.5 bg-[#FFD100]" />
                  <h2 className="text-sm font-black tracking-widest uppercase text-[#1A6B3C]">{g.pos}</h2>
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
                    <span className="block w-4 h-0.5 bg-[#FFD100]" />
                    <h2 className="text-sm font-black tracking-widest uppercase text-[#1A6B3C]">Kadro</h2>
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
