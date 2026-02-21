"use client"

import { useState, useRef } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import ProcessingAnimation from "@/components/processing-animation"
import ChatbotModal from "@/components/chatbot-modal"
import { ArrowLeft, MessageSquare, Upload, Camera, Sparkles, Activity, Search, ShieldCheck } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import WebcamDiseaseDetector from "@/components/webcam-disease-detector"
import PlantDiseaseResult from "@/components/plant-disease-result"
import { usePlantDiseaseModel, type Prediction, type PlantType } from "@/hooks/use-plant-disease-model"
import { Badge } from "@/components/ui/badge"

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

  const { predict, isModelLoaded, loadModel } = usePlantDiseaseModel(plantType)

  const handleImageUpload = async (imageData: string) => {
    setImage(imageData)
    setIsProcessing(true)

    try {
      const img = new Image()
      img.src = imageData
      img.crossOrigin = "anonymous"

      await new Promise<void>((resolve, reject) => {
        img.onload = () => resolve()
        img.onerror = () => reject(new Error("Failed to load image"))
      })

      if (!isModelLoaded) {
        await loadModel()
      }

      const results = await predict(img)
      setPredictions(results)
    } catch (err) {
      console.error("Prediction error:", err)
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

  const plantDisplayName = plantType.charAt(0).toUpperCase() + plantType.slice(1)

  return (
    <FallingLeavesBackground>
      <div className="container max-w-7xl py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
            <div className="flex items-center gap-6">
              <Button
                variant="outline"
                size="icon"
                onClick={() => router.push("/detect")}
                className="w-14 h-14 rounded-2xl border-2 hover:bg-primary/5 transition-all shadow-lg"
              >
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div className="space-y-1">
                <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 w-fit">
                  <Activity className="w-3 h-3" />
                  Neural Diagnostic
                </Badge>
                <h1 className="text-4xl font-black tracking-tight leading-none">
                  {plantDisplayName} <span className="text-primary/70">{t("detect.title")}</span>
                </h1>
              </div>
            </div>

            <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
                <TabsList className="bg-transparent h-12 gap-2">
                  <TabsTrigger value="upload" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold">
                    <Upload className="w-4 h-4 mr-2" />
                    Gallery
                  </TabsTrigger>
                  <TabsTrigger value="camera" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold">
                    <Camera className="w-4 h-4 mr-2" />
                    Live
                  </TabsTrigger>
                </TabsList>
              </Tabs>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
            <div className="lg:col-span-12 space-y-8">
              <Tabs value={activeTab} className="w-full">
                <TabsContent value="upload">
                  {!image ? (
                    <div className="py-12">
                      <EnhancedImageUploader
                        onImageUpload={handleImageUpload}
                        title={`Scan ${plantDisplayName} Specimen`}
                        className="max-w-3xl"
                      />
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="space-y-6"
                      >
                        <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                          <div className="relative aspect-square">
                            <img
                              src={image}
                              alt="Specimen"
                              className="w-full h-full object-cover"
                            />
                            <div className="absolute inset-x-6 bottom-6">
                              <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center justify-between text-white shadow-2xl">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                    <Search className="w-5 h-5 text-primary" />
                                  </div>
                                  <div className="text-left">
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">Status</p>
                                    <p className="text-sm font-bold">Specimen Loaded</p>
                                  </div>
                                </div>
                                <Button variant="destructive" size="sm" onClick={resetState} className="rounded-xl font-bold bg-white/10 hover:bg-red-500 transition-colors">
                                  Reset
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Card>
                      </motion.div>

                      <div className="space-y-8">
                        {isProcessing ? (
                          <Card className="rounded-[2.5rem] border-none bg-muted/30 backdrop-blur-sm min-h-[400px] flex items-center justify-center p-12">
                            <div className="text-center space-y-6">
                              <div className="relative inline-block">
                                <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                              </div>
                              <div className="space-y-2">
                                <h3 className="text-2xl font-black italic tracking-tight">Synchronizing Neural Grids...</h3>
                                <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Processing layer 4 of 128</p>
                              </div>
                            </div>
                          </Card>
                        ) : predictions.length > 0 && (
                          <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}>
                            <PlantDiseaseResult predictions={predictions} plantType={plantType} />
                            <div className="mt-8 flex justify-end">
                              <Button onClick={() => setIsChatOpen(true)} size="xl" className="rounded-2xl font-bold shadow-2xl shadow-primary/20">
                                <MessageSquare className="mr-3 w-5 h-5" />
                                Consult Neural Advisor
                              </Button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    </div>
                  )}
                </TabsContent>

                <TabsContent value="camera">
                  <div className="max-w-4xl mx-auto space-y-8">
                    <Card className="overflow-hidden rounded-[3rem] border-none shadow-2xl">
                      <WebcamDiseaseDetector plantType={plantType} onResult={handleWebcamResult} />
                    </Card>

                    {predictions.length > 0 && (
                      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                        <PlantDiseaseResult predictions={predictions} plantType={plantType} />
                        <div className="flex justify-center">
                          <Button onClick={() => setIsChatOpen(true)} size="xl" className="rounded-2xl font-bold shadow-2xl shadow-primary/20">
                            <MessageSquare className="mr-3 w-5 h-5" />
                            Real-time Consultation
                          </Button>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
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
