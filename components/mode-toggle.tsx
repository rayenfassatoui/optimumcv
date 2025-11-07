"use client"

import { useEffect, useState } from "react"
import { MoonStar, Sun } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"

export function ModeToggle() {
  const { resolvedTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  const isDark = resolvedTheme === "dark"
  const toggleTheme = () => setTheme(isDark ? "light" : "dark")

  if (!mounted) {
    return (
      <Button variant="outline" size="icon" disabled aria-label="Toggle theme">
        <MoonStar className="size-4 opacity-0" />
      </Button>
    )
  }

  return (
    <Button variant="outline" size="icon" onClick={toggleTheme} aria-label="Toggle theme">
      {isDark ? <Sun className="size-4" /> : <MoonStar className="size-4" />}
    </Button>
  )
}
