import { Match, StandingRow } from '@/types'
import { tffMatches, tffStandings, tffMeta } from '@/lib/tff'

/**
 * Maç ve puan tablosu verisi artık TFF'den canlı çekiliyor.
 * Kaynak:  src/data/tff-live.json  (npm run tff ile güncellenir)
 * Dönüşüm: src/lib/tff.ts
 */

export const matchesData: Match[] = tffMatches
export const standingsData: StandingRow[] = tffStandings

// Lig / sezon bilgisi (başlıklarda kullanılır)
export const fixtureMeta = tffMeta
