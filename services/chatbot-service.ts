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
  // Send a message to the chatbot API (unchanged)
  async sendMessage(message: string): Promise<ChatbotResponse> {
    try {
      const response = await fetch(
        "https://himmaannsshhuu-langflow.hf.space/api/v1/run/091c2c86-1b23-442f-b82a-09c961f8625a?stream=false",
        {
          method: "POST",
          headers: {
            "Authorization": "Bearer <TOKEN>", // Replace <TOKEN> with your actual token
            "Content-Type": "application/json",
            "x-api-key": "<your api key>", // Replace <your api key> with your actual API key
          },
          body: JSON.stringify({
            input_value: message,
            output_type: "chat",
            input_type: "chat",
            tweaks: {
              "ChatInput-2dWln": {},
              "ChatOutput-DcQGT": {},
              "Memory-JcssA": {},
              "Prompt-k7ER5": {},
              "GoogleGenerativeAIModel-jIQYE": {}
            }
          }),
        },
      )

      if (!response.ok) {
        throw new Error(`API error: ${response.status}`)
      }

      const data = await response.json()
      console.log("API response:", data)

      // The response structure may differ, adjust as needed
      return {
        message: data.outputs?.[0]?.outputs?.[0]?.results?.message?.text || "Sorry, I couldn't process your request.",
        status: "success",
      }
    } catch (error) {
      console.error("Error sending message to chatbot:", error)
      return {
        message: "Sorry, there was an error processing your request. Please try again later.",
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