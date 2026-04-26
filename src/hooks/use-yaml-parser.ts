'use client'; // stateful hook with useEffect — must run client-side

import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { WorkflowSchema, type Workflow, type ParseError } from '@/lib/yaml-schema';

export interface ParseResult {
  workflow: Workflow | null;
  error: ParseError | null;
}

type YamlMark = { line?: number; column?: number };

export function useYamlParser(yamlText: string, debounceMs = 150): ParseResult {
  const [result, setResult] = useState<ParseResult>({ workflow: null, error: null });

  useEffect(() => {
    const id = setTimeout(() => {
      if (!yamlText.trim()) {
        setResult({ workflow: null, error: null });
        return;
      }
      try {
        const parsed = yaml.load(yamlText);
        const workflow = WorkflowSchema.parse(parsed);
        setResult({ workflow, error: null });
      } catch (err) {
        const mark = (err as { mark?: YamlMark }).mark;
        setResult({
          workflow: null,
          error: {
            message: err instanceof Error ? err.message : String(err),
            line: mark?.line != null ? mark.line + 1 : undefined,
            column: mark?.column != null ? mark.column + 1 : undefined,
          },
        });
      }
    }, debounceMs);

    return () => clearTimeout(id);
  }, [yamlText, debounceMs]);

  return result;
}
