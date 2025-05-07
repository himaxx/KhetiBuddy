"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, useAnimation, useMotionValue, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { ImageIcon, Leaf } from "lucide-react"
import { useTheme } from "next-themes"
import { useMediaQuery } from "@/hooks/use-media-query"

interface EnhancedImageUploaderProps {
  onImageUpload: (imageData: string) => void
  title?: string
}

export default function EnhancedImageUploader({
  onImageUpload,
  title = "Upload a plant leaf image",
}: EnhancedImageUploaderProps) {
  const { theme } = useTheme()
  const [isDragging, setIsDragging] = useState(false)
  const [isHovering, setIsHovering] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const [progress, setProgress] = useState(0)
  const [uploadState, setUploadState] = useState<"idle" | "ready" | "uploading" | "processing" | "error">("idle")
  const fileInputRef = useRef<HTMLInputElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  const controls = useAnimation()
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // 3D tilt effect values - less pronounced on mobile
  const rotateX = useTransform(mouseY, [0, 300], isMobile ? [2, -2] : [5, -5])
  const rotateY = useTransform(mouseX, [0, 300], isMobile ? [-2, 2] : [-5, 5])

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current || isMobile) return

    const { left, top, width, height } = containerRef.current.getBoundingClientRect()
    const x = e.clientX - left
    const y = e.clientY - top

    mouseX.set(x)
    mouseY.set(y)
  }

  // Handle touch events for mobile
  const handleTouchStart = () => {
    setIsTouched(true)
  }

  const handleTouchEnd = () => {
    setIsTouched(false)
  }

  // Particle system for canvas
  useEffect(() => {
    if (isMobile) return // Skip canvas animation on mobile for performance

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

    // Particle class
    class Particle {
      x: number
      y: number
      size: number
      speedX: number
      speedY: number
      color: string
      alpha: number
      decay: number

      constructor(x: number, y: number) {
        this.x = x
        this.y = y
        this.size = Math.random() * 5 + 1
        this.speedX = (Math.random() - 0.5) * 2
        this.speedY = (Math.random() - 0.5) * 2

        // Color based on theme
        const isDark = document.documentElement.classList.contains("dark")
        const hue = isDark ? Math.random() * 40 + 100 : Math.random() * 40 + 90
        this.color = `hsla(${hue}, 70%, 50%, `

        this.alpha = Math.random() * 0.5 + 0.5
        this.decay = Math.random() * 0.01 + 0.005
      }

      update() {
        this.x += this.speedX
        this.y += this.speedY
        this.alpha -= this.decay
      }

      draw(ctx: CanvasRenderingContext2D) {
        ctx.save()
        ctx.globalAlpha = this.alpha
        ctx.fillStyle = this.color + this.alpha + ")"

        // Draw leaf-like particle
        ctx.beginPath()
        ctx.ellipse(this.x, this.y, this.size, this.size * 1.5, Math.PI / 4, 0, Math.PI * 2)
        ctx.fill()

        ctx.restore()
      }
    }

    // Particles array
    const particles: Particle[] = []

    // Mouse position
    let mouseX = 0
    let mouseY = 0

    // Track mouse position
    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mouseX = e.clientX - rect.left
      mouseY = e.clientY - rect.top

      // Add particles on mouse move when hovering
      if (isHovering && Math.random() < 0.3) {
        for (let i = 0; i < 2; i++) {
          particles.push(new Particle(mouseX, mouseY))
        }
      }
    }

    // Add particles on drag
    const addParticlesOnDrag = () => {
      if (isDragging) {
        for (let i = 0; i < 5; i++) {
          particles.push(new Particle(Math.random() * canvas.width, Math.random() * canvas.height))
        }
      }
    }

    // Animation loop
    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Add particles on drag
      addParticlesOnDrag()

      // Update and draw particles
      particles.forEach((particle, index) => {
        particle.update()
        particle.draw(ctx)

        // Remove particles with low alpha
        if (particle.alpha <= 0) {
          particles.splice(index, 1)
        }
      })

      requestAnimationFrame(animate)
    }

    canvas.addEventListener("mousemove", handleMouseMove)
    animate()

    return () => {
      window.removeEventListener("resize", setCanvasDimensions)
      canvas.removeEventListener("mousemove", handleMouseMove)
    }
  }, [isHovering, isDragging, isMobile])

  // Handle drag events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
    setUploadState("ready")
    controls.start({ scale: 1.02 })
  }

  const handleDragLeave = () => {
    setIsDragging(false)
    setUploadState("idle")
    controls.start({ scale: 1 })
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    } else {
      setUploadState("error")
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } })
      setTimeout(() => setUploadState("idle"), 2000)
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      setUploadState("error")
      controls.start({ x: [0, -10, 10, -10, 10, 0], transition: { duration: 0.5 } })
      setTimeout(() => setUploadState("idle"), 2000)
      return
    }

    setUploadState("uploading")

    // Simulate upload progress
    let currentProgress = 0
    const progressInterval = setInterval(() => {
      currentProgress += 5
      setProgress(currentProgress)

      if (currentProgress >= 100) {
        clearInterval(progressInterval)
        setUploadState("processing")

        // Simulate processing delay
        setTimeout(() => {
          const reader = new FileReader()
          reader.onload = (e) => {
            if (e.target && typeof e.target.result === "string") {
              onImageUpload(e.target.result)
            }
          }
          reader.readAsDataURL(file)
        }, 1000)
      }
    }, 50)
  }

  // Get upload state text
  const getUploadStateText = () => {
    switch (uploadState) {
      case "ready":
        return "Drop Here"
      case "uploading":
        return "Uploading..."
      case "processing":
        return "Processing..."
      case "error":
        return "Invalid File"
      default:
        return isMobile ? "Tap to browse images" : "Drag and drop your image here, or click to browse"
    }
  }

  // Determine if we should apply hover/touch effects
  const isActive = isHovering || isTouched || isDragging

  // Leaf border animation variants
  const leafBorderVariants = {
    idle: {
      opacity: 0.3,
      pathLength: 0.2,
    },
    hover: {
      opacity: 0.8,
      pathLength: 1,
      transition: {
        pathLength: { duration: 2, ease: "easeInOut" },
        opacity: { duration: 0.5 },
      },
    },
  }

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovering(true)}
      onMouseLeave={() => setIsHovering(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="perspective-1000"
    >
      <motion.div
        animate={controls}
        style={{
          rotateX: isActive && !isMobile ? rotateX : 0,
          rotateY: isActive && !isMobile ? rotateY : 0,
        }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
        className="w-full"
      >
        <Card
          className={`relative border-2 border-dashed transition-all duration-300 overflow-hidden ${
            isDragging ? "border-primary bg-primary/5" : isActive ? "border-primary/50" : "border-border"
          }`}
        >
          {/* Particle canvas - only on desktop */}
          {!isMobile && <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />}

          {/* Leaf border SVG */}
          <div className="absolute inset-0 pointer-events-none">
            <svg
              width="100%"
              height="100%"
              viewBox="0 0 100 100"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="absolute inset-0"
            >
              <motion.path
                d="M20,10 C40,10 60,10 80,10 C90,10 90,20 90,30 C90,50 90,70 90,90 C90,90 80,90 70,90 C50,90 30,90 10,90 C10,90 10,80 10,70 C10,50 10,30 10,10 C10,10 10,10 20,10 Z"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-primary"
                fill="none"
                variants={leafBorderVariants}
                initial="idle"
                animate={isActive ? "hover" : "idle"}
              />

              {/* Corner leaf decorations */}
              <motion.g
                initial={{ opacity: 0 }}
                animate={{ opacity: isActive ? 1 : 0 }}
                transition={{ duration: 0.5 }}
                className="text-primary"
              >
                {/* Top left leaf */}
                <path d="M5,5 C10,0 15,5 10,10 C5,15 0,10 5,5 Z" fill="currentColor" opacity="0.3" />
                {/* Top right leaf */}
                <path d="M95,5 C100,10 95,15 90,10 C85,5 90,0 95,5 Z" fill="currentColor" opacity="0.3" />
                {/* Bottom left leaf */}
                <path d="M5,95 C0,90 5,85 10,90 C15,95 10,100 5,95 Z" fill="currentColor" opacity="0.3" />
                {/* Bottom right leaf */}
                <path d="M95,95 C90,100 85,95 90,90 C95,85 100,90 95,95 Z" fill="currentColor" opacity="0.3" />
              </motion.g>
            </svg>
          </div>

          <div
            className="flex flex-col items-center justify-center p-8 sm:p-12 text-center cursor-pointer relative z-10"
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <motion.div
              animate={{
                y: isDragging ? -10 : 0,
                scale: isDragging ? 1.1 : 1,
                rotate: isDragging ? [0, 5, -5, 0] : 0,
              }}
              transition={{ duration: 0.5 }}
              className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-primary/10 flex items-center justify-center mb-4 sm:mb-6 relative"
            >
              {uploadState === "idle" || uploadState === "ready" ? (
                isDragging ? (
                  <ImageIcon className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                ) : (
                  <motion.div
                    animate={{ rotate: [0, 5, -5, 0] }}
                    transition={{ duration: 3, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                  >
                    <Leaf className="h-8 w-8 sm:h-10 sm:w-10 text-primary" />
                  </motion.div>
                )
              ) : uploadState === "uploading" || uploadState === "processing" ? (
                <div className="relative h-full w-full flex items-center justify-center">
                  {/* Progress circle */}
                  <svg className="absolute inset-0" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      className="text-primary/20"
                    />
                    <motion.circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="8"
                      strokeLinecap="round"
                      className="text-primary"
                      strokeDasharray="283"
                      strokeDashoffset={283 - (283 * progress) / 100}
                    />
                  </svg>
                  <span className="text-sm font-medium">{progress}%</span>
                </div>
              ) : (
                <motion.div animate={{ scale: [1, 1.2, 1] }} transition={{ duration: 0.5 }}>
                  <svg
                    width="40"
                    height="40"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="text-destructive"
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="15" y1="9" x2="9" y2="15" />
                    <line x1="9" y1="9" x2="15" y2="15" />
                  </svg>
                </motion.div>
              )}

              {/* Animated particles around icon - only on desktop */}
              {isActive && !isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                  {Array.from({ length: 6 }).map((_, i) => (
                    <motion.div
                      key={i}
                      className="absolute w-2 h-3 rounded-full bg-primary/40"
                      style={{
                        top: "50%",
                        left: "50%",
                        x: "-50%",
                        y: "-50%",
                      }}
                      animate={{
                        x: [0, Math.cos((i * 60 * Math.PI) / 180) * 50],
                        y: [0, Math.sin((i * 60 * Math.PI) / 180) * 50],
                        opacity: [0, 1, 0],
                        scale: [0.5, 1.5, 0.5],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                        ease: "easeInOut",
                      }}
                    />
                  ))}
                </div>
              )}
            </motion.div>

            <h3 className="text-lg sm:text-xl font-medium mb-2">{title}</h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">{getUploadStateText()}</p>

            <Button variant="outline" type="button" className="mt-2 relative overflow-hidden group">
              <span className="relative z-10">Select Image</span>
              <motion.div
                className="absolute inset-0 bg-primary"
                initial={{ x: "-100%" }}
                animate={{
                  x: isActive ? "0%" : "-100%",
                }}
                transition={{ duration: 0.3 }}
                style={{ opacity: 0.1 }}
              />
            </Button>

            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

            <p className="text-xs text-muted-foreground mt-4">Supported formats: JPG, PNG, WEBP</p>
          </div>
        </Card>
      </motion.div>
    </div>
  )
}

