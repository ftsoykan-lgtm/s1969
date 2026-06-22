import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Clock, Flag, ExternalLink, Shield, Users } from 'lucide-react'
import type { Metadata } from 'next'
import type { LineupPlayer, MatchEvent } from '@/types'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ macId: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { macId } = await params
  const { matches } = await getLiveTff()
  const m = matches.find((x) => x.macId === macId)
  if (!m) return { title: 'Maç Detayı' }
  return { title: `${m.homeTeam} - ${m.awayTeam}` }
}

const ROLE_ORDER = ['Hakem', '1. Yardımcı Hakem', '2. Yardımcı Hakem', 'Dördüncü Hakem']

/* İlk 11'i diziliş satırlarına böl (1-4-3-3 vb.) */
function formationRows(players: LineupPlayer[]): LineupPlayer[][] {
  const n = players.length
  if (n === 0) return []
  if (n !== 11) {
    // bilinmeyen sayı → 4'erli satırlar
    const rows: LineupPlayer[][] = []
    for (let i = 0; i < n; i += 4) rows.push(players.slice(i, i + 4))
    return rows
  }
  // 11 → GK, DEF(4), MID(3), FWD(3)
  return [players.slice(0, 1), players.slice(1, 5), players.slice(5, 8), players.slice(8, 11)]
}

/* Forma rozeti */
function Jersey({ p, accent }: { p: LineupPlayer; accent: { bg: string; fg: string } }) {
  return (
    <div className="flex flex-col items-center gap-1.5 w-16">
      <div className="relative h-11 w-11 rounded-full flex items-center justify-center font-black text-sm shadow-lg ring-2 ring-white/30"
        style={{ background: accent.bg, color: accent.fg }}>
        {p.number ?? ''}
      </div>
      <span className="text-[10px] font-bold text-white text-center leading-tight line-clamp-2 drop-shadow">{p.name}</span>
    </div>
  )
}

/* Yarı saha — bir takımın İlk 11'i */
function Pitch({ players, accent }: { players: LineupPlayer[]; accent: { bg: string; fg: string } }) {
  const rows = formationRows(players)
  return (
    <div className="relative rounded-2xl overflow-hidden bg-gradient-to-b from-[#1A6B3C] to-[#0c3a20] p-4 ring-1 ring-white/10">
      {/* saha çizgileri */}
      <div className="pointer-events-none absolute inset-0 opacity-30">
        <div className="absolute inset-4 border-2 border-white/25 rounded-lg" />
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-28 h-12 border-2 border-t-0 border-white/25 rounded-b-lg" />
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 w-28 h-12 border-2 border-b-0 border-white/25 rounded-t-lg" />
        <div className="absolute top-1/2 left-4 right-4 h-px bg-white/25" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-16 h-16 border-2 border-white/25 rounded-full" />
      </div>
      {/* diziliş — forvet üstte, kaleci altta */}
      <div className="relative flex flex-col-reverse gap-4 py-2 min-h-[300px] justify-between">
        {rows.map((row, i) => (
          <div key={i} className="flex justify-evenly items-start">
            {row.map((p, j) => <Jersey key={j} p={p} accent={accent} />)}
          </div>
        ))}
      </div>
    </div>
  )
}

/* Olay ikonu */
function EventIcon({ type }: { type: MatchEvent['type'] }) {
  if (type === 'goal') return <span className="text-base">⚽</span>
  if (type === 'yellow') return <span className="inline-block w-3 h-4 rounded-sm bg-[#FFD100]" />
  if (type === 'red') return <span className="inline-block w-3 h-4 rounded-sm bg-red-600" />
  return <span className="text-[#1A6B3C]">↔</span>
}

