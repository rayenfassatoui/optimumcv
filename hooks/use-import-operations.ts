import { useState, useRef, type RefObject } from "react"
import { toast } from "sonner"
import { UseFormReturn } from "react-hook-form"
import { mockImportCV, type MockImportResult } from "@/lib/ai/mock"
import type { CVData } from "@/lib/cv"
import { useAIConfig } from "@/contexts/ai-config-context"

type AIResult<TData> = {
  data?: TData
  fallback: boolean
  error?: string
}

type RequestAI = <TData>(action: string, payload: unknown) => Promise<AIResult<TData>>

export function useImportOperations(
  form: UseFormReturn<CVData>,
  requestAI: RequestAI,
) {
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [rawImport, setRawImport] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const resumeInputRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>
  const { config } = useAIConfig()

  const getAIProviderName = () => {
    if (config?.provider === "openrouter") {
      return config.model || "OpenRouter"
    }
    return "Gemini"
  }

  const handleImportCV = async ({ file }: { file?: File | null } = {}) => {
    const sourceFile = file ?? resumeFile
    if (!sourceFile && !rawImport.trim()) {
      toast.info("Upload a CV file or paste raw content to import.")
      return
    }

    try {
      setIsImporting(true)
      const { cv: importedCV, fallback, reason }: MockImportResult = await mockImportCV({
        file: sourceFile ?? undefined,
        text: rawImport || undefined,
      })

      if (!fallback) {
        form.reset(importedCV)
        toast.success("CV content imported and structured.")
        return
      }

      if (reason) {
        toast.info(reason)
      }

      let aiSource = rawImport
      if (!aiSource.trim() && sourceFile) {
        try {
          const { extractTextFromFile } = await import("@/lib/pdf-parser")
          aiSource = await extractTextFromFile(sourceFile)
        } catch (error) {
          console.error("[CV Builder] Failed to extract text:", error)
          toast.error(error instanceof Error ? error.message : "Could not read file")
          return
        }
      }

      if (!aiSource.trim()) {
        toast.warning("We couldn't read that resume yet. Try another format or paste text.")
        return
      }

      const loadingId = toast.loading(`Structuring resume with ${getAIProviderName()}…`)
      const aiResult = await requestAI<{ cv: CVData }>("import-cv", { text: aiSource })
      toast.dismiss(loadingId)

      if (aiResult.data?.cv) {
        form.reset(aiResult.data.cv)
        toast.success(`CV imported with ${getAIProviderName()}.`)
        if (aiResult.error) {
          toast.info(aiResult.error)
        }
        return
      }

      if (aiResult.error) {
        toast.info(aiResult.error)
      }
      toast.warning("AI could not structure that resume yet. Try refining the content or another format.")
    } catch (error) {
      toast.error("We could not read that CV. Try another format or paste plain text.")
    } finally {
      setIsImporting(false)
    }
  }

  const handleResumeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setResumeFile(file)
    await handleImportCV({ file })
  }

  return {
    resumeFile,
    rawImport,
    isImporting,
    resumeInputRef,
    setRawImport,
    handleImportCV,
    handleResumeChange,
  }
}
