import { describe, it, expect } from 'vitest'
import { TEMPLATES } from '../templates'

describe('TEMPLATES', () => {
  it('templates_count__access__returns_three', () => {
    expect(TEMPLATES).toHaveLength(3)
  })

  it('template_shape__access__has_id_name_yaml', () => {
    for (const t of TEMPLATES) {
      expect(typeof t.id).toBe('string')
      expect(typeof t.name).toBe('string')
      expect(typeof t.yaml).toBe('string')
      expect(t.yaml.length).toBeGreaterThan(0)
    }
  })

  it('template_yaml__access__contains_agents_key', () => {
    for (const t of TEMPLATES) {
      expect(t.yaml).toContain('agents:')
    }
  })
})
