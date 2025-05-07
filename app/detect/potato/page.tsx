"use client"

import PlantDiseaseDetectionPage from "@/components/plant-disease-detection-page"

export default function PotatoDetectPage() {
  return <PlantDiseaseDetectionPage plantType="potato" diseases={["Early Blight", "Late Blight", "Healthy"]} />
}

