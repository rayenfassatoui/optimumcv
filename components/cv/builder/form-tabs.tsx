"use client"

import { ReactNode } from "react"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"

type FormTabsProps = {
  personal: ReactNode
  experience: ReactNode
  education: ReactNode
  projects: ReactNode
  skills: ReactNode
}

export function FormTabs({ personal, experience, education, projects, skills }: FormTabsProps) {
  return (
    <Tabs defaultValue="personal" className="space-y-6">
      <TabsList>
        <TabsTrigger value="personal">Profile</TabsTrigger>
        <TabsTrigger value="experience">Experience</TabsTrigger>
        <TabsTrigger value="education">Education</TabsTrigger>
        <TabsTrigger value="projects">Projects</TabsTrigger>
        <TabsTrigger value="skills">Skills & Extras</TabsTrigger>
      </TabsList>

      <TabsContent value="personal" className="space-y-6">
        {personal}
      </TabsContent>
      <TabsContent value="experience" className="space-y-6">
        {experience}
      </TabsContent>
      <TabsContent value="education" className="space-y-6">
        {education}
      </TabsContent>
      <TabsContent value="projects" className="space-y-6">
        {projects}
      </TabsContent>
      <TabsContent value="skills" className="space-y-6">
        {skills}
      </TabsContent>
    </Tabs>
  )
}
