import { GoogleGenAI } from "@google/genai"

import { cvSchema, defaultCV, experienceSchema, type CVData, type ExperienceItem } from "@/lib/cv"

const TEXT_MODEL = "gemini-2.5-flash-lite"

let client: GoogleGenAI | null = null

const ensureClient = () => {
  const apiKey = process.env.GOOGLE_GENAI_API_KEY
  if (!apiKey) {
    throw new Error("GOOGLE_GENAI_API_KEY is not configured")
  }

  if (!client) {
    client = new GoogleGenAI({ apiKey })
  }

  return client
}

const generateText = async (prompt: string) => {
  const response = await ensureClient().models.generateContent({
    model: TEXT_MODEL,
    contents: [{ role: "user", parts: [{ text: prompt }]}],
  })

  const direct = typeof response.text === "string" ? response.text.trim() : ""
  if (direct) {
    return direct
  }

  const primaryCandidate = response.candidates?.[0]
  if (!primaryCandidate?.content?.parts?.length) {
    return ""
  }

  const fallback = primaryCandidate.content.parts
    .map((part) => {
      const maybeText = (part as { text?: unknown }).text
      return typeof maybeText === "string" ? maybeText.trim() : ""
    })
    .filter((value): value is string => value.length > 0)
    .join(" ")

  return fallback.trim()
}

const sanitizeBullet = (value: string) => value.replace(/^[-*•\d\.\)\s]+/, "").replace(/\s+/g, " ").trim()

const dedupe = (values: string[]) => Array.from(new Set(values.filter(Boolean)))

const fallbackKeywordsFrom = (input: string) => {
  return dedupe(
    input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, " ")
      .split(/\s+/)
      .filter((token) => token.length > 3)
  ).slice(0, 10);
}

const titleCase = (input: string) =>
  input
    .split(" ")
    .map((part) => (part ? part[0]!.toUpperCase() + part.slice(1) : ""))
    .join(" ")

const applyKeywordsToExperience = (experience: ExperienceItem, keywords: string[]): ExperienceItem => {
  if (!keywords.length) return experience

  const highlights = experience.highlights.length
    ? experience.highlights.map((line, index) => {
        const keyword = keywords[index % keywords.length]
        return `${line.replace(/\.$/, "")} — Demonstrated ${titleCase(keyword)}.`;
      })
    : [
        `Delivered measurable outcomes aligned with ${titleCase(keywords[0]!)} priorities.`,
      ]

  return {
    ...experience,
    highlights,
  }
}

export const isGenAIConfigured = () => Boolean(process.env.GOOGLE_GENAI_API_KEY)

export const enhanceSummaryWithAI = async (summary: string, context?: string) => {
  const trimmed = summary.trim()
  if (!trimmed) {
    return "Product builder focused on translating customer insight into measurable business impact."
  }

  const prompt = [
    "You are a career coach polishing a professional summary.",
    context ? `Context: ${context}` : "",
    "Rewrite the summary to sound confident, results-oriented, and concise (max 3 sentences, under 75 words).",
    "Avoid bullet points and keep the meaning consistent.",
    `Summary: """${trimmed}"""`,
  ]
    .filter(Boolean)
    .join("\n")

  const enhanced = await generateText(prompt)
  return enhanced || trimmed
}

export const enhanceExperienceWithAI = async (
  experienceInput: ExperienceItem,
  jobDescription?: string,
  seededKeywords: string[] = []
) => {
  const experience = experienceSchema.parse(experienceInput)
  const keywords = seededKeywords.length ? seededKeywords : jobDescription ? fallbackKeywordsFrom(jobDescription) : []

  const prompt = [
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
    "- Return ONLY the bullet points, one per line, no numbering or special characters",
  ]
    .filter(Boolean)
    .join("\n")

  const response = await generateText(prompt)
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
}

const suggestKeywords = async (jobDescription: string) => {
  const prompt = [
    "Extract ALL technical skills, frameworks, programming languages, tools, and methodologies from this job description.",
    "Include both hard technical skills (e.g., React, Python, AWS) and soft skills (e.g., leadership, agile).",
    "Return them as a comma-separated list of keywords without any numbering, commentary, or extra text.",
    `Job description:\n${jobDescription}`,
  ].join("\n")

  const response = await generateText(prompt)

  const extracted = response
    .split(/[,\n;]/)
      .map((item: string) => item.trim().toLowerCase())
      .filter((item: string): item is string => item.length > 2)

  const unique = dedupe(extracted)
  return unique.length ? unique.slice(0, 20) : fallbackKeywordsFrom(jobDescription)
}

