"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

export default function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Leaf class
    class Leaf {
      x: number
      y: number
      size: number
      angle: number
      rotationSpeed: number
      color: string
      opacity: number
      speedX: number
      speedY: number

      constructor(canvas: HTMLCanvasElement) {
        this.x = Math.random() * canvas.width
        this.y = Math.random() * canvas.height
        this.size = Math.random() * 20 + 10
        this.angle = Math.random() * 360
        this.rotationSpeed = (Math.random() - 0.5) * 2
        this.color = `hsl(${Math.random() * 40 + 90}, 70%, 50%)`
        this.opacity = Math.random() * 0.5 + 0.3
        this.speedX = (Math.random() - 0.5) * 1
        this.speedY = Math.random() * 0.5 + 0.2
      }

      update(canvas: HTMLCanvasElement) {
        this.y += this.speedY
        this.x += this.speedX
        this.angle += this.rotationSpeed

        // Reset position when leaf goes out of bounds
        if (this.y > canvas.height) {
          this.y = -this.size
          this.x = Math.random() * canvas.width
        }

        if (this.x < -this.size) {
          this.x = canvas.width
        } else if (this.x > canvas.width + this.size) {
          this.x = -this.size
        }
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.translate(this.x, this.y)
        ctx.rotate((this.angle * Math.PI) / 180)
        ctx.globalAlpha = this.opacity

        // Draw leaf
        ctx.beginPath()
        ctx.fillStyle = this.color

        // Leaf shape
        ctx.moveTo(0, -this.size / 2)
        ctx.bezierCurveTo(this.size / 2, -this.size / 2, this.size, 0, 0, this.size)
        ctx.bezierCurveTo(-this.size, 0, -this.size / 2, -this.size / 2, 0, -this.size / 2)

        ctx.fill()

        // Draw vein
        ctx.beginPath()
        ctx.strokeStyle = `hsla(${Number.parseInt(this.color.slice(4)) - 10}, 90%, 30%, ${this.opacity + 0.2})`
        ctx.lineWidth = 1
        ctx.moveTo(0, -this.size / 2)
        ctx.lineTo(0, this.size / 2)
        ctx.stroke()

        ctx.restore()
      }
    }

    // Create leaves
    const leaves: Leaf[] = []
    const leafCount = 15

    for (let i = 0; i < leafCount; i++) {
      leaves.push(new Leaf(canvas))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw leaves
      leaves.forEach((leaf) => {
        leaf.update(canvas)
        leaf.draw(ctx)
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <motion.div
      className="relative w-full h-full"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <motion.div
        className="absolute inset-0 flex items-center justify-center"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{
          duration: 0.8,
          delay: 0.3,
          type: "spring",
          stiffness: 100,
        }}
      >
        <div className="relative w-64 h-64 md:w-80 md:h-80">
          <div className="absolute inset-0 rounded-full bg-primary/10 animate-pulse" />
          <img
            src="/placeholder.svg?height=320&width=320"
            alt="Plant illustration"
            className="w-full h-full object-contain"
          />
        </div>
      </motion.div>
    </motion.div>
  )
}

