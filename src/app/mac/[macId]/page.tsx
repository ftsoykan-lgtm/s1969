import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { getAllProfileSlugs } from '@/lib/supabase/player-profiles-server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Clock, Flag, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'
import type { LineupPlayer, MatchEvent } from '@/types'
import { canonicalCompetition } from '@/lib/tff'

/* İsim → profil slug'ı (oyuncu profilleriyle aynı kural) */
function slugifyName(s: string): string {
  return (s || '').toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

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
  if (type === 'goal') return <span className="text-[17px] leading-none">⚽</span>
  if (type === 'yellow') return <span className="inline-block w-3 rounded-[2px] bg-[#f5c400] shadow" style={{ height: 17 }} />
  if (type === 'red') return <span className="inline-block w-3 rounded-[2px] bg-[#d01b2a] shadow" style={{ height: 17 }} />
  return <span className="text-[#1b5e44]">↔</span>
}

export default async function MacDetayPage({ params }: Props) {
  const { macId } = await params
  const [{ matches: raw }, logoMap] = await Promise.all([getLiveTff(), getTeamLogoMap()])
  const matches = applyLogosToMatches(raw, logoMap)
  const match = matches.find((m) => m.macId === macId)
  if (!match) notFound()

  const urfaIsHome = match.homeTeam === 'Şanlıurfaspor'
  // Kadromuzdaki oyuncuların profil slug'ları (İlk 11'de tıklanabilir link için)
  const profileSlugs = new Set(await getAllProfileSlugs())
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
      <div className="relative bg-gradient-to-b from-[#0c3a23] to-[#154836] overflow-hidden">
        <div className="pointer-events-none absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[400px] rounded-full bg-[#1b5e44]/40 blur-[120px]" />
        <div className="pointer-events-none absolute top-0 right-8 font-heading text-[14rem] font-black leading-none text-white/[0.02] select-none">VS</div>

        <div className="relative mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-10">
          <Link href="/mac-merkezi"
            className="group inline-flex items-center gap-2 mb-8 rounded-full bg-white/[0.07] hover:bg-[#f5c400] border border-white/15 hover:border-[#f5c400] pl-2.5 pr-4 py-2 transition-all">
            <span className="flex h-6 w-6 items-center justify-center rounded-full bg-[#f5c400] text-[#103f2e] group-hover:bg-[#103f2e] group-hover:text-[#f5c400] transition-colors">
              <ArrowLeft size={14} />
            </span>
            <span className="text-[12px] font-black tracking-wide uppercase text-white group-hover:text-[#103f2e] transition-colors">Maç Merkezi</span>
          </Link>

          <div className="flex justify-center mb-7">
            <span className="inline-flex items-center gap-2 bg-[#f5c400] text-[#103f2e] text-[11px] font-black tracking-[0.15em] uppercase px-4 py-1.5"
              style={{ clipPath: 'polygon(8px 0, 100% 0, calc(100% - 8px) 100%, 0 100%)' }}>
              {canonicalCompetition(match.competition)}{match.roundLabel ? ` · ${match.roundLabel}` : ''}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-3 md:gap-8">
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-32 md:h-32 drop-shadow-2xl"><Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-xl font-black text-center ${urfaIsHome ? 'text-[#f5c400]' : 'text-white'}`}>{match.homeTeam}</span>
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
                  <span className="inline-block mt-2 text-[10px] font-black tracking-[0.2em] uppercase text-[#f5c400]/70">Maç Sonucu</span>
                </>
              ) : (
                <>
                  <div className="text-3xl md:text-5xl font-black text-[#f5c400]">{match.time || 'VS'}</div>
                  <span className="inline-block mt-2 text-[10px] font-black tracking-widest uppercase text-white/40">{match.date ? formatDate(match.date) : 'Yakında'}</span>
                </>
              )}
            </div>

            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20 md:w-32 md:h-32 drop-shadow-2xl"><Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" /></div>
              <span className={`text-sm md:text-xl font-black text-center ${!urfaIsHome ? 'text-[#f5c400]' : 'text-white'}`}>{match.awayTeam}</span>
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
                  if (t.kind === 'start') return <Milestone key={i} emoji="⚽" label="Maç Başladı" tone="green" />
                  if (t.kind === 'half') return <Milestone key={i} emoji="⏱️" label="İlk Yarı Sonucu" score={`${htHome} - ${htAway}`} tone="amber" />
                  if (t.kind === 'end') return <Milestone key={i} emoji="🏁" label="Maç Sonucu" score={`${match.homeScore} - ${match.awayScore}`} tone="green" />
                  const e = t.e
                  const isHome = e.team === 'home'
                  return (
                    <div key={i} className="relative grid grid-cols-[1fr_auto_1fr] items-center gap-3">
                      <div className={`flex items-center gap-2 ${isHome ? 'justify-end text-right' : 'opacity-0 pointer-events-none'}`}>
                        <span className="text-sm font-bold text-[#154836]">{e.player}{e.detail ? <span className="text-[#7aab8e] font-normal"> · {e.detail}</span> : null}</span>
                        <EventIcon type={e.type} />
                      </div>
                      <span className="relative z-10 flex h-8 min-w-8 px-2 items-center justify-center rounded-full bg-[#103f2e] text-[11px] font-black text-white tabular-nums shadow">
                        {e.minute != null ? `${e.minute}'` : '·'}
                      </span>
                      <div className={`flex items-center gap-2 ${!isHome ? 'justify-start text-left' : 'opacity-0 pointer-events-none'}`}>
                        <EventIcon type={e.type} />
                        <span className="text-sm font-bold text-[#154836]">{e.player}{e.detail ? <span className="text-[#7aab8e] font-normal"> · {e.detail}</span> : null}</span>
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
              <ElevenList team={match.homeTeam} logo={match.homeTeamLogo} players={lineups!.home.starters} coach={lineups!.home.coach} variant={urfaIsHome ? 'sfk' : 'opp'} profileSlugs={profileSlugs} />
              <ElevenList team={match.awayTeam} logo={match.awayTeamLogo} players={lineups!.away.starters} coach={lineups!.away.coach} variant={urfaIsHome ? 'opp' : 'sfk'} profileSlugs={profileSlugs} />
            </div>
          </Card>
        ) : (
          <Card title="İlk 11">
            <div className="py-8 text-center">
              <p className="text-sm font-bold text-[#154836]">Kadrolar henüz açıklanmadı</p>
              <p className="text-xs text-[#7aab8e] mt-1">İlk 11 ve yedekler maç günü açıklandığında burada görünecek.</p>
            </div>
          </Card>
        )}

        {/* ════ YEDEKLER ════ */}
        {hasLineups && (lineups!.home.subs.length > 0 || lineups!.away.subs.length > 0) && (
          <Card title="Yedekler">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-10 gap-y-6">
              <ElevenList team={match.homeTeam} logo={match.homeTeamLogo} players={lineups!.home.subs} variant={urfaIsHome ? 'sfk' : 'opp'} muted profileSlugs={profileSlugs} />
              <ElevenList team={match.awayTeam} logo={match.awayTeamLogo} players={lineups!.away.subs} variant={urfaIsHome ? 'opp' : 'sfk'} muted profileSlugs={profileSlugs} />
            </div>
          </Card>
        )}

        {/* ════ HAKEMLER ════ */}
        {referees.length > 0 && (
          <Card title="Hakemler" icon={Flag}>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {referees.map((r, i) => {
                const main = i === 0
                return (
                  <div key={r.name + r.role}
                    className={`flex items-center gap-3 rounded-xl px-4 py-3.5 border ${main ? 'bg-gradient-to-br from-[#103f2e] to-[#0c3a20] border-transparent' : 'bg-[#f8faf9] border-[#edf7f2]'}`}>
                    <span className={`flex h-9 w-9 items-center justify-center rounded-lg shrink-0 ${main ? 'bg-[#f5c400] text-[#103f2e]' : 'bg-[#edf7f2] text-[#1b5e44]'}`}>
                      <Flag size={15} />
                    </span>
                    <div className="min-w-0">
                      <p className={`text-sm font-black truncate ${main ? 'text-white' : 'text-[#154836]'}`}>{r.name}</p>
                      <p className={`text-[10px] font-bold tracking-wide uppercase ${main ? 'text-[#f5c400]/80' : 'text-[#7aab8e]'}`}>{r.role}</p>
                    </div>
                  </div>
                )
              })}
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
            className="flex items-center justify-center gap-2 bg-white border border-[#ddeae2] hover:border-[#1b5e44]/40 text-[#154836] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all">
            TFF'de Resmi Maç Sayfası
            <ExternalLink size={15} className="text-[#1b5e44]" />
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
      <Icon size={13} className="text-[#f5c400]" />{children}
    </span>
  )
}

