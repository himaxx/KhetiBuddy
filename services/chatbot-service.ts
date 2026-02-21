"use client"

import axios from 'axios';

// Define the types for the chatbot API
export interface ChatMessage {
  role: "user" | "assistant" | "system"
  content: string
  timestamp?: Date
  id?: string // Added to match AIChatbot.tsx expectations
}

export interface ChatbotResponse {
  message: string
  status: string
}

export interface ChatbotState {
  messages: ChatMessage[]
  isLoading: boolean
  error: string | null
}

// The main chatbot service
export const chatbotService = {
  // Send a message to the chatbot API
  async sendMessage(message: string, history: any[] = []): Promise<ChatbotResponse> {
    try {
      const { openrouterService } = await import("./openrouter-service")
      const answer = await openrouterService.chat(message, history)

      return {
        message: answer,
        status: "success",
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error)
      return {
        message: "Sorry, I'm having trouble connecting to my neural network. Please check your connection or try again later.",
        status: "error",
      }
    }
  },

  // Convert text to speech using Play.ht API
  async speakText(text: string, language: string = "en-US"): Promise<string | null> {
    try {
      const response = await axios.post('/api/tts', { text, language }); // Updated API call
      console.log("Speech response:", response.data);
      if (response.data && response.data._links && response.data._links.download) {
        return response.data._links.download.href;  // Return the audio URL
      }
      return null;
    } catch (error) {
      console.error("Text-to-Speech Error:", error); // Updated error message
      return null;
    }
  },

  // Start speech recognition (unchanged)
  startSpeechRecognition(
    onResult: (transcript: string) => void,
    onEnd: () => void,
    onError: (error: string) => void,
  ): SpeechRecognition | null {
    if (!window.SpeechRecognition && !window.webkitSpeechRecognition) {
      console.error("Speech recognition not supported")
      onError("Speech recognition is not supported in your browser.")
      return null
    }

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition
    const recognition = new SpeechRecognition()

    recognition.continuous = false
    recognition.interimResults = true
    recognition.lang = "en-US, hi-IN"

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      const transcript = Array.from(event.results)
        .map((result) => result[0])
        .map((result) => result.transcript)
        .join("")
      onResult(transcript)
    }

    recognition.onend = () => {
      onEnd()
    }

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      onError(`Speech recognition error: ${event.error}`)
    }

    recognition.start()
    return recognition
  },
}

// Add TypeScript declarations for the Web Speech API
declare global {
  interface Window {
    SpeechRecognition: any
    webkitSpeechRecognition: any
  }
}