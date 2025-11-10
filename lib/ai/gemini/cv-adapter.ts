import { cvSchema, type CVData } from "@/lib/cv"
import { generateText } from "./client"
import {
    createKeywordExtractionPrompt,
    createSummaryAdaptationPrompt,
} from "./prompt-templates"
import { enhanceExperienceWithAI } from "./cv-enhancer"
import { extractKeywords, dedupe, mergeSkills } from "./text-utils"

/**
 * Extract keywords from job description using AI
 * @param jobDescription - The job posting text
 * @returns Array of extracted keywords
 */
const suggestKeywords = async (jobDescription: string): Promise<string[]> => {
  const prompt = createKeywordExtractionPrompt(jobDescription)

  try {
    const response = await generateText(prompt)

    const extracted = response
      .split(/[,\n;]/)
      .map((item: string) => item.trim().toLowerCase())
      .filter((item: string): item is string => item.length > 2)

    const unique = dedupe(extracted)
    return unique.length ? unique.slice(0, 20) : extractKeywords(jobDescription, 20)
  } catch (error) {
    return extractKeywords(jobDescription, 20)
  }
}

/**
 * Adapt an entire CV to match a specific job description
 * @param cvInput - The current CV data
 * @param jobDescription - The target job description
 * @returns Adapted CV optimized for the job
 */
export const adaptCVWithAI = async (
  cvInput: CVData,
  jobDescription: string
): Promise<CVData> => {
  const cv = cvSchema.parse(cvInput)

  // Extract all relevant keywords and technologies from job description
  const keywords = await suggestKeywords(jobDescription)

  // Enhance summary to be laser-focused on the job
  let summary = cv.personal.summary
  try {
    const summaryPrompt = createSummaryAdaptationPrompt(cv.personal.summary, keywords)
    summary = (await generateText(summaryPrompt)) || cv.personal.summary
  } catch (error) {
    console.error("[CV Adapter] Summary enhancement failed:", error)
    summary = cv.personal.summary
  }

  // Adapt each experience entry to match the job requirements
  const experience = await Promise.all(
    cv.experience.map(async (role) => {
      try {
        return await enhanceExperienceWithAI(role, jobDescription, keywords)
      } catch (error) {
        console.error("[CV Adapter] Experience enhancement failed:", error)
        return role
      }
    })
  )

  // Merge skills with job-relevant keywords
  const adaptedSkills = mergeSkills(cv.skills, keywords)

  return {
    ...cv,
    personal: {
      ...cv.personal,
      summary,
    },
    skills: adaptedSkills,
    experience,
  }
}
