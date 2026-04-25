'use client'; // stateful hook with useEffect — must run client-side

import { useState, useEffect } from 'react';
import yaml from 'js-yaml';
import { WorkflowSchema, type Workflow } from '@/lib/yaml-schema';

export interface ParseResult {
  workflow: Workflow | null;
  error: string | null;
}

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
        setResult({
          workflow: null,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }, debounceMs);

    return () => clearTimeout(id);
  }, [yamlText, debounceMs]);

  return result;
}
