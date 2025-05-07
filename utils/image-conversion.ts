"use client"

/**
 * Converts an image to the format required by the model
 * @param imageElement The image element to convert
 * @param targetSize The target size for the model input
 * @returns A canvas element with the processed image
 */
export function convertImageForModel(
  imageElement: HTMLImageElement | HTMLVideoElement,
  targetSize: { width: number; height: number } = { width: 224, height: 224 },
): HTMLCanvasElement {
  // Create a canvas element
  const canvas = document.createElement("canvas")
  canvas.width = targetSize.width
  canvas.height = targetSize.height

  const ctx = canvas.getContext("2d")
  if (!ctx) {
    throw new Error("Could not get canvas context")
  }

  // Fill with black background
  ctx.fillStyle = "#000000"
  ctx.fillRect(0, 0, targetSize.width, targetSize.height)

  // Calculate dimensions to maintain aspect ratio
  const sourceWidth = imageElement instanceof HTMLImageElement ? imageElement.naturalWidth : imageElement.videoWidth
  const sourceHeight = imageElement instanceof HTMLImageElement ? imageElement.naturalHeight : imageElement.videoHeight

  if (!sourceWidth || !sourceHeight) {
    throw new Error("Invalid image dimensions")
  }

  const sourceAspect = sourceWidth / sourceHeight
  const targetAspect = targetSize.width / targetSize.height

  let drawWidth,
    drawHeight,
    offsetX = 0,
    offsetY = 0

  if (sourceAspect > targetAspect) {
    // Source is wider than target
    drawHeight = targetSize.height
    drawWidth = sourceWidth * (targetSize.height / sourceHeight)
    offsetX = (targetSize.width - drawWidth) / 2
  } else {
    // Source is taller than target
    drawWidth = targetSize.width
    drawHeight = sourceHeight * (targetSize.width / sourceWidth)
    offsetY = (targetSize.height - drawHeight) / 2
  }

  // Draw image centered on canvas
  ctx.drawImage(imageElement, offsetX, offsetY, drawWidth, drawHeight)

  return canvas
}

