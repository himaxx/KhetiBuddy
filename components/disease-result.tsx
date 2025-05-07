"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { AlertCircle, CheckCircle2 } from "lucide-react"

interface DiseaseResultProps {
  result: {
    plant: string
    disease: string
    confidence: number
    description: string
    treatment: string[]
    severity: string
  }
}

export default function DiseaseResult({ result }: DiseaseResultProps) {
  const { plant, disease, confidence, description, treatment, severity } = result

  const getSeverityColor = (severity: string) => {
    switch (severity.toLowerCase()) {
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

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold text-red-600 dark:text-red-400">{disease}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {confidence.toFixed(1)}% Confidence
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <p className="text-muted-foreground text-sm">Detected on {plant}</p>
          <Badge className={getSeverityColor(severity)}>{severity} Severity</Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-5 w-5 text-red-500" />
            <h3 className="font-medium">About this disease</h3>
          </div>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>

        <div className="space-y-2 pt-2">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-500" />
            <h3 className="font-medium">Treatment recommendations</h3>
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
            {treatment.map((item, index) => (
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
      </CardContent>
    </Card>
  )
}

