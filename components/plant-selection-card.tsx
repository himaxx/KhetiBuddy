"use client"

import type React from "react"
import { useState, useRef } from "react"
import { motion, useMotionValue, useTransform, useSpring } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useRouter } from "next/navigation"
import { useLanguage } from "@/contexts/language-context"
import { ChevronRight, Sparkles, Zap } from "lucide-react"

const CARD_DISEASES: Record<string, { name: string; severity: "high" | "medium" | "low" }[]> = {
  tomato: [
    { name: "Early Blight", severity: "high" },
    { name: "Late Blight", severity: "high" },
    { name: "Leaf Mold", severity: "medium" },
    { name: "Mosaic Virus", severity: "medium" },
    { name: "Septoria Spot", severity: "medium" },
  ],
  potato: [
    { name: "Late Blight", severity: "high" },
    { name: "Early Blight", severity: "medium" },
    { name: "Blackleg", severity: "high" },
    { name: "Potato Virus Y", severity: "high" },
  ],
  rice: [
    { name: "Rice Blast", severity: "high" },
    { name: "Brown Spot", severity: "medium" },
    { name: "Bacterial Leaf Blight", severity: "high" },
    { name: "Sheath Blight", severity: "high" },
  ],
  wheat: [
    { name: "Leaf Rust", severity: "high" },
    { name: "Stripe Rust", severity: "high" },
    { name: "Powdery Mildew", severity: "medium" },
    { name: "Septoria Blotch", severity: "medium" },
  ],
  grape: [
    { name: "Downy Mildew", severity: "high" },
    { name: "Powdery Mildew", severity: "high" },
    { name: "Black Rot", severity: "high" },
    { name: "Botrytis", severity: "high" },
  ],
  cotton: [
    { name: "Bacterial Blight", severity: "high" },
    { name: "Verticillium Wilt", severity: "high" },
    { name: "Leaf Curl Virus", severity: "high" },
    { name: "Fusarium Wilt", severity: "high" },
  ],
  apple: [
    { name: "Apple Scab", severity: "high" },
    { name: "Cedar Rust", severity: "medium" },
    { name: "Fire Blight", severity: "high" },
    { name: "Powdery Mildew", severity: "medium" },
  ],
  corn: [
    { name: "Northern Blight", severity: "high" },
    { name: "Common Rust", severity: "high" },
    { name: "Gray Leaf Spot", severity: "medium" },
    { name: "Corn Smut", severity: "medium" },
  ],
}

