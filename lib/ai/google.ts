/**
 * Google Gemini AI Integration (Legacy Compatibility Layer)
 * 
 * This file maintains backward compatibility while the codebase is being refactored.
 * All functionality has been moved to modular components in the ./gemini/ directory.
 * 
 * @deprecated Import from './gemini' directly for new code
 * @see ./gemini/index.ts for the new modular structure
 */

// Re-export everything from the new modular structure
export {
  isGenAIConfigured,
  enhanceSummaryWithAI,
  enhanceExperienceWithAI,
  adaptCVWithAI,
  importCVWithAI,
  optimizeCVForATS,
  generateProfessionalPhoto,
} from "./gemini"
