"use client"

import type React from "react"
import { motion } from "framer-motion"

interface ScrollRevealProps {
    children: React.ReactNode
    width?: "fit-content" | "100%"
    delay?: number
    duration?: number
    y?: number
}

export const ScrollReveal = ({
    children,
    width = "100%",
    delay = 0.2,
    duration = 0.5,
    y = 50
}: ScrollRevealProps) => {
    return (
        <div style={{ position: "relative", width, overflow: "hidden" }}>
            <motion.div
                variants={{
                    hidden: { opacity: 0, y },
                    visible: { opacity: 1, y: 0 },
                }}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true }}
                transition={{ duration, delay, ease: "easeOut" }}
            >
                {children}
            </motion.div>
        </div>
    )
}
