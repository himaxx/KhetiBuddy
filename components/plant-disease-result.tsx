"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Progress } from "@/components/ui/progress"
import { AlertCircle, CheckCircle2, Leaf, Info, Activity, ShieldAlert, Sparkles } from "lucide-react"
import type { Prediction } from "@/hooks/use-plant-disease-model"
import type { PlantType } from "@/hooks/use-plant-disease-model"
import { cn } from "@/lib/utils"

interface PlantDiseaseResultProps {
  predictions: Prediction[]
  plantType: PlantType
}

// Disease information database for all plants
const diseaseInfo = {
  // ... (keeping existing diseaseInfo data)
  "Apple Scab": {
    description: "Apple scab is a fungal disease caused by Venturia inaequalis. It appears as olive-green to brown spots on leaves and fruit, often with a velvety texture.",
    severity: "Moderate",
    treatment: [
      "Remove and destroy fallen leaves to reduce fungal spores",
      "Apply fungicides during the growing season",
      "Prune trees to improve air circulation",
      "Choose scab-resistant apple varieties"
    ],
  },
  "Apple Black Rot": {
    description: "Black rot is caused by the fungus Botryosphaeria obtusa. It affects leaves, fruit, and branches.",
    severity: "High",
    treatment: [
      "Prune out diseased branches during dry weather",
      "Remove mummified fruits from trees",
      "Apply fungicides during growing season",
      "Maintain tree vigor"
    ],
  },
  "Apple Rust": {
    description: "Cedar apple rust is caused by the fungus Gymnosporangium juniperi-virginianae.",
    severity: "Moderate",
    treatment: ["Remove cedar trees nearby", "Apply fungicides", "Choose rust-resistant varieties"],
  },
  "Apple Healthy": {
    description: "Your apple tree appears healthy with no signs of disease.",
    severity: "None",
    treatment: ["Regular maintenance", "Consistent watering", "Annual pruning"],
  },
  "Potato Early Blight": {
    description: "Early blight is caused by the fungus Alternaria solani. Dark spots with concentric rings.",
    severity: "Moderate",
    treatment: ["Remove infected leaves", "Apply fungicides", "Practice crop rotation"],
  },
  "Potato Late Blight": {
    description: "Late blight is caused by Phytophthora infestans. High severity oomycete disease.",
    severity: "High",
    treatment: ["Destroy infected plants immediately", "Apply fungicides preventatively", "Avoid overhead irrigation"],
  },
  "Potato Healthy": {
    description: "Your potato plant appears healthy.",
    severity: "None",
    treatment: ["Regular monitoring", "Water at base", "Hill soil around plants"],
  },
  "Tomato Bacterial Spot": {
    description: "Small, water-soaked spots caused by Xanthomonas species.",
    severity: "Moderate",
    treatment: ["Remove infected leaves", "Apply copper-based bactericides", "Avoid overhead watering"],
  },
  "Tomato Early Blight": {
    description: "Dark brown concentric rings on lower leaves.",
    severity: "Moderate",
    treatment: ["Remove infected leaves", "Apply fungicides", "Mulch around plants"],
  },
  "Tomato Late Blight": {
    description: "High severity water-soaked lesions.",
    severity: "High",
    treatment: ["Destroy infected plants immediately", "Apply fungicides", "Avoid overhead irrigation"],
  },
  "Tomato Leaf Mold": {
    description: "Pale green to yellow spots with fuzzy growth.",
    severity: "Moderate",
    treatment: ["Improve air circulation", "Reduce humidity", "Apply fungicides"],
  },
  "Tomato Septoria Leaf Spot": {
    description: "Circular spots with dark borders and tiny black fruiting bodies.",
    severity: "Moderate",
    treatment: ["Remove infected leaves", "Apply fungicides", "Mulch around plants"],
  },
  "Tomato Spider Mites": {
    description: "Tiny arachnids causing leaf stippling and webbing.",
    severity: "Moderate",
    treatment: ["Spray with strong water streams", "Apply insecticidal soap", "Increase humidity"],
  },
  "Tomato Target Spot": {
    description: "Brown circular lesions with concentric rings.",
    severity: "Moderate",
    treatment: ["Remove infected leaves", "Apply fungicides", "Proper plant spacing"],
  },
  "Tomato Mosaic Virus": {
    description: "Mottled patterns and leaf distortion.",
    severity: "High",
    treatment: ["Destroy infected plants", "Wash hands and tools", "Control aphid vectors"],
  },
  "Tomato Yellow Leaf Curl Virus": {
    description: "Upward curling and yellowing transmitted by whiteflies.",
    severity: "High",
    treatment: ["Destroy infected plants", "Control whitefly populations", "Use reflective mulches"],
  },
  "Tomato Healthy": {
    description: "Your tomato plant appears healthy.",
    severity: "None",
    treatment: ["Regular monitoring", "Consistent watering", "Apply balanced fertilizer"],
  },
}

