export interface NewsItem {
  id: string
  title: string
  excerpt: string
  content: string
  category: 'haber' | 'transfer' | 'basin-bildirisi' | 'antrenman' | 'mac-raporu'
  imageUrl: string
  date: string
  slug: string
  featured: boolean
}

export interface Player {
  id: string
  name: string
  position: 'Kaleci' | 'Defans' | 'Orta Saha' | 'Forvet'
  number: number
  nationality: string
  flagCode: string
  birthDate: string
  imageUrl: string
  slug: string
  stats: {
    matches: number
    goals: number
    assists: number
    yellowCards: number
    redCards: number
  }
}

export interface Match {
  id: string
  homeTeam: string
  awayTeam: string
  homeTeamLogo: string
  awayTeamLogo: string
  homeScore: number | null
  awayScore: number | null
  date: string
  time: string
  competition: string
  venue: string
  isCompleted: boolean
  isHome: boolean
  week?: number | null
  macId?: string | null
  referees?: { name: string; role: string }[]
  lineups?: MatchLineups | null
  events?: MatchEvent[]
}

export interface LineupPlayer {
  number?: number | null
  name: string
}

export interface MatchEvent {
  minute?: number | null
  type: 'goal' | 'yellow' | 'red' | 'sub'
  team: 'home' | 'away'
  player: string
  detail?: string
}

export interface MatchLineups {
  home: { starters: LineupPlayer[]; subs: LineupPlayer[]; coach?: string | null }
  away: { starters: LineupPlayer[]; subs: LineupPlayer[]; coach?: string | null }
}

export interface StandingRow {
  rank: number
  team: string
  teamLogo: string
  played: number
  won: number
  drawn: number
  lost: number
  goalsFor: number
  goalsAgainst: number
  points: number
  isCurrentTeam?: boolean
}

export interface Sponsor {
  id: string
  name: string
  logoUrl: string
  website: string
  tier: 'ana' | 'resmi' | 'destekci'
}

export type CategoryLabel = {
  [K in NewsItem['category']]: string
}
