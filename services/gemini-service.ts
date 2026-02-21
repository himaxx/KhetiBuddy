"use client"

const OPENROUTER_API_KEY = process.env.NEXT_PUBLIC_OPENROUTER_API_KEY || "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";
const MODEL_NAME = "nvidia/llama-3.1-nemotron-70b-instruct"; // Using a powerful, stable model via OpenRouter
const BASE_URL = "https://openrouter.ai/api/v1/chat/completions";

export interface PlantIdentificationResult {
    name: string;
    confidence: number;
    info: {
        commonName: string;
        scientificName: string;
        family: string;
        origin: string;
        healthStatus?: "healthy" | "diseased" | "nutrient-deficient";
        disease?: {
            name: string;
            description: string;
            severity: "low" | "medium" | "high";
        };
        care: {
            light: string;
            water: string;
            humidity: string;
            temperature: string;
        };
    };
}

export const geminiService = {
    async identifyPlant(imageData: string): Promise<PlantIdentificationResult> {
        // Extract base64 content and mime type
        const parts = imageData.split(",");
        const mimeType = parts[0].split(":")[1].split(";")[0];
        const base64Content = parts[1];

        const prompt = `
      As a botanical and plant pathology expert, identify the plant in this image and analyze its health.
      Look for symptoms of pests, diseases, or nutrient deficiencies.
      Return the result strictly as a valid JSON object (no markdown, no backticks) with this structure:
      {
        "name": "Most Common Name",
        "confidence": 98,
        "info": {
          "commonName": "Common Name(s)",
          "scientificName": "Genus species",
          "family": "Botanical Family",
          "origin": "Geographical Origin",
          "healthStatus": "healthy" | "diseased" | "nutrient-deficient",
          "disease": {
            "name": "Disease/Pest/Deficiency Name (or null if healthy)",
            "description": "Short diagnostic summary",
            "severity": "low" | "medium" | "high"
          },
          "care": {
            "light": "Specific light requirements",
            "water": "Watering requirements",
            "humidity": "Humidity needs",
            "temperature": "Ideal temperature"
          }
        }
      }
    `;

        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": typeof window !== 'undefined' ? window.location.origin : "http://localhost:3000",
                    "X-Title": "KhetiBuddy AI",
                },
                body: JSON.stringify({
                    model: "google/gemini-2.0-flash-001", // Premium vision model
                    messages: [
                        {
                            role: "user",
                            content: [
                                { type: "text", text: prompt },
                                {
                                    type: "image_url",
                                    image_url: {
                                        url: imageData
                                    }
                                }
                            ]
                        }
                    ],
                    response_format: { type: "json_object" }
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                console.error("OpenRouter Response Error:", errorData);
                const errorMessage = errorData.error?.message || response.statusText || "Identification failed";
                throw new Error(`OpenRouter Error: ${errorMessage}`);
            }

            const data = await response.json();
            if (!data.choices || !data.choices[0]?.message?.content) {
                throw new Error("Invalid response format from OpenRouter core.");
            }

            const textResponse = data.choices[0].message.content;
            return JSON.parse(textResponse) as PlantIdentificationResult;
        } catch (error) {
            console.error("Service Layer Error:", error);
            throw error;
        }
    },

    async chat(message: string, history: { role: "user" | "assistant"; content: string }[] = []): Promise<string> {
        try {
            const response = await fetch(BASE_URL, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
                    "HTTP-Referer": window.location.origin,
                    "X-Title": "KhetiBuddy AI",
                },
                body: JSON.stringify({
                    model: "nvidia/llama-3.1-nemotron-70b-instruct",
                    messages: [
                        { role: "system", content: "You are KhetiBuddy AI, an expert agricultural assistant. Provide concise, scientific, yet easy-to-understand advice for farmers and gardening enthusiasts." },
                        ...history,
                        { role: "user", content: message }
                    ]
                }),
            });

            if (!response.ok) {
                const errorData = await response.json().catch(() => ({}));
                const errorMessage = errorData.error?.message || response.statusText || "Chat failed";
                throw new Error(`OpenRouter Chat error: ${errorMessage}`);
            }

            const data = await response.json();
            return data.choices[0].message.content;
        } catch (error) {
            console.error("OpenRouter Chat Error:", error);
            return `I'm sorry, I'm having trouble connecting to my neural network right now. Error: ${error instanceof Error ? error.message : String(error)}`;
        }
    },
};
