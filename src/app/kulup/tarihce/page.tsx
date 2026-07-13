import type { Metadata } from 'next'
import { getPage, getRelatedPages, type SitePage } from '@/lib/supabase/pages-server'
import PageRenderer from '@/components/pages/PageRenderer'

export const revalidate = 60

export const metadata: Metadata = {
  title: 'Tarihçe',
  description: 'Şanlıurfaspor\'un kuruluşundan günümüze uzanan köklü tarihi.',
}

const FALLBACK: SitePage = {
  slug: 'tarihce',
  title: 'Tarihçe',
  subtitle: 'Köklü bir geçmiş, sarı-yeşil bir tutku',
  heroImage: null,
  body: 'İçerik yakında eklenecek.',
  navGroup: 'kulup',
  sort: 0,
  published: true,
}

export default async function TarihcePage() {
  const page = (await getPage('tarihce')) ?? FALLBACK
  const related = await getRelatedPages('kulup', 'tarihce')
  return <PageRenderer page={page} related={related} />
}
