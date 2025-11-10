# Google Gemini AI Integration

This directory contains the modular Google Gemini AI integration for OptimumCV, providing AI-powered CV enhancement, adaptation, import, and optimization features.

## 📁 Project Structure

```
lib/ai/gemini/
├── index.ts              # Main exports and public API
├── client.ts             # AI client configuration and initialization
├── text-utils.ts         # Text processing utilities
├── prompt-templates.ts   # AI prompt templates
├── cv-enhancer.ts        # CV enhancement functions
├── cv-adapter.ts         # CV job adaptation functions
├── cv-importer.ts        # CV import and parsing
├── cv-optimizer.ts       # ATS optimization
└── photo-generator.ts    # Professional photo generation
```

## 🎯 Core Modules

### **client.ts**
Manages Google Gemini AI client initialization and text generation.

```typescript
import { ensureClient, generateText, isGenAIConfigured } from './gemini/client'

// Check if AI is configured
if (isGenAIConfigured()) {
  const response = await generateText("Your prompt here")
}
```

**Key Functions:**
- `ensureClient()` - Initialize and return AI client
- `generateText(prompt)` - Generate text from prompt
- `isGenAIConfigured()` - Check if API key is set
- `getVisionModel()` - Get vision model name
- `getImageGenModel()` - Get image generation model name

---

### **text-utils.ts**
Utility functions for text processing and manipulation.

```typescript
import { sanitizeBullet, extractKeywords, titleCase } from './gemini/text-utils'

const keywords = extractKeywords(jobDescription, 10)
const cleaned = sanitizeBullet("- Led a team of 5 engineers")
const title = titleCase("software engineer")
```

**Key Functions:**
- `sanitizeBullet(text)` - Remove bullet markers
- `dedupe(array)` - Remove duplicates
- `titleCase(text)` - Convert to title case
- `extractKeywords(text, max)` - Extract keywords from text
- `stripCodeFences(text)` - Remove markdown code blocks
- `extractJsonObject(text)` - Extract JSON from AI response
- `mergeSkills(current, new, max)` - Merge skill arrays

---

### **prompt-templates.ts**
All AI prompt templates in one place for easy maintenance.

```typescript
import { createSummaryEnhancementPrompt } from './gemini/prompt-templates'

const prompt = createSummaryEnhancementPrompt(summary, context)
```

**Key Functions:**
- `createSummaryEnhancementPrompt()` - Enhance professional summary
- `createExperienceEnhancementPrompt()` - Enhance work experience
- `createKeywordExtractionPrompt()` - Extract job keywords
- `createSummaryAdaptationPrompt()` - Adapt summary to job
- `createCVImportPrompt()` - Parse CV from text
- `createATSOptimizationPrompt()` - Optimize for ATS
- `createPhotoAnalysisPrompt()` - Analyze photo quality
- `createPhotoGenerationPrompt()` - Generate professional photo

---

### **cv-enhancer.ts**
Functions to enhance CV content using AI.

```typescript
import { enhanceSummaryWithAI, enhanceExperienceWithAI } from './gemini'

const enhanced = await enhanceSummaryWithAI(summary, "Software Engineer")
const betterExp = await enhanceExperienceWithAI(experience, jobDescription)
```

**Key Functions:**
- `enhanceSummaryWithAI(summary, context)` - Polish professional summary
- `enhanceExperienceWithAI(experience, jobDesc, keywords)` - Enhance work experience with action verbs and metrics

---

### **cv-adapter.ts**
Adapt CV to specific job requirements.

```typescript
import { adaptCVWithAI } from './gemini'

const adapted = await adaptCVWithAI(currentCV, jobDescription)
```

**Key Functions:**
- `adaptCVWithAI(cv, jobDescription)` - Tailor entire CV to match job requirements

**Features:**
- Extracts keywords from job description
- Adapts summary to highlight relevant skills
- Rewrites experience to emphasize matching technologies
- Updates skills list with job-relevant terms

---

### **cv-importer.ts**
Parse and structure CV from raw text.

```typescript
import { importCVWithAI } from './gemini'

const structuredCV = await importCVWithAI(resumeText)
```

**Key Functions:**
- `importCVWithAI(resumeText)` - Parse resume text into structured CV data

**Features:**
- Extracts all sections (personal, experience, education, etc.)
- Validates and sanitizes data
- Ensures all required fields are present
- Auto-generates IDs for list items

---

### **cv-optimizer.ts**
Optimize CV for Applicant Tracking Systems (ATS).

```typescript
import { optimizeCVForATS } from './gemini'

const optimized = await optimizeCVForATS(currentCV)
```

