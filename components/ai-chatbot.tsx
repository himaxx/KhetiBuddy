"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Send,
  Mic,
  MicOff,
  Volume2,
  VolumeX,
  Activity,
  Trash2,
  RefreshCw,
  Info,
  Maximize2,
  Minimize2,
  Settings,
  Shield,
  Zap,
} from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"
import { chatbotService, type ChatMessage } from "@/services/chatbot-service"
import { Badge } from "@/components/ui/badge"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"
import { cn } from "@/lib/utils"
import { FormattedMessage } from "@/components/formatted-message"

// SpeechRecognition interface declarations remain unchanged (omitted for brevity)

interface AIChatbotProps {
  title?: string
  description?: string
  initialMessage?: string
  avatarSrc?: string
  avatarFallback?: string
  className?: string
  plantContext?: string
  preloadedMessage?: string
}

export default function AIChatbot({
  title = "KhetiBuddy AI Assistant",
  description = "Ask me anything about plants and gardening",
  initialMessage = "Hello! I'm your plant assistant. How can I help you today?",
  avatarSrc = "/placeholder.svg?height=40&width=40&text=KB",
  avatarFallback = "KB",
  className = "",
  plantContext,
  preloadedMessage,
}: AIChatbotProps) {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const recognitionRef = useRef<SpeechRecognition | null>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    const contextMessage = plantContext
      ? `I see you're interested in ${plantContext}. ${initialMessage}`
      : initialMessage

    setMessages([
      {
        id: "welcome",
        role: "assistant",
        content: contextMessage,
        timestamp: new Date(),
      },
    ])
  }, [initialMessage, plantContext])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    if (inputRef.current && !isMobile) {
      inputRef.current.focus()
    }
  }, [isMobile])

  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort()
      }
      if (isSpeaking) {
        window.speechSynthesis.cancel()
      }
    }
  }, [isSpeaking])

  useEffect(() => {
    if (preloadedMessage && messages.length === 1) { // Only if just the welcome message exists
      const timer = setTimeout(() => {
        handleSendMessage(preloadedMessage)
      }, 500)
      return () => clearTimeout(timer)
    }
  }, [preloadedMessage, messages.length])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = async (forcedMessage?: string) => {
    const textToProcess = forcedMessage || input
    if ((!textToProcess.trim() && !isRecording) || isLoading) return

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: "user",
      content: isRecording ? "Processing voice message..." : textToProcess,
      timestamp: new Date(),
    }

    setMessages((prev) => [...prev, userMessage])
    setIsLoading(true)
    setError(null)
    setInput("")

    try {
      const messageToSend = textToProcess
      const contextualMessage = plantContext
        ? `[Context: User is asking about ${plantContext}] ${messageToSend}`
        : messageToSend

      // Prepare history for better context
      const chatHistory = messages.map(m => ({
        role: m.role as "user" | "assistant",
        content: m.content
      }));

      const response = await chatbotService.sendMessage(contextualMessage, chatHistory)

      const botMessage: ChatMessage = {
        id: `bot-${Date.now()}`,
        role: "assistant",
        content: response.message,
        timestamp: new Date(),
      }

      setMessages((prev) => {
        if (isRecording && prev.length > 0 && prev[prev.length - 1].role === "user") {
          const updatedPrev = [...prev]
          updatedPrev[updatedPrev.length - 1] = {
            ...updatedPrev[updatedPrev.length - 1],
            content: messageToSend,
          }
          return [...updatedPrev, botMessage]
        }
        return [...prev, botMessage]
      })

      if (isVoiceMode && botMessage.id) {
        speakMessage(botMessage.id, botMessage.content)
      }
    } catch (err) {
      console.error("Error sending message:", err)
      setError("Failed to send message. Please try again.")
    } finally {
      setIsLoading(false)
      setIsRecording(false)
    }
  }

  const toggleRecording = () => {
    if (isRecording) {
      stopRecording()
    } else {
      startRecording()
    }
  }

  const startRecording = () => {
    setIsRecording(true)
    setInput("")

    recognitionRef.current = chatbotService.startSpeechRecognition(
      (transcript) => setInput(transcript),
      () => {
        setIsRecording(false)
        if (input.trim()) handleSendMessage()
      },
      (error) => {
        setIsRecording(false)
        setError(error)
      },
    )
  }

  const stopRecording = () => {
    if (recognitionRef.current) {
      recognitionRef.current.stop()
    }
    setIsRecording(false)
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
        console.warn("No audio URL returned from Play.ht")
        setIsSpeaking(false)
        setCurrentSpeakingId(null)
      }
    } catch (error) {
      console.error("Error speaking message:", error)
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }
  }

  const handleVoiceModeToggle = (checked: boolean) => {
    setIsVoiceMode(checked)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <Card className={cn("flex flex-col h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between px-4 py-2 border-b">
        <div className="flex items-center gap-2">
          <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
          <CardTitle className="text-base font-medium">{title}</CardTitle>
          <Badge variant="outline" className="ml-2 text-xs">
            AI
          </Badge>
        </div>
        <div className="flex items-center gap-2">
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleVoiceModeToggle(!isVoiceMode)}
                  className={cn(
                    "relative flex items-center gap-2 px-3 py-1.5 rounded-full transition-all duration-500 overflow-hidden",
                    isVoiceMode
                      ? "bg-primary/20 text-primary border border-primary/30 shadow-[0_0_15px_-3px_rgba(var(--primary),0.4)]"
                      : "bg-muted/50 text-muted-foreground border border-transparent hover:bg-muted"
                  )}
                >
                  <div className={cn(
                    "flex items-center gap-2 relative z-10",
                    isVoiceMode ? "font-black" : "font-medium"
                  )}>
                    {isVoiceMode ? <Activity className="w-3.5 h-3.5 animate-pulse" /> : <VolumeX className="w-3.5 h-3.5 opacity-50" />}
                    <span className="text-[10px] uppercase tracking-widest">{isVoiceMode ? "Neural Audio On" : "Voice Off"}</span>
                  </div>
                  {isVoiceMode && (
                    <motion.div
                      layoutId="voiceModeGlow"
                      className="absolute inset-0 bg-primary/10"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5 }}
                    />
                  )}
                </Button>
              </TooltipTrigger>
              <TooltipContent side="bottom">
                <p>Toggle voice mode</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="flex-1 overflow-y-auto p-4 space-y-4">
        <p className="text-xs text-muted-foreground">{description}</p>
        <div className="space-y-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.role === "user" ? "flex-row-reverse" : ""}`}>
                  {message.role === "assistant" && (
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={avatarSrc} alt="AI Assistant" />
                      <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                        {avatarFallback}
                      </AvatarFallback>
                    </Avatar>
                  )}
                  <div className="space-y-1">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`rounded-lg px-4 py-2 relative ${message.role === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                        }`}
                    >
                      <FormattedMessage
                        content={message.content}
                        role={message.role as "user" | "assistant"}
                        isTyping={message.role === "assistant" && message.id === messages[messages.length - 1].id}
                      />
                      {message.role === "assistant" && (
                        <div className="absolute -right-12 top-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={cn(
                              "h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm",
                              currentSpeakingId === message.id ? "text-primary border-primary animate-pulse" : ""
                            )}
                            onClick={() => speakMessage(message.id!, message.content)}
                            disabled={isSpeaking && currentSpeakingId !== message.id}
                          >
                            <Volume2 className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full bg-background/50 backdrop-blur-sm border border-border/50 shadow-sm hover:text-primary transition-colors"
                            onClick={() => {
                              navigator.clipboard.writeText(message.content)
                              // Optional: Add a toast notification here
                            }}
                          >
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                            </svg>
                          </Button>
                        </div>
                      )}
                    </motion.div>
                    {message.timestamp && (
                      <p className="text-xs text-muted-foreground px-1">
                        {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                      </p>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
              <div className="flex gap-3 max-w-[80%]">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={avatarSrc} alt="AI Assistant" />
                  <AvatarFallback className="bg-primary text-primary-foreground text-xs">
                    {avatarFallback}
                  </AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="rounded-lg px-4 py-2 bg-muted flex items-center gap-2">
                    <div className="flex items-center gap-1">
                      {[1, 2, 3].map((i) => (
                        <motion.div
                          key={i}
                          animate={{ height: ["4px", "12px", "4px"] }}
                          transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, delay: i * 0.2 }}
                          className="w-1 bg-primary rounded-full"
                        />
                      ))}
                    </div>
                    <span className="text-sm text-muted-foreground">Thinking...</span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="rounded-lg px-4 py-2 bg-destructive/10 text-destructive text-sm"
            >
              {error}
            </motion.div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </CardContent>

      <CardFooter className="p-4 border-t">
        <div className="flex w-full items-center space-x-2">
          <Button
            variant={isRecording ? "destructive" : "outline"}
            size="icon"
            onClick={toggleRecording}
            className={isRecording ? "animate-pulse" : ""}
            type="button"
          >
            {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Input
            ref={inputRef}
            placeholder={isVoiceMode ? "Voice mode enabled..." : "Type your message..."}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            className="flex-1"
            disabled={isLoading || (isVoiceMode && isRecording)}
          />
          <Button
            type="submit"
            size="icon"
            onClick={handleSendMessage}
            disabled={(!input.trim() && !isRecording) || isLoading}
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}