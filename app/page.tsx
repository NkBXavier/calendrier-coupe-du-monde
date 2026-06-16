'use client'

import { useState } from 'react'
import TournamentForm from '@/components/TournamentForm'
import BracketEditor from '@/components/BracketEditor'

interface FormData {
  name: string
  bgColor: string
  logoUrl: string | null
  email: string
  phone: string
}

export default function Page() {
  const [formData, setFormData] = useState<FormData>({
    name: 'votre nom',
    bgColor: '#310c15',
    logoUrl: null,
    email: '',
    phone: '',
  })

  return (
    <main className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <div className="bg-primary/5 border-b border-border px-4 py-3 sm:px-6">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-2xl font-bold text-foreground">Personnaliseur de Bracket</h1>
          <p className="text-sm text-muted-foreground mt-1">Créez votre bracket de tournoi personnalisé avec votre logo et vos couleurs</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-2 lg:overflow-hidden">
        {/* Left side - Form */}
        <div className="bg-secondary/30 p-4 sm:p-6 lg:p-8 overflow-auto flex items-start lg:items-center justify-center border-b lg:border-b-0 lg:border-r border-border">
          <TournamentForm onUpdate={setFormData} defaultData={formData} />
        </div>

        {/* Right side - Preview */}
        <div className="bg-background overflow-auto flex items-start lg:items-center justify-center py-4">
          <BracketEditor
            backgroundColor={formData.bgColor}
            tournamentName={formData.name}
            logoUrl={formData.logoUrl}
            email={formData.email}
            phone={formData.phone}
          />
        </div>
      </div>
    </main>
  )
}
