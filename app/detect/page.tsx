"use client"

import { motion } from "framer-motion"
import { AlertTriangle } from "lucide-react"
import PlantSelectionGrid from "@/components/plant-selection-grid"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"

export default function DetectPage() {
  const { t } = useLanguage()

  return (
    <FallingLeavesBackground>
      <div className="container max-w-6xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{t("detect.title")}</h1>
          </div>

          <p className="text-muted-foreground text-lg max-w-3xl">{t("detect.subtitle")}</p>

          <div className="mt-8">
            <h2 className="text-xl font-semibold mb-6">{t("detect.selectPlant")}</h2>
            <PlantSelectionGrid />
          </div>
        </motion.div>
      </div>
    </FallingLeavesBackground>
  )
}

