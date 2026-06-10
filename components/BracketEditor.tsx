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

    const redrawCanvas = () => {
      const bracketImg = new Image()
      bracketImg.crossOrigin = 'anonymous'
      bracketImg.src = '/bracket.png'

      bracketImg.onload = () => {
        // Set canvas size to match image
        canvas.width = bracketImg.width
        canvas.height = bracketImg.height

        // 1. Fill background with chosen color (shows through transparent pixels of the PNG)
        ctx.fillStyle = backgroundColor && backgroundColor.match(/^#[0-9A-F]{6}$/i)
          ? backgroundColor
          : '#310c15'
        ctx.fillRect(0, 0, canvas.width, canvas.height)

        // 2. Draw bracket PNG on top — transparent areas reveal the background color
        ctx.drawImage(bracketImg, 0, 0)

        redrawLogo()
      }

      bracketImg.onerror = () => {
        console.error('Failed to load bracket image')
      }
    }

    const redrawLogo = () => {
      const centerX = canvas.width / 2
      const centerY = canvas.height / 2 + 200
      const logoRadius = 300

      // White circle background
      ctx.fillStyle = 'white'
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
      ctx.fill()

      // Outer shadow ring for depth
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.25)'
      ctx.lineWidth = 12
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius + 18, 0, Math.PI * 2)
      ctx.stroke()

      // White circle border — thick and visible
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 30
      ctx.beginPath()
      ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
      ctx.stroke()

      // Draw logo if available
      if (logoUrl && logoUrl.trim()) {
        const logo = new Image()
        logo.crossOrigin = 'anonymous'
        logo.src = logoUrl

        logo.onerror = () => {
          drawTournamentName(ctx, canvas)
        }

        logo.onload = () => {
          try {
            const logoSize = 650
            ctx.save()
            ctx.beginPath()
            ctx.arc(centerX, centerY, logoRadius, 0, Math.PI * 2)
            ctx.clip()
            ctx.drawImage(
              logo,
              centerX - logoSize / 2,
              centerY - logoSize / 2,
              logoSize,
              logoSize
            )
            ctx.restore()
          } catch {
            // Fallback if image draw fails
          }

          drawTournamentName(ctx, canvas)
        }
      } else {
        drawTournamentName(ctx, canvas)
      }
    }

    const drawTournamentName = (
      ctx: CanvasRenderingContext2D,
      canvas: HTMLCanvasElement
    ) => {
      ctx.fillStyle = 'black'
      ctx.font = 'bold 160px Arial'
      ctx.textAlign = 'left'
      ctx.textBaseline = 'top'
      ctx.fillText(tournamentName.toUpperCase(), 2250, 200)
    }

    redrawCanvas()
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
    <div className="flex flex-col items-center justify-center min-h-screen bg-secondary/30 p-4">
      <div className="max-w-6xl w-full">
        <div className="mb-6 flex gap-3 justify-center">
          <Button onClick={handleDownloadPDF} variant="default" size="lg">
            Download PDF
          </Button>
          <Button onClick={handleDownloadImage} variant="outline" size="lg">
            Download PNG
          </Button>
        </div>

        <div className="bg-white rounded-lg shadow-lg overflow-auto flex justify-center items-center max-h-screen">
          <canvas
            ref={canvasRef}
            className="max-w-full h-auto bracket-canvas"
          />
        </div>
      </div>
    </div>
  )
}
