"use client";

import { useMemo, useEffect } from "react";
import { toast } from "sonner";
import { mockAdaptCV } from "@/lib/ai/mock";
import type { CVData } from "@/lib/cv";
import { CVPreview } from "@/components/cv/cv-preview";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ActionBar } from "@/components/cv/builder/action-bar";
import { CVPreviewPanel } from "@/components/cv/builder/cv-preview-panel";
import { CVFormSections } from "@/components/cv/builder/cv-form-sections";
import { CVModals } from "@/components/cv/builder/cv-modals";
import { useCVForm } from "@/hooks/use-cv-form";
import { useAIOperations } from "@/hooks/use-ai-operations";
import { useCVOperations } from "@/hooks/use-cv-operations";
import { useImportOperations } from "@/hooks/use-import-operations";
import { usePhotoManagement } from "@/hooks/use-photo-management";
import { useModalOperations } from "@/hooks/use-modal-operations";
import { useDownloadOperations } from "@/hooks/use-download-operations";

export function CVBuilder() {
  // Form management
  const { form, experience, education, projects, cv } = useCVForm();

  // AI operations
  const {
    isEnhancingSummary,
    setIsEnhancingSummary,
    experienceLoading,
    setExperienceLoading,
    isAdapting,
    setIsAdapting,
    requestAI,
  } = useAIOperations();

  // CV operations
  const { handleSummaryEnhance, handleExperienceEnhance, handleAdapt } =
    useCVOperations(
      form,
      requestAI,
      setIsEnhancingSummary,
      setExperienceLoading,
      setIsAdapting
    );

  // Import operations
  const {
    resumeFile,
    rawImport,
    isImporting,
    resumeInputRef,
    setRawImport,
    handleImportCV,
    handleResumeChange,
  } = useImportOperations(form, requestAI);

  // Photo management
  const {
    photoPreview,
    showPhotoCropModal,
    pendingPhotoFile,
    photoInputRef,
    setShowPhotoCropModal,
    handlePhotoChange,
    handlePhotoCropSave,
  } = usePhotoManagement();

  // Modal operations
  const {
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
  } = useModalOperations(form, requestAI);

  // Download operations
  const { isDownloading, handleDownloadCV } = useDownloadOperations(
    form,
    photoPreview
  );

  useEffect(() => {
    const handler = (e: Event) => {
      void handleDownloadCV();
    };

    if (typeof window !== "undefined") {
      window.addEventListener("optimum-download", handler);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("optimum-download", handler);
      }
    };
  }, [handleDownloadCV]);

  // Computed values
  const summaryContext = useMemo(() => {
    if (jobDescription.trim()) {
      return "job description";
    }
    return cv.personal.title;
  }, [jobDescription, cv.personal.title]);

  const enhanceLabel = "AI Enhance";

  // Adapter for job modal save
  const handleAdaptJobModalSave = async (jobPrompt: string) => {
    setJobDescription(jobPrompt);

    try {
      setIsAdapting(true);
      const currentCV = form.getValues();
      const {
        data,
        fallback,
        error: aiError,
      } = await requestAI<{ cv: CVData }>("adapt-cv", {
        cv: currentCV,
        jobDescription: jobPrompt,
      });

      let adapted = data?.cv;
      let usedFallback = fallback;

      if (!adapted) {
        adapted = await mockAdaptCV(currentCV, jobPrompt);
        usedFallback = true;
      }

      form.reset(adapted);
      toast.success(
        usedFallback
          ? "CV aligned using fallback AI."
          : "CV aligned with Gemini insights."
      );
      if (usedFallback && aiError) {
        toast.info(aiError);
      }
    } catch (error) {
      toast.error("Could not adapt to that job description. Please retry.");
    } finally {
      setIsAdapting(false);
    }
  };

  return (
    <Card className="border-border/60 bg-background/80 backdrop-blur-xl">
      <CardHeader className="gap-0 px-0 py-0">
        <div className="grid gap-10 lg:grid-cols-[420px_1fr] px-6 py-0">
          <div className="space-y-1">
            <Badge
              variant="outline"
              className="border-primary/40 bg-primary/10 text-primary"
            >
              OptimumCV Workspace
            </Badge>
            <CardTitle className="text-2xl font-semibold">
              Build your adaptive CV
            </CardTitle>
            <CardDescription>
              Import resumes, optimize for ATS, adapt to jobs, and download
              professional PDFs.
            </CardDescription>
          </div>
          <div className="flex items-center justify-center">
            <ActionBar
              isImporting={isImporting}
              isEnhancingSummary={isEnhancingSummary}
              isAdapting={isAdapting}
              isDownloading={isDownloading}
              onImportClick={() => resumeInputRef.current?.click()}
              onEnhanceSummary={handleSummaryEnhance}
              onAdaptClick={() => setShowAdaptJobModal(true)}
              onMotivationLetterClick={() => setShowMotivationLetterModal(true)}
              onInternshipClick={() => setShowInternshipModal(true)}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="grid gap-10 lg:grid-cols-[420px_1fr] px-6 py-10">
        <CVFormSections
          form={form}
          experience={experience}
          education={education}
          projects={projects}
          summaryContext={summaryContext}
          photoInputRef={photoInputRef}
          onPhotoChange={handlePhotoChange}
          experienceLoading={experienceLoading}
          onExperienceEnhance={(index) =>
            void handleExperienceEnhance(index, jobDescription)
          }
          enhanceLabel={enhanceLabel}
          isImporting={isImporting}
          resumeFile={resumeFile}
          rawImport={rawImport}
          resumeInputRef={resumeInputRef}
          onRunImport={() => void handleImportCV()}
          onOpenFileDialog={() => resumeInputRef.current?.click()}
          onResumeChange={handleResumeChange}
          onRawImportChange={setRawImport}
        />

        <div>
          <CVPreviewPanel>
            <CVPreview data={cv} photo={photoPreview} />
          </CVPreviewPanel>
        </div>
      </CardContent>

      <CVModals
        showAdaptJobModal={showAdaptJobModal}
        showMotivationLetterModal={showMotivationLetterModal}
        showPhotoCropModal={showPhotoCropModal}
        showInternshipModal={showInternshipModal}
        jobDescription={jobDescription}
        pendingPhotoFile={pendingPhotoFile}
        fullName={cv.personal.fullName}
        onAdaptJobModalChange={setShowAdaptJobModal}
        onMotivationLetterModalChange={setShowMotivationLetterModal}
        onPhotoCropModalChange={setShowPhotoCropModal}
        onInternshipModalChange={setShowInternshipModal}
        onAdaptJobSave={handleAdaptJobModalSave}
        onGenerateMotivationLetter={handleGenerateMotivationLetter}
        onPhotoCropSave={handlePhotoCropSave}
        onAnalyzeInternship={handleAnalyzeInternship}
        onGenerateInternshipEmails={handleGenerateInternshipEmails}
      />
    </Card>
  );
}
