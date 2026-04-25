import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useYamlParser } from '../use-yaml-parser';

const validYaml = `
name: Test
agents:
  - id: orchestrator
    name: Orchestrator
  - id: backend-engineer
    name: Backend Engineer
routes:
  - id: r1
    source: orchestrator
    target: backend-engineer
    label: Feature request
`;

const invalidYamlSyntax = `
agents:
  - id: [broken yaml
`;

const invalidSchemaYaml = `
agents:
  - id: agent-a
`;

describe('useYamlParser', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('valid_yaml_string__parse__returns_workflow_and_null_error', async () => {
    const { result } = renderHook(() => useYamlParser(validYaml));
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.workflow).not.toBeNull();
    expect(result.current.error).toBeNull();
    expect(result.current.workflow?.agents).toHaveLength(2);
  });

  it('invalid_yaml_syntax__parse__returns_null_workflow_and_error_message', async () => {
    const { result } = renderHook(() => useYamlParser(invalidYamlSyntax));
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.workflow).toBeNull();
    expect(result.current.error).not.toBeNull();
  });

  it('empty_string__parse__returns_null_workflow_and_null_error', async () => {
    const { result } = renderHook(() => useYamlParser(''));
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.workflow).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('schema_violation_yaml__parse__returns_null_workflow_and_error', async () => {
    const { result } = renderHook(() => useYamlParser(invalidSchemaYaml));
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.workflow).toBeNull();
    expect(result.current.error).not.toBeNull();
  });

  it('rapid_typing__before_debounce__result_is_still_initial', () => {
    const { result } = renderHook(() => useYamlParser(validYaml));
    // ยังไม่ advance time — debounce ยังไม่หมด
    expect(result.current.workflow).toBeNull();
    expect(result.current.error).toBeNull();
  });

  it('non_error_throw__parse__returns_string_error_message', async () => {
    // js-yaml อาจ throw string ใน edge case บาง version
    const weirdYaml = '{a: b: c}';
    const { result } = renderHook(() => useYamlParser(weirdYaml));
    await act(async () => {
      vi.advanceTimersByTime(150);
    });
    expect(result.current.workflow).toBeNull();
    expect(result.current.error).not.toBeNull();
  });
});
