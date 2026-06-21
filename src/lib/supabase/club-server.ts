import { createClient } from '@/lib/supabase/server'
import { clubInfo as fallback } from '@/data/club'
import type { ClubInfo } from '@/data/club'

/**
 * Kulüp bilgilerini sunucu tarafında Supabase'den okur (admin'de kaydedilen).
 * Kayıt yoksa veya hata olursa statik varsayılana düşer.
 */
export async function getClubInfo(): Promise<ClubInfo> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_settings')
      .select('data')
      .eq('id', 1)
      .single()
    if (error || !data?.data || Object.keys(data.data).length === 0) return fallback
    return { ...fallback, ...(data.data as Partial<ClubInfo>) }
  } catch {
    return fallback
  }
}
