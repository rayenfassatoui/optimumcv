"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { useAIConfig } from "@/contexts/ai-config-context"
import { toast } from "sonner"
import Link from "next/link"
import { ArrowLeft, Save } from "lucide-react"

export default function SettingsPage() {
    const { config, setConfig } = useAIConfig()
    const [provider, setProvider] = useState<"gemini" | "openrouter">(config?.provider || "gemini")
    const [apiKey, setApiKey] = useState(config?.apiKey || "")
    const [model, setModel] = useState(config?.model || "")

    const handleSave = () => {
        setConfig({
            provider,
            apiKey: apiKey || undefined,
            model: provider === "openrouter" ? model : undefined,
        })
        toast.success("AI configuration saved successfully!")
    }

    return (
        <div className="min-h-screen bg-background">
            <nav className="sticky top-0 z-50 flex items-center justify-between border-b bg-background/95 px-6 py-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 sm:px-10 lg:px-20">
                <Button variant="ghost" size="sm" asChild>
                    <Link href="/">
                        <ArrowLeft className="mr-2 h-4 w-4" />
                        Back to CV Builder
                    </Link>
                </Button>
            </nav>

            <main className="mx-auto max-w-4xl px-6 py-16 sm:px-10">
                <div className="space-y-8">
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Settings</h1>
                        <p className="text-muted-foreground mt-2">
                            Configure your AI provider and preferences
                        </p>
                    </div>

                    <Card>
                        <CardHeader>
                            <CardTitle>AI Configuration</CardTitle>
                            <CardDescription>
                                Choose your preferred AI provider. Gemini is used by default. If you want to use your own AI model, select OpenRouter and provide your API key.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="provider">Provider</Label>
                                <Select
                                    value={provider}
                                    onValueChange={(v: "gemini" | "openrouter") => {
                                        setProvider(v)
                                        setApiKey("") // Clear API key when switching provider
                                    }}
                                >
                                    <SelectTrigger id="provider">
                                        <SelectValue placeholder="Select provider" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="gemini">Gemini (Default)</SelectItem>
                                        <SelectItem value="openrouter">OpenRouter (Custom)</SelectItem>
                                    </SelectContent>
                                </Select>
                                {provider === "gemini" && (
                                    <div className="mt-4 space-y-2">
                                        <Label htmlFor="geminiApiKey">Gemini API Key (Optional)</Label>
                                        <Input
                                            id="geminiApiKey"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="Leave empty to use server default"
                                            type="password"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Get your API key from{" "}
                                            <a
                                                href="https://aistudio.google.com/app/apikey"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                Google AI Studio
                                            </a>
                                        </p>
                                    </div>
                                )}
                            </div>

                            {provider === "openrouter" && (
                                <>
                                    <div className="space-y-2">
                                        <Label htmlFor="apiKey">OpenRouter API Key</Label>
                                        <Input
                                            id="apiKey"
                                            value={apiKey}
                                            onChange={(e) => setApiKey(e.target.value)}
                                            placeholder="sk-or-v1-..."
                                            type="password"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Get your API key from{" "}
                                            <a
                                                href="https://openrouter.ai/keys"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                openrouter.ai/keys
                                            </a>
                                        </p>
                                    </div>

                                    <div className="space-y-2">
                                        <Label htmlFor="model">Model</Label>
                                        <Input
                                            id="model"
                                            value={model}
                                            onChange={(e) => setModel(e.target.value)}
                                            placeholder="openai/gpt-4o"
                                        />
                                        <p className="text-sm text-muted-foreground">
                                            Examples: <code className="text-xs bg-muted px-1 py-0.5 rounded">openai/gpt-4o</code>,{" "}
                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">anthropic/claude-3.5-sonnet</code>,{" "}
                                            <code className="text-xs bg-muted px-1 py-0.5 rounded">x-ai/grok-4.1-fast:free</code>
                                        </p>
                                        <p className="text-sm text-muted-foreground">
                                            Browse all models at{" "}
                                            <a
                                                href="https://openrouter.ai/models"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="text-primary underline"
                                            >
                                                openrouter.ai/models
                                            </a>
                                        </p>
                                    </div>
                                </>
                            )}

                            <Button onClick={handleSave} className="w-full sm:w-auto">
                                <Save className="mr-2 h-4 w-4" />
                                Save Configuration
                            </Button>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Current Configuration</CardTitle>
                            <CardDescription>Your active AI settings</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-muted-foreground">Provider</p>
                                    <p className="font-medium">{config?.provider || "Not configured"}</p>
                                </div>
                                {config?.provider === "openrouter" && config?.model && (
                                    <div>
                                        <p className="text-muted-foreground">Model</p>
                                        <p className="font-medium font-mono text-xs">{config.model}</p>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </main>
        </div>
    )
}
