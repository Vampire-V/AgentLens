import { describe, it, expect } from 'vitest'
import * as yaml from 'js-yaml'
import { TEMPLATES, TEMPLATE_CATEGORIES } from '../templates'
import { WorkflowSchema } from '../yaml-schema'

describe('TEMPLATES', () => {
  it('templates_count__access__returns_seven', () => {
    expect(TEMPLATES).toHaveLength(7)
  })

  it('template_shape__access__has_id_name_category_yaml', () => {
    for (const t of TEMPLATES) {
      expect(typeof t.id).toBe('string')
      expect(typeof t.name).toBe('string')
      expect(typeof t.category).toBe('string')
      expect(typeof t.yaml).toBe('string')
      expect(t.yaml.length).toBeGreaterThan(0)
    }
  })

  it('template_category__access__valid_category_id', () => {
    const validIds = new Set(TEMPLATE_CATEGORIES.map((c) => c.id))
    for (const t of TEMPLATES) {
      expect(validIds.has(t.category), `template "${t.id}" has invalid category "${t.category}"`).toBe(true)
    }
  })

  it('template_yaml__access__contains_agents_key', () => {
    for (const t of TEMPLATES) {
      expect(t.yaml).toContain('agents:')
    }
  })

  it('template_yaml__parse__valid_yaml', () => {
    for (const t of TEMPLATES) {
      expect(() => yaml.load(t.yaml), `template "${t.id}" has invalid YAML`).not.toThrow()
    }
  })

  it('template_yaml__validate__passes_workflow_schema', () => {
    for (const t of TEMPLATES) {
      const parsed = yaml.load(t.yaml)
      const result = WorkflowSchema.safeParse(parsed)
      expect(result.success, `template "${t.id}" failed schema: ${result.success ? '' : JSON.stringify(result.error.issues)}`).toBe(true)
    }
  })
})

describe('TEMPLATE_CATEGORIES', () => {
  it('categories__access__all_six_present', () => {
    expect(TEMPLATE_CATEGORIES).toHaveLength(6)
  })

  it('categories__coverage__each_has_at_least_one_template', () => {
    for (const cat of TEMPLATE_CATEGORIES) {
      const count = TEMPLATES.filter((t) => t.category === cat.id).length
      expect(count, `category "${cat.id}" has no templates`).toBeGreaterThanOrEqual(1)
    }
  })
})
