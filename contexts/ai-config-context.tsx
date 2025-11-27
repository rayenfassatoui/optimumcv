"use client"

import React, { createContext, useContext, useState, useEffect, useCallback } from "react"
import { AIConfig } from "@/lib/ai/types"
import { AIConfigDialog } from "@/components/ai/ai-config-dialog"

interface AIConfigContextType {
    config: AIConfig | undefined
    setConfig: (config: AIConfig) => void
    ensureConfig: () => Promise<AIConfig | undefined>
    openConfigModal: () => void
}

const AIConfigContext = createContext<AIConfigContextType | undefined>(undefined)

export function AIConfigProvider({ children }: { children: React.ReactNode }) {
    const [config, setConfigState] = useState<AIConfig | undefined>(undefined)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [pendingResolve, setPendingResolve] = useState<((value: AIConfig | undefined) => void) | null>(null)

    useEffect(() => {
        const stored = localStorage.getItem("ai_config")
        if (stored) {
            try {
                setConfigState(JSON.parse(stored))
            } catch (e) {
                console.error("Failed to parse stored AI config", e)
            }
        }
    }, [])

    const setConfig = (newConfig: AIConfig) => {
        setConfigState(newConfig)
        localStorage.setItem("ai_config", JSON.stringify(newConfig))
    }

    const openConfigModal = () => setIsModalOpen(true)

    const ensureConfig = useCallback((): Promise<AIConfig | undefined> => {
        return new Promise((resolve) => {
            // If already configured, return immediately
            if (config) {
                resolve(config)
                return
            }

            const hasSeen = localStorage.getItem("has_seen_ai_config")

            // If user has already seen/dismissed the modal, resolve with undefined
            if (hasSeen) {
                resolve(undefined)
                return
            }

            // Otherwise, open modal and wait for user action
            setPendingResolve(() => resolve)
            setIsModalOpen(true)
        })
    }, [config])

    const handleSave = (newConfig: AIConfig) => {
        setConfig(newConfig)
        localStorage.setItem("has_seen_ai_config", "true")
        if (pendingResolve) {
            pendingResolve(newConfig)
            setPendingResolve(null)
        }
    }

    const handleOpenChange = (open: boolean) => {
        setIsModalOpen(open)
        if (!open && pendingResolve) {
            // If closed without saving, mark as seen and resolve with undefined
            localStorage.setItem("has_seen_ai_config", "true")
            pendingResolve(undefined)
            setPendingResolve(null)
        }
    }

    return (
        <AIConfigContext.Provider value={{ config, setConfig, ensureConfig, openConfigModal }}>
            {children}
            <AIConfigDialog
                open={isModalOpen}
                onOpenChange={handleOpenChange}
                onSave={handleSave}
                defaultConfig={config}
            />
        </AIConfigContext.Provider>
    )
}

export const useAIConfig = () => {
    const context = useContext(AIConfigContext)
    if (!context) {
        throw new Error("useAIConfig must be used within an AIConfigProvider")
    }
    return context
}
