import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPlayerProfile } from '@/lib/supabase/player-profiles-server'
import { ArrowLeft, Cake, MapPin, Globe, Ruler, Dumbbell, Shirt, Calendar, ArrowLeftRight } from 'lucide-react'
import type { Metadata } from 'next'

const IgIcon = () => (
  <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const XIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)

export const revalidate = 60

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ sezon?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { player } = await getPlayerProfile(slug)
  return { title: player ? player.name : 'Oyuncu' }
}

function ageFrom(birth?: string | null): number | null {
  if (!birth) return null
  let y: number, m: number, d: number
  const iso = birth.match(/^(\d{4})-(\d{2})-(\d{2})/)
  const tr = birth.match(/^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})/)
  if (iso) { y = +iso[1]; m = +iso[2]; d = +iso[3] }
  else if (tr) { d = +tr[1]; m = +tr[2]; y = +tr[3] }
  else return null
  const now = new Date()
  let age = now.getFullYear() - y
  const mm = now.getMonth() + 1
  if (mm < m || (mm === m && now.getDate() < d)) age--
  return age >= 0 && age < 60 ? age : null
}

type Stat = { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }

export default async function OyuncuProfil({ params, searchParams }: Props) {
  const { slug } = await params
  const { sezon } = await searchParams
  const { player, seasons } = await getPlayerProfile(slug, sezon)
  if (!player) notFound()

  const age = ageFrom(player.birthDate)
  const initials = player.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')

  const stats: Stat[] = ([
    player.position ? { icon: Shirt, label: 'Mevki', value: player.position } : null,
    age != null ? { icon: Calendar, label: 'Yaş', value: `${age}` } : null,
    player.birthDate ? { icon: Cake, label: 'Doğum Tarihi', value: player.birthDate } : null,
    player.birthPlace ? { icon: MapPin, label: 'Doğum Yeri', value: player.birthPlace } : null,
    player.nationality ? { icon: Globe, label: 'Uyruk', value: player.nationality } : null,
    player.height ? { icon: Ruler, label: 'Boy', value: player.height } : null,
    player.weight ? { icon: Dumbbell, label: 'Kilo', value: player.weight } : null,
    player.prevTeam ? { icon: ArrowLeftRight, label: 'Geldiği Takım', value: player.prevTeam } : null,
  ].filter(Boolean)) as Stat[]

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* ════ PREMIUM HERO ════ */}
      <div className="relative overflow-hidden bg-gradient-to-br from-[#0c3a23] via-ugreend to-ugreenm">
        <div className="pointer-events-none absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-ugreen/40 blur-[120px]" />
        <div className="pointer-events-none absolute top-10 right-10 w-[360px] h-[360px] rounded-full bg-ugold/[0.06] blur-[100px]" />
        {player.number != null && (
          <div className="pointer-events-none absolute -bottom-16 right-2 sm:right-16 font-heading text-[20rem] md:text-[26rem] font-extrabold text-white/[0.04] leading-none select-none">{player.number}</div>
        )}

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pt-8 pb-0">
          <Link href="/kadro" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-6">
            <ArrowLeft size={16} /> Kadroya Dön
          </Link>

          <div className="grid md:grid-cols-[300px_1fr] gap-8 items-end">
            <div className="relative mx-auto md:mx-0">
              <div className="absolute -inset-3 bg-ugold/10 blur-2xl rounded-3xl" />
              <div className="relative w-56 h-72 md:w-[300px] md:h-[380px] rounded-t-3xl overflow-hidden bg-gradient-to-b from-[#1f7a45] to-[#0b3a20] ring-1 ring-white/10 shadow-2xl">
                {player.photoUrl
                  ? <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover object-top" />
                  : <div className="w-full h-full flex items-center justify-center"><span className="text-7xl font-extrabold text-white/15">{initials}</span></div>}
                <div className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-ugreenm to-transparent" />
              </div>
            </div>

            <div className="pb-8 text-center md:text-left">
              <div className="flex items-center justify-center md:justify-start gap-3 mb-3 flex-wrap">
                {player.number != null && <span className="font-heading text-4xl font-extrabold text-ugold leading-none">#{player.number}</span>}
                {player.position && <span className="text-[11px] font-extrabold tracking-widest uppercase text-ugreend bg-ugold rounded-full px-3 py-1">{player.position}</span>}
                {player.flagCode && <img src={`https://flagcdn.com/h20/${player.flagCode}.png`} alt="" className="h-4 rounded-sm shadow" />}
                {!player.active && <span className="text-[11px] font-extrabold uppercase text-white/60 bg-white/10 rounded-full px-3 py-1">Eski Kadro</span>}
              </div>
              <h1 className="font-heading text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase leading-[0.95] drop-shadow-2xl">{player.name}</h1>
              <p className="mt-3 text-[11px] font-extrabold tracking-[0.25em] uppercase text-ugold/60">Şanlıurfaspor · Sezon {player.season}</p>

              {(player.instagram || player.twitter) && (
                <div className="flex items-center justify-center md:justify-start gap-2.5 mt-5">
                  {player.instagram && <a href={player.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-ugold hover:text-ugreend transition-colors"><IgIcon /></a>}
                  {player.twitter && <a href={player.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-ugold hover:text-ugreend transition-colors"><XIcon /></a>}
                </div>
              )}

              {seasons.length > 1 && (
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 mt-5">
                  <span className="text-[10px] font-extrabold tracking-widest uppercase text-white/40">Sezonlar:</span>
                  {seasons.map((s) => (
                    <Link key={s} href={`/oyuncu/${slug}?sezon=${s}`}
                      className={`text-xs font-extrabold px-3 py-1.5 rounded-full transition-all ${s === player.season ? 'bg-ugold text-ugreend' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>{s}</Link>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="relative h-1 bg-gradient-to-r from-ugreen via-ugold to-ugreen mt-2" />
      </div>

      {/* ════ İSTATİSTİK KARTLARI ════ */}
      {stats.length > 0 && (
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-8">
            {stats.map((s) => (
              <div key={s.label} className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-4 flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-ugreen to-ugreend text-ugold shrink-0">
                  <s.icon size={17} />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-extrabold tracking-widest uppercase text-[#7aab8e]">{s.label}</p>
                  <p className="text-sm font-extrabold text-ugreenm truncate">{s.value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ════ BİYOGRAFİ ════ */}
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 pb-16">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 md:p-9">
          <h2 className="text-xs font-extrabold tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-ugold rounded-full" /> Biyografi
          </h2>
          {(player.bio || player.description) ? (
            <div className="text-[15px] md:text-base text-[#3d4a44] leading-relaxed whitespace-pre-line">{player.bio || player.description}</div>
          ) : (
            <p className="text-sm text-[#7aab8e]">Oyuncu biyografisi yönetim tarafından eklendiğinde burada görünecek.</p>
          )}
        </div>
      </div>
    </div>
  )
}
