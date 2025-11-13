"use client"

import { useCallback, useEffect, useRef, useState } from "react"
import ReactCrop, { centerCrop, makeAspectCrop, type Crop, type PixelCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

type PhotoCropModalProps = {
  open: boolean
  onOpenChange: (open: boolean) => void
  imageFile: File | null
  onSave: (croppedImageUrl: string) => void
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop(
      {
        unit: '%',
        width: 90,
      },
      aspect,
      mediaWidth,
      mediaHeight,
    ),
    mediaWidth,
    mediaHeight,
  )
}

export function PhotoCropModal({
  open,
  onOpenChange,
  imageFile,
  onSave,
}: PhotoCropModalProps) {
  const [imgSrc, setImgSrc] = useState<string>("")
  const [crop, setCrop] = useState<Crop>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const imgRef = useRef<HTMLImageElement>(null)
  const [isSaving, setIsSaving] = useState(false)

  // Load image when modal opens and file is provided
  useEffect(() => {
    if (open && imageFile) {
      const reader = new FileReader()
      reader.addEventListener("load", () => {
        const imageUrl = reader.result?.toString() || ""
        setImgSrc(imageUrl)
      })
      reader.readAsDataURL(imageFile)
    } else if (!open) {
      // Reset state when modal closes
      setImgSrc("")
      setCrop(undefined)
      setCompletedCrop(undefined)
    }
  }, [open, imageFile])

  function onImageLoad(e: React.SyntheticEvent<HTMLImageElement>) {
    const { width, height } = e.currentTarget
    // 3:4 aspect ratio (standard for portrait photos)
    const aspect = 3 / 4
    setCrop(centerAspectCrop(width, height, aspect))
  }

  const getCroppedImg = useCallback(async (): Promise<string> => {
    if (!completedCrop || !imgRef.current) {
      throw new Error("No crop area selected")
    }

    const image = imgRef.current
    const canvas = document.createElement("canvas")
    const ctx = canvas.getContext("2d")

    if (!ctx) {
      throw new Error("No 2d context")
    }

    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height

    // Set canvas size to the desired output size (fixed size for consistent photos)
    const outputWidth = 400
    const outputHeight = 533 // Maintains 3:4 aspect ratio

    canvas.width = outputWidth
    canvas.height = outputHeight

    ctx.imageSmoothingQuality = "high"

    // Draw the cropped image scaled to the output size
    ctx.drawImage(
      image,
      completedCrop.x * scaleX,
      completedCrop.y * scaleY,
      completedCrop.width * scaleX,
      completedCrop.height * scaleY,
      0,
      0,
      outputWidth,
      outputHeight
    )

    return new Promise((resolve, reject) => {
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Canvas is empty"))
            return
          }
          const croppedUrl = URL.createObjectURL(blob)
          resolve(croppedUrl)
        },
        "image/jpeg",
        0.9
      )
    })
  }, [completedCrop])

  const handleSave = async () => {
    try {
      setIsSaving(true)
      const croppedImageUrl = await getCroppedImg()
      onSave(croppedImageUrl)
      onOpenChange(false)
    } catch (error) {
      console.error("Error cropping image:", error)
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancel = () => {
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Adjust Photo</DialogTitle>
          <DialogDescription>
            Crop and adjust your photo to ensure a clean and consistent appearance for your CV.
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex-1 overflow-auto py-4">
          {imgSrc && (
            <div className="flex justify-center">
              <ReactCrop
                crop={crop}
                onChange={(_, percentCrop) => setCrop(percentCrop)}
                onComplete={(c) => setCompletedCrop(c)}
                aspect={3 / 4}
                minHeight={100}
              >
                <img
                  ref={imgRef}
                  alt="Crop preview"
                  src={imgSrc}
                  onLoad={onImageLoad}
                  className="max-h-[60vh] w-auto"
                />
              </ReactCrop>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={handleCancel}
            disabled={isSaving}
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleSave}
            disabled={isSaving || !completedCrop}
          >
            {isSaving ? "Saving..." : "Save"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
