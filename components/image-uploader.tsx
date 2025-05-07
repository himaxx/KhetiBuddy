"use client"

import type React from "react"

import { useState, useRef } from "react"
import { motion } from "framer-motion"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Upload, ImageIcon } from "lucide-react"

interface ImageUploaderProps {
  onImageUpload: (imageData: string) => void
  title?: string
}

export default function ImageUploader({ onImageUpload, title = "Upload a plant leaf image" }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0])
    }
  }

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0])
    }
  }

  const handleFile = (file: File) => {
    if (!file.type.match("image.*")) {
      alert("Please select an image file")
      return
    }

    const reader = new FileReader()
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(e.target.result)
      }
    }
    reader.readAsDataURL(file)
  }

  return (
    <motion.div whileHover={{ scale: 1.01 }} transition={{ type: "spring", stiffness: 400, damping: 10 }}>
      <Card
        className={`border-2 border-dashed transition-all duration-200 ${
          isDragging ? "border-primary bg-primary/5" : "border-border"
        }`}
      >
        <CardContent
          className="flex flex-col items-center justify-center p-12 text-center cursor-pointer"
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <motion.div
            animate={{
              y: isDragging ? -10 : 0,
              scale: isDragging ? 1.1 : 1,
            }}
            className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mb-4"
          >
            {isDragging ? <ImageIcon className="h-8 w-8 text-primary" /> : <Upload className="h-8 w-8 text-primary" />}
          </motion.div>

          <h3 className="text-lg font-medium mb-2">{title}</h3>
          <p className="text-sm text-muted-foreground mb-4">Drag and drop your image here, or click to browse</p>

          <Button variant="outline" type="button" className="mt-2">
            Select Image
          </Button>

          <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileInput} />

          <p className="text-xs text-muted-foreground mt-4">Supported formats: JPG, PNG, WEBP</p>
        </CardContent>
      </Card>
    </motion.div>
  )
}

