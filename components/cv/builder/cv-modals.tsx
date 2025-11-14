"use client"

import { AdaptJobModal } from "@/components/cv/builder/adapt-job-modal"
import { MotivationLetterModal } from "@/components/cv/builder/motivation-letter-modal"
import { PhotoCropModal } from "@/components/cv/builder/photo-crop-modal"
import { InternshipModal } from "@/components/cv/builder/internship-modal"

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

type CVModalsProps = {
  showAdaptJobModal: boolean
  showMotivationLetterModal: boolean
  showPhotoCropModal: boolean
  showInternshipModal: boolean
  jobDescription: string
  pendingPhotoFile: File | null
  fullName: string
  onAdaptJobModalChange: (open: boolean) => void
  onMotivationLetterModalChange: (open: boolean) => void
  onPhotoCropModalChange: (open: boolean) => void
  onInternshipModalChange: (open: boolean) => void
  onAdaptJobSave: (jobPrompt: string) => Promise<void>
  onGenerateMotivationLetter: (jobPosition: string) => Promise<string>
  onPhotoCropSave: (croppedImageUrl: string) => void
  onAnalyzeInternship: (file: File) => Promise<InternshipAnalysisResponse>
  onGenerateInternshipEmails: (selectedSubject: string) => Promise<InternshipEmails>
}

export function CVModals({
  showAdaptJobModal,
  showMotivationLetterModal,
  showPhotoCropModal,
  showInternshipModal,
  jobDescription,
  pendingPhotoFile,
  fullName,
  onAdaptJobModalChange,
  onMotivationLetterModalChange,
  onPhotoCropModalChange,
  onInternshipModalChange,
  onAdaptJobSave,
  onGenerateMotivationLetter,
  onPhotoCropSave,
  onAnalyzeInternship,
  onGenerateInternshipEmails,
}: CVModalsProps) {
  return (
    <>
      <AdaptJobModal
        open={showAdaptJobModal}
        onOpenChange={onAdaptJobModalChange}
        initialValue={jobDescription}
        onSave={onAdaptJobSave}
      />

      <MotivationLetterModal
        open={showMotivationLetterModal}
        onOpenChange={onMotivationLetterModalChange}
        onGenerate={onGenerateMotivationLetter}
        fullName={fullName}
      />

      <PhotoCropModal
        open={showPhotoCropModal}
        onOpenChange={onPhotoCropModalChange}
        imageFile={pendingPhotoFile}
        onSave={onPhotoCropSave}
      />

      <InternshipModal
        open={showInternshipModal}
        onOpenChange={onInternshipModalChange}
        onAnalyze={onAnalyzeInternship}
        onGenerateEmails={onGenerateInternshipEmails}
        fullName={fullName}
      />
    </>
  )
}
