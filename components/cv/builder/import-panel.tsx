"use client"

import { RefObject } from "react"
import { Upload } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type ImportPanelProps = {
  isImporting: boolean
  resumeFile: File | null
  rawImport: string
  resumeInputRef: RefObject<HTMLInputElement | null>
  onRunImport: () => void
  onOpenFileDialog: () => void
  onResumeChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onRawImportChange: (value: string) => void
}

export function ImportPanel({
  isImporting,
  resumeFile,
  rawImport,
  resumeInputRef,
  onRunImport,
  onOpenFileDialog,
  onResumeChange,
  onRawImportChange,
}: ImportPanelProps) {
  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Import existing CV</p>
          <p className="text-xs text-muted-foreground">
            Upload a resume or paste raw content to auto-fill every section.
          </p>
        </div>
        <Button type="button" variant="outline" size="sm" onClick={onRunImport} disabled={isImporting}>
          {isImporting ? "Importing…" : "Run import"}
        </Button>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Button type="button" variant="secondary" size="sm" onClick={onOpenFileDialog} disabled={isImporting}>
          <Upload className="size-4" /> Upload resume
        </Button>
        {resumeFile && <span className="truncate text-xs text-muted-foreground">{resumeFile.name}</span>}
        <input
          ref={resumeInputRef}
          type="file"
          accept=".pdf,.doc,.docx,.txt,.json"
          className="hidden"
          onChange={onResumeChange}
        />
      </div>
      <Textarea
        rows={4}
        placeholder="Paste raw resume content or JSON."
        value={rawImport}
        onChange={(event) => onRawImportChange(event.target.value)}
      />
    </div>
  )
}
