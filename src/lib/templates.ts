export interface TemplateCategory {
  id: string
  label: string
}

export const TEMPLATE_CATEGORIES: TemplateCategory[] = [
  { id: 'loop',      label: 'Loop' },
  { id: 'pipeline',  label: 'Pipeline' },
  { id: 'parallel',  label: 'Parallel' },
  { id: 'hub-spoke', label: 'Hub-and-Spoke' },
  { id: 'critic',    label: 'Critic / Review' },
  { id: 'debate',    label: 'Multi-agent Debate' },
]

export interface Template {
  id: string
  name: string
  category: string
  yaml: string
}

export const TEMPLATES: Template[] = [
  {
    id: 'simple-loop',
    name: 'Simple Loop',
    category: 'loop',
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
    category: 'pipeline',
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
    category: 'pipeline',
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
  {
    id: 'fan-out-workers',
    name: 'Fan-out Workers',
    category: 'parallel',
    yaml: `version: "1.0.0"
name: "Fan-out Workers"
agents:
  - id: dispatcher
    name: "Dispatcher"
    role: manager
    model: claude-opus-4-7
    description: "Splits task and dispatches to parallel workers"
    prompt: "Break the incoming task into subtasks and dispatch each to a worker."
  - id: worker_a
    name: "Worker A"
    role: worker
    model: claude-sonnet-4-6
    description: "Handles subtask A"
    prompt: "Process your assigned subtask and return the result."
    tools: [python_repl]
  - id: worker_b
    name: "Worker B"
    role: worker
    model: claude-sonnet-4-6
    description: "Handles subtask B"
    prompt: "Process your assigned subtask and return the result."
    tools: [python_repl]
  - id: worker_c
    name: "Worker C"
    role: worker
    model: claude-sonnet-4-6
    description: "Handles subtask C"
    prompt: "Process your assigned subtask and return the result."
    tools: [python_repl]
  - id: aggregator
    name: "Aggregator"
    role: worker
    model: claude-sonnet-4-6
    description: "Collects and merges results from all workers"
    prompt: "Combine the results from all workers into a single coherent output."
routes:
  - id: r1
    source: dispatcher
    target: worker_a
    label: "subtask A"
  - id: r2
    source: dispatcher
    target: worker_b
    label: "subtask B"
  - id: r3
    source: dispatcher
    target: worker_c
    label: "subtask C"
  - id: r4
    source: worker_a
    target: aggregator
    label: "result A"
  - id: r5
    source: worker_b
    target: aggregator
    label: "result B"
  - id: r6
    source: worker_c
    target: aggregator
    label: "result C"
`,
  },
  {
    id: 'customer-support-router',
    name: 'Customer Support Router',
    category: 'hub-spoke',
    yaml: `version: "1.0.0"
name: "Customer Support Router"
agents:
  - id: router
    name: "Router"
    role: manager
    model: claude-opus-4-7
    description: "Classifies incoming request and routes to the right specialist"
    prompt: "Classify the customer request and route to Tech Support, Billing, or FAQ."
  - id: tech_support
    name: "Tech Support"
    role: worker
    model: claude-sonnet-4-6
    description: "Handles technical issues"
    prompt: "Resolve the technical issue step by step."
    tools: [bash, web_search]
  - id: billing
    name: "Billing"
    role: worker
    model: claude-sonnet-4-6
    description: "Handles billing and payment questions"
    prompt: "Address the billing question accurately."
  - id: faq
    name: "FAQ"
    role: worker
    model: claude-haiku-4-5
    description: "Answers common questions from knowledge base"
    prompt: "Answer the question using the FAQ knowledge base."
    tools: [vector_search]
  - id: escalation
    name: "Escalation"
    role: critic
    model: claude-opus-4-7
    description: "Handles complex or unresolved cases"
    prompt: "Review the unresolved case and provide a resolution or escalate to human."
routes:
  - id: r1
    source: router
    target: tech_support
    label: "technical issue"
    condition: "request is technical"
  - id: r2
    source: router
    target: billing
    label: "billing question"
    condition: "request is billing-related"
  - id: r3
    source: router
    target: faq
    label: "general question"
    condition: "request is general"
  - id: r4
    source: router
    target: escalation
    label: "escalate"
    condition: "request is complex or urgent"
`,
  },
  {
    id: 'writer-critic-loop',
    name: 'Writer-Critic Loop',
    category: 'critic',
    yaml: `version: "1.0.0"
name: "Writer-Critic Loop"
agents:
  - id: writer
    name: "Writer"
    role: worker
    model: claude-sonnet-4-6
    description: "Drafts content based on the brief"
    prompt: "Write a draft based on the given brief. Incorporate any feedback from the Critic."
  - id: critic
    name: "Critic"
    role: critic
    model: claude-opus-4-7
    description: "Reviews draft and decides approve or revise"
    prompt: "Review the draft. If quality is acceptable, approve for publishing. Otherwise, provide specific feedback."
  - id: publisher
    name: "Publisher"
    role: tool
    model: claude-haiku-4-5
    description: "Formats and publishes approved content"
    prompt: "Format the approved content and publish it."
    tools: [file_write]
routes:
  - id: r1
    source: writer
    target: critic
    label: "draft ready"
  - id: r2
    source: critic
    target: writer
    label: "needs revision"
    condition: "quality below threshold"
  - id: r3
    source: critic
    target: publisher
    label: "approved"
    condition: "quality acceptable"
`,
  },
  {
    id: 'three-way-debate',
    name: 'Three-way Debate',
    category: 'debate',
    yaml: `version: "1.0.0"
name: "Three-way Debate"
agents:
  - id: moderator
    name: "Moderator"
    role: manager
    model: claude-opus-4-7
    description: "Sets the topic and orchestrates debate rounds"
    prompt: "Introduce the debate topic and prompt each side to present arguments. After each round, ask the Judge for a verdict."
  - id: proponent
    name: "Proponent"
    role: worker
    model: claude-sonnet-4-6
    description: "Argues in favor of the proposition"
    prompt: "Present the strongest argument in favor of the proposition. Rebut the opponent's points if provided."
  - id: opponent
    name: "Opponent"
    role: worker
    model: claude-sonnet-4-6
    description: "Argues against the proposition"
    prompt: "Present the strongest argument against the proposition. Rebut the proponent's points if provided."
  - id: judge
    name: "Judge"
    role: critic
    model: claude-opus-4-7
    description: "Evaluates arguments and declares a winner"
    prompt: "Evaluate both sides objectively. Score each argument and declare a winner with reasoning."
routes:
  - id: r1
    source: moderator
    target: proponent
    label: "present argument"
  - id: r2
    source: moderator
    target: opponent
    label: "present argument"
  - id: r3
    source: proponent
    target: judge
    label: "argument submitted"
  - id: r4
    source: opponent
    target: judge
    label: "argument submitted"
  - id: r5
    source: judge
    target: moderator
    label: "verdict"
`,
  },
]