const mergeSkills = (current: string[], additions: string[]) => {
  const normalized = additions.map(titleCase)
  // Prioritize new job-related skills over old ones
  return dedupe([...normalized, ...current]).slice(0, 18)
}

export const adaptCVWithAI = async (cvInput: CVData, jobDescription: string) => {
  const cv = cvSchema.parse(cvInput)

  // Extract all relevant keywords and technologies from job description
  const keywords = await suggestKeywords(jobDescription)
  const summaryContext = `This is for a role requiring: ${keywords.slice(0, 5).join(", ")}. Make the summary highly targeted to show expertise in these areas.`

  // Enhance summary to be laser-focused on the job
  let summary = cv.personal.summary
  try {
    const enhancedSummaryPrompt = [
      "Rewrite this professional summary to make the candidate seem PERFECT for a job requiring these skills:",
      keywords.slice(0, 8).join(", "),
      "\nCurrent summary:",
      cv.personal.summary,
      "\nMake it confident, results-oriented, and clearly demonstrate experience with the required technologies.",
      "Keep it under 80 words and 3 sentences maximum.",
      "DO NOT use bullet points."
    ].join("\n")
    
    summary = await generateText(enhancedSummaryPrompt) || cv.personal.summary
  } catch (error) {
    summary = cv.personal.summary
  }

  // Adapt each experience entry to match the job requirements
  const experience = await Promise.all(
    cv.experience.map(async (role) => {
      try {
        return await enhanceExperienceWithAI(role, jobDescription, keywords)
      } catch (error) {
        return applyKeywordsToExperience(role, keywords)
      }
    })
  )

  // Replace skills entirely with job-relevant ones (keep some original for authenticity)
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

const stripCodeFences = (input: string) => {
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

const extractJsonObject = (input: string) => {
  const cleaned = stripCodeFences(input)
  const start = cleaned.indexOf("{")
  const end = cleaned.lastIndexOf("}")
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("AI response did not include a JSON object")
  }
  return cleaned.slice(start, end + 1)
}

const ensureIds = (cv: CVData): CVData => {
  const fallback = defaultCV()
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
    skills: cv.skills.length ? cv.skills : fallback.skills,
  }
}

const sanitizePersonalData = (data: Record<string, unknown>) => {
  const personal = (data.personal || {}) as Record<string, unknown>
  
  return {
    fullName: typeof personal.fullName === "string" && personal.fullName.trim() 
      ? personal.fullName.trim() 
      : "Candidate",
    title: typeof personal.title === "string" ? personal.title.trim() : "",
    summary: typeof personal.summary === "string" ? personal.summary.trim() : "",
    email: typeof personal.email === "string" && personal.email.includes("@") 
      ? personal.email.trim() 
      : "candidate@example.com",
    phone: typeof personal.phone === "string" ? personal.phone.trim() : "",
    location: typeof personal.location === "string" ? personal.location.trim() : "",
    website: typeof personal.website === "string" ? personal.website.trim() : "",
    linkedin: typeof personal.linkedin === "string" ? personal.linkedin.trim() : "",
  }
}

export const importCVWithAI = async (resumeText: string) => {
  const trimmed = resumeText.trim()
  if (!trimmed) {
    throw new Error("Resume content is empty")
  }

  // Log first 500 chars for debugging
  console.log("[AI Import] Processing resume, first 500 chars:", trimmed.slice(0, 500))

  const prompt = [
    "You are an expert resume parser. Extract ALL available information from the resume below.",
    "",
    "OUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:",
    JSON.stringify({
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
    }, null, 2),
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
    trimmed,
    "---",
  ].join("\n")

  const response = await generateText(prompt)
  console.log("[AI Import] Raw AI response length:", response.length)
  console.log("[AI Import] First 500 chars of response:", response.slice(0, 500))
  
  const jsonPayload = extractJsonObject(response)
  const parsed = JSON.parse(jsonPayload) as Record<string, unknown>
  
  console.log("[AI Import] Parsed personal data:", JSON.stringify((parsed.personal as Record<string, unknown>) || {}))
  console.log("[AI Import] Experience count:", Array.isArray(parsed.experience) ? parsed.experience.length : 0)
  
  // Sanitize and ensure required fields have valid values
  const sanitized = {
    ...parsed,
    personal: sanitizePersonalData(parsed),
  }
  
  const cv = cvSchema.parse(sanitized)
  return ensureIds(cv)
}
