/**
 * Sanitize a bullet point by removing leading markers and extra whitespace
 */
export const sanitizeBullet = (value: string): string => {
  return value.replace(/^[-*•\d\.\)\s]+/, "").replace(/\s+/g, " ").trim()
}

/**
 * Remove duplicate values from an array
 */
export const dedupe = (values: string[]): string[] => {
  return Array.from(new Set(values.filter(Boolean)))
}

/**
 * Convert string to title case
 */
export const titleCase = (input: string): string => {
  return input
    .split(" ")
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
    .join(" ")
}

/**
 * Extract keywords from text using basic NLP
 */
export const extractKeywords = (input: string, maxKeywords: number = 10): string[] => {
  return dedupe(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
  ).slice(0, maxKeywords)
}

/**
 * Strip markdown code fences from text
 */
export const stripCodeFences = (input: string): string => {
  const trimmed = input.trim()
  if (!trimmed.startsWith("```")) {
    return trimmed
  }

  const lines = trimmed.split("\n")
  if (lines[0]?.startsWith("```")) {
    lines.shift()
  }
  if (lines[lines.length - 1]?.startsWith("```")) {
    lines.pop()
  }
  return lines.join("\n").trim()
}

/**
 * Extract a JSON object from AI response text
 */
export const extractJsonObject = (input: string): string => {
  const cleaned = stripCodeFences(input)
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not include a JSON object")
  }
  
  return cleaned.slice(start, end + 1)
}

/**
 * Merge two skill arrays, prioritizing new skills
 */
export const mergeSkills = (
  currentSkills: string[],
  newSkills: string[],
  maxSkills: number = 18
): string[] => {
  const normalized = newSkills.map(titleCase)
  return dedupe([...normalized, ...currentSkills]).slice(0, maxSkills)
}
