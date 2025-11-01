'use client'

import { useState, useRef } from 'react'
import { Button } from './ui/button'

interface UploadBoxProps {
  label: string
  onUpload: (file: File, preview: string) => void
  accept?: string
  maxSize?: number
}

export function UploadBox({
  label,
  onUpload,
  accept = 'image/*',
  maxSize = 10 * 1024 * 1024 // 10MB
}: UploadBoxProps) {
  const [preview, setPreview] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFile = (file: File) => {
    // Validate file size
    if (file.size > maxSize) {
      alert(`Fayl həcmi maksimum ${maxSize / 1024 / 1024}MB ola bilər`)
      return
    }

    // Validate file type
    if (accept === 'image/*' && !file.type.startsWith('image/')) {
      alert('Yalnız şəkil faylları qəbul edilir')
      return
    }

    if (accept === 'video/*' && !file.type.startsWith('video/')) {
      alert('Yalnız video faylları qəbul edilir')
      return
    }

    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      const previewUrl = reader.result as string
      setPreview(previewUrl)
      onUpload(file, previewUrl)
    }
    reader.readAsDataURL(file)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)

    const file = e.dataTransfer.files[0]
    if (file) handleFile(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
  }

  const handleRemove = () => {
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>

      {preview ? (
        <div className="relative group">
          <div className="relative aspect-video rounded-lg overflow-hidden border-2 border-primary bg-onyx-light">
            <img
              src={preview}
              alt={label}
              className="w-full h-full object-cover"
            />
          </div>
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleRemove}
          >
            Sil
          </Button>
        </div>
      ) : (
        <div
          className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-all ${
            isDragging
              ? 'border-primary bg-primary/10'
              : 'border-border hover:border-primary hover:bg-primary/5'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <input
            ref={fileInputRef}
            type="file"
            accept={accept}
            onChange={handleFileSelect}
            className="hidden"
          />
          <div className="text-5xl mb-3">📷</div>
          <p className="font-medium mb-1">Klikləyin və ya sürüşdürün</p>
          <p className="text-sm text-neutral-secondary">
            {accept === 'image/*' ? 'JPG, PNG, WebP' : 'MP4, WebM'} (max {maxSize / 1024 / 1024}MB)
          </p>
        </div>
      )}
    </div>
  )
}
