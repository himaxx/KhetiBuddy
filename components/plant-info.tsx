"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Droplet, Sun, Thermometer, Wind } from "lucide-react"

interface PlantInfoProps {
  result: {
    name: string
    confidence: number
    info: {
      commonName: string
      scientificName: string
      family: string
      origin: string
      care: {
        light: string
        water: string
        humidity: string
        temperature: string
      }
    }
  }
}

export default function PlantInfo({ result }: PlantInfoProps) {
  const { name, confidence, info } = result

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <CardTitle className="text-2xl font-bold">{name}</CardTitle>
          <Badge variant="outline" className="bg-primary/10 text-primary">
            {confidence.toFixed(1)}% Match
          </Badge>
        </div>
        <p className="text-muted-foreground text-sm italic">{info.scientificName}</p>
      </CardHeader>

      <CardContent>
        <Tabs defaultValue="details">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Details</TabsTrigger>
            <TabsTrigger value="care">Care Guide</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="mt-4 space-y-4">
            <motion.div variants={container} initial="hidden" animate="show" className="grid grid-cols-2 gap-3">
              <motion.div variants={item} className="space-y-1">
                <p className="text-xs text-muted-foreground">Common Name</p>
                <p className="font-medium">{info.commonName}</p>
              </motion.div>

              <motion.div variants={item} className="space-y-1">
                <p className="text-xs text-muted-foreground">Family</p>
                <p className="font-medium">{info.family}</p>
              </motion.div>

              <motion.div variants={item} className="space-y-1">
                <p className="text-xs text-muted-foreground">Origin</p>
                <p className="font-medium">{info.origin}</p>
              </motion.div>
            </motion.div>

            <motion.div variants={item} className="mt-4 pt-4 border-t">
              <p className="text-sm">
                The {name} is a popular houseplant known for its distinctive leaf patterns and relatively easy care
                requirements. Native to {info.origin}, it thrives in indoor environments with the right conditions.
              </p>
            </motion.div>
          </TabsContent>

          <TabsContent value="care" className="mt-4">
            <motion.div variants={container} initial="hidden" animate="show" className="space-y-4">
              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Sun className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Light</p>
                  <p className="text-sm text-muted-foreground">{info.care.light}</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Droplet className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Water</p>
                  <p className="text-sm text-muted-foreground">{info.care.water}</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Wind className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Humidity</p>
                  <p className="text-sm text-muted-foreground">{info.care.humidity}</p>
                </div>
              </motion.div>

              <motion.div variants={item} className="flex items-start gap-3">
                <div className="mt-1 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Thermometer className="h-4 w-4 text-primary" />
                </div>
                <div>
                  <p className="font-medium">Temperature</p>
                  <p className="text-sm text-muted-foreground">{info.care.temperature}</p>
                </div>
              </motion.div>
            </motion.div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

