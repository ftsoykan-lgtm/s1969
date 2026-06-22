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
    <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-1.96C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 1.96A29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58A2.78 2.78 0 0 0 3.4 19.54C5.12 20 12 20 12 20s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z" /><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fff" /></svg>
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
    { key: 'instagram', href: club.social.instagram, icon: Icons.instagram, cls: 'bg-gradient-to-br from-[#f09433] via-[#dc2743] to-[#bc1888]' },
    { key: 'twitter', href: club.social.twitter, icon: Icons.twitter, cls: 'bg-black' },
    { key: 'youtube', href: club.social.youtube, icon: Icons.youtube, cls: 'bg-[#FF0000]' },
    { key: 'facebook', href: club.social.facebook, icon: Icons.facebook, cls: 'bg-[#1877F2]' },
    { key: 'tiktok', href: club.social.tiktok, icon: Icons.tiktok, cls: 'bg-black' },
  ].filter((c) => c.href && c.href !== '#')

  if (!cards.length) return null

  return (
    <section className="bg-white border-t border-[#ddeae2] py-14">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl md:text-3xl font-black text-[#092d18] tracking-tight mb-8 uppercase">Sosyal Medya Hesaplarımız</h2>

        <div className="flex flex-wrap items-center justify-center gap-3 sm:gap-4">
          {cards.map((c) => (
            <a key={c.key} href={c.href} target="_blank" rel="noopener noreferrer"
              className={`group relative flex flex-col items-center justify-center gap-3 w-[150px] sm:w-[200px] h-24 rounded-xl text-white shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 ${c.cls}`}>
              <span className="opacity-95 group-hover:scale-110 transition-transform">{c.icon}</span>
              <span className="text-[13px] font-semibold opacity-90">{handle(c.href) || c.key}</span>
            </a>
          ))}
        </div>

        {club.hashtag && (
          <p className="mt-8 text-xl md:text-2xl font-black tracking-tight text-[#092d18]">
            {club.hashtag.startsWith('#') ? club.hashtag : `#${club.hashtag}`}
          </p>
        )}
      </div>
    </section>
  )
}
