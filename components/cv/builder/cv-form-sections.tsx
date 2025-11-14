"use client"

import { Form } from "@/components/ui/form"
import { FormTabs } from "@/components/cv/builder/form-tabs"
import { ImportPanel } from "@/components/cv/builder/import-panel"
import { PersonalSection } from "@/components/cv/builder/personal-section"
import { ExperienceSection } from "@/components/cv/builder/experience-section"
import { EducationSection } from "@/components/cv/builder/education-section"
import { ProjectsSection } from "@/components/cv/builder/projects-section"
import { SkillsSection } from "@/components/cv/builder/skills-section"
import type { UseFormReturn } from "react-hook-form"
import type { UseFieldArrayReturn } from "react-hook-form"
import type { CVData } from "@/lib/cv"

type CVFormSectionsProps = {
  form: UseFormReturn<CVData>
  experience: UseFieldArrayReturn<CVData, "experience", "fieldId">
  education: UseFieldArrayReturn<CVData, "education", "fieldId">
  projects: UseFieldArrayReturn<CVData, "projects", "fieldId">
  summaryContext: string
  photoInputRef: React.RefObject<HTMLInputElement>
  isEnhancingPhoto: boolean
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onEnhancePhoto: () => void
  experienceLoading: string | null
  onExperienceEnhance: (index: number) => void
  enhanceLabel: string
  isImporting: boolean
  resumeFile: File | null
  rawImport: string
  resumeInputRef: React.RefObject<HTMLInputElement>
  onRunImport: () => void
  onOpenFileDialog: () => void
  onResumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRawImportChange: (value: string) => void
}

export function CVFormSections({
  form,
  experience,
  education,
  projects,
  summaryContext,
  photoInputRef,
  isEnhancingPhoto,
  onPhotoChange,
  onEnhancePhoto,
  experienceLoading,
  onExperienceEnhance,
  enhanceLabel,
  isImporting,
  resumeFile,
  rawImport,
  resumeInputRef,
  onRunImport,
  onOpenFileDialog,
  onResumeChange,
  onRawImportChange,
}: CVFormSectionsProps) {
  return (
    <Form {...form}>
      <form className="space-y-8">
        <ImportPanel
          isImporting={isImporting}
          resumeFile={resumeFile}
          rawImport={rawImport}
          resumeInputRef={resumeInputRef}
          onRunImport={onRunImport}
          onOpenFileDialog={onOpenFileDialog}
          onResumeChange={onResumeChange}
          onRawImportChange={onRawImportChange}
        />
        <FormTabs
          personal={
            <PersonalSection
              form={form}
              summaryContext={summaryContext}
              photoInputRef={photoInputRef}
              isEnhancingPhoto={isEnhancingPhoto}
              onPhotoChange={onPhotoChange}
              onEnhancePhoto={onEnhancePhoto}
            />
          }
          experience={
            <ExperienceSection
              form={form}
              experience={experience}
              experienceLoading={experienceLoading}
              onEnhance={onExperienceEnhance}
              enhanceLabel={enhanceLabel}
            />
          }
          education={<EducationSection form={form} education={education} />}
          projects={<ProjectsSection form={form} projects={projects} />}
          skills={<SkillsSection form={form} />}
        />
      </form>
    </Form>
  )
}
