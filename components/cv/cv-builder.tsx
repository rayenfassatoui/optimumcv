"use client"

import { useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useFieldArray, useForm, type Resolver } from "react-hook-form"

import {
  mockAdaptCV,
  mockEnhanceExperience, mockImportCV,
  mockOptimizeCVForATS,
  type MockImportResult
} from "@/lib/ai/mock"
import {
  cvSchema,
  defaultCV,
  type CVData,
  type ExperienceItem
} from "@/lib/cv"
import { generateHarvardStylePDF } from "@/lib/pdf-generator"
import { CVPreview } from "@/components/cv/cv-preview"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Form } from "@/components/ui/form"

import { ActionBar } from "@/components/cv/builder/action-bar"
import { CVPreviewPanel } from "@/components/cv/builder/cv-preview-panel"
import { EducationSection } from "@/components/cv/builder/education-section"
import { ExperienceSection } from "@/components/cv/builder/experience-section"
import { FormTabs } from "@/components/cv/builder/form-tabs"
import { ImportPanel } from "@/components/cv/builder/import-panel"
import { JobInsights } from "@/components/cv/builder/job-insights"
import { PersonalSection } from "@/components/cv/builder/personal-section"
import { ProjectsSection } from "@/components/cv/builder/projects-section"
import { SkillsSection } from "@/components/cv/builder/skills-section"

type AIResult<TData> = {
  data?: TData
  fallback: boolean
  error?: string
}

const jobHints = [
  "Product Designer · SaaS",
  "Growth Marketer · Series B",
  "Senior Frontend Engineer · EMEA",
]

