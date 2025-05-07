"use client"

import PlantDiseaseDetectionPage from "@/components/plant-disease-detection-page"

export default function AppleDetectPage() {
  return (
    <PlantDiseaseDetectionPage
      plantType="apple"
      diseases={["Apple Scab", "Black Rot", "Cedar Apple Rust", "Healthy"]}
    />
  )
}

