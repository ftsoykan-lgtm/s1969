import type { SitePage } from '@/lib/supabase/pages-server'
import { Image as ImageIcon } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Exhibit { title: string; text: string; image?: string }
interface Stat { value: string; label: string }
interface Data { intro?: string; stats?: Stat[]; exhibits?: Exhibit[] }

export default function MuseumPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const exhibits = d.exhibits ?? []
  const stats = d.stats ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Sayısal vitrin */}
        {stats.length > 0 && (
          <div className="reveal mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl bg-gradient-to-br from-ugreenm to-ugreendd text-white p-5 text-center">
                <p className="font-heading text-2xl md:text-3xl font-extrabold text-ugold leading-none break-words">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {exhibits.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Koleksiyon" title="Sergiden" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {exhibits.map((e, i) => (
                <figure key={i} className="reveal group card-premium overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden bg-gradient-to-br from-ugreenm to-ugreendd grid place-items-center">
                    {e.image ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={e.image} alt={e.title} className="w-full h-full object-cover media-zoom" />
                    ) : (
                      <ImageIcon size={40} className="text-ugold/40" />
                    )}
                  </div>
                  <figcaption className="p-5">
                    <h3 className="font-heading text-lg font-extrabold text-ugreenm">{e.title}</h3>
                    <p className="mt-1.5 text-[14px] text-[#3d4a44] leading-relaxed">{e.text}</p>
                  </figcaption>
                </figure>
              ))}
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  )
}
