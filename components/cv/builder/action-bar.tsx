"use client"

import { BriefcaseBusiness, Download, FileDown, Github, Mail, Sparkles, Briefcase } from "lucide-react"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip"

type ActionBarProps = {
  isImporting: boolean
  isEnhancingSummary: boolean
  isAdapting: boolean
  isDownloading: boolean
  onImportClick: () => void
  onEnhanceSummary: () => void
  onAdaptClick: () => void
  onMotivationLetterClick: () => void
  onInternshipClick: () => void
  onDownload: () => void
}

export function ActionBar({
  isImporting,
  isEnhancingSummary,
  isAdapting,
  isDownloading,
  onImportClick,
  onEnhanceSummary,
  onAdaptClick,
  onMotivationLetterClick,
  onInternshipClick,
  onDownload,
}: ActionBarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onImportClick} disabled={isImporting}>
              <FileDown className={cn("size-4", isImporting && "animate-spin")} />
              <span className="hidden sm:inline ml-2">Import CV</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Upload your existing CV/resume (PDF or text) to auto-fill all fields</p>
          </TooltipContent>
        </Tooltip>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onEnhanceSummary} disabled={isEnhancingSummary}>
              <Sparkles className={cn("size-4", isEnhancingSummary && "animate-spin")} />
              <span className="hidden sm:inline ml-2">ATS Optimize</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold mb-1">Optimize for Applicant Tracking Systems</p>
            <p className="text-xs">Adds action verbs, keywords, metrics, and ATS-friendly formatting to help your CV pass automated screening.</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onAdaptClick} disabled={isAdapting}>
              <BriefcaseBusiness className={cn("size-4", isAdapting && "animate-pulse")} />
              <span className="hidden sm:inline ml-2">Adapt to Job</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">Paste a job description to automatically tailor your CV to match the role's requirements</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onMotivationLetterClick}>
              <Mail className="size-4" />
              <span className="hidden sm:inline ml-2">Motivation Letter</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">Generate a personalized motivation letter for your job application</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onInternshipClick}>
              <Briefcase className="size-4" />
              <span className="hidden sm:inline ml-2">Internship PDF</span>
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="text-xs">Upload internship offer and get AI-generated subject suggestions and professional emails</p>
          </TooltipContent>
        </Tooltip>
        
        <Button variant="default" size="sm" onClick={onDownload} disabled={isDownloading}>
          <Download className={cn("size-4", isDownloading && "animate-bounce")} />
          <span className="hidden sm:inline ml-2">Download PDF</span>
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="icon"
              onClick={() => window.open("https://github.com/rayenfassatoui/optimumcv", "_blank")}
            >
              <Github className="size-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">Star on GitHub ⭐</p>
          </TooltipContent>
        </Tooltip>
        
        <ModeToggle />
      </div>
    </TooltipProvider>
  )
}
