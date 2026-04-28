'use client'; // stateful hook with useEffect — must run client-side

import { useState, useEffect, useRef } from 'react';
import yaml from 'js-yaml';
import { ZodError } from 'zod';
import { WorkflowSchema, type Workflow, type ParseError } from '@/lib/yaml-schema';
import { track } from '@/lib/analytics';

export interface ParseResult {
  workflow: Workflow | null;
  error: ParseError | null;
}

type YamlMark = { line?: number; column?: number };

export function useYamlParser(yamlText: string, debounceMs = 150): ParseResult {
  const [result, setResult] = useState<ParseResult>({ workflow: null, error: null });
  // avoid duplicate fires for the same consecutive error
  const lastErrorMsgRef = useRef<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      if (!yamlText.trim()) {
        lastErrorMsgRef.current = null;
        setResult({ workflow: null, error: null });
        return;
      }
      try {
        const parsed = yaml.load(yamlText);
        const workflow = WorkflowSchema.parse(parsed);
        lastErrorMsgRef.current = null;
        setResult({ workflow, error: null });
      } catch (err) {
        if (err instanceof ZodError) {
          const issue = err.issues[0];
          const path = issue.path
            .map((p) => (typeof p === 'number' ? `[${p + 1}]` : p))
            .join(' → ');
          const message = path ? `${path}: ${issue.message}` : issue.message;
          if (lastErrorMsgRef.current !== message) {
            lastErrorMsgRef.current = message;
            track('yaml_error_shown', { error_type: 'schema' });
          }
          setResult({ workflow: null, error: { message } });
          return;
        }
        const mark = (err as { mark?: YamlMark }).mark;
        const message = err instanceof Error ? err.message : String(err);
        if (lastErrorMsgRef.current !== message) {
          lastErrorMsgRef.current = message;
          track('yaml_error_shown', { error_type: 'syntax' });
        }
        setResult({
          workflow: null,
          error: {
            message,
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
