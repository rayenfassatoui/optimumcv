import type { CVData, ExperienceItem } from "@/lib/cv"

/**
 * Generate prompt for enhancing a professional summary
 */
export const createSummaryEnhancementPrompt = (
  summary: string,
  context?: string
): string => {
  return [
    "You are a career coach polishing a professional summary.",
    context ? `Context: ${context}` : "",
    "Rewrite the summary to sound confident, results-oriented, and concise (max 3 sentences, under 75 words).",
    "Avoid bullet points, bold text, markdown formatting, and generic introductions.",
    "Write in plain text only. Be direct and specific.",
    `Summary: """${summary}"""`,
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
    "You are a creative resume writer helping adapt a candidate's experience to match a job posting.",
    "IMPORTANT: You must strategically rewrite the experience to emphasize relevant technologies and skills from the job description.",
    "Feel free to:",
    "- Replace or add technologies/frameworks mentioned in the job (e.g., change 'Java' to 'Unity' if job requires Unity)",
    "- Emphasize skills that match the job requirements",
    "- Make the candidate appear highly qualified for THIS specific role",
    "- Keep the company name, role title, and dates UNCHANGED",
    jobDescription ? `\nJob Requirements/Description:\n${jobDescription}\n` : "",
    `Current Experience Entry:\nCompany: ${experience.company}\nRole: ${experience.role}\nCurrent Highlights: ${experience.highlights.join("; ")}\n`,
    "\nRules:",
    "- Return 3-5 bullet points, each under 25 words",
    "- Start each bullet with a strong action verb",
    "- Include specific technologies/skills from the job description naturally",
    "- Focus on measurable outcomes and impact",
    "- Make it sound like this person is PERFECT for the target job",
    "- DO NOT use bold text, markdown formatting, asterisks, or any special formatting",
    "- Write in plain text only, no introductions or conclusions",
    "- Return ONLY the bullet points, one per line, no numbering or special characters",
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Generate prompt for extracting keywords from job description
 */
export const createKeywordExtractionPrompt = (jobDescription: string): string => {
  return [
    "Extract ALL technical skills, frameworks, programming languages, tools, and methodologies from this job description.",
    "Include both hard technical skills (e.g., React, Python, AWS) and soft skills (e.g., leadership, agile).",
    "Return them as a comma-separated list of keywords without any numbering, commentary, or extra text.",
    `Job description:\n${jobDescription}`,
  ].join("\n")
}

/**
 * Generate prompt for adapting summary to job requirements
 */
export const createSummaryAdaptationPrompt = (
  summary: string,
  keywords: string[]
): string => {
  return [
    "Rewrite this professional summary to make the candidate seem PERFECT for a job requiring these skills:",
    keywords.slice(0, 8).join(", "),
    "\nCurrent summary:",
    summary,
    "\nMake it confident, results-oriented, and clearly demonstrate experience with the required technologies.",
    "Keep it under 80 words and 3 sentences maximum.",
    "DO NOT use bullet points, bold text, markdown formatting, asterisks, or generic introductions.",
    "Write in plain text only. Be direct and specific about accomplishments.",
  ].join("\n")
}

/**
 * Generate prompt for CV import/parsing
 */
export const createCVImportPrompt = (resumeText: string): string => {
  const exampleStructure = {
    personal: {
      fullName: "John Doe",
      title: "Software Engineer",
      summary: "Brief professional summary",
      email: "john@example.com",
      phone: "+1234567890",
      location: "City, Country",
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    experience: [
      {
        id: "exp1",
        role: "Senior Engineer",
        company: "Tech Corp",
        location: "San Francisco",
        startDate: "Jan 2020",
        endDate: "Present",
        highlights: ["Led team of 5 engineers", "Increased performance by 40%"],
      },
    ],
    education: [
      {
        id: "edu1",
        school: "University Name",
        degree: "Bachelor of Science in Computer Science",
        location: "City",
        startDate: "2015",
        endDate: "2019",
        highlights: ["GPA: 3.8"],
      },
    ],
    projects: [
      {
        id: "proj1",
        name: "Project Name",
        summary: "Brief description",
        link: "https://github.com/user/repo",
        highlights: ["Built with React", "10k+ users"],
      },
    ],
    skills: ["JavaScript", "Python", "React"],
    certifications: ["AWS Certified"],
    languages: ["English", "Spanish"],
  }

  return [
    "You are an expert resume parser. Extract ALL available information from the resume below.",
    "",
    "OUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:",
    JSON.stringify(exampleStructure, null, 2),
    "",
    "EXTRACTION RULES:",
    "1. Extract the person's real name from the resume → use for 'fullName' (never use placeholder)",
    "2. Extract the person's real email → use for 'email' (must be valid email format)",
    "3. Extract job title/role → use for 'title'",
    "4. Extract professional summary/objective → use for 'summary'",
    "5. Extract ALL job positions with their descriptions → add to 'experience' array",
    "6. Extract ALL education entries → add to 'education' array",
    "7. Extract ALL projects → add to 'projects' array",
    "8. Extract ALL technical skills → add to 'skills' array",
    "9. Extract certifications if present → add to 'certifications' array",
    "10. Extract languages if present → add to 'languages' array",
    "",
    "IMPORTANT:",
    "- Return ONLY the JSON object, no markdown fences, no explanations",
    "- Use empty string \"\" for missing text fields (never null)",
    "- Use empty array [] for missing list fields (never null)",
    "- Preserve all bullet points from work experience as separate items in highlights array",
    "- Keep dates in simple format: 'Jan 2023', '2020', or 'Present'",
    "- Be thorough - extract every detail you can find",
    "",
    "RESUME TO PARSE:",
    "---",
    resumeText,
    "---",
  ].join("\n")
}

/**
 * Generate prompt for ATS optimization
 */
export const createATSOptimizationPrompt = (cv: CVData): string => {
  return [
    "You are an expert ATS (Applicant Tracking System) optimization specialist.",
    "Your task is to optimize the entire CV to be ATS-friendly while maintaining professionalism and impact.",
    "",
    "ATS Optimization Rules:",
    "1. Use simple, standard section headings (Experience, Education, Skills)",
    "2. Include relevant keywords and industry-standard terminology",
    "3. Use action verbs at the start of bullet points (Led, Developed, Implemented, Managed, etc.)",
    "4. Quantify achievements with numbers, percentages, and metrics whenever possible",
    "5. Remove special characters, graphics descriptions, and complex formatting",
    "6. Use standard job titles and clear role descriptions",
    "7. Include relevant technical skills and tools",
    "8. Make content scannable with clear, concise language",
    "9. Ensure consistency in date formats and structure",
    "10. Optimize for keyword matching without keyword stuffing",
    "",
    "Current CV Data:",
    JSON.stringify(cv, null, 2),
    "",
    "Return ONLY a valid JSON object with the same structure as CVData schema but with ATS-optimized content.",
    "Enhance the summary to be keyword-rich and results-focused.",
    "Rewrite experience highlights to start with strong action verbs and include metrics.",
    "Optimize skills list with industry-standard terms.",
    "Ensure all text is clear, professional, and ATS-scannable.",
  ].join("\n")
}

/**
 * Generate prompt for photo analysis
 */
export const createPhotoAnalysisPrompt = (): string => {
  return `Analyze this person's photo and determine if it's professional enough for a CV/resume. 
    
A professional photo should have:
- Professional attire (suit, blazer, or formal business wear)
- Neutral, clean background (solid colors like white, gray, or blue)
- Good lighting and clarity
- Professional expression
- Head and shoulders composition

Describe this photo in detail, including the person's appearance, what they're wearing, the background, lighting, and pose. Then explain what specific changes would make it more professional. Be very specific and detailed in your description.`
}

/**
 * Generate prompt for professional photo generation
 */
export const createPhotoGenerationPrompt = (): string => {
  return `Professional corporate headshot photograph for CV and resume. Create a high-quality professional headshot with these characteristics:
- Professional business attire: dark suit jacket, white or light blue dress shirt, professional appearance
- Clean solid background: soft neutral color (light gray, white, or soft blue)
- Professional studio lighting: even, soft lighting with no harsh shadows
- Expression: confident, approachable, slight professional smile
- Composition: head and shoulders, centered, facing camera
- Style: photorealistic, high quality, sharp focus, professional photography
- Image quality: 4K resolution, studio quality

Based on the original photo analysis: The person should maintain similar general features and characteristics while presenting in a completely professional corporate style.`
}
