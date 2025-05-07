"use client"

import PlantDiseaseDetectionPage from "@/components/plant-disease-detection-page"

export default function CornDetectPage() {
  return <PlantDiseaseDetectionPage plantType="corn" diseases={["Cercospora Leaf Spot (Grey Leaf Spot)", "Healthy"]} />
}

