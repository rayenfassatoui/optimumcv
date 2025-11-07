"use client"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { type CVData } from "@/lib/cv"
import { cn } from "@/lib/utils"

interface CVPreviewProps {
  data: CVData
  photo?: string | null
  className?: string
}

export function CVPreview({ data, photo, className }: CVPreviewProps) {
  const { personal, experience, education, projects, skills, certifications, languages } = data

  return (
    <article
      className={cn(
        "bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-50 mx-auto w-full max-w-[840px] rounded-xl border border-primary/10 p-10 shadow-lg",
        "font-[var(--font-geist-sans)]",
        className
      )}
    >
      <header className="flex flex-col gap-6 border-b border-border/60 pb-6 sm:flex-row sm:items-end sm:justify-between">
        <div className="space-y-2">
          <h1 className="text-3xl font-semibold tracking-tight text-primary">{personal.fullName}</h1>
          <p className="text-lg font-medium text-slate-600 dark:text-slate-300">{personal.title}</p>
          {personal.summary && (
            <p className="max-w-2xl text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              {personal.summary}
            </p>
          )}
        </div>
        <div className="flex flex-col items-start gap-3 text-sm text-slate-500 dark:text-slate-300 sm:items-end">
          <div className="flex items-center gap-3">
            <Avatar className="size-20 border border-border">
              {photo ? (
                <AvatarImage src={photo} alt={`${personal.fullName} portrait`} />
              ) : (
                <AvatarFallback className="bg-muted text-lg font-semibold uppercase">
                  {personal.fullName
                    .split(" ")
                    .map((part) => part[0])
                    .join("")}
                </AvatarFallback>
              )}
            </Avatar>
          </div>
          <div className="space-y-1 text-xs sm:text-right">
            <p>{personal.email}</p>
            {personal.phone && <p>{personal.phone}</p>}
            {personal.location && <p>{personal.location}</p>}
            {personal.website && (
              <p className="text-primary">
                <a href={personal.website} target="_blank" rel="noreferrer">
                  {personal.website}
                </a>
              </p>
            )}
            {personal.linkedin && (
              <p className="text-primary">
                <a href={personal.linkedin} target="_blank" rel="noreferrer">
                  {personal.linkedin}
                </a>
              </p>
            )}
          </div>
        </div>
      </header>

      <section className="grid gap-8 pt-6 md:grid-cols-[1.6fr_1fr]">
        <div className="space-y-8">
          <Section heading="Experience">
            {experience.length === 0 && (
              <EmptyState message="Add your work history to let AI craft impact-driven bullets." />
            )}
            {experience.map((role) => (
              <div key={role.id} className="space-y-2">
                <div className="flex flex-col justify-between gap-2 sm:flex-row sm:items-baseline">
                  <div>
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {role.role}
                    </h3>
                    <p className="text-sm font-medium text-slate-500">
                      {role.company}
                      {role.location ? ` · ${role.location}` : ""}
                    </p>
                  </div>
                  <p className="text-xs uppercase tracking-wide text-slate-400">
                    {[role.startDate, role.endDate].filter(Boolean).join(" — ")}
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {role.highlights.map((line, index) => (
                    <li key={`${role.id}-highlight-${index}`} className="flex gap-2">
                      <span className="mt-1 block size-1.5 rounded-full bg-primary/70" aria-hidden />
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section heading="Projects">
            {projects.length === 0 && (
              <EmptyState message="Showcase projects, case studies, or open-source wins." />
            )}
            {projects.map((project) => (
              <div key={project.id} className="space-y-2">
                <div className="flex flex-col gap-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">
                      {project.name}
                    </h3>
                    {project.link && (
                      <a
                        href={project.link}
                        className="text-xs font-medium text-primary"
                        target="_blank"
                        rel="noreferrer"
                      >
                        {project.link}
                      </a>
                    )}
                  </div>
                  {project.summary && (
                    <p className="text-sm text-slate-500 dark:text-slate-300">{project.summary}</p>
                  )}
                </div>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {project.highlights.map((line, index) => (
                    <li key={`${project.id}-highlight-${index}`} className="flex gap-2">
                      <span className="mt-1 block size-1 rounded-full bg-primary/70" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>
        </div>

        <div className="space-y-8">
          <Section heading="Education">
            {education.length === 0 && (
              <EmptyState message="Add education or certifications to reinforce credibility." />
            )}
            {education.map((item) => (
              <div key={item.id} className="space-y-1">
                <h3 className="text-base font-semibold text-slate-800 dark:text-slate-100">
                  {item.degree}
                </h3>
                <p className="text-sm text-slate-500">
                  {item.school}
                  {item.location ? ` · ${item.location}` : ""}
                </p>
                <p className="text-xs uppercase tracking-wide text-slate-400">
                  {[item.startDate, item.endDate].filter(Boolean).join(" — ")}
                </p>
                <ul className="space-y-1.5 text-sm text-slate-600 dark:text-slate-300">
                  {item.highlights.map((line, index) => (
                    <li key={`${item.id}-highlight-${index}`} className="flex gap-2">
                      <span className="mt-1 block size-1 rounded-full bg-primary/70" aria-hidden />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </Section>

          <Section heading="Skills">
            {skills.length === 0 && <EmptyState message="Keep skills tight and relevant to the roles you want." />}
            {skills.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {skills.map((skill) => (
                  <Badge key={skill} variant="outline" className="border-primary/30 bg-primary/5 text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            )}
          </Section>

          <Section heading="Certifications">
            {certifications.length === 0 && (
              <EmptyState message="Upload key certifications so AI can highlight credibility." />
            )}
            {certifications.length > 0 && (
              <ul className="list-disc space-y-1 pl-4 text-sm text-slate-600 dark:text-slate-300">
                {certifications.map((cert, index) => (
                  <li key={`${cert}-${index}`}>{cert}</li>
                ))}
              </ul>
            )}
          </Section>

          <Section heading="Languages">
            {languages.length === 0 && (
              <EmptyState message="Language fluency helps tailor CVs to international roles." />
            )}
            {languages.length > 0 && (
              <ul className="flex flex-wrap gap-3 text-sm text-slate-600 dark:text-slate-300">
                {languages.map((language, index) => (
                  <li key={`${language}-${index}`}>{language}</li>
                ))}
              </ul>
            )}
          </Section>
        </div>
      </section>
    </article>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="grid gap-3">
      <div className="flex items-center gap-3">
        <h2 className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
          {heading}
        </h2>
        <Separator className="bg-border/60" />
      </div>
      <div className="grid gap-4 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
        {children}
      </div>
    </section>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-xs text-slate-400 dark:text-slate-500">{message}</p>
}
