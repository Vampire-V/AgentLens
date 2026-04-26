'use client'; // controlled textarea with onChange state

import { useRef, useEffect } from 'react';
import type { ParseError } from '@/lib/yaml-schema';

interface YamlEditorProps {
  value: string;
  onChange: (v: string) => void;
  error: ParseError | null;
}

export function YamlEditor({ value, onChange, error }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!error?.line || !textareaRef.current) return;
    const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight) || 20;
    textareaRef.current.scrollTop = (error.line - 1) * lineHeight;
  }, [error?.line]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">YAML</span>
      </div>
      <textarea
        ref={textareaRef}
        className="flex-1 resize-none bg-zinc-50 p-4 font-mono text-sm text-zinc-900 outline-none dark:bg-zinc-950 dark:text-zinc-100"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        autoCorrect="off"
        autoCapitalize="off"
      />
      {error && (
        <div className="border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {error.line != null && (
            <span className="mr-1 font-semibold">
              Line {error.line}{error.column != null ? `, Col ${error.column}` : ''}:
            </span>
          )}
          {error.message}
        </div>
      )}
    </div>
  );
}
