"use client"

import { motion } from "framer-motion"
import { ShieldCheck, Zap, Sparkles } from "lucide-react"
import PlantSelectionGrid from "@/components/plant-selection-grid"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import { Badge } from "@/components/ui/badge"
import PlantDiagnosticMatrix from "@/components/plant-diagnostic-matrix"

export default function DetectPage() {
  const { t } = useLanguage()

  return (
    <FallingLeavesBackground>
      <div className="container max-w-7xl py-12 md:py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-20"
        >
          {/* ── Hero Header ──────────────────────────── */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
            <div className="space-y-4">
              <Badge
                variant="secondary"
                className="bg-primary/10 text-primary border-primary/20 px-4 py-1.5 rounded-full font-bold uppercase text-[10px] tracking-[0.2em] mb-2"
              >
                <Sparkles className="w-3 h-3 mr-2" />
                {t("detect.badge")}
              </Badge>
              <h1 className="text-4xl md:text-6xl font-black tracking-tighter leading-none">
                {t("detect.title")}
              </h1>
              <p className="text-muted-foreground text-xl font-medium max-w-2xl leading-relaxed italic">
                "{t("detect.subtitle")}"
              </p>
            </div>

            <div className="flex gap-4">
              {[
                { icon: ShieldCheck, label: t("detect.precision") },
                { icon: Zap, label: t("detect.realtime") },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 bg-muted/50 px-4 py-2 rounded-2xl border border-border/50 text-xs font-bold uppercase tracking-widest text-muted-foreground"
                >
                  <item.icon className="w-4 h-4 text-primary" />
                  {item.label}
                </div>
              ))}
            </div>
          </div>

          {/* ── Interactive Disease Coverage Matrix ──── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="space-y-4"
          >
            <div className="flex items-center gap-4 mb-2">
              <div className="flex-1 h-[1px] bg-border/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 whitespace-nowrap">
                {t("detect.coverage.divider")}
              </p>
              <div className="flex-1 h-[1px] bg-border/50" />
            </div>
            <PlantDiagnosticMatrix />
          </motion.section>

          {/* ── Plant Selection Grid ──────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
          >
            <div className="flex items-center gap-4 mb-8">
              <div className="flex-1 h-[1px] bg-border/50" />
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-primary/60 whitespace-nowrap">
                {t("detect.grid.divider")}
              </p>
              <div className="flex-1 h-[1px] bg-border/50" />
            </div>
            <PlantSelectionGrid />
          </motion.section>

          {/* ── How it works ──────────────────────────── */}
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="grid md:grid-cols-3 gap-8 pt-12 border-t"
          >
            {[
              { step: "01", title: t("detect.step1.title"), desc: t("detect.step1.desc") },
              { step: "02", title: t("detect.step2.title"), desc: t("detect.step2.desc") },
              { step: "03", title: t("detect.step3.title"), desc: t("detect.step3.desc") },
            ].map((step, i) => (
              <div
                key={i}
                className="space-y-4 p-8 rounded-[2.5rem] bg-card/60 backdrop-blur-sm border border-border/50 hover:bg-primary/5 transition-all duration-300 group"
              >
                <div className="text-5xl font-black text-primary/10 group-hover:text-primary/20 transition-colors leading-none">
                  {step.step}
                </div>
                <h3 className="text-xl font-black tracking-tight">{step.title}</h3>
                <p className="text-sm text-muted-foreground font-medium leading-relaxed">{step.desc}</p>
              </div>
            ))}
          </motion.section>
        </motion.div>
      </div>
    </FallingLeavesBackground>
  )
}
