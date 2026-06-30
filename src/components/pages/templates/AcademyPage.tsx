import type { SitePage } from '@/lib/supabase/pages-server'
import { ArrowRight } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Category { name: string; age: string }
interface Step { title: string; text: string }
interface Data { intro?: string; categories?: Category[]; pathway?: Step[] }

export default function AcademyPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const categories = d.categories ?? []
  const pathway = d.pathway ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Yaş kategorileri */}
        {categories.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Akademi" title="Yaş Kategorileri" />
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {categories.map((c, i) => (
                <div key={i} className="reveal rounded-2xl bg-gradient-to-br from-ugreen to-ugreenm text-white p-6 text-center">
                  <p className="font-heading text-3xl font-extrabold text-ugold leading-none">{c.name}</p>
                  <p className="mt-2 text-[13px] font-semibold text-white/70">{c.age}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Gelişim yolu */}
        {pathway.length > 0 && (
          <section className="mt-14">
            <SectionTitle kicker="Yol Haritası" title="Yıldıza Giden Yol" />
            <div className="flex flex-col md:flex-row gap-4 md:items-stretch">
              {pathway.map((s, i) => (
                <div key={i} className="reveal flex-1 flex items-stretch gap-4">
                  <div className="card-premium p-6 flex-1">
                    <span className="block font-heading text-4xl font-extrabold text-ugold/30 leading-none">{String(i + 1).padStart(2, '0')}</span>
                    <h3 className="mt-2 font-heading text-lg font-extrabold text-ugreenm">{s.title}</h3>
                    <p className="mt-1.5 text-[14px] text-[#3d4a44] leading-relaxed">{s.text}</p>
                  </div>
                  {i < pathway.length - 1 && (
                    <span aria-hidden className="hidden md:flex items-center text-ugold"><ArrowRight size={24} /></span>
                  )}
                </div>
              ))}
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  )
}
