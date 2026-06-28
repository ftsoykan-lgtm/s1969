import { notFound } from 'next/navigation'
import { getPage } from '@/lib/supabase/pages-server'
import type { Metadata } from 'next'

export const dynamic = 'force-dynamic'

interface Props { params: Promise<{ slug: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const page = await getPage(slug)
  return { title: page?.title ?? 'Sayfa' }
}

export default async function StaticPage({ params }: Props) {
  const { slug } = await params
  const page = await getPage(slug)
  if (!page) notFound()

  const paragraphs = (page.body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      {/* Hero */}
      <div className="relative bg-gradient-to-b from-[#0c3a23] to-ugreenm overflow-hidden">
        {page.heroImage && (
          <div className="absolute inset-0">
            <img src={page.heroImage} alt="" className="w-full h-full object-cover opacity-25" />
            <div className="absolute inset-0 bg-gradient-to-b from-[#0c3a23]/70 to-ugreenm" />
          </div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-extrabold tracking-widest uppercase text-ugold/60">Şanlıurfaspor</p>
          </div>
          <h1 className="font-heading text-5xl md:text-7xl font-extrabold text-white tracking-[-0.03em] leading-[0.95]">{page.title}</h1>
          {page.subtitle && <p className="mt-3 text-white/55 text-base md:text-lg max-w-2xl">{page.subtitle}</p>}
        </div>
      </div>

      {/* İçerik */}
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-8 md:p-10">
          {paragraphs.length > 0 ? (
            <div className="space-y-5">
              {paragraphs.map((p, i) => (
                <p key={i} className="text-[15px] md:text-base text-[#3d4a44] leading-relaxed whitespace-pre-line">{p}</p>
              ))}
            </div>
          ) : (
            <p className="text-[#7aab8e] text-sm">İçerik yakında eklenecek.</p>
          )}
        </div>
      </div>
    </div>
  )
}
