import type { SitePage } from '@/lib/supabase/pages-server'
import { Mail, Phone } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Step { title: string; text: string }
interface Data { intro?: string; steps?: Step[]; contactEmail?: string; contactPhone?: string }

export default function PressPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const steps = d.steps ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Akreditasyon adımları */}
        {steps.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Akreditasyon" title="Nasıl Başvurulur?" />
            <ol className="space-y-3">
              {steps.map((s, i) => (
                <li key={i} className="reveal flex items-start gap-4 card-premium p-5">
                  <span className="grid place-items-center w-10 h-10 rounded-full bg-ugold text-ugreendd font-heading font-extrabold shrink-0">{i + 1}</span>
                  <div>
                    <h3 className="font-heading text-base font-extrabold text-ugreenm">{s.title}</h3>
                    <p className="mt-0.5 text-[14px] text-[#3d4a44] leading-relaxed">{s.text}</p>
                  </div>
                </li>
              ))}
            </ol>
          </section>
        )}

        {/* İletişim */}
        {(d.contactEmail || d.contactPhone) && (
          <section className="mt-12">
            <SectionTitle kicker="İletişim" title="Basın Birimi" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {d.contactEmail && (
                <a href={`mailto:${d.contactEmail}`} className="reveal group flex items-center gap-4 card-premium p-5">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-ugreen/10 text-ugreen shrink-0"><Mail size={20} /></span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#7aab8e]">E-posta</p>
                    <p className="text-sm font-bold text-ugreenm group-hover:text-ugreen break-all">{d.contactEmail}</p>
                  </div>
                </a>
              )}
              {d.contactPhone && (
                <a href={`tel:${d.contactPhone.replace(/\s/g, '')}`} className="reveal group flex items-center gap-4 card-premium p-5">
                  <span className="grid place-items-center w-11 h-11 rounded-xl bg-ugreen/10 text-ugreen shrink-0"><Phone size={20} /></span>
                  <div>
                    <p className="text-[11px] font-bold uppercase tracking-wide text-[#7aab8e]">Telefon</p>
                    <p className="text-sm font-bold text-ugreenm group-hover:text-ugreen">{d.contactPhone}</p>
                  </div>
                </a>
              )}
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  )
}
