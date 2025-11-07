"use client"

import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form"

import { createEmptyEducation, type CVData } from "@/lib/cv"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type EducationSectionProps = {
  form: UseFormReturn<CVData>
  education: UseFieldArrayReturn<CVData, "education", "fieldId">
}

const normalizeLines = (value: string[] = []) => value.join("\n")

const updateLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

export function EducationSection({ form, education }: EducationSectionProps) {
  return (
    <>
      {education.fields.map((item, index) => (
        <div key={item.fieldId} className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Program {index + 1}</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => education.remove(index)}>
              ✕
            </Button>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <FormField
              control={form.control}
              name={`education.${index}.degree`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Degree</FormLabel>
                  <FormControl>
                    <Input placeholder="M.Des Interaction Design" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${index}.school`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>School</FormLabel>
                  <FormControl>
                    <Input placeholder="ENSA Lyon" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`education.${index}.location`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Location</FormLabel>
                  <FormControl>
                    <Input placeholder="Lyon, France" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-3">
              <FormField
                control={form.control}
                name={`education.${index}.startDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Start</FormLabel>
                    <FormControl>
                      <Input placeholder="2016" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name={`education.${index}.endDate`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>End</FormLabel>
                    <FormControl>
                      <Input placeholder="2018" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
            </div>
          </div>
          <FormField
            control={form.control}
            name={`education.${index}.highlights`}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Highlights</FormLabel>
                <FormControl>
                  <Textarea
                    rows={4}
                    placeholder="Add awards, GPA, or notable coursework."
                    value={normalizeLines(field.value)}
                    onChange={(event) => field.onChange(updateLines(event.target.value))}
                  />
                </FormControl>
              </FormItem>
            )}
          />
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={() => education.append(createEmptyEducation())}>
        + Add education
      </Button>
    </>
  )
}
