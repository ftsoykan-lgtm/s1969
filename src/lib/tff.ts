import { Match, StandingRow } from '@/types'
import tffLive from '@/data/tff-live.json'

/**
 * TFF ham verisini (scripts/tff-cek.mjs çıktısı) sitenin Match[] / StandingRow[]
 * tiplerine çevirir. Ham veri iki kaynaktan gelebilir:
 *   - Supabase tff_data tablosu (canlı, GitHub Actions günceller)
 *   - src/data/tff-live.json (yedek / build-time)
 */

export type TffStanding = {
  rank: number
  team: string
  isSanliurfaspor: boolean
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  goalDiff: number
  points: number
  logo?: string | null
}

export type TffFixture = {
  week: number | null
  time?: string
  venue?: string
  macId?: string | null
  detail?: { referees?: { name: string; role: string }[] }
  homeTeam: string
  awayTeam: string
  homeScore: number | null
  awayScore: number | null
  date: string | null
  dateText: string
  competition: string
  isHome: boolean
  opponent: string
  result: 'G' | 'M' | 'B'
}

export type TffSquadPlayer = { name: string; tffId: string | null }
export type TffSquad = { season: string | null; players: TffSquadPlayer[] }

export type TffRaw = {
  updatedAt: string
  league: string
  season: string
  standings: TffStanding[]
  logos?: Record<string, string>
  sanliurfasporFixtures: TffFixture[]
  squad?: TffSquad
}

const SANLIURFA_LOGO = 'https://placehold.co/48x48/1A6B3C/FFD100?text=%C5%9EFK'
const DEFAULT_LOGO = 'https://placehold.co/48x48/edf7f2/1A6B3C?text=FK'

/** "KIZILKAYA TARIM ŞANLIURFASPOR" → "Şanlıurfaspor" gibi okunur isim */
export function temizTakimAdi(raw: string): string {
  if (raw.toUpperCase().includes('URFASPOR')) return 'Şanlıurfaspor'
  const sponsorOnekleri = [
    'NESINE', 'ZIRAAT', 'SEZA ÇİMENTO', 'KIZILKAYA TARIM', 'GMG', 'ANAGOLD',
    'SULTAN SU', 'MERKÜR JET', 'AKEDAŞ', 'ISBAŞ', 'KCT', 'GRANNY\'S WAFFLES',
    'TURKISH OIL', 'ARKENT', 'SİNCAN BELEDİYESİ', 'MKE',
  ]
  let s = raw
  for (const onek of sponsorOnekleri) {
    if (s.toUpperCase().startsWith(onek)) { s = s.slice(onek.length).trim(); break }
  }
  return s
    .toLocaleLowerCase('tr-TR')
    .split(' ')
    .map((w) => (w ? w.charAt(0).toLocaleUpperCase('tr-TR') + w.slice(1) : w))
    .join(' ')
    .trim()
}

/* ─── Ham veriden site tiplerine dönüştürücüler ────────────── */

export function buildStandings(raw: TffRaw): StandingRow[] {
  const autoLogos = raw.logos ?? {}
  const logoFor = (team: string, isSfk: boolean) =>
    autoLogos[team] || (isSfk ? SANLIURFA_LOGO : DEFAULT_LOGO)
  return (raw.standings ?? []).map((s) => ({
    rank: s.rank,
    team: temizTakimAdi(s.team),
    teamLogo: s.logo || logoFor(s.team, s.isSanliurfaspor),
    played: s.played,
    won: s.won,
    drawn: s.drawn,
    lost: s.lost,
    goalsFor: s.goalsFor,
    goalsAgainst: s.goalsAgainst,
    points: s.points,
    isCurrentTeam: s.isSanliurfaspor,
  }))
}

export function buildMatches(raw: TffRaw): Match[] {
  const autoLogos = raw.logos ?? {}
  const logoFor = (team: string, isSfk: boolean) =>
    autoLogos[team] || (isSfk ? SANLIURFA_LOGO : DEFAULT_LOGO)
  return (raw.sanliurfasporFixtures ?? []).map((f, i) => {
    const homeIsSfk = f.homeTeam.toUpperCase().includes('URFASPOR')
    return {
      id: `tff-${i + 1}`,
      homeTeam: temizTakimAdi(f.homeTeam),
      awayTeam: temizTakimAdi(f.awayTeam),
      homeTeamLogo: logoFor(f.homeTeam, homeIsSfk),
      awayTeamLogo: logoFor(f.awayTeam, !homeIsSfk),
      homeScore: f.homeScore,
      awayScore: f.awayScore,
      date: f.date ?? '',
      time: f.time ?? '',
      competition: f.competition,
      venue: f.venue || (f.isHome ? 'Ev Sahibi' : 'Deplasman'),
      isCompleted: f.homeScore !== null && f.awayScore !== null,
      isHome: f.isHome,
      week: f.week,
      macId: f.macId ?? null,
      referees: f.detail?.referees ?? [],
    }
  })
}

export function buildMeta(raw: TffRaw) {
  return { updatedAt: raw.updatedAt, league: raw.league, season: raw.season }
}

export function buildSquad(raw: TffRaw): TffSquad {
  return raw.squad ?? { season: null, players: [] }
}

/* ─── Statik (yedek) veri — build-time JSON'dan ────────────── */
export const staticRaw = tffLive as TffRaw
export const tffStandings: StandingRow[] = buildStandings(staticRaw)
export const tffMatches: Match[] = buildMatches(staticRaw)
export const tffMeta = buildMeta(staticRaw)
export const sanliurfasporRow = tffStandings.find((r) => r.isCurrentTeam) ?? null
