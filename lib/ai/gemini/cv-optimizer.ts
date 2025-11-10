import { cvSchema, type CVData } from "@/lib/cv"
import { generateText } from "./client"
import { createATSOptimizationPrompt } from "./prompt-templates"
import { extractJsonObject } from "./text-utils"

/**
 * Optimize CV for Applicant Tracking Systems (ATS)
 * @param cv - The CV data to optimize
 * @returns ATS-optimized CV
 * @throws Error if optimization fails
 */
export const optimizeCVForATS = async (cv: CVData): Promise<CVData> => {
  const prompt = createATSOptimizationPrompt(cv)

  try {
    const response = await generateText(prompt)

    // Extract JSON from response (handle markdown code blocks)
    const jsonStr = extractJsonObject(response)
    const optimized = JSON.parse(jsonStr)
    const validated = cvSchema.parse(optimized)

    return validated
  } catch (error) {
    console.error("[ATS Optimizer] Error:", error)
    throw new Error("Failed to optimize CV for ATS")
  }
}
