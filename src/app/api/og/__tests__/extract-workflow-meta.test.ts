import { describe, it, expect } from 'vitest'
import LZString from 'lz-string'
import { extractWorkflowMeta } from '../extract-workflow-meta'

function compress(yaml: string) {
  return LZString.compressToEncodedURIComponent(yaml)
}

describe('extractWorkflowMeta', () => {
  it('valid_yaml__extracts_name_agents_routes__returns_meta', () => {
    const yaml = `
name: "AI Research Pipeline"
agents:
  - id: a
  - id: b
routes:
  - id: r1
  - id: r2
  - id: r3
`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'AI Research Pipeline', agentCount: 2, routeCount: 3 })
  })

  it('null_input__called_with_null__returns_null', () => {
    expect(extractWorkflowMeta(null)).toBeNull()
  })

  it('undefined_input__called_with_undefined__returns_null', () => {
    expect(extractWorkflowMeta(undefined)).toBeNull()
  })

  it('yaml_missing_agents_and_routes__extracts_name__returns_zero_counts', () => {
    const yaml = `name: "Empty Pipeline"`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'Empty Pipeline', agentCount: 0, routeCount: 0 })
  })

  it('yaml_missing_name__extracts_with_fallback__returns_default_name', () => {
    const yaml = `
agents:
  - id: a
routes: []
`
    const result = extractWorkflowMeta(compress(yaml))
    expect(result).toEqual({ name: 'Untitled Workflow', agentCount: 1, routeCount: 0 })
  })

  it('garbage_string__decompress_fails__returns_null', () => {
    expect(extractWorkflowMeta('!!not-yaml!!')).toBeNull()
  })

  it('empty_string__called_with_empty_string__returns_null', () => {
    expect(extractWorkflowMeta('')).toBeNull()
  })

  it('yaml_is_array_not_object__parse_returns_wrong_type__returns_null', () => {
    expect(extractWorkflowMeta(compress('- item1\n- item2'))).toBeNull()
  })

  it('agents_is_not_array__wrong_type__returns_zero_agent_count', () => {
    const result = extractWorkflowMeta(compress('name: X\nagents: not-an-array'))
    expect(result).toEqual({ name: 'X', agentCount: 0, routeCount: 0 })
  })
})
