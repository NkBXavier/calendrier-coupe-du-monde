'use client'

import { useState, ChangeEvent } from 'react'
import { Button } from '@/components/ui/button'
import { Upload } from 'lucide-react'

interface FormData {
  name: string
  bgColor: string
  logoUrl: string | null
  email: string
  phone: string
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
    email: '',
    phone: '',
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
    <div className="w-full max-w-md space-y-4">
      <div className="pb-3 border-b border-border">
        <h2 className="text-xl font-bold text-foreground mb-0.5">Personnaliser</h2>
        <p className="text-sm text-muted-foreground">Personnalisez votre tournoi</p>
      </div>

      {/* Logo Upload Section */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground flex items-center gap-2">
          <Upload size={16} />
          Logo ou Photo
        </label>
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`relative border-2 border-dashed rounded-lg p-4 sm:p-6 text-center transition-all ${
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
            <div className="flex flex-col items-center gap-2">
              <img
                src={previewImage}
                alt="Logo preview"
                className="h-16 w-16 object-contain rounded"
              />
              <p className="text-sm text-muted-foreground">Cliquez ou faites glisser pour remplacer</p>
            </div>
          ) : (
            <div className="flex flex-col items-center gap-2 py-2">
              <Upload className="h-6 w-6 text-muted-foreground" />
              <div>
                <p className="font-medium text-foreground text-sm">Glissez-déposez votre logo</p>
                <p className="text-xs text-muted-foreground">ou cliquez pour parcourir</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Name Input */}
      <div className="space-y-2">
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

      {/* Email Input */}
      <div className="space-y-2">
        <label htmlFor="email" className="block text-sm font-semibold text-foreground">
          Adresse email
        </label>
        <input
          id="email"
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="exemple@email.com"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Phone Input */}
      <div className="space-y-2">
        <label htmlFor="phone" className="block text-sm font-semibold text-foreground">
          Numéro de téléphone
        </label>
        <input
          id="phone"
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleInputChange}
          placeholder="+1 234 567 8900"
          className="w-full px-4 py-2.5 rounded-lg border border-border bg-background text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Color Picker */}
      <div className="space-y-2">
        <label className="block text-sm font-semibold text-foreground">
          Schéma de couleurs
        </label>
        <div className="space-y-2">
          <div className="flex gap-3 items-center">
            <label htmlFor="colorPicker" className="sr-only">
              Choisissez une couleur de fond
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
              Code couleur hexadécimal
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
            Code hexadécimal ou utilisez le sélecteur
          </p>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-3 pt-3 border-t border-border">
        <Button
          onClick={() => {
            const resetData = { name: 'Canada - Mexico - United States', bgColor: '#310c15', logoUrl: null, email: '', phone: '' }
            setPreviewImage(null)
            onUpdate(resetData)
          }}
          variant="outline"
          className="flex-1"
        >
          Réinitialiser
        </Button>
      </div>
    </div>
  )
}
