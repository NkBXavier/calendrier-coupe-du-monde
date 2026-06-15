'use client'

import { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'

interface BracketEditorProps {
  backgroundColor: string
  tournamentName: string
  logoUrl: string | null
}

export default function BracketEditor({
  backgroundColor,
  tournamentName,
  logoUrl,
}: BracketEditorProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let cancelled = false

    const drawTournamentName = () => {
      ctx.fillStyle = 'black'
      ctx.font = 'bold 160px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(tournamentName.toUpperCase(), 2250, 200)
    }

    const redrawLogo = (w: number, h: number) => {
      const centerX = w / 2
      const centerY = h / 2 + 200
      const logoRadius = 300

      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
      ctx.fill()

      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius + 18, 0, Math.PI * 2)
      ctx.stroke()

      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 30
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
      ctx.stroke()

      if (logoUrl && logoUrl.trim()) {
        const logo = new Image()
        logo.src = logoUrl

        logo.onerror = () => {
          if (cancelled) return
          drawTournamentName()
        }

        logo.onload = () => {
          if (cancelled) return
          try {
            const logoSize = 650
            ctx.save()
            ctx.beginPath()
            ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(logo, centerX - logoSize / 2, centerY - logoSize / 2, logoSize, logoSize)
            ctx.restore()
          } catch {
            // canvas draw failed, skip logo
          }
          drawTournamentName()
        }
      } else {
        drawTournamentName()
      }
    }

    const bracketImg = new Image()
    bracketImg.src = '/bracket.png'

    bracketImg.onerror = () => {
      if (cancelled) return
      console.error('Failed to load bracket image')
    }

    bracketImg.onload = () => {
      if (cancelled) return
      try {
        canvas.width = bracketImg.width
        canvas.height = bracketImg.height

        ctx.fillStyle = /^#[0-9A-F]{6}$/i.test(backgroundColor) ? backgroundColor : '#310c15'
        ctx.fillRect(0, 0, canvas.width, canvas.height)
        ctx.drawImage(bracketImg, 0, 0)

        redrawLogo(canvas.width, canvas.height)
      } catch (err) {
        console.error('Canvas render error:', err)
      }
    }

    return () => {
      cancelled = true
    }
  }, [backgroundColor, logoUrl, tournamentName])

  const handleDownloadPDF = async () => {
    const canvas = canvasRef.current
    if (!canvas) return

    try {
      const { jsPDF } = await import('jspdf')
      const imgData = canvas.toDataURL('image/png')

      const pdf = new jsPDF({
        orientation: 'landscape',
        unit: 'mm',
        format: 'a4',
      })

      const pdfWidth = pdf.internal.pageSize.getWidth()
      const pdfHeight = pdf.internal.pageSize.getHeight()

      const ratio = Math.min(
        pdfWidth / (canvas.width / 10),
        pdfHeight / (canvas.height / 10)
      )

      const scaledWidth = (canvas.width / 10) * ratio
      const scaledHeight = (canvas.height / 10) * ratio
      const x = (pdfWidth - scaledWidth) / 2
      const y = (pdfHeight - scaledHeight) / 2

      pdf.addImage(imgData, 'PNG', x, y, scaledWidth, scaledHeight)
      pdf.save(`tournament-bracket-${Date.now()}.pdf`)
    } catch (error) {
      console.error('PDF download error:', error)
    }
  }

  const handleDownloadImage = () => {
    const canvas = canvasRef.current
    if (!canvas) return

    const link = document.createElement('a')
    link.href = canvas.toDataURL('image/png')
    link.download = `tournament-bracket-${Date.now()}.png`
    link.click()
  }

  return (
    <div className="flex flex-col items-center w-full bg-secondary/30 p-3 sm:p-4">
      <div className="max-w-6xl w-full">
        <div className="mb-3 flex gap-2 justify-center">
          <Button onClick={handleDownloadPDF} variant="default" size="sm" className="sm:text-sm">
            Télécharger PDF
          </Button>
          <Button onClick={handleDownloadImage} variant="outline" size="sm" className="sm:text-sm">
            Télécharger PNG
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-auto flex justify-center items-center">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto bracket-canvas"
          />
        </div>
      </div>
    </div>
  )
}
