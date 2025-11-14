import type { CVData, ExperienceItem } from "@/lib/cv"

/**
 * Generate prompt for enhancing a professional summary
 */
export const createSummaryEnhancementPrompt = (
  summary: string,
  context?: string
): string => {
  return [
    "You are a career coach polishing a professional summary.",
    context ? `Context: ${context}` : "",
    "Rewrite the summary to sound confident, results-oriented, and concise (max 3 sentences, under 75 words).",
    "Avoid bullet points, bold text, markdown formatting, and generic introductions.",
    "Write in plain text only. Be direct and specific.",
    `Summary: """${summary}"""`,
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
    "You are a creative resume writer helping adapt a candidate's experience to match a job posting.",
    "IMPORTANT: You must strategically rewrite the experience to emphasize relevant technologies and skills from the job description.",
    "Feel free to:",
    "- Replace or add technologies/frameworks mentioned in the job (e.g., change 'Java' to 'Unity' if job requires Unity)",
    "- Emphasize skills that match the job requirements",
    "- Make the candidate appear highly qualified for THIS specific role",
    "- Keep the company name, role title, and dates UNCHANGED",
    jobDescription ? `\nJob Requirements/Description:\n${jobDescription}\n` : "",
    `Current Experience Entry:\nCompany: ${experience.company}\nRole: ${experience.role}\nCurrent Highlights: ${experience.highlights.join("; ")}\n`,
    "\nRules:",
    "- Return 3-5 bullet points, each under 25 words",
    "- Start each bullet with a strong action verb",
    "- Include specific technologies/skills from the job description naturally",
    "- Focus on measurable outcomes and impact",
    "- Make it sound like this person is PERFECT for the target job",
    "- DO NOT use bold text, markdown formatting, asterisks, or any special formatting",
    "- Write in plain text only, no introductions or conclusions",
    "- Return ONLY the bullet points, one per line, no numbering or special characters",
  ]
    .filter(Boolean)
    .join("\n")
}

/**
 * Generate prompt for extracting keywords from job description
 */
