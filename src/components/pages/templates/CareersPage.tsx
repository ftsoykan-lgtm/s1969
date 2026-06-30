import type { SitePage } from '@/lib/supabase/pages-server'
import Link from 'next/link'
import { MapPin, Clock, ArrowUpRight } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Position { title: string; type?: string; location?: string; text: string }
interface Value { title: string; text: string }
interface Data { intro?: string; positions?: Position[]; values?: Value[] }

export default function CareersPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const positions = d.positions ?? []
  const values = d.values ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Açık pozisyonlar */}
        {positions.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Kariyer" title="Açık Pozisyonlar" />
            <div className="space-y-4">
              {positions.map((p, i) => (
                <div key={i} className="reveal card-premium p-6">
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mb-2">
                    <h3 className="font-heading text-lg font-extrabold text-ugreenm">{p.title}</h3>
                    {p.type && <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-utxt2"><Clock size={13} className="text-ugold" /> {p.type}</span>}
                    {p.location && <span className="inline-flex items-center gap-1 text-[12px] font-semibold text-utxt2"><MapPin size={13} className="text-ugold" /> {p.location}</span>}
                  </div>
                  <p className="text-[14px] text-[#3d4a44] leading-relaxed">{p.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Değerler */}
        {values.length > 0 && (
          <section className="mt-14">
            <SectionTitle kicker="Kültür" title="Değerlerimiz" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {values.map((v, i) => (
                <div key={i} className="reveal card-premium p-6">
                  <h3 className="font-heading text-lg font-extrabold text-ugreenm">{v.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[#3d4a44] leading-relaxed">{v.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* CTA */}
        <Link href="/iletisim" className="reveal mt-12 group flex items-center justify-between gap-3 bg-ugreenm hover:bg-ugreen text-white rounded-3xl p-6 transition-colors">
          <div>
            <p className="text-[11px] font-extrabold tracking-wide uppercase text-ugold/80">Başvuru</p>
            <p className="font-heading text-lg font-extrabold">Ekibimize katılın</p>
          </div>
          <ArrowUpRight size={22} className="text-ugold group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" strokeWidth={2.4} />
        </Link>
      </Container>
    </PageShell>
  )
}
