"use client"

import { useState, useRef } from "react"
import { Upload, FileText, Mail, Building2, Loader2, Check, Sparkles } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"

type InternshipSubject = {
  subject: string
  explanation: string
}

type InternshipEmails = {
  applicantEmail: string
  companyEmail: string
}

type InternshipAnalysisResponse = {
  subjects: InternshipSubject[]
  companyEmail: string | null
  companyName: string | null
}

type InternshipModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  onAnalyze: (file: File) => Promise<InternshipAnalysisResponse>
  onGenerateEmails: (subject: string) => Promise<InternshipEmails>
  fullName: string
}

export function InternshipModal({
  open,
  onOpenChange,
  onAnalyze,
  onGenerateEmails,
  fullName,
}: InternshipModalProps) {
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [isGeneratingEmails, setIsGeneratingEmails] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [subjects, setSubjects] = useState<InternshipSubject[]>([])
  const [selectedSubject, setSelectedSubject] = useState<string | null>(null)
  const [emails, setEmails] = useState<InternshipEmails | null>(null)
  const [companyEmail, setCompanyEmail] = useState<string | null>(null)
  const [companyName, setCompanyName] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0]
    if (selectedFile) {
      if (selectedFile.type !== "application/pdf") {
        toast.error("Please upload a PDF file")
        return
      }
      setFile(selectedFile)
      setSubjects([])
      setSelectedSubject(null)
      setEmails(null)
      toast.success(`File selected: ${selectedFile.name}`)
    }
  }

  const handleAnalyze = async () => {
    if (!file) {
      toast.error("Please upload an internship PDF first")
      return
    }

    try {
      setIsAnalyzing(true)
      const result = await onAnalyze(file)
      setSubjects(result.subjects)
      setCompanyEmail(result.companyEmail)
      setCompanyName(result.companyName)
      toast.success(`Found ${result.subjects.length} matching internship ${result.subjects.length === 1 ? 'subject' : 'subjects'}!`)
      
      if (result.companyEmail) {
        toast.success(`Company email found: ${result.companyEmail}`, { duration: 4000 })
      }
    } catch (error) {
      console.error("Error analyzing internship:", error)
      toast.error(error instanceof Error ? error.message : "Failed to analyze internship")
    } finally {
      setIsAnalyzing(false)
    }
  }

  const handleGenerateEmails = async (subject: string) => {
    try {
      setIsGeneratingEmails(true)
      setSelectedSubject(subject)
      toast.info("Generating professional emails with AI...", { duration: 3000 })
      const generatedEmails = await onGenerateEmails(subject)
      setEmails(generatedEmails)
      toast.success("Professional emails generated successfully!")
    } catch (error) {
      console.error("Error generating emails:", error)
      toast.error(error instanceof Error ? error.message : "Failed to generate emails")
      setSelectedSubject(null)
    } finally {
      setIsGeneratingEmails(false)
    }
  }

  const handleClose = () => {
    setFile(null)
    setSubjects([])
    setSelectedSubject(null)
    setEmails(null)
    setCompanyEmail(null)
    setCompanyName(null)
    setIsAnalyzing(false)
    setIsGeneratingEmails(false)
    onOpenChange(false)
  }

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    toast.success(`${label} copied to clipboard!`)
  }

  const handleSendEmail = () => {
    if (!emails || !companyEmail) {
      toast.error("No email address available")
      return
    }

    // Extract subject line from applicant email
    const subjectMatch = emails.applicantEmail.match(/^Subject:\s*(.+?)(?:\n|$)/i)
    const emailSubject = subjectMatch ? subjectMatch[1].trim() : selectedSubject || "Internship Application"
    
    // Extract body (remove subject line)
    const emailBody = emails.applicantEmail.replace(/^Subject:.*?\n\n?/i, '').trim()
    
    // Create mailto link
    const mailtoLink = `mailto:${companyEmail}?subject=${encodeURIComponent(emailSubject)}&body=${encodeURIComponent(emailBody)}`
    
    // Open email client
    window.location.href = mailtoLink
    toast.success("Opening your email client...")
  }

  return (
    <Dialog open={open} onOpenChange={(isOpen) => {
      // Only allow closing via the Close button, not by clicking outside
      if (!isOpen) return
    }}>
      <DialogContent 
        className="max-w-[100vw] w-[100vw] h-[100vh] max-h-[100vh] m-0 rounded-none flex flex-col p-6"
        onPointerDownOutside={(e) => e.preventDefault()}
        onEscapeKeyDown={(e) => e.preventDefault()}
      >
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="size-5" />
            Internship Application Assistant
          </DialogTitle>
          <DialogDescription>
            Upload an internship PDF to get AI-powered subject suggestions and professional email templates.
          </DialogDescription>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto flex flex-col gap-4 min-h-0 px-1">
          {/* File Upload Section */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">Upload Internship PDF</CardTitle>
              <CardDescription className="text-xs">
                Upload the internship offer or description document
              </CardDescription>
            </CardHeader>
            <CardContent>
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf"
                className="hidden"
                onChange={handleFileChange}
              />
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isAnalyzing || isGeneratingEmails}
                >
                  <Upload className="size-4 mr-2" />
                  {file ? "Change File" : "Select PDF"}
                </Button>
                {file && (
                  <div className="flex-1 flex items-center gap-2 text-sm text-muted-foreground">
                    <FileText className="size-4" />
                    <span className="truncate">{file.name}</span>
                    <span className="text-xs">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                )}
              </div>
              {file && subjects.length === 0 && (
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing}
                  className="mt-3 w-full"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="size-4 mr-2 animate-spin" />
                      Analyzing with AI...
                    </>
                  ) : (
                    <>
                      <Sparkles className="size-4 mr-2" />
                      Analyze & Suggest Subjects
                    </>
                  )}
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Company Contact Information */}
          {companyEmail && subjects.length > 0 && !selectedSubject && (
            <Card className="border-green-500/50 bg-green-50/50 dark:bg-green-950/20">
              <CardContent className="pt-4">
                <div className="flex items-center justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <Mail className="size-4 text-green-600 dark:text-green-400" />
                      <span className="text-sm font-medium">Company Contact Email Found</span>
                    </div>
                    {companyName && (
                      <p className="text-xs text-muted-foreground mb-2">{companyName}</p>
                    )}
                    <div className="flex items-center gap-2">
                      <code className="text-sm font-mono bg-green-100 dark:bg-green-900/30 px-3 py-1.5 rounded border border-green-300 dark:border-green-700 text-green-700 dark:text-green-300">
                        {companyEmail}
                      </code>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(companyEmail, "Email address")}
                      >
                        Copy
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Subject Suggestions Section */}
          {subjects.length > 0 && !selectedSubject && (
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Suggested Internship Subjects</CardTitle>
                <CardDescription className="text-xs">
                  Based on your CV, here are the matching internship subjects. Click "Generate Email" to create professional application materials.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-3">
                {subjects.map((item, index) => (
                  <Card key={index} className="border-2 hover:border-primary/50 transition-colors">
                    <CardContent className="pt-4">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1 space-y-2">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="bg-primary/10">
                              Match #{index + 1}
                            </Badge>
                            <h4 className="font-semibold text-sm">{item.subject}</h4>
                          </div>
                          <p className="text-sm text-muted-foreground leading-relaxed">
                            <span className="font-medium text-foreground">Why this fits:</span> {item.explanation}
                          </p>
                        </div>
                        <Button
                          size="sm"
                          onClick={() => handleGenerateEmails(item.subject)}
                          disabled={isGeneratingEmails}
                          className="shrink-0"
                        >
                          <Mail className="size-4 mr-2" />
                          Generate Email
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </CardContent>
            </Card>
          )}

          {/* Email Results Section */}
          {emails && selectedSubject && (
            <div className="space-y-4 pb-2">
              {/* Selected Subject Header */}
              <Card className="border-primary/50 bg-primary/5">
                <CardContent className="pt-4">
                  <div className="flex items-center gap-2">
                    <Check className="size-5 text-primary" />
                    <div>
                      <p className="text-xs text-muted-foreground">Selected Subject</p>
                      <p className="font-semibold">{selectedSubject}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Separator />

              {/* Applicant Email */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Mail className="size-4" />
                      Your Application Email
                    </CardTitle>
                    <div className="flex gap-2">
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => copyToClipboard(emails.applicantEmail, "Application email")}
                      >
                        Copy
                      </Button>
                      {companyEmail && (
                        <Button
                          size="sm"
                          variant="default"
                          className="bg-green-600 hover:bg-green-700"
                          onClick={handleSendEmail}
                        >
                          <Mail className="size-4 mr-2" />
                          Send to {companyName || companyEmail}
                        </Button>
                      )}
                    </div>
                  </div>
                  <CardDescription className="text-xs">
                    Professional email ready to send to the company
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-md">
                    {emails.applicantEmail}
                  </pre>
                </CardContent>
              </Card>

              <Separator />

              {/* Company Email Template */}
              <Card>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-base flex items-center gap-2">
                      <Building2 className="size-4" />
                      Company Email Template
                    </CardTitle>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => copyToClipboard(emails.companyEmail, "Company email")}
                    >
                      Copy
                    </Button>
                  </div>
                  <CardDescription className="text-xs">
                    Professional template for formal company correspondence
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <pre className="text-sm leading-relaxed whitespace-pre-wrap font-sans bg-muted/50 p-4 rounded-md">
                    {emails.companyEmail}
                  </pre>
                </CardContent>
              </Card>

              {/* Back Button */}
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedSubject(null)
                  setEmails(null)
                }}
                className="w-full"
              >
                ← Back to Subject Selection
              </Button>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button type="button" variant="outline" onClick={handleClose}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
