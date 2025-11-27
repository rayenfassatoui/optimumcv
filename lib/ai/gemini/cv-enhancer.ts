import { experienceSchema, type ExperienceItem } from "@/lib/cv"
import { generateText } from "../client"
import { AIConfig } from "../types"
import {
  createSummaryEnhancementPrompt,
  createExperienceEnhancementPrompt,
} from "./prompt-templates"
import { sanitizeBullet, extractKeywords, titleCase } from "./text-utils"

/**
 * Default professional summary if none provided
 */
const DEFAULT_SUMMARY =
  "Product builder focused on translating customer insight into measurable business impact."

/**
 * Apply keywords to experience highlights as fallback
 */
const applyKeywordsToExperience = (
  experience: ExperienceItem,
  keywords: string[]
): ExperienceItem => {
  if (!keywords.length) return experience

  const highlights = experience.highlights.length
    ? experience.highlights.map((line, index) => {
        const keyword = keywords[index % keywords.length]
        return `${line.replace(/\.$/, "")} — Demonstrated ${titleCase(keyword)}.`
      })
    : [`Delivered measurable outcomes aligned with ${titleCase(keywords[0]!)} priorities.`]

  return {
    ...experience,
    highlights,
  }
}

/**
 * Enhance a professional summary using AI
 * @param summary - The current summary text
 * @param context - Optional context (e.g., job title or job description)
 * @returns Enhanced summary
 */
export const enhanceSummaryWithAI = async (
  summary: string,
  context?: string,
  config?: AIConfig
): Promise<string> => {
  const trimmed = summary.trim()
  if (!trimmed) {
    return DEFAULT_SUMMARY
  }

  const prompt = createSummaryEnhancementPrompt(trimmed, context)
  const enhanced = await generateText(prompt, config)
  return enhanced || trimmed
}

/**
 * Enhance work experience using AI
 * @param experienceInput - The experience item to enhance
 * @param jobDescription - Optional job description to tailor experience to
 * @param seededKeywords - Optional pre-extracted keywords
 * @returns Enhanced experience item
 */
export const enhanceExperienceWithAI = async (
  experienceInput: ExperienceItem,
  jobDescription?: string,
  seededKeywords: string[] = [],
  config?: AIConfig
): Promise<ExperienceItem> => {
  const experience = experienceSchema.parse(experienceInput)
  const keywords = seededKeywords.length
    ? seededKeywords
    : jobDescription
    ? extractKeywords(jobDescription)
    : []

  const prompt = createExperienceEnhancementPrompt(experience, jobDescription)

  try {
    const response = await generateText(prompt, config)
    const suggestions = response
      .split(/\n+/)
      .map((value: string) => sanitizeBullet(value))
      .filter((line: string): line is string => line.length > 4)

    if (!suggestions.length) {
      return applyKeywordsToExperience(experience, keywords)
    }

    return {
      ...experience,
      highlights: suggestions.slice(0, 5),
    }
  } catch (error) {
    return applyKeywordsToExperience(experience, keywords)
  }
}
