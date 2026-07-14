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
  detail?: {
    referees?: { name: string; role: string }[]
    lineups?: import('@/types').MatchLineups | null
    events?: import('@/types').MatchEvent[]
  }
  homeTeam: string
  awayTeam: string
  homeTeamLogo?: string | null
  awayTeamLogo?: string | null
  homeScore: number | null
  awayScore: number | null
  date: string | null
  dateText: string
  competition: string
  isHome: boolean
  opponent: string
  result: 'G' | 'M' | 'B' | null   // oynanmamış maçta (skor yok) null
}

export type TffSquadPlayer = {
  name: string
  tffId: string | null
  number?: number | null
  position?: string | null
  photo?: string | null
  birthPlace?: string | null
  birthDate?: string | null
  nationality?: string | null
  flagCode?: string | null
  licenseNo?: string | null
  club?: string | null
}
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

/** Turnuva adını kanonik (logo paylaşımı için) tek isme indirger.
 *  "Nesine 2. Lig Beyaz", "Nesine 2. Lig Play Off..." → "Nesine 2. Lig" */
export function canonicalCompetition(name: string): string {
  const n = (name || '').toLocaleLowerCase('tr-TR')
  if (/t[üu]rkiye kupas|ziraat/.test(n)) return 'Ziraat Türkiye Kupası'
  if (/2\.?\s*l[iı]g/.test(n)) return 'Nesine 2. Lig'
  if (/1\.?\s*l[iı]g/.test(n)) return 'Nesine 1. Lig'
  if (/s[üu]per\s*l[iı]g/.test(n)) return 'Süper Lig'
  return name
}

/** Kayıtlı logo haritasından turnuva logosunu çözer (tam → kanonik → bulanık) */
export function competitionLogo(map: Record<string, string>, competition: string): string | undefined {
  if (map[competition]) return map[competition]
  const canon = canonicalCompetition(competition)
  if (map[canon]) return map[canon]
  for (const [k, v] of Object.entries(map)) if (v && canonicalCompetition(k) === canon) return v
  return undefined
}

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
  // Büyük harf ham adı başlık-biçimine çevir (her kelimenin ilk HARFİ büyük;
  // rakamla başlayan kelimede de ilk harf büyür → "24Erzincanspor")
  s = s
    .toLocaleLowerCase('tr-TR')
    .split(' ')
    .map((w) => w.replace(/[a-zçğıöşü]/, (c) => c.toLocaleUpperCase('tr-TR')))
    .join(' ')
    .trim()
  // Sadece iki kural — gerisi orijinal kalır:
  // 1) "... Futbol Kulübü" / "... Futbol A.Ş." → "... FK"
  s = s.replace(/\s+Futbol\s+(kul[üu]b[üu]|a\.?\s?ş\.?)$/i, ' FK').trim()
  // 2) Sonu "A.Ş." ile bitenlerde A.Ş.'yi kaldır
  s = s.replace(/\s+a\.?\s?ş\.?$/i, '').trim()
  return s
}

/* ─── Ham veriden site tiplerine dönüştürücüler ────────────── */

/** Takım adını eşleştirme için normalize eder (büyük/küçük, sponsor öneki, noktalama bağımsız) */
export function normTeam(s: string): string {
  return temizTakimAdi(s || '')
    .toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g').replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '')
}

/** autoLogos haritasından normalize eşleşmeyle logo çözer (isim farklılıklarına dayanıklı) */
function makeLogoResolver(autoLogos: Record<string, string>) {
  const norm: Record<string, string> = {}
  for (const [k, v] of Object.entries(autoLogos)) { if (v) norm[normTeam(k)] = v }
  return (team: string, isSfk: boolean): string => {
    if (autoLogos[team]) return autoLogos[team]          // tam eşleşme
    const n = norm[normTeam(team)]                        // normalize eşleşme
    if (n) return n
    return isSfk ? SANLIURFA_LOGO : DEFAULT_LOGO
  }
}

