import { notFound } from 'next/navigation'
import Link from 'next/link'
import { getPlayerProfile } from '@/lib/supabase/player-profiles-server'
import { ArrowLeft } from 'lucide-react'
import type { Metadata } from 'next'

const IgIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="2" width="20" height="20" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" y1="6.5" x2="17.51" y2="6.5"/></svg>
)
const XIcon = () => (
  <svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/></svg>
)

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }>; searchParams: Promise<{ sezon?: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const { player } = await getPlayerProfile(slug)
  return { title: player ? player.name : 'Oyuncu' }
}

/* Doğum tarihinden yaş (dd.mm.yyyy veya yyyy-mm-dd) */
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

export default async function OyuncuProfil({ params, searchParams }: Props) {
  const { slug } = await params
  const { sezon } = await searchParams
  const { player, seasons } = await getPlayerProfile(slug, sezon)
  if (!player) notFound()

  const age = ageFrom(player.birthDate)
  const initials = player.name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR')

  const facts: [string, string | null][] = [
    ['Forma No', player.number != null ? String(player.number) : null],
    ['Mevki', player.position],
    ['Doğum Tarihi', player.birthDate],
    ['Doğum Yeri', player.birthPlace],
    ['Yaş', age != null ? `${age}` : null],
    ['Uyruk', player.nationality],
    ['Boy', player.height],
    ['Kilo', player.weight],
    ['Geldiği Takım', player.prevTeam],
    ['Lisans No', player.licenseNo],
    ['Kulüp', player.club],
  ]

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#0c3a23] to-[#092d18] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 right-0 w-[420px] h-[420px] rounded-full bg-[#1A6B3C]/40 blur-3xl" />
        {player.number != null && (
          <div className="pointer-events-none absolute top-2 right-6 font-heading text-[16rem] font-black text-white/[0.03] leading-none select-none">{player.number}</div>
        )}
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/kadro" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Kadroya Dön
          </Link>

          <div className="flex flex-col sm:flex-row items-center sm:items-end gap-6">
            {/* Foto */}
            <div className="relative w-40 h-48 sm:w-44 sm:h-56 rounded-2xl overflow-hidden ring-2 ring-white/15 shadow-2xl shrink-0 bg-[#0b3a20]">
              {player.photoUrl
                ? <img src={player.photoUrl} alt={player.name} className="w-full h-full object-cover object-top" />
                : <div className="w-full h-full flex items-center justify-center"><span className="text-5xl font-black text-white/15">{initials}</span></div>}
            </div>

            <div className="text-center sm:text-left">
              <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                {player.number != null && <span className="font-heading text-3xl font-black text-[#FFD100]">#{player.number}</span>}
                {player.position && <span className="text-[11px] font-black tracking-widest uppercase text-white/60 bg-white/10 rounded-full px-3 py-1">{player.position}</span>}
                {!player.active && <span className="text-[11px] font-black uppercase text-white/50 bg-white/10 rounded-full px-3 py-1">Eski Kadro</span>}
              </div>
              <h1 className="font-heading text-3xl md:text-5xl font-black text-white tracking-tight uppercase leading-tight">{player.name}</h1>
              <p className="mt-2 text-[11px] font-black tracking-[0.2em] uppercase text-[#FFD100]/60">Sezon {player.season}</p>

              {(player.instagram || player.twitter) && (
                <div className="flex items-center justify-center sm:justify-start gap-2 mt-4">
                  {player.instagram && <a href={player.instagram} target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FFD100] hover:text-[#0f4a28] transition-colors"><IgIcon /></a>}
                  {player.twitter && <a href={player.twitter} target="_blank" rel="noopener noreferrer" className="h-9 w-9 flex items-center justify-center rounded-full bg-white/10 text-white hover:bg-[#FFD100] hover:text-[#0f4a28] transition-colors"><XIcon /></a>}
                </div>
              )}
            </div>
          </div>

          {/* Sezon seçici */}
          {seasons.length > 1 && (
            <div className="flex flex-wrap items-center gap-2 mt-7">
              <span className="text-[10px] font-black tracking-widest uppercase text-white/40">Sezonlar:</span>
              {seasons.map((s) => (
                <Link key={s} href={`/oyuncu/${slug}?sezon=${s}`}
                  className={`text-xs font-black px-3 py-1.5 rounded-full transition-all ${s === player.season ? 'bg-[#FFD100] text-[#0f4a28]' : 'bg-white/10 text-white/70 hover:bg-white/20'}`}>
                  {s}
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 pb-16 grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6">
        {/* Biyografi / açıklama */}
        <div className="space-y-6">
          {(player.bio || player.description) ? (
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 md:p-8">
              <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-4 flex items-center gap-2">
                <span className="inline-block w-1 h-4 bg-[#FFD100] rounded-full" /> Biyografi
              </h2>
              <div className="space-y-4 text-[15px] text-[#3d4a44] leading-relaxed whitespace-pre-line">
                {player.bio || player.description}
              </div>
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-8 text-center">
              <p className="text-sm font-bold text-[#092d18]">Biyografi yakında</p>
              <p className="text-xs text-[#7aab8e] mt-1">Oyuncu biyografisi yönetim tarafından eklenecek.</p>
            </div>
          )}
        </div>

        {/* Künye */}
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 h-fit">
          <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-4 flex items-center gap-2">
            <span className="inline-block w-1 h-4 bg-[#FFD100] rounded-full" /> Künye
          </h2>
          <dl className="divide-y divide-[#edf7f2]">
            {facts.filter(([, v]) => v).map(([k, v]) => (
              <div key={k} className="flex items-center justify-between py-2.5">
                <dt className="text-[13px] text-[#7aab8e] font-semibold">{k}</dt>
                <dd className="text-sm font-bold text-[#092d18] text-right">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  )
}
