import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import { getPage, getRelatedPages } from '@/lib/supabase/pages-server'
import PageRenderer from '@/components/pages/PageRenderer'

export const revalidate = 60

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  return {
    title: page?.title ?? 'Sayfa',
    description: page?.subtitle ?? undefined,
  }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  const related = await getRelatedPages(page.navGroup, page.slug)
  return <PageRenderer page={page} related={related} />
}
