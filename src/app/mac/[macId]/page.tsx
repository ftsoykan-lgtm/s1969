import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { getLiveTff } from '@/lib/supabase/tff-server'
import { getTeamLogoMap, applyLogosToMatches } from '@/lib/supabase/logos-server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, MapPin, Calendar, Clock, Flag, ExternalLink } from 'lucide-react'
import type { Metadata } from 'next'

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

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Skor başlığı */}
      <div className="bg-[#0f4a28] py-12">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <Link href="/fikstur" className="inline-flex items-center gap-2 text-sm text-white/60 hover:text-white transition-colors mb-8">
            <ArrowLeft size={16} /> Maç Merkezine Dön
          </Link>

          <div className="flex items-center justify-between gap-3 mb-6">
            <span className="text-[11px] font-black tracking-widest uppercase text-[#FFD100]/70">
              {match.competition}{match.week ? ` · ${match.week}. Hafta` : ''}
            </span>
          </div>

          <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4">
            {/* Ev sahibi */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20">
                <Image src={match.homeTeamLogo} alt={match.homeTeam} fill className="object-contain" />
              </div>
              <span className={`text-sm font-black text-center ${urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.homeTeam}</span>
            </div>

            {/* Skor */}
            <div className="text-center px-2">
              {match.isCompleted ? (
                <div className="text-4xl md:text-5xl font-black text-white tabular-nums whitespace-nowrap">
                  {match.homeScore}<span className="text-white/30 mx-2">-</span>{match.awayScore}
                </div>
              ) : (
                <div className="text-2xl font-black text-[#FFD100]">{match.time || 'vs'}</div>
              )}
            </div>

            {/* Deplasman */}
            <div className="flex flex-col items-center gap-3">
              <div className="relative w-20 h-20">
                <Image src={match.awayTeamLogo} alt={match.awayTeam} fill className="object-contain" />
              </div>
              <span className={`text-sm font-black text-center ${!urfaIsHome ? 'text-[#FFD100]' : 'text-white'}`}>{match.awayTeam}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-10 pb-16 space-y-6">
        {/* Maç bilgileri */}
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6">
          <h2 className="text-xs font-black tracking-widest uppercase text-[#7aab8e] mb-4">Maç Bilgileri</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <Info icon={Calendar} label="Tarih" value={match.date ? formatDate(match.date) : '—'} />
            <Info icon={Clock} label="Saat" value={match.time || '—'} />
            <Info icon={MapPin} label="Stadyum" value={match.venue || '—'} />
          </div>
        </div>

        {/* Hakemler */}
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

        {/* TFF resmi link */}
        {match.macId && (
          <a href={`https://www.tff.org/Default.aspx?pageID=29&macID=${match.macId}`}
            target="_blank" rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 bg-white border border-[#ddeae2] hover:border-[#1A6B3C]/40 text-[#092d18] font-bold text-sm px-6 py-3.5 rounded-2xl transition-all">
            TFF'de Tüm Detaylar (kadrolar, goller)
            <ExternalLink size={15} className="text-[#1A6B3C]" />
          </a>
        )}
      </div>
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
