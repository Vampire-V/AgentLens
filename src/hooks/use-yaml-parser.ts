'use client'; // uses useMemo — must run client-side

import { useMemo } from 'react';
import yaml from 'js-yaml';
import { WorkflowSchema, type Workflow } from '@/lib/yaml-schema';

export interface ParseResult {
  workflow: Workflow | null;
  error: string | null;
}

export function useYamlParser(yamlText: string): ParseResult {
  return useMemo(() => {
    if (!yamlText.trim()) {
      return { workflow: null, error: null };
    }
    try {
      const parsed = yaml.load(yamlText);
      const workflow = WorkflowSchema.parse(parsed);
      return { workflow, error: null };
    } catch (err) {
      return { workflow: null, error: err instanceof Error ? err.message : String(err) };
    }
  }, [yamlText]);
}