const SEVERITY_DOT: Record<string, string> = {
  high: "bg-red-400",
  medium: "bg-amber-400",
  low: "bg-green-400",
}

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
  const cardRef = useRef<HTMLDivElement>(null)

  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const mouseXSpring = useSpring(x)
  const mouseYSpring = useSpring(y)
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["8deg", "-8deg"])
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-8deg", "8deg"])

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return
    const rect = cardRef.current.getBoundingClientRect()
    const xPct = (e.clientX - rect.left) / rect.width - 0.5
    const yPct = (e.clientY - rect.top) / rect.height - 0.5
    x.set(xPct)
    y.set(yPct)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
    setIsHovered(false)
  }

  const handleCardClick = () => {
    if (hasModel) router.push(`/detect/${id}`)
  }

  const diseases = CARD_DISEASES[id.toLowerCase()] || []
  const translatedName = t(`plant.${id.toLowerCase()}`)

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
      onClick={handleCardClick}
      className={cn(
        "relative group cursor-pointer h-[420px] w-full",
        !hasModel && "cursor-not-allowed opacity-60"
      )}
      style={{ perspective: "1200px" }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileTap={{ scale: 0.98 }}
    >
      <motion.div
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        className="h-full w-full"
      >
        <Card className="h-full w-full overflow-hidden border-none bg-muted shadow-2xl relative rounded-[2.5rem]">
          {/* ── Background Image ── */}
          <div className="absolute inset-0 z-0">
            <motion.img
              src={image}
              alt={name}
              className="w-full h-full object-cover"
              animate={{ scale: isHovered ? 1.1 : 1 }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
            <motion.div
              className="absolute inset-0"
              animate={{
                background: isHovered
                  ? "linear-gradient(to top, rgba(0,0,0,0.95) 0%, rgba(0,0,0,0.7) 50%, rgba(0,0,0,0.3) 100%)"
                  : "linear-gradient(to top, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.1) 60%, rgba(0,0,0,0) 100%)",
              }}
              transition={{ duration: 0.4 }}
            />
          </div>

          {/* ── Top Badge ── */}
          <div className="absolute top-5 left-5 right-5 flex justify-between items-start z-10">
            {hasModel ? (
              <Badge className="bg-primary/90 backdrop-blur-md text-primary-foreground font-black uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-full">
                <Sparkles className="w-3 h-3 mr-1.5" />
                {t("detect.liveModel")}
              </Badge>
            ) : (
              <Badge variant="outline" className="bg-black/40 backdrop-blur-md text-white/70 border-white/20 font-black uppercase text-[9px] tracking-widest px-3 py-1.5 rounded-full">
                {t("detect.comingSoon")}
              </Badge>
            )}

            {hasModel && diseases.length > 0 && (
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: isHovered ? 1 : 0, scale: isHovered ? 1 : 0.8 }}
                className="bg-black/50 backdrop-blur-md border border-white/10 text-white font-black text-[9px] uppercase tracking-widest px-3 py-1.5 rounded-full flex items-center gap-1.5"
              >
                <Zap className="w-2.5 h-2.5 text-primary" />
                {diseases.length}+ {t("detect.detectableDisease")}
              </motion.div>
            )}
          </div>

          {/* ── Content: Name + Description ── */}
          <div className="absolute inset-x-0 bottom-0 p-7 z-10 flex flex-col justify-end">
            <motion.div
              animate={{ y: isHovered ? -130 : 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="space-y-2"
            >
              <h3 className="text-3xl font-black text-white tracking-tight leading-none flex items-center gap-2">
                {translatedName}
                {hasModel && <ChevronRight className="w-6 h-6 text-primary animate-pulse" />}
              </h3>
              <p className="text-white/60 font-medium text-sm leading-relaxed line-clamp-2">{description}</p>
            </motion.div>

            {/* ── Disease List on hover ── */}
            {hasModel && (
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 30 }}
                transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
                className="absolute inset-x-7 bottom-7 space-y-3"
              >
                <p className="text-[9px] font-black uppercase tracking-[0.2em] text-white/40">
                  {t("detect.detectableDisease")}
                </p>
                <div className="flex flex-col gap-1.5">
                  {diseases.slice(0, 4).map((d) => (
                    <div key={d.name} className="flex items-center gap-2.5">
                      <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${SEVERITY_DOT[d.severity]}`} />
                      <span className="text-xs font-bold text-white/80 leading-none">{d.name}</span>
                      <span className={`ml-auto text-[8px] font-black uppercase px-1.5 py-0.5 rounded-full ${d.severity === "high" ? "bg-red-500/20 text-red-400" :
                          d.severity === "medium" ? "bg-amber-500/20 text-amber-400" :
                            "bg-green-500/20 text-green-400"
                        }`}>
                        {t(`severity.${d.severity}`)}
                      </span>
                    </div>
                  ))}
                  {diseases.length > 4 && (
                    <p className="text-[9px] font-black text-primary/60 uppercase tracking-widest mt-1">
                      +{diseases.length - 4} {t("detect.moreConditions")}
                    </p>
                  )}
                </div>

                <motion.div
                  className="flex items-center gap-2 text-primary font-black uppercase text-[10px] tracking-[0.2em] pt-2"
                  animate={{ x: isHovered ? 6 : 0 }}
                  transition={{ duration: 0.2 }}
                >
                  <div className="w-8 h-[2px] bg-primary" />
                  {t("detect.initializeDiagnosis")}
                </motion.div>
              </motion.div>
            )}
          </div>

          {/* ── Gloss effect ── */}
          <motion.div
            className="absolute inset-0 pointer-events-none z-20 rounded-[2.5rem]"
            animate={{
              background: isHovered
                ? "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0) 50%)"
                : "none",
            }}
            transition={{ duration: 0.4 }}
          />
        </Card>
      </motion.div>
    </motion.div>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
