import { GoogleGenAI } from "@google/genai"

const TEXT_MODEL = "gemini-2.5-flash-lite"
const VISION_MODEL = "gemini-3-pro"
const IMAGE_GEN_MODEL = "gemini-2.5-flash-image"

let client: GoogleGenAI | null = null

/**
 * Ensure the Google Gemini AI client is initialized
 * @throws Error if GOOGLE_GENAI_API_KEY is not configured
 */
export const ensureClient = (): GoogleGenAI => {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not configured")
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey })
  }

  return client
}

/**
 * Check if Google Gemini AI is configured
 */
export const isGenAIConfigured = (): boolean => {
  return Boolean(process.env.GOOGLE_GENAI_API_KEY)
}

/**
 * Generate text using Google Gemini AI
 * @param prompt - The prompt to send to the AI
 * @returns The generated text
 */
export const generateText = async (prompt: string): Promise<string> => {
  const response = await ensureClient().models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }] }],
  })

  const direct = typeof response.text === "string" ? response.text.trim() : ""
  if (direct) {
    return direct
  }

  const primaryCandidate = response.candidates?.[0]
  if (!primaryCandidate?.content?.parts?.length) {
    return ""
  }

  const fallback = primaryCandidate.content.parts
    .map((part) => {
      const maybeText = (part as { text?: unknown }).text
      return typeof maybeText === "string" ? maybeText.trim() : ""
    })
    .filter((value): value is string => value.length > 0)
    .join(" ")

  return fallback.trim()
}

/**
 * Get the vision model name for image analysis
 */
export const getVisionModel = (): string => VISION_MODEL

/**
 * Get the text model name
 */
export const getTextModel = (): string => TEXT_MODEL

/**
 * Get the image generation model name
 */
export const getImageGenModel = (): string => IMAGE_GEN_MODEL
