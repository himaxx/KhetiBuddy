"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2, Leaf } from "lucide-react"
import type { Prediction } from "@/hooks/use-plant-disease-model"
import type { PlantType } from "@/hooks/use-plant-disease-model"

interface PlantDiseaseResultProps {
  predictions: Prediction[]
  plantType: PlantType
}

// Disease information database for all plants
const diseaseInfo = {
  // Apple diseases
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

  // Potato diseases
  "Potato Early Blight": {
    description:
      "Early blight is caused by the fungus Alternaria solani. It appears as dark brown to black lesions with concentric rings on lower leaves first.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides labeled for early blight",
      "Ensure proper plant spacing for good air circulation",
      "Practice crop rotation, avoiding planting potatoes in the same area for 2-3 years",
    ],
  },
  "Potato Late Blight": {
    description:
      "Late blight is caused by the oomycete Phytophthora infestans. It appears as water-soaked lesions that quickly turn brown to black, often with a white fuzzy growth on leaf undersides.",
    severity: "High",
    treatment: [
      "Remove and destroy infected plants immediately",
      "Apply fungicides preventatively before disease appears",
      "Avoid overhead irrigation",
      "Plant resistant varieties when available",
    ],
  },
  "Potato Healthy": {
    description:
      "Your potato plant appears healthy with no signs of disease. Healthy potato plants have vibrant green leaves and strong stems.",
    severity: "None",
    treatment: [
      "Continue regular monitoring for early signs of disease",
      "Water consistently at the base of plants",
      "Apply balanced fertilizer as needed",
      "Hill soil around plants as they grow",
    ],
  },

  // Tomato diseases
  "Tomato Bacterial Spot": {
    description:
      "Bacterial spot is caused by Xanthomonas species. It appears as small, water-soaked spots that enlarge and turn dark brown with a yellow halo.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy infected leaves",
      "Apply copper-based bactericides",
      "Avoid overhead watering",
      "Practice crop rotation",
    ],
  },
  "Tomato Early Blight": {
    description:
      "Early blight is caused by the fungus Alternaria solani. It appears as dark brown concentric rings on lower leaves first.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides labeled for early blight",
      "Mulch around plants to prevent soil splash",
      "Ensure proper plant spacing",
    ],
  },
  "Tomato Late Blight": {
    description:
      "Late blight is caused by Phytophthora infestans. It appears as water-soaked lesions that quickly turn brown to black with white fuzzy growth in humid conditions.",
    severity: "High",
    treatment: [
      "Remove and destroy infected plants immediately",
      "Apply fungicides preventatively",
      "Avoid overhead irrigation",
      "Ensure good air circulation",
    ],
  },
  "Tomato Leaf Mold": {
    description:
      "Leaf mold is caused by the fungus Passalora fulva. It appears as pale green to yellow spots on upper leaf surfaces with olive-green to grayish-brown fuzzy growth on undersides.",
    severity: "Moderate",
    treatment: [
      "Improve air circulation around plants",
      "Reduce humidity in greenhouses",
      "Apply fungicides labeled for leaf mold",
      "Remove and destroy infected leaves",
    ],
  },
  "Tomato Septoria Leaf Spot": {
    description:
      "Septoria leaf spot is caused by the fungus Septoria lycopersici. It appears as small, circular spots with dark borders and light centers, often with tiny black fruiting bodies.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides at first sign of disease",
      "Mulch around plants to prevent soil splash",
      "Practice crop rotation",
    ],
  },
  "Tomato Spider Mites": {
    description:
      "Spider mites are tiny arachnids that cause stippling on leaves, which may turn yellow and drop. Fine webbing may be visible on undersides of leaves.",
    severity: "Moderate",
    treatment: [
      "Spray plants with strong streams of water to dislodge mites",
      "Apply insecticidal soap or horticultural oil",
      "Introduce predatory mites for biological control",
      "Increase humidity around plants",
    ],
  },
  "Tomato Target Spot": {
    description:
      "Target spot is caused by the fungus Corynespora cassiicola. It appears as brown circular lesions with concentric rings and yellow halos.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy infected leaves",
      "Apply fungicides labeled for target spot",
      "Ensure proper plant spacing",
      "Avoid overhead irrigation",
    ],
  },
  "Tomato Mosaic Virus": {
    description:
      "Tomato mosaic virus causes mottled light and dark green patterns on leaves, often with leaf distortion and stunted growth.",
    severity: "High",
    treatment: [
      "Remove and destroy infected plants",
      "Wash hands and tools after handling infected plants",
      "Control aphids and other potential vectors",
      "Plant resistant varieties",
    ],
  },
  "Tomato Yellow Leaf Curl Virus": {
    description:
      "Yellow leaf curl virus causes upward curling and yellowing of leaves, stunted growth, and flower drop. It is transmitted by whiteflies.",
    severity: "High",
    treatment: [
      "Remove and destroy infected plants",
      "Control whitefly populations",
      "Use reflective mulches to repel whiteflies",
      "Plant resistant varieties",
    ],
  },
  "Tomato Healthy": {
    description:
      "Your tomato plant appears healthy with no signs of disease. Healthy tomato plants have vibrant green leaves and strong stems.",
    severity: "None",
    treatment: [
      "Continue regular monitoring for early signs of disease",
      "Water consistently at the base of plants",
      "Provide support for growing plants",
      "Apply balanced fertilizer as needed",
    ],
  },

  // Grape diseases
  "Grape Black Rot": {
    description:
      "Black rot is caused by the fungus Guignardia bidwellii. It appears as small, brown circular lesions on leaves and black, shriveled fruit.",
    severity: "High",
    treatment: [
      "Remove mummified fruit and infected leaves",
      "Apply fungicides from bud break until veraison",
      "Ensure good air circulation through proper pruning",
      "Control weeds around vines",
    ],
  },
  "Grape Esca (Black Measles)": {
    description:
      "Esca is a complex disease caused by several fungi. It appears as tiger-striped leaf discoloration and black spots on fruit.",
    severity: "High",
    treatment: [
      "Remove and destroy infected wood",
      "Protect pruning wounds with fungicidal paint",
      "Avoid pruning during wet weather",
      "Maintain vine vigor through proper nutrition",
    ],
  },
  "Grape Isariopsis Leaf Spot": {
    description:
      "Isariopsis leaf spot (also known as grape leaf blight) is caused by the fungus Pseudocercospora vitis. It appears as irregularly shaped, reddish-brown spots on leaves.",
    severity: "Moderate",
    treatment: [
      "Apply fungicides at first sign of disease",
      "Remove and destroy infected leaves",
      "Ensure good air circulation",
      "Practice proper canopy management",
    ],
  },
  "Grape Healthy": {
    description:
      "Your grape vine appears healthy with no signs of disease. Healthy grape vines have vibrant green leaves and develop normal fruit clusters.",
    severity: "None",
    treatment: [
      "Continue regular monitoring for early signs of disease",
      "Prune annually for proper air circulation",
      "Water consistently at the base of plants",
      "Apply balanced fertilizer as needed",
    ],
  },

  // Corn diseases
  "Corn Cercospora Leaf Spot (Grey Leaf Spot)": {
    description:
      "Grey leaf spot is caused by the fungus Cercospora zeae-maydis. It appears as rectangular, grayish-brown lesions that follow leaf veins.",
    severity: "Moderate",
    treatment: [
      "Plant resistant hybrids",
      "Practice crop rotation",
      "Apply fungicides in high-risk situations",
      "Implement conservation tillage practices",
    ],
  },
  "Corn Healthy": {
    description:
      "Your corn plant appears healthy with no signs of disease. Healthy corn plants have vibrant green leaves and strong stalks.",
    severity: "None",
    treatment: [
      "Continue regular monitoring for early signs of disease",
      "Ensure proper soil fertility",
      "Water consistently during critical growth stages",
      "Control weeds that may harbor pests and diseases",
    ],
  },
}

