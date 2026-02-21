"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { motion, useScroll, useSpring } from "framer-motion"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ModeToggle } from "@/components/mode-toggle"
import { LanguageSwitcher } from "@/components/language-switcher"
import { Leaf, AlertTriangle, Menu, X, Rocket } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

export default function Navigation() {
  const pathname = usePathname()
  const { t } = useLanguage()
  const [isScrolled, setIsScrolled] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  const { scrollYProgress } = useScroll()
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  })

  const navItems = [
    { name: t("nav.home"), href: "/" },
    { name: t("nav.explore"), href: "/explore", icon: Leaf },
    { name: t("nav.detect"), href: "/detect", icon: AlertTriangle },
  ]

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-500",
        isScrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-primary/10 shadow-lg shadow-primary/5"
          : "bg-transparent",
      )}
    >
      <motion.div
        className="absolute bottom-0 left-0 right-0 h-[2px] bg-primary origin-left z-50"
        style={{ scaleX }}
      />

      <div className="container flex h-20 items-center justify-between">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center space-x-2 group">
            <motion.div
              initial={{ rotate: 0 }}
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{
                duration: 4,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
              className="bg-primary/10 p-2 rounded-xl group-hover:bg-primary/20 transition-colors"
            >
              <Leaf className="h-6 w-6 text-primary" />
            </motion.div>
            <span className="font-extrabold text-2xl tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              KhetiBuddy
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "text-sm font-semibold transition-all hover:bg-primary/5 px-4 py-2 rounded-full flex items-center gap-2",
                    isActive ? "text-primary bg-primary/10 shadow-inner" : "text-muted-foreground hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className={cn("h-4 w-4", isActive ? "animate-pulse" : "")} />}
                  {item.name}
                </Link>
              )
            })}
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden sm:flex items-center gap-3 mr-2 bg-muted/50 p-1 rounded-full border border-border/50">
            <LanguageSwitcher />
            <ModeToggle />
          </div>

          <Button asChild variant="default" size="lg" className="hidden md:flex rounded-full px-6 shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all font-bold">
            <Link href="/detect">
              <Rocket className="mr-2 h-4 w-4" />
              {t("nav.getStarted")}
            </Link>
          </Button>

          <Button
            variant="ghost"
            size="icon"
            className="md:hidden rounded-full hover:bg-primary/10"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden border-t bg-background/95 backdrop-blur-xl"
        >
          <div className="container py-8 space-y-4">
            {navItems.map((item) => {
              const isActive = pathname === item.href
              const Icon = item.icon

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className={cn(
                    "flex items-center gap-3 px-4 py-4 text-lg font-bold rounded-2xl transition-all",
                    isActive
                      ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20"
                      : "hover:bg-primary/5 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {Icon && <Icon className="h-5 w-5" />}
                  {item.name}
                </Link>
              )
            })}

            <div className="pt-6 flex flex-col gap-4">
              <div className="flex justify-center gap-4 bg-muted/50 p-2 rounded-2xl border">
                <LanguageSwitcher />
                <ModeToggle />
              </div>
              <Button asChild variant="default" className="w-full h-14 text-lg font-bold rounded-2xl shadow-xl" size="lg">
                <Link href="/detect" onClick={() => setIsMobileMenuOpen(false)}>
                  {t("nav.getStarted")}
                </Link>
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  )
}


