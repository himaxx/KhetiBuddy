"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Zap, ShieldCheck, Microscope, ArrowRight, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

// ─── Master plant data ────────────────────────────────────────────────────────
// Disease names remain in English (scientific/clinical standard)
// Labels around them are translated
const PLANT_REGISTRY = [
    {
        id: "tomato",
        emoji: "🍅",
        color: "#ef4444",
        accent: "from-red-500/30 to-rose-500/30",
        border: "border-red-500/30",
        glow: "shadow-red-500/20",
        diseases: [
            { name: "Early Blight", severity: "high", type: "fungal" },
            { name: "Late Blight", severity: "high", type: "oomycete" },
            { name: "Leaf Mold", severity: "medium", type: "fungal" },
            { name: "Septoria Leaf Spot", severity: "medium", type: "fungal" },
            { name: "Yellow Leaf Curl Virus", severity: "high", type: "viral" },
            { name: "Mosaic Virus", severity: "medium", type: "viral" },
            { name: "Bacterial Spot", severity: "medium", type: "bacterial" },
            { name: "Spider Mites", severity: "low", type: "pest" },
            { name: "Target Spot", severity: "medium", type: "fungal" },
        ],
        stats: { accuracy: "99.1%", speed: "< 3s" },
    },
    {
        id: "potato",
        emoji: "🥔",
        color: "#f59e0b",
        accent: "from-amber-500/30 to-yellow-500/30",
        border: "border-amber-500/30",
        glow: "shadow-amber-500/20",
        diseases: [
            { name: "Late Blight", severity: "high", type: "oomycete" },
            { name: "Early Blight", severity: "medium", type: "fungal" },
            { name: "Common Scab", severity: "medium", type: "bacterial" },
            { name: "Blackleg / Soft Rot", severity: "high", type: "bacterial" },
            { name: "Potato Virus Y", severity: "high", type: "viral" },
            { name: "Rhizoctonia Canker", severity: "medium", type: "fungal" },
            { name: "Fusarium Dry Rot", severity: "medium", type: "fungal" },
        ],
        stats: { accuracy: "98.7%", speed: "< 3s" },
    },
    {
        id: "rice",
        emoji: "🌾",
        color: "#22c55e",
        accent: "from-green-500/30 to-emerald-500/30",
        border: "border-green-500/30",
        glow: "shadow-green-500/20",
        diseases: [
            { name: "Rice Blast", severity: "high", type: "fungal" },
            { name: "Brown Spot", severity: "medium", type: "fungal" },
            { name: "Bacterial Leaf Blight", severity: "high", type: "bacterial" },
            { name: "Sheath Blight", severity: "high", type: "fungal" },
            { name: "False Smut", severity: "medium", type: "fungal" },
            { name: "Tungro Virus", severity: "high", type: "viral" },
            { name: "Narrow Brown Leaf Spot", severity: "low", type: "fungal" },
        ],
        stats: { accuracy: "98.9%", speed: "< 3s" },
    },
    {
        id: "wheat",
        emoji: "🌵",
        color: "#f97316",
        accent: "from-orange-500/30 to-amber-500/30",
        border: "border-orange-500/30",
        glow: "shadow-orange-500/20",
        diseases: [
            { name: "Leaf Rust", severity: "high", type: "fungal" },
            { name: "Yellow Stripe Rust", severity: "high", type: "fungal" },
            { name: "Stem Rust", severity: "high", type: "fungal" },
            { name: "Powdery Mildew", severity: "medium", type: "fungal" },
            { name: "Septoria Leaf Blotch", severity: "medium", type: "fungal" },
            { name: "Fusarium Head Blight", severity: "high", type: "fungal" },
            { name: "Tan Spot", severity: "medium", type: "fungal" },
            { name: "Loose Smut", severity: "medium", type: "fungal" },
        ],
        stats: { accuracy: "98.5%", speed: "< 3s" },
    },
    {
        id: "grape",
        emoji: "🍇",
        color: "#a855f7",
        accent: "from-purple-500/30 to-violet-500/30",
        border: "border-purple-500/30",
        glow: "shadow-purple-500/20",
        diseases: [
            { name: "Downy Mildew", severity: "high", type: "oomycete" },
            { name: "Powdery Mildew", severity: "high", type: "fungal" },
            { name: "Black Rot", severity: "high", type: "fungal" },
            { name: "Botrytis / Grey Mold", severity: "high", type: "fungal" },
            { name: "Phomopsis Cane Spot", severity: "medium", type: "fungal" },
            { name: "Pierce's Disease", severity: "high", type: "bacterial" },
            { name: "Leaf Roll Virus", severity: "medium", type: "viral" },
            { name: "Esca / Black Measles", severity: "high", type: "fungal" },
        ],
        stats: { accuracy: "98.3%", speed: "< 3s" },
    },
    {
        id: "cotton",
        emoji: "🌱",
        color: "#06b6d4",
        accent: "from-cyan-500/30 to-sky-500/30",
        border: "border-cyan-500/30",
        glow: "shadow-cyan-500/20",
        diseases: [
            { name: "Bacterial Blight", severity: "high", type: "bacterial" },
            { name: "Verticillium Wilt", severity: "high", type: "fungal" },
            { name: "Fusarium Wilt", severity: "high", type: "fungal" },
            { name: "Alternaria Leaf Spot", severity: "medium", type: "fungal" },
            { name: "Cercospora Leaf Spot", severity: "medium", type: "fungal" },
            { name: "Boll Rot Complex", severity: "high", type: "fungal" },
            { name: "Cotton Leaf Curl Virus", severity: "high", type: "viral" },
            { name: "Target Spot", severity: "medium", type: "fungal" },
        ],
        stats: { accuracy: "97.9%", speed: "< 3s" },
    },
    {
        id: "apple",
        emoji: "🍎",
        color: "#ec4899",
        accent: "from-pink-500/30 to-rose-500/30",
        border: "border-pink-500/30",
        glow: "shadow-pink-500/20",
        diseases: [
            { name: "Apple Scab", severity: "high", type: "fungal" },
            { name: "Cedar Apple Rust", severity: "medium", type: "fungal" },
            { name: "Powdery Mildew", severity: "medium", type: "fungal" },
            { name: "Fire Blight", severity: "high", type: "bacterial" },
            { name: "Black Rot", severity: "high", type: "fungal" },
            { name: "Sooty Blotch", severity: "low", type: "fungal" },
            { name: "Apple Mosaic Virus", severity: "medium", type: "viral" },
        ],
        stats: { accuracy: "98.4%", speed: "< 3s" },
    },
    {
        id: "corn",
        emoji: "🌽",
        color: "#eab308",
        accent: "from-yellow-500/30 to-lime-500/30",
        border: "border-yellow-500/30",
        glow: "shadow-yellow-500/20",
        diseases: [
            { name: "Northern Leaf Blight", severity: "high", type: "fungal" },
            { name: "Common Rust", severity: "high", type: "fungal" },
            { name: "Southern Rust", severity: "high", type: "fungal" },
            { name: "Gray Leaf Spot", severity: "medium", type: "fungal" },
            { name: "Corn Smut", severity: "medium", type: "fungal" },
            { name: "Goss's Bacterial Wilt", severity: "high", type: "bacterial" },
            { name: "Maize Streak Virus", severity: "medium", type: "viral" },
        ],
        stats: { accuracy: "98.1%", speed: "< 3s" },
    },
]

