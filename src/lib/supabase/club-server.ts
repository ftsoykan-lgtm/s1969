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
    const saved = data.data as Partial<ClubInfo>
    // Sosyal medyayı alan-bazında birleştir: kayıtta boş/eksik link varsayılandan gelsin
    const social = { ...fallback.social }
    for (const [k, v] of Object.entries(saved.social ?? {})) {
      if (v && v !== '#') social[k as keyof typeof social] = v as string
    }
    return { ...fallback, ...saved, social }
  } catch {
    return fallback
  }
}
