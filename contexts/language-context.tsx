"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

type Language = "en" | "hi"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

const translations: Translations = {
  en: {
    // Navigation
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.detect": "Detect Disease",
    "nav.getStarted": "Get Started",

    // Home page
    "home.title": "Your Intelligent Plant Care Companion",
    "home.subtitle":
      "KhetiBuddy helps you identify plants and detect diseases with advanced AI technology. Upload a photo and get instant insights.",
    "home.exploreBtn": "Explore Plants",
    "home.detectBtn": "Detect Diseases",

    // Detect page
    "detect.title": "Detect Disease",
    "detect.subtitle": "Upload a photo of a plant leaf to detect diseases and get treatment recommendations.",
    "detect.selectPlant": "Select Plant",
    "detect.uploadImage": "Upload Image",
    "detect.useCamera": "Use Camera",
    "detect.uploadAnother": "Upload Another Image",
    "detect.getTreatment": "Get Treatment Advice",
    "detect.selectPlantModel": "Select Plant Model",
    "detect.choosePlantType": "Choose the plant type for more accurate disease detection",

    // Plant names
    "plant.tomato": "Tomato",
    "plant.potato": "Potato",
    "plant.corn": "Corn",
    "plant.apple": "Apple",
    "plant.grape": "Grape",
    "plant.rice": "Rice",
    "plant.wheat": "Wheat",
    "plant.cotton": "Cotton",
  },
  hi: {
    // Navigation
    "nav.home": "होम",
    "nav.explore": "एक्सप्लोर",
    "nav.detect": "रोग का पता लगाएं",
    "nav.getStarted": "शुरू करें",

    // Home page
    "home.title": "आपका बुद्धिमान पौधों की देखभाल साथी",
    "home.subtitle":
      "खेतीबडी उन्नत AI तकनीक के साथ पौधों की पहचान करने और रोगों का पता लगाने में मदद करता है। फोटो अपलोड करें और तुरंत जानकारी प्राप्त करें।",
    "home.exploreBtn": "पौधे एक्सप्लोर करें",
    "home.detectBtn": "रोगों का पता लगाएं",

    // Detect page
    "detect.title": "रोग का पता लगाएं",
    "detect.subtitle": "रोगों का पता लगाने और उपचार की सिफारिशें प्राप्त करने के लिए पौधे की पत्ती की फोटो अपलोड करें।",
    "detect.selectPlant": "पौधा चुनें",
    "detect.uploadImage": "छवि अपलोड करें",
    "detect.useCamera": "कैमरा का उपयोग करें",
    "detect.uploadAnother": "एक और छवि अपलोड करें",
    "detect.getTreatment": "उपचार सलाह प्राप्त करें",
    "detect.selectPlantModel": "पौधा मॉडल चुनें",
    "detect.choosePlantType": "अधिक सटीक रोग पहचान के लिए पौधे का प्रकार चुनें",

    // Plant names
    "plant.tomato": "टमाटर",
    "plant.potato": "आलू",
    "plant.corn": "मक्का",
    "plant.apple": "सेब",
    "plant.grape": "अंगूर",
    "plant.rice": "चावल",
    "plant.wheat": "गेहूं",
    "plant.cotton": "कपास",
  },
}

interface LanguageContextType {
  language: Language
  setLanguage: (lang: Language) => void
  t: (key: string) => string
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined)

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [language, setLanguage] = useState<Language>("en")
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const savedLanguage = localStorage.getItem("language") as Language
    if (savedLanguage && (savedLanguage === "en" || savedLanguage === "hi")) {
      setLanguage(savedLanguage)
    }
  }, [])

  useEffect(() => {
    if (mounted) {
      localStorage.setItem("language", language)
    }
  }, [language, mounted])

  const t = (key: string): string => {
    return translations[language][key] || key
  }

  return <LanguageContext.Provider value={{ language, setLanguage, t }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (context === undefined) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}

