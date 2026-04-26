import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import React from 'react';

// Mock @xyflow/react before importing component
vi.mock('@xyflow/react', () => ({
  getBezierPath: vi.fn(() => ['M0 0 C50 0 50 100 100 100', 50, 50] as [string, number, number]),
  EdgeLabelRenderer: ({ children }: { children: React.ReactNode }) => <>{children}</>,
  Position: { Left: 'left', Right: 'right', Top: 'top', Bottom: 'bottom' },
}));

import { AnimatedEdge } from '../animated-edge';
import { Position } from '@xyflow/react';

const baseProps = {
  id: 'test-edge',
  sourceX: 0,
  sourceY: 0,
  targetX: 100,
  targetY: 100,
  sourcePosition: Position.Right,
  targetPosition: Position.Left,
  source: 'agent1',
  target: 'agent2',
  selected: false,
  animated: false,
  interactionWidth: 20,
  markerEnd: undefined,
  data: undefined,
};

describe('AnimatedEdge', () => {
  it('no_data__render__path_and_three_animate_motion', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} /></svg>
    );
    expect(container.querySelector('path#edge-path-test-edge')).toBeTruthy();
    const motions = container.querySelectorAll('animateMotion');
    expect(motions).toHaveLength(3);
  });

  it('manager_source__render__purple_dot', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'manager' }} /></svg>
    );
    const circles = container.querySelectorAll('circle');
    circles.forEach((c) => expect(c.getAttribute('fill')).toBe('#a78bfa'));
  });

  it('worker_source__render__blue_dot', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker' }} /></svg>
    );
    const circles = container.querySelectorAll('circle');
    circles.forEach((c) => expect(c.getAttribute('fill')).toBe('#60a5fa'));
  });

  it('no_label__render__no_tooltip', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker' }} /></svg>
    );
    expect(container.querySelector('.nodrag')).toBeNull();
  });

  it('with_label__render__tooltip_element', () => {
    const { container } = render(
      <svg><AnimatedEdge {...baseProps} data={{ sourceRole: 'worker', label: 'research brief' }} /></svg>
    );
    expect(container.querySelector('.nodrag')).toBeTruthy();
    expect(container.textContent).toContain('research brief');
  });
});
