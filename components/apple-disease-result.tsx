"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Leaf } from "lucide-react"
import type { Prediction } from "@/hooks/use-apple-disease-model"

interface AppleDiseaseResultProps {
  predictions: Prediction[]
}

// Disease information database
const diseaseInfo = {
  "Apple Scab": {
    description:
      "Apple scab is a fungal disease caused by Venturia inaequalis. It appears as olive-green to brown spots on leaves and fruit, often with a velvety texture.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy fallen leaves to reduce fungal spores",
      "Apply fungicides during the growing season, especially in wet conditions",
      "Prune trees to improve air circulation",
      "Choose scab-resistant apple varieties for new plantings",
    ],
  },
  "Apple Black Rot": {
    description:
      "Black rot is caused by the fungus Botryosphaeria obtusa. It affects leaves, fruit, and branches, causing leaf spots, fruit rot, and branch cankers.",
    severity: "High",
    treatment: [
      "Prune out diseased branches and cankers during dry weather",
      "Remove mummified fruits from trees and ground",
      "Apply fungicides during the growing season",
      "Maintain tree vigor through proper fertilization and watering",
    ],
  },
  "Apple Rust": {
    description:
      "Cedar apple rust is caused by the fungus Gymnosporangium juniperi-virginianae. It creates bright orange-yellow spots on leaves and occasionally on fruit.",
    severity: "Moderate",
    treatment: [
      "Remove cedar or juniper trees within 1/2 mile if possible",
      "Apply fungicides in spring before and during infection periods",
      "Choose rust-resistant apple varieties",
      "Maintain good air circulation around trees",
    ],
  },
  "Apple Healthy": {
    description:
      "Your apple tree appears healthy with no signs of disease. Healthy apple trees have vibrant green leaves, strong branches, and develop normal fruit.",
    severity: "None",
    treatment: [
      "Continue regular maintenance and monitoring",
      "Water consistently, especially during dry periods",
      "Apply balanced fertilizer as needed",
      "Prune annually to maintain tree shape and air circulation",
    ],
  },
}

export default function AppleDiseaseResult({ predictions }: AppleDiseaseResultProps) {
  // Find the prediction with highest probability
  const topPrediction = [...predictions].sort((a, b) => b.probability - a.probability)[0]

  if (!topPrediction) {
    return null
  }

  const diseaseName = topPrediction.className
  const confidence = topPrediction.probability * 100
  const info = diseaseInfo[diseaseName as keyof typeof diseaseInfo] || {
    description: "Information not available for this condition.",
    severity: "Unknown",
    treatment: ["Consult with a plant pathologist for specific treatment options."],
  }

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "none":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "low":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
      case "moderate":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
      case "high":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
      default:
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300"
    }
  }

  const isHealthy = diseaseName === "Apple Healthy"

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle
            className={`text-2xl font-bold ${isHealthy ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {diseaseName}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {confidence.toFixed(1)}% Confidence
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Detected on Apple</p>
          <Badge className={getSeverityColor(info.severity)}>{info.severity} Severity</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {isHealthy ? <Leaf className="h-5 w-5 text-green-500" /> : <AlertCircle className="h-5 w-5 text-red-500" />}
            <h3 className="font-medium">{isHealthy ? "Healthy Plant" : "About this disease"}</h3>
          </div>
          <p className="text-sm text-muted-foreground">{info.description}</p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">{isHealthy ? "Maintenance tips" : "Treatment recommendations"}</h3>
          </div>

          <motion.ul
            className="space-y-2 mt-2"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: {
                opacity: 1,
                transition: {
                  staggerChildren: 0.1,
                },
              },
            }}
          >
            {info.treatment.map((item, index) => (
              <motion.li
                key={index}
                className="flex items-start gap-2 text-sm"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0 },
                }}
              >
                <span className="h-5 w-5 rounded-full bg-green-100 text-green-800 flex items-center justify-center flex-shrink-0 text-xs font-medium">
                  {index + 1}
                </span>
                {item}
              </motion.li>
            ))}
          </motion.ul>
        </div>

        {/* Other predictions */}
        {predictions.length > 1 && (
          <div className="space-y-2 pt-4 border-t">
            <h3 className="text-sm font-medium">Other possibilities:</h3>
            <div className="space-y-1">
              {predictions
                .filter((p) => p.className !== topPrediction.className)
                .sort((a, b) => b.probability - a.probability)
                .map((prediction, index) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span>{prediction.className}</span>
                    <span className="text-muted-foreground">{(prediction.probability * 100).toFixed(1)}%</span>
                  </div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

