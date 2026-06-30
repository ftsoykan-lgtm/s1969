import type { SitePage } from '@/lib/supabase/pages-server'
import { MapPin } from 'lucide-react'
import { clubInfo } from '@/data/club'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Stat { label: string; value: string }
interface Feature { title: string; text: string }
interface Data { intro?: string; capacity?: string; location?: string; stats?: Stat[]; features?: Feature[] }

export default function StadiumPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const stats = d.stats ?? []
  const features = d.features ?? []

  return (
    <PageShell>
      <PageHero page={page}>
        {d.capacity && (
          <div className="reveal mt-6 flex items-end gap-3">
            <span className="font-heading text-5xl md:text-7xl font-extrabold text-ugold leading-none">{d.capacity}</span>
            <span className="text-white/60 text-sm md:text-base font-semibold pb-1.5">kişilik kapasite</span>
          </div>
        )}
        {d.location && (
          <p className="reveal mt-3 inline-flex items-center gap-1.5 text-white/55 text-sm">
            <MapPin size={14} className="text-ugold" /> {d.location}
          </p>
        )}
      </PageHero>

      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {/* Künye bandı */}
        {stats.length > 0 && (
          <div className="reveal mt-10 grid grid-cols-2 md:grid-cols-4 gap-3">
            {stats.map((s, i) => (
              <div key={i} className="rounded-2xl bg-gradient-to-br from-ugreenm to-ugreen text-white p-5 text-center">
                <p className="font-heading text-2xl md:text-3xl font-extrabold text-ugold leading-none">{s.value}</p>
                <p className="mt-1.5 text-[11px] font-bold uppercase tracking-wide text-white/60">{s.label}</p>
              </div>
            ))}
          </div>
        )}

        {/* Özellikler */}
        {features.length > 0 && (
          <section className="mt-14">
            <SectionTitle kicker="Stadyum" title="Öne Çıkanlar" />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              {features.map((f, i) => (
                <div key={i} className="reveal card-premium p-6">
                  <h3 className="font-heading text-lg font-extrabold text-ugreenm">{f.title}</h3>
                  <p className="mt-1.5 text-[14px] text-[#3d4a44] leading-relaxed">{f.text}</p>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* Harita */}
        {clubInfo.mapEmbedUrl && (
          <section className="mt-14">
            <SectionTitle kicker="Konum" title="Stadyuma Ulaşım" />
            <div className="reveal rounded-3xl overflow-hidden border border-[#ddeae2] shadow-sm aspect-[16/9]">
              <iframe src={clubInfo.mapEmbedUrl} className="w-full h-full" loading="lazy" referrerPolicy="no-referrer-when-downgrade" title="Stadyum konumu" />
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  )
}
