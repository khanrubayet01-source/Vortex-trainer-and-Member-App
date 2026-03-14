import fs from 'fs'
import path from 'path'
import { createCanvas } from 'canvas'

// This script generates generic icons for the PWA setup
// We need 192x192, 512x512, and apple-icon.png

function drawIcon(size: number, bgColor: string, txtColor: string, outPath: string) {
  const canvas = createCanvas(size, size)
  const ctx = canvas.getContext('2d')

  // Background
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, size, size)

  // Border radius effect (circle)
  ctx.beginPath()
  ctx.arc(size / 2, size / 2, size * 0.45, 0, Math.PI * 2)
  ctx.fillStyle = '#18181b' // dark zinc
  ctx.fill()
  
  // Outer ring
  ctx.lineWidth = size * 0.05
  ctx.strokeStyle = '#ef4444' // gym red
  ctx.stroke()

  // Text
  ctx.fillStyle = txtColor
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.font = `bold ${size * 0.4}px Arial`
  ctx.fillText('V', size / 2, size / 2 + (size * 0.02)) // slight optical adjustment

  const buffer = canvas.toBuffer('image/png')
  fs.writeFileSync(outPath, buffer)
  console.log(`Generated ${outPath}`)
}

const publicDir = path.join(process.cwd(), 'public')

const sizes = [
  { size: 192, name: 'icon-192x192.png' },
  { size: 512, name: 'icon-512x512.png' },
  { size: 180, name: 'apple-icon.png' } // standard Apple touch icon size
]

sizes.forEach(s => {
  drawIcon(s.size, '#09090b', '#ffffff', path.join(publicDir, s.name))
})
