"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { motion, AnimatePresence } from "framer-motion"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import EnhancedImageUploader from "@/components/enhanced-image-uploader"
import ChatbotModal from "@/components/chatbot-modal"
import { ArrowLeft, MessageSquare, Upload, Camera, Activity, Search, RefreshCw } from "lucide-react"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { Badge } from "@/components/ui/badge"
import { openrouterService, type PlantIdentificationResult } from "@/services/openrouter-service"
import PlantInfo from "@/components/plant-info"
import { useLanguage } from "@/contexts/language-context"

// Plant-specific display config — emojis and specialties don't need translation
const PLANT_CONFIG: Record<string, {
    emoji: string
    taglineKey: string
    accentColor: string
    specialties: string[]
}> = {
    rice: {
        emoji: "🌾",
        taglineKey: "plant.rice.tagline",
        accentColor: "from-yellow-500/20 to-green-500/20",
        specialties: ["Blast", "Brown Spot", "Bacterial Leaf Blight", "Sheath Blight"],
    },
    wheat: {
        emoji: "🌵",
        taglineKey: "plant.wheat.tagline",
        accentColor: "from-amber-500/20 to-orange-500/20",
        specialties: ["Leaf Rust", "Stripe Rust", "Powdery Mildew", "Septoria"],
    },
    grape: {
        emoji: "🍇",
        taglineKey: "plant.grape.tagline",
        accentColor: "from-purple-500/20 to-violet-500/20",
        specialties: ["Downy Mildew", "Powdery Mildew", "Black Rot", "Botrytis"],
    },
    cotton: {
        emoji: "🌱",
        taglineKey: "plant.cotton.tagline",
        accentColor: "from-sky-500/20 to-blue-500/20",
        specialties: ["Bacterial Blight", "Verticillium Wilt", "Leaf Curl Virus", "Fusarium"],
    },
    tomato: {
        emoji: "🍅",
        taglineKey: "plant.tomato.tagline",
        accentColor: "from-red-500/20 to-rose-500/20",
        specialties: ["Early Blight", "Late Blight", "Leaf Mold", "Mosaic Virus"],
    },
    potato: {
        emoji: "🥔",
        taglineKey: "plant.potato.tagline",
        accentColor: "from-stone-500/20 to-amber-500/20",
        specialties: ["Late Blight", "Early Blight", "Common Scab", "Blackleg"],
    },
    apple: {
        emoji: "🍎",
        taglineKey: "plant.apple.tagline",
        accentColor: "from-red-500/20 to-pink-500/20",
        specialties: ["Apple Scab", "Cedar Rust", "Fire Blight", "Powdery Mildew"],
    },
    corn: {
        emoji: "🌽",
        taglineKey: "plant.corn.tagline",
        accentColor: "from-yellow-500/20 to-amber-500/20",
        specialties: ["Northern Blight", "Common Rust", "Gray Leaf Spot", "Smut"],
    },
}

interface NeuralDiseaseDetectionPageProps {
    plantType: string
}

