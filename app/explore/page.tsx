"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import PlantPreview from "@/components/plant-preview"
import PlantInfo from "@/components/plant-info"
import ProcessingAnimation from "@/components/processing-animation"
import ChatbotModal from "@/components/chatbot-modal"
import { Leaf, MessageSquare } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import ExploreChatbotSection from "@/components/explore-chatbot-section"

// Update the component to include the chatbot section
export default function ExplorePage() {
  const { t } = useLanguage()
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"upload" | "chat">("upload")

  const handleImageUpload = (imageData: string) => {
    setImage(imageData)
    setIsProcessing(true)

    // Simulate processing delay
    setTimeout(() => {
      setIsProcessing(false)
      setResult({
        name: "Monstera Deliciosa",
        confidence: 98.7,
        info: {
          commonName: "Swiss Cheese Plant",
          scientificName: "Monstera Deliciosa",
          family: "Araceae",
          origin: "Central America",
          care: {
            light: "Bright, indirect light",
            water: "Allow soil to dry between waterings",
            humidity: "Prefers high humidity",
            temperature: "65-85°F (18-29°C)",
          },
        },
      })
    }, 3000)
  }

  const resetState = () => {
    setImage(null)
    setResult(null)
    setIsProcessing(false)
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
            <Leaf className="h-6 w-6 text-primary" />
            <h1 className="text-3xl font-bold tracking-tight">{t("nav.explore")}</h1>
          </div>

          <p className="text-muted-foreground text-lg max-w-3xl">
            Upload a photo of any plant leaf to identify the species, get detailed information about care requirements,
            or chat with our AI assistant.
          </p>

          <Tabs
            defaultValue={activeSection}
            onValueChange={(value) => setActiveSection(value as "upload" | "chat")}
            className="w-full"
          >
            <TabsList className="grid w-full max-w-md grid-cols-2">
              <TabsTrigger value="upload" className="flex items-center gap-2">
                <Leaf className="h-4 w-4" />
                {t("detect.uploadImage")}
              </TabsTrigger>
              <TabsTrigger value="chat" className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4" />
                Chat with AI
              </TabsTrigger>
            </TabsList>

            <TabsContent value="upload" className="mt-6">
              {!image ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>
                  <EnhancedImageUploader onImageUpload={handleImageUpload} />
                </motion.div>
              ) : (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <PlantPreview image={image} />

                    {isProcessing ? (
                      <Card>
                        <CardContent className="flex items-center justify-center p-6 min-h-[400px]">
                          <ProcessingAnimation text="Analyzing your plant..." />
                        </CardContent>
                      </Card>
                    ) : (
                      result && (
                        <motion.div
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.5 }}
                        >
                          <PlantInfo result={result} />
                        </motion.div>
                      )
                    )}
                  </div>

                  <div className="flex justify-between">
                    <Button variant="outline" onClick={resetState}>
                      {t("detect.uploadAnother")}
                    </Button>

                    {result && (
                      <Button onClick={() => setIsChatOpen(true)} className="group">
                        <MessageSquare className="mr-2 h-4 w-4 group-hover:animate-bounce" />
                        Ask About This Plant
                      </Button>
                    )}
                  </div>
                </motion.div>
              )}
            </TabsContent>

            <TabsContent value="chat" className="mt-6">
              <ExploreChatbotSection plantName={result?.name} />
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} plantName={result?.name} />
    </FallingLeavesBackground>
  )
}

