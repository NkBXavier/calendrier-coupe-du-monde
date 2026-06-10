'use client'

import { useState } from 'react'
import TournamentForm from '@/components/TournamentForm'
import BracketEditor from '@/components/BracketEditor'

interface FormData {
  name: string
  bgColor: string
  logoUrl: string | null
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: 'votre nom',
    bgColor: '#310c15',
    logoUrl: null,
  })

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border px-6 py-4">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Tournament Bracket Customizer</h1>
          <p className="text-sm text-muted-foreground mt-1">Create personalized tournament brackets with your branding</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 overflow-hidden">
        {/* Left side - Form */}
        <div className="bg-secondary/30 p-6 lg:p-12 overflow-auto flex items-center justify-center border-r border-border">
          <TournamentForm onUpdate={setFormData} defaultData={formData} />
        </div>

        {/* Right side - Preview */}
        <div className="bg-background overflow-auto flex items-center justify-center">
          <BracketEditor
            backgroundColor={formData.bgColor}
            tournamentName={formData.name}
            logoUrl={formData.logoUrl}
          />
        </div>
      </div>
    </main>
  )
}
