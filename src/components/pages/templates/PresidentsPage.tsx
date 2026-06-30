import type { SitePage } from '@/lib/supabase/pages-server'
import { Crown } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, pageData } from '../shared'

interface President { name: string; term: string; note?: string }
interface Data { intro?: string; presidents?: President[] }

export default function PresidentsPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const list = d.presidents ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        <ul className="mt-10 space-y-3">
          {list.map((p, i) => (
            <li
              key={i}
              className={`reveal flex items-center gap-4 rounded-2xl border px-5 py-4 transition-colors ${
                i === 0
                  ? 'bg-gradient-to-r from-ugreenm to-ugreen text-white border-transparent shadow-sm'
                  : 'bg-white border-[#ddeae2] hover:border-ugreen/30'
              }`}
            >
              <span
                className={`grid place-items-center w-11 h-11 rounded-xl font-heading font-extrabold shrink-0 ${
                  i === 0 ? 'bg-ugold/20 text-ugold' : 'bg-[#f5f9f6] text-ugreen'
                }`}
              >
                {i === 0 ? <Crown size={20} /> : String(list.length - i).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <h3 className={`font-heading text-lg font-extrabold leading-tight ${i === 0 ? 'text-white' : 'text-ugreenm'}`}>{p.name}</h3>
                {p.note && <p className={`text-[12px] ${i === 0 ? 'text-white/70' : 'text-utxt2'}`}>{p.note}</p>}
              </div>
              <span className={`text-sm font-bold shrink-0 ${i === 0 ? 'text-ugold' : 'text-utxt2'}`}>{p.term}</span>
            </li>
          ))}
        </ul>
      </Container>
    </PageShell>
  )
}
