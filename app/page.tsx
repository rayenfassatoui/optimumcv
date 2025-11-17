import { CVBuilder } from "@/components/cv/cv-builder"
import { AnimatedThemeToggler } from "@/components/ui/animated-theme-toggler"
import { Button } from "@/components/ui/button"
import { Github } from "lucide-react"
import Link from "next/link"

export default function Home() {
  return (
    <div className="relative flex min-h-screen flex-col">
      <nav className="sticky top-0 z-50 flex items-center justify-end gap-2 border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-10 lg:px-20">
        <Button variant="ghost" size="icon" asChild>
          <a href="https://github.com/rayenfassatoui/optimumcv" target="_blank" rel="noopener noreferrer">
            <Github className="h-5 w-5" />
            <span className="sr-only">GitHub</span>
          </a>
        </Button>
        <AnimatedThemeToggler />
      </nav>

      <main className="relative mx-auto flex w-full max-w-[1440px] flex-1 flex-col gap-12 px-6 py-16 sm:px-10 lg:px-20">
        <div className="absolute inset-x-0 top-10 -z-10 mx-auto h-[420px] max-w-5xl rounded-full bg-gradient-to-br from-primary/25 via-transparent to-primary/10 blur-3xl" />
        <header className="space-y-4 text-center sm:text-left">
          <span className="text-sm font-semibold uppercase tracking-[0.4rem] text-primary">OptimumCV</span>
          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight text-foreground sm:text-5xl">
            Build, enhance, and adapt a professional CV in minutes.
          </h1>
          <p className="max-w-2xl text-base text-muted-foreground sm:text-lg">
            Import existing resumes, collaborate with AI to polish each section, tailor content to any job description, and instantly export pixel-perfect PDFs.
          </p>
        </header>
        <CVBuilder />
      </main>
      
{/* footer */}
      <footer className="border-t bg-background py-6">
        <div className="mx-auto max-w-[1440px] px-6 text-center text-sm text-muted-foreground sm:px-10 lg:px-20">
          <p>
            Built by{" "}
            <Link 
              href="https://www.rayenft.dev/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              rayenft.dev
            </Link>
            {" "}and{" "}
            <Link 
              href="https://ashref.tn/" 
              target="_blank" 
              rel="noopener noreferrer"
              className="font-medium underline underline-offset-4 hover:text-primary"
            >
              ashref.tn
            </Link>
          </p>
        </div>
      </footer>
    </div>
  )
}
