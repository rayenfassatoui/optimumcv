import { useState } from "react"
import { toast } from "sonner"
import { UseFormReturn } from "react-hook-form"
import { generateHarvardStylePDF } from "@/lib/pdf-generator"
import type { CVData } from "@/lib/cv"

export function useDownloadOperations(
  form: UseFormReturn<CVData>,
  photoPreview: string | null,
) {
  const [isDownloading, setIsDownloading] = useState(false)

  const handleDownloadCV = async () => {
    const toastId = toast.loading("Generating your Harvard-style CV PDF...")
    
    try {
      setIsDownloading(true)
      const currentCV = form.getValues()
      const fileName = `${currentCV.personal.fullName.replace(/\s+/g, '_')}_CV_Harvard.pdf`
      
      generateHarvardStylePDF(currentCV, photoPreview, fileName)
      
      toast.success("CV downloaded successfully!", { id: toastId })
    } catch (error) {
      console.error("[Download CV] Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to download CV", { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  return {
    isDownloading,
    handleDownloadCV,
  }
}
