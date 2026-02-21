"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Sun, Thermometer, Wind, Fingerprint, MapPin, TreePine, Info, Sparkles, Activity, ShieldCheck, Zap, ChevronRight } from "lucide-react"
import { useLanguage } from "@/contexts/language-context"

interface PlantInfoProps {
  result: {
    name: string
    confidence: number
    info: {
      commonName: string
      scientificName: string
      family: string
      origin: string
      healthStatus?: "healthy" | "diseased" | "nutrient-deficient"
      disease?: {
        name: string
        description: string
        severity: "low" | "medium" | "high"
      } | null
      care: {
        light: string
        water: string
        humidity: string
        temperature: string
      }
    }
  }
  onCureRequest?: (diseaseName: string) => void
}

export default function PlantInfo({ result, onCureRequest }: PlantInfoProps) {
  const { t } = useLanguage()
  const { name, confidence, info } = result

  const healthStatusLabel = (): string => {
    const s = info.healthStatus
    if (s === "healthy") return t("plantinfo.healthStatus.healthy")
    if (s === "diseased") return t("plantinfo.healthStatus.diseased")
    if (s === "nutrient-deficient") return t("plantinfo.healthStatus.deficient")
    return s ? (s as string).toUpperCase() : "UNKNOWN"
  }

  return (
    <Card className="overflow-hidden border-none shadow-2xl bg-gradient-to-br from-card to-card/50 backdrop-blur-xl">
      <CardHeader className="p-8 pb-0 space-y-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1">
            <p className="text-[10px] font-black uppercase tracking-widest text-primary/80">
              {t("plantinfo.biologicalId")}
            </p>
            <CardTitle className="text-3xl font-black tracking-tighter">{name}</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20 font-black uppercase text-[10px] tracking-tighter px-3 py-1.5 rounded-xl">
            <Sparkles className="w-3 h-3 mr-2" />
            {confidence.toFixed(1)}{t("plantinfo.accuracy")}
          </Badge>
        </div>

        <div className="flex items-center gap-3 p-3 rounded-2xl bg-muted/50 border border-border/50">
          <div className="w-10 h-10 rounded-xl bg-background flex items-center justify-center text-muted-foreground">
            <Fingerprint className="w-5 h-5" />
          </div>
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
              {t("plantinfo.nomenclature")}
            </p>
            <p className="text-sm font-bold italic text-primary/80">{info.scientificName}</p>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-8">
        <Tabs defaultValue="details" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-muted/50 p-1.5 rounded-2xl h-14">
            <TabsTrigger value="details" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest">
              {t("plantinfo.identity")}
            </TabsTrigger>
            <TabsTrigger value="diagnosis" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest">
              {t("plantinfo.diagnosis")}
            </TabsTrigger>
            <TabsTrigger value="care" className="rounded-xl data-[state=active]:bg-background data-[state=active]:shadow-lg font-black uppercase text-[10px] tracking-widest">
              {t("plantinfo.care")}
            </TabsTrigger>
          </TabsList>

          {/* ── Identity Tab ── */}
          <TabsContent value="details" className="mt-8 space-y-8 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: TreePine, label: t("plantinfo.commonName"), value: info.commonName },
                { icon: Info, label: t("plantinfo.family"), value: info.family },
                { icon: MapPin, label: t("plantinfo.origin"), value: info.origin },
              ].map((item, i) => (
                <div key={i} className={cn("p-4 rounded-2xl bg-muted/30 border border-border/50 space-y-2", i === 2 && "col-span-2")}>
                  <div className="flex items-center gap-2 text-primary opacity-60">
                    <item.icon className="w-3 h-3" />
                    <p className="text-[10px] font-black uppercase tracking-widest">{item.label}</p>
                  </div>
                  <p className="font-bold tracking-tight">{item.value}</p>
                </div>
              ))}
            </div>

            <div className="p-6 rounded-[2rem] bg-primary/5 border border-primary/10 relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:scale-110 transition-transform">
                <Info className="w-20 h-20" />
              </div>
              <p className="text-sm font-medium leading-relaxed relative z-10 italic">
                "{name} — {info.commonName} · {info.family} · {info.origin}"
              </p>
            </div>
          </TabsContent>

          {/* ── Diagnosis Tab ── */}
          <TabsContent value="diagnosis" className="mt-8 space-y-6 animate-in fade-in slide-in-from-bottom-2 duration-500">
            <div className="flex items-center justify-between p-4 rounded-2xl bg-muted/30 border border-border/50">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "w-3 h-3 rounded-full animate-pulse",
                  info.healthStatus === "healthy" ? "bg-green-500" : "bg-red-500"
                )} />
                <p className="text-sm font-black uppercase tracking-widest leading-none">
                  {t("plantinfo.status")}: {healthStatusLabel()}
                </p>
              </div>
              {info.disease && (
                <Badge variant="destructive" className="uppercase text-[9px] font-black tracking-widest px-2 py-1">
                  {t("plantinfo.severity")}: {t(`severity.${info.disease.severity}`)}
                </Badge>
              )}
            </div>

            {info.disease ? (
              <div className="space-y-4">
                <div className="p-6 rounded-[2.5rem] bg-red-500/5 border border-red-500/10 space-y-3 relative overflow-hidden">
                  <div className="flex items-center gap-3 text-red-500">
                    <Activity className="w-5 h-5" />
                    <h4 className="text-xl font-black italic tracking-tight">{info.disease.name}</h4>
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground font-medium">
                    {info.disease.description}
                  </p>
                </div>

                <div
                  onClick={() => onCureRequest?.(info.disease!.name)}
                  className="p-4 rounded-2xl bg-primary/10 border border-primary/20 flex items-center justify-between group cursor-pointer hover:bg-primary/20 transition-all font-bold"
                >
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-primary animate-pulse" />
                    <div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-primary">
                        {t("plantinfo.cure.label")}
                      </p>
                      <p className="text-xs font-bold">{t("plantinfo.cure.desc")}</p>
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center group-hover:translate-x-1 transition-transform">
                    <ChevronRight className="w-4 h-4 text-primary" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="p-12 text-center space-y-4 rounded-[2.5rem] bg-green-500/5 border border-green-500/10">
                <div className="w-16 h-16 rounded-full bg-green-500/10 flex items-center justify-center text-green-500 mx-auto">
                  <ShieldCheck className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h4 className="text-xl font-black italic tracking-tight text-green-600">
                    {t("plantinfo.healthy.title")}
                  </h4>
                  <p className="text-xs text-muted-foreground font-medium uppercase tracking-widest">
                    {t("plantinfo.healthy.desc")}
                  </p>
                </div>
              </div>
            )}
          </TabsContent>

          {/* ── Care Tab ── */}
          <TabsContent value="care" className="mt-8 space-y-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
            {[
              { icon: Sun, labelKey: "plantinfo.light", value: info.care.light },
              { icon: Droplet, labelKey: "plantinfo.water", value: info.care.water },
              { icon: Wind, labelKey: "plantinfo.humidity", value: info.care.humidity },
              { icon: Thermometer, labelKey: "plantinfo.temperature", value: info.care.temperature },
            ].map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-6 p-4 rounded-2xl border border-transparent hover:border-border/50 hover:bg-muted/30 transition-all group"
              >
                <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <item.icon className="w-6 h-6" />
                </div>
                <div className="space-y-1">
                  <p className="text-[10px] font-black uppercase tracking-widest opacity-60">
                    {t(item.labelKey)}
                  </p>
                  <p className="font-bold tracking-tight leading-tight">{item.value}</p>
                </div>
              </motion.div>
            ))}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ")
}
