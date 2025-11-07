"use client"


import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"

type JobInsightsProps = {
  jobDescription: string
  jobHints: string[]
  onChange: (value: string) => void
}

export function JobInsights({ jobDescription, jobHints, onChange }: JobInsightsProps) {
  return (
    <div className="mt-6 space-y-4 rounded-2xl border border-dashed border-primary/40 bg-primary/5 p-5 text-xs text-muted-foreground">
      <p className="font-semibold uppercase tracking-wide text-primary">Job prompt</p>
      <Textarea
        rows={5}
        placeholder="Paste the job description here to tune your CV."
        value={jobDescription}
        onChange={(event) => onChange(event.target.value)}
      />
      <div className="flex flex-wrap gap-2">
        {jobHints.map((hint) => (
          <Button key={hint} type="button" variant="secondary" size="sm" onClick={() => onChange(hint)}>
            {hint}
          </Button>
        ))}
      </div>
    </div>
  )
}