export const createKeywordExtractionPrompt = (jobDescription: string): string => {
  return [
    "Extract ALL technical skills, frameworks, programming languages, tools, and methodologies from this job description.",
    "Include both hard technical skills (e.g., React, Python, AWS) and soft skills (e.g., leadership, agile).",
    "Return them as a comma-separated list of keywords without any numbering, commentary, or extra text.",
    `Job description:\n${jobDescription}`,
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
    "Rewrite this professional summary to make the candidate seem PERFECT for a job requiring these skills:",
    keywords.slice(0, 8).join(", "),
    "\nCurrent summary:",
    summary,
    "\nMake it confident, results-oriented, and clearly demonstrate experience with the required technologies.",
    "Keep it under 80 words and 3 sentences maximum.",
    "DO NOT use bullet points, bold text, markdown formatting, asterisks, or generic introductions.",
    "Write in plain text only. Be direct and specific about accomplishments.",
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
    "1. Extract the person's real name from the resume → use for 'fullName' (never use placeholder)",
    "2. Extract the person's real email → use for 'email' (must be valid email format)",
    "3. Extract job title/role → use for 'title'",
    "4. Extract professional summary/objective → use for 'summary'",
    "5. Extract ALL job positions with their descriptions → add to 'experience' array",
    "6. Extract ALL education entries → add to 'education' array",
    "7. Extract ALL projects → add to 'projects' array",
    "8. Extract ALL technical skills → add to 'skills' array",
    "9. Extract certifications if present → add to 'certifications' array",
    "10. Extract languages if present → add to 'languages' array",
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
    "Your task is to optimize the entire CV to be ATS-friendly while maintaining professionalism and impact.",
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
    "10. Optimize for keyword matching without keyword stuffing",
    "",
    "Current CV Data:",
    JSON.stringify(cv, null, 2),
    "",
    "IMPORTANT OUTPUT REQUIREMENTS:",
    "- Return ONLY a valid JSON object with the same structure as CVData schema",
    "- Use empty string \"\" for missing text fields (NEVER use null)",
    "- Use empty array [] for missing list fields (NEVER use null)",
    "- Preserve the exact structure of the input CV",
    "- Keep all IDs unchanged",
    "- Ensure all date fields are strings (use \"\" if no date available)",
    "",
    "Optimization Tasks:",
    "- Enhance the summary to be keyword-rich and results-focused",
    "- Rewrite experience highlights to start with strong action verbs and include metrics",
    "- Optimize skills list with industry-standard terms",
    "- Ensure all text is clear, professional, and ATS-scannable",
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
    "Your task is to analyze the internship and suggest ALL possible internship subjects that match the candidate's profile.",
    "",
    "IMPORTANT: Also extract the company contact email address from the internship document if present.",
    "",
    "Generate a JSON object with:",
    "- **subjects**: Array of 1-4 suggested subjects, each with:",
    "  - **subject**: A concise, professional internship subject/title (max 15 words)",
    "  - **explanation**: A clear explanation (2-3 sentences) of WHY this subject fits the candidate's CV, mentioning specific skills, experience, technologies, or education that make them a good match",
    "- **companyEmail**: The contact email address found in the internship document (or null if not found)",
    "- **companyName**: The company name from the document (or null if not found)",
    "",
    "Return ONLY a valid JSON object with this exact structure:",
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
    "- Suggest subjects from most relevant to least relevant",
    "- Each explanation must be specific and reference actual items from the candidate's CV",
    "- Be honest about the match - explain both strengths and potential growth areas",
    "- Keep subjects professional and realistic",
    "- Extract the EXACT email address as it appears in the document",
    "- Return ONLY the JSON object, no other text or markdown",
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
    "Generate TWO professional emails in JSON format:",
    "",
    "1. **applicantEmail**: The email the candidate will send to apply for this internship:",
    "   - Subject line: Professional and specific to the internship",
    "   - Body: 200-300 words",
    "   - Format: Include 'Subject: ...' at the top, then the full email body",
    "   - Address appropriately (use 'Dear Hiring Manager' if no specific name)",
    "   - Introduce the candidate with enthusiasm",
    "   - Highlight 2-3 relevant skills/experiences that match the internship",
    "   - Express genuine interest in the role",
    "   - Include contact information in signature",
    "   - Professional, enthusiastic tone",
    "",
    "2. **companyEmail**: A template for formal company correspondence:",
    "   - Subject line: Generic professional subject",
    "   - Body: 150-250 words",
    "   - Format: Include 'Subject: ...' at the top, then the full email body",
    "   - Professional structure with greeting, body, and closing",
    "   - Suitable for formal business communication",
    "   - Clean, polished, and professional",
    "",
    "Return ONLY a valid JSON object with this exact structure:",
    "{",
    '  "applicantEmail": "Subject: ...\\n\\nDear ...",',
    '  "companyEmail": "Subject: ...\\n\\nDear ..."',
    "}",
    "",
    "DO NOT include markdown formatting, code blocks, or explanatory text. Return ONLY the JSON object.",
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
    "Your task is to analyze the internship offer and the candidate's CV, then generate THREE outputs in a specific JSON format:",
    "",
    "1. **suggestedSubject**: A concise, professional internship subject/title that matches the candidate's profile (1 sentence, max 15 words)",
    "",
    "2. **applicantEmail**: A professional email the candidate can send to apply for this internship. The email should:",
    "   - Have a professional subject line",
    "   - Be addressed appropriately (use 'Dear Hiring Manager' if no specific name)",
    "   - Introduce the candidate and express genuine interest",
    "   - Highlight 2-3 relevant skills/experiences that match the internship",
    "   - Include the candidate's contact information",
    "   - Be enthusiastic but professional",
    "   - Be 200-300 words",
    "",
    "3. **companyEmail**: A clean, professional email template for company correspondence. This should:",
    "   - Be a generic professional template suitable for formal company communication",
    "   - Have proper structure with greeting, body, and closing",
    "   - Be professional and polished",
    "   - Be 150-250 words",
    "",
    "CRITICAL: Return ONLY a valid JSON object with exactly this structure, no other text:",
    "{",
    '  "suggestedSubject": "...",',
    '  "applicantEmail": "...",',
    '  "companyEmail": "..."',
    "}",
    "",
    "DO NOT include any markdown formatting, code blocks, or explanatory text. Return ONLY the JSON object.",
  ].join("\n")
}
