"use client"

import { BriefcaseBusiness, Download, FileDown, Sparkles } from "lucide-react"

import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"

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
    <div className="flex flex-wrap items-center gap-2">
      <Button variant="outline" size="sm" onClick={onImportClick} disabled={isImporting}>
        <FileDown className={cn("size-4", isImporting && "animate-spin")} /> Import CV
      </Button>
      <Button variant="outline" size="sm" onClick={onEnhanceSummary} disabled={isEnhancingSummary}>
        <Sparkles className={cn("size-4", isEnhancingSummary && "animate-spin")} />
        AI Enhance
      </Button>
      <Button variant="outline" size="sm" onClick={onAdapt} disabled={isAdapting}>
        <BriefcaseBusiness className={cn("size-4", isAdapting && "animate-pulse")} />
        Adapt to Job
      </Button>
      <Button onClick={onDownload} disabled={isDownloading}>
        <Download className={cn("size-4", isDownloading && "animate-spin")} />
        Download PDF
      </Button>
      <ModeToggle />
    </div>
  )
}
