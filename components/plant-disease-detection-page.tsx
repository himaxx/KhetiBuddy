"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import ProcessingAnimation from "@/components/processing-animation"
import ChatbotModal from "@/components/chatbot-modal"
import { AlertTriangle, ArrowLeft, MessageSquare, Upload, Camera } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import PlaceholderImage from "@/components/placeholder-image"
import WebcamDiseaseDetector from "@/components/webcam-disease-detector"
import PlantDiseaseResult from "@/components/plant-disease-result"
import { usePlantDiseaseModel, type Prediction, type PlantType } from "@/hooks/use-plant-disease-model"

interface PlantDiseaseDetectionPageProps {
  plantType: PlantType
  diseases: string[]
}

export default function PlantDiseaseDetectionPage({ plantType, diseases }: PlantDiseaseDetectionPageProps) {
  const router = useRouter()
  const { t } = useLanguage()
  const [activeTab, setActiveTab] = useState<string>("upload")
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])
  const [isChatOpen, setIsChatOpen] = useState(false)

  const { predict, isModelLoaded, isLoading, error, loadModel } = usePlantDiseaseModel(plantType)
  const imageRef = useRef<HTMLImageElement>(null)

  const handleImageUpload = async (imageData: string) => {
    setImage(imageData)
    setIsProcessing(true)

    try {
      // Create an image element for prediction
      const img = new Image()
      img.src = imageData
      img.crossOrigin = "anonymous"

      // Wait for the image to load
      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
      })

      // Check if model is loaded
      if (!isModelLoaded) {
        console.log("Model not loaded yet, attempting to load...")
        await loadModel()
      }

      // Make prediction with the image
      const results = await predict(img)
      setPredictions(results)
    } catch (err) {
      console.error("Prediction error:", err)
      // You could show an error message to the user here
    } finally {
      setIsProcessing(false)
    }
  }

  const handleWebcamResult = (results: Prediction[]) => {
    setPredictions(results)
  }

  const resetState = () => {
    setImage(null)
    setPredictions([])
    setIsProcessing(false)
  }

  const goBack = () => {
    router.push("/detect")
  }

  const getTopDisease = (): string => {
    if (!predictions.length) return ""

    const topPrediction = [...predictions].sort((a, b) => b.probability - a.probability)[0]
    let displayName = topPrediction.className
    if (displayName.includes("___")) {
      const parts = displayName.split("___")
      displayName = parts[1].replace(/_/g, " ")
    }
    return displayName
  }

  // Format plant name for display
  const plantDisplayName = plantType.charAt(0).toUpperCase() + plantType.slice(1)

  // Format diseases list for display
  const diseasesText = diseases.join(", ")

  return (
    <FallingLeavesBackground>
      <div className="container max-w-6xl py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-6"
        >
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" onClick={goBack} className="mr-2">
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <AlertTriangle className="h-6 w-6 text-primary" />
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight truncate">
              {plantDisplayName} {t("detect.title")}
            </h1>
          </div>

          <div className="flex items-center mb-6">
            <PlaceholderImage
              src={`/plant-images-jpg/${plantType}.jpg`}
              alt={plantDisplayName}
              width={80}
              height={80}
              className="rounded-md mr-4"
            />
            <div>
              <p className="text-muted-foreground text-sm sm:text-lg max-w-3xl">
                Detect common {plantType} diseases using our trained AI model.
              </p>
              <p className="text-xs text-muted-foreground mt-1">Model can detect: {diseasesText}</p>
            </div>
          </div>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">
                <Upload className="h-4 w-4 mr-2" />
                {t("detect.uploadImage")}
              </TabsTrigger>
              <TabsTrigger value="camera">
                <Camera className="h-4 w-4 mr-2" />
                {t("detect.useCamera")}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              {!image ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <EnhancedImageUploader
                    onImageUpload={handleImageUpload}
                    title={`Upload a ${plantDisplayName} leaf image`}
                  />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardContent className="p-6">
                        <img
                          ref={imageRef}
                          src={image || "/public/plant-images-jpg/tomato.jpg"}
                          alt={`Uploaded ${plantType} leaf`}
                          className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                          crossOrigin="anonymous"
                        />
                      </CardContent>
                    </Card>

                    {isProcessing ? (
                      <Card>
                        <CardContent className="flex items-center justify-center p-6 min-h-[400px]">
                          <ProcessingAnimation
                            text={isModelLoaded ? "Analyzing leaf patterns..." : "Loading disease detection model..."}
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      predictions.length > 0 && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <PlantDiseaseResult predictions={predictions} plantType={plantType} />
                        </motion.div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button variant="outline" onClick={resetState}>
                      {t("detect.uploadAnother")}
                    </Button>

                    {predictions.length > 0 && (
                      <Button onClick={() => setIsChatOpen(true)} className="group">
                        <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        {t("detect.getTreatment")}
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="camera" className="mt-6">
              <WebcamDiseaseDetector plantType={plantType} onResult={handleWebcamResult} />

              {predictions.length > 0 && (
                <div className="mt-6">
                  <PlantDiseaseResult predictions={predictions} plantType={plantType} />

                  <div className="mt-4 flex justify-end">
                    <Button onClick={() => setIsChatOpen(true)} className="group">
                      <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                      {t("detect.getTreatment")}
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plantName={plantDisplayName}
        disease={getTopDisease()}
      />
    </FallingLeavesBackground>
  )
}

