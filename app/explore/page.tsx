"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import PlantPreview from "@/components/plant-preview"
import PlantInfo from "@/components/plant-info"
import ProcessingAnimation from "@/components/processing-animation"
import ChatbotModal from "@/components/chatbot-modal"
import { Leaf, MessageSquare, Search, Sparkles, Activity, ShieldCheck, Zap } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import ExploreChatbotSection from "@/components/explore-chatbot-section"
import { Badge } from "@/components/ui/badge"
import { geminiService } from "@/services/gemini-service"
import { cn } from "@/lib/utils"

export default function ExplorePage() {
  const { t } = useLanguage()
  const [image, setImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [result, setResult] = useState<any | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [activeSection, setActiveSection] = useState<"upload" | "chat">("upload")
  const [autoMessage, setAutoMessage] = useState<string | undefined>(undefined)

  const handleCureRequest = (diseaseName: string) => {
    setAutoMessage(`I detected ${diseaseName} on my plant. What is the precise diagnostic cure and treatment protocol?`)
    setActiveSection("chat")
  }

  const handleImageUpload = async (imageData: string) => {
    setImage(imageData)
    setIsProcessing(true)
    setResult(null)

    try {
      const identificationResult = await geminiService.identifyPlant(imageData);
      setResult(identificationResult);
    } catch (error) {
      console.error("Identification failed:", error);
      // Fallback or error state
      setResult({
        name: "Analysis Failed",
        confidence: 0,
        info: {
          commonName: "Unknown",
          scientificName: "N/A",
          family: "N/A",
          origin: "N/A",
          care: {
            light: "N/A",
            water: "N/A",
            humidity: "N/A",
            temperature: "N/A",
          },
        },
      });
    } finally {
      setIsProcessing(false)
    }
  }

  const resetState = () => {
    setImage(null)
    setResult(null)
    setIsProcessing(false)
  }

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
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] mb-2">
                <Search className="w-3 h-3 mr-2" />
                Plant Intelligence
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {t("nav.explore")}
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed italic">
                "Our AI identifier recognizes over 10,000 species with clinical accuracy."
              </p>
            </div>

            <div className="flex bg-muted/20 backdrop-blur-md p-1.5 rounded-[2rem] border border-white/10 shadow-2xl relative overflow-hidden group">
              <div className="absolute inset-0 bg-gradient-to-tr from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="relative flex gap-1 z-10">
                {[
                  { id: "upload", icon: Zap, label: "Identify" },
                  { id: "chat", icon: MessageSquare, label: "Assistant" }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveSection(tab.id as any)}
                    className={cn(
                      "relative flex items-center gap-3 px-8 py-3.5 rounded-[1.5rem] text-sm font-black uppercase tracking-widest transition-all duration-500",
                      activeSection === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    {activeSection === tab.id && (
                      <motion.div
                        layoutId="activeSection"
                        className="absolute inset-0 bg-primary shadow-[0_10px_30px_-5px_var(--primary)] rounded-[1.5rem]"
                        transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                      />
                    )}
                    <span className="relative z-10 flex items-center gap-2">
                      <tab.icon className={cn("w-4 h-4 transition-transform duration-500", activeSection === tab.id ? "scale-110" : "scale-100")} />
                      {tab.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <Tabs value={activeSection} className="w-full">
            <TabsContent value="upload" className="mt-0">
              <AnimatePresence mode="wait">
                {!image ? (
                  <motion.div
                    key="uploader"
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 1.05 }}
                    className="py-12"
                  >
                    <EnhancedImageUploader
                      onImageUpload={handleImageUpload}
                      title="Identify Biological Species"
                      className="max-w-3xl"
                    />
                  </motion.div>
                ) : (
                  <motion.div
                    key="results"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                  >
                    <div className="space-y-6">
                      <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                        <PlantPreview image={image} />
                      </Card>

                      <div className="flex gap-4">
                        <Button variant="outline" size="xl" onClick={resetState} className="flex-1 rounded-2xl font-bold border-2">
                          New Scan
                        </Button>
                        {result && (
                          <Button onClick={() => setIsChatOpen(true)} size="xl" className="flex-1 rounded-2xl font-bold shadow-2xl shadow-primary/20">
                            <MessageSquare className="mr-3 w-5 h-5" />
                            Expert Chat
                          </Button>
                        )}
                      </div>
                    </div>

                    <div className="space-y-8">
                      {isProcessing ? (
                        <Card className="rounded-[2.5rem] border-none bg-muted/30 backdrop-blur-sm min-h-[500px] flex items-center justify-center p-12">
                          <div className="text-center space-y-6">
                            <div className="relative inline-block">
                              <div className="w-20 h-20 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                              <Sparkles className="absolute inset-0 m-auto w-8 h-8 text-primary animate-pulse" />
                            </div>
                            <div className="space-y-2">
                              <h3 className="text-2xl font-black italic tracking-tight">Sequence Identification...</h3>
                              <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">Analyzing morphological features</p>
                            </div>
                          </div>
                        </Card>
                      ) : (
                        result && (
                          <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.5 }}
                          >
                            <PlantInfo result={result} onCureRequest={handleCureRequest} />
                          </motion.div>
                        )
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </TabsContent>

            <TabsContent value="chat" className="mt-0">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <ExploreChatbotSection plantName={result?.name} preloadedMessage={autoMessage} />
              </motion.div>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>

      <ChatbotModal isOpen={isChatOpen} onClose={() => setIsChatOpen(false)} plantName={result?.name} />
    </FallingLeavesBackground>
  )
}
