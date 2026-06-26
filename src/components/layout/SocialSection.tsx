import type { ClubInfo } from '@/data/club'

/* Sosyal medya SVG ikonları */
const Icons = {
  instagram: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" /><line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  ),
  twitter: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" /></svg>
  ),
  youtube: (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#c4302b" /></svg>
  ),
  facebook: (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="currentColor"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" /></svg>
  ),
  tiktok: (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.78 1.52V6.76a4.85 4.85 0 0 1-1.01-.07z" /></svg>
  ),
}

/** URL'den @kullanıcıadı çıkar */
function handle(url: string): string {
  if (!url || url === '#') return ''
  try {
    const seg = new URL(url).pathname.split('/').filter(Boolean).pop() ?? ''
    return seg ? `@${seg.replace(/^@/, '')}` : ''
  } catch {
    return ''
  }
}

export default function SocialSection({ club }: { club: ClubInfo }) {
  const cards = [
    { key: 'Instagram', href: club.social.instagram, icon: Icons.instagram, grad: 'from-[#f09433] via-[#dc2743] to-[#bc1888]', glow: 'rgba(220,39,67,0.45)' },
    { key: 'X', href: club.social.twitter, icon: Icons.twitter, grad: 'from-[#2b2b2b] to-[#000]', glow: 'rgba(0,0,0,0.5)' },
    { key: 'YouTube', href: club.social.youtube, icon: Icons.youtube, grad: 'from-[#ff4747] to-[#c4302b]', glow: 'rgba(255,0,0,0.4)' },
    { key: 'Facebook', href: club.social.facebook, icon: Icons.facebook, grad: 'from-[#3b8bff] to-[#1877F2]', glow: 'rgba(24,119,242,0.45)' },
    { key: 'TikTok', href: club.social.tiktok, icon: Icons.tiktok, grad: 'from-[#2b2b2b] to-[#000]', glow: 'rgba(0,0,0,0.5)' },
  ].filter((c) => c.href && c.href !== '#')

  if (!cards.length) return null

  return (
    <section className="relative bg-[#f5f9f6] border-t border-[#ddeae2] py-16 md:py-20 overflow-hidden">
      <div className="mx-auto max-w-[1280px] px-4 sm:px-6 lg:px-8 text-center">
        <div className="inline-flex items-center gap-3 mb-3">
          <span className="block w-8 h-0.5 bg-ugold" />
          <p className="text-[11px] font-black tracking-[0.25em] uppercase text-ugreen">Bizi Takip Et</p>
          <span className="block w-8 h-0.5 bg-ugold" />
        </div>
        <h2 className="font-heading text-3xl md:text-4xl font-black text-ugreenm tracking-tight mb-12">Sosyal Medya Hesaplarımız</h2>

        <div className="flex flex-wrap items-stretch justify-center gap-4">
          {cards.map((c) => (
            <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer"
              className={`group relative flex items-center gap-4 w-full sm:w-[280px] rounded-2xl px-6 py-5 text-white bg-gradient-to-br ${c.grad} shadow-lg hover:-translate-y-1 transition-all duration-300 overflow-hidden`}
              style={{ boxShadow: `0 10px 30px -10px ${c.glow}` }}>
              {/* Üst parlama */}
              <span className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-white/10" />
              <span className="relative flex h-12 w-12 items-center justify-center rounded-xl bg-white/15 backdrop-blur-sm shrink-0 group-hover:scale-110 transition-transform">
                {c.icon}
              </span>
              <div className="relative text-left min-w-0">
                <p className="text-sm font-black leading-tight">{c.key}</p>
                <p className="text-[12px] font-semibold opacity-80 truncate">{handle(c.href) || 'Takip Et'}</p>
              </div>
              <svg className="relative ml-auto opacity-60 group-hover:opacity-100 group-hover:translate-x-1 transition-all shrink-0" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
            </a>
          ))}
        </div>

        {club.hashtag && (
          <p className="mt-10 text-2xl md:text-3xl font-black tracking-tight text-ugreen">
            {club.hashtag.startsWith('#') ? club.hashtag : `#${club.hashtag}`}
          </p>
        )}
      </div>
    </section>
  )
}
