"use client"

import { UseFieldArrayReturn, UseFormReturn } from "react-hook-form"

import { createEmptyProject, type CVData } from "@/lib/cv"
import { Button } from "@/components/ui/button"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type ProjectsSectionProps = {
  form: UseFormReturn<CVData>
  projects: UseFieldArrayReturn<CVData, "projects", "fieldId">
}

const toMultiline = (value: string[] = []) => value.join("\n")

const parseLines = (value: string) =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter((line) => line.length > 0)

export function ProjectsSection({ form, projects }: ProjectsSectionProps) {
  return (
    <>
      {projects.fields.map((item, index) => (
        <div key={item.fieldId} className="space-y-4 rounded-xl border border-border/60 bg-card/70 p-5">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">Project {index + 1}</h3>
            <Button variant="ghost" size="icon-sm" onClick={() => projects.remove(index)}>
              ✕
            </Button>
          </div>
          <div className="grid gap-4">
            <FormField
              control={form.control}
              name={`projects.${index}.name`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Portfolio Platform" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${index}.summary`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Summary</FormLabel>
                  <FormControl>
                    <Textarea rows={3} placeholder="What was the outcome?" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${index}.link`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Link</FormLabel>
                  <FormControl>
                    <Input placeholder="https://" {...field} />
                  </FormControl>
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name={`projects.${index}.highlights`}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Highlights</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Describe your contribution and metrics."
                      value={toMultiline(field.value)}
                      onChange={(event) => field.onChange(parseLines(event.target.value))}
                    />
                  </FormControl>
                </FormItem>
              )}
            />
          </div>
        </div>
      ))}
      <Button type="button" variant="outline" className="w-full" onClick={() => projects.append(createEmptyProject())}>
        + Add project
      </Button>
    </>
  )
}
