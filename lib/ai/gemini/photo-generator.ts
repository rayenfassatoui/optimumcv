import { ensureClient, getVisionModel, getImageGenModel } from "./client"
import { createPhotoAnalysisPrompt, createPhotoGenerationPrompt } from "./prompt-templates"

/**
 * Analyze a photo and determine if it's professional
 * @param file - The photo file to analyze
 * @returns Analysis description
 */
const analyzePhoto = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer()
  const base64 = Buffer.from(arrayBuffer).toString("base64")
  const mimeType = file.type || "image/jpeg"

  const client = ensureClient()
  const prompt = createPhotoAnalysisPrompt()

  const analysisResponse = await client.models.generateContent({
    model: getVisionModel(),
    contents: [
      {
        role: "user",
        parts: [
          {
            inlineData: {
              data: base64,
              mimeType: mimeType,
            },
          },
          { text: prompt },
        ],
      },
    ],
  })

  const analysis = typeof analysisResponse.text === "string" ? analysisResponse.text.trim() : ""

  if (!analysis) {
    throw new Error("Failed to analyze photo")
  }

  return analysis
}

/**
 * Generate a professional headshot from an uploaded photo
 * @param file - The original photo file
 * @returns URL to the generated professional photo
 * @throws Error if generation fails or quota is exceeded
 */
export const generateProfessionalPhoto = async (file: File): Promise<string> => {
  try {
    // First, analyze the photo
    const analysis = await analyzePhoto(file)
    console.log("[Photo Generator] Analysis:", analysis)

    // Generate professional photo using Gemini's image generation model
    const imagePrompt = createPhotoGenerationPrompt()
    console.log("[Photo Generator] Generating professional photo with Gemini...")

    const client = ensureClient()

    // Use Gemini's image generation model
    try {
      const imageGenResponse = await client.models.generateContentStream({
        model: getImageGenModel(),
        config: {
          responseModalities: ["IMAGE"],
        },
        contents: [
          {
            role: "user",
            parts: [
              {
                text: imagePrompt,
              },
            ],
          },
        ],
      } as any) // Using any due to beta API types

      // Collect the generated image from the stream
      let imageData: string | null = null
      let imageMimeType: string | null = null

      for await (const chunk of imageGenResponse) {
        if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
          const inlineData = chunk.candidates[0].content.parts[0].inlineData
          imageData = inlineData.data || null
          imageMimeType = inlineData.mimeType || "image/png"
          console.log("[Photo Generator] Image chunk received, mime type:", imageMimeType)
          break // Take the first image
        }
      }

      if (!imageData) {
        console.log("[Photo Generator] No image generated, falling back to basic enhancement")
        throw new Error("BASIC_ENHANCEMENT_NEEDED:" + analysis)
      }

      console.log("[Photo Generator] Image generated successfully, size:", imageData.length)

      // Convert base64 to blob URL
      const binaryString = Buffer.from(imageData, "base64")
      const outputMimeType = imageMimeType || "image/png"
      const blob = new Blob([binaryString], { type: outputMimeType })
      const url = URL.createObjectURL(blob)

      return url
    } catch (genError: any) {
      // Check if it's a rate limit or quota error
      if (
        genError?.message?.includes("429") ||
        genError?.message?.includes("quota") ||
        genError?.message?.includes("RESOURCE_EXHAUSTED") ||
        genError?.cause?.includes("429") ||
        genError?.cause?.includes("quota")
      ) {
        console.log("[Photo Generator] Rate limit/quota exceeded")
        throw new Error(
          "⚠️ Image generation not available on free tier. The gemini-2.5-flash-image model requires a paid Google AI plan. Options:\n\n1. Upgrade at https://aistudio.google.com/ (pay-per-use, very affordable)\n2. Or we can add a simpler photo filter feature instead\n\nText features (CV enhancement, job adaptation) work perfectly on free tier! 🎉"
        )
      }

      // For other generation errors, throw meaningful error
      console.log("[Photo Generator] Image generation failed:", genError?.message)
      throw new Error("Failed to generate image: " + (genError?.message || "Unknown error"))
    }
  } catch (error) {
    console.error("[Photo Generator] Error:", error)

    // Re-throw the error so user sees the actual message
    if (error instanceof Error) {
      throw error
    }

    throw new Error("Failed to generate professional photo")
  }
}
