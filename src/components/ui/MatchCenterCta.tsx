'use client'

import { useEffect, useRef } from 'react'
import Link from 'next/link'

/* Gerçek beyaz-siyah pentagonlu futbol topu */
function SoccerBall({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <circle cx="16" cy="16" r="14.5" fill="#ffffff" stroke="#0c2e22" strokeWidth="1.4" />
      <polygon points="16,9 21.7,13.2 19.5,19.9 12.5,19.9 10.3,13.2" fill="#0c2e22" />
      <path fill="#0c2e22" d="M16 1.6 l3.2 1.0 -1.1 3.4 -4.2 0 -1.1 -3.4 z" />
      <path fill="#0c2e22" d="M30.0 11.5 l0.4 3.3 -3.3 1.0 -2.5 -2.7 2.0 -2.8 z" />
      <path fill="#0c2e22" d="M24.6 28.2 l-3.0 1.4 -2.1 -2.6 1.6 -3.1 3.3 0.4 z" />
      <path fill="#0c2e22" d="M7.4 28.2 l-1.5 -2.9 2.4 -2.3 3.1 1.0 -0.3 3.3 z" />
      <path fill="#0c2e22" d="M2.0 11.5 l2.9 -1.7 2.4 2.3 -1.2 3.1 -3.3 -0.2 z" />
      <g stroke="#0c2e22" strokeWidth="1.15" strokeLinecap="round" fill="none">
        <path d="M16 9 V4.2" /><path d="M21.7 13.2 L26.4 11.6" /><path d="M19.5 19.9 L22.6 24.3" />
        <path d="M12.5 19.9 L9.4 24.3" /><path d="M10.3 13.2 L5.6 11.6" />
      </g>
    </svg>
  )
}

/* Kale + file */
function GoalNet({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 28 26" className={className} fill="none" aria-hidden>
      <g stroke="currentColor" strokeWidth="0.7" opacity="0.55">
        <path d="M7 4V22M13.5 4V22M20 4V22" />
        <path d="M3 9.5H25M3 15H25M3 20.5H25" />
        <path d="M3 5 L10 22 M14 5 L21 22 M24 6 L26 12" opacity="0.5" />
      </g>
      <path d="M3 4 H25 V22 H3 Z" stroke="currentColor" strokeWidth="1.7" strokeLinejoin="round" />
    </svg>
  )
}

interface MatchCenterCtaProps {
  href?: string
  label?: string
  className?: string
}

const YELLOW = 'linear-gradient(155deg,#ffdb4d,#efb600)'
const RED = 'linear-gradient(155deg,#e2564f,#c0142a)'
const START_MIN = 60
const FULL_MIN = 90
const MIN_TICK_MS = 1200
const GOAL_DUR = 1950
const CARD_DUR = 1500
const EVENT_HOLD = 700 // olay dakikası ekranda kısa süre görünsün, sonra animasyon (TICK'ten küçük)
// Maç olayları — dakikası geldiğinde tek tek tetiklenir (golden hemen sonra değil)
const EVENTS: { m: number; type: 'goal' | 'yellow' | 'red' }[] = [
  { m: 63, type: 'goal' },
  { m: 71, type: 'yellow' },
  { m: 79, type: 'red' },
]

/* Tek kart flip evresi → {rotY, ty, op, shine} */
function cardPhase(local: number, dur: number, ease: (x: number) => number) {
  const IN = 430, OUT = 360, HOLD = dur - IN - OUT
  if (local < IN) { const k = ease(local / IN); return { rotY: 92 * (1 - k), ty: 10 * (1 - k), op: k, shine: -1 } }
  if (local < IN + HOLD) { const h = (local - IN) / HOLD; return { rotY: Math.sin(h * Math.PI * 2) * 3.5, ty: 0, op: 1, shine: h } }
  const k = ease((local - IN - HOLD) / OUT); return { rotY: -95 * k, ty: -5 * k, op: 1 - k, shine: -1 }
}

