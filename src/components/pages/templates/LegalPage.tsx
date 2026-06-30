import type { SitePage } from '@/lib/supabase/pages-server'
import { PageShell, PageHero, Container, Intro, pageData } from '../shared'

interface Article { no: string; title: string; text: string }
interface Data { intro?: string; articles?: Article[] }

const anchor = (i: number) => `madde-${i + 1}`

export default function LegalPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const articles = d.articles ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-[260px_minmax(0,1fr)] gap-8 lg:gap-12 items-start">
          {/* İçindekiler */}
          {articles.length > 0 && (
            <nav className="reveal lg:sticky lg:top-24 bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-5">
              <p className="text-[11px] font-extrabold tracking-[0.2em] uppercase text-[#7aab8e] mb-3">İçindekiler</p>
              <ol className="space-y-1">
                {articles.map((a, i) => (
                  <li key={i}>
                    <a href={`#${anchor(i)}`} className="group flex items-start gap-2 rounded-lg px-2 py-1.5 -mx-1 hover:bg-[#f5f9f6] transition-colors">
                      <span className="text-[11px] font-bold text-ugold mt-0.5 shrink-0">{a.no}</span>
                      <span className="text-[13px] font-semibold text-utxt2 group-hover:text-ugreen leading-snug">{a.title}</span>
                    </a>
                  </li>
                ))}
              </ol>
            </nav>
          )}

          {/* Maddeler */}
          <div className="space-y-5">
            {articles.map((a, i) => (
              <article key={i} id={anchor(i)} className="reveal bg-white rounded-2xl border border-[#ddeae2] shadow-sm p-6 md:p-8">
                <div className="flex items-baseline gap-3 mb-2">
                  <span className="text-[11px] font-extrabold tracking-wide uppercase text-ugold bg-ugold/10 rounded-md px-2 py-0.5">{a.no}</span>
                  <h2 className="font-heading text-lg md:text-xl font-extrabold text-ugreenm">{a.title}</h2>
                </div>
                <p className="text-[15px] text-[#3d4a44] leading-[1.8] whitespace-pre-line">{a.text}</p>
              </article>
            ))}
          </div>
        </div>
      </Container>
    </PageShell>
  )
}
