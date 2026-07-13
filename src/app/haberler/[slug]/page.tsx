import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { getNews, getNewsBySlug, getCategories } from '@/lib/supabase/news-server'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export const revalidate = 60

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = await getNewsBySlug(slug)
  if (!item) return {}
  return { title: item.title, description: item.excerpt }
}

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params
  const [item, all, cats] = await Promise.all([getNewsBySlug(slug), getNews(), getCategories()])
  if (!item) notFound()

  const catName = cats.find((c) => c.slug === item.category)?.name ?? item.category
  const related = all.filter((n) => n.slug !== item.slug).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Hero */}
      <div className="relative h-[300px] md:h-[440px]">
        <Image src={item.imageUrl} alt={item.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/98 via-ugreend/60 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-28 relative pb-16">
        <Link href="/haberler" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6 font-medium">
          <ArrowLeft size={16} /> Tüm Haberlere Dön
        </Link>

        <article className="bg-white rounded-2xl border border-[#ddeae2] shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-[11px] font-extrabold tracking-widest uppercase mb-5 bg-ugold text-ugreenm">
              {catName}
            </span>
            <h1 className="text-3xl md:text-4xl font-extrabold text-ugreenm leading-tight tracking-tight mb-4">{item.title}</h1>
            <div className="flex items-center gap-2 text-sm text-utxt2 mb-8 pb-8 border-b border-[#ddeae2]">
              <Calendar size={14} />
              <span>{formatDate(item.date)}</span>
            </div>
            {item.excerpt && <p className="text-lg text-utxt2 font-medium leading-relaxed mb-6">{item.excerpt}</p>}
            <div className="text-ugreenm leading-relaxed text-base whitespace-pre-line">{item.content}</div>
          </div>
        </article>

        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-extrabold text-ugreenm mb-5">İlgili Haberler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.id} href={`/haberler/${rel.slug}`}
                  className="group relative block rounded-xl overflow-hidden h-48 border border-[#ddeae2] shadow-sm hover:shadow-md hover:border-ugreen/40 transition-all">
                  <Image src={rel.imageUrl} alt={rel.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-ugreenm/95 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-bold line-clamp-2">{rel.title}</p>
                    <p className="text-[11px] text-ugold/70 mt-1">{formatDate(rel.date)}</p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
