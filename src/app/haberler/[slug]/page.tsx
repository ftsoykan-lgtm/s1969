import { notFound } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { newsData, CATEGORY_LABELS, CATEGORY_VARIANT } from '@/data/news'
import { formatDate } from '@/lib/utils'
import { ArrowLeft, Calendar } from 'lucide-react'
import type { Metadata } from 'next'

interface Props { params: Promise<{ slug: string }> }

export async function generateStaticParams() {
  return newsData.map((n) => ({ slug: n.slug }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const item = newsData.find((n) => n.slug === slug)
  if (!item) return {}
  return { title: item.title, description: item.excerpt }
}

export default async function HaberDetayPage({ params }: Props) {
  const { slug } = await params
  const item = newsData.find((n) => n.slug === slug)
  if (!item) notFound()

  const variant = CATEGORY_VARIANT[item.category]
  const related = newsData.filter((n) => n.id !== item.id).slice(0, 3)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Hero */}
      <div className="relative h-[300px] md:h-[420px]">
        <Image src={item.imageUrl} alt={item.title} fill priority sizes="100vw" className="object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/98 via-[#0f4a28]/60 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#092d18]/50 to-transparent" />
      </div>

      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 -mt-28 relative pb-16">
        <Link href="/haberler" className="inline-flex items-center gap-2 text-sm text-white/70 hover:text-white transition-colors mb-6 font-medium">
          <ArrowLeft size={16} /> Tüm Haberlere Dön
        </Link>

        {/* Ana makale kartı */}
        <article className="bg-white rounded-2xl border border-[#ddeae2] shadow-lg overflow-hidden">
          <div className="p-6 md:p-10">
            <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black tracking-widest uppercase mb-5 ${
              variant === 'green' ? 'bg-[#1A6B3C] text-white' : 'bg-[#FFD100] text-[#092d18]'
            }`}>
              {CATEGORY_LABELS[item.category]}
            </span>

            <h1 className="text-3xl md:text-4xl font-black text-[#092d18] leading-tight tracking-tight mb-4">
              {item.title}
            </h1>

            <div className="flex items-center gap-2 text-sm text-[#3d6b52] mb-8 pb-8 border-b border-[#ddeae2]">
              <Calendar size={14} />
              <span>{formatDate(item.date)}</span>
            </div>

            <div className="text-[#092d18] leading-relaxed text-base whitespace-pre-line">
              {item.content}
            </div>
          </div>
        </article>

        {/* İlgili haberler */}
        {related.length > 0 && (
          <div className="mt-12">
            <h2 className="text-xl font-black text-[#092d18] mb-5">İlgili Haberler</h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {related.map((rel) => (
                <Link key={rel.id} href={`/haberler/${rel.slug}`}
                  className="group relative block rounded-xl overflow-hidden h-48 border border-[#ddeae2] shadow-sm hover:shadow-md hover:border-[#1A6B3C]/40 transition-all">
                  <Image src={rel.imageUrl} alt={rel.title} fill sizes="33vw" className="object-cover transition-transform duration-500 group-hover:scale-105" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#092d18]/95 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white text-sm font-bold line-clamp-2">{rel.title}</p>
                    <p className="text-[11px] text-[#FFD100]/70 mt-1">{formatDate(rel.date)}</p>
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
