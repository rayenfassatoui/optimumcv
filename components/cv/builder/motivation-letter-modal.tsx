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
import { Download, Edit2, Loader2 } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ScrollArea } from "@/components/ui/scroll-area"

type MotivationLetterModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onGenerate: (jobPosition: string) => Promise<string>
  fullName: string
}

export function MotivationLetterModal({ 
  open, 
  onOpenChange, 
  onGenerate,
  fullName 
}: MotivationLetterModalProps) {
  const [jobPosition, setJobPosition] = useState("")
  const [generatedLetter, setGeneratedLetter] = useState("")
  const [editedLetter, setEditedLetter] = useState("")
  const [isGenerating, setIsGenerating] = useState(false)
  const [activeTab, setActiveTab] = useState<"input" | "preview">("input")

  const handleGenerate = async () => {
    if (!jobPosition.trim()) return

    try {
      setIsGenerating(true)
      const letter = await onGenerate(jobPosition)
      setGeneratedLetter(letter)
      setEditedLetter(letter)
      setActiveTab("preview")
    } catch (error) {
      console.error("Failed to generate motivation letter:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  const handleDownload = async () => {
    const letterContent = editedLetter || generatedLetter
    
    // Dynamic import to avoid SSR issues
    const { jsPDF } = await import("jspdf")
    
    const doc = new jsPDF({
      orientation: "portrait",
      unit: "mm",
      format: "a4",
    })

    // Set font and styling
    doc.setFont("helvetica")
    doc.setFontSize(11)
    
    // Add content with proper margins and line breaks
    const pageWidth = doc.internal.pageSize.getWidth()
    const pageHeight = doc.internal.pageSize.getHeight()
    const margin = 20
    const maxLineWidth = pageWidth - 2 * margin
    const lineHeight = 7
    
    // Split content into lines that fit the page width
    const lines = doc.splitTextToSize(letterContent, maxLineWidth)
    
    let cursorY = margin
    
    lines.forEach((line: string) => {
      // Check if we need a new page
      if (cursorY + lineHeight > pageHeight - margin) {
        doc.addPage()
        cursorY = margin
      }
      
      doc.text(line, margin, cursorY)
      cursorY += lineHeight
    })
    
    // Save the PDF
    doc.save(`${fullName.replace(/\s+/g, "_")}_Motivation_Letter.pdf`)
  }

  const handleClose = () => {
    setJobPosition("")
    setGeneratedLetter("")
    setEditedLetter("")
    setActiveTab("input")
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[700px] max-h-[85vh]">
        <DialogHeader>
          <DialogTitle>Generate Motivation Letter</DialogTitle>
          <DialogDescription>
            Enter the job position or details to generate a personalized motivation letter.
          </DialogDescription>
        </DialogHeader>
        
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as "input" | "preview")} className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="input">Job Details</TabsTrigger>
            <TabsTrigger value="preview" disabled={!generatedLetter}>
              Preview & Edit
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="input" className="space-y-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="job-position">Job Position / Description</Label>
              <ScrollArea className="h-[300px] rounded-md border">
                <Textarea
                  id="job-position"
                  placeholder="Enter the job title, company name, and key details about the position..."
                  value={jobPosition}
                  onChange={(e) => setJobPosition(e.target.value)}
                  className="min-h-[280px] resize-none border-0 focus-visible:ring-0 p-4"
                />
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Cancel
              </Button>
              <Button 
                onClick={handleGenerate} 
                disabled={!jobPosition.trim() || isGenerating}
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="mr-2 size-4 animate-spin" />
                    Generating...
                  </>
                ) : (
                  "Generate Letter"
                )}
              </Button>
            </DialogFooter>
          </TabsContent>
          
          <TabsContent value="preview" className="space-y-4 py-4">
            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="letter-preview">Your Motivation Letter</Label>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setEditedLetter(generatedLetter)}
                >
                  <Edit2 className="mr-2 size-4" />
                  Reset
                </Button>
              </div>
              <ScrollArea className="h-[400px] rounded-md border p-4">
                <Textarea
                  id="letter-preview"
                  value={editedLetter}
                  onChange={(e) => setEditedLetter(e.target.value)}
                  rows={20}
                  className="min-h-[380px] resize-none border-0 focus-visible:ring-0"
                />
              </ScrollArea>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={handleClose}>
                Close
              </Button>
              <Button onClick={handleDownload}>
                <Download className="mr-2 size-4" />
                Download
              </Button>
            </DialogFooter>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
