"use client"

import { ReactNode } from "react"

import { ScrollArea } from "@/components/ui/scroll-area"

export function CVPreviewPanel({ children }: { children: ReactNode }) {
  return (
    <div className="relative">
      <div className="absolute inset-0 -z-10 rounded-[32px] bg-gradient-to-br from-primary/10 via-transparent to-primary/5 blur-3xl" />
      <ScrollArea className="h-[720px] rounded-3xl border border-border/60 bg-muted/40 p-6">
        {children}
      </ScrollArea>
    </div>
  )
}
