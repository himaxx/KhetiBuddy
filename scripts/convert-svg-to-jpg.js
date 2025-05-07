// This is a Node.js script to convert SVG files to JPEG
// You can run this script locally to convert your SVG files

import fs from "fs"
import path from "path"
import { createCanvas, loadImage } from "canvas"

// Directory paths
const svgDir = path.join(process.cwd(), "public", "plant-images")
const jpgDir = path.join(process.cwd(), "public", "plant-images-jpg")

// Create output directory if it doesn't exist
if (!fs.existsSync(jpgDir)) {
  fs.mkdirSync(jpgDir, { recursive: true })
}

// Get all SVG files
const svgFiles = fs.readdirSync(svgDir).filter((file) => file.endsWith(".svg"))

// Convert each SVG to JPEG
async function convertSvgToJpg(svgFile) {
  try {
    const svgPath = path.join(svgDir, svgFile)
    const jpgPath = path.join(jpgDir, svgFile.replace(".svg", ".jpg"))

    // Read SVG file
    const svgContent = fs.readFileSync(svgPath, "utf8")

    // Create a data URL from the SVG content
    const svgDataUrl = `data:image/svg+xml;base64,${Buffer.from(svgContent).toString("base64")}`

    // Load the SVG image
    const image = await loadImage(svgDataUrl)

    // Create a canvas with the same dimensions as the SVG
    const canvas = createCanvas(400, 400)
    const ctx = canvas.getContext("2d")

    // Draw the SVG on the canvas
    ctx.drawImage(image, 0, 0, 400, 400)

    // Convert canvas to JPEG buffer
    const jpgBuffer = canvas.toBuffer("image/jpeg", { quality: 0.9 })

    // Write JPEG file
    fs.writeFileSync(jpgPath, jpgBuffer)

    console.log(`Converted ${svgFile} to JPEG`)
  } catch (error) {
    console.error(`Error converting ${svgFile}:`, error)
  }
}

// Convert all SVG files
async function convertAllSvgs() {
  console.log(`Found ${svgFiles.length} SVG files to convert`)

  for (const svgFile of svgFiles) {
    await convertSvgToJpg(svgFile)
  }

  console.log("Conversion complete!")
}

convertAllSvgs()

