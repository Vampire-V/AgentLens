import { ImageResponse } from 'next/og'
import { extractWorkflowMeta } from './extract-workflow-meta'

export const runtime = 'edge'

export function GET(request: Request) {
  const { searchParams } = new URL(request.url)
  const compressed = searchParams.get('yaml')
  const meta = extractWorkflowMeta(compressed)

  return new ImageResponse(
    meta ? (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 3,
            color: '#7c83fd',
            fontWeight: 600,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          AgentLens
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 24,
            lineHeight: 1.1,
          }}
        >
          {meta.name}
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <span
            style={{
              fontSize: 18,
              color: '#7c83fd',
              background: 'rgba(124,131,253,0.15)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            {meta.agentCount} agents
          </span>
          <span
            style={{
              fontSize: 18,
              color: '#aaaaaa',
              background: 'rgba(255,255,255,0.08)',
              padding: '6px 16px',
              borderRadius: 20,
            }}
          >
            {meta.routeCount} routes
          </span>
        </div>
        <div style={{ marginTop: 'auto', fontSize: 14, color: '#444444' }}>
          agent-lens-murex.vercel.app
        </div>
      </div>
    ) : (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '60px 80px',
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a2e 100%)',
          fontFamily: 'monospace',
        }}
      >
        <div
          style={{
            fontSize: 14,
            letterSpacing: 3,
            color: '#7c83fd',
            fontWeight: 600,
            marginBottom: 16,
            textTransform: 'uppercase',
          }}
        >
          Agent Orchestration
        </div>
        <div
          style={{
            fontSize: 52,
            fontWeight: 700,
            color: '#ffffff',
            marginBottom: 16,
          }}
        >
          AgentLens
        </div>
        <div style={{ fontSize: 22, color: '#aaaaaa' }}>
          Visual YAML editor for AI agent orchestration workflows
        </div>
        <div style={{ marginTop: 'auto', fontSize: 14, color: '#444444' }}>
          agent-lens-murex.vercel.app
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  )
}
