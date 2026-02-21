"use client"

const OPENROUTER_API_KEY =
    process.env.NEXT_PUBLIC_OPENROUTER_API_KEY ||
    "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"

// Vision-capable model for image analysis
const VISION_MODEL = "google/gemini-2.0-flash-001"
// Text-only model for chat
const CHAT_MODEL = "nvidia/llama-3.1-nemotron-70b-instruct"
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions"

// ──────────────────────────────────────────────
// SHARED OUTPUT SCHEMA (used in every prompt)
// ──────────────────────────────────────────────
const JSON_SCHEMA = `
Return ONLY a valid JSON object — no markdown, no backticks, no extra text:
{
  "name": "Plant Common Name",
  "confidence": 95,
  "info": {
    "commonName": "Common Name",
    "scientificName": "Genus species",
    "family": "Botanical Family",
    "origin": "Geographical Origin",
    "healthStatus": "healthy" | "diseased" | "nutrient-deficient",
    "disease": {
      "name": "Disease / Pest / Deficiency Name — null if healthy",
      "description": "2-3 sentence clinical diagnostic summary",
      "severity": "low" | "medium" | "high"
    },
    "care": {
      "light": "Light requirements",
      "water": "Watering requirements",
      "humidity": "Humidity needs",
      "temperature": "Ideal temperature range"
    }
  }
}
If the plant is healthy, set healthStatus to "healthy" and set the disease object properties to null.
`

// ──────────────────────────────────────────────
// PLANT-SPECIFIC SYSTEM PROMPTS
// ──────────────────────────────────────────────
const PLANT_PROMPTS: Record<string, string> = {
    rice: `You are an expert rice pathologist specialising in paddy crop diseases from South and Southeast Asia.
Diagnose the rice specimen in the image. Focus specifically on:
- Blast (neck blast, leaf blast) caused by Magnaporthe oryzae
- Brown Spot (Helminthosporium oryzae)
- Bacterial Leaf Blight (Xanthomonas oryzae pv. oryzae)
- Sheath Blight (Rhizoctonia solani)
- False Smut (Ustilaginoidea virens)
- Tungro Virus
- Narrow Brown Leaf Spot
Assess leaf lesion colour, shape, distribution pattern, and any vascular discolouration.
${JSON_SCHEMA}`,

    wheat: `You are a senior wheat pathologist specialising in temperate cereal diseases.
Diagnose the wheat specimen in the image. Focus specifically on:
- Leaf Rust / Brown Rust (Puccinia triticina)
- Yellow Stripe Rust (Puccinia striiformis)
- Stem Rust (Puccinia graminis)
- Powdery Mildew (Blumeria graminis)
- Septoria Leaf Blotch (Zymoseptoria tritici)
- Fusarium Head Blight / Scab
- Tan Spot (Pyrenophora tritici-repentis)
- Loose Smut
Assess pustule colour, stripe patterns, and necrotic lesion characteristics.
${JSON_SCHEMA}`,

    grape: `You are a viticulture disease expert specialising in grapevine pathology.
Diagnose the grape specimen in the image. Focus specifically on:
- Downy Mildew (Plasmopara viticola)
- Powdery Mildew / Oidium (Erysiphe necator)
- Black Rot (Guignardia bidwellii)
- Botrytis Bunch Rot / Grey Mold (Botrytis cinerea)
- Phomopsis Cane and Leaf Spot
- Pierce's Disease (Xylella fastidiosa)
- Leaf Roll Virus
- Esca / Black Measles
Assess interveinal chlorosis, lesion shape, sporulation, and berry condition.
${JSON_SCHEMA}`,

    cotton: `You are an expert cotton pathologist specialising in fibre crop diseases.
Diagnose the cotton specimen in the image. Focus specifically on:
- Bacterial Blight (Xanthomonas axonopodis pv. malvacearum)
- Verticillium Wilt (Verticillium dahliae)
- Fusarium Wilt (Fusarium oxysporum)
- Alternaria Leaf Spot (Alternaria macrospora)
- Cercospora Leaf Spot
- Boll Rot complex (Fusarium, Diplodia)
- Cotton Leaf Curl Virus (CLCuV)
- Target Spot (Corynespora cassiicola)
Assess yellowing patterns, vascular browning, leaf curl symptoms, and boll damage.
${JSON_SCHEMA}`,

    tomato: `You are a leading tomato plant pathologist with expertise in Solanaceae diseases.
Diagnose the tomato specimen in the image. Focus specifically on:
- Early Blight (Alternaria solani)
- Late Blight (Phytophthora infestans)
- Septoria Leaf Spot
- Leaf Mold (Fulvia fulva)
- Yellow Leaf Curl Virus (TYLCV)
- Tomato Mosaic Virus (ToMV)
- Bacterial Spot (Xanthomonas vesicatoria)
- Spider Mites / Two-spotted mite
- Target Spot (Corynespora cassiicola)
Assess concentric ring lesion patterns, spore masses, mosaic discolouration, and fruit symptoms.
${JSON_SCHEMA}`,

    potato: `You are a potato crop pathologist specialising in highland and lowland tuber diseases.
Diagnose the potato specimen in the image. Focus specifically on:
- Late Blight (Phytophthora infestans) — most destructive
- Early Blight (Alternaria solani)
- Common Scab (Streptomyces scabiei)
- Blackleg / Soft Rot (Pectobacterium atrosepticum)
- Potato Virus Y (PVY)
- Rhizoctonia Canker / Black Scurf
- Fusarium Dry Rot
Assess water-soaked lesions, white sporulation under leaves, and tuber surface symptoms.
${JSON_SCHEMA}`,

    apple: `You are a pomology expert specialising in pome fruit diseases.
Diagnose the apple specimen in the image. Focus specifically on:
- Apple Scab (Venturia inaequalis)
- Cedar Apple Rust (Gymnosporangium juniperi-virginianae)
- Powdery Mildew (Podosphaera leucotricha)
- Fire Blight (Erwinia amylovora)
- Black Rot (Botryosphaeria obtusa)
- Sooty Blotch / Flyspeck
- Apple Mosaic Virus
Assess scabby lesions, rusty orange spots, shepherd's crook wilting, and fruit blemishes.
${JSON_SCHEMA}`,

    corn: `You are a maize agronomist specialising in tropical and temperate corn diseases.
Diagnose the corn specimen in the image. Focus specifically on:
- Northern Corn Leaf Blight (Exserohilum turcicum)
- Southern Corn Leaf Blight
- Common Rust (Puccinia sorghi)
- Southern Rust (Puccinia polysora)
- Gray Leaf Spot (Cercospora zeae-maydis)
- Corn Smut / Common Smut (Ustilago maydis)
- Goss's Bacterial Wilt
- Maize Streak Virus
Assess cigar-shaped lesions, brick-red pustules, galls, and streak patterns on leaves.
${JSON_SCHEMA}`,

    // Generic fallback for any unspecified plant
    default: `You are a botanical expert and plant pathologist with broad expertise in crop diseases worldwide.
Identify the plant in the image and diagnose any health issue. Look for:
- Fungal diseases (spots, blights, rusts, mildews, mold)
- Bacterial diseases (ooze, water-soaking, wilts)
- Viral diseases (mosaic patterns, leaf curl, streaks)
- Nutrient deficiencies (interveinal chlorosis, tip burn)
- Pest damage (holes, mines, webbing, stippling)
${JSON_SCHEMA}`,
}

