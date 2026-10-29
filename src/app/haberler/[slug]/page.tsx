import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { CalendarDays, Clock } from 'lucide-react'
import type { Metadata } from 'next'
import { getNews, getNewsBySlug, getCategories } from '@/lib/supabase/news-server'
import { newsListHref, readingMinutes, relatedNews } from '@/lib/news'
import { SITE_URL } from '@/lib/site'
import { formatDate } from '@/lib/utils'
import NewsCard from '@/components/news/NewsCard'
import ShareBox from '@/components/news/ShareBox'
import NextMatchSide from '@/components/macmerkezi/NextMatchSide'
import { Breadcrumb, SectionHead } from '@/components/news/NewsPageHead'
import { CategoryBox, LatestBox } from '@/components/news/NewsSidebar'
import { categoryName, categoryTone } from '@/components/news/categoryTone'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) return {}
  return {
    title: item.title,
    description: item.excerpt,
    openGraph: { title: item.title, description: item.excerpt, images: item.imageUrl ? [item.imageUrl] : undefined, type: 'article' },
  }
}

/* Metin gövdesi: boş satırla ayrılmış bloklar → paragraf (tek satır kırılımları korunur) */
const paragraphs = (text: string) => text.split(/\n\s*\n/).map((p) => p.trim()).filter(Boolean)

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params
  const [item, all, cats] = await Promise.all([getNewsBySlug(slug), getNews(), getCategories()])
  if (!item) notFound()

  const catName = categoryName(item.category, cats)
  const tone = categoryTone(item.category, cats)
  const related = relatedNews(all, item, 4)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="mx-auto max-w-7xl px-4 pb-20 pt-8 sm:px-6 lg:px-8">
        <Breadcrumb items={[
          { label: 'Ana sayfa', href: '/' },
          { label: 'Haberler', href: '/haberler' },
          { label: catName, href: newsListHref({ kategori: item.category }) },
        ]} />

        <div className="mt-6 grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_340px]">
          <article className="min-w-0 rounded-2xl border border-[#e3ede7] bg-white p-5 sm:p-8 lg:p-10">
            <header>
              <Link href={newsListHref({ kategori: item.category })}
                className={`inline-block rounded-md px-2.5 py-1 text-[10px] font-extrabold uppercase tracking-[0.14em] transition-opacity hover:opacity-85 ${tone.badge}`}>
                {catName}
              </Link>
              <h1 className="mt-4 font-heading text-[1.9rem] font-extrabold leading-[1.08] tracking-[-0.02em] text-ugreenm sm:text-[2.5rem] lg:text-[2.8rem]">
                {item.title}
              </h1>
              {item.excerpt && (
                <p className="mt-5 border-l-4 border-ugold pl-4 text-[17px] font-medium leading-relaxed text-utxt2">{item.excerpt}</p>
              )}
              <div className="mt-6 flex flex-wrap items-center gap-x-5 gap-y-2 border-b border-[#edf5f0] pb-6 text-[11px] font-extrabold uppercase tracking-wider text-[#7aab8e]">
                <time dateTime={item.date} className="inline-flex items-center gap-1.5"><CalendarDays size={13} aria-hidden />{formatDate(item.date)}</time>
                <span className="inline-flex items-center gap-1.5"><Clock size={13} aria-hidden />{readingMinutes(item.content)} dk okuma</span>
              </div>
            </header>

            {item.imageUrl && (
              <figure className="relative mt-7 aspect-[16/9] overflow-hidden rounded-xl bg-[#edf5f0]">
                <Image src={item.imageUrl} alt={item.title} fill priority sizes="(min-width:1024px) 780px, 100vw" className="object-cover" />
              </figure>
            )}

            <div className="mt-8 space-y-5 text-[17px] leading-[1.8] text-[#23453a]">
              {paragraphs(item.content).map((p, i) => <p key={i} className="whitespace-pre-line">{p}</p>)}
            </div>

            <div className="mt-10">
              <ShareBox url={`${SITE_URL}/haberler/${item.slug}`} title={item.title} />
            </div>
          </article>

          <aside className="space-y-6 lg:sticky lg:top-28 lg:self-start">
            <NextMatchSide />
            <CategoryBox news={all} categories={cats} active={null} />
            <LatestBox news={all} excludeId={item.id} />
          </aside>
        </div>

        {related.length > 0 && (
          <section className="mt-16">
            <SectionHead eyebrow="Devamı" title="İlgili Haberler" aside={
              <Link href="/haberler" className="rounded-xl border border-[#ddeae2] bg-white px-4 py-2.5 text-[12px] font-extrabold uppercase tracking-wide text-ugreenm transition-colors hover:border-ugreen hover:bg-ugreen hover:text-white">
                Tüm Haberler →
              </Link>
            } />
            <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((n) => (
                <NewsCard key={n.id} item={n} compact categoryLabel={categoryName(n.category, cats)} tone={categoryTone(n.category, cats)} />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
