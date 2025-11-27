import { generateText } from "../client"
import { AIConfig } from "../types"
import type { CVData } from "@/lib/cv"

/**
 * Generate a motivation letter prompt
 */
const createMotivationLetterPrompt = (
  cv: CVData,
  jobPosition: string,
  language: "en" | "fr" = "en"
): string => {
  const { personal, experience, education, skills } = cv

  const languageInstruction = language === "fr" 
    ? "Generate the letter in FRENCH (Français). Use formal French business language."
    : "Generate the letter in ENGLISH."

  return `Generate a professional motivation letter for the following job application.

**IMPORTANT: ${languageInstruction}**

**Applicant Information:**
- Name: ${personal.fullName}
- Title: ${personal.title}
- Summary: ${personal.summary}
- Email: ${personal.email}
- Location: ${personal.location}

**Job Position/Description:**
${jobPosition}

**Key Experience:**
${experience
  .slice(0, 3)
  .map(
    (exp) =>
      `- ${exp.role} at ${exp.company}${exp.highlights.length ? `: ${exp.highlights[0]}` : ""}`
  )
  .join("\n")}

**Education:**
${education
  .slice(0, 2)
  .map((edu) => `- ${edu.degree} from ${edu.school}`)
  .join("\n")}

**Key Skills:**
${skills.slice(0, 8).join(", ")}

**Requirements:**
1. Write a compelling motivation letter (250-400 words)
2. Express genuine interest in the position
3. Highlight relevant experience and skills that match the job requirements
4. Show understanding of the company/role
5. Maintain a professional yet personable tone
6. Include proper letter structure (greeting, body paragraphs, closing)
7. Use action-oriented language
8. Avoid clichés and generic statements

Generate ONLY the letter content without any markdown formatting, headers, or explanations. Start directly with the letter.`
}

/**
 * Generate a motivation letter using AI
 * @param cv - The CV data
 * @param jobPosition - Job position or description
 * @param language - Language for the letter (en or fr)
 * @returns Generated motivation letter
 */
export const generateMotivationLetterWithAI = async (
  cv: CVData,
  jobPosition: string,
  language: "en" | "fr" = "en",
  config?: AIConfig
): Promise<string> => {
  if (!jobPosition.trim()) {
    throw new Error("Job position is required to generate motivation letter")
  }

  const prompt = createMotivationLetterPrompt(cv, jobPosition, language)

  try {
    const letter = await generateText(prompt, config)
    
    if (!letter || letter.trim().length < 100) {
      // Fallback template if AI response is too short
      return generateFallbackLetter(cv, jobPosition)
    }

    return letter.trim()
  } catch (error) {
    console.error("[Motivation Letter] AI generation failed:", error)
    return generateFallbackLetter(cv, jobPosition)
  }
}

/**
 * Generate a fallback motivation letter template
 */
const generateFallbackLetter = (cv: CVData, jobPosition: string): string => {
  const { personal, experience, skills } = cv
  const latestRole = experience[0]

  return `Dear Hiring Manager,

I am writing to express my strong interest in the ${jobPosition.split("\n")[0]}. With my background as ${personal.title} and ${experience.length} years of professional experience, I am excited about the opportunity to contribute to your team.

In my most recent role${latestRole ? ` as ${latestRole.role} at ${latestRole.company}` : ""}, I have developed strong expertise in ${skills.slice(0, 3).join(", ")}. ${personal.summary}

I am particularly drawn to this position because it aligns perfectly with my professional goals and expertise. My experience in ${skills[0] || "the field"} has equipped me with the skills necessary to excel in this role and make meaningful contributions to your organization.

I am confident that my combination of practical experience and passion for ${skills[0] || "innovation"} makes me an ideal candidate for this position. I would welcome the opportunity to discuss how my background and skills would benefit your team.

Thank you for considering my application. I look forward to the possibility of discussing this exciting opportunity with you.

Sincerely,
${personal.fullName}
${personal.email}
${personal.phone}`
}
