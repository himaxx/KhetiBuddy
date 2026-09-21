"use client"

import { useEffect, useState } from "react"
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion"

const WORD = "CropSaviour".split("")

const STATUS_LINES = [
  "Initializing neural engine",
  "Loading plant intelligence",
  "Calibrating disease models",
  "Preparing your fields",
]

const LOAD_DURATION = 2800

// Deterministic particle layout (no Math.random — keeps SSR/CSR consistent)
const PARTICLES = Array.from({ length: 14 }).map((_, i) => ({
  left: (i * 73 + 11) % 100,
  size: 2 + ((i * 7) % 3),
  delay: (i % 7) * 0.7,
  duration: 5 + ((i * 13) % 40) / 10,
  drift: ((i % 5) - 2) * 14,
}))

const LEAF_PATH = "M11 20A7 7 0 0 1 9.8 6.1C15.5 5 17 4.48 19 2c1 2 2 4.18 2 8 0 5.5-4.78 10-10 10Z"
const VEIN_PATH = "M2 21c0-3 1.85-5.36 5.08-6C9.5 14.52 12 13 13 12"

function easeInOutCubic(t: number) {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

export default function SplashLoader() {
  const [progress, setProgress] = useState(0)
  const [statusIndex, setStatusIndex] = useState(0)
  const [finished, setFinished] = useState(false)

  // Progress driven by eased wall-clock time — smooth, lands exactly on 100,
  // and self-corrects even if the tab was hidden mid-load
  useEffect(() => {
    const start = performance.now()
    const id = window.setInterval(() => {
      const t = Math.min((performance.now() - start) / LOAD_DURATION, 1)
      setProgress(Math.round(easeInOutCubic(t) * 100))
      if (t >= 1) {
        window.clearInterval(id)
        window.setTimeout(() => setFinished(true), 400)
      }
    }, 50)
    return () => window.clearInterval(id)
  }, [])

  useEffect(() => {
    const id = window.setInterval(() => setStatusIndex((i) => (i + 1) % STATUS_LINES.length), 850)
    return () => window.clearInterval(id)
  }, [])

  // Magnetic mouse parallax — emblem follows the cursor, glow drifts against it
  const mx = useMotionValue(0)
  const my = useMotionValue(0)
  const sx = useSpring(mx, { stiffness: 50, damping: 16, mass: 0.6 })
  const sy = useSpring(my, { stiffness: 50, damping: 16, mass: 0.6 })
  const emblemX = useTransform(sx, [-0.5, 0.5], [-16, 16])
  const emblemY = useTransform(sy, [-0.5, 0.5], [-10, 10])
  const glowX = useTransform(sx, [-0.5, 0.5], [36, -36])
  const glowY = useTransform(sy, [-0.5, 0.5], [28, -28])

  return (
    <AnimatePresence>
      {!finished && (
        <motion.div
          className="fixed inset-0 z-[100] overflow-hidden bg-[#040a07]"
          initial={{ clipPath: "circle(141% at 50% 50%)" }}
          exit={{ clipPath: "circle(0% at 50% 50%)" }}
          transition={{ duration: 0.85, ease: [0.83, 0, 0.17, 1] }}
          onMouseMove={(e) => {
            mx.set(e.clientX / window.innerWidth - 0.5)
            my.set(e.clientY / window.innerHeight - 0.5)
          }}
          onClick={() => setFinished(true)}
        >
          {/* ── Atmosphere ─────────────────────────── */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_42%,rgba(34,197,94,0.09),transparent)]" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_35%,rgba(0,0,0,0.85))]" />

          {/* Rising light particles */}
          {PARTICLES.map((p, i) => (
            <motion.span
              key={i}
              className="absolute rounded-full bg-emerald-300/70"
              style={{ left: `${p.left}%`, top: "100%", width: p.size, height: p.size }}
              animate={{
                y: ["0vh", "-115vh"],
                x: [0, p.drift, 0],
                opacity: [0, 0.9, 0],
              }}
              transition={{
                duration: p.duration,
                delay: p.delay,
                repeat: Number.POSITIVE_INFINITY,
                ease: "linear",
                opacity: { duration: p.duration, times: [0, 0.25, 1], delay: p.delay, repeat: Number.POSITIVE_INFINITY },
              }}
            />
          ))}

          {/* ── Center stack ───────────────────────── */}
          <motion.div
            className="relative flex h-full flex-col items-center justify-center gap-7 px-6"
            exit={{ opacity: 0, y: -24, scale: 0.96 }}
            transition={{ duration: 0.45, ease: [0.4, 0, 0.2, 1] }}
          >
            {/* Emblem with parallax */}
            <motion.div
              className="relative flex items-center justify-center"
              style={{ x: emblemX, y: emblemY }}
              animate={{ y: [0, -8, 0] }}
              transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
            >
              {/* breathing glow */}
              <motion.div
                className="absolute h-56 w-56 rounded-full bg-primary/25 blur-3xl"
                style={{ x: glowX, y: glowY }}
                animate={{ scale: [1, 1.18, 1], opacity: [0.5, 0.9, 0.5] }}
                transition={{ duration: 2.6, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
              />

              {/* orbiting rings */}
              <svg viewBox="0 0 200 200" className="relative h-52 w-52 md:h-60 md:w-60">
                <defs>
                  <linearGradient id="splashArc" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#22c55e" />
                    <stop offset="100%" stopColor="#a7f3d0" />
                  </linearGradient>
                </defs>

                {/* static outer hairline */}
                <circle cx="100" cy="100" r="96" fill="none" stroke="rgba(167,243,208,0.12)" strokeWidth="1" />

                {/* slow dashed orbit */}
                <motion.g
                  style={{ originX: "50%", originY: "50%" }}
                  animate={{ rotate: 360 }}
                  transition={{ duration: 40, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="88"
                    fill="none"
                    stroke="rgba(74,222,128,0.35)"
                    strokeWidth="1"
                    strokeDasharray="2 7"
                  />
                </motion.g>

                {/* fast scanner arc */}
                <motion.g
                  style={{ originX: "50%", originY: "50%" }}
                  animate={{ rotate: -360 }}
                  transition={{ duration: 3.2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                >
                  <circle
                    cx="100"
                    cy="100"
                    r="78"
                    fill="none"
                    stroke="url(#splashArc)"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeDasharray="130 360"
                  />
                </motion.g>
              </svg>

              {/* self-drawing leaf */}
              <svg
                viewBox="0 0 24 24"
                className="absolute h-16 w-16"
                fill="none"
                stroke="#4ade80"
                strokeWidth="1.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <motion.path
                  d={LEAF_PATH}
                  fill="#22c55e"
                  initial={{ pathLength: 0, fillOpacity: 0 }}
                  animate={{ pathLength: 1, fillOpacity: 0.14 }}
                  transition={{ pathLength: { duration: 1.1, delay: 0.2, ease: [0.65, 0, 0.35, 1] }, fillOpacity: { duration: 0.8, delay: 1.1 } }}
                />
                <motion.path
                  d={VEIN_PATH}
                  initial={{ pathLength: 0 }}
                  animate={{ pathLength: 1 }}
                  transition={{ duration: 0.7, delay: 0.9, ease: "easeOut" }}
                />
              </svg>
            </motion.div>

            {/* Wordmark */}
            <h1 className="flex overflow-hidden text-4xl font-black tracking-tighter md:text-5xl">
              {WORD.map((ch, i) => (
                <motion.span
                  key={i}
                  className="bg-gradient-to-b from-white via-white to-emerald-300/80 bg-clip-text text-transparent"
                  initial={{ y: "115%" }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.55 + i * 0.045, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                >
                  {ch}
                </motion.span>
              ))}
            </h1>

            <motion.p
              className="text-[10px] font-bold uppercase tracking-[0.45em] text-emerald-200/50"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1.25, duration: 0.6 }}
            >
              AI-Powered Agriculture
            </motion.p>

            {/* ── Loading zone ─────────────────────── */}
            <div className="absolute bottom-16 flex w-64 flex-col items-center gap-3">
              <div className="h-4 text-[10px] font-semibold uppercase tracking-[0.3em] text-emerald-200/60">
                <AnimatePresence mode="wait">
                  <motion.span
                    key={statusIndex}
                    className="inline-block"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.3 }}
                  >
                    {STATUS_LINES[statusIndex]}
                  </motion.span>
                </AnimatePresence>
              </div>

              <div className="flex w-full items-center gap-3">
                <div className="relative h-[3px] flex-1 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-primary to-emerald-300"
                    style={{ width: `${progress}%`, transition: "width 120ms linear" }}
                  />
                  <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-transparent via-white/20 to-transparent" />
                </div>
                <span className="w-10 text-right text-xs font-bold tabular-nums text-white/70">
                  {progress}%
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
