import { cvSchema, type CVData } from "@/lib/cv"
import { generateText } from "../client"
import { AIConfig } from "../types"
import { createATSOptimizationPrompt } from "./prompt-templates"
import { extractJsonObject } from "./text-utils"

/**
 * Sanitize CV data by converting null values to empty strings
 */
const sanitizeCVData = (data: any): any => {
  if (data === null) return ""
  if (Array.isArray(data)) return data.map(sanitizeCVData)
  if (typeof data === "object") {
    const sanitized: any = {}
    for (const key in data) {
      sanitized[key] = sanitizeCVData(data[key])
    }
    return sanitized
  }
  return data
}

/**
 * Optimize CV for Applicant Tracking Systems (ATS)
 * @param cv - The CV data to optimize
 * @returns ATS-optimized CV
 * @throws Error if optimization fails
 */
export const optimizeCVForATS = async (cv: CVData, config?: AIConfig): Promise<CVData> => {
  const prompt = createATSOptimizationPrompt(cv)

  try {
    const response = await generateText(prompt, config)

    // Extract JSON from response (handle markdown code blocks)
    const jsonStr = extractJsonObject(response)
    const parsed = JSON.parse(jsonStr)
    
    // Sanitize null values to empty strings
    const sanitized = sanitizeCVData(parsed)
    
    // Validate against schema
    const validated = cvSchema.parse(sanitized)

    return validated
  } catch (error) {
    console.error("[ATS Optimizer] Error:", error)
    throw new Error("Failed to optimize CV for ATS")
  }
}
