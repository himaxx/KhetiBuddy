"use client"

import React, { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { cn } from "@/lib/utils"

interface FormattedMessageProps {
    content: string
    isTyping?: boolean
    role: "user" | "assistant"
}

export const FormattedMessage: React.FC<FormattedMessageProps> = ({ content, isTyping = false, role }) => {
    const [displayedText, setDisplayedText] = useState("")
    const [words, setWords] = useState<string[]>([])
    const [currentWordIndex, setCurrentWordIndex] = useState(0)

    useEffect(() => {
        if (role === "assistant") {
            // Split by words while preserving spaces and newlines
            const tokens = content.split(/(\s+)/).filter(t => t !== "")
            setWords(tokens)
            setDisplayedText("") // Reset displayedText when content changes for assistant
            setCurrentWordIndex(0) // Reset index
        } else {
            setDisplayedText(content)
            setWords([]) // Clear words for user
            setCurrentWordIndex(0) // Reset index
        }
    }, [content, role])

    useEffect(() => {
        if (role === "user") return

        if (currentWordIndex < words.length) {
            const speed = words[currentWordIndex].includes("\n") ? 50 : 35
            const timeout = setTimeout(() => {
                setDisplayedText((prev) => prev + words[currentWordIndex])
                setCurrentWordIndex((prev) => prev + 1)
            }, speed)
            return () => clearTimeout(timeout)
        }
    }, [role, words, currentWordIndex])

    // Enhanced formatter for Bold, Lists, and structure
    const renderFormattedText = (text: string) => {
        const lines = text.split("\n")
        const elements: React.ReactNode[] = []
        let currentList: React.ReactNode[] = []
        let listType: "bullet" | "number" | null = null

        const flushList = () => {
            if (currentList.length > 0) {
                if (listType === "bullet") {
                    elements.push(
                        <ul key={`list-${elements.length}`} className="space-y-3 mb-5 mt-2 ml-2">
                            {currentList}
                        </ul>
                    )
                } else {
                    elements.push(
                        <ol key={`list-${elements.length}`} className="space-y-3 mb-5 mt-2 ml-2">
                            {currentList}
                        </ol>
                    )
                }
                currentList = []
                listType = null
            }
        }

        lines.forEach((line, lineIndex) => {
            const trimmed = line.trim()
            if (trimmed === "") {
                flushList()
                elements.push(<div key={lineIndex} className="h-4" />)
                return
            }

            const isBullet = trimmed.startsWith("* ") || trimmed.startsWith("- ")
            const isNumbered = /^\d+\./.test(trimmed)

            let content = line
            if (isBullet) content = trimmed.substring(2)
            if (isNumbered) content = trimmed.substring(trimmed.indexOf(".") + 1).trim()

            // Handle Bold text **bold**
            const parts = content.split(/(\*\*.*?\*\*)/g)
            const formattedParts = parts.map((part, partIndex) => {
                if (part.startsWith("**") && part.endsWith("**")) {
                    return <span key={partIndex} className="font-extrabold text-primary decoration-primary/30 underline-offset-4 decoration-2">{part.slice(2, -2)}</span>
                }
                return part
            })

            if (isBullet) {
                if (listType !== "bullet") flushList()
                listType = "bullet"
                currentList.push(
                    <li key={lineIndex} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <div className="mt-1.5 h-1.5 w-1.5 rounded-full bg-primary flex-shrink-0" />
                        <span className="text-foreground">{formattedParts}</span>
                    </li>
                )
            } else if (isNumbered) {
                if (listType !== "number") flushList()
                listType = "number"
                const index = trimmed.split(".")[0]
                currentList.push(
                    <li key={lineIndex} className="flex gap-3 animate-in fade-in slide-in-from-left-2 duration-300">
                        <span className="font-black text-primary/60 tabular-nums min-w-[1.2rem]">{index}.</span>
                        <span className="text-foreground">{formattedParts}</span>
                    </li>
                )
            } else {
                flushList()
                // Check if it looks like a header (all caps or Ends with :)
                const isHeader = trimmed.endsWith(":") || (trimmed.length > 5 && (trimmed === trimmed.toUpperCase() || (trimmed.startsWith("**") && trimmed.endsWith("**"))))
                elements.push(
                    <p key={lineIndex} className={cn(
                        "mb-3 text-foreground/90 leading-relaxed transition-all",
                        isHeader ? "text-lg font-black tracking-tight text-primary mt-4 mb-2" : ""
                    )}>
                        {formattedParts}
                    </p>
                )
            }
        })

        flushList()
        return elements
    }

    return (
        <div className="w-full text-sm leading-relaxed overflow-hidden">
            {renderFormattedText(displayedText)}
            {isTyping && currentWordIndex < words.length && (
                <span className="inline-block w-1.5 h-4 bg-primary/40 animate-pulse ml-1 align-middle" />
            )}
        </div>
    )
}
