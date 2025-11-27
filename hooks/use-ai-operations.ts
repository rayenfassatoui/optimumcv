import { useState } from "react"
import { useAIConfig } from "@/contexts/ai-config-context"

type AIResult<TData> = {
  data?: TData
  fallback: boolean
  error?: string
}

export function useAIOperations() {
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false)
  const [experienceLoading, setExperienceLoading] = useState<string | null>(null)
  const [isAdapting, setIsAdapting] = useState(false)
  const { ensureConfig } = useAIConfig()

  const requestAI = async <TData,>(action: string, payload: unknown): Promise<AIResult<TData>> => {
    try {
      const config = await ensureConfig()
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ action, payload, config }),
      })

      if (response.ok) {
        const data = (await response.json()) as TData
        return { data, fallback: false }
      }

      let message: string | undefined
      try {
        const errorBody = (await response.json()) as { error?: string }
        message = typeof errorBody?.error === "string" ? errorBody.error : undefined
      } catch (error) {
        message = undefined
      }

      return {
        fallback: true,
        error: message ?? `AI request failed (${response.status})`,
      }
    } catch (error) {
      return {
        fallback: true,
        error: error instanceof Error ? error.message : "AI request failed",
      }
    }
  }

  return {
    isEnhancingSummary,
    setIsEnhancingSummary,
    experienceLoading,
    setExperienceLoading,
    isAdapting,
    setIsAdapting,
    requestAI,
  }
}
