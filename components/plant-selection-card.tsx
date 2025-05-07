"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import PlaceholderImage from "./placeholder-image"

interface PlantSelectionCardProps {
  id: string
  name: string
  image: string
  description: string
  hasModel?: boolean
}

export default function PlantSelectionCard({
  id,
  name,
  image,
  description,
  hasModel = false,
}: PlantSelectionCardProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [isHovered, setIsHovered] = useState(false)
  const [isTouched, setIsTouched] = useState(false)
  const cardRef = useRef<HTMLDivElement>(null)

  // Motion values for parallax effect
  const mouseX = useMotionValue(0)
  const mouseY = useMotionValue(0)

  // Transform mouse position to rotation values
  const rotateX = useTransform(mouseY, [-300, 300], [10, -10])
  const rotateY = useTransform(mouseX, [-300, 300], [-10, 10])

  // Handle mouse move for parallax effect
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return

    const rect = cardRef.current.getBoundingClientRect()
    const centerX = rect.left + rect.width / 2
    const centerY = rect.top + rect.height / 2

    mouseX.set(e.clientX - centerX)
    mouseY.set(e.clientY - centerY)
  }

  // Handle touch events for mobile
  const handleTouchStart = () => {
    setIsTouched(true)
  }

  const handleTouchEnd = () => {
    setIsTouched(false)
  }

  const handleCardClick = () => {
    router.push(`/detect/${id}`)
  }

  // Translated plant name
  const translatedName = t(`plant.${id.toLowerCase()}`)

  // Determine if we should apply hover/touch effects
  const isActive = isHovered || isTouched

  return (
    <motion.div
      ref={cardRef}
      className="cursor-pointer perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      onClick={handleCardClick}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{
          rotateX: isActive ? rotateX : 0,
          rotateY: isActive ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        transition={{ type: "spring", stiffness: 400, damping: 15 }}
      >
        <Card className={`overflow-hidden border-2 h-full ${hasModel ? "border-primary" : ""}`}>
          <div className="relative">
            {/* Background gradient overlay */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-b from-transparent to-background/90 z-10"
              animate={{
                opacity: isActive ? 0.7 : 0.9,
              }}
            />

            {/* Plant image */}
            <motion.div
              className="relative aspect-square overflow-hidden"
              animate={{
                scale: isActive ? 1.1 : 1,
              }}
              transition={{ duration: 0.4 }}
            >
              <PlaceholderImage
                src={image}
                alt={name}
                fallbackSrc={`/grape.svg?height=400&width=400&text=${id}`}
                className="w-full h-full object-cover"
              />
            </motion.div>

            {/* AI Model Badge */}
            {hasModel && (
              <div className="absolute top-2 right-2 z-20">
                <Badge className="bg-primary text-primary-foreground">AI Model</Badge>
              </div>
            )}

            {/* Floating leaves effect */}
            {isActive && (
              <>
                {[...Array(5)].map((_, i) => (
                  <motion.div
                    key={i}
                    className="absolute w-4 h-6 bg-primary/20 rounded-full z-20"
                    style={{
                      top: `${Math.random() * 100}%`,
                      left: `${Math.random() * 100}%`,
                      rotate: `${Math.random() * 360}deg`,
                      borderRadius: "50% 50% 50% 50% / 60% 60% 40% 40%",
                    }}
                    initial={{ opacity: 0, y: 0 }}
                    animate={{
                      opacity: [0, 0.8, 0],
                      y: [0, -20 - i * 10],
                      rotate: [`${Math.random() * 360}deg`, `${Math.random() * 360 + 180}deg`],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Number.POSITIVE_INFINITY,
                      delay: i * 0.2,
                    }}
                  />
                ))}
              </>
            )}

            {/* Content */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 p-4 z-20"
              animate={{
                y: isActive ? -5 : 0,
              }}
            >
              <motion.h3
                className="text-xl font-bold mb-1 text-foreground"
                animate={{
                  scale: isActive ? 1.05 : 1,
                }}
              >
                {translatedName}
              </motion.h3>

              <motion.p
                className="text-sm text-muted-foreground line-clamp-2 overflow-hidden"
                initial={{ height: "1.5rem", opacity: 0.8 }}
                animate={{
                  height: isActive ? "auto" : "1.5rem",
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {description}
              </motion.p>
            </motion.div>
          </div>
        </Card>
      </motion.div>
    </motion.div>
  )
}

