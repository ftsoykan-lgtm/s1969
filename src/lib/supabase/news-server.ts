import { cache } from 'react'
import { createClient } from '@/lib/supabase/public'
import { newsData } from '@/data/news'
import type { NewsItem } from '@/types'

export interface SiteNews {
  id: string
  title: string
  slug: string
  excerpt: string
  content: string
  imageUrl: string
  category: string
  date: string
  featured: boolean
}

export interface NewsCategory { name: string; slug: string }

const FALLBACK: SiteNews[] = newsData.map((n) => ({
  id: n.id, title: n.title, slug: n.slug, excerpt: n.excerpt, content: n.content,
  imageUrl: n.imageUrl, category: n.category, date: n.date, featured: n.featured,
}))

/** Yayındaki haberleri Supabase'den çek (yoksa statik).
 *  React cache() ile sarılı: aynı render/istek içinde birden çok çağrı
 *  (ör. getNews + getFeaturedNews) tek sorguya indirgenir. */
export const getNews = cache(async (): Promise<SiteNews[]> => {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('news')
      .select('*')
      .eq('published', true)
      .order('published_at', { ascending: false })
    if (error || !data || data.length === 0) return FALLBACK
    return data.map(mapRow)
  } catch {
    return FALLBACK
  }
})

export async function getNewsBySlug(slug: string): Promise<SiteNews | null> {
  const all = await getNews()
  return all.find((n) => n.slug === slug) ?? null
}

/** Hero'da gösterilecek haberler — YALNIZ admin'de "Hero'da (slider) göster"
 *  işaretli olanlar. Hiç işaretli haber yoksa boş döner ve ana sayfa hero
 *  alanı tamamen gizlenir; böylece slider admin'den gerçekten açılıp kapanır. */
export async function getFeaturedNews(): Promise<SiteNews[]> {
  const all = await getNews()
  return all.filter((n) => n.featured)
}

export async function getCategories(): Promise<NewsCategory[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('news_categories')
      .select('name, slug')
      .order('sort_order', { ascending: true })
    if (error || !data || data.length === 0) return FALLBACK_CATS
    return data
  } catch {
    return FALLBACK_CATS
  }
}

const FALLBACK_CATS: NewsCategory[] = [
  { name: 'Haberler', slug: 'haber' },
  { name: 'Transfer', slug: 'transfer' },
  { name: 'Maç Raporu', slug: 'mac-raporu' },
  { name: 'Basın Bülteni', slug: 'basin-bildirisi' },
  { name: 'Altyapı', slug: 'altyapi' },
]

function mapRow(r: Record<string, unknown>): SiteNews {
  return {
    id: String(r.id),
    title: (r.title as string) ?? '',
    slug: (r.slug as string) ?? '',
    excerpt: (r.excerpt as string) ?? '',
    content: (r.content as string) ?? '',
    imageUrl: (r.image_url as string) ?? '',
    category: (r.category as string) ?? 'haber',
    date: (r.published_at as string) ?? (r.created_at as string)?.slice(0, 10) ?? '',
    featured: Boolean(r.featured),
  }
}

// İsteğe bağlı: eski NewsItem'a köprü
export type { NewsItem }
