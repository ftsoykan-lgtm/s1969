import { createClient as createSupabaseClient } from '@supabase/supabase-js'

/**
 * Halka açık okumalar için çerezsiz Supabase istemcisi.
 *
 * `cookies()` OKUMAZ — bu sayede sayfalar `force-dynamic`'e zorlanmaz ve ISR
 * (revalidate) ile önbelleklenebilir. Ayrıca auth uçlarına gitmediği için
 * "429 over_request_rate_limit" (auth rate limit) sorunu oluşmaz.
 *
 * Sadece anon key + RLS public-read politikaları ile okuma yapar; oturum
 * saklamaz. Yazma/kimlik gerektiren işlemler için server.ts (çerezli) kullanılır.
 *
 * Not: call site'lar `await createClient()` çağırıyor; senkron değer await
 * edilince aynen döner, ekstra değişiklik gerekmez.
 */
export function createClient() {
  return createSupabaseClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    { auth: { persistSession: false, autoRefreshToken: false } }
  )
}