export default function PlantDiseaseResult({ predictions, plantType }: PlantDiseaseResultProps) {
  const topPrediction = [...predictions].sort((a, b) => b.probability - a.probability)[0]

  if (!topPrediction) return null

  const diseaseName = topPrediction.className
  const confidence = topPrediction.probability * 100

  let formattedDiseaseName = diseaseName
  if (diseaseName.includes("___")) {
    const parts = diseaseName.split("___")
    formattedDiseaseName = `${parts[0]} ${parts[1].replace(/_/g, " ")}`
  }

  const info = diseaseInfo[formattedDiseaseName as keyof typeof diseaseInfo] || {
    description: "Detailed diagnostic information is being compiled for this condition.",
    severity: "Unknown",
    treatment: ["Consult with an agricultural expert", "Monitor progress carefully"],
  }

  const getSeverityBadge = (severity: string) => {
    switch (severity.toLowerCase()) {
      case "none":
        return <Badge className="bg-green-500/10 text-green-600 border-green-500/20">Optimal</Badge>
      case "low":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20">Minor</Badge>
      case "moderate":
        return <Badge className="bg-yellow-500/10 text-yellow-600 border-yellow-500/20">Moderate</Badge>
      case "high":
        return <Badge className="bg-red-500/10 text-red-600 border-red-500/20">Critical</Badge>
      default:
        return <Badge variant="outline">Determining</Badge>
    }
  }

  const isHealthy = diseaseName.toLowerCase().includes("healthy")

  let displayName = diseaseName
  if (diseaseName.includes("___")) {
    const parts = diseaseName.split("___")
    displayName = parts[1].replace(/_/g, " ")
  }

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
      <div className="relative h-48 w-full">
        <img
          src={`/plant-images-jpg/${plantType}.jpg`}
          alt={plantType}
          className="w-full h-full object-cover transition-transform duration-700 hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-card to-transparent" />
        <div className="absolute bottom-4 left-4 right-4 flex justify-between items-end">
          <div>
            <p className="text-xs font-bold uppercase tracking-widest text-primary/80 mb-1">Diagnostic Report</p>
            <h2 className="text-2xl font-black tracking-tight leading-none text-foreground">
              {displayName}
            </h2>
          </div>
          {isHealthy ? <Sparkles className="text-yellow-500 w-8 h-8 animate-pulse" /> : <ShieldAlert className="text-red-500 w-8 h-8" />}
        </div>
      </div>

      <CardHeader className="space-y-4 pb-0">
        <div className="space-y-1.5">
          <div className="flex justify-between items-center text-sm">
            <span className="font-bold text-muted-foreground">Confidence Score</span>
            <span className="font-black text-primary">{confidence.toFixed(1)}%</span>
          </div>
          <Progress value={confidence} className="h-2 bg-primary/10" />
        </div>

        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary" className="rounded-md font-bold uppercase text-[10px] tracking-tighter">
            {plantType}
          </Badge>
          {getSeverityBadge(info.severity)}
          <Badge variant="outline" className="rounded-md font-bold uppercase text-[10px] tracking-tighter">
            Ref: KH-{Math.floor(Math.random() * 9000) + 1000}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="pt-6 space-y-6">
        <div className="p-4 rounded-2xl bg-muted/50 border border-border/50 space-y-3">
          <div className="flex items-center gap-2 text-primary">
            <Info className="w-4 h-4" />
            <h3 className="text-sm font-bold uppercase tracking-tight">Condition Analysis</h3>
          </div>
          <p className="text-sm leading-relaxed text-muted-foreground font-medium italic">
            "{info.description}"
          </p>
        </div>

        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-primary" />
            <h3 className="font-bold tracking-tight">
              {isHealthy ? "Care Excellence Plan" : "Clinical Action Steps"}
            </h3>
          </div>

          <div className="grid gap-3">
            {info.treatment.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 p-3 rounded-xl hover:bg-primary/5 transition-colors border border-transparent hover:border-primary/20 group"
              >
                <div className="w-6 h-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-[10px] font-black group-hover:scale-110 transition-transform">
                  {i + 1}
                </div>
                <p className="text-sm font-medium leading-tight pt-1">
                  {step}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {predictions.length > 1 && (
          <div className="pt-4 border-t space-y-3">
            <h3 className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Differential Analysis</h3>
            <div className="grid gap-2">
              {predictions
                .filter((p) => p.className !== topPrediction.className)
                .sort((a, b) => b.probability - a.probability)
                .slice(0, 2)
                .map((p, i) => {
                  let name = p.className
                  if (name.includes("___")) name = name.split("___")[1].replace(/_/g, " ")
                  return (
                    <div key={i} className="flex justify-between items-center text-xs p-2 rounded-lg bg-muted/30">
                      <span className="font-bold opacity-70">{name}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-muted rounded-full overflow-hidden">
                          <div className="h-full bg-primary/40" style={{ width: `${p.probability * 100}%` }} />
                        </div>
                        <span className="font-mono text-[10px]">{(p.probability * 100).toFixed(1)}%</span>
                      </div>
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


