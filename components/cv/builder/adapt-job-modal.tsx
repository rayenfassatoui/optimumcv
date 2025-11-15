"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { ScrollArea } from "@/components/ui/scroll-area"

type AdaptJobModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialValue?: string
  onSave: (jobDescription: string) => void
}

export function AdaptJobModal({ 
  open, 
  onOpenChange, 
  initialValue = "", 
  onSave 
}: AdaptJobModalProps) {
  const [jobPrompt, setJobPrompt] = useState(initialValue)

  const handleSave = () => {
    onSave(jobPrompt)
    onOpenChange(false)
  }

  const handleCancel = () => {
    setJobPrompt(initialValue)
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Only allow closing via Cancel/Save buttons
      if (!isOpen) return
    }}>
      <DialogContent 
        className="max-w-[95vw] sm:max-w-[600px] max-h-[90vh] overflow-y-auto"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle>Adapt to Job</DialogTitle>
          <DialogDescription className="text-sm">
            Enter the job description or title to automatically tailor your CV to match the role's requirements.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-2 sm:py-4">
          <div className="grid gap-2">
            <Label htmlFor="job-prompt">Job Description</Label>
            <ScrollArea className="h-[250px] sm:h-[300px] rounded-md border">
              <Textarea
                id="job-prompt"
                placeholder="Paste the full job description, or enter the job title and key requirements..."
                value={jobPrompt}
                onChange={(e) => setJobPrompt(e.target.value)}
                className="min-h-[230px] sm:min-h-[280px] resize-none border-0 focus-visible:ring-0 p-3 sm:p-4 text-sm"
              />
            </ScrollArea>
          </div>
        </div>
        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button variant="outline" onClick={handleCancel} className="w-full sm:w-auto">
            Cancel
          </Button>
          <Button onClick={handleSave} disabled={!jobPrompt.trim()} className="w-full sm:w-auto">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
