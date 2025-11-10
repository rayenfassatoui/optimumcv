import { cvSchema, defaultCV, type CVData, type ExperienceItem } from "@/lib/cv"

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms))

const keywordsFrom = (input: string) => {
  return Array.from(
    new Set(
      input
        .toLowerCase()
        .replace(/[^a-z0-9\s]/gi, " ")
        .split(/\s+/)
        .filter((token) => token.length > 4)
    )
  ).slice(0, 8)
}

export type MockImportResult = {
  cv: CVData
  fallback: boolean
  reason?: string
}

export async function mockImportCV({
  file,
  text,
}: {
  file?: File | null
  text?: string
}): Promise<MockImportResult> {
  await sleep(700)

  if (text) {
    try {
      const parsed = JSON.parse(text)
      return {
        cv: cvSchema.parse(parsed),
        fallback: false,
      }
    } catch (error) {
      // fall back to AI extraction when JSON parsing fails
      return {
        cv: defaultCV(),
        fallback: true,
        reason: "We couldn't read structured data directly. Trying AI assistance…",
      }
    }
  }

  if (file) {
    const isJson = file.type === "application/json" || file.name.endsWith(".json")
    if (isJson) {
      const json = await file.text()
      try {
        return {
          cv: cvSchema.parse(JSON.parse(json)),
          fallback: false,
        }
      } catch (error) {
        return {
          cv: defaultCV(),
          fallback: true,
          reason: "The uploaded file isn't valid JSON. Trying AI assistance…",
        }
      }
    }

    // For PDF or text files, extract text and signal for AI processing
    const isPdfOrText = 
      file.type === "application/pdf" || 
      file.name.endsWith(".pdf") ||
      file.type.startsWith("text/")
    
    if (isPdfOrText) {
      return {
        cv: defaultCV(),
        fallback: true,
        reason: "Extracting text from your resume for AI processing…",
      }
    }
  }

  return {
    cv: defaultCV(),
    fallback: true,
    reason: "This format isn't supported directly. Trying AI assistance…",
  }
}

export async function mockEnhanceSummary(summary: string, context?: string) {
  await sleep(420)
  if (!summary.trim()) {
    return "Product leader with experience turning ambiguity into validated experiences that move key metrics."
  }
  const trimmed = summary.trim()
  const infused = context ? `Calibrated for ${context}.` : ""
  return `${trimmed.replace(/\.$/, "")}. ${infused} Elevated to emphasize measurable impact and strategic collaboration.`.trim()
}

export async function mockEnhanceExperience(
  experience: ExperienceItem,
  jobDescription?: string
): Promise<ExperienceItem> {
  await sleep(520)
  const keywords = jobDescription ? keywordsFrom(jobDescription) : []
  const highlights = experience.highlights.length
    ? experience.highlights.map((line, index) => {
        const keyword = keywords[index % Math.max(keywords.length, 1)] ?? "impact"
        return line.replace(/\.$/, "").concat(` · Highlighting ${keyword} outcomes.`)
      })
    : [
        "Delivered measurable outcomes by combining research, experimentation, and crisp stakeholder storytelling.",
      ]

  return {
    ...experience,
    highlights,
  }
}

export async function mockAdaptCV(cv: CVData, jobDescription: string): Promise<CVData> {
  await sleep(640)
  const keywords = keywordsFrom(jobDescription)
  const padded = keywords.length ? keywords : ["strategy", "execution", "leadership"]

  return {
    ...cv,
    personal: {
      ...cv.personal,
      summary: (
        `${cv.personal.summary.replace(/\.$/, "")}. Tailored for ${padded
          .slice(0, 3)
          .join(", ")}.`
      )
        .replace(/\s+/g, " ")
        .trim(),
    },
    skills: Array.from(new Set([...cv.skills, ...padded.map((word) => word[0]?.toUpperCase() + word.slice(1))])).slice(0, 15),
    experience: cv.experience.map((role, index) => {
      const updated = role.highlights.map((highlight, highlightIndex) => {
        const keyword = padded[(index + highlightIndex) % padded.length]
        return highlight.replace(/\.$/, "").concat(` — Demonstrated ${keyword}.`)
      })
      return {
        ...role,
        highlights: updated,
      }
    }),
  }
}

export async function mockEnhancePhoto(file: File): Promise<string> {
  await sleep(1000)
  const blob = await file.arrayBuffer()
  const enhancedBlob = new Blob([blob], { type: file.type || "image/png" })
  const url = URL.createObjectURL(enhancedBlob)
  return url
}

export async function mockOptimizeCVForATS(cv: CVData): Promise<CVData> {
  await sleep(800)
  
  // ATS-friendly action verbs
  const actionVerbs = [
    "Achieved", "Implemented", "Led", "Developed", "Managed", "Increased", 
    "Reduced", "Optimized", "Delivered", "Drove", "Established", "Executed",
    "Spearheaded", "Streamlined", "Enhanced", "Generated"
  ]
  
  // Optimize summary for ATS
  const optimizedSummary = cv.personal.summary
    ? `${cv.personal.summary.replace(/\.$/, "")}. Results-driven professional with proven track record in delivering measurable outcomes and driving organizational success through data-driven strategies.`
    : "Results-driven professional with expertise in delivering measurable outcomes and achieving organizational goals through strategic planning and execution."
  
  // Optimize experience with action verbs and metrics
  const optimizedExperience = cv.experience.map((exp) => ({
    ...exp,
    highlights: exp.highlights.length > 0
      ? exp.highlights.map((highlight, index) => {
          const verb = actionVerbs[index % actionVerbs.length]
          const cleaned = highlight.replace(/^[-*•\s]+/, "").replace(/^\w+\s/, "")
          return `${verb} ${cleaned}`.replace(/\s+/g, " ").trim()
        })
      : [`${actionVerbs[0]} key initiatives to drive business growth and operational excellence`]
  }))
  
  // Add common ATS keywords to skills if not already present
  const atsKeywords = [
    "Project Management",
    "Cross-functional Collaboration", 
    "Strategic Planning",
    "Process Improvement",
    "Data Analysis"
  ]
  
  const optimizedSkills = Array.from(
    new Set([...cv.skills, ...atsKeywords.filter(k => !cv.skills.some(s => s.toLowerCase().includes(k.toLowerCase())))])
  ).slice(0, 20)
  
  return {
    ...cv,
    personal: {
      ...cv.personal,
      summary: optimizedSummary,
    },
    experience: optimizedExperience,
    skills: optimizedSkills,
  }
}
