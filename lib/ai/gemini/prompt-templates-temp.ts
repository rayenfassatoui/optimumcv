import type { ExperienceItem } from "@/lib/cv"

/**
 * Generate prompt for enhancing a professional summary
 */
export const createSummaryEnhancementPrompt = (
  summary: string,
  context?: string
): string => {
  return [
    "You are a career coach rewriting a professional summary for a CV.",
    "Your goal is to create a powerful, 2-3 sentence pitch (under 75 words) that grabs a recruiter's attention in under 10 seconds.",
    "The summary must highlight the candidate's biggest achievements and core value proposition.",
    context ? `Context from the CV: ${context}` : "",
    "Rewrite the following summary:",
    `"""${summary}"""`,
    "",
    "Rules:",
    "- DO NOT use bullet points, bold text, or markdown.",
    "- DO NOT use generic introductions like 'I am a...'",
    "- Write in plain text only. Be direct, confident, and results-oriented.",
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Generate prompt for enhancing work experience
 */
export const createExperienceEnhancementPrompt = (
  experience: ExperienceItem,
  jobDescription?: string
): string => {
  return [
    "You are an elite resume strategist who crafts compelling, high-impact experience bullet points.",
    "Your mission: Transform this candidate's experience into powerful statements that make recruiters stop and take notice.",
    jobDescription ? `\\nTarget Job Requirements:\\n${jobDescription}\\n` : "",
    `Current Experience:\\nCompany: ${experience.company}\\nRole: ${experience.role}\\nHighlights: ${experience.highlights.join("; ")}\\n`,
    "\\nCraft 3-5 Achievement-Focused Bullet Points:",
    "",
    "CRITICAL RULES:",
    "1. **Vary Your Opening Verbs** - Use diverse, powerful action verbs. Examples:",
    "   - Impact: Drove, Accelerated, Transformed, Delivered, Generated",
    "   - Leadership: Led, Directed, Orchestrated, Championed, Spearheaded",
    "   - Creation: Built, Architected, Designed, Developed, Launched",
    "   - Improvement: Optimized, Enhanced, Streamlined, Modernized, Revamped",
    "   - Technical: Implemented, Integrated, Deployed, Migrated, Automated",
    "",
    "2. **Never Repeat** - Each bullet must start with a DIFFERENT verb. No duplicates!",
    "",
    "3. **Quantify Everything** - Include specific metrics that show impact:",
    "   - Performance gains (e.g., 'reduced load time by 60%')",
    "   - Scale (e.g., 'serving 500K+ daily users')",
    "   - Team size (e.g., 'led team of 8 engineers')",
    "   - Business impact (e.g., 'increased revenue by 40%')",
    "",
    "4. **Smart Keyword Integration** - If job description provided, seamlessly weave in those technologies/skills",
    "",
    "5. **Keep it Tight** - Each bullet: 15-25 words maximum",
    "",
    "6. **Format** - Plain text only. No markdown, no asterisks, no bullets. One statement per line.",
    "",
    "OUTPUT: Return ONLY the bullet points, nothing else. Make them impressive, varied, and quantified.",
  ]
    .filter(Boolean)
    .join("\\n")
}
