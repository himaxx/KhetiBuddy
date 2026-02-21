"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Upload, X, ImageIcon, Camera, CheckCircle2, ShieldCheck, Zap, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface EnhancedImageUploaderProps {
  onImageUpload: (imageData: string) => void
  onCameraStart?: () => void
  title?: string
  className?: string
}

export default function EnhancedImageUploader({
  onImageUpload,
  onCameraStart,
  title,
  className,
}: EnhancedImageUploaderProps) {
  const [dragActive, setDragActive] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const processFile = (file: File) => {
    if (file && file.type.startsWith("image/")) {
      setUploadStatus("uploading")
      const reader = new FileReader()
      reader.onload = (e) => {
        const result = e.target?.result as string
        setPreview(result)
        setUploadStatus("success")
        setTimeout(() => {
          onImageUpload(result)
        }, 800)
      }
      reader.onerror = () => {
        setUploadStatus("error")
      }
      reader.readAsDataURL(file)
    } else {
      setUploadStatus("error")
      setTimeout(() => setUploadStatus("idle"), 3000)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0])
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0])
    }
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  const clearImage = (e: React.MouseEvent) => {
    e.stopPropagation()
    setPreview(null)
    setUploadStatus("idle")
  }

  return (
    <div className={cn("w-full max-w-2xl mx-auto", className)}>
      <motion.div
        className={cn(
          "relative group rounded-[2.5rem] border-2 border-dashed transition-all duration-500 overflow-hidden min-h-[400px] flex items-center justify-center",
          dragActive
            ? "border-primary bg-primary/5 scale-[1.01]"
            : "border-muted-foreground/20 bg-card/40 hover:border-primary/40 hover:bg-primary/[0.02] backdrop-blur-sm",
          preview ? "border-solid border-primary bg-card/10" : "",
          uploadStatus === "error" ? "border-destructive bg-destructive/5" : ""
        )}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <AnimatePresence mode="wait">
          {!preview ? (
            <motion.div
              key="uploader"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.05 }}
              className="p-10 md:p-16 flex flex-col items-center text-center space-y-8 w-full"
            >
              <div className="relative">
                <motion.div
                  className="w-24 h-24 rounded-3xl bg-primary/10 flex items-center justify-center text-primary relative z-10"
                  animate={dragActive ? { scale: 1.1, rotate: [0, 5, -5, 0] } : {}}
                  transition={{ duration: 0.5 }}
                >
                  <Upload className="w-10 h-10" />
                </motion.div>
                <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full scale-150 opacity-50 group-hover:opacity-100 transition-opacity" />
              </div>

              <div className="space-y-3">
                <h3 className="text-2xl md:text-3xl font-black tracking-tight">
                  {title || "Diagnostic Scan"}
                </h3>
                <p className="text-muted-foreground font-medium max-w-sm mx-auto">
                  Drop leaf image here or <span className="text-primary font-bold cursor-pointer hover:underline" onClick={onButtonClick}>browse gallery</span>
                </p>
              </div>

              <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
                {[
                  { icon: ShieldCheck, label: "Private" },
                  { icon: Zap, label: "Instant" },
                  { icon: CheckCircle2, label: "AI Neural" }
                ].map((badge, i) => (
                  <div key={i} className="flex items-center gap-2 text-[10px] font-black text-muted-foreground uppercase tracking-widest bg-muted/60 px-4 py-2 rounded-xl border border-border/50">
                    <badge.icon className="w-3 h-3 text-primary" />
                    {badge.label}
                  </div>
                ))}
              </div>

              <div className="flex flex-col sm:flex-row gap-4 w-full max-w-md pt-4">
                <Button onClick={onButtonClick} size="xl" className="flex-1 shadow-2xl shadow-primary/20 font-bold">
                  <ImageIcon className="mr-2 h-5 w-5" />
                  Add Photo
                </Button>
                {onCameraStart && (
                  <Button onClick={onCameraStart} variant="outline" size="xl" className="flex-1 font-bold backdrop-blur-md">
                    <Camera className="mr-2 h-5 w-5" />
                    Live Scan
                  </Button>
                )}
              </div>

              {uploadStatus === "error" && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex items-center gap-2 text-destructive text-sm font-bold"
                >
                  <AlertCircle className="w-4 h-4" />
                  Please upload a valid image file.
                </motion.div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="p-6 w-full flex flex-col items-center"
            >
              <div className="relative rounded-[2rem] overflow-hidden shadow-[0_32px_64px_-16px_rgba(0,0,0,0.3)] group/preview max-w-lg w-full">
                <img src={preview} alt="Scan preview" className="w-full h-auto aspect-square object-cover" />

                {uploadStatus === "uploading" || uploadStatus === "success" && (
                  <div className="absolute inset-0 bg-primary/20 backdrop-blur-[2px] flex items-center justify-center">
                    <div className="bg-background/90 backdrop-blur-xl px-8 py-4 rounded-[1.5rem] border border-primary/20 shadow-2xl flex flex-col items-center gap-4">
                      <div className="w-12 h-12 relative">
                        <div className="absolute inset-0 border-4 border-primary/20 rounded-full" />
                        <div className="absolute inset-0 border-4 border-primary rounded-full border-t-transparent animate-spin" />
                      </div>
                      <p className="font-black tracking-tight text-primary uppercase text-sm">Processing Neural Nets...</p>
                    </div>
                  </div>
                )}

                <Button
                  variant="destructive"
                  size="icon"
                  className="absolute top-6 right-6 rounded-full shadow-2xl h-12 w-12 hover:scale-110 active:scale-95 transition-all opacity-0 group-hover/preview:opacity-100"
                  onClick={clearImage}
                >
                  <X className="h-6 w-6" />
                </Button>
              </div>

              <p className="mt-8 text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] animate-pulse">
                System: Initializing Diagnostic Protocol • Plant-ID: 0x{Math.floor(Math.random() * 1000).toString(16).toUpperCase()}
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        <input
          ref={inputRef}
          type="file"
          className="hidden"
          accept="image/*"
          onChange={handleChange}
        />
      </motion.div>
    </div>
  )
}
