"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"

export type Language = "en" | "hi"

type Translations = {
  [key in Language]: {
    [key: string]: string
  }
}

export const translations: Translations = {
  en: {
    // ── Navigation ──────────────────────────────────
    "nav.home": "Home",
    "nav.explore": "Explore",
    "nav.detect": "Detect Disease",
    "nav.getStarted": "Get Started",

    // ── Home Hero ────────────────────────────────────
    "home.title": "Your Intelligent Plant Care Companion",
    "home.subtitle": "KhetiBuddy helps you identify plants and detect diseases with advanced AI technology. Upload a photo and get instant insights.",
    "home.exploreBtn": "Explore Plants",
    "home.detectBtn": "Detect Diseases",
    "home.trustedBy": "Trusted by",
    "home.farmers": "farmers worldwide",

    // ── Home Stats ───────────────────────────────────
    "home.stat.accuracy": "Accuracy Rate",
    "home.stat.speed": "Detection Speed",
    "home.stat.varieties": "Plant Varieties",
    "home.stat.insights": "AI Insights",

    // ── Home Features ─────────────────────────────────
    "home.features.title": "Advanced AI Features",
    "home.features.subtitle": "State-of-the-art technology brought directly to the field for sustainable and efficient farming.",
    "home.features.diagnostics.title": "Instant Diagnostics",
    "home.features.diagnostics.desc": "Snap a photo and get immediate results. Our neural networks analyze leaves in real-time.",
    "home.features.chatbot.title": "Smart Chatbot",
    "home.features.chatbot.desc": "Talk to KhetiAssistant for personalized treatment advice and regional farming tips.",
    "home.features.multilingual.title": "Multilingual Support",
    "home.features.multilingual.desc": "Available in Hindi and English for wider accessibility across India's farming communities.",

    // ── Clinical Coverage Section ─────────────────────
    "home.coverage.badge": "Neural Diagnostic Range",
    "home.coverage.title": "Clinical Coverage",
    "home.coverage.subtitle": "Our AI models are trained on over 500,000 biological samples to detect pathological patterns in the world's most critical crop specimens.",
    "home.coverage.accuracy": "Global Accuracy",
    "home.coverage.verified": "Verified",
    "home.coverage.specimen": "Specimen",
    "home.coverage.initiiate": "Initiate Scan Sequence",

    // ── CTA Section ───────────────────────────────────
    "home.cta.title": "Ready to transform your farming?",
    "home.cta.subtitle": "Join thousands of smart farmers using AI to protect their crops and increase yield.",
    "home.cta.scan": "Start Free Scan",
    "home.cta.models": "View AI Models",
    "home.cta.system": "System Online",

    // ── Footer ────────────────────────────────────────
    "footer.desc": "Empowering farmers worldwide with state-of-the-art AI technology for sustainable and profitable agriculture.",
    "footer.rights": "© 2026 KhetiBuddy AI. All rights reserved.",
    "footer.capabilities": "Capabilities",
    "footer.company": "Company",
    "footer.newsletter": "Newsletter",
    "footer.newsletter.desc": "Get the latest insights on smart farming delivered to your inbox.",
    "footer.newsletter.placeholder": "name@email.com",
    "footer.cap.detection": "Disease Detection",
    "footer.cap.identification": "Plant Identification",
    "footer.cap.growth": "Growth Tracking",
    "footer.cap.soil": "Soil Analysis",
    "footer.cap.irrigation": "Smart Irrigation",
    "footer.company.about": "About KhetiBuddy",
    "footer.company.impact": "Impact Stories",
    "footer.company.research": "Research",
    "footer.company.docs": "Documentation",
    "footer.company.support": "Contact Support",
    "footer.privacy": "Privacy Protocol",
    "footer.terms": "Service Terms",
    "footer.cookies": "Cookie Settings",

    // ── Detect Main Page ──────────────────────────────
    "detect.title": "Detect Disease",
    "detect.subtitle": "Upload a photo of a plant leaf to detect diseases and get treatment recommendations.",
    "detect.badge": "Plant Diagnostics",
    "detect.precision": "99% Precision",
    "detect.realtime": "Real-time",
    "detect.coverage.divider": "Coverage & Capabilities",
    "detect.grid.divider": "Select Biological Subject",
    "detect.matrix.subtitle": "Neural Diagnostic Matrix — Select Specimen",
    "detect.matrix.modelsActive": "Models Active",
    "detect.matrix.diseases": "Detectable Conditions",
    "detect.matrix.targets": "Pathological Targets",
    "detect.matrix.expertAI": "Expert AI Prompt · Plant-Specific Training Data",
    "detect.matrix.startScan": "Start Scan",
    "detect.matrix.initializeScan": "Initialize Scan",
    "detect.matrix.startScanCTA": "Start Scan",
    "detect.matrix.poweredBy": "OpenRouter · Gemini 2.0 Flash Vision",
    "detect.step1.title": "Select Plant",
    "detect.step1.desc": "Choose from 8 supported species — each powered by a dedicated expert AI prompt.",
    "detect.step2.title": "Scan Specimen",
    "detect.step2.desc": "Upload a leaf photo. Our OpenRouter Vision model analyses it in under 3 seconds.",
    "detect.step3.title": "Treatment Plan",
    "detect.step3.desc": "Get a precise clinical diagnosis + consult the AI advisor for personalised cures.",

    // ── Detect Plant Page ─────────────────────────────
    "detect.selectPlant": "Select Plant",
    "detect.uploadImage": "Gallery",
    "detect.useCamera": "Live",
    "detect.uploadAnother": "Upload Another Image",
    "detect.getTreatment": "Get Treatment Advice",
    "detect.selectPlantModel": "Select Plant Model",
    "detect.choosePlantType": "Choose the plant type for more accurate disease detection",
    "detect.cloudNeural": "Cloud Neural Diagnostic",
    "detect.pathologySystem": "Pathology System",
    "detect.specimenLoaded": "Specimen Loaded",
    "detect.scanning": "Scanning...",
    "detect.analysisComplete": "Analysis Complete",
    "detect.reset": "Reset",
    "detect.consultAdvisor": "Consult Neural Advisor",
    "detect.processing": "OpenRouter Neural Core Processing",
    "detect.detectableDisease": "Detectable Diseases",
    "detect.initializeDiagnosis": "Initialize Diagnosis",
    "detect.liveModel": "Live AI Model",
    "detect.comingSoon": "Coming Soon",
    "detect.liveScanSoon": "Live Scan Coming Soon",
    "detect.switchUpload": "Switch to Gallery Upload",
    "detect.specimenScan": "Scan Specimen — Powered by OpenRouter",
    "detect.diagnosticInterrupt": "Diagnostic Interrupt",
    "detect.retryBtn": "Retry Scan",
    "detect.moreConditions": "more →",

    // ── Plant Names ───────────────────────────────────
    "plant.tomato": "Tomato",
    "plant.potato": "Potato",
    "plant.corn": "Corn",
    "plant.apple": "Apple",
    "plant.grape": "Grape",
    "plant.rice": "Rice",
    "plant.wheat": "Wheat",
    "plant.cotton": "Cotton",

    // ── Plant descriptions (card grid) ───────────────────
    "plant.tomato.desc": "Detect common tomato diseases like early blight, late blight, and leaf spot.",
    "plant.potato.desc": "Identify potato diseases including late blight, early blight, and black scurf.",
    "plant.corn.desc": "Detect corn diseases such as northern leaf blight, common rust, and gray leaf spot.",
    "plant.apple.desc": "Identify apple diseases like apple scab, black rot, and cedar apple rust.",
    "plant.grape.desc": "Detect grape diseases including black rot, esca, and leaf blight.",
    "plant.rice.desc": "Identify rice diseases such as blast, brown spot, and bacterial leaf blight.",
    "plant.wheat.desc": "Detect wheat diseases like leaf rust, powdery mildew, and septoria leaf blotch.",
    "plant.cotton.desc": "Identify cotton diseases including bacterial blight, verticillium wilt, and leaf spot.",

    // ── Plant taglines ────────────────────────────────
    "plant.tomato.tagline": "Solanaceae Expert",
    "plant.potato.tagline": "Tuber Pathologist",
    "plant.rice.tagline": "Paddy Expert",
    "plant.wheat.tagline": "Cereal Diagnostics",
    "plant.grape.tagline": "Viticulture Expert",
    "plant.cotton.tagline": "Fibre Crop Scanner",
    "plant.apple.tagline": "Pomology Pathologist",
    "plant.corn.tagline": "Maize Disease Expert",

    // ── Severity ──────────────────────────────────────
    "severity.high": "High",
    "severity.medium": "Medium",
    "severity.low": "Low",

    // ── Disease types ─────────────────────────────────
    "type.fungal": "Fungal",
    "type.bacterial": "Bacterial",
    "type.viral": "Viral",
    "type.oomycete": "Oomycete",
    "type.pest": "Pest",

    // ── Plant info tabs ───────────────────────────────
    "plantinfo.identity": "Identity",
    "plantinfo.diagnosis": "Diagnosis",
    "plantinfo.care": "Care",
    "plantinfo.biologicalId": "Biological Identity",
    "plantinfo.accuracy": "% Accuracy",
    "plantinfo.nomenclature": "Scientific Nomenclature",
    "plantinfo.commonName": "Common Name",
    "plantinfo.family": "Family",
    "plantinfo.origin": "Native Origin",
    "plantinfo.status": "Status",
    "plantinfo.severity": "Severity",
    "plantinfo.detectedConditions": "Detectable Conditions",
    "plantinfo.healthStatus.healthy": "HEALTHY",
    "plantinfo.healthStatus.diseased": "DISEASED",
    "plantinfo.healthStatus.deficient": "NUTRIENT-DEFICIENT",
    "plantinfo.healthy.title": "Specimen Healthy",
    "plantinfo.healthy.desc": "No pathological anomalies detected within clinical parameters.",
    "plantinfo.cure.label": "Neural Synthesis",
    "plantinfo.cure.desc": "Request Targeted Cure Protocol",
    "plantinfo.light": "Luminous Intake",
    "plantinfo.water": "Hydration Cycle",
    "plantinfo.humidity": "Atmospheric Humidity",
    "plantinfo.temperature": "Thermal Range",
  },

  hi: {
    // ── Navigation ──────────────────────────────────
    "nav.home": "होम",
    "nav.explore": "एक्सप्लोर",
    "nav.detect": "रोग पहचानें",
    "nav.getStarted": "शुरू करें",

    // ── Home Hero ────────────────────────────────────
    "home.title": "आपका बुद्धिमान पौधों की देखभाल साथी",
    "home.subtitle": "खेतीबडी उन्नत AI तकनीक के साथ पौधों की पहचान करने और रोगों का पता लगाने में मदद करता है। फोटो अपलोड करें और तुरंत जानकारी प्राप्त करें।",
    "home.exploreBtn": "पौधे एक्सप्लोर करें",
    "home.detectBtn": "रोग पहचानें",
    "home.trustedBy": "विश्वसनीय",
    "home.farmers": "किसानों द्वारा विश्वभर में",

    // ── Home Stats ───────────────────────────────────
    "home.stat.accuracy": "सटीकता दर",
    "home.stat.speed": "पहचान गति",
    "home.stat.varieties": "पौधों की किस्में",
    "home.stat.insights": "AI जानकारी",

    // ── Home Features ─────────────────────────────────
    "home.features.title": "उन्नत AI सुविधाएँ",
    "home.features.subtitle": "टिकाऊ और कुशल खेती के लिए सीधे खेत में लाई गई अत्याधुनिक तकनीक।",
    "home.features.diagnostics.title": "तत्काल निदान",
    "home.features.diagnostics.desc": "फोटो खींचें और तुरंत परिणाम पाएं। हमारे न्यूरल नेटवर्क पत्तियों का रियल-टाइम विश्लेषण करते हैं।",
    "home.features.chatbot.title": "स्मार्ट चैटबॉट",
    "home.features.chatbot.desc": "व्यक्तिगत उपचार सलाह और क्षेत्रीय खेती के सुझावों के लिए खेतीसहायक से बात करें।",
    "home.features.multilingual.title": "बहुभाषी समर्थन",
    "home.features.multilingual.desc": "भारत के किसान समुदायों में व्यापक पहुंच के लिए हिंदी और अंग्रेजी में उपलब्ध।",

    // ── Clinical Coverage Section ─────────────────────
    "home.coverage.badge": "न्यूरल नैदानिक श्रेणी",
    "home.coverage.title": "क्लिनिकल कवरेज",
    "home.coverage.subtitle": "हमारे AI मॉडल को दुनिया के सबसे महत्वपूर्ण फसल नमूनों में रोग पैटर्न का पता लगाने के लिए 5,00,000 से अधिक जैविक नमूनों पर प्रशिक्षित किया गया है।",
    "home.coverage.accuracy": "वैश्विक सटीकता",
    "home.coverage.verified": "सत्यापित",
    "home.coverage.specimen": "नमूना",
    "home.coverage.initiiate": "स्कैन अनुक्रम शुरू करें",

    // ── CTA Section ───────────────────────────────────
    "home.cta.title": "अपनी खेती को बदलने के लिए तैयार हैं?",
    "home.cta.subtitle": "हजारों स्मार्ट किसानों से जुड़ें जो अपनी फसलों की सुरक्षा और उपज बढ़ाने के लिए AI का उपयोग कर रहे हैं।",
    "home.cta.scan": "नि:शुल्क स्कैन शुरू करें",
    "home.cta.models": "AI मॉडल देखें",
    "home.cta.system": "सिस्टम ऑनलाइन",

    // ── Footer ────────────────────────────────────────
    "footer.desc": "टिकाऊ और लाभदायक कृषि के लिए अत्याधुनिक AI तकनीक के साथ दुनिया भर के किसानों को सशक्त बनाना।",
    "footer.rights": "© 2026 खेतीबडी AI। सर्वाधिकार सुरक्षित।",
    "footer.capabilities": "क्षमताएँ",
    "footer.company": "कंपनी",
    "footer.newsletter": "न्यूज़लेटर",
    "footer.newsletter.desc": "स्मार्ट खेती पर नवीनतम जानकारी अपने इनबॉक्स में पाएं।",
    "footer.newsletter.placeholder": "नाम@ईमेल.com",
    "footer.cap.detection": "रोग पहचान",
    "footer.cap.identification": "पौधा पहचान",
    "footer.cap.growth": "विकास ट्रैकिंग",
    "footer.cap.soil": "मिट्टी विश्लेषण",
    "footer.cap.irrigation": "स्मार्ट सिंचाई",
    "footer.company.about": "खेतीबडी के बारे में",
    "footer.company.impact": "प्रभाव की कहानियाँ",
    "footer.company.research": "अनुसंधान",
    "footer.company.docs": "प्रलेखन",
    "footer.company.support": "सहायता से संपर्क करें",
    "footer.privacy": "गोपनीयता नीति",
    "footer.terms": "सेवा शर्तें",
    "footer.cookies": "कुकी सेटिंग्स",

    // ── Detect Main Page ──────────────────────────────
    "detect.title": "रोग पहचानें",
    "detect.subtitle": "रोग पहचानने और उपचार की सिफारिशें पाने के लिए पत्ती की फोटो अपलोड करें।",
    "detect.badge": "पौधा निदान",
    "detect.precision": "99% सटीकता",
    "detect.realtime": "रियल-टाइम",
    "detect.coverage.divider": "कवरेज और क्षमताएँ",
    "detect.grid.divider": "जैविक विषय चुनें",
    "detect.matrix.subtitle": "न्यूरल नैदानिक मैट्रिक्स — नमूना चुनें",
    "detect.matrix.modelsActive": "मॉडल सक्रिय",
    "detect.matrix.diseases": "पहचाने जाने योग्य स्थितियाँ",
    "detect.matrix.targets": "रोगजनक लक्ष्य",
    "detect.matrix.expertAI": "विशेषज्ञ AI प्रॉम्प्ट · पौधा-विशिष्ट प्रशिक्षण डेटा",
    "detect.matrix.startScan": "स्कैन शुरू करें",
    "detect.matrix.initializeScan": "स्कैन शुरू करें",
    "detect.matrix.startScanCTA": "स्कैन शुरू करें",
    "detect.matrix.poweredBy": "OpenRouter · Gemini 2.0 Flash Vision",
    "detect.step1.title": "पौधा चुनें",
    "detect.step1.desc": "8 समर्थित प्रजातियों में से चुनें — प्रत्येक एक समर्पित विशेषज्ञ AI प्रॉम्प्ट द्वारा संचालित।",
    "detect.step2.title": "नमूना स्कैन करें",
    "detect.step2.desc": "पत्ती की फोटो अपलोड करें। हमारा OpenRouter Vision मॉडल 3 सेकंड से कम में विश्लेषण करता है।",
    "detect.step3.title": "उपचार योजना",
    "detect.step3.desc": "सटीक क्लिनिकल निदान पाएं + व्यक्तिगत उपचार के लिए AI सलाहकार से परामर्श करें।",

    // ── Detect Plant Page ─────────────────────────────
    "detect.selectPlant": "पौधा चुनें",
    "detect.uploadImage": "गैलरी",
    "detect.useCamera": "लाइव",
    "detect.uploadAnother": "एक और छवि अपलोड करें",
    "detect.getTreatment": "उपचार सलाह पाएं",
    "detect.selectPlantModel": "पौधा मॉडल चुनें",
    "detect.choosePlantType": "अधिक सटीक रोग पहचान के लिए पौधे का प्रकार चुनें",
    "detect.cloudNeural": "क्लाउड न्यूरल निदान",
    "detect.pathologySystem": "रोगविज्ञान प्रणाली",
    "detect.specimenLoaded": "नमूना लोड हो गया",
    "detect.scanning": "स्कैन हो रहा है...",
    "detect.analysisComplete": "विश्लेषण पूर्ण",
    "detect.reset": "रीसेट",
    "detect.consultAdvisor": "न्यूरल सलाहकार से परामर्श करें",
    "detect.processing": "OpenRouter न्यूरल कोर प्रोसेसिंग",
    "detect.detectableDisease": "पहचाने जाने योग्य रोग",
    "detect.initializeDiagnosis": "निदान शुरू करें",
    "detect.liveModel": "लाइव AI मॉडल",
    "detect.comingSoon": "जल्द आ रहा है",
    "detect.liveScanSoon": "लाइव स्कैन जल्द आ रहा है",
    "detect.switchUpload": "गैलरी अपलोड पर स्विच करें",
    "detect.specimenScan": "नमूना स्कैन करें — OpenRouter द्वारा संचालित",
    "detect.diagnosticInterrupt": "निदान बाधित",
    "detect.retryBtn": "पुनः स्कैन करें",
    "detect.moreConditions": "और →",

    // ── Plant Names ───────────────────────────────────
    "plant.tomato": "टमाटर",
    "plant.potato": "आलू",
    "plant.corn": "मक्का",
    "plant.apple": "सेब",
    "plant.grape": "अंगूर",
    "plant.rice": "चावल",
    "plant.wheat": "गेहूं",
    "plant.cotton": "कपास",

    // ── Plant descriptions (card grid) ───────────────────
    "plant.tomato.desc": "टमाटर के सामान्य रोग जैसे अर्ली ब्लाइट, लेट ब्लाइट और पत्ती के धब्बे की पहचान करें।",
    "plant.potato.desc": "आलू के रोग जैसे लेट ब्लाइट, अर्ली ब्लाइट और ब्लैक स्कर्फ की पहचान करें।",
    "plant.corn.desc": "मक्का के रोग जैसे नॉर्दर्न लीफ ब्लाइट, कॉमन रस्ट और ग्रे लीफ स्पॉट की पहचान करें।",
    "plant.apple.desc": "सेब के रोग जैसे एप्पल स्कैब, ब्लैक रॉट और सीडर एप्पल रस्ट की पहचान करें।",
    "plant.grape.desc": "अंगूर के रोग जैसे ब्लैक रॉट, एस्का और लीफ ब्लाइट की पहचान करें।",
    "plant.rice.desc": "चावल के रोग जैसे ब्लास्ट, ब्राउन स्पॉट और बैक्टीरियल लीफ ब्लाइट की पहचान करें।",
    "plant.wheat.desc": "गेहूं के रोग जैसे लीफ रस्ट, पाउडरी मिल्ड्यू और सेप्टोरिया लीफ ब्लॉच की पहचान करें।",
    "plant.cotton.desc": "कपास के रोग जैसे बैक्टीरियल ब्लाइट, वर्टिसिलियम विल्ट और पत्ती के धब्बे की पहचान करें।",

    // ── Plant taglines ────────────────────────────────
    "plant.tomato.tagline": "सोलेनेसी विशेषज्ञ",
    "plant.potato.tagline": "कंद रोगविज्ञानी",
    "plant.rice.tagline": "धान विशेषज्ञ",
    "plant.wheat.tagline": "अनाज निदान",
    "plant.grape.tagline": "अंगूर विशेषज्ञ",
    "plant.cotton.tagline": "रेशा फसल स्कैनर",
    "plant.apple.tagline": "फल रोगविज्ञानी",
    "plant.corn.tagline": "मक्का रोग विशेषज्ञ",

    // ── Severity ──────────────────────────────────────
    "severity.high": "उच्च",
    "severity.medium": "मध्यम",
    "severity.low": "कम",

    // ── Disease types ─────────────────────────────────
    "type.fungal": "कवकीय",
    "type.bacterial": "जीवाणु",
    "type.viral": "वायरल",
    "type.oomycete": "ऊमाइसीट",
    "type.pest": "कीट",

    // ── Plant info tabs ───────────────────────────────
    "plantinfo.identity": "पहचान",
    "plantinfo.diagnosis": "निदान",
    "plantinfo.care": "देखभाल",
    "plantinfo.biologicalId": "जैविक पहचान",
    "plantinfo.accuracy": "% सटीकता",
    "plantinfo.nomenclature": "वैज्ञानिक नामकरण",
    "plantinfo.commonName": "सामान्य नाम",
    "plantinfo.family": "वनस्पति परिवार",
    "plantinfo.origin": "मूल उत्पत्ति",
    "plantinfo.status": "स्थिति",
    "plantinfo.severity": "गंभीरता",
    "plantinfo.detectedConditions": "पहचाने जाने योग्य स्थितियाँ",
    "plantinfo.healthStatus.healthy": "स्वस्थ",
    "plantinfo.healthStatus.diseased": "रोगग्रस्त",
    "plantinfo.healthStatus.deficient": "पोषण-कमी",
    "plantinfo.healthy.title": "नमूना स्वस्थ है",
    "plantinfo.healthy.desc": "क्लिनिकल मानकों के भीतर कोई रोगजनक विसंगति नहीं पाई गई।",
    "plantinfo.cure.label": "न्यूरल संश्लेषण",
    "plantinfo.cure.desc": "लक्षित उपचार प्रोटोकॉल का अनुरोध करें",
    "plantinfo.light": "प्रकाश आवश्यकता",
    "plantinfo.water": "जल चक्र",
    "plantinfo.humidity": "वायुमंडलीय आर्द्रता",
    "plantinfo.temperature": "तापमान सीमा",
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