**Key Functions:**
- `optimizeCVForATS(cv)` - Make CV ATS-friendly

**Optimization Rules:**
1. Simple, standard section headings
2. Industry-standard keywords
3. Action verbs at bullet start
4. Quantified achievements
5. No special characters
6. Standard job titles
7. Technical skills included
8. Clear, concise language
9. Consistent date formats
10. Keyword optimization without stuffing

---

### **photo-generator.ts**
Generate professional headshots using AI.

```typescript
import { generateProfessionalPhoto } from './gemini'

const photoUrl = await generateProfessionalPhoto(uploadedFile)
```

**Key Functions:**
- `generateProfessionalPhoto(file)` - Create professional headshot from uploaded photo

**Features:**
- Analyzes original photo
- Generates professional corporate headshot
- Maintains person's features
- Adds professional attire and background
- Requires paid Google AI plan

---

## 🚀 Usage Examples

### Basic Enhancement
```typescript
import { enhanceSummaryWithAI } from './gemini'

const summary = "I'm a developer with some experience"
const enhanced = await enhanceSummaryWithAI(summary, "Senior Software Engineer")
// "Results-driven software engineer with proven expertise..."
```

### Job Adaptation
```typescript
import { adaptCVWithAI } from './gemini'

const jobPosting = `
  Looking for React developer with TypeScript, Node.js...
`

const tailoredCV = await adaptCVWithAI(myCV, jobPosting)
// CV now emphasizes React, TypeScript, Node.js
```

### ATS Optimization
```typescript
import { optimizeCVForATS } from './gemini'

const atsReady = await optimizeCVForATS(myCV)
// All highlights now start with action verbs
// Keywords added, metrics included
```

### CV Import
```typescript
import { importCVWithAI } from './gemini'

const rawText = "John Doe\nSoftware Engineer\n..."
const structured = await importCVWithAI(rawText)
// Returns fully structured CVData object
```

## 🔧 Configuration

Set your Google Gemini API key:

```bash
GOOGLE_GENAI_API_KEY=your_api_key_here
```

Get your API key at: https://aistudio.google.com/

## 📊 Models Used

- **Text Generation:** `gemini-2.5-flash-lite` (Free tier)
- **Vision Analysis:** `gemini-2.0-flash-exp` (Free tier)
- **Image Generation:** `gemini-2.5-flash-image` (Paid tier)

## 🎨 Architecture Benefits

### ✅ **Separation of Concerns**
Each module has a single, well-defined responsibility:
- Client management separate from business logic
- Prompts isolated from execution
- Utilities reusable across modules

### ✅ **Testability**
- Easy to mock individual modules
- Unit test each function independently
- Clear dependencies

### ✅ **Maintainability**
- Change prompts without touching logic
- Update utilities without affecting AI calls
- Add new features without refactoring old code

### ✅ **Reusability**
- Import only what you need
- Utilities work standalone
- Prompts can be used with different clients

### ✅ **Type Safety**
- Strong TypeScript types throughout
- CVData schema validation
- Clear function signatures

## 🔄 Migration Guide

### Old Way (Deprecated)
```typescript
import { enhanceSummaryWithAI } from '@/lib/ai/google'
```

### New Way (Recommended)
```typescript
import { enhanceSummaryWithAI } from '@/lib/ai/gemini'
```

The old `google.ts` file still works but is now a compatibility layer that re-exports from the new modular structure.

## 🧪 Testing

```typescript
// Mock the client for testing
jest.mock('./gemini/client', () => ({
  generateText: jest.fn().mockResolvedValue('mocked response'),
  isGenAIConfigured: jest.fn().mockReturnValue(true),
}))

// Test your functions
import { enhanceSummaryWithAI } from './gemini'
const result = await enhanceSummaryWithAI('test summary')
```

## 📝 Best Practices

1. **Always check configuration** before making AI calls
2. **Handle errors gracefully** - AI calls can fail
3. **Use fallback functions** when AI is unavailable
4. **Cache results** when appropriate
5. **Monitor API usage** to avoid quota issues
6. **Log important operations** for debugging

## 🤝 Contributing

When adding new AI features:

1. Create a new module file if it's a distinct feature area
2. Add prompt templates to `prompt-templates.ts`
3. Add utilities to `text-utils.ts` if reusable
4. Export from `index.ts` for public API
5. Update this README with examples
6. Add TypeScript types
7. Write tests

## 📚 Related Files

- `/lib/ai/mock.ts` - Fallback implementations when AI is unavailable
- `/app/api/ai/route.ts` - API endpoints that use these functions
- `/lib/cv.ts` - CV data types and schemas

---

**Built with ❤️ for OptimumCV**
