"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { X, Volume2, Send, Activity, Shield, Zap } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { chatbotService, type ChatMessage } from "@/services/chatbot-service"
import { cn } from "@/lib/utils"
import { FormattedMessage } from "@/components/formatted-message"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  plantName?: string
  disease?: string
}

export default function ChatbotModal({ isOpen, onClose, plantName, disease }: ChatbotModalProps) {
  const { language } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (isOpen) {
      if (disease) {
        // Automatically trigger contextual message
        const initialText = `I detected ${disease} on my ${plantName}. What is the precise diagnostic cure and treatment protocol?`

        setMessages([
          {
            id: "system-init",
            role: "assistant",
            content: `Neural advisor initialized for ${plantName} pathology detection. Analyzing ${disease}...`,
            timestamp: new Date(),
          },
        ])

        // Auto-send the actual query
        setTimeout(() => {
          handleSendMessage(initialText)
        }, 800)
      } else {
        const initialMessage = `Hello! I'm your plant assistant. I see you're interested in ${plantName}. How can I help you today?`
        setMessages([
          {
            id: "welcome",
            role: "assistant",
            content: initialMessage,
            timestamp: new Date(),
          },
        ])
      }
    } else {
      setMessages([])
      setInput("")
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
      setError(null)
    }
  }, [isOpen, plantName, disease])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (forcedMessage?: string) => {
    const textToProcess = forcedMessage || input
    if (!textToProcess.trim() || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: textToProcess,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)
    setInput("")

    try {
      const contextualMessage = disease
        ? `[Context: Plant is ${plantName}, Disease is ${disease}] ${textToProcess}`
        : `[Context: Plant is ${plantName}] ${textToProcess}`

      const chatHistory = messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      const response = await chatbotService.sendMessage(contextualMessage, chatHistory)

      if (response.status === "success" && response.message) {
        const botMessageId = Date.now().toString()
        const botMessage: ChatMessage = {
          id: botMessageId,
          role: "assistant",
          content: response.message,
          timestamp: new Date(),
        }
        setMessages((prev) => [...prev, botMessage])

        if (isVoiceMode) {
          speakMessage(botMessageId, response.message)
        }
      } else if (response.status === "error") {
        setError(response.message || "Failed to get response")
      }
    } catch (err) {
      setError("Communication failure with neural core.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  const speakMessage = async (id: string, message: string) => {
    if (isSpeaking) {
      window.speechSynthesis.cancel()
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }

    setIsSpeaking(true)
    setCurrentSpeakingId(id)

    try {
      const audioUrl = await chatbotService.speakText(message, language)
      if (audioUrl) {
        const audio = new Audio(audioUrl)
        audio.play()
        audio.onended = () => {
          setIsSpeaking(false)
          setCurrentSpeakingId(null)
        }
      } else {
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
      }
    } catch (error) {
      console.error("Error speaking message:", error)
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-2xl h-[80vh] flex flex-col p-0 overflow-hidden border-none shadow-[0_0_80px_-20px_rgba(0,0,0,0.5)] bg-background/80 backdrop-blur-2xl">
        <DialogHeader className="flex flex-row items-center justify-between px-6 py-4 border-b border-border/50 bg-muted/30">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary border border-primary/20">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <DialogTitle className="text-xl font-black italic tracking-tight uppercase">Neural <span className="text-primary/60">Advisor</span></DialogTitle>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Botanical Intelligence Core</p>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setIsVoiceMode(!isVoiceMode)}
                    className={cn(
                      "relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 overflow-hidden",
                      isVoiceMode
                        ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]"
                        : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                    )}
                  >
                    <div className={cn("flex items-center gap-2 relative z-10", isVoiceMode ? "font-black" : "font-medium")}>
                      {isVoiceMode ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <Volume2 className="w-3.5 h-3.5 opacity-50" />}
                      <span className="text-[10px] uppercase tracking-widest">{isVoiceMode ? "Audio On" : "Audio Off"}</span>
                    </div>
                  </Button>
                </TooltipTrigger>
                <TooltipContent side="bottom">
                  <p>Toggle neural audio synthesis</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>

            <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full hover:bg-red-500/10 hover:text-red-500 transition-colors" onClick={onClose}>
              <X className="h-5 w-5" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-thin scrollbar-thumb-primary/10 scrollbar-track-transparent">
          <AnimatePresence initial={false}>
            {messages.map((message, index) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, x: message.role === "user" ? 20 : -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.4, ease: "easeOut" }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={cn(
                  "flex gap-4 max-w-[85%] group relative",
                  message.role === "user" ? "flex-row-reverse" : "flex-row"
                )}>
                  {message.role === "assistant" && (
                    <div className="flex-shrink-0 mt-1">
                      <Avatar className="h-10 w-10 border-2 border-primary/20 shadow-lg">
                        <AvatarImage src="/placeholder.svg?height=40&width=40&text=PC" />
                        <AvatarFallback className="bg-primary/10 text-primary font-black">PC</AvatarFallback>
                      </Avatar>
                    </div>
                  )}

                  <div className={cn(
                    "space-y-2",
                    message.role === "user" ? "items-end" : "items-start"
                  )}>
                    <div className={cn(
                      "rounded-3xl px-5 py-4 shadow-sm border transition-all duration-300",
                      message.role === "user"
                        ? "bg-primary text-primary-foreground border-primary/20 rounded-tr-none shadow-primary/20"
                        : "bg-muted/40 backdrop-blur-md border-border/50 rounded-tl-none text-foreground"
                    )}>
                      {message.role === "assistant" ? (
                        <FormattedMessage
                          content={message.content}
                          role="assistant"
                          isTyping={index === messages.length - 1 && isLoading}
                        />
                      ) : (
                        <p className="text-sm font-medium leading-relaxed">{message.content}</p>
                      )}
                    </div>

                    <div className={cn(
                      "flex items-center gap-2 px-2 opacity-0 group-hover:opacity-100 transition-opacity",
                      message.role === "user" ? "flex-row-reverse" : "flex-row"
                    )}>
                      <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">
                        {message.timestamp?.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                      {message.role === "assistant" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={cn(
                            "h-6 w-6 rounded-lg",
                            currentSpeakingId === message.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-primary hover:bg-primary/5"
                          )}
                          onClick={() => speakMessage(message.id, message.content)}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>

          {isLoading && messages[messages.length - 1]?.role === "user" && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-4 max-w-[85%]">
                <div className="h-10 w-10 rounded-full bg-primary/5 flex items-center justify-center border border-primary/10">
                  <Activity className="h-5 w-5 text-primary animate-pulse" />
                </div>
                <div className="bg-muted/20 rounded-3xl rounded-tl-none px-6 py-4 border border-border/50">
                  <div className="flex gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.3s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce [animation-delay:-0.15s]"></span>
                    <span className="w-1.5 h-1.5 rounded-full bg-primary/40 animate-bounce"></span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center p-4">
              <div className="bg-red-500/10 border border-red-500/20 text-red-500 text-[10px] font-black uppercase tracking-[0.2em] px-4 py-2 rounded-full">
                {error}
              </div>
            </motion.div>
          )}

          <div ref={messagesEndRef} />
        </div>

        <div className="p-6 bg-muted/30 border-t border-border/50">
          <div className="max-w-4xl mx-auto flex items-end gap-3">
            <div className="flex-1 relative group">
              <Input
                placeholder={isLoading ? "Neural core processing..." : "Consult the plant pathology advisor..."}
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !e.shiftKey) {
                    e.preventDefault()
                    handleSendMessage()
                  }
                }}
                className="w-full bg-background/50 border-2 border-border/50 focus:border-primary/50 rounded-2xl h-14 pl-6 pr-14 text-sm font-medium transition-all group-hover:border-border"
                disabled={isLoading}
              />
              <Button
                type="submit"
                size="icon"
                onClick={() => handleSendMessage()}
                disabled={isLoading || !input.trim()}
                className="absolute right-2 top-2 h-10 w-10 rounded-xl bg-primary shadow-lg shadow-primary/20 hover:scale-105 transition-transform"
              >
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
          <div className="mt-4 flex items-center justify-center gap-6">
            <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-help">
              <Shield className="w-3 h-3 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">End-to-End Encrypted</span>
            </div>
            <div className="flex items-center gap-2 opacity-40 hover:opacity-100 transition-opacity cursor-help">
              <Zap className="w-3 h-3 text-primary" />
              <span className="text-[8px] font-black uppercase tracking-widest">Powered by OpenRouter</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
