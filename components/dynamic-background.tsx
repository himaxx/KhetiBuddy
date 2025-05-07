"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"

interface DynamicBackgroundProps {
  children: React.ReactNode
}

export default function DynamicBackground({ children }: DynamicBackgroundProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  // Transform values based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  // Generate leaf elements
  const leaves = Array.from({ length: 15 }).map((_, i) => {
    const size = Math.random() * 30 + 10
    const initialX = Math.random() * 100
    const initialY = Math.random() * 100
    const delay = Math.random() * 5
    const duration = Math.random() * 10 + 15

    return (
      <motion.div
        key={i}
        className="absolute rounded-full bg-primary/10 backdrop-blur-sm"
        style={{
          width: size,
          height: size * 1.5,
          borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
          left: `${initialX}%`,
          top: `${initialY}%`,
          rotate: Math.random() * 360,
        }}
        animate={{
          y: [0, -20, 0],
          rotate: [0, 10, -10, 0],
          scale: [1, 1.05, 0.95, 1],
        }}
        transition={{
          duration,
          repeat: Number.POSITIVE_INFINITY,
          delay,
          ease: "easeInOut",
        }}
      />
    )
  })

  if (!mounted) return <>{children}</>

  return (
    <div ref={containerRef} className="relative min-h-screen overflow-hidden">
      <motion.div className="fixed inset-0 -z-10" style={{ y: backgroundY, opacity }}>
        {/* Gradient background */}
        <div
          className={`absolute inset-0 ${
            theme === "dark"
              ? "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-900/30 via-background to-background"
              : "bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-green-100 via-background to-background"
          } transition-colors duration-500`}
        />

        {/* Animated leaves */}
        {leaves}
      </motion.div>

      {children}
    </div>
  )
}

