"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf } from "lucide-react"
import Link from "next/link"
import HeroAnimation from "@/components/hero-animation"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"

export default function Home() {
  const { t } = useLanguage()

  return (
    <FallingLeavesBackground>
      <main className="flex flex-col items-center justify-center min-h-[calc(100vh-4rem)] px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
        <div className="max-w-5xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800 mb-2 dark:bg-green-900/30 dark:text-green-400">
              <Leaf className="w-4 h-4 mr-2" />
              <span>Plant Health Assistant</span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-foreground">
              <span className="text-primary">{t("home.title").split(" ").slice(0, 1).join(" ")}</span>{" "}
              {t("home.title").split(" ").slice(1).join(" ")}
            </h1>

            <p className="text-xl text-muted-foreground">{t("home.subtitle")}</p>

            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button asChild size="lg" className="group">
                <Link href="/explore">
                  {t("home.exploreBtn")}
                  <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link href="/detect">{t("home.detectBtn")}</Link>
              </Button>
            </div>
          </div>

          <div className="relative h-[400px] w-full">
            <HeroAnimation />
          </div>
        </div>
      </main>
    </FallingLeavesBackground>
  )
}

