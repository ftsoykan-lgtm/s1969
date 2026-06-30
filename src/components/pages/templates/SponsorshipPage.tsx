import type { SitePage } from '@/lib/supabase/pages-server'
import Link from 'next/link'
import { Check, ArrowUpRight } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Tier { name: string; items: string; featured?: string }
interface Data { intro?: string; tiers?: Tier[] }

const isYes = (v?: string) => /^(evet|yes|true|1)$/i.test((v ?? '').trim())

export default function SponsorshipPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const tiers = d.tiers ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {tiers.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Paketler" title="Sponsorluk Seçenekleri" />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5 items-stretch">
              {tiers.map((t, i) => {
                const featured = isYes(t.featured)
                const items = (t.items ?? '').split('\n').map((s) => s.trim()).filter(Boolean)
                return (
                  <div
                    key={i}
                    className={`reveal rounded-3xl p-7 flex flex-col ${
                      featured
                        ? 'bg-gradient-to-br from-ugreenm to-ugreen text-white shadow-lg md:-translate-y-2 ring-2 ring-ugold/30'
                        : 'bg-white border border-[#ddeae2] shadow-sm'
                    }`}
                  >
                    {featured && <span className="self-start mb-3 text-[10px] font-extrabold tracking-widest uppercase bg-ugold text-ugreendd rounded-full px-3 py-1">Öne Çıkan</span>}
                    <h3 className={`font-heading text-2xl font-extrabold ${featured ? 'text-ugold' : 'text-ugreenm'}`}>{t.name}</h3>
                    <ul className="mt-5 space-y-2.5 flex-1">
                      {items.map((it, j) => (
                        <li key={j} className="flex items-start gap-2.5">
                          <Check size={17} className={`shrink-0 mt-0.5 ${featured ? 'text-ugold' : 'text-ugreen'}`} strokeWidth={2.6} />
                          <span className={`text-[14px] leading-relaxed ${featured ? 'text-white/85' : 'text-[#3d4a44]'}`}>{it}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )
              })}
            </div>
          </section>
        )}

        {/* CTA */}
        <Link href="/iletisim" className="reveal mt-12 group flex flex-col sm:flex-row items-center justify-between gap-4 rounded-3xl bg-ugold p-7 text-ugreendd">
          <div>
            <p className="text-[11px] font-extrabold tracking-widest uppercase opacity-70">İş birliği</p>
            <p className="font-heading text-xl md:text-2xl font-extrabold">Markanızı sarı-yeşil ile buluşturun</p>
          </div>
          <span className="inline-flex items-center gap-2 bg-ugreendd text-ugold font-extrabold px-5 py-3 rounded-xl group-hover:gap-3 transition-all">
            Teklif Al <ArrowUpRight size={18} />
          </span>
        </Link>
      </Container>
    </PageShell>
  )
}
