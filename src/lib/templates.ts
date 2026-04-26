export interface Template {
  id: string
  name: string
  yaml: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'simple-loop',
    name: 'Simple Loop',
    yaml: `version: "1.0.0"
name: "Simple Loop"
agents:
  - id: planner
    name: "Planner"
    role: manager
    model: claude-opus-4-7
    prompt: "Plan the task and delegate to the executor."
  - id: executor
    name: "Executor"
    role: worker
    model: claude-sonnet-4-6
    tools: [bash, file_write]
    prompt: "Execute the plan and report results back."
routes:
  - id: r1
    source: planner
    target: executor
    label: "execute"
  - id: r2
    source: executor
    target: planner
    label: "result"
`,
  },
  {
    id: 'research-pipeline',
    name: 'Research Pipeline',
    yaml: `version: "1.0.0"
name: "AI Research Pipeline"
agents:
  - id: coordinator
    name: "Coordinator"
    role: manager
    model: claude-opus-4-7
    prompt: "Orchestrate the research pipeline."
  - id: web_researcher
    name: "Web Researcher"
    role: worker
    model: claude-sonnet-4-6
    tools: [web_search, browse_url]
  - id: fact_checker
    name: "Fact Checker"
    role: critic
    model: claude-sonnet-4-6
    tools: [web_search]
    prompt: "Verify claims and flag inaccuracies."
  - id: writer
    name: "Report Writer"
    role: worker
    model: claude-sonnet-4-6
    prompt: "Synthesize findings into a structured report."
  - id: memory
    name: "Memory Store"
    role: tool
    model: claude-haiku-4-5
    tools: [vector_search]
routes:
  - id: r1
    source: coordinator
    target: web_researcher
    label: "research brief"
  - id: r2
    source: web_researcher
    target: fact_checker
    label: "raw findings"
  - id: r3
    source: fact_checker
    target: writer
    label: "verified data"
  - id: r4
    source: writer
    target: coordinator
    label: "draft report"
  - id: r5
    source: coordinator
    target: memory
    label: "store context"
`,
  },
  {
    id: 'sequential-chain',
    name: 'Sequential Chain',
    yaml: `version: "1.0.0"
name: "Sequential Chain"
agents:
  - id: intake
    name: "Intake"
    role: manager
    model: claude-opus-4-7
    prompt: "Receive and validate the user request."
  - id: enricher
    name: "Enricher"
    role: worker
    model: claude-sonnet-4-6
    tools: [web_search, extract_content]
  - id: processor
    name: "Processor"
    role: worker
    model: claude-sonnet-4-6
    tools: [python_repl]
  - id: reviewer
    name: "Reviewer"
    role: critic
    model: claude-sonnet-4-6
    prompt: "Review output for quality and accuracy."
  - id: formatter
    name: "Formatter"
    role: worker
    model: claude-haiku-4-5
    prompt: "Format the result into the final output."
routes:
  - id: r1
    source: intake
    target: enricher
    label: "validated request"
  - id: r2
    source: enricher
    target: processor
    label: "enriched data"
  - id: r3
    source: processor
    target: reviewer
    label: "raw result"
  - id: r4
    source: reviewer
    target: formatter
    label: "approved result"
`,
  },
]
