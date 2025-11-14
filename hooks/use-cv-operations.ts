import { toast } from "sonner"
import { UseFormReturn } from "react-hook-form"
import {
    mockAdaptCV,
    mockEnhanceExperience,
    mockOptimizeCVForATS,
} from "@/lib/ai/mock"
import type { CVData, ExperienceItem } from "@/lib/cv"

type AIResult<TData> = {
  data?: TData
  fallback: boolean
  error?: string
}

type RequestAI = <TData>(action: string, payload: unknown) => Promise<AIResult<TData>>

export function useCVOperations(
  form: UseFormReturn<CVData>,
  requestAI: RequestAI,
  setIsEnhancingSummary: (value: boolean) => void,
  setExperienceLoading: (value: string | null) => void,
  setIsAdapting: (value: boolean) => void,
) {
  const handleSummaryEnhance = async () => {
    const toastId = toast.loading("Optimizing your CV for ATS (Applicant Tracking Systems)...")
    
    try {
      setIsEnhancingSummary(true)
      const currentCV = form.getValues()
      
      const { data, fallback, error: aiError } = await requestAI<{ cv: CVData }>("optimize-ats", {
        cv: currentCV,
      })

      let optimized = data?.cv
      let usedFallback = fallback

      if (!optimized) {
        optimized = await mockOptimizeCVForATS(currentCV)
        usedFallback = true
      }

      form.reset(optimized)
      toast.success(
        usedFallback 
          ? "CV optimized for ATS (fallback mode) - Added action verbs, keywords, and metrics!" 
          : "CV optimized for ATS with Gemini - Now ATS-friendly with strong keywords and impact statements!",
        { id: toastId }
      )
      if (usedFallback && aiError) {
        toast.info(aiError)
      }
    } catch (error) {
      toast.error("ATS optimization is unavailable right now.", { id: toastId })
    } finally {
      setIsEnhancingSummary(false)
    }
  }

  const handleExperienceEnhance = async (index: number, jobDescription: string) => {
    try {
      const item = form.getValues(`experience.${index}`)
      setExperienceLoading(item.id)
      const { data, fallback, error: aiError } = await requestAI<{ experience: ExperienceItem }>("enhance-experience", {
        experience: item,
        jobDescription,
      })

      let enhanced = data?.experience
      let usedFallback = fallback

      if (!enhanced) {
        enhanced = await mockEnhanceExperience(item, jobDescription)
        usedFallback = true
      }

      form.setValue(`experience.${index}`, enhanced, { shouldDirty: true })
      toast.success(usedFallback ? "Experience bullets refreshed (fallback mode)." : "Experience bullets refreshed with Gemini.")
      if (usedFallback && aiError) {
        toast.info(aiError)
      }
    } catch (error) {
      toast.error("Could not enhance that role. Try again in a moment.")
    } finally {
      setExperienceLoading(null)
    }
  }

  const handleAdapt = async (jobDescription: string) => {
    if (!jobDescription.trim()) {
      toast.info("Paste a job description so we can tailor your CV.")
      return
    }

    try {
      setIsAdapting(true)
      const currentCV = form.getValues()
      const { data, fallback, error: aiError } = await requestAI<{ cv: CVData }>("adapt-cv", {
        cv: currentCV,
        jobDescription,
      })

      let adapted = data?.cv
      let usedFallback = fallback

      if (!adapted) {
        adapted = await mockAdaptCV(currentCV, jobDescription)
        usedFallback = true
      }

      form.reset(adapted)
      toast.success(usedFallback ? "CV aligned using fallback AI." : "CV aligned with Gemini insights.")
      if (usedFallback && aiError) {
        toast.info(aiError)
      }
    } catch (error) {
      toast.error("Could not adapt to that job description. Please retry.")
    } finally {
      setIsAdapting(false)
    }
  }

  return {
    handleSummaryEnhance,
    handleExperienceEnhance,
    handleAdapt,
  }
}
