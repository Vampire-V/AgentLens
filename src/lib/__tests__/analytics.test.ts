import { describe, it, expect, vi, afterEach } from 'vitest';
import { track, setAnalyticsAdapter } from '../analytics';

afterEach(() => {
  vi.unstubAllEnvs();
  setAnalyticsAdapter(() => {}); // reset to no-op between tests
});

describe('track', () => {
  it('production_env__track_workflow_rendered__calls_adapter_with_properties', () => {
    const adapter = vi.fn();
    setAnalyticsAdapter(adapter);
    vi.stubEnv('NODE_ENV', 'production');

    track('workflow_rendered', { agent_count: 3, route_count: 2, render_time_ms: 42 });

    expect(adapter).toHaveBeenCalledOnce();
    expect(adapter).toHaveBeenCalledWith('workflow_rendered', {
      agent_count: 3,
      route_count: 2,
      render_time_ms: 42,
    });
  });

  it('production_env__track_yaml_error_shown__calls_adapter_with_error_type', () => {
    const adapter = vi.fn();
    setAnalyticsAdapter(adapter);
    vi.stubEnv('NODE_ENV', 'production');

    track('yaml_error_shown', { error_type: 'schema' });
    track('yaml_error_shown', { error_type: 'syntax' });

    expect(adapter).toHaveBeenCalledTimes(2);
    expect(adapter).toHaveBeenNthCalledWith(1, 'yaml_error_shown', { error_type: 'schema' });
    expect(adapter).toHaveBeenNthCalledWith(2, 'yaml_error_shown', { error_type: 'syntax' });
  });

  it('production_env__track_editor_first_keystroke__calls_adapter_with_empty_props', () => {
    const adapter = vi.fn();
    setAnalyticsAdapter(adapter);
    vi.stubEnv('NODE_ENV', 'production');

    track('editor_first_keystroke', {});

    expect(adapter).toHaveBeenCalledOnce();
    expect(adapter).toHaveBeenCalledWith('editor_first_keystroke', {});
  });

  it('non_production_env__track__does_not_call_adapter', () => {
    const adapter = vi.fn();
    setAnalyticsAdapter(adapter);
    // NODE_ENV is 'test' by default in Vitest — no stub needed

    track('yaml_error_shown', { error_type: 'syntax' });

    expect(adapter).not.toHaveBeenCalled();
  });
});

describe('setAnalyticsAdapter', () => {
  it('replace_adapter__track_in_production__only_calls_new_adapter', () => {
    const first = vi.fn();
    const second = vi.fn();
    setAnalyticsAdapter(first);
    setAnalyticsAdapter(second);
    vi.stubEnv('NODE_ENV', 'production');

    track('editor_first_keystroke', {});

    expect(first).not.toHaveBeenCalled();
    expect(second).toHaveBeenCalledOnce();
  });
});
