import { useFieldArray, useForm, type Resolver } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { cvSchema, defaultCV, type CVData } from "@/lib/cv"

export function useCVForm() {
  const form = useForm<CVData>({
    resolver: zodResolver(cvSchema) as Resolver<CVData>,
    defaultValues: defaultCV(),
    mode: "onChange",
  })

  const experience = useFieldArray({ 
    control: form.control, 
    name: "experience", 
    keyName: "fieldId" 
  })
  
  const education = useFieldArray({ 
    control: form.control, 
    name: "education", 
    keyName: "fieldId" 
  })
  
  const projects = useFieldArray({ 
    control: form.control, 
    name: "projects", 
    keyName: "fieldId" 
  })

  const cv = form.watch()

  return {
    form,
    experience,
    education,
    projects,
    cv,
  }
}
