import { createClient } from '@/lib/supabase/server'

export interface SitePage {
  slug: string
  title: string
  subtitle?: string | null
  heroImage?: string | null
  body?: string | null
  navGroup: string
  sort: number
  published: boolean
}

/* eslint-disable @typescript-eslint/no-explicit-any */
function map(r: any): SitePage {
  return {
    slug: r.slug,
    title: r.title,
    subtitle: r.subtitle ?? null,
    heroImage: r.hero_image ?? null,
    body: r.body ?? null,
    navGroup: r.nav_group ?? 'kulup',
    sort: r.sort ?? 0,
    published: r.published ?? true,
  }
}

/** Tek sayfa (yayınlanmış) — yoksa null */
export async function getPage(slug: string): Promise<SitePage | null> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_pages')
      .select('*')
      .eq('slug', slug)
      .eq('published', true)
      .single()
    if (error || !data) return null
    return map(data)
  } catch {
    return null
  }
}

/** Yayınlanmış tüm sayfalar (navbar/footer menüleri için) */
export async function getPages(): Promise<SitePage[]> {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('site_pages')
      .select('*')
      .eq('published', true)
      .order('nav_group', { ascending: true })
      .order('sort', { ascending: true })
    if (error || !data) return []
    return data.map(map)
  } catch {
    return []
  }
}
