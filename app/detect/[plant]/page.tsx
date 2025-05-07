"use client"

import { useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import ProcessingAnimation from "@/components/processing-animation"
import DiseaseResult from "@/components/disease-result"
import ChatbotModal from "@/components/chatbot-modal"
import { AlertTriangle, ArrowLeft, MessageSquare } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import PlaceholderImage from "@/components/placeholder-image"

export default function PlantDetectPage() {
  const params = useParams()
  const router = useRouter()
  const { t } = useLanguage()
  const plantId = params.plant as string

  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)

  const handleImageUpload = (imageData: string) => {
    setImage(imageData)
    setIsProcessing(true)
    setCurrentStep(2)

    // Simulate processing delay with multiple steps
    setTimeout(() => {
      setCurrentStep(3)

      setTimeout(() => {
        setIsProcessing(false)
        setResult({
          plant: t(`plant.${plantId}`),
          disease: plantId === "tomato" ? "Early Blight" : "Leaf Spot",
          confidence: 94.2,
          description:
            plantId === "tomato"
              ? "Early blight is a common fungal disease that affects tomato plants. It's characterized by brown spots with concentric rings that appear on lower leaves first."
              : "Leaf spot is a common disease characterized by brown or black spots on leaves. It can be caused by various fungi or bacteria.",
          treatment: [
            "Remove and destroy infected leaves",
            "Apply fungicide according to package directions",
            "Ensure proper spacing between plants for air circulation",
            "Water at the base of plants to keep foliage dry",
          ],
          severity: "Moderate",
        })
      }, 2000)
    }, 2000)
  }

  const resetState = () => {
    setImage(null)
    setResult(null)
    setIsProcessing(false)
    setCurrentStep(1)
  }

  const goBack = () => {
    router.push("/detect")
  }

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
              {t(`plant.${plantId}`)} {t("detect.title")}
            </h1>
          </div>

          <div className="flex items-center mb-6">
            <PlaceholderImage
              src={`/public/plant-images-jpg/${plantId}.jpg`}
              alt={t(`plant.${plantId}`)}
              width={80}
              height={80}
              className="rounded-md mr-4"
            />
            <p className="text-muted-foreground text-sm sm:text-lg max-w-3xl">{t("detect.subtitle")}</p>
          </div>

          <Tabs defaultValue="upload" className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload">{t("detect.uploadImage")}</TabsTrigger>
              <TabsTrigger value="camera">{t("detect.useCamera")}</TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              {!image ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <EnhancedImageUploader
                    onImageUpload={handleImageUpload}
                    title={`Upload a ${t(`plant.${plantId}`)} leaf image`}
                  />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <Card>
                      <CardContent className="p-6">
                        <img
                          src={image || "/public/plant-images/tomato.svg"}
                          alt="Uploaded plant"
                          className="w-full h-auto rounded-lg object-cover max-h-[400px]"
                        />
                      </CardContent>
                    </Card>

                    {isProcessing ? (
                      <Card>
                        <CardContent className="flex items-center justify-center p-6 min-h-[400px]">
                          <ProcessingAnimation
                            text={currentStep === 2 ? "Analyzing leaf patterns..." : "Identifying disease markers..."}
                            step={currentStep}
                            totalSteps={3}
                          />
                        </CardContent>
                      </Card>
                    ) : (
                      result && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <DiseaseResult result={result} />
                        </motion.div>
                      )
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row justify-between gap-4">
                    <Button variant="outline" onClick={resetState}>
                      {t("detect.uploadAnother")}
                    </Button>

                    {result && (
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
              <Card>
                <CardContent className="flex flex-col items-center justify-center p-6 min-h-[400px]">
                  <p className="text-muted-foreground">Camera functionality coming soon!</p>
                  <Button className="mt-4" variant="outline">
                    Switch to Upload
                  </Button>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ChatbotModal
        isOpen={isChatOpen}
        onClose={() => setIsChatOpen(false)}
        plantName={result?.plant}
        disease={result?.disease}
      />
    </FallingLeavesBackground>
  )
}