/**
 * Premium "Maç Merkezine Git" CTA'sı — canlı maç simülasyonu (JS sürücülü):
 * Saat 60'dan işler; dakikası gelince olaylar tek tek oynar:
 *   63' Gol (GOOOOOL!) · 71' Sarı kart · 79' Kırmızı kart · 90' → başa sar.
 * Olaylar arasında saat işlemeye devam eder (kartlar golün hemen ardından gelmez).
 * Hover'da gol tekrar oynar. prefers-reduced-motion'dan etkilenmez. Yalnız görünürken çalışır.
 */
export default function MatchCenterCta({
  href = '/mac-merkezi',
  label = 'Maç Merkezine Git',
  className = '',
}: MatchCenterCtaProps) {
  const rootRef = useRef<HTMLAnchorElement>(null)
  const stageRef = useRef<HTMLSpanElement>(null)
  const sheenRef = useRef<HTMLSpanElement>(null)
  const goalGroupRef = useRef<HTMLSpanElement>(null)
  const ballRef = useRef<HTMLSpanElement>(null)
  const goalRef = useRef<HTMLSpanElement>(null)
  const golRef = useRef<HTMLSpanElement>(null)
  const flashRef = useRef<HTMLSpanElement>(null)
  const speedRef = useRef<HTMLSpanElement>(null)
  const cardWrapRef = useRef<HTMLSpanElement>(null)
  const cardFaceRef = useRef<HTMLSpanElement>(null)
  const cardShineRef = useRef<HTMLSpanElement>(null)
  const clockRef = useRef<HTMLSpanElement>(null)
  const dotRef = useRef<HTMLSpanElement>(null)
  const minRef = useRef<HTMLSpanElement>(null)

  useEffect(() => {
    const root = rootRef.current, stage = stageRef.current, sheen = sheenRef.current
    const gg = goalGroupRef.current, ball = ballRef.current, goal = goalRef.current
    const gol = golRef.current, flash = flashRef.current, speed = speedRef.current
    const cardWrap = cardWrapRef.current, card = cardFaceRef.current, shine = cardShineRef.current
    const clock = clockRef.current, dot = dotRef.current, min = minRef.current
    if (!root || !stage || !sheen || !gg || !ball || !goal || !gol || !flash || !speed || !cardWrap || !card || !shine || !clock || !dot || !min) return

    const cl = (x: number) => (x < 0 ? 0 : x > 1 ? 1 : x)
    const ease = (x: number) => 1 - Math.pow(1 - x, 3)

    const enterIdle = () => {
      mode = 'idle'; scene = null
      gg.style.opacity = '0'; cardWrap.style.opacity = '0'; sheen.style.opacity = '0'
      ball.style.transform = 'translate(0,-50%) rotate(0deg)'; ball.style.opacity = '1'
      gol.style.opacity = '0'; flash.style.opacity = '0'; speed.style.opacity = '0'
      goal.style.transform = 'translateY(-50%) scaleX(1)'
      stage.style.transform = 'translateX(0)'
    }

    const renderClock = (now: number, minute: number) => {
      clock.style.opacity = '1'
      const p = 0.5 + 0.5 * Math.sin(now / 520)
      dot.style.transform = `scale(${1 + p * 0.22})`
      dot.style.opacity = String(0.5 + p * 0.5)
      const txt = minute + "'"
      if (min.textContent !== txt) min.textContent = txt
    }

    const renderGoal = (el: number) => {
      gg.style.opacity = '1'; cardWrap.style.opacity = '0'; clock.style.opacity = '0'
      const sw = cl((el - 20) / 240)
      sheen.style.opacity = el < 280 ? '1' : '0'
      sheen.style.transform = `translateX(${-100 + sw * 200}%)`
      const k = cl((el - 200) / 600), e = ease(k)
      ball.style.transform = el > 200 ? `translate(${e * 42}px,-50%) rotate(${e * 600}deg)` : 'translate(0,-50%) rotate(0deg)'
      ball.style.opacity = '1'
      speed.style.opacity = el > 200 && el < 560 ? '0.7' : '0'
      let go: number, gsc: number
      if (el < 720) { go = 0; gsc = 0.6 }
      else if (el < 980) { const a = ease(cl((el - 720) / 260)); go = a; gsc = 0.6 + 0.45 * a }
      else if (el < 1550) { go = 1; gsc = 1 + Math.sin((el - 980) / 570 * Math.PI * 2) * 0.03 }
      else { const a = cl((el - 1550) / 400); go = 1 - a; gsc = 1 + 0.12 * a }
      gol.style.opacity = String(go); gol.style.transform = `translate(-50%,-50%) scale(${gsc})`
      const fp = cl((el - 720) / 300)
      flash.style.opacity = el > 720 && el < 1020 ? String(0.85 * Math.sin(fp * Math.PI)) : '0'
      flash.style.transform = `translateY(-50%) scale(${0.5 + fp})`
      const nb = cl((el - 700) / 250), bul = el > 700 && nb < 1 ? Math.sin(nb * Math.PI) : 0
      goal.style.transform = `translateY(-50%) scaleX(${1 + bul * 0.16})`
      const sh = el > 720 && el < 840 ? Math.sin((el - 720) / 120 * Math.PI * 3) * 1.4 : 0
      stage.style.transform = `translateX(${sh}px)`
    }

    const renderCard = (el: number, bg: string) => {
      gg.style.opacity = '0'; clock.style.opacity = '0'
      const ph = cardPhase(el, CARD_DUR, ease)
      cardWrap.style.opacity = '1'
      if (card.style.backgroundImage !== bg) card.style.backgroundImage = bg
      card.style.transform = `rotateY(${ph.rotY}deg) translateY(${ph.ty}px)`
      card.style.opacity = String(ph.op)
      if (ph.shine >= 0) { shine.style.opacity = String(0.55 * Math.sin(ph.shine * Math.PI)); shine.style.transform = `translateX(${-130 + ph.shine * 260}%) skewX(-18deg)` }
      else shine.style.opacity = '0'
    }

    let mode: 'idle' | 'playing' = 'idle'
    let scene: 'goal' | 'yellow' | 'red' | null = null
    let sceneStart = 0
    let clockMs = 0
    let lastTs = 0
    const fired = new Set<number>()
    let visible = false
    let rafOn = false
    let raf = 0

    const startScene = (type: 'goal' | 'yellow' | 'red') => {
      if (mode === 'playing') return
      mode = 'playing'; scene = type; sceneStart = 0
    }

    const loop = (now: number) => {
      if (!lastTs) lastTs = now
      const dt = now - lastTs
      lastTs = now

      if (mode === 'playing') {
        if (!sceneStart) sceneStart = now
        const el = now - sceneStart
        const dur = scene === 'goal' ? GOAL_DUR : CARD_DUR
        if (el >= dur) enterIdle()
        else if (scene === 'goal') renderGoal(el)
        else renderCard(el, scene === 'yellow' ? YELLOW : RED)
      }

      if (mode === 'idle') {
        clockMs += dt
        let minute = START_MIN + Math.floor(clockMs / MIN_TICK_MS)
        if (minute >= FULL_MIN) { clockMs = 0; fired.clear(); minute = START_MIN }
        for (const ev of EVENTS) {
          const fireAt = (ev.m - START_MIN) * MIN_TICK_MS + EVENT_HOLD
          if (!fired.has(ev.m) && clockMs >= fireAt) { fired.add(ev.m); startScene(ev.type); break }
        }
        if (mode === 'idle') renderClock(now, minute)
      }

      if (visible) raf = requestAnimationFrame(loop)
      else rafOn = false
    }
    const ensure = () => { if (!rafOn) { rafOn = true; lastTs = 0; raf = requestAnimationFrame(loop) } }

    enterIdle()
    const onEnter = () => { startScene('goal'); ensure() }
    root.addEventListener('mouseenter', onEnter)
    const io = new IntersectionObserver(
      (entries) => entries.forEach((en) => {
        if (en.isIntersecting) { visible = true; ensure() }
        else visible = false
      }),
      { threshold: 0.4 },
    )
    io.observe(root)

    return () => { cancelAnimationFrame(raf); root.removeEventListener('mouseenter', onEnter); io.disconnect() }
  }, [])

  return (
    <Link ref={rootRef} href={href}
      className={`group relative inline-flex items-center gap-3 overflow-hidden rounded-full
        bg-gradient-to-r from-ugreen to-ugreend text-white font-extrabold text-[15px] tracking-wide
        pl-6 pr-5 py-3.5 ring-1 ring-ugold/30
        shadow-[0_10px_28px_-12px_rgba(12,46,34,0.6)]
        transition-all duration-300 hover:-translate-y-0.5 hover:ring-ugold/70
        hover:shadow-[0_18px_42px_-14px_rgba(12,46,34,0.78)] ${className}`}>

      <span ref={sheenRef} aria-hidden style={{ opacity: 0 }}
        className="pointer-events-none absolute inset-0 -translate-x-full bg-gradient-to-r
          from-transparent via-white/25 to-transparent" />

      <span className="relative">{label}</span>

      {/* sahne alanı */}
      <span ref={stageRef} className="relative h-9 w-[80px] shrink-0" aria-hidden>

        {/* ── CANLI maç dakikası (rest hali) ── */}
        <span ref={clockRef} className="absolute inset-0 flex items-center justify-center gap-1.5">
          <span ref={dotRef} className="block h-[6px] w-[6px] rounded-full bg-ugold shadow-[0_0_6px_var(--c-ugold)]" />
          <span ref={minRef} className="text-[13px] font-extrabold tabular-nums text-white">{"60'"}</span>
        </span>

        {/* ── GOL sahnesi ── */}
        <span ref={goalGroupRef} className="absolute inset-0 opacity-0">
          <span ref={speedRef} className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 flex flex-col gap-[3px] opacity-0">
            <span className="block h-[1.5px] w-3 rounded-full bg-ugold/80" />
            <span className="block h-[1.5px] w-4 rounded-full bg-ugold/60" />
            <span className="block h-[1.5px] w-2.5 rounded-full bg-ugold/80" />
          </span>
          <span ref={flashRef} className="pointer-events-none absolute right-1 top-1/2 h-10 w-10 -translate-y-1/2 rounded-full
            bg-[radial-gradient(circle,var(--c-ugold)_0%,transparent_70%)] opacity-0" />
          <span ref={goalRef} className="absolute right-0 top-1/2 -translate-y-1/2 origin-left block text-ugold/90">
            <GoalNet className="h-[30px] w-[33px]" />
          </span>
          <span ref={ballRef} className="absolute left-1 top-1/2 -translate-y-1/2 block h-[16px] w-[16px] drop-shadow">
            <SoccerBall className="h-full w-full" />
          </span>
          <span ref={golRef} className="pointer-events-none absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2
            whitespace-nowrap rounded-full bg-ugreendd/95 px-2 py-[3px] text-[10px] font-extrabold tracking-wide text-ugold
            opacity-0 shadow-sm ring-1 ring-ugold/40">
            GOOOOOL!
          </span>
        </span>

        {/* ── KART sahnesi (3B flip, figürsüz) ── */}
        <span ref={cardWrapRef} className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0"
          style={{ perspective: '320px' }}>
          <span ref={cardFaceRef}
            className="relative block h-[28px] w-[20px] overflow-hidden rounded-[3px]"
            style={{ backgroundImage: YELLOW, boxShadow: '0 7px 16px -5px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.35)' }}>
            <span ref={cardShineRef} className="pointer-events-none absolute inset-y-0 -left-2 w-3
              bg-gradient-to-r from-transparent via-white/70 to-transparent opacity-0" />
          </span>
        </span>
      </span>
    </Link>
  )
}
