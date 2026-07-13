import Image from 'next/image'
import Link from 'next/link'
import { CalendarClock, MapPin } from 'lucide-react'
import type { Match } from '@/types'
import { matchHref } from '@/lib/tff'

/* Tarih henüz açıklanmadığında (sezon başı TFF fikstür sırasını yayınlar,
   tarihleri sonra ekler) takvim yerine gösterilen premium hafta-hafta liste.
   Fikstür sırası zaten kronolojiktir; tarih gelince takvim otomatik devreye girer. */

function fmt(dateISO: string, time?: string): string | null {
  if (!dateISO) return null
  const [y, m, d] = dateISO.split('-')
  const g = d && m && y ? `${d}.${m}.${y}` : dateISO
  return time && /^\d{1,2}:\d{2}$/.test(time) ? `${g} · ${time}` : g
}

export default function FixtureWeekList({ matches }: { matches: Match[] }) {
  if (!matches.length) {
    return (
      <div className="panel-premium p-10 text-center text-sm font-bold text-[#7aab8e]">
        Fikstür bulunmuyor.
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="flex items-start gap-2.5 rounded-2xl bg-ugold/10 border border-ugold/30 px-4 py-3">
        <CalendarClock size={16} className="text-ugoldd shrink-0 mt-0.5" />
        <p className="text-[12px] font-semibold text-ugreenm leading-relaxed">
          TFF fikstür sırasını yayınladı; <b>maç tarih ve saatleri henüz açıklanmadı.</b>{' '}
          Tarihler açıklandıkça takvim otomatik dolacak — aşağıda tüm sezon fikstürü hafta sırasıyla.
        </p>
      </div>

      <div className="panel-premium overflow-hidden divide-y divide-[#edf7f2]">
        {matches.map((m) => {
          const urfaHome = m.homeTeam === 'Şanlıurfaspor'
          const played = m.isCompleted && m.homeScore !== null && m.awayScore !== null
          const dateStr = fmt(m.date, m.time)
          const row = (
            <div className="grid grid-cols-[46px_1fr_auto] items-center gap-3 px-3 sm:px-4 py-3 hover:bg-[#f5f9f6] transition-colors">
              {/* Hafta rozeti */}
              <div className="flex flex-col items-center justify-center rounded-xl bg-ugreen text-white h-11 w-11 shrink-0">
                <span className="text-[8px] font-bold uppercase tracking-wide text-ugold/90 leading-none">
                  {m.roundLabel && /play|kupa/i.test(m.roundLabel) ? 'TUR' : 'HAF'}
                </span>
                <span className="text-[15px] font-extrabold leading-none mt-0.5 tabular-nums">{m.week ?? '–'}</span>
              </div>

              {/* Takımlar */}
              <div className="flex items-center gap-2 min-w-0">
                <TeamMini name={m.homeTeam} logo={m.homeTeamLogo} highlight={urfaHome} align="start" />
                <div className="shrink-0 px-1">
                  {played ? (
                    <span className="text-[13px] font-extrabold text-ugreenm tabular-nums">{m.homeScore}-{m.awayScore}</span>
                  ) : (
                    <span className="text-[11px] font-extrabold text-[#7aab8e]">VS</span>
                  )}
                </div>
                <TeamMini name={m.awayTeam} logo={m.awayTeamLogo} highlight={!urfaHome} align="end" />
              </div>

              {/* Tarih / yer */}
              <div className="text-right shrink-0 min-w-0">
                <p className={`text-[11px] font-bold tabular-nums ${dateStr ? 'text-ugreenm' : 'text-ugoldd'}`}>
                  {dateStr ?? 'Tarih yakında'}
                </p>
                {m.venue && (
                  <p className="hidden sm:flex items-center justify-end gap-1 text-[10px] text-[#7aab8e] mt-0.5 truncate">
                    <MapPin size={9} className="shrink-0" />{m.venue}
                  </p>
                )}
              </div>
            </div>
          )
          return m.macId
            ? <Link key={m.id} href={matchHref(m)} className="block">{row}</Link>
            : <div key={m.id}>{row}</div>
        })}
      </div>
    </div>
  )
}

function TeamMini({ name, logo, highlight, align }: { name: string; logo: string; highlight: boolean; align: 'start' | 'end' }) {
  return (
    <div className={`flex items-center gap-1.5 min-w-0 flex-1 ${align === 'end' ? 'flex-row-reverse text-right' : ''}`}>
      <div className="relative w-6 h-6 shrink-0">
        <Image src={logo} alt={name} fill unoptimized sizes="24px" className="object-contain" />
      </div>
      <span className={`text-[12px] font-bold truncate ${highlight ? 'text-ugreen' : 'text-ugreenm'}`}>{name}</span>
    </div>
  )
}
