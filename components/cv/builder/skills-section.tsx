"use client"

import { UseFormReturn } from "react-hook-form"

import { type CVData } from "@/lib/cv"
import { FormItem, FormLabel } from "@/components/ui/form"
import { Textarea } from "@/components/ui/textarea"

type SkillsSectionProps = {
  form: UseFormReturn<CVData>
}

const toText = (values: string[]) => values.join("\n")
const parseList = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

export function SkillsSection({ form }: SkillsSectionProps) {
  const skills = form.watch("skills")
  const certifications = form.watch("certifications")
  const languages = form.watch("languages")

  return (
    <div className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
    <FormItem className="space-y-3">
        <FormLabel>Skills</FormLabel>
        <Textarea
          rows={4}
          value={toText(skills)}
          onChange={(event) =>
            form.setValue("skills", parseList(event.target.value), { shouldDirty: true })
          }
          placeholder={"Design systems\nUser research\nPrototyping"}
        />
      </FormItem>
      <FormItem className="space-y-3">
        <FormLabel>Certifications</FormLabel>
        <Textarea
          rows={3}
          value={toText(certifications)}
          onChange={(event) =>
            form.setValue("certifications", parseList(event.target.value), { shouldDirty: true })
          }
          placeholder="Google UX Design Professional Certificate"
        />
      </FormItem>
      <FormItem className="space-y-3">
        <FormLabel>Languages</FormLabel>
        <Textarea
          rows={3}
          value={toText(languages)}
          onChange={(event) =>
            form.setValue("languages", parseList(event.target.value), { shouldDirty: true })
          }
          placeholder={"English\nFrench"}
        />
      </FormItem>
    </div>
  )
}
