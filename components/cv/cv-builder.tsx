"use client"

import { useMemo, useRef, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { toast } from "sonner"
import { useFieldArray, useForm, type Resolver } from "react-hook-form"

import {
    mockAdaptCV,
    mockEnhanceExperience,
    mockEnhancePhoto,
    mockEnhanceSummary,
    mockImportCV,
    type MockImportResult,
} from "@/lib/ai/mock"
import {
    cvSchema,
    defaultCV,
    type CVData,
    type ExperienceItem
} from "@/lib/cv"
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
  const [isDownloading, setIsDownloading] = useState(false)
  const [isEnhancingPhoto, setIsEnhancingPhoto] = useState(false)

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
    try {
      setIsEnhancingSummary(true)
      const current = form.getValues("personal.summary")
      const { data, fallback, error: aiError } = await requestAI<{ summary: string }>("enhance-summary", {
        summary: current,
        context: summaryContext,
      })

      let enhanced = data?.summary?.trim()
      let usedFallback = fallback

      if (!enhanced) {
        enhanced = await mockEnhanceSummary(current, summaryContext)
        usedFallback = true
      }

      form.setValue("personal.summary", enhanced, { shouldDirty: true })
      toast.success(usedFallback ? "Summary polished (fallback mode)." : "Summary polished with Gemini.")
      if (usedFallback && aiError) {
        toast.info(aiError)
      }
    } catch (error) {
      toast.error("Summary enhancement is unavailable right now.")
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

  const handleDownload = form.handleSubmit(async (values) => {
    try {
      setIsDownloading(true)
      const response = await fetch("/api/export", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ cv: values }),
      })

      if (!response.ok) {
        throw new Error("Failed to generate PDF")
      }

      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const anchor = document.createElement("a")
      anchor.href = url
      anchor.download = `${values.personal.fullName.replace(/\s+/g, "-")}-CV.pdf`
      anchor.click()
      URL.revokeObjectURL(url)
      toast.success("PDF downloaded. Ready to send.")
    } catch (error) {
      toast.error("Export failed. Please try again shortly.")
    } finally {
      setIsDownloading(false)
    }
  })

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
      const enhanced = await mockEnhancePhoto(photoFile)
      setPhotoPreview(enhanced)
      toast.success("Photo retouched for professional polish.")
    } catch (error) {
      toast.error("Photo enhancement service is busy. Try again shortly.")
    } finally {
      setIsEnhancingPhoto(false)
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
              Import past resumes, polish them with AI, and tailor to dream roles in minutes.
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
            onDownload={handleDownload}
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
