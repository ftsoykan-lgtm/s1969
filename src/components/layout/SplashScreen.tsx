'use client'

import { useState, useEffect } from 'react'
import type { ClubInfo } from '@/data/club'
import ClubLogo from '@/components/ui/ClubLogo'

export default function SplashScreen({ club }: { club: ClubInfo }) {
  const [show, setShow] = useState(false)
  const [fade, setFade] = useState(false)

  useEffect(() => {
    // Oturumda bir kez göster
    if (typeof window === 'undefined') return
    if (sessionStorage.getItem('sfk-splash')) return
    sessionStorage.setItem('sfk-splash', '1')
    setShow(true)
    const t1 = setTimeout(() => setFade(true), 1100)
    const t2 = setTimeout(() => setShow(false), 1600)
    return () => { clearTimeout(t1); clearTimeout(t2) }
  }, [])

  if (!show) return null

  const hasLogo = club.logoUrl && !club.logoUrl.includes('placehold.co')

  return (
    <div
      className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-ugreend transition-opacity duration-500 ${
        fade ? 'opacity-0' : 'opacity-100'
      }`}
    >
      {/* Üst 3 renk şeridi */}
      <div className="absolute top-0 left-0 right-0 flex h-1.5">
        <span className="flex-1 bg-ugreen" />
        <span className="flex-1 bg-ugold" />
        <span className="flex-1 bg-white/80" />
      </div>

      <div className="flex flex-col items-center gap-5 animate-[sfkpop_0.6s_ease-out]">
        {hasLogo ? (
          <ClubLogo src={club.logoUrl} alt={club.name} size={112} priority
            className="object-contain drop-shadow-2xl" />
        ) : (
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-ugold text-ugreend font-extrabold text-3xl shadow-2xl">
            {club.shortCode}
          </div>
        )}
        <div className="text-center">
          <p className="text-white font-extrabold text-2xl tracking-wide uppercase">{club.name}</p>
        </div>

        {/* Yükleniyor çubuğu */}
        <div className="w-32 h-1 rounded-full bg-white/15 overflow-hidden mt-2">
          <div className="h-full bg-ugold animate-[sfkload_1.3s_ease-in-out]" />
        </div>
      </div>

      <style jsx global>{`
        @keyframes sfkpop {
          0% { transform: scale(0.85); opacity: 0; }
          100% { transform: scale(1); opacity: 1; }
        }
        @keyframes sfkload {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  )
}
