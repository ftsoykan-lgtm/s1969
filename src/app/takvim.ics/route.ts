import { getLiveTff } from '@/lib/supabase/tff-server'

export const dynamic = 'force-dynamic'

const pad = (n: number) => String(n).padStart(2, '0')
const esc = (s: string) => (s || '').replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\r?\n/g, '\\n')

export async function GET() {
  const { matches } = await getLiveTff()
  const now = new Date()
  const dtstamp = `${now.getUTCFullYear()}${pad(now.getUTCMonth() + 1)}${pad(now.getUTCDate())}T${pad(now.getUTCHours())}${pad(now.getUTCMinutes())}${pad(now.getUTCSeconds())}Z`

  const L: string[] = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Sanliurfaspor//Fikstur//TR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'X-WR-CALNAME:Şanlıurfaspor Fikstür',
    'NAME:Şanlıurfaspor Fikstür',
    'X-WR-TIMEZONE:Europe/Istanbul',
    'REFRESH-INTERVAL;VALUE=DURATION:PT12H',
    'X-PUBLISHED-TTL:PT12H',
    // Türkiye sabit UTC+3 (2016'dan beri DST yok)
    'BEGIN:VTIMEZONE',
    'TZID:Europe/Istanbul',
    'BEGIN:STANDARD',
    'DTSTART:19700101T000000',
    'TZOFFSETFROM:+0300',
    'TZOFFSETTO:+0300',
    'TZNAME:+03',
    'END:STANDARD',
    'END:VTIMEZONE',
  ]

  for (const m of matches) {
    if (!m.date) continue
    const [y, mo, d] = m.date.split('-')
    if (!y || !mo || !d) continue
    const uid = `mac-${m.macId ?? m.id}@sanliurfaspor`
    const summary = `${m.homeTeam} - ${m.awayTeam}`
    const round = m.roundLabel ?? (m.week ? `${m.week}. Hafta` : m.competition)
    const score = m.isCompleted && m.homeScore != null ? ` (${m.homeScore}-${m.awayScore})` : ''
    const desc = `${round}${score}`

    L.push('BEGIN:VEVENT', `UID:${uid}`, `DTSTAMP:${dtstamp}`)
    if (m.time && /^\d{1,2}:\d{2}/.test(m.time)) {
      const [hh, mm] = m.time.split(':').map(Number)
      const start = `${y}${mo}${d}T${pad(hh)}${pad(mm)}00`
      // 2 saatlik süre (gün taşmasını Date ile doğru hesapla)
      const endDate = new Date(Date.UTC(+y, +mo - 1, +d, hh + 2, mm))
      const end = `${endDate.getUTCFullYear()}${pad(endDate.getUTCMonth() + 1)}${pad(endDate.getUTCDate())}T${pad(endDate.getUTCHours())}${pad(endDate.getUTCMinutes())}00`
      L.push(`DTSTART;TZID=Europe/Istanbul:${start}`, `DTEND;TZID=Europe/Istanbul:${end}`)
    } else {
      L.push(`DTSTART;VALUE=DATE:${y}${mo}${d}`)
    }
    L.push(`SUMMARY:${esc(summary)}`)
    if (m.venue) L.push(`LOCATION:${esc(m.venue)}`)
    L.push(`DESCRIPTION:${esc(desc)}`, 'STATUS:CONFIRMED', 'END:VEVENT')
  }

  L.push('END:VCALENDAR')
  const body = L.join('\r\n')

  return new Response(body, {
    headers: {
      'Content-Type': 'text/calendar; charset=utf-8',
      'Content-Disposition': 'inline; filename="sanliurfaspor-fikstur.ics"',
      'Cache-Control': 'public, max-age=1800',
    },
  })
}
