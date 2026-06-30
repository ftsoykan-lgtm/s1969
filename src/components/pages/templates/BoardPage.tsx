import type { SitePage } from '@/lib/supabase/pages-server'
import { PageShell, PageHero, Container, Intro, SectionTitle, pageData } from '../shared'

interface Member { name: string; role: string; photo?: string }
interface Data { intro?: string; members?: Member[] }

const initials = (name: string) =>
  name.split(' ').filter(Boolean).slice(0, 2).map((w) => w[0]).join('').toLocaleUpperCase('tr-TR') || 'ŞFK'

export default function BoardPage({ page }: { page: SitePage }) {
  const d = pageData<Data>(page)
  const members = d.members ?? []
  const [lead, ...rest] = members

  return (
    <PageShell>
      <PageHero page={page} />
      <Container className="py-12 md:py-16">
        <Intro text={d.intro} />

        {lead && (
          <div className="reveal mt-10 card-premium overflow-hidden flex flex-col sm:flex-row items-center gap-6 p-6 sm:p-8">
            <Avatar member={lead} size="lg" />
            <div className="text-center sm:text-left">
              <span className="inline-block text-[11px] font-extrabold tracking-[0.2em] uppercase text-ugold mb-1">{lead.role}</span>
              <h3 className="font-heading text-2xl md:text-3xl font-extrabold text-ugreenm">{lead.name}</h3>
            </div>
          </div>
        )}

        {rest.length > 0 && (
          <div className="mt-12">
            <SectionTitle kicker="Kadro" title="Yönetim Kurulu Üyeleri" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {rest.map((m, i) => (
                <div key={i} className="reveal card-premium p-5 flex flex-col items-center text-center">
                  <Avatar member={m} size="md" />
                  <h4 className="mt-3 font-heading text-base font-extrabold text-ugreenm leading-tight">{m.name}</h4>
                  <p className="mt-0.5 text-[12px] font-semibold text-utxt2">{m.role}</p>
                </div>
              ))}
            </div>
          </div>
        )}
      </Container>
    </PageShell>
  )
}

function Avatar({ member, size }: { member: Member; size: 'md' | 'lg' }) {
  const dim = size === 'lg' ? 'w-28 h-28 text-3xl' : 'w-20 h-20 text-xl'
  if (member.photo) {
    return (
      <div className={`${dim} rounded-2xl overflow-hidden ring-1 ring-[#ddeae2] shrink-0`}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={member.photo} alt={member.name} className="w-full h-full object-cover" />
      </div>
    )
  }
  return (
    <div className={`${dim} rounded-2xl shrink-0 grid place-items-center bg-gradient-to-br from-ugreen to-ugreenm text-ugold font-heading font-extrabold ring-1 ring-[#ddeae2]`}>
      {initials(member.name)}
    </div>
  )
}