export function buildStandings(raw: TffRaw): StandingRow[] {
  const autoLogos = raw.logos ?? {}
  const logoFor = makeLogoResolver(autoLogos)
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
  const logoFor = makeLogoResolver(autoLogos)
  const matches: Match[] = (raw.sanliurfasporFixtures ?? []).map((f, i) => {
    const homeIsSfk = f.homeTeam.toUpperCase().includes('URFASPOR')
    return {
      id: `tff-${i + 1}`,
      homeTeam: temizTakimAdi(f.homeTeam),
      awayTeam: temizTakimAdi(f.awayTeam),
      // Maça gömülü logo (detay sayfasından, grup dışı rakipler dahil) > normalize eşleşme
      homeTeamLogo: f.homeTeamLogo || logoFor(f.homeTeam, homeIsSfk),
      awayTeamLogo: f.awayTeamLogo || logoFor(f.awayTeam, !homeIsSfk),
      homeScore: f.homeScore,
      awayScore: f.awayScore,
      date: f.date ?? '',
      time: f.time ?? '',
      competition: f.competition,
      venue: f.venue || '',
      isCompleted: f.homeScore !== null && f.awayScore !== null,
      isHome: f.isHome,
      week: f.week,
      macId: f.macId ?? null,
      referees: f.detail?.referees ?? [],
      lineups: f.detail?.lineups ?? null,
      events: f.detail?.events ?? [],
    }
  })
  // Tur etiketleri: play-off maçlarını tarihe göre sırala ve "1. Tur, 2. Tur..." numarala
  const isPlayoff = (c: string) => /play\s*-?\s*off/i.test(c || '')
  const isCup = (c: string) => /kupa|t[üu]rkiye kupas|ziraat/i.test(c || '')
  const poSorted = matches.filter((m) => isPlayoff(m.competition))
    .slice().sort((a, b) => (a.date || '').localeCompare(b.date || ''))
  const poIndex = new Map(poSorted.map((m, i) => [m.id, i + 1]))
  for (const m of matches) {
    if (m.week) m.roundLabel = `${m.week}. Hafta`
    else if (isPlayoff(m.competition)) m.roundLabel = `Play-Off ${poIndex.get(m.id)}. Tur`
    else if (isCup(m.competition)) m.roundLabel = 'Türkiye Kupası'
    else m.roundLabel = m.competition
  }
  return matches
}

export function buildMeta(raw: TffRaw) {
  return { updatedAt: raw.updatedAt, league: raw.league, season: raw.season }
}

/** Oynanmamış maçlar, en yakından uzağa.
 *  Tarihli olanlar tarihe göre; tarihsizler (sezon başı TFF tarih vermeden fikstür
 *  yayınlar) fikstür/hafta sırasında sona eklenir. Böylece tarih olmadan da çalışır. */
export function upcomingMatches(matches: Match[]): Match[] {
  const notPlayed = matches.filter((m) => !m.isCompleted)
  const dated = notPlayed.filter((m) => m.date).sort((a, b) => a.date.localeCompare(b.date))
  const undated = notPlayed.filter((m) => !m.date) // scrape sırası = hafta sırası (korunur)
  return [...dated, ...undated]
}

/** Sıradaki (en yakın oynanmamış) maç; hiç yoksa null. Tarih gerektirmez. */
export function nextMatch(matches: Match[]): Match | null {
  return upcomingMatches(matches)[0] ?? null
}

/** Oynanmış maçlar, en yeni sonda (fikstür sırası). */
export function playedMatches(matches: Match[]): Match[] {
  return matches.filter((m) => m.isCompleted)
}

/* ─── Premium maç URL'leri (SEO + temiz) ──────────────────────────────
   Slug:  <ev>-vs-<deplasman>-<YYYY-MM-DD>   (macId YOK — takım+tarih benzersiz)
   Çözümleme slug ile yapılır (findMatchBySlug). Eski ID'li URL'ler (sondaki
   sayı macId) geriye dönük çözülür ve kanonik yeni URL'e kalıcı yönlendirilir. */
type SluggableMatch = { homeTeam: string; awayTeam: string; date?: string | null; macId?: string | null }

export function urlSlugPart(s: string): string {
  return (s || '').toLocaleLowerCase('tr-TR')
    .replace(/ı/g, 'i').replace(/İ/g, 'i').replace(/ş/g, 's').replace(/ğ/g, 'g')
    .replace(/ü/g, 'u').replace(/ö/g, 'o').replace(/ç/g, 'c')
    .replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '')
}

/** Bir maçın kanonik slug'ı. macId varsa çakışmasız ve kalıcıdır. */
export function matchSlug(m: SluggableMatch): string {
  const parts = [urlSlugPart(m.homeTeam), 'vs', urlSlugPart(m.awayTeam)]
  if (m.date) parts.push(m.date)                 // YYYY-MM-DD — takım + tarih benzersiz
  return parts.filter(Boolean).join('-')
}

/** Maç detay linki (premium URL). */
export function matchHref(m: SluggableMatch): string {
  return `/mac/${matchSlug(m)}`
}

/** URL parametresinden macId çıkar: slug'ın sonundaki sayı ya da (eski URL) tamamı sayı. */
export function macIdFromParam(param: string): string | null {
  const p = decodeURIComponent(param || '').replace(/\/+$/, '')
  const m = p.match(/(\d+)$/)
  return m ? m[1] : (p || null)
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
