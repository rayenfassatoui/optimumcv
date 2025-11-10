import { cvSchema, defaultCV, type CVData } from "@/lib/cv"
import { generateText } from "./client"
import { createCVImportPrompt } from "./prompt-templates"
import { extractJsonObject } from "./text-utils"

/**
 * Ensure all CV entries have valid IDs
 */
const ensureIds = (cv: CVData): CVData => {
  return {
    ...cv,
    experience: cv.experience.map((item, index) => ({
      ...item,
      id: item.id || `ai_experience_${index}`,
    })),
    education: cv.education.map((item, index) => ({
      ...item,
      id: item.id || `ai_education_${index}`,
    })),
    projects: cv.projects.map((item, index) => ({
      ...item,
      id: item.id || `ai_project_${index}`,
    })),
    skills: cv.skills.length ? cv.skills : defaultCV().skills,
  }
}

/**
 * Sanitize and validate personal data from AI response
 */
const sanitizePersonalData = (data: Record<string, unknown>) => {
  const personal = (data.personal || {}) as Record<string, unknown>

  return {
    fullName:
      typeof personal.fullName === "string" && personal.fullName.trim()
        ? personal.fullName.trim()
        : "Candidate",
    title: typeof personal.title === "string" ? personal.title.trim() : "",
    summary: typeof personal.summary === "string" ? personal.summary.trim() : "",
    email:
      typeof personal.email === "string" && personal.email.includes("@")
        ? personal.email.trim()
        : "candidate@example.com",
    phone: typeof personal.phone === "string" ? personal.phone.trim() : "",
    location: typeof personal.location === "string" ? personal.location.trim() : "",
    website: typeof personal.website === "string" ? personal.website.trim() : "",
    linkedin: typeof personal.linkedin === "string" ? personal.linkedin.trim() : "",
  }
}

/**
 * Import and structure a CV from raw text using AI
 * @param resumeText - The raw resume text to parse
 * @returns Structured CV data
 * @throws Error if parsing fails
 */
export const importCVWithAI = async (resumeText: string): Promise<CVData> => {
  const trimmed = resumeText.trim()
  if (!trimmed) {
    throw new Error("Resume content is empty")
  }

  // Log first 500 chars for debugging
  console.log("[CV Importer] Processing resume, first 500 chars:", trimmed.slice(0, 500))

  const prompt = createCVImportPrompt(trimmed)
  const response = await generateText(prompt)

  console.log("[CV Importer] Raw AI response length:", response.length)
  console.log("[CV Importer] First 500 chars of response:", response.slice(0, 500))

  const jsonPayload = extractJsonObject(response)
  const parsed = JSON.parse(jsonPayload) as Record<string, unknown>

  console.log(
    "[CV Importer] Parsed personal data:",
    JSON.stringify((parsed.personal as Record<string, unknown>) || {})
  )
  console.log(
    "[CV Importer] Experience count:",
    Array.isArray(parsed.experience) ? parsed.experience.length : 0
  )

  // Sanitize and ensure required fields have valid values
  const sanitized = {
    ...parsed,
    personal: sanitizePersonalData(parsed),
  }

  const cv = cvSchema.parse(sanitized)
  return ensureIds(cv)
}
