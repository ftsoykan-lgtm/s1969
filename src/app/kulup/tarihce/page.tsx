import type { Metadata } from 'next'
import { getPage } from '@/lib/supabase/pages-server'

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: 'Tarihçe',
  description: 'Şanlıurfaspor\'un kuruluşundan günümüze uzanan köklü tarihi.',
}

export default async function TarihcePage() {
  const page = await getPage('tarihce')
  const title = page?.title ?? 'Tarihçe'
  const subtitle = page?.subtitle ?? 'Köklü bir geçmiş, sarı-yeşil bir tutku'
  const body = page?.body ?? 'İçerik yakında eklenecek.'
  const paragraphs = body.split(/\n{2,}/).map((p) => p.trim()).filter(Boolean)

  return (
    <div className="min-h-screen bg-[#f5f9f6]">
      <div className="relative bg-gradient-to-b from-[#0c3a23] to-ugreenm overflow-hidden">
        {page?.heroImage && (
          <div className="absolute inset-0"><img src={page.heroImage} alt="" className="w-full h-full object-cover opacity-25" /><div className="absolute inset-0 bg-gradient-to-b from-[#0c3a23]/70 to-ugreenm" /></div>
        )}
        <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="flex items-center gap-3 mb-3"><span className="block w-8 h-0.5 bg-ugold" /><p className="text-xs font-black tracking-widest uppercase text-ugold/60">Kulüp</p></div>
          <h1 className="font-heading text-4xl md:text-5xl font-black text-white tracking-tight">{title}</h1>
          {subtitle && <p className="mt-3 text-white/55 text-base md:text-lg max-w-2xl">{subtitle}</p>}
        </div>
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 py-12 pb-20">
        <div className="bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-8 md:p-10 space-y-5">
          {paragraphs.map((p, i) => <p key={i} className="text-[15px] md:text-base text-[#3d4a44] leading-relaxed whitespace-pre-line">{p}</p>)}
        </div>
      </div>
    </div>
  )
}
