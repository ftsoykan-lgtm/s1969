import type { SitePage } from '@/lib/supabase/pages-server'
import { PageShell, PageHero, Container, Intro, pageData } from '../shared'

interface Milestone { year: string; title: string; text: string }
interface Data { intro?: string; milestones?: Milestone[] }

export default function TimelinePage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const items = d.milestones ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Zaman çizelgesi */}
        <ol className="mt-12 relative">
          {/* Dikey ray */}
          <span aria-hidden className="absolute left-[15px] md:left-1/2 top-2 bottom-2 w-px bg-gradient-to-b from-ugold/50 via-[#cfe3d8] to-transparent md:-translate-x-1/2" />
          {items.map((m, i) => (
            <li key={i} className={`reveal relative pl-12 md:pl-0 md:w-1/2 md:pb-12 pb-10 ${i % 2 ? 'md:ml-auto md:pl-12' : 'md:pr-12 md:text-right'}`}>
              {/* Nokta */}
              <span
                aria-hidden
                className={`absolute top-1 left-[7px] md:left-auto w-4 h-4 rounded-full bg-ugold ring-4 ring-[#f5f9f6] shadow ${i % 2 ? 'md:-left-2' : 'md:-right-2'}`}
              />
              <div className="inline-block">
                <span className="inline-block font-heading text-2xl md:text-3xl font-extrabold text-ugreen leading-none">{m.year}</span>
                <div className="mt-2 card-premium p-5 md:p-6 text-left">
                  <h3 className="font-heading text-lg font-extrabold text-ugreenm">{m.title}</h3>
                  <p className="mt-1.5 text-[14px] leading-relaxed text-[#3d4a44]">{m.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </Container>
    </PageShell>
  )
}
