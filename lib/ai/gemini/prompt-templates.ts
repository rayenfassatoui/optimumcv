import type { CVData, ExperienceItem } from "@/lib/cv"

/**
 * Generate prompt for enhancing a professional summary
 */
export const createSummaryEnhancementPrompt = (
  summary: string,
  context?: string
): string => {
  return [
    "You are a career coach rewriting a professional summary for a CV.",
    "Your goal is to create a powerful, 2-3 sentence pitch (under 75 words) that grabs a recruiter's attention in under 10 seconds.",
    "The summary must highlight the candidate's biggest achievements and core value proposition.",
    context ? `Context from the CV: ${context}` : "",
    "Rewrite the following summary:",
    `"""${summary}"""`,
    "",
    "Rules:",
    "- DO NOT use bullet points, bold text, or markdown.",
    "- DO NOT use generic introductions like 'I am a...'",
    "- Write in plain text only. Be direct, confident, and results-oriented.",
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Generate prompt for enhancing work experience
 */
export const createExperienceEnhancementPrompt = (
  experience: ExperienceItem,
  jobDescription?: string
): string => {
  return [
    "You are an expert resume strategist, rewriting a candidate's work experience to make them the perfect fit for a job.",
    "Your task is to strategically rewrite the experience highlights to mirror the skills and technologies in the job description.",
    "You have permission to add or replace technologies to align with the job (e.g., change 'Java' to 'Unity' if the job requires Unity).",
    "The company name, role title, and dates MUST remain unchanged.",
    jobDescription ? `\nJob Description Keywords:\n${jobDescription}\n` : "",
    `Candidate's Current Experience:\nCompany: ${experience.company}\nRole: ${experience.role}\nHighlights: ${experience.highlights.join("; ")}\n`,
    "\nNew Experience Highlights Rules:",
    "- Return 3-5 bullet points, each under 25 words.",
    "- Start every bullet point with a strong action verb (e.g., Led, Engineered, Optimized).",
    "- Quantify achievements with metrics wherever possible (e.g., 'Increased user engagement by 25%').",
    "- Seamlessly integrate keywords and technologies from the job description.",
    "- Make the candidate appear to be the ideal person for THIS job.",
    "- Output ONLY the bullet points, one per line.",
    "- DO NOT use bold text, markdown, asterisks, or any special formatting.",
    "- DO NOT include introductions or conclusions, only the bullet points.",
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Generate prompt for extracting keywords from job description
 */
export const createKeywordExtractionPrompt = (jobDescription: string): string => {
  return [
    "You are an expert ATS parser. Your task is to extract all valuable keywords from the job description below.",
    "Focus on the 'Requirements', 'Skills', 'Qualifications', and 'What you'll do' sections.",
    "Extract all technical skills (e.g., React, Python, AWS), tools (e.g., Jira, Figma), methodologies (e.g., Agile, Scrum), and important soft skills (e.g., leadership, communication).",
    "Ignore company boilerplate, benefits, and equal opportunity statements.",
    "Return the keywords as a single, comma-separated list.",
    "Do not include any numbering, commentary, or introductory text.",
    `Job Description:\n"""\n${jobDescription}\n"""`,
  ].join("\n")
}

/**
 * Generate prompt for adapting summary to job requirements
 */
export const createSummaryAdaptationPrompt = (
  summary: string,
  keywords: string[]
): string => {
  return [
    "You are a resume writer, rewriting a professional summary to pass an ATS scan for a specific job.",
    "Your task is to naturally weave the following keywords into the summary:",
    `Keywords: ${keywords.slice(0, 8).join(", ")}`,
    `\nCurrent Summary: "${summary}"`,
    "\nRewrite the summary to be confident and results-oriented, demonstrating direct experience with the required skills.",
    "The new summary must be under 80 words and a maximum of 3 sentences.",
    "Rules:",
    "- DO NOT use bullet points, bold text, markdown, or asterisks.",
    "- DO NOT use generic introductions.",
    "- Write in plain text only, focusing on specific accomplishments.",
  ].join("\n")
}

/**
 * Generate prompt for CV import/parsing
 */
export const createCVImportPrompt = (resumeText: string): string => {
  const exampleStructure = {
    personal: {
      fullName: "John Doe",
      title: "Software Engineer",
      summary: "Brief professional summary",
      email: "john@example.com",
      phone: "+1234567890",
      location: "City, Country",
      website: "https://example.com",
      linkedin: "https://linkedin.com/in/johndoe",
    },
    experience: [
      {
        id: "exp1",
        role: "Senior Engineer",
        company: "Tech Corp",
        location: "San Francisco",
        startDate: "Jan 2020",
        endDate: "Present",
        highlights: ["Led team of 5 engineers", "Increased performance by 40%"],
      },
    ],
    education: [
      {
        id: "edu1",
        school: "University Name",
        degree: "Bachelor of Science in Computer Science",
        location: "City",
        startDate: "2015",
        endDate: "2019",
        highlights: ["GPA: 3.8"],
      },
    ],
    projects: [
      {
        id: "proj1",
        name: "Project Name",
        summary: "Brief description",
        link: "https://github.com/user/repo",
        highlights: ["Built with React", "10k+ users"],
      },
    ],
    skills: ["JavaScript", "Python", "React"],
    certifications: ["AWS Certified"],
    languages: ["English", "Spanish"],
  }

  return [
    "You are an expert resume parser. Extract ALL available information from the resume below.",
    "",
    "OUTPUT FORMAT: Return ONLY a valid JSON object with this exact structure:",
    JSON.stringify(exampleStructure, null, 2),
    "",
    "EXTRACTION RULES:",
    "1. Focus ONLY on the resume text provided between the '---' markers.",
    "2. Extract the person's real name for 'fullName' (never use a placeholder).",
    "3. Extract the person's real email for 'email' (must be a valid email format).",
    "4. Extract their job title/role for 'title'.",
    "5. Extract the professional summary/objective for 'summary'.",
    "6. Extract ALL job positions with their descriptions into the 'experience' array.",
    "7. Extract ALL education entries into the 'education' array.",
    "8. Extract ALL projects into the 'projects' array.",
    "9. Extract ALL technical skills into the 'skills' array.",
    "10. Extract certifications if present into the 'certifications' array.",
    "11. Extract languages if present into the 'languages' array.",
    "",
    "IMPORTANT:",
    "- Return ONLY the JSON object, no markdown fences, no explanations",
    "- Use empty string \"\" for missing text fields (never null)",
    "- Use empty array [] for missing list fields (never null)",
    "- Preserve all bullet points from work experience as separate items in highlights array",
    "- Keep dates in simple format: 'Jan 2023', '2020', or 'Present'",
    "- Be thorough - extract every detail you can find",
    "",
    "RESUME TO PARSE:",
    "---",
    resumeText,
    "---",
  ].join("\n")
}

/**
 * Generate prompt for ATS optimization
 */
export const createATSOptimizationPrompt = (cv: CVData): string => {
  return [
    "You are an expert ATS (Applicant Tracking System) optimization specialist.",
    "Your task is to rewrite the provided CV to maximize its chances of passing through an ATS while maintaining professionalism.",
    "",
    "ATS Optimization Rules:",
    "1. Use simple, standard section headings (Experience, Education, Skills)",
    "2. Include relevant keywords and industry-standard terminology",
    "3. Use action verbs at the start of bullet points (Led, Developed, Implemented, Managed, etc.)",
    "4. Quantify achievements with numbers, percentages, and metrics whenever possible",
    "5. Remove special characters, graphics descriptions, and complex formatting",
    "6. Use standard job titles and clear role descriptions",
    "7. Include relevant technical skills and tools",
    "8. Make content scannable with clear, concise language",
    "9. Ensure consistency in date formats and structure",
    "10. Optimize for keyword matching without 'keyword stuffing'.",
    "",
    "Current CV Data (JSON):",
    JSON.stringify(cv, null, 2),
    "",
    "Your final output MUST be the optimized CV in the specified JSON format.",
    "Follow these output requirements strictly:",
    "- Return ONLY a valid JSON object with the same structure as the input.",
    "- Use empty string \"\" for missing text fields (NEVER null).",
    "- Use empty array [] for missing list fields (NEVER null).",
    "- Preserve all IDs and date formats.",
    "- Rewrite the summary and experience highlights to be keyword-rich, start with action verbs, and include metrics.",
  ].join("\n")
}

/**
 * Generate prompt for photo analysis
 */
export const createPhotoAnalysisPrompt = (): string => {
  return `Analyze this person's photo and determine if it's professional enough for a CV/resume. 
    
A professional photo should have:
- Professional attire (suit, blazer, or formal business wear)
- Neutral, clean background (solid colors like white, gray, or blue)
- Good lighting and clarity
- Professional expression
- Head and shoulders composition

Describe this photo in detail, including the person's appearance, what they're wearing, the background, lighting, and pose. Then explain what specific changes would make it more professional. Be very specific and detailed in your description.`
}

/**
 * Generate prompt for professional photo generation
 */
export const createPhotoGenerationPrompt = (): string => {
  return `Professional corporate headshot photograph for CV and resume. Create a high-quality professional headshot with these characteristics:
- Professional business attire: dark suit jacket, white or light blue dress shirt, professional appearance
- Clean solid background: soft neutral color (light gray, white, or soft blue)
- Professional studio lighting: even, soft lighting with no harsh shadows
- Expression: confident, approachable, slight professional smile
- Composition: head and shoulders, centered, facing camera
- Style: photorealistic, high quality, sharp focus, professional photography
- Image quality: 4K resolution, studio quality

Based on the original photo analysis: The person should maintain similar general features and characteristics while presenting in a completely professional corporate style.`
}

/**
 * Generate prompt for internship subject suggestions with explanations
 */
export const createInternshipSubjectSuggestionsPrompt = (
  internshipText: string,
  cvData: CVData
): string => {
  const cvSummary = `
Candidate Profile:
- Name: ${cvData.personal.fullName}
- Title: ${cvData.personal.title}
- Summary: ${cvData.personal.summary}
- Skills: ${cvData.skills.join(", ")}
- Recent Experience: ${cvData.experience.slice(0, 2).map(exp => `${exp.role} at ${exp.company}`).join("; ")}
- Education: ${cvData.education.slice(0, 2).map(edu => `${edu.degree} from ${edu.school}`).join("; ")}
  `.trim()

  return [
    "You are a career advisor analyzing an internship opportunity for a candidate.",
    "",
    "INTERNSHIP DOCUMENT:",
    "```",
    internshipText,
    "```",
    "",
    "CANDIDATE CV:",
    "```",
    cvSummary,
    "```",
    "",
    "Your task is to analyze the internship document and suggest 1-4 internship subjects that are a strong match for the candidate's profile.",
    "",
    "IMPORTANT: You must also extract the company's contact email address and name from the document.",
    "",
    "Generate a JSON object with the following structure:",
    "- **subjects**: An array of suggested subjects. Each object in the array must contain:",
    "  - **subject**: A concise, professional internship subject/title (max 15 words).",
    "  - **explanation**: A clear, 2-3 sentence explanation of WHY this subject is a strong fit. Frame the explanation to highlight the candidate's strengths for the role, referencing their specific skills, experience, or education.",
    "- **companyEmail**: The contact email address found in the document (return null if not found).",
    "- **companyName**: The company name from the document (return null if not found).",
    "",
    "Example JSON Output:",
    "{",
    '  "subjects": [',
    "    {",
    '      "subject": "...",',
    '      "explanation": "..."',
    "    }",
    "  ],",
    '  "companyEmail": "email@company.com or null",',
    '  "companyName": "Company Name or null"',
    "}",
    "",
    "Rules:",
    "- Suggest subjects from most to least relevant.",
    "- Each explanation must be specific and reference the candidate's actual CV.",
    "- Keep subjects professional and realistic.",
    "- Extract the EXACT email address and company name as they appear.",
    "- Return ONLY the JSON object, with no other text or markdown.",
  ].join("\n")
}

/**
 * Generate prompt for creating professional emails for a specific internship subject
 */
export const createInternshipEmailGenerationPrompt = (
  internshipText: string,
  cvData: CVData,
  selectedSubject: string
): string => {
  const cvSummary = `
Candidate Profile:
- Name: ${cvData.personal.fullName}
- Title: ${cvData.personal.title}
- Summary: ${cvData.personal.summary}
- Email: ${cvData.personal.email}
- Phone: ${cvData.personal.phone}
- Location: ${cvData.personal.location}
- Skills: ${cvData.skills.join(", ")}
- Recent Experience: ${cvData.experience.slice(0, 2).map(exp => `${exp.role} at ${exp.company}`).join("; ")}
- Education: ${cvData.education.slice(0, 2).map(edu => `${edu.degree} from ${edu.school}`).join("; ")}
  `.trim()

  return [
    "You are a professional email writer helping a candidate apply for an internship.",
    "",
    "INTERNSHIP DOCUMENT:",
    "```",
    internshipText,
    "```",
    "",
    "CANDIDATE CV:",
    "```",
    cvSummary,
    "```",
    "",
    `SELECTED INTERNSHIP SUBJECT: ${selectedSubject}`,
    "",
    "Generate TWO professional emails in a single JSON object:",
    "",
    "1. **applicantEmail**: The email the candidate will send to apply for the internship.",
    "   - **Subject Line**: Must be professional and specific to the internship.",
    "   - **Body**: 200-300 words, addressed to 'Dear Hiring Manager' if no name is available.",
    "   - **Content**: Introduce the candidate, express genuine interest, and highlight 2-3 key skills/experiences from their CV that directly match the internship requirements.",
    "   - **Signature**: Must include the candidate's full name and contact information.",
    "   - **Tone**: Enthusiastic and professional.",
    "",
    "2. **companyEmail**: A formal email template for general company correspondence.",
    "   - **Subject Line**: A generic but professional subject.",
    "   - **Body**: 150-250 words, with a standard professional structure (greeting, body, closing).",
    "   - **Tone**: Clean, polished, and suitable for any formal business communication.",
    "",
    "Return ONLY a valid JSON object with this exact structure:",
    "{",
    '  "applicantEmail": "Subject: [Your Subject Here]\\n\\nDear Hiring Manager,\\n\\n...",',
    '  "companyEmail": "Subject: [Your Subject Here]\\n\\nDear [Recipient Name],\\n\\n..."',
    "}",
    "",
    "DO NOT include markdown formatting, code blocks, or any explanatory text. Return ONLY the JSON object.",
  ].join("\n")
}

/**
 * Generate prompt for internship analysis and email generation (DEPRECATED - kept for backwards compatibility)
 */
export const createInternshipAnalysisPrompt = (
  internshipText: string,
  cvData: CVData
): string => {
  const cvSummary = `
Candidate Profile:
- Name: ${cvData.personal.fullName}
- Title: ${cvData.personal.title}
- Summary: ${cvData.personal.summary}
- Skills: ${cvData.skills.join(", ")}
- Recent Experience: ${cvData.experience.slice(0, 2).map(exp => `${exp.role} at ${exp.company}`).join("; ")}
- Education: ${cvData.education.slice(0, 2).map(edu => `${edu.degree} from ${edu.school}`).join("; ")}
  `.trim()

  return [
    "You are a career advisor helping a candidate apply for an internship.",
    "",
    "INTERNSHIP DOCUMENT:",
    "```",
    internshipText,
    "```",
    "",
    "CANDIDATE CV:",
    "```",
    cvSummary,
    "```",
    "",
    "Your task is to analyze the internship offer and the candidate's CV, then generate THREE outputs in a single, valid JSON object:",
    "",
    "1. **suggestedSubject**: A concise, professional internship subject/title that strongly matches the candidate's profile (1 sentence, max 15 words).",
    "",
    "2. **applicantEmail**: A professional, 200-300 word email for the candidate to send. It must include:",
    "   - A professional subject line.",
    "   - A proper greeting ('Dear Hiring Manager,' if no name is available).",
    "   - An introduction expressing genuine interest.",
    "   - A body highlighting 2-3 relevant skills/experiences from the CV that match the internship.",
    "   - A closing with the candidate's contact information.",
    "",
    "3. **companyEmail**: A clean, 150-250 word professional email template suitable for any formal company correspondence.",
    "",
    "CRITICAL: Return ONLY a valid JSON object with the specified structure. Do not include any markdown, code blocks, or explanatory text.",
    "Example JSON structure:",
    "{",
    '  "suggestedSubject": "...",',
    '  "applicantEmail": "...",',
    '  "companyEmail": "..."',
    "}",
  ].join("\n")
}