export default function NeuralDiseaseDetectionPage({ plantType }: NeuralDiseaseDetectionPageProps) {
    const router = useRouter()
    const { t } = useLanguage()
    const [activeTab, setActiveTab] = useState<string>("upload")
    const [image, setImage] = useState<string | null>(null)
    const [isProcessing, setIsProcessing] = useState(false)
    const [result, setResult] = useState<PlantIdentificationResult | null>(null)
    const [isChatOpen, setIsChatOpen] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [detectedDisease, setDetectedDisease] = useState<string | undefined>(undefined)

    const plantKey = plantType.toLowerCase()
    const config = PLANT_CONFIG[plantKey] ?? {
        emoji: "🌿",
        taglineKey: "detect.cloudNeural",
        accentColor: "from-primary/20 to-green-500/20",
        specialties: [],
    }

    // Translated plant name from the global translations
    const plantDisplayName = t(`plant.${plantKey}`)
    const tagline = t(config.taglineKey)

    const handleImageUpload = async (imageData: string) => {
        setImage(imageData)
        setIsProcessing(true)
        setError(null)
        setResult(null)

        try {
            const diagnosis = await openrouterService.identifyPlant(imageData, plantKey)
            setResult(diagnosis)
            setDetectedDisease(diagnosis.info.disease?.name || undefined)
        } catch (err: any) {
            console.error("Diagnosis error:", err)
            setError(err?.message || "Cloud diagnostic core failed. Please check your connection.")
        } finally {
            setIsProcessing(false)
        }
    }

    const resetState = () => {
        setImage(null)
        setResult(null)
        setIsProcessing(false)
        setError(null)
        setDetectedDisease(undefined)
    }

    const handleCureRequest = (diseaseName: string) => {
        setDetectedDisease(diseaseName)
        setIsChatOpen(true)
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
                    {/* ── Header ── */}
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
                                <Badge
                                    variant="secondary"
                                    className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest flex items-center gap-2 w-fit"
                                >
                                    <Activity className="w-3 h-3" />
                                    {config.emoji} {tagline}
                                </Badge>
                                <h1 className="text-4xl font-black tracking-tight leading-none">
                                    {plantDisplayName}{" "}
                                    <span className="text-primary/70">{t("detect.pathologySystem")}</span>
                                </h1>
                            </div>
                        </div>

                        {/* Specialty chips */}
                        <div className="hidden lg:flex flex-wrap gap-2">
                            {config.specialties.map((s) => (
                                <span key={s} className="text-[10px] font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/30">
                                    {s}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* ── Tab Switcher ── */}
                    <div className="flex bg-muted/50 p-1.5 rounded-2xl border border-border/50 w-fit">
                        <Tabs value={activeTab} onValueChange={setActiveTab}>
                            <TabsList className="bg-transparent h-12 gap-2">
                                <TabsTrigger value="upload" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold">
                                    <Upload className="w-4 h-4 mr-2" />
                                    {t("detect.uploadImage")}
                                </TabsTrigger>
                                <TabsTrigger value="camera" className="rounded-xl px-6 data-[state=active]:bg-background data-[state=active]:shadow-lg font-bold">
                                    <Camera className="w-4 h-4 mr-2" />
                                    {t("detect.useCamera")}
                                </TabsTrigger>
                            </TabsList>
                        </Tabs>
                    </div>

                    {/* ── Main Content ── */}
                    <Tabs value={activeTab} className="w-full">
                        {/* ─ UPLOAD TAB ─ */}
                        <TabsContent value="upload">
                            <AnimatePresence mode="wait">
                                {!image ? (
                                    <motion.div
                                        key="uploader"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="py-12"
                                    >
                                        {/* Specialist context banner */}
                                        <div className={`mb-8 p-6 rounded-3xl bg-gradient-to-r ${config.accentColor} border border-border/30`}>
                                            <p className="text-sm font-bold text-foreground/70">
                                                <span className="text-2xl mr-3">{config.emoji}</span>
                                                {t("detect.cloudNeural")} —{" "}
                                                <span className="text-foreground font-black">{plantDisplayName}</span>{" "}
                                                <span className="text-primary font-black">
                                                    {config.specialties.slice(0, 2).join(", ")}
                                                </span>{" "}
                                                &amp; more.
                                            </p>
                                        </div>
                                        <EnhancedImageUploader
                                            onImageUpload={handleImageUpload}
                                            title={t("detect.specimenScan")}
                                        />
                                    </motion.div>
                                ) : (
                                    <motion.div
                                        key="result"
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        exit={{ opacity: 0, y: -10 }}
                                        className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start"
                                    >
                                        {/* ── Left: Image Preview ── */}
                                        <div className="space-y-6">
                                            <Card className="overflow-hidden rounded-[2.5rem] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.2)]">
                                                <div className="relative aspect-square">
                                                    <img src={image} alt="Specimen" className="w-full h-full object-cover" />
                                                    {/* HUD Overlay */}
                                                    <div className="absolute inset-x-6 bottom-6">
                                                        <div className="bg-black/40 backdrop-blur-xl border border-white/20 p-4 rounded-2xl flex items-center justify-between text-white shadow-2xl">
                                                            <div className="flex items-center gap-3">
                                                                <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                                                                    <Search className="w-5 h-5 text-primary" />
                                                                </div>
                                                                <div className="text-left">
                                                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                                                        {plantDisplayName} {t("detect.selectPlant")}
                                                                    </p>
                                                                    <p className="text-sm font-bold">
                                                                        {isProcessing
                                                                            ? t("detect.scanning")
                                                                            : result
                                                                                ? t("detect.analysisComplete")
                                                                                : t("detect.specimenLoaded")}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                onClick={resetState}
                                                                className="rounded-xl font-bold bg-white/10 hover:bg-red-500 text-white transition-colors"
                                                            >
                                                                <RefreshCw className="w-4 h-4 mr-1.5" />
                                                                {t("detect.reset")}
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </div>
                                            </Card>
                                        </div>

                                        {/* ── Right: Diagnosis Panel ── */}
                                        <div className="space-y-8">
                                            {isProcessing && (
                                                <Card className="rounded-[2.5rem] border-none bg-muted/30 backdrop-blur-sm min-h-[420px] flex items-center justify-center p-12">
                                                    <div className="text-center space-y-8">
                                                        <div className="relative inline-block">
                                                            <div className="w-24 h-24 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
                                                            <span className="absolute inset-0 flex items-center justify-center text-4xl">
                                                                {config.emoji}
                                                            </span>
                                                        </div>
                                                        <div className="space-y-2">
                                                            <h3 className="text-2xl font-black italic tracking-tight">
                                                                {plantDisplayName} {tagline}
                                                            </h3>
                                                            <p className="text-muted-foreground font-medium uppercase text-[10px] tracking-[0.3em]">
                                                                {t("detect.processing")}
                                                            </p>
                                                            <div className="flex justify-center gap-2 pt-4">
                                                                {config.specialties.map((s, i) => (
                                                                    <span
                                                                        key={i}
                                                                        className="text-[9px] font-bold text-primary/50 bg-primary/5 px-2 py-1 rounded-full animate-pulse"
                                                                        style={{ animationDelay: `${i * 0.2}s` }}
                                                                    >
                                                                        {s}
                                                                    </span>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </div>
                                                </Card>
                                            )}

                                            {error && !isProcessing && (
                                                <Card className="rounded-[2.5rem] border-none bg-red-500/10 backdrop-blur-sm p-12 text-center space-y-6">
                                                    <div className="w-16 h-16 rounded-full bg-red-500/20 flex items-center justify-center text-red-500 mx-auto">
                                                        <Activity className="w-8 h-8" />
                                                    </div>
                                                    <div>
                                                        <h3 className="text-xl font-bold text-red-500 uppercase tracking-tighter">
                                                            {t("detect.diagnosticInterrupt")}
                                                        </h3>
                                                        <p className="text-sm text-red-400 font-medium mt-2 max-w-xs mx-auto">{error}</p>
                                                    </div>
                                                    <Button
                                                        onClick={resetState}
                                                        variant="outline"
                                                        className="border-red-500/30 text-red-500 hover:bg-red-500/10"
                                                    >
                                                        {t("detect.retryBtn")}
                                                    </Button>
                                                </Card>
                                            )}

                                            {result && !isProcessing && (
                                                <motion.div
                                                    initial={{ opacity: 0, x: 20 }}
                                                    animate={{ opacity: 1, x: 0 }}
                                                    className="space-y-6"
                                                >
                                                    <PlantInfo result={result} onCureRequest={handleCureRequest} />
                                                    <div className="flex justify-end">
                                                        <Button
                                                            onClick={() => setIsChatOpen(true)}
                                                            size="lg"
                                                            className="rounded-2xl font-bold shadow-2xl shadow-primary/20 h-14 px-8"
                                                        >
                                                            <MessageSquare className="mr-3 w-5 h-5" />
                                                            {t("detect.consultAdvisor")}
                                                        </Button>
                                                    </div>
                                                </motion.div>
                                            )}
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </TabsContent>

                        {/* ─ CAMERA TAB ─ */}
                        <TabsContent value="camera">
                            <div className="max-w-4xl mx-auto">
                                <Card className="overflow-hidden rounded-[3rem] border-none shadow-2xl min-h-[400px] flex items-center justify-center bg-muted/30">
                                    <div className="text-center space-y-4 p-12">
                                        <span className="text-6xl">{config.emoji}</span>
                                        <p className="text-muted-foreground font-black uppercase tracking-widest text-xs">
                                            {t("detect.liveScanSoon")} — {plantDisplayName}
                                        </p>
                                        <Button variant="outline" onClick={() => setActiveTab("upload")}>
                                            <Upload className="w-4 h-4 mr-2" />
                                            {t("detect.switchUpload")}
                                        </Button>
                                    </div>
                                </Card>
                            </div>
                        </TabsContent>
                    </Tabs>
                </motion.div>
            </div>

            <ChatbotModal
                isOpen={isChatOpen}
                onClose={() => setIsChatOpen(false)}
                plantName={result?.name || plantDisplayName}
                disease={detectedDisease}
            />
        </FallingLeavesBackground>
    )
}
