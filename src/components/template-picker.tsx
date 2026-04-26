'use client'; // interactive select — requires client runtime

import { TEMPLATES } from '@/lib/templates'

interface TemplatePickerProps {
  onSelect: (yaml: string) => void
}

export function TemplatePicker({ onSelect }: TemplatePickerProps) {
  return (
    <select
      className="rounded border border-zinc-200 bg-white px-2 py-1 text-xs text-zinc-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
      defaultValue=""
      onChange={(e) => {
        const tpl = TEMPLATES.find((t) => t.id === e.target.value)
        if (tpl) onSelect(tpl.yaml)
        e.target.value = ''
      }}
    >
      <option value="" disabled>
        Load template…
      </option>
      {TEMPLATES.map((t) => (
        <option key={t.id} value={t.id}>
          {t.name}
        </option>
      ))}
    </select>
  )
}
