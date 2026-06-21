import { createClient } from '@/lib/supabase/server'
import {
  buildStandings, buildMatches, buildMeta, staticRaw, type TffRaw,
} from '@/lib/tff'
import type { Match, StandingRow } from '@/types'

/**
 * TFF verisini ÖNCE Supabase tff_data tablosundan (canlı, GitHub Actions
 * günceller) okur; yoksa/başarısızsa build-time JSON'a (yedek) düşer.
 */
export async function getLiveTff(): Promise<{
  standings: StandingRow[]
  matches: Match[]
  meta: ReturnType<typeof buildMeta>
}> {
  let raw: TffRaw = staticRaw
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('tff_data')
      .select('data')
      .eq('id', 1)
      .single()
    if (!error && data?.data && (data.data as TffRaw).standings?.length) {
      raw = data.data as TffRaw
    }
  } catch {
    // sessizce yedek veriye düş
  }
  return {
    standings: buildStandings(raw),
    matches: buildMatches(raw),
    meta: buildMeta(raw),
  }
}