export default function PlantDiseaseResult({ predictions, plantType }: PlantDiseaseResultProps) {
  // Find the prediction with highest probability
  const topPrediction = [...predictions].sort((a, b) => b.probability - a.probability)[0]

  if (!topPrediction) {
    return null
  }

  const diseaseName = topPrediction.className
  const confidence = topPrediction.probability * 100

  // Format the disease name for lookup in the diseaseInfo object
  // This handles cases where the model might return "Potato___Early_Blight" format
  let formattedDiseaseName = diseaseName
  if (diseaseName.includes("___")) {
    const parts = diseaseName.split("___")
    formattedDiseaseName = `${parts[0]} ${parts[1].replace(/_/g, " ")}`
  }

  const info = diseaseInfo[formattedDiseaseName as keyof typeof diseaseInfo] || {
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

  const isHealthy = diseaseName.toLowerCase().includes("healthy")

  // Format display name
  let displayName = diseaseName
  if (diseaseName.includes("___")) {
    const parts = diseaseName.split("___")
    displayName = parts[1].replace(/_/g, " ")
  }

  return (
    <Card>
      {/* Plant image at the top */}
      <img
        src={`/plant-images-jpg/${plantType}.jpg`}
        alt={`${plantType} plant`}
        className="w-full h-40 object-cover rounded-t-lg"
        style={{ objectFit: 'cover' }}
      />
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle
            className={`text-2xl font-bold ${isHealthy ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"}`}
          >
            {displayName}
          </CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {confidence.toFixed(1)}% Confidence
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">
            Detected on {plantType.charAt(0).toUpperCase() + plantType.slice(1)}
          </p>
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
                .map((prediction, index) => {
                  // Format display name for other predictions
                  let otherDisplayName = prediction.className
                  if (prediction.className.includes("___")) {
                    const parts = prediction.className.split("___")
                    otherDisplayName = parts[1].replace(/_/g, " ")
                  }

                  return (
                    <div key={index} className="flex justify-between text-sm">
                      <span>{otherDisplayName}</span>
                      <span className="text-muted-foreground">{(prediction.probability * 100).toFixed(1)}%</span>
                    </div>
                  )
                })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

