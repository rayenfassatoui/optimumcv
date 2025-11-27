export interface AIConfig {
  provider: "gemini" | "openrouter"
  apiKey?: string
  model?: string
  siteUrl?: string
  siteName?: string
}

export interface AIRequestOptions {
  config?: AIConfig
}
