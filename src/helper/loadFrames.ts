import fs from 'fs'
import path from 'path'

interface LoadFramesOptions {
  frameCount: number
  frameFolder?: string
}

export async function loadFrames({ frameCount, frameFolder = 'frames' }: LoadFramesOptions): Promise<string[]> {
  const frameFiles = Array.from({ length: frameCount }, (_, i) => `frame_${String(i + 1).padStart(4, '0')}`)

  const frames = frameFiles.map((filename) => {
    const filePath = path.join(process.cwd(), 'public', frameFolder, `${filename}.html`)

    try {
      return fs.readFileSync(filePath, 'utf-8')
    } catch (error) {
      console.error(`Failed to load ${filename}.html:`, error)
      throw new Error(`Failed to load frame: ${filename}.html`)
    }
  })

  return frames
}
