"use client"

import * as React from "react"
import * as SwitchPrimitives from "@radix-ui/react-switch"

import { cn } from "@/lib/utils"

interface SwitchProps extends React.ComponentPropsWithoutRef<typeof SwitchPrimitives.Root> {
  size?: "default" | "sm" | "lg"
}

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitives.Root>, SwitchProps>(
  ({ className, size = "default", ...props }, ref) => {
    const sizeClasses = {
      sm: "h-[16px] w-[28px] rounded-full",
      default: "h-[24px] w-[44px] rounded-full",
      lg: "h-[32px] w-[56px] rounded-full",
    }

    const thumbSizeClasses = {
      sm: "h-[12px] w-[12px] data-[state=checked]:translate-x-[12px]",
      default: "h-[20px] w-[20px] data-[state=checked]:translate-x-[20px]",
      lg: "h-[28px] w-[28px] data-[state=checked]:translate-x-[24px]",
    }

    return (
      <SwitchPrimitives.Root
        className={cn(
          "peer inline-flex shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input",
          sizeClasses[size],
          className,
        )}
        {...props}
        ref={ref}
      >
        <SwitchPrimitives.Thumb
          className={cn(
            "pointer-events-none block rounded-full bg-background shadow-lg ring-0 transition-transform",
            thumbSizeClasses[size],
          )}
        />
      </SwitchPrimitives.Root>
    )
  },
)
Switch.displayName = SwitchPrimitives.Root.displayName

export { Switch }

