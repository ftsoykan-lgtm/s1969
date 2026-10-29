import type { NewsCategory } from '@/lib/supabase/news-server'

/* Kategori renkleri — yeni palet İCAT ETME: kulüp token'ları (sarı/yeşil tonları)
   kategori sırasına göre döngüyle atanır; aynı kategori her yerde aynı rengi alır. */
const TONES = [
  { dot: 'bg-ugold', badge: 'bg-ugold text-ugreend' },
  { dot: 'bg-ugreen', badge: 'bg-ugreen text-white' },
  { dot: 'bg-ugoldd', badge: 'bg-ugoldd text-white' },
  { dot: 'bg-ugreend', badge: 'bg-ugreend text-ugold' },
  { dot: 'bg-utxt2', badge: 'bg-utxt2 text-white' },
] as const

export type CategoryTone = (typeof TONES)[number]

export function categoryTone(slug: string, categories: readonly NewsCategory[]): CategoryTone {
  const i = categories.findIndex((c) => c.slug === slug)
  return TONES[(i < 0 ? 0 : i) % TONES.length]
}

export function categoryName(slug: string, categories: readonly NewsCategory[]): string {
  return categories.find((c) => c.slug === slug)?.name ?? slug
}
