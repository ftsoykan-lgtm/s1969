import type { Metadata } from 'next'
import { getPage, getRelatedPages, type SitePage } from '@/lib/supabase/pages-server'
import PageRenderer from '@/components/pages/PageRenderer'

export const revalidate = 60

export const metadata: Metadata = { title: 'Yönetim Kurulu' }

const FALLBACK: SitePage = {
  slug: 'yonetim-kurulu',
  title: 'Yönetim Kurulu',
  subtitle: 'Kulübümüzü yöneten kadro',
  heroImage: null,
  body: 'İçerik yakında eklenecek.',
  navGroup: 'kulup',
  sort: 1,
  published: true,
}

export default async function YonetimPage() {
  const page = (await getPage('yonetim-kurulu')) ?? FALLBACK
  const related = await getRelatedPages('kulup', 'yonetim-kurulu')
  return <PageRenderer page={page} related={related} />
}
