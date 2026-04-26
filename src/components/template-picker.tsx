'use client'; // interactive select — requires client runtime

import { useState } from 'react'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '@/lib/templates'

interface TemplatePickerProps {
  onSelect: (yaml: string) => void
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  const [selectedId, setSelectedId] = useState('')

  return (
    <select
      className="rounded border border-border bg-background px-2 py-1 text-xs text-foreground dark:bg-zinc-800 dark:text-zinc-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
      value={selectedId}
      onChange={(e) => {
        const tpl = TEMPLATES.find((t) => t.id === e.target.value)
        if (tpl) {
          setSelectedId(tpl.id)
          onSelect(tpl.yaml)
        }
      }}
    >
      <option value="" disabled>
        Load template…
      </option>
      {TEMPLATE_CATEGORIES.map((cat) => {
        const items = TEMPLATES.filter((t) => t.category === cat.id)
        if (items.length === 0) return null
        return (
          <optgroup key={cat.id} label={cat.label}>
            {items.map((t) => (
              <option key={t.id} value={t.id}>
                {t.name}
              </option>
            ))}
          </optgroup>
        )
      })}
    </select>
  )
}