export default async function MacDetayPage({ params }: Props) {
  const { macId } = await params
  const [{ matches: raw }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(raw, logoMap)
  const match = matches.find((m) => m.macId === macId)
  if (!match) notFound()

  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  const referees = (match.referees ?? []).slice().sort(
    (a, b) => ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
  )
  const lineups = match.lineups
  const events = (match.events ?? []).slice().sort((a, b) => (a.minute ?? 0) - (b.minute ?? 0))
  const hasLineups = !!(lineups && (lineups.home.starters.length || lineups.away.starters.length))

  // Renkler: Şanlıurfaspor sarı-yeşil, rakip beyaz-gri
  const sfkAccent = { bg: '#FFD100', fg: '#0f4a28' }
  const oppAccent = { bg: '#ffffff', fg: '#0f4a28' }
  const homeAccent = urfaIsHome ? sfkAccent : oppAccent
  const awayAccent = urfaIsHome ? oppAccent : sfkAccent

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* ── Skor başlığı ──────────────────────────────────────── */}
      <div className="relative bg-[#0f4a28] overflow-hidden">
        <div className="pointer-events-none absolute -top-24 -right-24 w-[420px] h-[420px] rounded-full bg-[#1A6B3C]/40 blur-3xl" />
        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/fikstur" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Maç Merkezine Dön
          </Link>

          <div className="flex justify-center mb-6">
            <span className="inline-block bg-[#FFD100] text-[#0f4a28] text-[11px] font-black tracking-[0.15em] uppercase px-4 py-1.5"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              {match.competition}{match.week ? ` · ${match.week}. Hafta` : ''}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-6">
            {/* Ev sahibi */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-28 md:h-28"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-lg font-black text-center ${urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.homeTeam}</span>
            </div>

            {/* Skor */}
            <div className="text-center px-2">
              {match.isCompleted ? (
                <>
                  <div className="text-5xl md:text-7xl font-black text-white tabular-nums whitespace-nowrap leading-none">
                    {match.homeScore}<span className="text-white/25 mx-2 md:mx-3">-</span>{match.awayScore}
                  </div>
                  <span className="inline-block mt-3 text-[10px] font-black tracking-widest uppercase text-[#FFD100]/70">Maç Sonucu</span>
                </>
              ) : (
                <>
                  <div className="text-3xl md:text-4xl font-black text-[#FFD100]">{match.time || 'vs'}</div>
                  <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase text-white/40">{match.date ? formatDate(match.date) : 'Yakında'}</span>
                </>
              )}
            </div>

            {/* Deplasman */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-28 md:h-28"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-lg font-black text-center ${!urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.awayTeam}</span>
            </div>
          </div>

          {/* alt bilgi şeridi */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 mt-8 text-white/55 text-xs font-semibold">
            {match.date && <span className="inline-flex items-center gap-1.5"><Calendar size={13} className="text-[#FFD100]" />{formatDate(match.date)}</span>}
            {match.time && <span className="inline-flex items-center gap-1.5"><Clock size={13} className="text-[#FFD100]" />{match.time}</span>}
            {match.venue && <span className="inline-flex items-center gap-1.5"><MapPin size={13} className="text-[#FFD100]" />{match.venue}</span>}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 pb-16 space-y-6">

        {/* ── Maç olayları ──────────────────────────────────────── */}
        {events.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-5">Maç Olayları</h2>
            <div className="space-y-1">
              {events.map((e, i) => {
                const isHome = e.team === 'home'
                return (
                  <div key={i} className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 py-2">
                    <div className={`flex items-center gap-2 ${isHome ? 'justify-end text-right' : 'opacity-0 pointer-events-none'}`}>
                      <span className="text-sm font-bold text-[#092d18]">{e.player}{e.detail ? <span className="text-[#7aab8e] font-normal"> · {e.detail}</span> : null}</span>
                      <EventIcon type={e.type} />
                    </div>
                    <span className="flex h-7 min-w-7 px-2 items-center justify-center rounded-full bg-[#f5f9f6] text-[11px] font-black text-[#1A6B3C] tabular-nums">
                      {e.minute != null ? `${e.minute}'` : '-'}
                    </span>
                    <div className={`flex items-center gap-2 ${!isHome ? 'justify-start text-left' : 'opacity-0 pointer-events-none'}`}>
                      <EventIcon type={e.type} />
                      <span className="text-sm font-bold text-[#092d18]">{e.player}{e.detail ? <span className="text-[#7aab8e] font-normal"> · {e.detail}</span> : null}</span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {/* ── Saha dizilişi ─────────────────────────────────────── */}
        {hasLineups ? (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
              <Shield size={14} className="text-[#1A6B3C]" /> Saha Dizilişi — İlk 11
            </h2>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="relative w-6 h-6"><Image src={match.homeTeamLogo} alt="" fill className="object-contain" /></div>
                  <span className="text-sm font-black text-[#092d18]">{match.homeTeam}</span>
                </div>
                {lineups!.home.starters.length ? <Pitch players={lineups!.home.starters} accent={homeAccent} />
                  : <EmptyMini text="İlk 11 açıklanmadı" />}
                {lineups!.home.coach && <p className="mt-2 text-xs text-[#7aab8e]">Teknik Direktör: <span className="font-bold text-[#092d18]">{lineups!.home.coach}</span></p>}
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2.5">
                  <div className="relative w-6 h-6"><Image src={match.awayTeamLogo} alt="" fill className="object-contain" /></div>
                  <span className="text-sm font-black text-[#092d18]">{match.awayTeam}</span>
                </div>
                {lineups!.away.starters.length ? <Pitch players={lineups!.away.starters} accent={awayAccent} />
                  : <EmptyMini text="İlk 11 açıklanmadı" />}
                {lineups!.away.coach && <p className="mt-2 text-xs text-[#7aab8e]">Teknik Direktör: <span className="font-bold text-[#092d18]">{lineups!.away.coach}</span></p>}
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-8 text-center">
            <Users size={28} className="mx-auto text-[#cfe3d8] mb-3" />
            <p className="text-sm font-bold text-[#092d18]">Kadrolar henüz açıklanmadı</p>
            <p className="text-xs text-[#7aab8e] mt-1">İlk 11 ve yedekler, maç günü açıklandığında burada görünecek.</p>
          </div>
        )}

        {/* ── Yedekler ──────────────────────────────────────────── */}
        {hasLineups && (lineups!.home.subs.length > 0 || lineups!.away.subs.length > 0) && (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-5">Yedekler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <SubList title={match.homeTeam} logo={match.homeTeamLogo} subs={lineups!.home.subs} />
              <SubList title={match.awayTeam} logo={match.awayTeamLogo} subs={lineups!.away.subs} />
            </div>
          </div>
        )}

        {/* ── Hakemler ──────────────────────────────────────────── */}
        {referees.length > 0 && (
          <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
            <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-4 flex items-center gap-2">
              <Flag size={14} className="text-[#1A6B3C]" /> Hakemler
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {referees.map((r) => (
                <div key={r.name + r.role} className="flex items-center justify-between bg-[#f5f9f6] rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-[#092d18]">{r.name}</span>
                  <span className="text-[11px] font-black text-[#1A6B3C] uppercase tracking-wide">{r.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── Maç bilgileri ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
          <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-4">Maç Bilgileri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info icon={Calendar} label="Tarih" value={match.date ? formatDate(match.date) : '—'} />
            <Info icon={Clock} label="Saat" value={match.time || '—'} />
            <Info icon={MapPin} label="Stadyum" value={match.venue || '—'} />
          </div>
        </div>

        {/* ── TFF resmi link ────────────────────────────────────── */}
        {match.macId && (
          <a href={`https://www.tff.org/Default.aspx?pageID=29&macID=${match.macId}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border border-[#ddeae2] hover:border-[#1A6B3C]/40 text-[#092d18] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all">
            TFF'de Resmi Maç Sayfası
            <ExternalLink size={15} className="text-[#1A6B3C]" />
          </a>
        )}
      </div>
    </div>
  )
}

function SubList({ title, logo, subs }: { title: string; logo: string; subs: LineupPlayer[] }) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        <div className="relative w-5 h-5"><Image src={logo} alt="" fill className="object-contain" /></div>
        <span className="text-sm font-black text-[#092d18]">{title}</span>
      </div>
      {subs.length ? (
        <ul className="space-y-1.5">
          {subs.map((p, i) => (
            <li key={i} className="flex items-center gap-3 bg-[#f5f9f6] rounded-lg px-3 py-2">
              <span className="flex h-6 w-6 items-center justify-center rounded-md bg-white text-[11px] font-black text-[#1A6B3C] tabular-nums shrink-0">{p.number ?? '-'}</span>
              <span className="text-sm font-semibold text-[#092d18] truncate">{p.name}</span>
            </li>
          ))}
        </ul>
      ) : <p className="text-xs text-[#7aab8e]">Yedek bilgisi yok.</p>}
    </div>
  )
}

function EmptyMini({ text }: { text: string }) {
  return (
    <div className="rounded-2xl bg-[#f5f9f6] border border-dashed border-[#cfe3d8] p-8 text-center">
      <p className="text-xs font-bold text-[#7aab8e]">{text}</p>
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3 bg-[#f5f9f6] rounded-xl px-4 py-3">
      <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-[#edf7f2] text-[#1A6B3C] shrink-0">
        <Icon size={16} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">{label}</p>
        <p className="text-sm font-bold text-[#092d18] truncate">{value}</p>
      </div>
    </div>
  )
}
