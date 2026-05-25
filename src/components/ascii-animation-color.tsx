'use client'

import { useEffect, useRef, useState } from 'react'

class AnimationManager {
  private _animation: number | null = null
  private callback: () => void
  private lastFrame = -1
  private frameTime = 1000 / 30

  constructor(callback: () => void, fps = 30) {
    this.callback = callback
    this.frameTime = 1000 / fps
  }

  updateFPS(fps: number) {
    this.frameTime = 1000 / fps
  }

  start() {
    if (this._animation != null) return
    this._animation = requestAnimationFrame(this.update)
  }

  pause() {
    if (this._animation == null) return
    this.lastFrame = -1
    cancelAnimationFrame(this._animation)
    this._animation = null
  }

  private update = (time: number) => {
    const { lastFrame } = this
    let delta = time - lastFrame
    if (this.lastFrame === -1) {
      this.lastFrame = time
    } else {
      while (delta >= this.frameTime) {
        this.callback()
        delta -= this.frameTime
        this.lastFrame += this.frameTime
      }
    }
    this._animation = requestAnimationFrame(this.update)
  }
}

interface ASCIIAnimationProps {
  frames?: string[]
  initialFrame?: string | null
  className?: string
  fps?: number
  frameCount?: number
  frameFolder?: string
}

export default function ASCIIAnimation({
  frames: providedFrames,
  initialFrame: initialFrameProp = null,
  className = '',
  fps = 24,
  frameCount = 60,
  frameFolder = 'frames',
}: ASCIIAnimationProps) {
  const [frames, setFrames] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [initialFrame, setInitialFrame] = useState<string | null>(initialFrameProp ?? providedFrames?.[0] ?? null)
  const [currentFrame, setCurrentFrame] = useState(0)
  const [shouldLoadFrames, setShouldLoadFrames] = useState(Boolean(providedFrames))
  const framesRef = useRef<string[]>([])
  const containerRef = useRef<HTMLDivElement | null>(null)
  const [animationManager] = useState(
    () =>
      new AnimationManager(() => {
        setCurrentFrame((current) => {
          if (framesRef.current.length === 0) return current
          return (current + 1) % framesRef.current.length
        })
      }, fps),
  )

  useEffect(() => {
    setInitialFrame(initialFrameProp ?? providedFrames?.[0] ?? null)
  }, [initialFrameProp, providedFrames])

  useEffect(() => {
    if (providedFrames) {
      setShouldLoadFrames(true)
      return
    }

    const node = containerRef.current

    if (!node) {
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry?.isIntersecting) return

        setShouldLoadFrames(true)
        observer.disconnect()
      },
      { rootMargin: '200px 0px' },
    )

    observer.observe(node)

    return () => observer.disconnect()
  }, [providedFrames])

  useEffect(() => {
    if (!shouldLoadFrames) {
      return
    }

    const loadFrames = async () => {
      setIsLoading(true)

      if (providedFrames) {
        setInitialFrame(providedFrames[0] ?? null)
        setFrames(providedFrames)
        framesRef.current = providedFrames
        setIsLoading(false)
        return
      }

      try {
        const frameFiles = Array.from({ length: frameCount }, (_, i) => `frame_${String(i + 1).padStart(4, '0')}`)
        const [firstFrameFile, ...remainingFrameFiles] = frameFiles

        const firstFrameResponse = await fetch(`/${frameFolder}/${firstFrameFile}.html`)
        if (!firstFrameResponse.ok) {
          throw new Error(`Failed to fetch ${firstFrameFile}.html: ${firstFrameResponse.status}`)
        }

        const firstFrameHtml = await firstFrameResponse.text()
        setInitialFrame(firstFrameHtml)

        const remainingFramePromises = remainingFrameFiles.map(async (filename) => {
          const response = await fetch(`/${frameFolder}/${filename}.html`)
          if (!response.ok) {
            throw new Error(`Failed to fetch ${filename}.html: ${response.status}`)
          }
          return await response.text()
        })

        const remainingFrames = await Promise.all(remainingFramePromises)
        const loadedFrames = [firstFrameHtml, ...remainingFrames]
        console.log(`Loaded ${loadedFrames.length} frames`)
        setFrames(loadedFrames)
        framesRef.current = loadedFrames

        setCurrentFrame(0)
      } catch (error) {
        console.error('Failed to load ASCII frames:', error)
      } finally {
        setIsLoading(false)
      }
    }

    loadFrames()
  }, [providedFrames, frameCount, frameFolder, shouldLoadFrames])

  useEffect(() => {
    animationManager.updateFPS(fps)
  }, [fps, animationManager])

  useEffect(() => {
    if (frames.length === 0) return

    const reducedMotion = window.matchMedia(`(prefers-reduced-motion: reduce)`).matches === true

    if (reducedMotion) {
      return
    }

    const handleFocus = () => animationManager.start()
    const handleBlur = () => animationManager.pause()

    window.addEventListener('focus', handleFocus)
    window.addEventListener('blur', handleBlur)

    if (document.visibilityState === 'visible') {
      animationManager.start()
    }

    return () => {
      window.removeEventListener('focus', handleFocus)
      window.removeEventListener('blur', handleBlur)
      animationManager.pause()
    }
  }, [animationManager, frames.length])

  // Get current frame color
  // const currentColor = frameColors[currentFrame] || null;

  if (isLoading) {
    return (
      <div
        ref={containerRef}
        className={`relative w-full overflow-hidden font-mono text-[6px] leading-none whitespace-pre xs:text-[8px] sm:text-xs ${className}`}
      >
        {initialFrame ? (
          <div className='relative' dangerouslySetInnerHTML={{ __html: initialFrame }} />
        ) : (
          'Loading ASCII animation...'
        )}
      </div>
    )
  }

  if (!frames.length) {
    return (
      <div ref={containerRef} className={`overflow-hidden font-mono whitespace-pre ${className}`}>
        No frames loaded
      </div>
    )
  }

  return (
    <div
      ref={containerRef}
      className={`relative w-full overflow-hidden font-mono text-[6px] leading-none whitespace-pre xs:text-[8px] sm:text-xs ${className}`}
    >
      <div className='relative' dangerouslySetInnerHTML={{ __html: frames[currentFrame] || '' }} />
    </div>
  )
}