const SEVERITY_COLORS: Record<string, string> = {
    high: "bg-red-500/10 text-red-500 border-red-500/20",
    medium: "bg-amber-500/10 text-amber-500 border-amber-500/20",
    low: "bg-green-500/10 text-green-500 border-green-500/20",
}

const TYPE_ICONS: Record<string, string> = {
    fungal: "🍄",
    bacterial: "🦠",
    viral: "🧬",
    oomycete: "💧",
    pest: "🐛",
}

export default function PlantDiagnosticMatrix() {
    const router = useRouter()
    const { t } = useLanguage()
    const [selected, setSelected] = useState<string>(PLANT_REGISTRY[0].id)
    const [hoveredDisease, setHoveredDisease] = useState<string | null>(null)

    const activePlant = PLANT_REGISTRY.find((p) => p.id === selected)!

    return (
        <div className="w-full space-y-6">
            {/* ── Sub-label ─────────────────────────────────────── */}
            <div className="flex items-center justify-between">
                <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/40">
                    {t("detect.matrix.subtitle")}
                </p>
                <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground opacity-50">
                    {PLANT_REGISTRY.length} {t("detect.matrix.modelsActive")}
                </span>
            </div>

            {/* ── Plant Selector Pills ───────────────────────────── */}
            <div className="flex flex-wrap gap-3">
                {PLANT_REGISTRY.map((plant) => (
                    <motion.button
                        key={plant.id}
                        onClick={() => setSelected(plant.id)}
                        whileHover={{ scale: 1.06 }}
                        whileTap={{ scale: 0.97 }}
                        className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl border-2 transition-all duration-300 font-bold text-sm ${selected === plant.id
                                ? `bg-gradient-to-r ${plant.accent} ${plant.border} shadow-xl ${plant.glow} text-foreground`
                                : "bg-muted/40 border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                            }`}
                    >
                        <span className="text-lg leading-none">{plant.emoji}</span>
                        {t(`plant.${plant.id}`)}
                        {selected === plant.id && (
                            <motion.div layoutId="activePillDot" className="w-1.5 h-1.5 rounded-full bg-current ml-1" />
                        )}
                    </motion.button>
                ))}
            </div>

            {/* ── Main Details Panel ────────────────────────────── */}
            <AnimatePresence mode="wait">
                <motion.div
                    key={selected}
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -16 }}
                    transition={{ duration: 0.3, ease: "easeOut" }}
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                >
                    {/* Left: Plant identity card */}
                    <div className={`lg:col-span-1 rounded-[2.5rem] border-2 ${activePlant.border} bg-gradient-to-br ${activePlant.accent} p-8 space-y-6 relative overflow-hidden`}>
                        <div className="absolute -bottom-6 -right-6 text-[120px] opacity-10 select-none pointer-events-none leading-none">
                            {activePlant.emoji}
                        </div>

                        <div className="space-y-2">
                            <span className="text-5xl">{activePlant.emoji}</span>
                            <h3 className="text-3xl font-black tracking-tight">{t(`plant.${activePlant.id}`)}</h3>
                            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                                {t(`plant.${activePlant.id}.tagline`)}
                            </p>
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-3 gap-3">
                            {[
                                { label: t("detect.matrix.diseases").split(" ")[0], value: activePlant.diseases.length },
                                { label: t("home.stat.accuracy").split(" ")[0], value: activePlant.stats.accuracy },
                                { label: t("home.stat.speed").split(" ")[0], value: activePlant.stats.speed },
                            ].map((stat) => (
                                <div key={stat.label} className="bg-background/30 backdrop-blur-sm rounded-2xl p-3 text-center border border-white/10">
                                    <p className="text-lg font-black leading-none">{stat.value}</p>
                                    <p className="text-[9px] font-black uppercase tracking-widest opacity-60 mt-1">{stat.label}</p>
                                </div>
                            ))}
                        </div>

                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest opacity-60">
                            <Zap className="w-3 h-3" />
                            {t("detect.matrix.poweredBy")}
                        </div>

                        <Button
                            onClick={() => router.push(`/detect/${activePlant.id}`)}
                            className="w-full rounded-2xl font-bold h-12 shadow-xl"
                            style={{ backgroundColor: activePlant.color }}
                        >
                            {t("detect.matrix.initializeScan")}
                            <ChevronRight className="ml-2 w-4 h-4" />
                        </Button>
                    </div>

                    {/* Right: Disease matrix */}
                    <div className="lg:col-span-2 rounded-[2.5rem] border-2 border-border/50 bg-card/40 backdrop-blur-sm p-8 space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 rounded-2xl bg-primary/10 flex items-center justify-center text-primary">
                                    <Microscope className="w-5 h-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{t("detect.matrix.diseases")}</p>
                                    <h4 className="font-black text-lg">
                                        {activePlant.diseases.length} {t("detect.matrix.targets")}
                                    </h4>
                                </div>
                            </div>
                            <div className="flex gap-2">
                                {["high", "medium", "low"].map((s) => (
                                    <span key={s} className={`text-[9px] font-black px-2 py-1 rounded-full border ${SEVERITY_COLORS[s]}`}>
                                        {t(`severity.${s}`)}
                                    </span>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activePlant.diseases.map((disease, i) => (
                                <motion.div
                                    key={disease.name}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    onMouseEnter={() => setHoveredDisease(disease.name)}
                                    onMouseLeave={() => setHoveredDisease(null)}
                                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all duration-200 cursor-default ${hoveredDisease === disease.name
                                            ? `border-current/40 bg-gradient-to-r ${activePlant.accent}`
                                            : "border-border/40 bg-muted/20 hover:bg-muted/40"
                                        }`}
                                >
                                    <div className="flex items-center gap-3">
                                        <span className="text-lg" title={t(`type.${disease.type}`)}>
                                            {TYPE_ICONS[disease.type] || "🔬"}
                                        </span>
                                        <div>
                                            <p className="text-sm font-bold leading-none">{disease.name}</p>
                                            <p className="text-[9px] font-bold uppercase tracking-widest opacity-50 mt-0.5">
                                                {t(`type.${disease.type}`)}
                                            </p>
                                        </div>
                                    </div>
                                    <span className={`text-[9px] font-black px-2 py-1 rounded-full border capitalize ${SEVERITY_COLORS[disease.severity]}`}>
                                        {t(`severity.${disease.severity}`)}
                                    </span>
                                </motion.div>
                            ))}
                        </div>

                        <div className="flex items-center justify-between pt-4 border-t border-border/30">
                            <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-muted-foreground">
                                <ShieldCheck className="w-3.5 h-3.5 text-primary" />
                                {t("detect.matrix.expertAI")}
                            </div>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => router.push(`/detect/${activePlant.id}`)}
                                className="text-primary font-black text-[10px] uppercase tracking-widest hover:bg-primary/5 rounded-xl"
                            >
                                {t("detect.matrix.startScanCTA")} <ArrowRight className="ml-2 w-3 h-3" />
                            </Button>
                        </div>
                    </div>
                </motion.div>
            </AnimatePresence>
        </div>
    )
}
