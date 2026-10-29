'use client'

import { useState } from 'react'
import { Check, Link2 } from 'lucide-react'

const COPIED_RESET_MS = 2000

/* Marka ikonları (lucide marka ikonu sağlamıyor) — tek renk, currentColor */
const ICONS = {
  x: <path d="M17.75 3h3.07l-6.7 7.66L22 21h-6.17l-4.83-6.32L5.47 21H2.4l7.17-8.2L2 3h6.33l4.37 5.78L17.75 3Zm-1.08 16.2h1.7L7.4 4.72H5.57L16.67 19.2Z" />,
  facebook: <path d="M13.5 21v-7.5h2.53l.38-2.94H13.5V8.69c0-.85.24-1.43 1.46-1.43h1.56V4.63a20.9 20.9 0 0 0-2.27-.12c-2.25 0-3.79 1.37-3.79 3.9v2.15H7.92v2.94h2.54V21h3.04Z" />,
  whatsapp: <path d="M12.04 2a9.9 9.9 0 0 0-8.5 14.98L2 22l5.16-1.5A9.9 9.9 0 1 0 12.04 2Zm0 18.1a8.2 8.2 0 0 1-4.18-1.15l-.3-.18-3.06.89.9-2.98-.2-.31a8.21 8.21 0 1 1 6.84 3.73Zm4.5-6.14c-.25-.12-1.46-.72-1.69-.8-.22-.08-.39-.12-.55.12-.17.25-.64.8-.78.97-.14.16-.29.18-.53.06a6.7 6.7 0 0 1-3.32-2.9c-.25-.43.25-.4.71-1.33.08-.16.04-.3-.02-.43l-.75-1.8c-.2-.48-.4-.41-.55-.42h-.47a.9.9 0 0 0-.66.31 2.76 2.76 0 0 0-.86 2.05 4.8 4.8 0 0 0 1 2.54 10.96 10.96 0 0 0 4.2 3.71c1.56.67 2.17.73 2.95.61.47-.07 1.46-.6 1.66-1.17.21-.58.21-1.07.15-1.17-.06-.1-.23-.17-.47-.29Z" />,
}

function ShareLink({ href, label, icon }: { href: string; label: string; icon: keyof typeof ICONS }) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" aria-label={`${label} ile paylaş`}
      className="flex h-11 flex-1 items-center justify-center rounded-xl border border-[#ddeae2] bg-white text-ugreenm transition-colors hover:border-ugreen hover:bg-ugreen hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden>{ICONS[icon]}</svg>
    </a>
  )
}

/* "Bu haberi paylaş" — X / Facebook / WhatsApp + bağlantıyı kopyala. */
export default function ShareBox({ url, title }: { url: string; title: string }) {
  const [copied, setCopied] = useState(false)
  const u = encodeURIComponent(url)
  const t = encodeURIComponent(title)

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), COPIED_RESET_MS)
    } catch {
      // Pano erişimi yoksa (izin/HTTP) kullanıcı adres çubuğundan kopyalayabilir
      window.prompt('Bağlantıyı kopyalayın:', url)
    }
  }

  return (
    <div className="flex flex-col gap-4 rounded-2xl bg-[#f5f9f6] p-5 ring-1 ring-[#e3ede7] sm:flex-row sm:items-center">
      <span className="text-[12px] font-extrabold uppercase tracking-[0.16em] text-ugreenm sm:w-36">Bu haberi paylaş</span>
      <div className="flex flex-1 flex-wrap gap-2">
        <ShareLink href={`https://twitter.com/intent/tweet?url=${u}&text=${t}`} label="X" icon="x" />
        <ShareLink href={`https://www.facebook.com/sharer/sharer.php?u=${u}`} label="Facebook" icon="facebook" />
        <ShareLink href={`https://wa.me/?text=${t}%20${u}`} label="WhatsApp" icon="whatsapp" />
        <button type="button" onClick={copy}
          className={`flex h-11 basis-full items-center justify-center gap-2 rounded-xl px-4 text-[12px] font-extrabold uppercase tracking-wide transition-colors sm:basis-auto sm:flex-[2] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold ${copied ? 'bg-ugreen text-white' : 'bg-ugold text-ugreend hover:bg-ugoldh'}`}>
          {copied ? <Check size={15} aria-hidden /> : <Link2 size={15} aria-hidden />}
          <span aria-live="polite">{copied ? 'Kopyalandı' : 'Bağlantıyı kopyala'}</span>
        </button>
      </div>
    </div>
  )
}