// ──────────────────────────────────────────────
// SHARED TYPES
// ──────────────────────────────────────────────
export interface PlantDiseaseInfo {
    name: string
    description: string
    severity: "low" | "medium" | "high"
}

export interface PlantCareInfo {
    light: string
    water: string
    humidity: string
    temperature: string
}

export interface PlantIdentificationResult {
    name: string
    confidence: number
    info: {
        commonName: string
        scientificName: string
        family: string
        origin: string
        healthStatus?: "healthy" | "diseased" | "nutrient-deficient"
        disease?: PlantDiseaseInfo | null
        care: PlantCareInfo
    }
}

// ──────────────────────────────────────────────
// CORE SERVICE
// ──────────────────────────────────────────────
const getOrigin = () =>
    typeof window !== "undefined" ? window.location.origin : "http://localhost:3000"

async function callOpenRouter(body: object): Promise<any> {
    const response = await fetch(BASE_URL, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            "HTTP-Referer": getOrigin(),
            "X-Title": "CropSaviour AI",
        },
        body: JSON.stringify(body),
    })

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}))
        console.error("OpenRouter API Error:", errorData)
        const msg =
            errorData.error?.message || response.statusText || "OpenRouter request failed"
        throw new Error(msg)
    }

    const data = await response.json()
    if (!data.choices?.[0]?.message?.content) {
        throw new Error("Empty or invalid response from OpenRouter.")
    }
    return data.choices[0].message.content
}

export const openrouterService = {
    /**
     * Diagnose a plant image using a plant-specific expert prompt.
     * @param imageData  A base64 data URL (e.g. data:image/jpeg;base64,...)
     * @param plantType  Key into PLANT_PROMPTS — rice | wheat | grape | cotton | tomato | potato | apple | corn
     */
    async identifyPlant(
        imageData: string,
        plantType: string = "default"
    ): Promise<PlantIdentificationResult> {
        const systemPrompt =
            PLANT_PROMPTS[plantType.toLowerCase()] || PLANT_PROMPTS.default

        const rawText = await callOpenRouter({
            model: VISION_MODEL,
            messages: [
                {
                    role: "user",
                    content: [
                        { type: "text", text: systemPrompt },
                        { type: "image_url", image_url: { url: imageData } },
                    ],
                },
            ],
            response_format: { type: "json_object" },
        })

        // Strip possible markdown code fences from the response
        const cleaned = rawText.replace(/```json|```/g, "").trim()
        return JSON.parse(cleaned) as PlantIdentificationResult
    },

    /**
     * Agricultural chat using a text-only high-intelligence model.
     */
    async chat(
        message: string,
        history: { role: "user" | "assistant"; content: string }[] = []
    ): Promise<string> {
        const systemMessage = {
            role: "system",
            content:
                "You are CropSaviour AI, a world-class agricultural scientist and plant pathologist. " +
                "Provide precise, evidence-based, actionable advice for farmers. " +
                "Use structured formatting: numbered steps, bold for key terms, and bullet points for lists. " +
                "Prioritise organic and affordable solutions before recommending chemical treatments.",
        }

        const rawText = await callOpenRouter({
            model: CHAT_MODEL,
            messages: [systemMessage, ...history, { role: "user", content: message }],
        })

        return rawText
    },
}