function Card({ title, icon: Icon, children }: { title: string; icon?: React.ComponentType<{ size?: number; className?: string }>; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
      <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-5 flex items-center gap-2">
        {Icon && <Icon size={14} className="text-[#1b5e44]" />}
        <span className="inline-block w-1 h-4 bg-[#f5c400] rounded-full" />{title}
      </h2>
      {children}
    </div>
  )
}

function Milestone({ emoji, anim, label, score, tone }: { emoji: string; anim?: string; label: string; score?: string; tone: 'green' | 'amber' }) {
  const bg = tone === 'amber' ? 'bg-[#f5c400] text-[#103f2e]' : 'bg-[#103f2e] text-white'
  return (
    <div className="relative flex justify-center py-1">
      <div className={`relative z-10 inline-flex items-center gap-2 ${bg} rounded-full pl-3 pr-4 py-2 shadow-md`}>
        <span className={`text-sm leading-none ${anim ?? ''}`}>{emoji}</span>
        <span className="text-[11px] font-black tracking-wide uppercase">{label}</span>
        {score && <span className="text-sm font-black tabular-nums border-l border-current/20 pl-2 ml-0.5">{score}</span>}
      </div>
    </div>
  )
}

function ElevenList({ team, logo, players, coach, variant = 'opp', muted = false, profileSlugs }: { team: string; logo: string; players: LineupPlayer[]; coach?: string | null; variant?: 'sfk' | 'opp'; muted?: boolean; profileSlugs?: Set<string> }) {
  const isSfk = variant === 'sfk'
  const badge = muted
    ? (isSfk ? 'bg-[#e3f1e9] text-[#1b5e44]' : 'bg-[#eef1f4] text-[#475569]')
    : (isSfk ? 'bg-gradient-to-br from-[#1b5e44] to-[#103f2e] text-[#f5c400]' : 'bg-gradient-to-br from-[#475569] to-[#334155] text-white')
  const stripe = isSfk ? 'bg-[#f5c400]' : 'bg-[#475569]'
  return (
    <div className="relative rounded-xl border border-[#edf7f2] overflow-hidden">
      <span className={`absolute left-0 top-0 bottom-0 w-1 ${stripe}`} />
      <div className="flex items-center gap-2.5 px-4 py-3 bg-[#f8faf9] border-b border-[#edf7f2]">
        <div className="relative w-7 h-7 shrink-0"><Image src={logo} alt="" fill className="object-contain" /></div>
        <span className="text-sm font-black text-[#154836]">{team}</span>
        {isSfk && !muted && <span className="ml-auto text-[9px] font-black tracking-widest uppercase text-[#1b5e44] bg-[#e3f1e9] rounded-full px-2 py-0.5">Bizim Takım</span>}
      </div>
      <ul className="p-2 space-y-0.5">
        {players.map((p, i) => {
          const slug = slugifyName(p.name)
          // Sadece bizim takımda ve profili bulunan oyuncular tıklanabilir
          const linkable = isSfk && profileSlugs?.has(slug)
          const inner = (
            <>
              <span className={`flex h-7 w-7 items-center justify-center rounded-md text-[11px] font-black tabular-nums shrink-0 shadow-sm ${badge}`}>{p.number ?? '-'}</span>
              <span className={`text-sm font-semibold truncate ${linkable ? 'text-[#103f2e] group-hover/pl:text-[#1b5e44] group-hover/pl:underline' : 'text-[#154836]'}`}>{p.name}</span>
            </>
          )
          return linkable ? (
            <li key={i}>
              <Link href={`/oyuncu/${slug}`} className="group/pl flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#edf7f2] transition-colors">{inner}</Link>
            </li>
          ) : (
            <li key={i} className="flex items-center gap-3 rounded-lg px-2 py-1.5 hover:bg-[#f5f9f6] transition-colors">{inner}</li>
          )
        })}
      </ul>
      {coach && <p className="px-4 pb-3 text-xs text-[#7aab8e]">Teknik Direktör: <span className="font-bold text-[#154836]">{coach}</span></p>}
    </div>
  )
}

function Info({ icon: Icon, label, value }: { icon: React.ComponentType<{ size?: number; className?: string }>; label: string; value: string }) {
  return (
    <div className="flex items-center gap-3.5 bg-gradient-to-br from-[#f8faf9] to-[#eef5f0] rounded-xl px-4 py-4 border border-[#edf7f2]">
      <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-[#1b5e44] to-[#103f2e] text-[#f5c400] shrink-0 shadow-md">
        <Icon size={18} />
      </div>
      <div className="min-w-0">
        <p className="text-[10px] font-black tracking-widest uppercase text-[#7aab8e]">{label}</p>
        <p className="text-sm font-bold text-[#154836] truncate">{value}</p>
      </div>
    </div>
  )
}
