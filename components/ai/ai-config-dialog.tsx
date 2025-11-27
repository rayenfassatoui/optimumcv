"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { AIConfig } from "@/lib/ai/types"

interface AIConfigDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    onSave: (config: AIConfig) => void
    defaultConfig?: AIConfig
}

export function AIConfigDialog({ open, onOpenChange, onSave, defaultConfig }: AIConfigDialogProps) {
    const [provider, setProvider] = useState<"gemini" | "openrouter">(defaultConfig?.provider || "gemini")
    const [apiKey, setApiKey] = useState(defaultConfig?.apiKey || "")
    const [model, setModel] = useState(defaultConfig?.model || "")

    // Update state when defaultConfig changes
    useEffect(() => {
        if (defaultConfig) {
            setProvider(defaultConfig.provider)
            setApiKey(defaultConfig.apiKey || "")
            setModel(defaultConfig.model || "")
        }
    }, [defaultConfig])

    const handleSave = () => {
        onSave({
            provider,
            apiKey: provider === "openrouter" ? apiKey : undefined,
            model: provider === "openrouter" ? model : undefined
        })
        onOpenChange(false)
    }

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>AI Configuration</DialogTitle>
                    <DialogDescription>
                        Choose your preferred AI provider. Gemini is used by default.
                        If you want to use your own AI model, select OpenRouter and provide your API key.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="provider" className="text-right">
                            Provider
                        </Label>
                        <Select value={provider} onValueChange={(v: "gemini" | "openrouter") => setProvider(v)}>
                            <SelectTrigger className="col-span-3">
                                <SelectValue placeholder="Select provider" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="gemini">Gemini (Default)</SelectItem>
                                <SelectItem value="openrouter">OpenRouter (Custom)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    {provider === "openrouter" && (
                        <>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="apiKey" className="text-right">
                                    API Key
                                </Label>
                                <Input
                                    id="apiKey"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    className="col-span-3"
                                    placeholder="sk-or-..."
                                    type="password"
                                />
                            </div>
                            <div className="grid grid-cols-4 items-center gap-4">
                                <Label htmlFor="model" className="text-right">
                                    Model
                                </Label>
                                <Input
                                    id="model"
                                    value={model}
                                    onChange={(e) => setModel(e.target.value)}
                                    className="col-span-3"
                                    placeholder="openai/gpt-4o"
                                />
                            </div>
                        </>
                    )}
                </div>
                <DialogFooter>
                    <Button onClick={handleSave}>Save Configuration</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
