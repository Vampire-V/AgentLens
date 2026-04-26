export type GuideSlug = 'visualize-crewai' | 'visualize-langgraph';

export interface Guide {
  slug: GuideSlug;
  title: string;
  framework: string;
  description: string;
  targetKeyword: string;
  lastModified: string;
}

export const GUIDES: Guide[] = [
  {
    slug: 'visualize-crewai',
    title: 'How to Visualize Your CrewAI Workflow',
    framework: 'CrewAI',
    description:
      'Learn how to use AgentLens to visualize and debug your CrewAI agent workflows. Export your agent configuration to YAML and see the orchestration graph rendered in real time.',
    targetKeyword: 'CrewAI visualizer',
    lastModified: '2026-04-27',
  },
  {
    slug: 'visualize-langgraph',
    title: 'How to Visualize Your LangGraph Diagram',
    framework: 'LangGraph',
    description:
      'Discover how AgentLens helps you visualize LangGraph state machines and agent architectures. Convert your LangGraph definition to YAML and explore your graph topology interactively.',
    targetKeyword: 'LangGraph diagram tool',
    lastModified: '2026-04-27',
  },
];

export function getGuide(slug: GuideSlug): Guide {
  const guide = GUIDES.find((g) => g.slug === slug);
  if (!guide) {
    throw new Error(`Guide not found for slug: ${slug}`);
  }
  return guide;
}
