import { NextResponse } from "next/server"

import { cvSchema, experienceSchema } from "@/lib/cv"
import {
  adaptCVWithAI,
  enhanceExperienceWithAI,
  enhanceSummaryWithAI,
  importCVWithAI,
  isGenAIConfigured,
  optimizeCVForATS,
} from "@/lib/ai/google"

const json = (data: unknown, init?: ResponseInit) =>
  NextResponse.json(data, {
    ...init,
    headers: {
      "Cache-Control": "no-store",
      ...(init?.headers ?? {}),
    },
  })

export async function POST(request: Request) {
  if (!isGenAIConfigured()) {
    return json({ error: "AI service is not configured." }, { status: 503 })
  }

  try {
    const { action, payload } = (await request.json()) as {
      action?: string
      payload?: Record<string, unknown>
    }

    switch (action) {
      case "enhance-summary": {
        const summary = typeof payload?.summary === "string" ? payload.summary : undefined
        const context = typeof payload?.context === "string" ? payload.context : undefined

        if (!summary) {
          return json({ error: "Summary is required." }, { status: 400 })
        }

        const enhanced = await enhanceSummaryWithAI(summary, context)
        return json({ summary: enhanced })
      }

      case "enhance-experience": {
        if (!payload?.experience) {
          return json({ error: "Experience payload is missing." }, { status: 400 })
        }

        const experience = experienceSchema.parse(payload.experience)
        const jobDescription = typeof payload.jobDescription === "string" ? payload.jobDescription : undefined

        const enhanced = await enhanceExperienceWithAI(experience, jobDescription)
        return json({ experience: enhanced })
      }

      case "adapt-cv": {
        if (!payload?.cv || typeof payload.jobDescription !== "string") {
          return json({ error: "CV data and job description are required." }, { status: 400 })
        }

        const cv = cvSchema.parse(payload.cv)
        const adapted = await adaptCVWithAI(cv, payload.jobDescription)
        return json({ cv: adapted })
      }

      case "import-cv": {
        const text = typeof payload?.text === "string" ? payload.text : ""

        if (!text.trim()) {
          return json({ error: "Resume text is required for AI import." }, { status: 400 })
        }

        try {
          const structured = await importCVWithAI(text)
          return json({ cv: structured })
        } catch (error) {
          console.error("/api/ai import-cv error", error)
          return json({ error: "AI could not structure that resume yet." }, { status: 422 })
        }
      }

      case "optimize-ats": {
        if (!payload?.cv) {
          return json({ error: "CV data is required for ATS optimization." }, { status: 400 })
        }

        try {
          const cv = cvSchema.parse(payload.cv)
          const optimized = await optimizeCVForATS(cv)
          return json({ cv: optimized })
        } catch (error) {
          console.error("/api/ai optimize-ats error", error)
          return json({ error: "Failed to optimize CV for ATS." }, { status: 422 })
        }
      }

      default:
        return json({ error: "Unsupported AI action." }, { status: 400 })
    }
  } catch (error) {
    console.error("/api/ai error", error)
    return json({ error: "AI request failed." }, { status: 500 })
  }
}
