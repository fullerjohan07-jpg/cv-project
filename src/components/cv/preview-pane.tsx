'use client'

import { useEffect, useRef, useState } from 'react'
import type { CVData } from '@/lib/cv-types'
import { CVPreview } from '@/components/cv/cv-preview'

const PAGE_WIDTH = 794
const PAGE_HEIGHT = 1123

export function PreviewPane({ data }: { data: CVData }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [scale, setScale] = useState(1)

  useEffect(() => {
    const el = containerRef.current
    if (!el) return
    const update = () => {
      const available = el.clientWidth
      setScale(Math.min(1, available / PAGE_WIDTH))
    }
    update()
    const ro = new ResizeObserver(update)
    ro.observe(el)
    return () => ro.disconnect()
  }, [])

  return (
    <div ref={containerRef} className="flex justify-center">
      <div
        id="cv-print-root"
        className="cv-scale-wrapper"
        style={{ width: PAGE_WIDTH * scale, height: PAGE_HEIGHT * scale }}
      >
        <div
          className="cv-scale origin-top-left overflow-hidden rounded-lg shadow-xl shadow-black/10 ring-1 ring-border"
          style={{ width: PAGE_WIDTH, transform: `scale(${scale})` }}
        >
          <CVPreview data={data} />
        </div>
      </div>
    </div>
  )
}
