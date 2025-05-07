"use client"
import { Progress } from "@/components/ui/progress"
import LeafLoadingAnimation from "./leaf-loading-animation"

interface ProcessingAnimationProps {
  text: string
  step?: number
  totalSteps?: number
}

export default function ProcessingAnimation({ text, step = 1, totalSteps = 1 }: ProcessingAnimationProps) {
  const progress = (step / totalSteps) * 100

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <LeafLoadingAnimation text={text} />

      {totalSteps > 1 && (
        <div className="w-full max-w-xs mt-6">
          <Progress value={progress} className="h-2" />
          <p className="text-xs text-muted-foreground text-center mt-2">
            Step {step} of {totalSteps}
          </p>
        </div>
      )}
    </div>
  )
}

