import { OpenRouter } from "@openrouter/sdk"
import { AIConfig } from "../types"

export const createOpenRouterClient = (config: AIConfig) => {
  if (!config.apiKey) {
    throw new Error("OpenRouter API Key is required")
  }

  return new OpenRouter({
    apiKey: config.apiKey,
    defaultHeaders: {
      "HTTP-Referer": config.siteUrl || "https://cv.rayenft.dev/",
      "X-Title": config.siteName || "OptimumCV",
    },
  } as any)
}

export const generateTextWithOpenRouter = async (
  prompt: string,
  config: AIConfig
): Promise<string> => {
  const client = createOpenRouterClient(config)
  const model = config.model || "openai/gpt-3.5-turbo"

  try {
    // Use streaming to get complete response with usage info
    const stream = await client.chat.send({
      model,
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      stream: true,
      streamOptions: {
        includeUsage: true,
      },
    })

    let response = ""
    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content
      if (content) {
        response += content
      }
    }

    return response.trim()
  } catch (error) {
    console.error("OpenRouter API Error:", error)
    throw error
  }
}
