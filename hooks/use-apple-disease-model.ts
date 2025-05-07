"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"

// Import the image conversion utility
import { convertImageForModel } from "@/utils/image-conversion"

// Define the prediction type
export interface Prediction {
  className: string
  probability: number
}

export interface AppleDiseaseModelHook {
  isModelLoaded: boolean
  isLoading: boolean
  error: string | null
  predict: (imageElement: HTMLImageElement | HTMLCanvasElement) => Promise<Prediction[]>
  startWebcam: () => Promise<void>
  stopWebcam: () => void
  webcamRef: React.RefObject<HTMLVideoElement>
  canvasRef: React.RefObject<HTMLCanvasElement>
  isPredicting: boolean
  predictions: Prediction[]
  loadModel: () => Promise<void>
}

export function useAppleDiseaseModel(): AppleDiseaseModelHook {
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isPredicting, setIsPredicting] = useState(false)
  const [predictions, setPredictions] = useState<Prediction[]>([])

  const modelRef = useRef<any>(null)
  const webcamRef = useRef<HTMLVideoElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const streamRef = useRef<MediaStream | null>(null)

  // Load the TensorFlow.js and Teachable Machine libraries
  useEffect(() => {
    const loadScripts = async () => {
      try {
        // Check if the scripts are already loaded
        if (typeof window !== "undefined" && window.tf && window.tmImage) {
          return
        }

        console.log("Loading TensorFlow.js and Teachable Machine libraries...")

        // Load TensorFlow.js
        const tfScript = document.createElement("script")
        tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
        tfScript.async = true

        // Load Teachable Machine Image library
        const tmScript = document.createElement("script")
        tmScript.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
        tmScript.async = true

        // Add scripts to document
        document.body.appendChild(tfScript)
        document.body.appendChild(tmScript)

        // Wait for both scripts to load
        await new Promise<void>((resolve) => {
          let tfLoaded = false
          let tmLoaded = false

          tfScript.onload = () => {
            console.log("TensorFlow.js loaded")
            tfLoaded = true
            if (tmLoaded) resolve()
          }

          tmScript.onload = () => {
            console.log("Teachable Machine library loaded")
            tmLoaded = true
            if (tfLoaded) resolve()
          }

          // Handle script loading errors
          tfScript.onerror = (e) => {
            console.error("Error loading TensorFlow.js:", e)
            setError("Failed to load TensorFlow.js library")
          }

          tmScript.onerror = (e) => {
            console.error("Error loading Teachable Machine library:", e)
            setError("Failed to load Teachable Machine library")
          }
        })

        console.log("Both libraries loaded successfully")
      } catch (err) {
        console.error("Error loading scripts:", err)
        setError("Failed to load required libraries")
      }
    }

    loadScripts()
  }, [])

  // Load the model
  const loadModel = async () => {
    if (typeof window === "undefined" || !window.tmImage) {
      console.error("Teachable Machine library not available")
      setError("Required libraries not loaded")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const modelURL = "/models/apple/model.json"
      const metadataURL = "/models/apple/metadata.json"

      console.log("Loading model from:", modelURL)
      console.log("Loading metadata from:", metadataURL)

      // Add a small delay to ensure libraries are fully initialized
      await new Promise((resolve) => setTimeout(resolve, 500))

      modelRef.current = await window.tmImage.load(modelURL, metadataURL)
      console.log("Model loaded successfully")
      setIsModelLoaded(true)
    } catch (err) {
      console.error("Error loading model:", err)
      setError(`Failed to load the disease detection model: ${err.message || "Unknown error"}`)
    } finally {
      setIsLoading(false)
    }
  }

  // Load model when libraries are available
  useEffect(() => {
    if (typeof window !== "undefined" && window.tmImage && !isModelLoaded && !isLoading) {
      loadModel()
    }
  }, [isModelLoaded, isLoading])

  // Predict function
  const predict = async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<Prediction[]> => {
    if (!modelRef.current) {
      console.error("Model not loaded")
      throw new Error("Model not loaded")
    }

    setIsPredicting(true)

    try {
      // Convert the image to the format required by the model
      const processedCanvas = convertImageForModel(imageElement)

      // Make prediction with the processed image
      console.log("Making prediction with processed image...")
      const predictions = await modelRef.current.predict(processedCanvas)
      console.log("Raw prediction results:", predictions)

      setPredictions(predictions)
      return predictions
    } catch (err) {
      console.error("Error making prediction:", err)
      throw new Error(`Failed to analyze the image: ${err.message || "Unknown error"}`)
    } finally {
      setIsPredicting(false)
    }
  }

  // Start webcam
  const startWebcam = async () => {
    if (!webcamRef.current) {
      throw new Error("Webcam reference not available")
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      })

      webcamRef.current.srcObject = stream
      streamRef.current = stream

      return new Promise<void>((resolve) => {
        if (webcamRef.current) {
          webcamRef.current.onloadedmetadata = () => {
            if (webcamRef.current) {
              webcamRef.current.play().then(resolve)
            }
          }
        }
      })
    } catch (err) {
      console.error("Error accessing webcam:", err)
      throw new Error("Failed to access camera")
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((track) => track.stop())
      streamRef.current = null
    }

    if (webcamRef.current) {
      webcamRef.current.srcObject = null
    }
  }

  return {
    isModelLoaded,
    isLoading,
    error,
    predict,
    startWebcam,
    stopWebcam,
    webcamRef,
    canvasRef,
    isPredicting,
    predictions,
    loadModel, // Add this line to expose the loadModel function
  }
}

