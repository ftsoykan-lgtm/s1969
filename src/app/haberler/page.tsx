import type { Metadata } from 'next'
import { getNews, getCategories } from '@/lib/supabase/news-server'
import NewsList from '@/components/news/NewsList'

export const metadata: Metadata = {
  title: 'Haberler',
  description: 'Şanlıurfaspor güncel haberleri, transferler, maç raporları.',
}

export const dynamic = 'force-dynamic'

export default async function HaberlerPage() {
  const [news, categories] = await Promise.all([getNews(), getCategories()])

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="bg-ugreen py-14">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="block w-8 h-0.5 bg-ugold" />
            <p className="text-xs font-black tracking-widest uppercase text-ugold/60">Güncel</p>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Kulüp <span className="text-ugold">Haberleri</span>
          </h1>
        </div>
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <NewsList news={news} categories={categories} />
      </div>
    </div>
  )
}
