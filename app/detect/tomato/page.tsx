"use client"

import PlantDiseaseDetectionPage from "@/components/plant-disease-detection-page"

export default function TomatoDetectPage() {
  return (
    <PlantDiseaseDetectionPage
      plantType="tomato"
      diseases={[
        "Bacterial Spot",
        "Early Blight",
        "Late Blight",
        "Leaf Mold",
        "Septoria Leaf Spot",
        "Spider Mites",
        "Target Spot",
        "Mosaic Virus",
        "Yellow Leaf Curl Virus",
        "Healthy",
      ]}
    />
  )
}

