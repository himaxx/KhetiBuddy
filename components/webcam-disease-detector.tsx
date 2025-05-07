"use client"

import { useEffect, useRef, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Camera, CameraOff, RefreshCw } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { usePlantDiseaseModel, type Prediction, type PlantType } from "@/hooks/use-plant-disease-model"

interface WebcamDiseaseDetectorProps {
  plantType: PlantType
  onResult?: (predictions: Prediction[]) => void
}

export default function WebcamDiseaseDetector({ plantType, onResult }: WebcamDiseaseDetectorProps) {
  const { isModelLoaded, isLoading, error, predictions, loadModel, setupWebcam, predictFromWebcam, stopWebcam } =
    usePlantDiseaseModel(plantType)

  const [isWebcamActive, setIsWebcamActive] = useState(false)
  const [isContinuousMode, setIsContinuousMode] = useState(false)
  const [isPredicting, setIsPredicting] = useState(false)
  const webcamElementRef = useRef<HTMLVideoElement>(null)
  const animationFrameRef = useRef<number | null>(null)

  // Handle component unmount
  useEffect(() => {
    return () => {
      stopWebcam()
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [stopWebcam])

  // Toggle webcam
  const toggleWebcam = async () => {
    if (isWebcamActive) {
      stopContinuousDetection()
      stopWebcam()
      setIsWebcamActive(false)
    } else {
      try {
        if (!webcamElementRef.current) return

        await setupWebcam(webcamElementRef.current, 400, 300, true)
        setIsWebcamActive(true)
      } catch (err) {
        console.error("Failed to start webcam:", err)
      }
    }
  }

  // Capture frame and make prediction
  const captureAndPredict = async () => {
    if (!isModelLoaded || isPredicting) {
      return
    }

    try {
      setIsPredicting(true)
      const results = await predictFromWebcam()

      if (onResult) {
        onResult(results)
      }
    } catch (err) {
      console.error("Prediction error:", err)
    } finally {
      setIsPredicting(false)
    }
  }

  // Continuous detection loop
  const continuousDetection = () => {
    captureAndPredict()
    animationFrameRef.current = requestAnimationFrame(continuousDetection)
  }

  // Start continuous detection
  const startContinuousDetection = () => {
    setIsContinuousMode(true)
    continuousDetection()
  }

  // Stop continuous detection
  const stopContinuousDetection = () => {
    setIsContinuousMode(false)
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
  }

  // Toggle continuous mode
  const toggleContinuousMode = () => {
    if (isContinuousMode) {
      stopContinuousDetection()
    } else {
      startContinuousDetection()
    }
  }

  return (
    <Card className="overflow-hidden">
      <CardContent className="p-6 space-y-4">
        <div className="relative aspect-video bg-muted rounded-md overflow-hidden">
          {!isModelLoaded && !error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <RefreshCw className="h-8 w-8 animate-spin mx-auto mb-2 text-primary" />
                <p>Loading {plantType} disease detection model...</p>
                <p className="text-xs text-muted-foreground mt-2">This may take a moment</p>
              </div>
            </div>
          ) : error ? (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-destructive">
                <p>{error}</p>
                <Button variant="outline" className="mt-2" onClick={loadModel}>
                  Retry Loading Model
                </Button>
              </div>
            </div>
          ) : (
            <>
              <video
                ref={webcamElementRef}
                className={`w-full h-full object-cover ${isWebcamActive ? "block" : "hidden"}`}
                playsInline
                autoPlay
              />

              {!isWebcamActive && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <Button onClick={toggleWebcam}>
                    <Camera className="mr-2 h-4 w-4" />
                    Start Camera
                  </Button>
                </div>
              )}
            </>
          )}

          {/* Prediction overlay */}
          {isWebcamActive && predictions.length > 0 && (
            <div className="absolute bottom-0 left-0 right-0 bg-background/80 backdrop-blur-sm p-2 space-y-1">
              {predictions.map((prediction, index) => {
                // Format display name
                let displayName = prediction.className
                if (displayName.includes("___")) {
                  const parts = displayName.split("___")
                  displayName = parts[1].replace(/_/g, " ")
                }

                return (
                  <div key={index} className="flex items-center justify-between text-sm">
                    <span>{displayName}</span>
                    <div className="flex items-center gap-2 w-1/2">
                      <Progress value={prediction.probability * 100} className="h-2" />
                      <span className="w-12 text-right">{(prediction.probability * 100).toFixed(0)}%</span>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>

        {isWebcamActive && (
          <div className="flex justify-between">
            <Button variant="outline" onClick={toggleWebcam}>
              <CameraOff className="mr-2 h-4 w-4" />
              Stop Camera
            </Button>

            <div className="space-x-2">
              <Button
                variant={isContinuousMode ? "default" : "outline"}
                onClick={toggleContinuousMode}
                disabled={isPredicting}
              >
                {isContinuousMode ? "Stop Scanning" : "Continuous Scan"}
              </Button>

              <Button onClick={captureAndPredict} disabled={!isWebcamActive || isPredicting || isContinuousMode}>
                {isPredicting ? (
                  <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                ) : (
                  <Camera className="mr-2 h-4 w-4" />
                )}
                Capture & Analyze
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}

