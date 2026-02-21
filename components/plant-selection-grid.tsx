"use client"

import { motion } from "framer-motion"
import PlantSelectionCard from "./plant-selection-card"
import { useLanguage } from "@/contexts/language-context"

export default function PlantSelectionGrid() {
  const { t } = useLanguage()

  // Descriptions use t() — each one is now i18n-aware
  const plants = [
    {
      id: "tomato",
      image: "/plant-images-jpg/tomato.jpg",
      description: t("plant.tomato.desc"),
      hasModel: true,
    },
    {
      id: "potato",
      image: "/plant-images-jpg/potato.jpg",
      description: t("plant.potato.desc"),
      hasModel: true,
    },
    {
      id: "corn",
      image: "/plant-images-jpg/corn.jpg",
      description: t("plant.corn.desc"),
      hasModel: true,
    },
    {
      id: "apple",
      image: "/plant-images-jpg/apple.jpg",
      description: t("plant.apple.desc"),
      hasModel: true,
    },
    {
      id: "grape",
      image: "/plant-images-jpg/grape.jpg",
      description: t("plant.grape.desc"),
      hasModel: true,
    },
    {
      id: "rice",
      image: "/plant-images-jpg/rice.jpg",
      description: t("plant.rice.desc"),
      hasModel: true,
    },
    {
      id: "wheat",
      image: "/plant-images-jpg/wheat.jpg",
      description: t("plant.wheat.desc"),
      hasModel: true,
    },
    {
      id: "cotton",
      image: "/plant-images-jpg/cotton.jpg",
      description: t("plant.cotton.desc"),
      hasModel: true,
    },
  ]

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }}>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {plants.map((plant, index) => (
          <motion.div
            key={plant.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: index * 0.1 }}
          >
            <PlantSelectionCard
              id={plant.id}
              name={t(`plant.${plant.id}`)}
              image={plant.image}
              description={plant.description}
              hasModel={plant.hasModel}
            />
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}
