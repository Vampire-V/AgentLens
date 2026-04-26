import LZString from 'lz-string'
import * as yaml from 'js-yaml'

export interface WorkflowMeta {
  name: string
  agentCount: number
  routeCount: number
}

export function extractWorkflowMeta(
  compressed: string | null | undefined
): WorkflowMeta | null {
  try {
    if (!compressed) return null
    const raw = LZString.decompressFromEncodedURIComponent(compressed) ?? compressed
    const doc = yaml.load(raw)
    if (!doc || typeof doc !== 'object' || Array.isArray(doc)) return null
    const d = doc as Record<string, unknown>
    return {
      name: typeof d.name === 'string' ? d.name : 'Untitled Workflow',
      agentCount: Array.isArray(d.agents) ? d.agents.length : 0,
      routeCount: Array.isArray(d.routes) ? d.routes.length : 0,
    }
  } catch {
    return null
  }
}
