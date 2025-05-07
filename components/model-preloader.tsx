"use client"

import { useEffect, useState } from "react"
import { useAppleDiseaseModel } from "@/hooks/use-apple-disease-model"
import { Button } from "@/components/ui/button"
import { RefreshCw } from "lucide-react"

interface ModelPreloaderProps {
  onLoaded?: () => void
}

export default function ModelPreloader({ onLoaded }: ModelPreloaderProps) {
  const { isModelLoaded, isLoading, error, loadModel } = useAppleDiseaseModel()
  const [loadAttempts, setLoadAttempts] = useState(0)

  useEffect(() => {
    // Attempt to load the model when the component mounts
    if (!isModelLoaded && !isLoading && loadAttempts === 0) {
      loadModel()
      setLoadAttempts((prev) => prev + 1)
    }

    // Call onLoaded when the model is successfully loaded
    if (isModelLoaded && onLoaded) {
      onLoaded()
    }
  }, [isModelLoaded, isLoading, loadModel, loadAttempts, onLoaded])

  if (error) {
    return (
      <div className="p-4 bg-destructive/10 border border-destructive rounded-md text-center">
        <p className="text-destructive font-medium mb-2">Failed to load disease detection model</p>
        <p className="text-sm text-muted-foreground mb-4">{error}</p>
        <Button
          variant="outline"
          onClick={() => {
            loadModel()
            setLoadAttempts((prev) => prev + 1)
          }}
          className="mx-auto"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Retry Loading Model
        </Button>
      </div>
    )
  }

  if (isLoading) {
    return (
      <div className="p-4 bg-primary/5 border border-primary/20 rounded-md text-center">
        <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-primary" />
        <p className="text-sm">Loading disease detection model...</p>
      </div>
    )
  }

  if (isModelLoaded) {
    return (
      <div className="p-4 bg-green-100 dark:bg-green-900/30 border border-green-200 dark:border-green-900 rounded-md text-center">
        <p className="text-green-800 dark:text-green-300 font-medium">Model loaded successfully</p>
      </div>
    )
  }

  return null
}

