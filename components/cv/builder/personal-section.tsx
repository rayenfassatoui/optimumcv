"use client"

import { RefObject } from "react"
import { UseFormReturn } from "react-hook-form"
import { ImageDown, Upload } from "lucide-react"

import { type CVData } from "@/lib/cv"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

type PersonalSectionProps = {
  form: UseFormReturn<CVData>
  summaryContext?: string
  photoInputRef: RefObject<HTMLInputElement | null>
  isEnhancingPhoto: boolean
  onPhotoChange: (event: React.ChangeEvent<HTMLInputElement>) => void
  onEnhancePhoto: () => void
}

export function PersonalSection({
  form,
  summaryContext,
  photoInputRef,
  isEnhancingPhoto,
  onPhotoChange,
  onEnhancePhoto,
}: PersonalSectionProps) {
  return (
    <div className="space-y-6 rounded-xl border border-border/60 bg-card/70 p-5">
      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <input 
            ref={photoInputRef} 
            type="file" 
            accept="image/*" 
            className="hidden" 
            id="photo-upload-input"
            onChange={(e) => {
              console.log("[PersonalSection] File input onChange triggered")
              onPhotoChange(e)
            }} 
          />
          <Button 
            type="button"
            variant="outline" 
            size="sm" 
            onClick={(e) => {
              e.preventDefault()
              e.stopPropagation()
              console.log("[PersonalSection] Upload button clicked")
              console.log("[PersonalSection] photoInputRef.current:", photoInputRef.current)
              photoInputRef.current?.click()
            }}
          >
            <Upload className="size-4" /> Upload Photo
          </Button>
          <Button 
            type="button"
            variant="ghost" 
            size="sm" 
            onClick={onEnhancePhoto} 
            disabled={isEnhancingPhoto}
          >
            <ImageDown className={cn("size-4", isEnhancingPhoto && "animate-spin")} />
            Enhance Photo
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        <FormField
          control={form.control}
          name="personal.fullName"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Full name</FormLabel>
              <FormControl>
                <Input placeholder="Jordan Smith" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Headline</FormLabel>
              <FormControl>
                <Input placeholder="Senior Product Designer" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.summary"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Summary</FormLabel>
              <FormControl>
                <Textarea rows={5} placeholder="Craft a compelling elevator pitch." {...field} />
              </FormControl>
              <FormDescription>{summaryContext ? `AI will calibrate for ${summaryContext}.` : ""}</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="personal.email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input type="email" placeholder="you@domain.com" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.phone"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone</FormLabel>
              <FormControl>
                <Input placeholder="+33 6 12 34 56 78" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.location"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Location</FormLabel>
              <FormControl>
                <Input placeholder="Paris, France" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.website"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Portfolio or website</FormLabel>
              <FormControl>
                <Input placeholder="https://" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="personal.linkedin"
          render={({ field }) => (
            <FormItem>
              <FormLabel>LinkedIn</FormLabel>
              <FormControl>
                <Input placeholder="https://linkedin.com/in/you" {...field} />
              </FormControl>
            </FormItem>
          )}
        />
      </div>
    </div>
  )
}
