/* Puan durumu için saf yardımcılar (çalışma zamanı importu yok — node --test ile koşar).
   Bölge kuralı TEK YERDE: ana sayfa tablosu ve Puan Durumu sayfası buradan okur. */

export type Zone = 'champion' | 'playoff' | 'relegation'
export type FormResult = 'G' | 'B' | 'M'

const PLAYOFF_LAST_RANK = 5
const RELEGATION_COUNT = 3
const FORM_LENGTH = 5

/** TFF 2. Lig grup bölgeleri: 1. şampiyon · 2–5. play-off · son 3 küme düşme */
export function zoneOf(rank: number, total: number): Zone | null {
  if (rank === 1) return 'champion'
  if (rank >= 2 && rank <= PLAYOFF_LAST_RANK) return 'playoff'
  if (total > 0 && rank > total - RELEGATION_COUNT) return 'relegation'
  return null
}

type ScoredMatch = { isHome: boolean; homeScore: number | null; awayScore: number | null; isCompleted: boolean }

/** Bizim açımızdan sonuç (G/B/M); oynanmamışsa null. */
export function resultOf(m: ScoredMatch): FormResult | null {
  if (!m.isCompleted || m.homeScore == null || m.awayScore == null) return null
  const [us, them] = m.isHome ? [m.homeScore, m.awayScore] : [m.awayScore, m.homeScore]
  return us > them ? 'G' : us < them ? 'M' : 'B'
}

/** Oynanmış son 5 maçın sonucu — kronolojik sırada verilen maçlardan; en yeni sonda. */
export function recentForm(matches: readonly ScoredMatch[], length = FORM_LENGTH): FormResult[] {
  return matches.map(resultOf).filter((r): r is FormResult => r !== null).slice(-length)
}

/** Averaj gösterimi: +5 / 0 / -2 */
export function signed(n: number): string {
  return n > 0 ? `+${n}` : String(n)
}
