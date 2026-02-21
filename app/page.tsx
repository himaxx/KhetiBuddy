"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Leaf, ShieldCheck, Zap, Activity, Globe, MessageSquare, Camera, ArrowUpRight } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"
import HeroAnimation from "@/components/hero-animation"
import FallingLeavesBackground from "@/components/falling-leaves-background"
import { useLanguage } from "@/contexts/language-context"
import { ScrollReveal } from "@/components/scroll-reveal"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

export default function Home() {
  const { t } = useLanguage()

  const stats = [
    { label: t("home.stat.accuracy"), value: "99.2%", icon: ShieldCheck },
    { label: t("home.stat.speed"), value: "< 2s", icon: Zap },
    { label: t("home.stat.varieties"), value: "50+", icon: Leaf },
    { label: t("home.stat.insights"), value: "24/7", icon: Activity },
  ]

  const features = [
    {
      title: t("home.features.diagnostics.title"),
      description: t("home.features.diagnostics.desc"),
      icon: Camera,
    },
    {
      title: t("home.features.chatbot.title"),
      description: t("home.features.chatbot.desc"),
      icon: MessageSquare,
    },
    {
      title: t("home.features.multilingual.title"),
      description: t("home.features.multilingual.desc"),
      icon: Globe,
    },
  ]

  const specimens = [
    {
      plant: t("plant.tomato"),
      diseases: ["Early Blight", "Late Blight", "Leaf Mold", "Mosaic Virus", "Yellow Leaf Curl"],
      icon: "🍅",
    },
    {
      plant: t("plant.potato"),
      diseases: ["Early Blight", "Late Blight", "Common Scab", "Blackleg"],
      icon: "🥔",
    },
    {
      plant: t("plant.apple"),
      diseases: ["Scab", "Rust", "Fire Blight", "Powdery Mildew"],
      icon: "🍎",
    },
    {
      plant: t("plant.grape"),
      diseases: ["Black Rot", "Leaf Blight", "Downy Mildew", "Anthracnose"],
      icon: "🍇",
    },
    {
      plant: "Blueberry",
      diseases: ["Anthracnose", "Leaf Spot", "Mummy Berry", "Root Rot"],
      icon: "🫐",
    },
    {
      plant: "Cherry",
      diseases: ["Powdery Mildew", "Brown Rot", "Bacterial Spot", "Leaf Spot"],
      icon: "🍒",
    },
  ]

  const footerLinks = {
    capabilities: [
      t("footer.cap.detection"),
      t("footer.cap.identification"),
      t("footer.cap.growth"),
      t("footer.cap.soil"),
      t("footer.cap.irrigation"),
    ],
    company: [
      t("footer.company.about"),
      t("footer.company.impact"),
      t("footer.company.research"),
      t("footer.company.docs"),
      t("footer.company.support"),
    ],
  }

  return (
    <FallingLeavesBackground>
      <main className="flex flex-col items-center">
        {/* ── Hero Section ─────────────────────────────── */}
        <section className="min-h-[calc(100vh-4rem)] flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 py-12 relative overflow-hidden">
          <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <ScrollReveal y={30}>
              <div className="space-y-8">
                <div className="inline-flex items-center">
                  <Badge variant="secondary" className="px-4 py-1.5 text-sm font-semibold bg-green-500/10 text-green-600 dark:text-green-400 border-green-500/20 rounded-full">
                    <Leaf className="w-4 h-4 mr-2" />
                    <span>AI Agriculture Assistant v2.0</span>
                  </Badge>
                </div>

                <div className="space-y-4">
                  <h1 className="text-5xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-foreground leading-[1.1]">
                    <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-green-400">
                      {t("home.title").split(" ").slice(0, 1).join(" ")}
                    </span>{" "}
                    {t("home.title").split(" ").slice(1).join(" ")}
                  </h1>
                  <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-2xl">
                    {t("home.subtitle")}
                  </p>
                </div>

                <div className="flex flex-wrap gap-4 pt-4">
                  <Button asChild size="xl" className="shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all duration-300">
                    <Link href="/detect">
                      <Camera className="mr-2 h-5 w-5" />
                      {t("home.detectBtn")}
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="xl" className="backdrop-blur-sm border-2">
                    <Link href="/explore" className="group">
                      {t("home.exploreBtn")}
                      <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
                    </Link>
                  </Button>
                </div>

                <div className="flex items-center gap-6 pt-4 grayscale opacity-70">
                  <div className="flex -space-x-3">
                    {[1, 2, 3, 4].map((i) => (
                      <div key={i} className="w-10 h-10 rounded-full border-2 border-background bg-muted overflow-hidden">
                        <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${i + 10}`} alt="User avatar" />
                      </div>
                    ))}
                  </div>
                  <p className="text-sm font-medium text-muted-foreground">
                    {t("home.trustedBy")} <span className="text-foreground font-bold">10,000+</span> {t("home.farmers")}
                  </p>
                </div>
              </div>
            </ScrollReveal>

            <ScrollReveal delay={0.4} y={0}>
              <div className="relative h-[500px] w-full flex items-center justify-center">
                <div className="absolute inset-0 bg-primary/20 blur-[120px] rounded-full animate-pulse-slow" />
                <HeroAnimation />
              </div>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Stats Section ─────────────────────────────── */}
        <section className="w-full py-20 bg-muted/50 dark:bg-muted/10 backdrop-blur-sm border-y">
          <div className="max-w-7xl mx-auto px-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
              {stats.map((stat, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <div className="text-center space-y-2 group">
                    <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-primary/10 text-primary mb-2 group-hover:scale-110 transition-transform duration-300">
                      <stat.icon className="w-6 h-6" />
                    </div>
                    <div className="text-3xl font-bold">{stat.value}</div>
                    <div className="text-sm text-muted-foreground font-medium uppercase tracking-wider">{stat.label}</div>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Features Section ──────────────────────────── */}
        <section className="w-full py-24 px-4 overflow-hidden">
          <div className="max-w-7xl mx-auto space-y-16">
            <div className="text-center space-y-4">
              <ScrollReveal>
                <h2 className="text-3xl md:text-5xl font-bold tracking-tight">{t("home.features.title")}</h2>
                <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{t("home.features.subtitle")}</p>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, i) => (
                <ScrollReveal key={i} delay={i * 0.2}>
                  <Card className="h-full border-none bg-gradient-to-b from-card/50 to-card shadow-xl hover:shadow-2xl transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-8 space-y-4">
                      <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                        <feature.icon className="w-8 h-8" />
                      </div>
                      <h3 className="text-2xl font-bold">{feature.title}</h3>
                      <p className="text-muted-foreground leading-relaxed font-medium">{feature.description}</p>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── Clinical Coverage Section ─────────────────── */}
        <section className="w-full py-24 bg-muted/30 relative">
          <div className="max-w-7xl mx-auto px-4 space-y-16">
            <div className="flex flex-col md:flex-row justify-between items-end gap-6">
              <div className="space-y-4 max-w-2xl">
                <ScrollReveal>
                  <Badge className="bg-primary/10 text-primary border-primary/20 px-3 py-1 rounded-full font-bold uppercase text-[10px] tracking-widest mb-4">
                    {t("home.coverage.badge")}
                  </Badge>
                  <h2 className="text-4xl md:text-6xl font-black tracking-tight leading-none">
                    {t("home.coverage.title")}
                  </h2>
                  <p className="text-muted-foreground font-medium text-lg leading-relaxed pt-2">
                    {t("home.coverage.subtitle")}
                  </p>
                </ScrollReveal>
              </div>
              <ScrollReveal delay={0.2}>
                <div className="flex items-center gap-4 bg-background/50 backdrop-blur-xl p-4 rounded-3xl border border-border/50">
                  <div className="w-12 h-12 rounded-2xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-50">{t("home.coverage.accuracy")}</p>
                    <p className="text-xl font-black">99.2% <span className="text-[10px] font-medium opacity-60">{t("home.coverage.verified")}</span></p>
                  </div>
                </div>
              </ScrollReveal>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {specimens.map((specimen, i) => (
                <ScrollReveal key={i} delay={i * 0.1}>
                  <Card className="group relative overflow-hidden h-full border-2 border-border/50 bg-card/30 hover:bg-card/50 hover:border-primary/30 transition-all duration-500 rounded-[2.5rem]">
                    <CardContent className="p-8 space-y-6">
                      <div className="flex justify-between items-start">
                        <div className="w-16 h-16 rounded-3xl bg-muted/50 flex items-center justify-center text-4xl group-hover:scale-110 transition-transform duration-500">
                          {specimen.icon}
                        </div>
                        <Badge variant="outline" className="border-primary/30 text-primary text-[10px] font-black px-2.5 py-1">
                          Ref: KH-DS0{i + 1}
                        </Badge>
                      </div>

                      <div className="space-y-2">
                        <h3 className="text-2xl font-black italic tracking-tight">
                          {specimen.plant} <span className="text-muted-foreground font-normal not-italic text-sm">{t("home.coverage.specimen")}</span>
                        </h3>
                        <div className="h-0.5 w-12 bg-primary/20 group-hover:w-full transition-all duration-700" />
                      </div>

                      <div className="flex flex-wrap gap-2">
                        {specimen.diseases.map((disease, di) => (
                          <span key={di} className="text-[11px] font-bold text-muted-foreground bg-muted/50 px-3 py-1.5 rounded-full border border-border/30 hover:text-foreground hover:bg-muted transition-colors">
                            • {disease}
                          </span>
                        ))}
                      </div>

                      <div className="pt-4 flex items-center justify-between text-[10px] font-black uppercase tracking-widest text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                        <span>{t("home.coverage.initiiate")}</span>
                        <ArrowUpRight className="w-3 h-3" />
                      </div>
                    </CardContent>
                  </Card>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA Section ───────────────────────────────── */}
        <section className="w-full py-32 px-4 relative overflow-hidden">
          <div className="absolute inset-0 bg-primary/5 -skew-y-3 origin-right scale-110" />
          <div className="container relative z-10">
            <ScrollReveal>
              <Card className="max-w-5xl mx-auto overflow-hidden rounded-[3rem] border-none shadow-2xl bg-primary text-primary-foreground">
                <div className="grid md:grid-cols-2 gap-12 p-12 md:p-20 items-center">
                  <div className="space-y-6">
                    <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight">
                      {t("home.cta.title")}
                    </h2>
                    <p className="text-primary-foreground/80 text-lg font-medium">
                      {t("home.cta.subtitle")}
                    </p>
                    <div className="flex flex-wrap gap-4 pt-4">
                      <Button asChild size="xl" variant="secondary" className="rounded-2xl font-bold shadow-xl">
                        <Link href="/detect">{t("home.cta.scan")}</Link>
                      </Button>
                      <Button asChild size="xl" variant="outline" className="rounded-2xl font-bold border-primary-foreground/20 hover:bg-primary-foreground/10 text-primary-foreground">
                        <Link href="/explore">{t("home.cta.models")}</Link>
                      </Button>
                    </div>
                  </div>
                  <div className="relative hidden md:block">
                    <div className="absolute inset-0 bg-white/20 blur-3xl rounded-full animate-pulse-slow" />
                    <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-[2rem] p-8 shadow-2xl rotate-3">
                      <div className="flex items-center gap-4 mb-6">
                        <div className="w-12 h-12 rounded-2xl bg-white/20 flex items-center justify-center">
                          <Leaf className="w-6 h-6 text-white" />
                        </div>
                        <div>
                          <p className="text-xs font-black uppercase tracking-widest opacity-60">{t("home.cta.system")}</p>
                          <p className="font-bold underline">KhetiBuddy Neural v4.0</p>
                        </div>
                      </div>
                      <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-2 w-full bg-white/10 rounded-full overflow-hidden">
                            <motion.div
                              className="h-full bg-white/40"
                              animate={{ width: ["20%", "80%", "40%"] }}
                              transition={{ duration: 4, repeat: Infinity, delay: i * 0.5 }}
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </ScrollReveal>
          </div>
        </section>

        {/* ── Footer ────────────────────────────────────── */}
        <footer className="w-full bg-muted/30 border-t pt-24 pb-12 px-4 mt-auto">
          <div className="container max-w-7xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-16 mb-20">
              <div className="space-y-6">
                <Link href="/" className="flex items-center space-x-2 group">
                  <div className="bg-primary/10 p-2 rounded-xl">
                    <Leaf className="h-6 w-6 text-primary" />
                  </div>
                  <span className="font-extrabold text-2xl tracking-tighter">KhetiBuddy</span>
                </Link>
                <p className="text-muted-foreground font-medium leading-relaxed">{t("footer.desc")}</p>
                <div className="flex gap-4">
                  {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-xl bg-muted flex items-center justify-center hover:bg-primary/10 hover:text-primary transition-all cursor-pointer border border-border/50">
                      <div className="w-4 h-4 bg-current rounded-sm opacity-20" />
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-primary">{t("footer.capabilities")}</h4>
                <ul className="space-y-4">
                  {footerLinks.capabilities.map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-primary">{t("footer.company")}</h4>
                <ul className="space-y-4">
                  {footerLinks.company.map((item) => (
                    <li key={item}>
                      <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors font-semibold">{item}</Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="space-y-6">
                <h4 className="font-black uppercase text-xs tracking-[0.2em] mb-8 text-primary">{t("footer.newsletter")}</h4>
                <p className="text-muted-foreground font-medium text-sm">{t("footer.newsletter.desc")}</p>
                <div className="flex gap-2">
                  <input
                    type="email"
                    placeholder={t("footer.newsletter.placeholder")}
                    className="bg-muted border border-border/50 rounded-xl px-4 py-3 text-sm flex-1 focus:ring-2 focus:ring-primary/20 outline-none transition-all font-medium"
                  />
                  <Button className="rounded-xl px-2 h-12 w-12 shadow-lg shadow-primary/20">
                    <ArrowUpRight className="w-5 h-5" />
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t gap-8">
              <p className="text-muted-foreground text-sm font-bold">{t("footer.rights")}</p>
              <div className="flex gap-10">
                {[t("footer.privacy"), t("footer.terms"), t("footer.cookies")].map((item) => (
                  <Link key={item} href="#" className="text-muted-foreground hover:text-foreground text-sm font-bold transition-colors">
                    {item}
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </footer>
      </main>
    </FallingLeavesBackground>
  )
}
