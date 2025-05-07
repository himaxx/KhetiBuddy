"use client"

import type React from "react"

import { useEffect, useRef, useState } from "react"
import { motion, useScroll, useTransform } from "framer-motion"
import { useTheme } from "next-themes"

interface FallingLeavesBackgroundProps {
  children: React.ReactNode
}

export default function FallingLeavesBackground({ children }: FallingLeavesBackgroundProps) {
  const { theme } = useTheme()
  const containerRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  })

  const [mounted, setMounted] = useState(false)
  const [scrollPosition, setScrollPosition] = useState(0)

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      const position = window.scrollY
      setScrollPosition(position)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Transform values based on scroll
  const backgroundY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"])
  const opacity = useTransform(scrollYProgress, [0, 0.5, 1], [1, 0.8, 0.6])

  // Generate leaf elements
  const generateLeaves = (count: number) => {
    return Array.from({ length: count }).map((_, i) => {
      const size = Math.random() * 30 + 10
      const initialX = Math.random() * 100
      const initialY = Math.random() * -100 - size // Start above the viewport
      const delay = Math.random() * 5
      const duration = Math.random() * 10 + 15
      const rotationSpeed = Math.random() * 10 - 5
      const swayAmount = Math.random() * 30 + 10
      const fallSpeed = Math.random() * 2 + 1

      // Calculate position based on scroll
      const yPosition = initialY + scrollPosition * fallSpeed

      return (
        <motion.div
          key={i}
          className="absolute rounded-full bg-primary/10 backdrop-blur-sm"
          style={{
            width: size,
            height: size * 1.5,
            borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
            left: `${initialX}%`,
            top: `${yPosition}px`,
            rotate: Math.random() * 360,
          }}
          animate={{
            x: [0, swayAmount, -swayAmount, 0],
            rotate: [0, 360 * rotationSpeed],
            y: ["0vh", "100vh"],
          }}
          transition={{
            duration,
            repeat: Number.POSITIVE_INFINITY,
            delay,
            ease: "linear",
            y: {
              duration: 20 / fallSpeed,
              repeat: Number.POSITIVE_INFINITY,
              ease: "linear",
            },
          }}
        />
      )
    })
  }

  const leaves = generateLeaves(15)

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

