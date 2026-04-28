/**
 * Vendor-agnostic analytics abstraction.
 *
 * Plug in a real adapter via setAnalyticsAdapter() — e.g. Posthog, Plausible,
 * or any custom backend. Without an adapter, all calls are silent no-ops.
 *
 * Hard rule: event properties must NEVER contain raw YAML text, agent prompts,
 * or any user-authored content — only derived metadata (counts, durations, types).
 */

export type AnalyticsEvents = {
  /** User's workflow rendered successfully as a graph (≥2 agents). */
  workflow_rendered: {
    agent_count: number;
    route_count: number;
    render_time_ms: number;
  };
  /** A YAML error banner was shown to the user. */
  yaml_error_shown: {
    error_type: 'syntax' | 'schema';
  };
  /** User typed in the YAML editor for the first time this session. */
  editor_first_keystroke: Record<string, never>;
  /** User copied the shareable URL. */
  url_copied: {
    agent_count: number;
    yaml_length: number;
  };
};

type TrackFn = <E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E]
) => void;

let _adapter: TrackFn | null = null;

/** Register a platform-specific tracking implementation. */
export function setAnalyticsAdapter(fn: TrackFn): void {
  _adapter = fn;
}

/** Fire a typed analytics event. Silent no-op outside production or if no adapter registered. */
export function track<E extends keyof AnalyticsEvents>(
  event: E,
  properties: AnalyticsEvents[E]
): void {
  if (process.env.NODE_ENV !== 'production') return;
  _adapter?.(event, properties);
}
