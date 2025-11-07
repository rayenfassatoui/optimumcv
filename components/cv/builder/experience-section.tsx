"use client"

import { Sparkles } from "lucide-react"
import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form"

import { createEmptyExperience, type CVData } from "@/lib/cv"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ExperienceSectionProps = {
  form: UseFormReturn<CVData>
  experience: UseFieldArrayReturn<CVData, "experience", "fieldId">
  experienceLoading: string | null
  onEnhance: (index: number) => void
  enhanceLabel: string
}

const toLines = (value: string[] = []) => value.join("\n")

export function ExperienceSection({ form, experience, experienceLoading, onEnhance, enhanceLabel }: ExperienceSectionProps) {
  const updateLines = (value: string) =>
    value
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter((line) => line.length > 0)

  return (
    <>
      {experience.fields.map((item, index) => (
        <div key={item.fieldId} className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Role {index + 1}</h3>
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEnhance(index)}
                disabled={experienceLoading === item.id}
              >
                <Sparkles className={cn("size-4", experienceLoading === item.id && "animate-spin")} />
                {enhanceLabel}
              </Button>
              <Button variant="ghost" size="icon-sm" onClick={() => experience.remove(index)}>
                ✕
              </Button>
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={`experience.${index}.role`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Lead Product Designer" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.company`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Company</FormLabel>
                  <FormControl>
                    <Input placeholder="Flowly" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`experience.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Remote" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`experience.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input placeholder="2022" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`experience.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input placeholder="Present" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>

          <FormField
            control={form.control}
            name={`experience.${index}.highlights`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights</FormLabel>
                <FormControl>
                  <Textarea
                    rows={5}
                    placeholder={"Ship outcomes with metrics, e.g. Increased activation by 18%"}
                    value={toLines(field.value)}
                    onChange={(event) => field.onChange(updateLines(event.target.value))}
                  />
                </FormControl>
                <FormDescription>One bullet per line. AI can rewrite for clarity.</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={() => experience.append(createEmptyExperience())}>
        + Add role
      </Button>
    </>
  )
}
