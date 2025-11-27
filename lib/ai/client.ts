import { generateTextWithGemini } from "./gemini/client"
import { generateTextWithOpenRouter } from "./openrouter/client"
import { AIConfig } from "./types"

/**
 * Generate text using the configured AI provider
 * @param prompt - The prompt to send to the AI
 * @param config - Optional configuration to override defaults
 * @returns The generated text
 */
export const generateText = async (
  prompt: string,
  config?: AIConfig
): Promise<string> => {
  if (config?.provider === "openrouter") {
    return generateTextWithOpenRouter(prompt, config)
  }

  // Default to Gemini
  return generateTextWithGemini(prompt)
}
