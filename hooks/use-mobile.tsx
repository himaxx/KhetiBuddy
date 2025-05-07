"use client"

import { useState, useEffect } from "react"
import { useMediaQuery } from "./use-media-query"

export function useMobile() {
  const isMobileDevice = useMediaQuery("(max-width: 768px)")
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    // Check if device supports touch events
    setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0 || navigator.msMaxTouchPoints > 0)
  }, [])

  return {
    isMobileDevice,
    isTouchDevice,
  }
}

