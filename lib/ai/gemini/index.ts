/**
 * Google Gemini AI Integration
 * 
 * This module provides AI-powered CV enhancement, adaptation, import, and optimization features
 * using Google's Gemini API.
 * 
 * @module ai/gemini
 */

// Client configuration
export { isGenAIConfigured } from "./client"

// CV Enhancement
export { enhanceSummaryWithAI, enhanceExperienceWithAI } from "./cv-enhancer"

// CV Adaptation
export { adaptCVWithAI } from "./cv-adapter"

// CV Import
export { importCVWithAI } from "./cv-importer"

// ATS Optimization
export { optimizeCVForATS } from "./cv-optimizer"

// Photo Generation
export { generateProfessionalPhoto } from "./photo-generator"

// Utility functions (if needed externally)
export { extractKeywords, titleCase, mergeSkills } from "./text-utils"
