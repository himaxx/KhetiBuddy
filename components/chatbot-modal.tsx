"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Mic, MicOff, Send, X, Volume2, MessageSquare, Wand2 } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"
import { useMediaQuery } from "@/hooks/use-media-query"

interface ChatbotModalProps {
  isOpen: boolean
  onClose: () => void
  plantName?: string
  disease?: string
}

interface Message {
  id: string
  content: string
  sender: "user" | "bot"
  timestamp: Date
  isVoice?: boolean
}

export default function ChatbotModal({ isOpen, onClose, plantName, disease }: ChatbotModalProps) {
  const { t, language } = useLanguage()
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [isVoiceMode, setIsVoiceMode] = useState(false)
  const [currentSpeakingId, setCurrentSpeakingId] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const isMobile = useMediaQuery("(max-width: 640px)")

  useEffect(() => {
    if (isOpen) {
      // Add initial greeting
      const initialMessage = disease
        ? `Hello! I can help you with treatment options for ${disease} on your ${plantName}. What would you like to know?`
        : `Hello! I can help you learn more about your ${plantName}. What would you like to know?`

      setMessages([
        {
          id: "welcome",
          content: initialMessage,
          sender: "bot",
          timestamp: new Date(),
        },
      ])
    } else {
      // Reset state when modal closes
      setMessages([])
      setInput("")
      setIsSpeaking(false)
      setIsRecording(false)
      setCurrentSpeakingId(null)
    }
  }, [isOpen, plantName, disease])

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  const handleSendMessage = () => {
    if (!input.trim() && !isRecording) return

    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      content: isRecording ? "Voice message..." : input,
      sender: "user",
      timestamp: new Date(),
      isVoice: isRecording,
    }

    setMessages((prev) => [...prev, userMessage])
    setInput("")

    // Simulate bot response after a delay
    setTimeout(() => {
      let botResponse = ""

      if (disease) {
        if (input.toLowerCase().includes("treatment") || input.toLowerCase().includes("cure")) {
          botResponse = `For treating ${disease} on ${plantName}, I recommend removing affected leaves, applying a suitable fungicide, and ensuring proper air circulation. Would you like more specific instructions?`
        } else if (input.toLowerCase().includes("prevent")) {
          botResponse = `To prevent ${disease} from spreading or recurring, maintain proper spacing between plants, avoid overhead watering, and ensure good air circulation. Regular inspection of plants can help catch issues early.`
        } else {
          botResponse = `${disease} is a common issue with ${plantName} plants. It typically affects the leaves and can spread if not treated. Would you like to know about treatment options or prevention methods?`
        }
      } else {
        if (input.toLowerCase().includes("care") || input.toLowerCase().includes("water")) {
          botResponse = `${plantName} prefers bright, indirect light and should be watered when the top inch of soil feels dry. They enjoy higher humidity but can adapt to average home conditions.`
        } else if (input.toLowerCase().includes("propagate") || input.toLowerCase().includes("grow")) {
          botResponse = `${plantName} can be propagated through stem cuttings. Cut a section with at least one node, place in water until roots develop, then transfer to soil.`
        } else {
          botResponse = `${plantName} is a popular houseplant known for its distinctive appearance. It's relatively easy to care for and can thrive in most indoor environments with proper attention. What specific aspect would you like to learn about?`
        }
      }

      const botMessageId = Date.now().toString()
      const botMessage: Message = {
        id: botMessageId,
        content: botResponse,
        sender: "bot",
        timestamp: new Date(),
      }

      setMessages((prev) => [...prev, botMessage])

      // If in voice mode, automatically speak the bot response
      if (isVoiceMode) {
        setTimeout(() => {
          speakMessage(botMessageId, botResponse)
        }, 500)
      }
    }, 1000)

    // Reset recording state if was recording
    if (isRecording) {
      setIsRecording(false)
    }
  }

  const toggleRecording = () => {
    if (!isRecording) {
      startRecording()
    } else {
      stopRecording()
    }
  }

  const startRecording = () => {
    setIsRecording(true)

    // Simulate recording for 3 seconds
    setTimeout(() => {
      if (isRecording) {
        stopRecording()
        handleSendMessage()
      }
    }, 3000)
  }

  const stopRecording = () => {
    setIsRecording(false)
  }

  const speakMessage = (id: string, message: string) => {
    // Stop any currently playing speech
    if (isSpeaking) {
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
      // In a real app: speechSynthesis.cancel()
    }

    setIsSpeaking(true)
    setCurrentSpeakingId(id)

    // Simulate speech for 3 seconds
    setTimeout(() => {
      setIsSpeaking(false)
      setCurrentSpeakingId(null)
    }, 3000)

    // In a real app, you would use the Web Speech API:
    // const utterance = new SpeechSynthesisUtterance(message)
    // speechSynthesis.speak(utterance)
    // utterance.onend = () => {
    //   setIsSpeaking(false)
    //   setCurrentSpeakingId(null)
    // }
  }

  const handleVoiceModeToggle = (checked: boolean) => {
    setIsVoiceMode(checked)
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-md md:max-w-lg">
        <DialogHeader className="flex flex-row items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
            <DialogTitle>KhetiBuddy Assistant</DialogTitle>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center space-x-2">
              <Label htmlFor="voice-mode" className="text-xs">
                <MessageSquare className="h-4 w-4 inline mr-1" />
                <Wand2 className="h-4 w-4 inline mr-1" />
              </Label>
              <Switch id="voice-mode" checked={isVoiceMode} onCheckedChange={handleVoiceModeToggle} />
              <Label htmlFor="voice-mode" className="text-xs">
                <Mic className="h-4 w-4 inline mr-1" />
                <Volume2 className="h-4 w-4 inline" />
              </Label>
            </div>

            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={onClose}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="flex flex-col space-y-4 max-h-[60vh] overflow-y-auto p-4 -mx-4">
          <AnimatePresence initial={false}>
            {messages.map((message) => (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.2 }}
                className={`flex ${message.sender === "user" ? "justify-end" : "justify-start"}`}
              >
                <div className={`flex gap-3 max-w-[80%] ${message.sender === "user" ? "flex-row-reverse" : ""}`}>
                  {message.sender === "bot" && (
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder1.svg?height=32&width=32&text=KB" />
                      <AvatarFallback className="bg-primary text-primary-foreground">KB</AvatarFallback>
                    </Avatar>
                  )}

                  <div className="space-y-1">
                    <motion.div
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      className={`rounded-lg px-4 py-2 relative ${
                        message.sender === "user" ? "bg-primary text-primary-foreground" : "bg-muted"
                      }`}
                    >
                      {/* Speech visualization for voice messages */}
                      {message.isVoice && (
                        <div className="flex items-center justify-center mb-1">
                          {[...Array(5)].map((_, i) => (
                            <motion.div
                              key={i}
                              className="w-1 mx-[1px] bg-current"
                              animate={{
                                height: ["4px", "12px", "4px"],
                                opacity: [0.7, 1, 0.7],
                              }}
                              transition={{
                                duration: 1,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.2,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {/* Special chat bubble for voice mode */}
                      {isVoiceMode && (
                        <motion.div
                          className={`absolute ${message.sender === "user" ? "right-full mr-1" : "left-full ml-1"} top-1/2 -translate-y-1/2 w-2 h-2 rounded-full`}
                          style={{
                            background: message.sender === "user" ? "hsl(var(--primary))" : "hsl(var(--muted))",
                          }}
                        />
                      )}

                      {/* Futuristic speech bubbles design for voice mode */}
                      {isVoiceMode && (
                        <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-lg">
                          <motion.div
                            className={`absolute inset-x-0 bottom-0 h-1 ${
                              message.sender === "user" ? "bg-primary-foreground/30" : "bg-foreground/10"
                            }`}
                            animate={{
                              scaleX: currentSpeakingId === message.id ? [0.3, 1, 0.7, 0.9, 0.4] : 1,
                            }}
                            transition={{
                              duration: 2,
                              repeat: Number.POSITIVE_INFINITY,
                              repeatType: "reverse",
                            }}
                          />

                          {[...Array(3)].map((_, i) => (
                            <motion.div
                              key={i}
                              className={`absolute w-12 h-12 rounded-full ${
                                message.sender === "user" ? "bg-primary-foreground/5" : "bg-foreground/5"
                              }`}
                              style={{
                                top: "50%",
                                left: i === 0 ? "30%" : i === 1 ? "60%" : "10%",
                              }}
                              animate={{
                                scale: currentSpeakingId === message.id ? [1, 1.5, 1] : [1, 1.1, 1],
                                opacity: currentSpeakingId === message.id ? [0.1, 0.3, 0.1] : 0.1,
                              }}
                              transition={{
                                duration: 3,
                                repeat: Number.POSITIVE_INFINITY,
                                delay: i * 0.5,
                              }}
                            />
                          ))}
                        </div>
                      )}

                      {message.content}

                      {message.sender === "bot" && (
                        <Button
                          variant="ghost"
                          size="icon"
                          className={`h-6 w-6 ml-1 ${currentSpeakingId === message.id ? "text-primary animate-pulse" : "opacity-70 hover:opacity-100"}`}
                          onClick={() => speakMessage(message.id, message.content)}
                          disabled={isSpeaking && currentSpeakingId !== message.id}
                        >
                          <Volume2 className="h-3 w-3" />
                        </Button>
                      )}
                    </motion.div>

                    <p className="text-xs text-muted-foreground px-1">
                      {message.timestamp.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
          <div ref={messagesEndRef} />
        </div>

        <DialogFooter className="flex-col sm:flex-row sm:justify-between gap-2">
          <div className="flex items-center gap-2">
            <Button
              variant={isRecording ? "destructive" : "outline"}
              size="icon"
              onClick={toggleRecording}
              className={isRecording ? "animate-pulse" : ""}
            >
              {isRecording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
            </Button>

            {(isSpeaking || isRecording) && (
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">{isSpeaking ? "Speaking" : "Listening"}</span>
                <div className="flex items-center gap-0.5">
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={i}
                      animate={{ height: ["4px", "12px", "4px"] }}
                      transition={{
                        duration: 1,
                        repeat: Number.POSITIVE_INFINITY,
                        delay: i * 0.2,
                      }}
                      className="w-1 bg-primary rounded-full"
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex w-full sm:max-w-[300px] items-center space-x-2">
            <Input
              placeholder={isVoiceMode ? "Voice mode enabled..." : "Type your message..."}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSendMessage()}
              className="flex-1"
              disabled={isVoiceMode || isRecording}
            />
            <Button type="submit" size="icon" onClick={handleSendMessage} disabled={isRecording}>
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

