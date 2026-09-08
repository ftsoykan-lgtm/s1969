'use client'

import Link from 'next/link'
import Image from 'next/image'
import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import {
  Search, X, Loader2, CornerDownLeft, Newspaper, User, CalendarDays, FileText,
  Clock, Trash2, ArrowRight,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { TYPE_LABEL, highlightParts, type SearchHit, type SearchType } from '@/lib/search'

const TYPE_ICON: Record<SearchType, typeof Newspaper> = {
  haber: Newspaper, oyuncu: User, mac: CalendarDays, sayfa: FileText,
}
const TYPE_ORDER: SearchType[] = ['haber', 'oyuncu', 'mac', 'sayfa']

/** Boş ekranda önerilen aramalar — kulübün en çok arananları. */
const ONERILEN = ['Fikstür', 'Puan durumu', 'Kadro', 'Tarihçe', 'Stadyum', 'Sponsorluk']

const SON_ARAMA_ANAHTARI = 'ssk-son-aramalar'
const SON_ARAMA_SINIRI = 6

const focusRing = 'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ugold/85 focus-visible:ring-offset-2 focus-visible:ring-offset-ugreenm'
const surface = 'bg-white/[0.05] border border-white/10'

/** Eşleşen parçaları altın vurgu ile yazar. */
function Vurgulu({ text, q }: { text: string; q: string }) {
  const parts = highlightParts(text, q)
  return (
    <>
      {parts.map((p, i) =>
        p.hit
          ? <mark key={i} className="bg-ugold/15 text-ugold font-bold rounded-[3px] px-px">{p.text}</mark>
          : <span key={i}>{p.text}</span>,
      )}
    </>
  )
}

export default function SearchOverlay({ open, onClose }: { open: boolean; onClose: () => void }) {
  const [q, setQ] = useState('')
  const [hits, setHits] = useState<SearchHit[]>([])
  const [yukleniyor, setYukleniyor] = useState(false)
  const [hata, setHata] = useState<string | null>(null)
  const [aktif, setAktif] = useState(0)
  const [filtre, setFiltre] = useState<SearchType | 'tumu'>('tumu')
  const [sonAramalar, setSonAramalar] = useState<string[]>([])
  const inputRef = useRef<HTMLInputElement | null>(null)
  const listRef = useRef<HTMLDivElement | null>(null)
  const panelRef = useRef<HTMLDivElement | null>(null)

  const terim = q.trim()
  const sorguAktif = terim.length >= 2
  /* Sonuç modunda arama alanı ortadan yukarı taşınır (Spotlight deseni):
     boşken dikey ortada, sonuç gelince üstte + liste altını doldurur. */
  const sonucModu = sorguAktif && (yukleniyor || hits.length > 0 || hata !== null)

  const tumHits = useMemo(() => (sorguAktif ? hits : []), [sorguAktif, hits])
  const sayimlar = useMemo(() => {
    const s: Record<string, number> = { tumu: tumHits.length }
    for (const t of TYPE_ORDER) s[t] = tumHits.filter((h) => h.type === t).length
    return s
  }, [tumHits])
  const gorunenHits = useMemo(
    () => (filtre === 'tumu' ? tumHits : tumHits.filter((h) => h.type === filtre)),
    [tumHits, filtre],
  )
  const gorunenHata = sorguAktif ? hata : null
  const gorunenYukleniyor = sorguAktif && yukleniyor

  /* ── Son aramalar (yalnız bu tarayıcıda, localStorage) ─────────────
     Açılışta okunur, efekt gövdesinde değil zamanlayıcı içinde: hem
     zincirleme render uyarısını önler hem de SSR'da localStorage'a
     dokunmadığı için hydration uyuşmazlığı riski kalmaz. */
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => {
      try {
        const ham = localStorage.getItem(SON_ARAMA_ANAHTARI)
        if (!ham) return
        const liste = JSON.parse(ham)
        if (Array.isArray(liste)) {
          setSonAramalar(liste.filter((x) => typeof x === 'string').slice(0, SON_ARAMA_SINIRI))
        }
      } catch { /* gizli sekme / kapalı depolama / bozuk JSON — sessizce yoksay */ }
    }, 0)
    return () => clearTimeout(id)
  }, [open])

  const aramayiKaydet = useCallback((t: string) => {
    const temiz = t.trim()
    if (temiz.length < 2) return
    setSonAramalar((onceki) => {
      const yeni = [temiz, ...onceki.filter((x) => x.toLocaleLowerCase('tr-TR') !== temiz.toLocaleLowerCase('tr-TR'))]
        .slice(0, SON_ARAMA_SINIRI)
      try { localStorage.setItem(SON_ARAMA_ANAHTARI, JSON.stringify(yeni)) } catch { /* yoksay */ }
      return yeni
    })
  }, [])

  const gecmisiTemizle = useCallback(() => {
    setSonAramalar([])
    try { localStorage.removeItem(SON_ARAMA_ANAHTARI) } catch { /* yoksay */ }
  }, [])

  const sonucaGit = useCallback(() => {
    aramayiKaydet(terim)
    onClose()
  }, [aramayiKaydet, terim, onClose])

  /* ── Açılış / kapanış ────────────────────────────────────────────── */
  useEffect(() => {
    if (!open) return
    const id = setTimeout(() => inputRef.current?.focus(), 240)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (open) return
    const id = setTimeout(() => {
      setQ(''); setHits([]); setHata(null); setAktif(0); setFiltre('tumu')
    }, 320)
    return () => clearTimeout(id)
  }, [open])

  useEffect(() => {
    if (!open) return
    const onceki = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => { document.body.style.overflow = onceki }
  }, [open])

  /* Odak tuzağı — Tab ile panelin dışına çıkılmasın (aria-modal gereği) */
  useEffect(() => {
    if (!open) return
    const onTab = (e: KeyboardEvent) => {
      if (e.key !== 'Tab' || !panelRef.current) return
      const odaklanabilir = panelRef.current.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
      )
      if (odaklanabilir.length === 0) return
      const ilk = odaklanabilir[0]
      const son = odaklanabilir[odaklanabilir.length - 1]
      if (!e.shiftKey && document.activeElement === son) { e.preventDefault(); ilk.focus() }
      else if (e.shiftKey && document.activeElement === ilk) { e.preventDefault(); son.focus() }
    }
    window.addEventListener('keydown', onTab)
    return () => window.removeEventListener('keydown', onTab)
  }, [open])

  /* ── Sorgu → API (debounce + yarış koşulu koruması) ──────────────── */
  useEffect(() => {
    if (!open) return
    const t = q.trim()
    if (t.length < 2) return

    const ctrl = new AbortController()
    const id = setTimeout(async () => {
      setYukleniyor(true)
      try {
        const r = await fetch(`/api/arama?q=${encodeURIComponent(t)}&limit=40`, { signal: ctrl.signal })
        const data = await r.json()
        if (ctrl.signal.aborted) return
        setHits(Array.isArray(data.hits) ? data.hits : [])
        setHata(data.hata ?? null)
        setAktif(0); setFiltre('tumu')
      } catch (e) {
        if ((e as Error)?.name === 'AbortError') return
        setHata('Arama şu anda kullanılamıyor.')
        setHits([])
      } finally {
        if (!ctrl.signal.aborted) setYukleniyor(false)
      }
    }, 200)

    return () => { ctrl.abort(); clearTimeout(id) }
  }, [q, open])

  /* ── Klavye ──────────────────────────────────────────────────────── */
  const onKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'Escape') { e.preventDefault(); onClose(); return }
    if (gorunenHits.length === 0) return
    if (e.key === 'ArrowDown') { e.preventDefault(); setAktif((i) => (i + 1) % gorunenHits.length) }
    else if (e.key === 'ArrowUp') { e.preventDefault(); setAktif((i) => (i - 1 + gorunenHits.length) % gorunenHits.length) }
    else if (e.key === 'Enter') {
      const h = gorunenHits[aktif]
      if (h) { e.preventDefault(); aramayiKaydet(terim); onClose(); window.location.assign(h.href) }
    }
  }, [gorunenHits, aktif, onClose, aramayiKaydet, terim])

  useEffect(() => {
    listRef.current?.querySelector<HTMLElement>(`[data-idx="${aktif}"]`)
      ?.scrollIntoView({ block: 'nearest' })
  }, [aktif])

  const gruplu = TYPE_ORDER
    .map((t) => ({ tip: t, liste: gorunenHits.filter((h) => h.type === t) }))
    .filter((g) => g.liste.length > 0)
  const sira = new Map(gorunenHits.map((h, i) => [h, i]))

  const filtreler: { id: SearchType | 'tumu'; etiket: string }[] = [
    { id: 'tumu', etiket: 'Tümü' },
    ...TYPE_ORDER.map((t) => ({ id: t, etiket: TYPE_LABEL[t] })),
  ]

  return (
    <div
      role="dialog" aria-modal="true" aria-label="Sitede ara"
      className="lg:fixed fixed inset-0 z-[300]"
      onKeyDown={onKeyDown}
      style={{
        visibility: open ? 'visible' : 'hidden',
        pointerEvents: open ? 'auto' : 'none',
        transition: `visibility 0s linear ${open ? '0s' : '420ms'}`,
      }}>

      {/* ── Perde: koyu + bulanık, sayfa arkada erir ── */}
      <div aria-hidden onClick={onClose}
        className="absolute inset-0"
        style={{
          background: 'radial-gradient(120% 90% at 50% 0%, rgba(9,45,24,0.86), rgba(6,20,14,0.94) 70%)',
          backdropFilter: 'blur(14px) saturate(120%)',
          WebkitBackdropFilter: 'blur(14px) saturate(120%)',
          opacity: open ? 1 : 0,
          transition: 'opacity 380ms cubic-bezier(0.16, 1, 0.3, 1)',
        }} />

      {/* ── Panel: boşken dikey ORTADA, sonuç gelince yukarı yerleşir ── */}
      <div ref={panelRef}
        className={cn('absolute inset-0 flex flex-col px-4 sm:px-6',
          sonucModu ? 'justify-start pt-[max(1rem,env(safe-area-inset-top))] sm:pt-10' : 'justify-center')}
        style={{ transition: 'padding 520ms cubic-bezier(0.16, 1, 0.3, 1)' }}>

        <div className="mx-auto w-full max-w-[760px] flex flex-col min-h-0"
          style={{
            opacity: open ? 1 : 0,
            transform: open ? 'none' : 'translateY(18px) scale(0.97)',
            transition: 'opacity 320ms cubic-bezier(0.16, 1, 0.3, 1), transform 480ms cubic-bezier(0.16, 1, 0.3, 1)',
          }}>

          {/* ── Marka satırı (kurumsal kimlik) ── */}
          <div className={cn('flex items-center justify-between gap-3 mb-4 transition-all duration-500',
            sonucModu ? 'opacity-0 h-0 mb-0 overflow-hidden' : 'opacity-100')}>
            <div className="flex items-center gap-2.5">
              <span aria-hidden className="w-5 h-px bg-ugold/60" />
              <span className="text-[10px] font-extrabold tracking-[0.28em] uppercase text-ugold">
                Şanlıurfaspor · Site İçi Arama
              </span>
            </div>
          </div>

          {/* ── Arama alanı ── */}
          <div className="flex items-center gap-2.5 sm:gap-3 shrink-0">
            <div className="relative flex-1">
              <Search size={19} aria-hidden
                className="absolute left-4 sm:left-5 top-1/2 -translate-y-1/2 text-ugold pointer-events-none" />
              <input
                ref={inputRef} type="search" value={q} onChange={(e) => setQ(e.target.value)}
                /* 375px'te uzun placeholder kesiliyordu (ölçüldü: 194px metin,
                   185px alan). Bu metin en dar ekranda da tam sığar; bağlamı
                   üstteki "SİTE İÇİ ARAMA" marka satırı zaten veriyor. */
                placeholder="Haber, oyuncu, maç…"
                aria-label="Arama terimi" autoComplete="off" spellCheck={false}
                aria-controls="arama-sonuclari"
                className={cn('w-full h-14 sm:h-[62px] rounded-full pl-[46px] sm:pl-[52px] pr-11 sm:pr-12',
                  'text-[15.5px] sm:text-[18px] font-medium text-white placeholder-white/50',
                  'transition-colors focus:outline-none focus:border-ugold/60', surface)}
                style={{ boxShadow: '0 18px 44px -22px rgba(0,0,0,0.7)' }} />
              {gorunenYukleniyor && (
                <Loader2 size={19} aria-hidden
                  className="absolute right-5 top-1/2 -translate-y-1/2 animate-spin text-ugold" />
              )}
            </div>
            <button onClick={onClose} aria-label="Aramayı kapat"
              className={cn('h-14 w-14 sm:h-[62px] sm:w-[62px] shrink-0 flex items-center justify-center rounded-full',
                'text-white hover:text-ugreenm hover:bg-ugold transition-all duration-300 active:scale-[0.97]',
                surface, focusRing)}>
              <X size={22} />
            </button>
          </div>

          {/* ── Durum + kategori filtreleri ── */}
          <div className="shrink-0 mt-3.5 flex flex-wrap items-center gap-x-2.5 gap-y-2 min-h-[34px] px-1">
            <p aria-live="polite" className="text-[12.5px] text-white/80">
              {gorunenHata ? gorunenHata
                : terim.length === 0 ? 'Aramak için yazmaya başlayın.'
                : terim.length < 2 ? 'En az 2 karakter girin.'
                : gorunenYukleniyor ? 'Aranıyor...'
                : tumHits.length === 0 ? `“${terim}” için sonuç bulunamadı.`
                : `${tumHits.length} sonuç`}
            </p>

            {tumHits.length > 0 && !gorunenYukleniyor && (
              <div className="flex flex-wrap items-center gap-1.5">
                {filtreler.filter((f) => f.id === 'tumu' || sayimlar[f.id] > 0).map((f) => (
                  <button key={f.id} onClick={() => { setFiltre(f.id); setAktif(0) }}
                    aria-pressed={filtre === f.id}
                    className={cn('inline-flex items-center gap-1.5 h-11 sm:h-8 rounded-full px-3.5 sm:px-3 text-[11.5px] font-bold tracking-[0.04em] uppercase transition-all duration-300',
                      filtre === f.id
                        ? 'bg-ugold text-ugreenm'
                        : cn('text-white/80 hover:text-white', surface),
                      focusRing)}>
                    {f.etiket}
                    <span className={cn('text-[10.5px] font-extrabold',
                      filtre === f.id ? 'text-ugreenm/70' : 'text-white/50')}>
                      {sayimlar[f.id]}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Sonuçlar / boş ekran ── */}
          <div ref={listRef} id="arama-sonuclari"
            className={cn('min-h-0 mt-3', sonucModu ? 'flex-1 overflow-y-auto overscroll-contain' : '')}>

            {/* Boş ekran: son aramalar + öneriler */}
            {!sorguAktif && (
              <div className="pb-6 space-y-7">
                {sonAramalar.length > 0 && (
                  <section>
                    <div className="flex items-center gap-2 mb-3">
                      <Clock size={13} aria-hidden className="text-ugold" />
                      <h2 className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold">Son Aramalar</h2>
                      <button onClick={gecmisiTemizle}
                        className={cn('ml-auto inline-flex items-center gap-1.5 rounded-full px-3 h-11 sm:h-8 text-[11px] font-semibold text-white/70 hover:text-ugold transition-colors', focusRing)}>
                        <Trash2 size={12} /> Temizle
                      </button>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {sonAramalar.map((s) => (
                        <button key={s} onClick={() => { setQ(s); inputRef.current?.focus() }}
                          className={cn('inline-flex h-11 items-center gap-2 rounded-full px-4 text-[13px] font-semibold text-white/90 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surface, focusRing)}>
                          <Clock size={13} aria-hidden /> {s}
                        </button>
                      ))}
                    </div>
                  </section>
                )}

                <section>
                  <div className="flex items-center gap-2 mb-3">
                    <span aria-hidden className="w-4 h-px bg-ugold/60" />
                    <h2 className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold">Popüler Aramalar</h2>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {ONERILEN.map((s) => (
                      <button key={s} onClick={() => { setQ(s); inputRef.current?.focus() }}
                        className={cn('inline-flex h-11 items-center rounded-full px-4 text-[13px] font-semibold text-white/90 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surface, focusRing)}>
                        {s}
                      </button>
                    ))}
                  </div>
                </section>
              </div>
            )}

            {/* Sonuç yok — yönlendirici öneriler */}
            {sorguAktif && !gorunenYukleniyor && tumHits.length === 0 && !gorunenHata && (
              <div className={cn('rounded-2xl p-6 text-center', surface)}>
                <p className="text-[14px] text-white/80 mb-4">
                  Farklı bir kelime deneyin ya da doğrudan bir bölüme gidin.
                </p>
                <div className="flex flex-wrap justify-center gap-2">
                  {ONERILEN.slice(0, 4).map((s) => (
                    <button key={s} onClick={() => { setQ(s); inputRef.current?.focus() }}
                      className={cn('inline-flex h-11 sm:h-9 items-center rounded-full px-4 sm:px-3.5 text-[12.5px] font-semibold text-white/90 hover:text-ugreenm hover:bg-ugold transition-all duration-300', surface, focusRing)}>
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {gruplu.map(({ tip, liste }) => {
              const Icon = TYPE_ICON[tip]
              return (
                <section key={tip} className="mb-7 last:mb-0">
                  <div className="flex items-center gap-2 mb-2.5">
                    <span aria-hidden className="w-4 h-px bg-ugold/60" />
                    <h2 className="text-[10px] font-extrabold tracking-[0.25em] uppercase text-ugold">
                      {TYPE_LABEL[tip]}
                    </h2>
                    <span className="text-[11px] font-bold text-white/60">{liste.length}</span>
                  </div>
                  <ul className="flex flex-col gap-1.5">
                    {liste.map((h) => {
                      const idx = sira.get(h) ?? -1
                      return (
                        <li key={`${h.type}-${h.href}`}>
                          <Link href={h.href} onClick={sonucaGit} data-idx={idx}
                            onMouseEnter={() => setAktif(idx)}
                            aria-current={idx === aktif ? 'true' : undefined}
                            className={cn('group flex items-center gap-3.5 rounded-2xl p-2.5 pr-4 transition-colors duration-200',
                              idx === aktif ? 'bg-white/[0.10]' : 'hover:bg-white/[0.06]', focusRing)}>
                            {h.imageUrl ? (
                              <span className={cn('relative h-[52px] w-[52px] shrink-0 overflow-hidden rounded-xl', surface)}>
                                <Image src={h.imageUrl} alt="" fill sizes="52px" className="object-cover" />
                              </span>
                            ) : (
                              <span className={cn('h-[52px] w-[52px] shrink-0 flex items-center justify-center rounded-xl text-ugold', surface)}>
                                <Icon size={20} />
                              </span>
                            )}

                            <span className="min-w-0 flex-1">
                              <span className="block truncate text-[15px] font-bold text-white">
                                <Vurgulu text={h.title} q={terim} />
                              </span>
                              {(h.subtitle || h.meta) && (
                                <span className="mt-1 block truncate text-[12.5px] text-white/80">
                                  {h.meta && <span className="font-semibold text-ugold/90">{h.meta}</span>}
                                  {h.meta && h.subtitle && <span className="text-white/40"> · </span>}
                                  {h.subtitle && <Vurgulu text={h.subtitle} q={terim} />}
                                </span>
                              )}
                            </span>

                            <CornerDownLeft size={15} aria-hidden
                              className={cn('hidden sm:block shrink-0 transition-opacity duration-200',
                                idx === aktif ? 'text-ugold opacity-100' : 'text-white/40 opacity-0 group-hover:opacity-100')} />
                            <ArrowRight size={16} aria-hidden
                              className="sm:hidden shrink-0 text-white/40" />
                          </Link>
                        </li>
                      )
                    })}
                  </ul>
                </section>
              )
            })}
          </div>

          {/* ── Klavye ipucu — yalnız işaretçili cihazlarda ── */}
          <div className="hidden sm:flex shrink-0 items-center gap-5 pt-4 mt-1 border-t border-white/10 text-[11.5px] text-white/70">
            <span className="flex items-center gap-1.5">
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>↑</kbd>
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>↓</kbd>
              gezin
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>Enter</kbd> aç
            </span>
            <span className="flex items-center gap-1.5">
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>Esc</kbd> kapat
            </span>
            <span className="ml-auto flex items-center gap-1.5">
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>Ctrl</kbd>
              <kbd className={cn('rounded-md px-1.5 py-0.5 font-sans text-[11px]', surface)}>K</kbd>
              her yerden aç
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
