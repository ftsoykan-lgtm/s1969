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
  const nameParts = player.name.split(' ').filter(Boolean)
  const initials = nameParts.slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')
  const surname = nameParts.length > 1 ? nameParts[nameParts.length - 1] : player.name

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
      {/* ════ HERO — ortalanmış foto + dev isim filigranı (ibfk tarzı) ════ */}
      <div className="relative overflow-hidden bg-[linear-gradient(160deg,var(--c-ugreendd)_0%,var(--c-ugreend)_58%,var(--c-ugreenm)_100%)]">
        <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-ugold/50 to-transparent" />
        <div className="pointer-events-none absolute -top-32 -left-20 w-[480px] h-[480px] rounded-full bg-ugreen/40 blur-[130px]" />
        {/* dev soyisim filigranı */}
        <span aria-hidden className="pointer-events-none absolute inset-x-0 top-1/2 -translate-y-1/2 text-center font-heading text-[26vw] md:text-[22rem] font-extrabold uppercase leading-none text-white/[0.045] select-none whitespace-nowrap overflow-hidden">{surname}</span>

        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 pt-6 pb-12">
          <Link href="/kadro" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-4">
            <ArrowLeft size={16} /> Kadroya Dön
          </Link>

          <div className="flex flex-col items-center text-center">
            {/* Fotoğraf + marka patlaması */}
            <div className="relative w-52 sm:w-60">
              <span aria-hidden className="pointer-events-none absolute -inset-3 rounded-[28px] bg-ugold/15 blur-2xl" />
              <div className="relative aspect-[4/5] rounded-[24px] overflow-hidden ring-1 ring-white/12 shadow-[0_30px_70px_-30px_rgba(0,0,0,0.85)]">
                <div aria-hidden className="absolute inset-0 bg-[conic-gradient(from_210deg_at_50%_40%,#1b5e44,#f5c400_25%,#ffffff_45%,#1b5e44_70%,#0c2e22_100%)] opacity-90" />
                <div aria-hidden className="absolute inset-0 bg-[radial-gradient(120%_90%_at_50%_120%,rgba(12,46,34,0.85),transparent_60%)]" />
                {player.photoUrl
                  ? <img src={player.photoUrl} alt={player.name} className="relative h-full w-full object-cover object-top" />
                  : <span className="relative flex h-full w-full items-center justify-center font-heading text-7xl font-extrabold text-white/25">{initials}</span>}
              </div>
            </div>

            {/* No + mevki + bayrak */}
            <div className="mt-5 flex items-center justify-center gap-3 flex-wrap">
              {player.number != null && <span className="font-heading text-4xl font-extrabold text-ugold leading-none">#{player.number}</span>}
              {player.position && <span className="text-[11px] font-extrabold tracking-widest uppercase text-ugreend bg-ugold rounded-full px-3 py-1">{player.position}</span>}
              {player.flagCode && <img src={`https://flagcdn.com/h20/${player.flagCode}.png`} alt="" className="h-4 rounded-sm shadow" />}
              {!player.active && <span className="text-[11px] font-extrabold uppercase text-white/60 bg-white/10 rounded-full px-3 py-1">Eski Kadro</span>}
            </div>

            <h1 className="mt-3 font-heading text-4xl md:text-6xl font-extrabold text-white tracking-tight uppercase leading-[0.95] drop-shadow-2xl">{player.name}</h1>
            <p className="mt-2 text-[11px] font-extrabold tracking-[0.25em] uppercase text-ugold/60">Şanlıurfaspor · Sezon {player.season}</p>

            {(player.instagram || player.twitter) && (
              <div className="flex items-center justify-center gap-2.5 mt-5">
                {player.instagram && <a href={player.instagram} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-ugold hover:text-ugreend transition-colors"><IgIcon /></a>}
                {player.twitter && <a href={player.twitter} target="_blank" rel="noopener noreferrer" className="h-10 w-10 flex items-center justify-center rounded-full bg-white/10 border border-white/15 text-white hover:bg-ugold hover:text-ugreend transition-colors"><XIcon /></a>}
              </div>
            )}

            {seasons.length > 1 && (
              <div className="flex flex-wrap items-center justify-center gap-2 mt-5">
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

      {/* ════ BİLGİ KARTI (ibfk tarzı — ortalı satırlar, altın ayraç) ════ */}
      {stats.length > 0 && (
        <div className="relative -mt-8 mb-4 mx-auto max-w-2xl px-4 sm:px-6 lg:px-8">
          <div className="panel-premium overflow-hidden divide-y divide-ugold/20">
            {stats.map((s) => (
              <div key={s.label} className="flex items-center justify-center gap-3 px-6 py-4 text-center">
                <s.icon size={14} className="text-ugreen/60 shrink-0" />
                <span className="text-[11px] font-bold tracking-wide uppercase text-[#7aab8e]">{s.label}</span>
                <span className="ml-auto text-[15px] font-extrabold text-ugreenm">{s.value}</span>
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
