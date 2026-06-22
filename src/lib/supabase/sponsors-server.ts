import { createClient } from '@/lib/supabase/server'
import { sponsorsData } from '@/data/sponsors'
import type { Sponsor } from '@/types'

/**
 * Sponsorları Supabase'den okur (admin yönetir); yoksa statik veriye düşer.
 */
export async function getSponsors(): Promise<Sponsor[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('sponsors')
      .select('*')
      .eq('active', true)
      .order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return sponsorsData
    return data.map((r) => ({
      id: String(r.id),
      name: r.name,
      logoUrl: r.logo_url ?? '',
      website: r.website ?? '#',
      tier: (r.tier as Sponsor['tier']) ?? 'destekci',
    }))
  } catch {
    return sponsorsData
  }
}
