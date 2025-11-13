import { z } from "zod"

const id = () => `cv_${Math.random().toString(36).slice(2, 10)}`

export const experienceSchema = z.object({
  id: z.string().default(id),
  role: z.string().min(1, "Role is required"),
  company: z.string().min(1, "Company is required"),
  location: z.string().default(""),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  highlights: z.array(z.string().min(1).max(260)).default([]),
})

export type ExperienceItem = z.infer<typeof experienceSchema>

export const educationSchema = z.object({
  id: z.string().default(id),
  school: z.string().min(1, "School is required"),
  degree: z.string().min(1, "Degree is required"),
  startDate: z.string().default(""),
  endDate: z.string().default(""),
  location: z.string().default(""),
  highlights: z.array(z.string().min(1).max(200)).default([]),
})

export type EducationItem = z.infer<typeof educationSchema>

export const projectSchema = z.object({
  id: z.string().default(id),
  name: z.string().min(1, "Name is required"),
  summary: z.string().default(""),
  link: z.string().default(""),
  highlights: z.array(z.string().min(1).max(220)).default([]),
})

export type ProjectItem = z.infer<typeof projectSchema>

export const cvSchema = z.object({
  personal: z.object({
    fullName: z.string().min(1, "Full name is required"),
    title: z.string().default(""),
    summary: z.string().default(""),
    email: z.string().email("Add a valid email"),
    phone: z.string().default(""),
    location: z.string().default(""),
    website: z.string().default(""),
    linkedin: z.string().default(""),
    photoStyle: z.enum(["square", "circle"]).default("square"),
  }),
  experience: z.array(experienceSchema).default([]),
  education: z.array(educationSchema).default([]),
  projects: z.array(projectSchema).default([]),
  skills: z.array(z.string().min(1)).default([]),
  certifications: z.array(z.string().min(1)).default([]),
  languages: z.array(z.string().min(1)).default([]),
})

export type CVData = z.infer<typeof cvSchema>

const trimLines = (lines: string[]) =>
  lines.map((line) => line.trim()).filter((line) => line.length > 0)

export const createEmptyExperience = (): ExperienceItem => ({
  id: id(),
  role: "",
  company: "",
  location: "",
  startDate: "",
  endDate: "",
  highlights: [],
})

export const createEmptyEducation = (): EducationItem => ({
  id: id(),
  school: "",
  degree: "",
  location: "",
  startDate: "",
  endDate: "",
  highlights: [],
})

export const createEmptyProject = (): ProjectItem => ({
  id: id(),
  name: "",
  summary: "",
  link: "",
  highlights: [],
})

export const defaultCV = (): CVData => ({
  personal: {
    fullName: "Jordan Smith",
    title: "Senior Product Designer",
    summary:
      "Human-centered designer with 7+ years crafting digital experiences that balance UX rigor with business outcomes.",
    email: "jordan.smith@example.com",
    phone: "+33 6 12 34 56 78",
    location: "Paris, France",
    website: "https://jordansmith.design",
    linkedin: "https://linkedin.com/in/jordansmith",
  },
  experience: [
    {
      id: id(),
      role: "Lead Product Designer",
      company: "Flowly",
      location: "Remote",
      startDate: "2022",
      endDate: "Present",
      highlights: trimLines([
        "Shipped a design system refresh that increased design-dev velocity by 35% and reduced inconsistencies across 4 products.",
        "Partnered with PM and data to launch AI onboarding, improving activation by 18% through contextual nudges.",
        "Facilitated weekly design critiques and mentorship for a team of 5 designers, raising NPS from 32 to 54.",
      ]),
    },
    {
      id: id(),
      role: "Product Designer",
      company: "Atlas HR",
      location: "Lyon, France",
      startDate: "2019",
      endDate: "2022",
      highlights: trimLines([
        "Redesigned analytics workflows that cut report creation time by 42% and lifted retention by 9%.",
        "Ran continuous discovery with 40+ interviews each quarter to validate roadmap bets and reduce churn.",
      ]),
    },
  ],
  education: [
    {
      id: id(),
      school: "ENSA Lyon",
      degree: "M.Des. Interaction Design",
      location: "Lyon, France",
      startDate: "2016",
      endDate: "2018",
      highlights: trimLines([
        "Thesis on adaptive interfaces for neurodiverse teams, awarded jury distinction.",
      ]),
    },
  ],
  projects: [
    {
      id: id(),
      name: "Portfolio Platform",
      summary: "Modular case study builder for creative teams.",
      link: "https://portfolio-template.dev",
      highlights: trimLines([
        "Architected component library that enabled non-designers to ship branded pages in under 10 minutes.",
        "Implemented analytics guardrails and privacy controls adopted by 200+ teams in beta.",
      ]),
    },
  ],
  skills: [
    "Design systems",
    "Product discovery",
    "Figma",
    "User research",
    "Design ops",
    "Prototyping",
  ],
  certifications: ["Google UX Design Professional Certificate"],
  languages: ["English", "French"],
})
