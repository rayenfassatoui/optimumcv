"use client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { type CVData } from "@/lib/cv";
import { cn } from "@/lib/utils";

interface CVPreviewProps {
  data: CVData
  photo?: string | null
  className?: string
}

export function CVPreview({ data, photo, className }: CVPreviewProps) {
  const { personal, experience, education, projects, skills, certifications, languages } = data

  return (
    <article
      id="cv-preview-content"
      className={cn(
        "bg-white text-slate-900 dark:bg-zinc-900 dark:text-zinc-50 mx-auto w-full max-w-[840px] rounded-xl border border-primary/10 p-12 shadow-lg",
        "font-serif",
        className
      )}
    >
      <header className="mb-6 border-b-2 border-slate-800 dark:border-slate-200 pb-4">
        <div className="flex items-start justify-between gap-6">
          <div className="flex-1">
            <h1 className="mb-1 text-2xl font-bold uppercase tracking-wide text-slate-900 dark:text-slate-50">
              {personal.fullName}
            </h1>
            <p className="mb-2 text-sm font-medium text-slate-700 dark:text-slate-300">{personal.title}</p>
            <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs text-slate-600 dark:text-slate-400">
              <span>{personal.email}</span>
              {personal.phone && <span>•</span>}
              {personal.phone && <span>{personal.phone}</span>}
              {personal.location && <span>•</span>}
              {personal.location && <span>{personal.location}</span>}
              {personal.website && <span>•</span>}
              {personal.website && (
                <a href={personal.website} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  {personal.website}
                </a>
              )}
              {personal.linkedin && <span>•</span>}
              {personal.linkedin && (
                <a href={personal.linkedin} target="_blank" rel="noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline">
                  LinkedIn
                </a>
              )}
            </div>
          </div>
          {photo && (
            <Avatar className={cn(
              "size-16 border-2 border-slate-300 dark:border-slate-600",
              personal.photoStyle === "square" && "rounded-md"
            )}>
              <AvatarImage src={photo} alt={`${personal.fullName} portrait`} />
              <AvatarFallback className="bg-slate-100 dark:bg-slate-800 text-sm font-bold uppercase">
                {personal.fullName
                  .split(" ")
                  .map((part) => part[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
          )}
        </div>
        {personal.summary && (
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-400">
            {personal.summary}
          </p>
        )}
      </header>

      <section className="space-y-5">
        <Section heading="PROFESSIONAL EXPERIENCE">
          {experience.length === 0 && (
            <EmptyState message="Add your work history to let AI craft impact-driven bullets." />
          )}
          {experience.map((role) => (
            <div key={role.id} className="space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {role.company}
                  </h3>
                  <p className="text-xs italic text-slate-700 dark:text-slate-300">
                    {role.role}
                    {role.location && ` • ${role.location}`}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {[role.startDate, role.endDate].filter(Boolean).join(" – ")}
                </p>
              </div>
              <ul className="mt-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                {role.highlights.map((line, index) => (
                  <li key={`${role.id}-highlight-${index}`} className="flex gap-2">
                    <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-slate-600 dark:bg-slate-400" />
                    <span className="leading-relaxed">{line}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </Section>

        <Section heading="EDUCATION">
          {education.length === 0 && (
            <EmptyState message="Add education or certifications to reinforce credibility." />
          )}
          {education.map((item) => (
            <div key={item.id} className="space-y-1">
              <div className="flex items-baseline justify-between gap-4">
                <div className="flex-1">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {item.school}
                  </h3>
                  <p className="text-xs italic text-slate-700 dark:text-slate-300">
                    {item.degree}
                    {item.location && ` • ${item.location}`}
                  </p>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 whitespace-nowrap">
                  {[item.startDate, item.endDate].filter(Boolean).join(" – ")}
                </p>
              </div>
              {item.highlights.length > 0 && (
                <ul className="mt-1 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                  {item.highlights.map((line, index) => (
                    <li key={`${item.id}-highlight-${index}`} className="flex gap-2">
                      <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-slate-600 dark:bg-slate-400" />
                      <span>{line}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
        </Section>

        {projects.length > 0 && (
          <Section heading="PROJECTS">
            {projects.map((project) => (
              <div key={project.id} className="space-y-1">
                <div className="flex items-baseline gap-2">
                  <h3 className="text-sm font-bold text-slate-900 dark:text-slate-50">
                    {project.name}
                  </h3>
                  {project.link && (
                    <a
                      href={project.link}
                      className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
                      target="_blank"
                      rel="noreferrer"
                    >
                      [Link]
                    </a>
                  )}
                </div>
                {project.summary && (
                  <p className="text-xs text-slate-600 dark:text-slate-400">{project.summary}</p>
                )}
                {project.highlights.length > 0 && (
                  <ul className="mt-0.5 space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                    {project.highlights.map((line, index) => (
                      <li key={`${project.id}-highlight-${index}`} className="flex gap-2">
                        <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-slate-600 dark:bg-slate-400" />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            ))}
          </Section>
        )}

        <div className="grid gap-5 md:grid-cols-2">
          {skills.length > 0 && (
            <Section heading="SKILLS">
              <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {skills.join(" • ")}
              </div>
            </Section>
          )}

          {certifications.length > 0 && (
            <Section heading="CERTIFICATIONS">
              <ul className="space-y-0.5 text-xs text-slate-700 dark:text-slate-300">
                {certifications.map((cert, index) => (
                  <li key={`${cert}-${index}`} className="flex gap-2">
                    <span className="mt-1.5 block size-1 shrink-0 rounded-full bg-slate-600 dark:bg-slate-400" />
                    <span>{cert}</span>
                  </li>
                ))}
              </ul>
            </Section>
          )}

          {languages.length > 0 && (
            <Section heading="LANGUAGES">
              <div className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                {languages.join(" • ")}
              </div>
            </Section>
          )}
        </div>
      </section>
    </article>
  )
}

function Section({ heading, children }: { heading: string; children: React.ReactNode }) {
  return (
    <section className="space-y-2">
      <h2 className="border-b border-slate-300 dark:border-slate-600 pb-0.5 text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-50">
        {heading}
      </h2>
      <div className="space-y-3">
        {children}
      </div>
    </section>
  )
}

function EmptyState({ message }: { message: string }) {
  return <p className="text-xs text-slate-400 dark:text-slate-500">{message}</p>
}
