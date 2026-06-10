'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface FormData {
  name: string
  bgColor: string
  logoUrl: string | null
}

interface TournamentFormProps {
  onUpdate: (data: FormData) => void
  defaultData?: FormData
}

export default function TournamentForm({ onUpdate, defaultData }: TournamentFormProps) {
  // Use parent's data directly - parent controls all values
  const formData = defaultData || {
    name: 'votre nom',
    bgColor: '#310c15',
    logoUrl: null,
  }
  
  const [previewImage, setPreviewImage] = useState<string | null>(formData.logoUrl)
  const [isDragging, setIsDragging] = useState(false)

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target
    const updated = { ...formData, [name]: value }
    onUpdate(updated)
  }

  const handleHexChange = (e: ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase()
    
    // Add # if not present
    if (!value.startsWith('#')) {
      value = '#' + value
    }
    
    // Only call onUpdate with valid hex colors
    if (/^#[0-9A-F]{6}$/.test(value)) {
      const updated = { ...formData, bgColor: value }
      onUpdate(updated)
    }
  }

  const handleImageUpload = (file: File) => {
    const reader = new FileReader()
    reader.onload = (e) => {
      const url = e.target?.result as string
      setPreviewImage(url)
      const updated = { ...formData, logoUrl: url }
      onUpdate(updated)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = () => {
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      handleImageUpload(file)
    }
  }

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.currentTarget.files?.[0]
    if (file) {
      handleImageUpload(file)
    }
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="pb-4 border-b border-border">
        <h2 className="text-2xl font-bold text-foreground mb-1">Customize</h2>
        <p className="text-sm text-muted-foreground">Personalize your tournament</p>
      </div>

      {/* Logo Upload Section */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
          <Upload size={16} />
          Logo or Photo
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-8 text-center transition-all ${
            isDragging
              ? 'border-primary bg-primary/5'
              : 'border-border bg-secondary/30 hover:bg-secondary/50'
          }`}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleFileInputChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
            aria-label="Upload logo or photo"
            title="Upload logo or photo"
          />
          {previewImage ? (
            <div className="flex flex-col items-center gap-3">
              <img
                src={previewImage}
                alt="Logo preview"
                className="h-24 w-24 object-contain rounded"
              />
              <p className="text-sm text-muted-foreground">Click or drag to replace</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-3 py-4">
              <Upload className="h-8 w-8 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground">Drag and drop your logo</p>
                <p className="text-sm text-muted-foreground">or click to browse</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-4">
        <label htmlFor="name" className="block text-sm font-semibold text-foreground">
          Nom de l'utilisateur
        </label>
        <input
          id="name"
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="votre nom"
          className="w-full px-4 py-3 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Color Picker */}
      <div className="space-y-3">
        <label className="block text-sm font-semibold text-foreground">
          Color Scheme
        </label>
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <label htmlFor="colorPicker" className="sr-only">
              Pick a background color
            </label>
            <input
              id="colorPicker"
              type="color"
              value={formData.bgColor}
              onChange={handleInputChange}
              name="bgColor"
              className="h-10 w-16 rounded-lg border border-border cursor-pointer hover:opacity-80 transition-opacity"
              title="Pick a color"
            />
            <label htmlFor="hexColor" className="sr-only">
              Hex color code
            </label>
            <input
              id="hexColor"
              type="text"
              value={formData.bgColor}
              onChange={handleHexChange}
              placeholder="#310c15"
              title="Enter hex color code"
              className="flex-1 px-3 py-2 rounded-lg border border-border bg-background text-foreground text-sm font-mono uppercase focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              maxLength={7}
            />
          </div>
          <p className="text-xs text-muted-foreground pl-1">
            Hex code or use the picker
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-4 border-t border-border">
        <Button
          onClick={() => {
            const resetData = { name: 'Canada - Mexico - United States', bgColor: '#310c15', logoUrl: null }
            setPreviewImage(null)
            onUpdate(resetData)
          }}
          variant="outline"
          className="flex-1"
        >
          Reset
        </Button>
      </div>
    </div>
  )
}
