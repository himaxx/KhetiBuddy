"use client"

import { useState, useEffect, useRef } from "react"

// Define types for predictions
export interface Prediction {
  className: string
  probability: number
}

export function useAppleDiseaseModel() {
  const [isModelLoaded, setIsModelLoaded] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [predictions, setPredictions] = useState<Prediction[]>([])

  // References for model and webcam
  const modelRef = useRef<any>(null)
  const webcamRef = useRef<any>(null)

  // Load TensorFlow.js and Teachable Machine libraries
  useEffect(() => {
    const loadLibraries = async () => {
      try {
        // Check if libraries are already loaded
        if (typeof window !== "undefined" && window.tf && window.tmImage) {
          return
        }

        setIsLoading(true)

        // Load TensorFlow.js
        const tfScript = document.createElement("script")
        tfScript.src = "https://cdn.jsdelivr.net/npm/@tensorflow/tfjs@latest/dist/tf.min.js"
        tfScript.async = true

        // Load Teachable Machine Image library
        const tmScript = document.createElement("script")
        tmScript.src = "https://cdn.jsdelivr.net/npm/@teachablemachine/image@latest/dist/teachablemachine-image.min.js"
        tmScript.async = true

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

          tfScript.onerror = () => {
            setError("Failed to load TensorFlow.js")
          }

          tmScript.onerror = () => {
            setError("Failed to load Teachable Machine library")
          }
        })

        console.log("Libraries loaded successfully")
      } catch (err) {
        console.error("Error loading libraries:", err)
        setError("Failed to load required libraries")
      } finally {
        setIsLoading(false)
      }
    }

    loadLibraries()
  }, [])

  // Load the model
  const loadModel = async () => {
    if (typeof window === "undefined" || !window.tmImage) {
      setError("Required libraries not loaded")
      return
    }

    try {
      setIsLoading(true)
      setError(null)

      const modelURL = "/models/apple/model.json"
      const metadataURL = "/models/apple/metadata.json"

      console.log("Loading model from:", modelURL)

      // Load the model
      modelRef.current = await window.tmImage.load(modelURL, metadataURL)
      setIsModelLoaded(true)
      console.log("Model loaded successfully")
    } catch (err) {
      console.error("Error loading model:", err)
      setError(`Failed to load model: ${err instanceof Error ? err.message : String(err)}`)
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

  // Predict function for uploaded images
  const predict = async (imageElement: HTMLImageElement | HTMLCanvasElement): Promise<Prediction[]> => {
    if (!modelRef.current) {
      throw new Error("Model not loaded")
    }

    try {
      // Run prediction
      const predictions = await modelRef.current.predict(imageElement)
      setPredictions(predictions)
      return predictions
    } catch (err) {
      console.error("Prediction error:", err)
      throw new Error(`Failed to analyze the image: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Setup webcam
  const setupWebcam = async (webcamElement: HTMLVideoElement, width = 200, height = 200, flip = true) => {
    if (!window.tmImage) {
      throw new Error("Teachable Machine library not loaded")
    }

    try {
      webcamRef.current = new window.tmImage.Webcam(width, height, flip)
      await webcamRef.current.setup()
      await webcamRef.current.play()
      webcamElement.srcObject = webcamRef.current.webcam.srcObject

      return webcamRef.current
    } catch (err) {
      console.error("Error setting up webcam:", err)
      throw new Error(`Failed to setup webcam: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Predict from webcam
  const predictFromWebcam = async (): Promise<Prediction[]> => {
    if (!modelRef.current || !webcamRef.current) {
      throw new Error("Model or webcam not initialized")
    }

    try {
      webcamRef.current.update()
      const predictions = await modelRef.current.predict(webcamRef.current.canvas)
      setPredictions(predictions)
      return predictions
    } catch (err) {
      console.error("Webcam prediction error:", err)
      throw new Error(`Failed to analyze webcam image: ${err instanceof Error ? err.message : String(err)}`)
    }
  }

  // Stop webcam
  const stopWebcam = () => {
    if (webcamRef.current) {
      webcamRef.current.stop()
    }
  }

  return {
    isModelLoaded,
    isLoading,
    error,
    predictions,
    loadModel,
    predict,
    setupWebcam,
    predictFromWebcam,
    stopWebcam,
    webcamRef,
  }
}

