export const DEFAULT_YAML = `version: "1.0.0"
name: "AI Research Pipeline"
agents:
  - id: coordinator
    name: "Coordinator"
    role: manager
    model: claude-opus-4-7
    prompt: |
      Hub of the pipeline. Receive the user's question, dispatch parallel
      research tasks to specialists, receive the final report, then archive
      results to memory for future retrieval.

  - id: web_researcher
    name: "Web Researcher"
    role: worker
    model: claude-sonnet-4-6
    tools: [web_search, browse_url, extract_content]
    prompt: "Search the web and extract relevant information on the assigned topic."

  - id: data_analyst
    name: "Data Analyst"
    role: worker
    model: claude-sonnet-4-6
    tools: [python_repl, csv_reader, chart_generator]
    prompt: "Analyze datasets, run calculations, and produce data-backed insights."

  - id: fact_checker
    name: "Fact Checker"
    role: critic
    model: claude-sonnet-4-6
    tools: [web_search]
    prompt: "Cross-check all claims from researchers. Flag anything unverified before writing."

  - id: writer
    name: "Report Writer"
    role: worker
    model: claude-sonnet-4-6
    prompt: "Synthesize verified findings into a clear, structured report for the user."

  - id: memory
    name: "Memory Store"
    role: tool
    model: claude-haiku-4-5
    tools: [vector_search, upsert_memory]
    prompt: "Persist completed research so future queries can retrieve prior context."

routes:
  - id: r1
    source: coordinator
    target: web_researcher
    label: "search task"
  - id: r2
    source: coordinator
    target: data_analyst
    label: "analysis task"
  - id: r3
    source: web_researcher
    target: fact_checker
    label: "search results"
  - id: r4
    source: data_analyst
    target: fact_checker
    label: "data insights"
  - id: r5
    source: fact_checker
    target: writer
    label: "verified findings"
  - id: r6
    source: writer
    target: coordinator
    label: "final report"
    condition: "deliver to coordinator → present to user"
  - id: r7
    source: coordinator
    target: memory
    label: "archive results"
    condition: "after report delivered"
`
