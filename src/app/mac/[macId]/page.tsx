import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Clock, Flag, ExternalLink, Play, Timer, Trophy } from 'lucide-react'
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

/* Olay ikonu */
function EventIcon({ type }: { type: MatchEvent['type'] }) {
  if (type === 'goal') return <span className="text-base leading-none">⚽</span>
  if (type === 'yellow') return <span className="inline-block w-3.5 h-4.5 rounded-[2px] bg-[#FFD100] shadow" style={{ height: 18 }} />
  if (type === 'red') return <span className="inline-block w-3.5 rounded-[2px] bg-[#d01b2a] shadow" style={{ height: 18 }} />
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

  // İlk yarı skoru (≤45. dk goller)
  const goals = events.filter((e) => e.type === 'goal')
  const htHome = goals.filter((e) => e.team === 'home' && (e.minute ?? 0) <= 45).length
  const htAway = goals.filter((e) => e.team === 'away' && (e.minute ?? 0) <= 45).length

  // Zaman çizelgesi kilometre taşları
  type TL = { kind: 'start' } | { kind: 'half' } | { kind: 'end' } | { kind: 'event'; e: MatchEvent }
  const timeline: TL[] = []
  if (match.isCompleted) {
    timeline.push({ kind: 'start' })
    let htDone = false
    for (const e of events) {
      if (!htDone && (e.minute ?? 0) > 45) { timeline.push({ kind: 'half' }); htDone = true }
      timeline.push({ kind: 'event', e })
    }
    if (!htDone) timeline.push({ kind: 'half' })
    timeline.push({ kind: 'end' })
  }

  return (
    <div className="min-h-screen bg-[#f5f9f6]">

      {/* ════ PREMIUM SKOR BAŞLIĞI ════ */}
      <div className="relative bg-gradient-to-b from-[#0c3a23] to-[#092d18] overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#1A6B3C]/40 blur-[120px]" />
        <div className="pointer-events-none absolute top-0 right-8 font-heading text-[14rem] font-black leading-none text-white/[0.02] select-none">VS</div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/mac-merkezi" className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Maç Merkezine Dön
          </Link>

          <div className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 bg-[#FFD100] text-[#0f4a28] text-[11px] font-black tracking-[0.15em] uppercase px-4 py-1.5"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              {match.competition}{match.week ? ` · ${match.week}. Hafta` : ''}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-32 md:h-32 drop-shadow-2xl"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-xl font-black text-center ${urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.homeTeam}</span>
            </div>

            <div className="text-center px-1">
              {match.isCompleted ? (
                <>
                  <div className="flex items-center justify-center gap-3 md:gap-5">
                    <span className="text-6xl md:text-8xl font-black text-white tabular-nums leading-none">{match.homeScore}</span>
                    <span className="text-3xl md:text-5xl font-black text-white/25">-</span>
                    <span className="text-6xl md:text-8xl font-black text-white tabular-nums leading-none">{match.awayScore}</span>
                  </div>
                  {(htHome > 0 || htAway > 0 || goals.length > 0) && (
                    <p className="mt-3 text-xs font-bold text-white/45">İlk Yarı: <span className="text-white/70 tabular-nums">{htHome} - {htAway}</span></p>
                  )}
                  <span className="inline-block mt-2 text-[10px] font-black tracking-[0.2em] uppercase text-[#FFD100]/70">Maç Sonucu</span>
                </>
              ) : (
                <>
                  <div className="text-3xl md:text-5xl font-black text-[#FFD100]">{match.time || 'VS'}</div>
                  <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase text-white/40">{match.date ? formatDate(match.date) : 'Yakında'}</span>
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-32 md:h-32 drop-shadow-2xl"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-xl font-black text-center ${!urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.awayTeam}</span>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-2.5 mt-8">
            {match.date && <Chip icon={Calendar}>{formatDate(match.date)}</Chip>}
            {match.time && <Chip icon={Clock}>{match.time}</Chip>}
            {match.venue && <Chip icon={MapPin}>{match.venue}</Chip>}
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10 pb-16 space-y-6">

        {/* ════ MAÇ AKIŞI (zaman çizelgesi) ════ */}
        {match.isCompleted && (
          <Card title="Maç Akışı">
            <div className="relative">
              {/* dikey orta hat */}
              <div className="absolute left-1/2 -translate-x-1/2 top-0 bottom-0 w-px bg-[#e3efe8]" />
              <div className="space-y-3">
                {timeline.map((t, i) => {
                  if (t.kind === 'start') return <Milestone key={i} icon={Play} label="Maç Başladı" tone="green" />
                  if (t.kind === 'half') return <Milestone key={i} icon={Timer} label="İlk Yarı Sonucu" score={`${htHome} - ${htAway}`} tone="amber" />
                  if (t.kind === 'end') return <Milestone key={i} icon={Trophy} label="Maç Sonucu" score={`${match.homeScore} - ${match.awayScore}`} tone="green" />
                  const e = t.e
                  const isHome = e.team === 'home'
                  return (
                    <div key={i} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className={`flex items-center gap-2 ${isHome ? 'justify-end text-right' : 'opacity-0 pointer-events-none'}`}>
                        <span className="text-sm font-bold text-[#092d18]">{e.player}{e.detail ? <span className="text-[#7aab8e] font-normal"> · {e.detail}</span> : null}</span>
                        <EventIcon type={e.type} />
                      </div>
                      <span className="relative z-10 flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-[#0f4a28] text-[11px] font-black text-white tabular-nums shadow">
                        {e.minute != null ? `${e.minute}'` : '·'}
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
          </Card>
        )}

        {/* ════ İLK 11 (liste) ════ */}
        {hasLineups ? (
          <Card title="İlk 11">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <ElevenList team={match.homeTeam} logo={match.homeTeamLogo} players={lineups!.home.starters} coach={lineups!.home.coach} highlight={urfaIsHome} />
              <ElevenList team={match.awayTeam} logo={match.awayTeamLogo} players={lineups!.away.starters} coach={lineups!.away.coach} highlight={!urfaIsHome} />
            </div>
          </Card>
        ) : (
          <Card title="İlk 11">
            <div className="py-8 text-center">
              <p className="text-sm font-bold text-[#092d18]">Kadrolar henüz açıklanmadı</p>
              <p className="text-xs text-[#7aab8e] mt-1">İlk 11 ve yedekler maç günü açıklandığında burada görünecek.</p>
            </div>
          </Card>
        )}

        {/* ════ YEDEKLER ════ */}
        {hasLineups && (lineups!.home.subs.length > 0 || lineups!.away.subs.length > 0) && (
          <Card title="Yedekler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <ElevenList team={match.homeTeam} logo={match.homeTeamLogo} players={lineups!.home.subs} muted />
              <ElevenList team={match.awayTeam} logo={match.awayTeamLogo} players={lineups!.away.subs} muted />
            </div>
          </Card>
        )}

        {/* ════ HAKEMLER ════ */}
        {referees.length > 0 && (
          <Card title="Hakemler" icon={Flag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {referees.map((r) => (
                <div key={r.name + r.role} className="flex items-center justify-between bg-[#f5f9f6] rounded-xl px-4 py-3">
                  <span className="text-sm font-bold text-[#092d18]">{r.name}</span>
                  <span className="text-[11px] font-black text-[#1A6B3C] uppercase tracking-wide">{r.role}</span>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* ════ MAÇ BİLGİLERİ ════ */}
        <Card title="Maç Bilgileri">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info icon={Calendar} label="Tarih" value={match.date ? formatDate(match.date) : '—'} />
            <Info icon={Clock} label="Saat" value={match.time || '—'} />
            <Info icon={MapPin} label="Stadyum" value={match.venue || '—'} />
          </div>
        </Card>

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

/* ── Yardımcı bileşenler ──────────────────────────────────────── */
function Chip({ icon: Icon, children }: { icon: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 bg-white/[0.07] border border-white/10 rounded-full px-3.5 py-1.5 text-xs font-semibold text-white/70">
      <Icon size={13} className="text-[#FFD100]" />{children}
    </span>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
      <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-[#1A6B3C]" />}
        <span className="inline-block w-1 h-4 bg-[#FFD100] rounded-full" />{title}
      </h2>
      {children}
    </div>
  )
}

function Milestone({ icon: Icon, label, score, tone }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; score?: string; tone: 'green' | 'amber' }) {
  const bg = tone === 'amber' ? 'bg-[#FFD100] text-[#0f4a28]' : 'bg-[#0f4a28] text-white'
  return (
    <div className="relative flex justify-center py-1">
      <div className={`relative z-10 inline-flex items-center gap-2 ${bg} rounded-full pl-3 pr-4 py-2 shadow-md`}>
        <Icon size={14} />
        <span className="text-[11px] font-black tracking-wide uppercase">{label}</span>
        {score && <span className="text-sm font-black tabular-nums border-l border-current/20 pl-2 ml-0.5">{score}</span>}
      </div>
    </div>
  )
}

function ElevenList({ team, logo, players, coach, highlight, muted }: { team: string; logo: string; players: LineupPlayer[]; coach?: string | null; highlight?: boolean; muted?: boolean }) {
  return (
    <div>
      <div className="flex items-center gap-2.5 mb-3 pb-3 border-b border-[#edf7f2]">
        <div className="relative w-7 h-7 shrink-0"><Image src={logo} alt="" fill className="object-contain" /></div>
        <span className="text-sm font-black text-[#092d18]">{team}</span>
        {highlight && <span className="ml-auto text-[9px] font-black tracking-widest uppercase text-[#1A6B3C] bg-[#edf7f2] rounded-full px-2 py-0.5">Bizim Takım</span>}
      </div>
      <ul className="space-y-1">
        {players.map((p, i) => (
          <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#f5f9f6] transition-colors">
            <span className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-black tabular-nums shrink-0 ${
              muted ? 'bg-[#f5f9f6] text-[#7aab8e]' : 'bg-[#0f4a28] text-[#FFD100]'
            }`}>{p.number ?? '-'}</span>
            <span className="text-sm font-semibold text-[#092d18] truncate">{p.name}</span>
          </li>
        ))}
      </ul>
      {coach && <p className="mt-3 text-xs text-[#7aab8e]">Teknik Direktör: <span className="font-bold text-[#092d18]">{coach}</span></p>}
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
