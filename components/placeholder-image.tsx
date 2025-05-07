"use client"

import { useState, useEffect } from "react"
import { Skeleton } from "@/components/ui/skeleton"

interface PlaceholderImageProps {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fallbackSrc?: string
}

export default function PlaceholderImage({
  src,
  alt,
  width = 400,
  height = 400,
  className = "",
  fallbackSrc,
}: PlaceholderImageProps) {
  const [imgSrc, setImgSrc] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    // Reset states when src changes
    setIsLoading(true)
    setError(false)

    const image = new Image()
    image.src = src
    image.crossOrigin = "anonymous"

    image.onload = () => {
      setImgSrc(src)
      setIsLoading(false)
    }

    image.onerror = () => {
      setError(true)
      setIsLoading(false)
      if (fallbackSrc) {
        setImgSrc(fallbackSrc)
      } else {
        // Use placeholder with matching dimensions and name
        const fileName = src.split("/").pop()?.split(".")[0] || "image"
        setImgSrc(`/placeholder.jpg?height=${height}&width=${width}&text=${fileName}`)
      }
    }
  }, [src, height, width, fallbackSrc])

  if (isLoading) {
    return (
      <Skeleton
        className={`${className} animate-pulse rounded-md`}
        style={{ width: width ? `${width}px` : "100%", height: height ? `${height}px` : "100%" }}
      />
    )
  }

  return (
    <img
      src={imgSrc || `/placeholder.jpg?height=${height}&width=${width}&text=${alt}`}
      alt={alt}
      className={className}
      width={width}
      height={height}
    />
  )
}

