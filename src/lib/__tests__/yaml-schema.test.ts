import { describe, it, expect } from 'vitest';
import { WorkflowSchema } from '../yaml-schema';

const validWorkflow = {
  name: 'Test Workflow',
  agents: [
    { id: 'orchestrator', name: 'Orchestrator', model: 'opus' as const },
    { id: 'backend-engineer', name: 'Backend Engineer' },
    { id: 'quality-auditor', name: 'Quality Auditor' },
  ],
  routes: [
    { id: 'r1', source: 'orchestrator', target: 'backend-engineer', label: 'Feature request' },
    { id: 'r2', source: 'backend-engineer', target: 'quality-auditor', label: 'Done' },
  ],
};

describe('WorkflowSchema', () => {
  it('valid_workflow__parse__returns_workflow_object', () => {
    const result = WorkflowSchema.parse(validWorkflow);
    expect(result.agents).toHaveLength(3);
    expect(result.routes).toHaveLength(2);
    expect(result.version).toBe('1.0.0');
  });

  it('missing_agent_name__parse__throws_zod_error', () => {
    const input = {
      agents: [{ id: 'orchestrator' }],
    };
    expect(() => WorkflowSchema.parse(input)).toThrow();
  });

  it('route_with_unknown_agent_id__parse__throws_refine_error', () => {
    const input = {
      agents: [{ id: 'orchestrator', name: 'Orchestrator' }],
      routes: [{ id: 'r1', source: 'orchestrator', target: 'nonexistent', label: 'Goes nowhere' }],
    };
    expect(() => WorkflowSchema.parse(input)).toThrow(/route source\/target/i);
  });

  it('empty_agents_array__parse__throws_min_error', () => {
    const input = { agents: [] };
    expect(() => WorkflowSchema.parse(input)).toThrow();
  });

  it('optional_fields_absent__parse__succeeds_with_defaults', () => {
    const input = {
      agents: [{ id: 'agent-a', name: 'Agent A' }],
    };
    const result = WorkflowSchema.parse(input);
    expect(result.version).toBe('1.0.0');
    expect(result.routes).toEqual([]);
    expect(result.agents[0].tools).toEqual([]);
  });

  it('agent_with_role_manager__parse__succeeds_with_role', () => {
    const input = {
      agents: [{ id: 'agent-a', name: 'Agent A', role: 'manager' }],
    };
    const result = WorkflowSchema.parse(input);
    expect(result.agents[0].role).toBe('manager');
  });

  it('agent_with_role_invalid__parse__fails_validation', () => {
    const input = {
      agents: [{ id: 'agent-a', name: 'Agent A', role: 'invalid-role' }],
    };
    expect(() => WorkflowSchema.parse(input)).toThrow();
  });

  it('agent_with_prompt__parse__includes_prompt_in_output', () => {
    const input = {
      agents: [{ id: 'agent-a', name: 'Agent A', prompt: 'You are a helpful assistant.' }],
    };
    const result = WorkflowSchema.parse(input);
    expect(result.agents[0].prompt).toBe('You are a helpful assistant.');
  });

  it('agent_with_arbitrary_model_string__parse__succeeds', () => {
    const input = {
      agents: [{ id: 'agent-a', name: 'Agent A', model: 'claude-opus-4-7' }],
    };
    const result = WorkflowSchema.parse(input);
    expect(result.agents[0].model).toBe('claude-opus-4-7');
  });
});
