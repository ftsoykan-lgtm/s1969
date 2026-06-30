import type { SitePage } from '@/lib/supabase/pages-server'
import { Dumbbell, HeartPulse, Trophy, Home, Sparkles } from 'lucide-react'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Feature { title: string; text: string }
interface Data { intro?: string; features?: Feature[] }

const ICONS = [Trophy, Dumbbell, HeartPulse, Home, Sparkles]

export default function FacilityPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const features = d.features ?? []

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {features.length > 0 && (
          <section className="mt-12">
            <SectionTitle kicker="Tesis" title="Olanaklarımız" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {features.map((f, i) => {
                const Icon = ICONS[i % ICONS.length]
                return (
                  <div key={i} className="reveal card-premium p-6 flex items-start gap-4">
                    <span className="grid place-items-center w-12 h-12 rounded-xl bg-ugreen/10 text-ugreen shrink-0">
                      <Icon size={22} strokeWidth={2} />
                    </span>
                    <div>
                      <h3 className="font-heading text-lg font-extrabold text-ugreenm">{f.title}</h3>
                      <p className="mt-1 text-[14px] text-[#3d4a44] leading-relaxed">{f.text}</p>
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        )}
      </Container>
    </PageShell>
  )
}
