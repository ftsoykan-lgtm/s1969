import Link from 'next/link'

/* Gerçek beyaz-siyah pentagonlu futbol topu */
function SoccerBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.5" fill="#ffffff" stroke="#0c2e22" strokeWidth="1.4" />
      {/* merkez pentagon */}
      <polygon points="16,9 21.7,13.2 19.5,19.9 12.5,19.9 10.3,13.2" fill="#0c2e22" />
      {/* kenar yamaları (kısmi pentagonlar) */}
      <path fill="#0c2e22" d="M16 1.6 l3.2 1.0 -1.1 3.4 -4.2 0 -1.1 -3.4 z" />
      <path fill="#0c2e22" d="M30.0 11.5 l0.4 3.3 -3.3 1.0 -2.5 -2.7 2.0 -2.8 z" />
      <path fill="#0c2e22" d="M24.6 28.2 l-3.0 1.4 -2.1 -2.6 1.6 -3.1 3.3 0.4 z" />
      <path fill="#0c2e22" d="M7.4 28.2 l-1.5 -2.9 2.4 -2.3 3.1 1.0 -0.3 3.3 z" />
      <path fill="#0c2e22" d="M2.0 11.5 l2.9 -1.7 2.4 2.3 -1.2 3.1 -3.3 -0.2 z" />
      {/* dikişler (pentagon köşelerinden kenara) */}
      <g stroke="#0c2e22" strokeWidth="1.15" strokeLinecap="round" fill="none">
        <path d="M16 9 V4.2" />
        <path d="M21.7 13.2 L26.4 11.6" />
        <path d="M19.5 19.9 L22.6 24.3" />
        <path d="M12.5 19.9 L9.4 24.3" />
        <path d="M10.3 13.2 L5.6 11.6" />
      </g>
    </svg>
  )
}

/* Kale + file */
function GoalNet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 26" className={className} fill="none" aria-hidden>
      {/* file örgüsü */}
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.55">
        <path d="M7 4V22M13.5 4V22M20 4V22" />
        <path d="M3 9.5H25M3 15H25M3 20.5H25" />
        <path d="M3 5 L10 22 M14 5 L21 22 M24 6 L26 12" opacity="0.5" />
      </g>
      {/* kale çerçevesi */}
      <path d="M3 4 H25 V22 H3 Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

interface MatchCenterCtaProps {
  href?: string
  label?: string
  className?: string
}

/**
 * Premium "Maç Merkezine Git" CTA'sı — hover'da gol sahnesi:
 * top dönerek fırlar → kaleye girer → file titrer + gol parlaması + hız çizgileri.
 * Saf CSS hover (server component) — SSR güvenli, reduced-motion'da animasyonsuz.
 */
export default function MatchCenterCta({
  href = '/mac-merkezi',
  label = 'Maç Merkezine Git',
  className = '',
}: MatchCenterCtaProps) {
  return (
    <Link href={href}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full
        bg-gradient-to-r from-ugreen to-ugreend text-white font-extrabold text-[15px] tracking-wide
        pl-6 pr-5 py-3.5 ring-1 ring-ugold/30
        shadow-[0_10px_28px_-12px_rgba(12,46,34,0.6)]
        transition-all duration-300 hover:-translate-y-0.5 hover:ring-ugold/70
        hover:shadow-[0_18px_42px_-14px_rgba(12,46,34,0.78)]
        motion-reduce:transition-none motion-reduce:hover:translate-y-0 ${className}`}>

      {/* sheen */}
      <span aria-hidden
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
          from-transparent via-white/25 to-transparent transition-transform duration-700 ease-out
          group-hover:translate-x-full motion-reduce:hidden" />

      <span className="relative">{label}</span>

      {/* gol sahnesi: sert vuruş → GOL! (top kaleden küçük) */}
      <span className="relative h-8 w-[66px] shrink-0
        group-hover:[animation:ctaShake_.4s_ease-out_.4s] motion-reduce:group-hover:[animation:none]" aria-hidden>

        {/* hız çizgileri */}
        <span className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-[3px]
          opacity-0 transition-opacity duration-150 group-hover:opacity-70 motion-reduce:hidden">
          <span className="block h-[1.5px] w-3 rounded-full bg-ugold/80" />
          <span className="block h-[1.5px] w-4 rounded-full bg-ugold/60" />
          <span className="block h-[1.5px] w-2.5 rounded-full bg-ugold/80" />
        </span>

        {/* gol parlaması */}
        <span className="pointer-events-none absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full
          bg-[radial-gradient(circle,var(--c-ugold)_0%,transparent_70%)] opacity-0
          group-hover:[animation:goalFlash_.55s_ease-out_.4s] motion-reduce:hidden" />

        {/* kale (büyük) */}
        <span className="absolute right-0 top-1/2 -translate-y-1/2">
          <span className="block text-ugold/90 origin-left group-hover:[animation:netShake_.45s_ease-out_.4s_both]
            motion-reduce:group-hover:[animation:none]">
            <GoalNet className="h-[30px] w-[33px]" />
          </span>
        </span>

        {/* top (küçük) */}
        <SoccerBall className="absolute left-1 top-1/2 h-[16px] w-[16px] -translate-y-1/2 drop-shadow
          transition-transform duration-[450ms] ease-out
          group-hover:translate-x-[40px] group-hover:rotate-[600deg]
          motion-reduce:transition-none motion-reduce:group-hover:translate-x-0 motion-reduce:group-hover:rotate-0" />

        {/* GOL! rozeti — sarı/altın yazı (uyumlu) */}
        <span className="pointer-events-none absolute right-[14px] top-1/2 z-10 -translate-x-1/2 -translate-y-1/2
          rounded-full bg-ugreendd/90 px-1.5 py-[3px] text-[9px] font-extrabold tracking-wide text-ugold
          opacity-0 shadow-sm ring-1 ring-ugold/40
          group-hover:[animation:golPop_.4s_ease-out_.42s_both] motion-reduce:group-hover:opacity-100">
          GOL!
        </span>
      </span>
    </Link>
  )
}
