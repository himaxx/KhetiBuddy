"use client"

import PlantDiseaseDetectionPage from "@/components/plant-disease-detection-page"

export default function GrapeDetectPage() {
  return (
    <PlantDiseaseDetectionPage
      plantType="grape"
      diseases={["Black Rot", "Esca (Black Measles)", "Isariopsis Leaf Spot", "Healthy"]}
    />
  )
}

