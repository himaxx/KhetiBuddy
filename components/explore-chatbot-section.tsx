"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bot, Leaf } from "lucide-react"
import AIChatbot from "@/components/ai-chatbot"

interface ExploreChatbotSectionProps {
  plantName?: string
}

export default function ExploreChatbotSection({ plantName }: ExploreChatbotSectionProps) {
  const [activeTab, setActiveTab] = useState("general")

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-4"
    >
      <div className="flex items-center space-x-2">
        <Bot className="h-6 w-6 text-primary" />
        <h2 className="text-2xl font-bold">AI Plant Assistant</h2>
      </div>

      <p className="text-muted-foreground">
        Chat with our AI assistants to learn more about plants, get care tips, or identify potential issues.
      </p>

      <Tabs defaultValue="general" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="general" className="flex items-center gap-2">
            <Bot className="h-4 w-4" />
            <span>General Assistant</span>
          </TabsTrigger>
          <TabsTrigger value="specialist" className="flex items-center gap-2">
            <Leaf className="h-4 w-4" />
            <span>Plant Specialist</span>
          </TabsTrigger>
        </TabsList>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
          <TabsContent value="general" className="m-0">
            <AIChatbot
              title="KhetiBuddy General Assistant"
              description="Ask me anything about plants, gardening, or agriculture."
              initialMessage="Hello! I'm your general plant assistant. I can help with gardening tips, plant care, and agricultural practices. What would you like to know?"
              avatarSrc="/placeholder.svg?height=40&width=40&text=KB"
              avatarFallback="KB"
              plantContext={plantName}
              className="h-[500px]"
            />
          </TabsContent>

          <TabsContent value="specialist" className="m-0">
            <AIChatbot
              title="Plant Care Specialist"
              description="I specialize in plant diseases, pests, and treatment recommendations."
              initialMessage="Hi there! I'm your plant care specialist. I can help identify plant diseases, suggest treatments, and provide specific care instructions. How can I assist you today?"
              avatarSrc="/placeholder.svg?height=40&width=40&text=PC"
              avatarFallback="PC"
              plantContext={plantName}
              className="h-[500px]"
            />
          </TabsContent>
        </div>
      </Tabs>
    </motion.div>
  )
}

