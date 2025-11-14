import { useState } from "react"
import { toast } from "sonner"
import { UseFormReturn } from "react-hook-form"
import type { CVData } from "@/lib/cv"

type AIResult<TData> = {
  data?: TData
  fallback: boolean
  error?: string
}

type RequestAI = <TData>(action: string, payload: unknown) => Promise<AIResult<TData>>

type InternshipAnalysisResponse = {
  subjects: Array<{
    subject: string
    explanation: string
  }>
  companyEmail: string | null
  companyName: string | null
}

type InternshipEmails = {
  applicantEmail: string
  companyEmail: string
}

export function useModalOperations(
  form: UseFormReturn<CVData>,
  requestAI: RequestAI,
) {
  const [showAdaptJobModal, setShowAdaptJobModal] = useState(false)
  const [showMotivationLetterModal, setShowMotivationLetterModal] = useState(false)
  const [showInternshipModal, setShowInternshipModal] = useState(false)
  const [jobDescription, setJobDescription] = useState("")

  const handleGenerateMotivationLetter = async (jobPosition: string): Promise<string> => {
    const currentCV = form.getValues()
    
    try {
      const { data, error: aiError } = await requestAI<{ letter: string }>("generate-motivation-letter", {
        cv: currentCV,
        jobPosition,
      })

      if (data?.letter) {
        toast.success("Motivation letter generated successfully!")
        return data.letter
      }

      if (aiError) {
        toast.info(aiError)
      }
      
      throw new Error("Failed to generate motivation letter")
    } catch (error) {
      toast.error("Could not generate motivation letter. Please retry.")
      throw error
    }
  }

  const handleAnalyzeInternship = async (file: File): Promise<InternshipAnalysisResponse> => {
    const currentCV = form.getValues()
    
    try {
      const { extractTextFromFile } = await import("@/lib/pdf-parser")
      const internshipText = await extractTextFromFile(file)
      
      if (!internshipText.trim()) {
        throw new Error("Could not extract text from PDF")
      }

      sessionStorage.setItem('internshipText', internshipText)

      const { data, error: aiError } = await requestAI<InternshipAnalysisResponse>("analyze-internship", {
        cv: currentCV,
        internshipText,
      })

      if (data?.subjects && Array.isArray(data.subjects)) {
        return {
          subjects: data.subjects,
          companyEmail: data.companyEmail || null,
          companyName: data.companyName || null
        }
      }

      if (aiError) {
        toast.info(aiError)
      }
      
      throw new Error("Failed to analyze internship")
    } catch (error) {
      console.error("Internship analysis error:", error)
      throw error
    }
  }

  const handleGenerateInternshipEmails = async (selectedSubject: string): Promise<InternshipEmails> => {
    const currentCV = form.getValues()
    const internshipText = sessionStorage.getItem('internshipText')
    
    if (!internshipText) {
      throw new Error("Internship text not found. Please re-upload the PDF.")
    }
    
    try {
      const { data, error: aiError } = await requestAI<InternshipEmails>("generate-internship-emails", {
        cv: currentCV,
        internshipText,
        selectedSubject,
      })

      if (data?.applicantEmail && data?.companyEmail) {
        return data
      }

      if (aiError) {
        toast.info(aiError)
      }
      
      throw new Error("Failed to generate emails")
    } catch (error) {
      console.error("Email generation error:", error)
      throw error
    }
  }

  return {
    showAdaptJobModal,
    showMotivationLetterModal,
    showInternshipModal,
    jobDescription,
    setShowAdaptJobModal,
    setShowMotivationLetterModal,
    setShowInternshipModal,
    setJobDescription,
    handleGenerateMotivationLetter,
    handleAnalyzeInternship,
    handleGenerateInternshipEmails,
  }
}