export function CVBuilder() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const [rawImport, setRawImport] = useState("")
  const [jobDescription, setJobDescription] = useState("")
  const [isImporting, setIsImporting] = useState(false)
  const [isEnhancingSummary, setIsEnhancingSummary] = useState(false)
  const [experienceLoading, setExperienceLoading] = useState<string | null>(null)
  const [isAdapting, setIsAdapting] = useState(false)
  const [isEnhancingPhoto, setIsEnhancingPhoto] = useState(false)
  const [isDownloading, setIsDownloading] = useState(false)

  const photoInputRef = useRef<HTMLInputElement | null>(null)
  const resumeInputRef = useRef<HTMLInputElement | null>(null)

  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema) as Resolver<CVData>,
    defaultValues: defaultCV(),
    mode: "onChange",
  })

  const experience = useFieldArray({ control: form.control, name: "experience", keyName: "fieldId" })
  const education = useFieldArray({ control: form.control, name: "education", keyName: "fieldId" })
  const projects = useFieldArray({ control: form.control, name: "projects", keyName: "fieldId" })

  const cv = form.watch()

  const summaryContext = useMemo(() => {
    if (jobDescription.trim()) {
      return "job description"
    }
    return cv.personal.title
  }, [jobDescription, cv.personal.title])

  const requestAI = async <TData,>(action: string, payload: unknown): Promise<AIResult<TData>> => {
    try {
      const response = await fetch("/api/ai", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({ action, payload }),
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

  const enhanceLabel = "AI Enhance"

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
          // Dynamic import to avoid SSR issues with pdfjs-dist
          const { extractTextFromFile } = await import("@/lib/pdf-parser")
          
          // Extract text from PDF or other file formats
          aiSource = await extractTextFromFile(sourceFile)
          console.log("[CV Builder] Extracted text length:", aiSource.length)
          console.log("[CV Builder] First 500 chars:", aiSource.slice(0, 500))
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

      const loadingId = toast.loading("Structuring resume with Gemini…")
      const aiResult = await requestAI<{ cv: CVData }>("import-cv", { text: aiSource })
      toast.dismiss(loadingId)

      if (aiResult.data?.cv) {
        form.reset(aiResult.data.cv)
        toast.success("CV imported with Gemini.")
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

  const handleExperienceEnhance = async (index: number) => {
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

  const handleAdapt = async () => {
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

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    console.log("[Photo Upload] Event triggered", event)
    const file = event.target.files?.[0]
    console.log("[Photo Upload] Selected file:", file)
    if (!file) {
      console.log("[Photo Upload] No file selected")
      return
    }
    setPhotoFile(file)
    const url = URL.createObjectURL(file)
    console.log("[Photo Upload] Preview URL created:", url)
    setPhotoPreview(url)
    toast.success(`Photo uploaded: ${file.name}`)
  }

  const handleResumeChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setResumeFile(file)
    await handleImportCV({ file })
  }

  const handleEnhancePhoto = async () => {
    if (!photoFile) {
      toast.info("Upload a profile photo to enhance.")
      return
    }

    try {
      setIsEnhancingPhoto(true)
      toast.info("Enhancing your photo with professional filters...")

      // Apply browser-side professional enhancement
      const enhanced = await applyProfessionalPhotoFilters(photoFile)
      setPhotoPreview(enhanced)
      toast.success("Photo enhanced! Applied professional brightness, contrast, and color adjustments.")
    } catch (error) {
      console.error("[Photo Enhancement] Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to enhance photo"
      toast.error(errorMessage)
    } finally {
      setIsEnhancingPhoto(false)
    }
  }

  const applyProfessionalPhotoFilters = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error("Canvas not supported"))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        
        // Apply professional enhancement filters
        // Increase brightness slightly, boost contrast, reduce saturation for corporate look
        ctx.filter = 'brightness(1.1) contrast(1.2) saturate(0.85)'
        ctx.drawImage(img, 0, 0)
        
        // Reset filter
        ctx.filter = 'none'
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            reject(new Error("Failed to create enhanced image"))
          }
        }, 'image/png', 0.95)
      }
      
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleDownloadCV = async () => {
    const toastId = toast.loading("Generating your Harvard-style CV PDF...")
    
    try {
      setIsDownloading(true)
      const currentCV = form.getValues()
      const fileName = `${currentCV.personal.fullName.replace(/\s+/g, '_')}_CV_Harvard.pdf`
      
      // Generate PDF with Harvard template
      generateHarvardStylePDF(currentCV, photoPreview, fileName)
      
      toast.success("CV downloaded successfully!", { id: toastId })
    } catch (error) {
      console.error("[Download CV] Error:", error)
      toast.error(error instanceof Error ? error.message : "Failed to download CV", { id: toastId })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur-xl">
      <CardHeader className="gap-6">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <Badge variant="outline" className="border-primary/40 bg-primary/10 text-primary">
              OptimumCV Workspace
            </Badge>
            <CardTitle className="text-2xl font-semibold">Build your adaptive CV</CardTitle>
            <CardDescription>
              Import resumes, optimize for ATS, adapt to jobs, and download professional PDFs.
            </CardDescription>
          </div>
          <ActionBar
            isImporting={isImporting}
            isEnhancingSummary={isEnhancingSummary}
            isAdapting={isAdapting}
            isDownloading={isDownloading}
            onImportClick={() => resumeInputRef.current?.click()}
            onEnhanceSummary={handleSummaryEnhance}
            onAdapt={handleAdapt}
            onDownload={handleDownloadCV}
          />
        </div>
      </CardHeader>
      <CardContent className="grid gap-10 lg:grid-cols-[420px_1fr]">
        <Form {...form}>
          <form className="space-y-8">
            <ImportPanel
              isImporting={isImporting}
              resumeFile={resumeFile}
              rawImport={rawImport}
              resumeInputRef={resumeInputRef}
              onRunImport={() => void handleImportCV()}
              onOpenFileDialog={() => resumeInputRef.current?.click()}
              onResumeChange={handleResumeChange}
              onRawImportChange={setRawImport}
            />
            <FormTabs
              personal={
                <PersonalSection
                  form={form}
                  summaryContext={summaryContext}
                  photoInputRef={photoInputRef}
                  isEnhancingPhoto={isEnhancingPhoto}
                  onPhotoChange={handlePhotoChange}
                  onEnhancePhoto={handleEnhancePhoto}
                />
              }
              experience={
                <ExperienceSection
                  form={form}
                  experience={experience}
                  experienceLoading={experienceLoading}
                  onEnhance={(index) => void handleExperienceEnhance(index)}
                  enhanceLabel={enhanceLabel}
                />
              }
              education={<EducationSection form={form} education={education} />}
              projects={<ProjectsSection form={form} projects={projects} />}
              skills={<SkillsSection form={form} />}
            />
          </form>
        </Form>

        <div>
          <CVPreviewPanel>
            <CVPreview data={cv} photo={photoPreview} />
          </CVPreviewPanel>
          <JobInsights jobDescription={jobDescription} jobHints={jobHints} onChange={setJobDescription} />
        </div>
      </CardContent>
    </Card>
  )
}
