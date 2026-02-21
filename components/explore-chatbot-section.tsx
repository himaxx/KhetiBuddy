"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, Leaf, Sparkles } from "lucide-react"
import AIChatbot from "@/components/ai-chatbot"
import { cn } from "@/lib/utils"

interface ExploreChatbotSectionProps {
  plantName?: string
  preloadedMessage?: string
}

export default function ExploreChatbotSection({ plantName, preloadedMessage }: ExploreChatbotSectionProps) {
  const [activeTab, setActiveTab] = useState<"general" | "specialist">(preloadedMessage ? "specialist" : "general")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-8"
    >
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="space-y-2">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Bot className="h-6 w-6" />
            </div>
            <h2 className="text-3xl font-black tracking-tight text-foreground uppercase italic">Neural Advisor <span className="text-primary/50">Core</span></h2>
          </div>
          <p className="text-muted-foreground font-medium max-w-xl">
            Surgical-grade AI assistance for botanical identification, care protocols, and pathological diagnosis.
          </p>
        </div>

        <div className="relative p-1 bg-muted/20 backdrop-blur-xl rounded-[2.5rem] border border-white/5 shadow-inner min-w-[320px] md:min-w-[400px]">
          <div className="relative flex w-full">
            {[
              { id: "general", icon: Bot, label: "General" },
              { id: "specialist", icon: Leaf, label: "Specialist" }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={cn(
                  "relative flex-1 flex items-center justify-center gap-3 py-3 rounded-[2rem] text-[10px] font-black uppercase tracking-[0.2em] transition-all duration-500",
                  activeTab === tab.id ? "text-primary-foreground" : "text-muted-foreground hover:text-foreground"
                )}
              >
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="assistantTab"
                    className="absolute inset-0 bg-primary shadow-[0_10px_30px_-5px_var(--primary)] rounded-[2rem]"
                    transition={{ type: "spring", bounce: 0.15, duration: 0.6 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <tab.icon className={cn("w-3.5 h-3.5 transition-all duration-500", activeTab === tab.id ? "rotate-[360deg] scale-125" : "rotate-0 scale-100")} />
                  {tab.label}
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="relative">
        <AnimatePresence mode="wait">
          {activeTab === "general" ? (
            <motion.div
              key="general"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6"
            >
              <AIChatbot
                title="CropSaviour Universal"
                description="General agricultural intelligence and botanical knowledge base."
                initialMessage="Welcome to the universal core. I can provide data on over 10,000 species and optimal farming practices. How may I assist your query?"
                avatarSrc="/placeholder.svg?height=40&width=40&text=CS"
                avatarFallback="CS"
                plantContext={plantName}
                className="h-[600px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-card/30 backdrop-blur-sm rounded-[3rem] overflow-hidden"
              />
            </motion.div>
          ) : (
            <motion.div
              key="specialist"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="grid grid-cols-1 gap-6"
            >
              <AIChatbot
                title="Pathology Specialist"
                description="Neural diagnostic core for disease identification and treatment synthesis."
                initialMessage="Diagnostic core initialized. I am ready to analyze specimen data for pathological anomalies and synthesize pharmaceutical-grade care recommendations."
                avatarSrc="/placeholder.svg?height=40&width=40&text=PC"
                avatarFallback="PC"
                plantContext={plantName}
                className="h-[600px] border-none shadow-[0_32px_64px_-16px_rgba(0,0,0,0.5)] bg-card/30 backdrop-blur-sm rounded-[3rem] overflow-hidden"
                preloadedMessage={preloadedMessage}
              />
            </motion.div>
          )}
        </AnimatePresence>

        <div className="absolute top-6 right-6 pointer-events-none opacity-20">
          <Sparkles className="w-12 h-12 text-primary animate-pulse" />
        </div>
      </div>
    </motion.div>
  )
}
