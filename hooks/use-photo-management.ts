import { useState, useRef, type RefObject } from "react"
import { toast } from "sonner"

export function usePhotoManagement() {
  const [photoPreview, setPhotoPreview] = useState<string | null>(null)
  const [photoFile, setPhotoFile] = useState<File | null>(null)
  const [isEnhancingPhoto, setIsEnhancingPhoto] = useState(false)
  const [showPhotoCropModal, setShowPhotoCropModal] = useState(false)
  const [pendingPhotoFile, setPendingPhotoFile] = useState<File | null>(null)
  
  const photoInputRef = useRef<HTMLInputElement>(null) as RefObject<HTMLInputElement>

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    
    setPendingPhotoFile(file)
    setShowPhotoCropModal(true)
    event.target.value = ""
  }

  const handlePhotoCropSave = (croppedImageUrl: string) => {
    setPhotoPreview(croppedImageUrl)
    if (pendingPhotoFile) {
      setPhotoFile(pendingPhotoFile)
      toast.success(`Photo cropped and saved: ${pendingPhotoFile.name}`)
    }
    setPendingPhotoFile(null)
  }

  const applyProfessionalPhotoFilters = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () => {
        const canvas = document.createElement('canvas')
        const ctx = canvas.getContext('2d')
        
        if (!ctx) {
          reject(new Error("Canvas not supported"))
          return
        }

        canvas.width = img.width
        canvas.height = img.height
        
        ctx.filter = 'brightness(1.1) contrast(1.2) saturate(0.85)'
        ctx.drawImage(img, 0, 0)
        ctx.filter = 'none'
        
        canvas.toBlob((blob) => {
          if (blob) {
            resolve(URL.createObjectURL(blob))
          } else {
            reject(new Error("Failed to create enhanced image"))
          }
        }, 'image/png', 0.95)
      }
      
      img.onerror = () => reject(new Error("Failed to load image"))
      img.src = URL.createObjectURL(file)
    })
  }

  const handleEnhancePhoto = async () => {
    if (!photoFile) {
      toast.info("Upload a profile photo to enhance.")
      return
    }

    try {
      setIsEnhancingPhoto(true)
      toast.info("Enhancing your photo with professional filters...")

      const enhanced = await applyProfessionalPhotoFilters(photoFile)
      setPhotoPreview(enhanced)
      toast.success("Photo enhanced! Applied professional brightness, contrast, and color adjustments.")
    } catch (error) {
      console.error("[Photo Enhancement] Error:", error)
      const errorMessage = error instanceof Error ? error.message : "Failed to enhance photo"
      toast.error(errorMessage)
    } finally {
      setIsEnhancingPhoto(false)
    }
  }

  return {
    photoPreview,
    photoFile,
    isEnhancingPhoto,
    showPhotoCropModal,
    pendingPhotoFile,
    photoInputRef,
    setShowPhotoCropModal,
    handlePhotoChange,
    handlePhotoCropSave,
    handleEnhancePhoto,
  }
}
