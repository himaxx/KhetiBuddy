"use client"

import { useEffect, useRef } from "react"
import { motion } from "framer-motion"

interface LeafLoadingAnimationProps {
  text?: string
  size?: "sm" | "md" | "lg"
}

export default function LeafLoadingAnimation({ text = "Loading...", size = "md" }: LeafLoadingAnimationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Size mapping
  const sizeMap = {
    sm: { container: "w-32 h-32", text: "text-sm" },
    md: { container: "w-48 h-48", text: "text-base" },
    lg: { container: "w-64 h-64", text: "text-lg" },
  }

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    const setCanvasDimensions = () => {
      const container = canvas.parentElement
      if (!container) return

      const { width, height } = container.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1

      canvas.width = width * dpr
      canvas.height = height * dpr

      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`

      ctx.scale(dpr, dpr)
    }

    setCanvasDimensions()
    window.addEventListener("resize", setCanvasDimensions)

    // Vine class
    class Vine {
      x: number
      y: number
      length: number
      angle: number
      angleSpeed: number
      thickness: number
      growthSpeed: number
      maxLength: number
      color: string
      branches: Vine[]
      parent: Vine | null
      depth: number
      maxDepth: number
      age: number
      maxAge: number

      constructor(x: number, y: number, angle: number, thickness: number, parent: Vine | null = null, depth = 0) {
        this.x = x
        this.y = y
        this.length = 0
        this.angle = angle
        this.angleSpeed = (Math.random() - 0.5) * 0.1
        this.thickness = thickness
        this.growthSpeed = Math.random() * 0.5 + 0.5
        this.maxLength = Math.random() * 50 + 30
        this.color = `hsl(${Math.random() * 40 + 100}, 70%, 50%)`
        this.branches = []
        this.parent = parent
        this.depth = depth
        this.maxDepth = 3
        this.age = 0
        this.maxAge = Math.random() * 200 + 100
      }

      update() {
        if (this.length < this.maxLength) {
          this.length += this.growthSpeed
        }

        this.angle += this.angleSpeed
        this.age++

        // Create branches
        if (
          this.length > this.maxLength * 0.6 &&
          this.branches.length < 2 &&
          this.depth < this.maxDepth &&
          Math.random() < 0.03
        ) {
          const endX = this.x + Math.cos(this.angle) * this.length
          const endY = this.y + Math.sin(this.angle) * this.length

          const branchAngle = this.angle + (Math.random() - 0.5) * 1.5
          const branchThickness = this.thickness * 0.7

          this.branches.push(new Vine(endX, endY, branchAngle, branchThickness, this, this.depth + 1))
        }

        // Update branches
        this.branches.forEach((branch) => branch.update())

        // Remove old branches
        this.branches = this.branches.filter((branch) => branch.age < branch.maxAge)
      }

      draw(ctx: CanvasRenderingContext2D) {
        if (this.length <= 0) return

        const endX = this.x + Math.cos(this.angle) * this.length
        const endY = this.y + Math.sin(this.angle) * this.length

        // Draw vine
        ctx.beginPath()
        ctx.strokeStyle = this.color
        ctx.lineWidth = this.thickness
        ctx.lineCap = "round"
        ctx.moveTo(this.x, this.y)
        ctx.lineTo(endX, endY)
        ctx.stroke()

        // Draw leaf at the end if it's a terminal branch
        if (this.branches.length === 0 && this.length >= this.maxLength * 0.9) {
          this.drawLeaf(ctx, endX, endY)
        }

        // Draw branches
        this.branches.forEach((branch) => branch.draw(ctx))
      }

      drawLeaf(ctx: CanvasRenderingContext2D, x: number, y: number) {
        const leafSize = this.thickness * 3
        const leafAngle = this.angle + Math.PI / 2

        ctx.save()
        ctx.translate(x, y)
        ctx.rotate(leafAngle)

        // Draw leaf
        ctx.beginPath()
        ctx.fillStyle = this.color

        // Leaf shape
        ctx.moveTo(0, -leafSize / 2)
        ctx.bezierCurveTo(leafSize, -leafSize / 2, leafSize * 1.5, 0, 0, leafSize * 1.5)
        ctx.bezierCurveTo(-leafSize * 1.5, 0, -leafSize, -leafSize / 2, 0, -leafSize / 2)

        ctx.fill()

        // Draw vein
        ctx.beginPath()
        ctx.strokeStyle = `hsla(${Number.parseInt(this.color.slice(4)) - 10}, 90%, 30%, 0.5)`
        ctx.lineWidth = 1
        ctx.moveTo(0, 0)
        ctx.lineTo(0, leafSize)
        ctx.stroke()

        ctx.restore()
      }
    }

    // Create vines
    const vines: Vine[] = []
    const vineCount = 3

    const centerX = canvas.width / 2
    const centerY = canvas.height / 2

    for (let i = 0; i < vineCount; i++) {
      const angle = (Math.PI * 2 * i) / vineCount - Math.PI / 2
      vines.push(new Vine(centerX, centerY, angle, 3))
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Update and draw vines
      vines.forEach((vine) => {
        vine.update()
        vine.draw(ctx)
      })

      // Add new vines if needed
      if (vines.length < vineCount && Math.random() < 0.02) {
        const angle = Math.random() * Math.PI * 2
        vines.push(new Vine(centerX, centerY, angle, 3))
      }

      // Remove old vines
      vines.forEach((vine, index) => {
        if (vine.age > vine.maxAge) {
          vines.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
    }
  }, [])

  return (
    <div className={`relative ${sizeMap[size].container} mx-auto`}>
      <div className="absolute inset-0 rounded-full bg-primary/5 animate-pulse" />

      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      <div className="absolute inset-0 flex items-center justify-center">
        <motion.div
          className={`text-center ${sizeMap[size].text} font-medium text-primary`}
          initial={{ opacity: 0 }}
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
        >
          {text}
        </motion.div>
      </div>
    </div>
  )
}

