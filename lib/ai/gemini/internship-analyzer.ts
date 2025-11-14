import { ensureClient, getTextModel } from "./client"
import {
    createInternshipSubjectSuggestionsPrompt,
    createInternshipEmailGenerationPrompt
} from "./prompt-templates"
import type { CVData } from "@/lib/cv"

export type InternshipSubject = {
  subject: string
  explanation: string
}

export type InternshipAnalysisResponse = {
  subjects: InternshipSubject[]
  companyEmail: string | null
  companyName: string | null
}

export type InternshipEmails = {
  applicantEmail: string
  companyEmail: string
}

export type InternshipAnalysisResult = {
  suggestedSubject: string
  applicantEmail: string
  companyEmail: string
}

/**
 * Suggest internship subjects based on CV and internship document
 * @param internshipText - Extracted text from the internship PDF
 * @param cvData - Current CV data
 * @returns Analysis with subjects, company email, and company name
 */
export const suggestInternshipSubjects = async (
  internshipText: string,
  cvData: CVData
): Promise<InternshipAnalysisResponse> => {
  const client = ensureClient()
  const prompt = createInternshipSubjectSuggestionsPrompt(internshipText, cvData)

  try {
    const response = await client.models.generateContent({
      model: getTextModel(),
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    })

    const text = typeof response.text === "string" ? response.text.trim() : ""

    if (!text) {
      throw new Error("Empty response from AI")
    }

    // Try to parse the JSON response
    // Remove markdown code blocks if present
    let jsonText = text
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (match) {
        jsonText = match[1]
      }
    }

    // Find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not find JSON object in AI response")
    }

    const parsed = JSON.parse(jsonMatch[0]) as InternshipAnalysisResponse

    // Validate the response structure
    if (!parsed.subjects || !Array.isArray(parsed.subjects) || parsed.subjects.length === 0) {
      throw new Error("Invalid response structure from AI")
    }

    // Validate each subject has required fields
    for (const subject of parsed.subjects) {
      if (!subject.subject || !subject.explanation) {
        throw new Error("Invalid subject structure from AI")
      }
    }

    return {
      subjects: parsed.subjects,
      companyEmail: parsed.companyEmail || null,
      companyName: parsed.companyName || null,
    }
  } catch (error) {
    console.error("[Internship Analyzer] Error:", error)
    throw new Error(
      error instanceof Error
        ? `Failed to analyze internship: ${error.message}`
        : "Failed to analyze internship document"
    )
  }
}

/**
 * Generate professional emails for a specific internship subject
 * @param internshipText - Extracted text from the internship PDF
 * @param cvData - Current CV data
 * @param selectedSubject - The chosen internship subject
 * @returns Applicant and company email templates
 */
export const generateInternshipEmails = async (
  internshipText: string,
  cvData: CVData,
  selectedSubject: string
): Promise<InternshipEmails> => {
  const client = ensureClient()
  const prompt = createInternshipEmailGenerationPrompt(internshipText, cvData, selectedSubject)

  try {
    const response = await client.models.generateContent({
      model: getTextModel(),
      contents: [
        {
          role: "user",
          parts: [{ text: prompt }],
        },
      ],
    })

    const text = typeof response.text === "string" ? response.text.trim() : ""

    if (!text) {
      throw new Error("Empty response from AI")
    }

    // Try to parse the JSON response
    // Remove markdown code blocks if present
    let jsonText = text
    if (text.includes("```")) {
      const match = text.match(/```(?:json)?\s*(\{[\s\S]*?\})\s*```/)
      if (match) {
        jsonText = match[1]
      }
    }

    // Find JSON object in the response
    const jsonMatch = jsonText.match(/\{[\s\S]*\}/)
    if (!jsonMatch) {
      throw new Error("Could not find JSON in AI response")
    }

    const parsed = JSON.parse(jsonMatch[0]) as InternshipEmails

    // Validate the response structure
    if (!parsed.applicantEmail || !parsed.companyEmail) {
      throw new Error("Invalid response structure from AI")
    }

    return {
      applicantEmail: parsed.applicantEmail.trim(),
      companyEmail: parsed.companyEmail.trim(),
    }
  } catch (error) {
    console.error("[Internship Email Generator] Error:", error)
    throw new Error(
      error instanceof Error
        ? `Failed to generate emails: ${error.message}`
        : "Failed to generate professional emails"
    )
  }
}
