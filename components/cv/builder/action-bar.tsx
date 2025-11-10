"use client"

import { BriefcaseBusiness, Download, FileDown, Github, Sparkles } from "lucide-react"

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
  onAdapt: () => void
  onDownload: () => void
}

export function ActionBar({
  isImporting,
  isEnhancingSummary,
  isAdapting,
  isDownloading,
  onImportClick,
  onEnhanceSummary,
  onAdapt,
  onDownload,
}: ActionBarProps) {
  return (
    <TooltipProvider>
      <div className="flex flex-wrap items-center gap-2">
        <Button variant="outline" size="sm" onClick={onImportClick} disabled={isImporting}>
          <FileDown className={cn("size-4", isImporting && "animate-spin")} /> Import CV
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button variant="outline" size="sm" onClick={onEnhanceSummary} disabled={isEnhancingSummary}>
              <Sparkles className={cn("size-4", isEnhancingSummary && "animate-spin")} />
              ATS Optimize
            </Button>
          </TooltipTrigger>
          <TooltipContent className="max-w-xs">
            <p className="font-semibold mb-1">Optimize for Applicant Tracking Systems</p>
            <p className="text-xs">Adds action verbs, keywords, metrics, and ATS-friendly formatting to help your CV pass automated screening.</p>
          </TooltipContent>
        </Tooltip>

        <Button variant="outline" size="sm" onClick={onAdapt} disabled={isAdapting}>
          <BriefcaseBusiness className={cn("size-4", isAdapting && "animate-pulse")} />
          Adapt to Job
        </Button>
        <Button variant="default" size="sm" onClick={onDownload} disabled={isDownloading}>
          <Download className={cn("size-4", isDownloading && "animate-bounce")} />
          Download PDF
        </Button>
        
        <Tooltip>
          <TooltipTrigger asChild>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => window.open("https://github.com/rayenfassatoui/optimumcv", "_blank")}
            >
              <Github className="size-4" />
              Star on GitHub
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p className="text-xs">View source code and give us a ⭐</p>
          </TooltipContent>
        </Tooltip>
        
        <ModeToggle />
      </div>
    </TooltipProvider>
  )
}
