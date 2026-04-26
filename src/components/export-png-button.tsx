'use client'; // useState + browser download API

import { useState, useCallback } from 'react'
import { toPng } from 'html-to-image'

interface ExportPngButtonProps {
  containerRef: React.RefObject<HTMLDivElement | null>
  filename?: string
}

export function ExportPngButton({ containerRef, filename = 'agent-graph.png' }: ExportPngButtonProps) {
  const [exporting, setExporting] = useState(false)

  const handleExport = useCallback(async () => {
    if (!containerRef.current) return
    setExporting(true)
    try {
      const dataUrl = await toPng(containerRef.current, {
        pixelRatio: 2,
        filter: (node) => {
          if (node instanceof HTMLElement) {
            if (node.classList.contains('react-flow__minimap')) return false
            if (node.classList.contains('react-flow__controls')) return false
          }
          return true
        },
      })
      const link = document.createElement('a')
      link.href = dataUrl
      link.download = filename
      link.click()
    } finally {
      setExporting(false)
    }
  }, [containerRef, filename])

  return (
    <button
      onClick={handleExport}
      disabled={exporting}
      className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 hover:bg-zinc-50 disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      {exporting ? 'Exporting…' : 'Export PNG'}
    </button>
  )
}
