'use client'; // controlled textarea with onChange state

import { useRef, useEffect, useCallback } from 'react';
import type { ParseError } from '@/lib/yaml-schema';

interface YamlEditorProps {
  value: string;
  onChange: (v: string) => void;
  error: ParseError | null;
}

export function YamlEditor({ value, onChange, error }: YamlEditorProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const gutterRef = useRef<HTMLDivElement>(null);

  const lineCount = value.split('\n').length;
  const errorLine = error?.line ?? null;

  // sync gutter scroll กับ textarea
  const syncScroll = useCallback(() => {
    if (gutterRef.current && textareaRef.current) {
      gutterRef.current.scrollTop = textareaRef.current.scrollTop;
    }
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      const el = e.currentTarget;
      const { selectionStart: ss, selectionEnd: se, value: v } = el;

      const insert = (text: string, cursorOffset: number) => {
        e.preventDefault();
        const next = v.slice(0, ss) + text + v.slice(se);
        onChange(next);
        requestAnimationFrame(() => {
          el.selectionStart = el.selectionEnd = ss + cursorOffset;
        });
      };

      if (e.key === 'Tab') {
        insert('  ', 2);
        return;
      }

      if (e.key === 'Enter') {
        const lineStart = v.lastIndexOf('\n', ss - 1) + 1;
        const indent = v.slice(lineStart, ss).match(/^(\s*)/)?.[1] ?? '';
        insert('\n' + indent, 1 + indent.length);
        return;
      }

      // auto-close pairs — เฉพาะเมื่อไม่มี selection
      if (ss === se) {
        if (e.key === '[') { insert('[]', 1); return; }
        if (e.key === '{') { insert('{}', 1); return; }
        if (e.key === '"') {
          // ถ้าอักขระถัดไปเป็น " อยู่แล้ว ให้ข้ามไปแทนการเพิ่มใหม่
          if (v[ss] === '"') { e.preventDefault(); requestAnimationFrame(() => { el.selectionStart = el.selectionEnd = ss + 1; }); return; }
          insert('""', 1);
          return;
        }
      }
    },
    [onChange]
  );

  // auto-scroll ไป error line เมื่อ error เปลี่ยน
  useEffect(() => {
    if (!errorLine || !textareaRef.current) return;
    const lineHeight = parseInt(getComputedStyle(textareaRef.current).lineHeight) || 20;
    const scrollTo = (errorLine - 1) * lineHeight - 60;
    textareaRef.current.scrollTop = Math.max(0, scrollTo);
    syncScroll();
  }, [errorLine, syncScroll]);

  return (
    <div className="flex h-full flex-col">
      <div className="border-b border-zinc-200 bg-white px-4 py-2 dark:border-zinc-700 dark:bg-zinc-900">
        <span className="text-xs font-medium uppercase tracking-wide text-zinc-400">YAML</span>
      </div>

      <div className="relative flex flex-1 overflow-hidden font-mono text-sm">
        {/* Line number gutter */}
        <div
          ref={gutterRef}
          className="select-none overflow-hidden bg-zinc-100 pt-4 text-right dark:bg-zinc-900"
          style={{ width: '3rem', paddingRight: '0.5rem', paddingLeft: '0.25rem' }}
        >
          {Array.from({ length: lineCount }, (_, i) => {
            const lineNum = i + 1;
            const isErrorLine = lineNum === errorLine;
            return (
              <div
                key={lineNum}
                className={`leading-5 ${
                  isErrorLine
                    ? 'rounded-l bg-red-500 font-bold text-white dark:bg-red-600'
                    : 'text-zinc-400 dark:text-zinc-600'
                }`}
                style={{ lineHeight: '1.25rem' }}
              >
                {lineNum}
              </div>
            );
          })}
        </div>

        {/* Textarea */}
        <textarea
          ref={textareaRef}
          className="flex-1 resize-none bg-zinc-50 p-4 pl-3 text-zinc-900 outline-none dark:bg-zinc-950 dark:text-zinc-100"
          style={{ lineHeight: '1.25rem' }}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onScroll={syncScroll}
          spellCheck={false}
          autoCorrect="off"
          autoCapitalize="off"
        />
      </div>

      {error && (
        <div className="max-h-32 overflow-y-auto border-t border-red-200 bg-red-50 px-4 py-2 text-xs text-red-600 dark:border-red-900 dark:bg-red-950 dark:text-red-400">
          {errorLine != null && (
            <span className="mr-1 font-semibold">
              Line {errorLine}{error.column != null ? `, Col ${error.column}` : ''}:
            </span>
          )}
          <span className="whitespace-pre-wrap font-mono">{error.message}</span>
        </div>
      )}
    </div>
  );
}
