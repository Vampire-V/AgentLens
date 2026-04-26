import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { DarkModeToggle } from '../dark-mode-toggle';

// Mock next-themes
vi.mock('next-themes', () => ({
  useTheme: vi.fn(),
}));

// Import after mock
import { useTheme } from 'next-themes';

const mockUseTheme = useTheme as ReturnType<typeof vi.fn>;

describe('DarkModeToggle', () => {
  const mockSetTheme = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('light_mode__renders__shows_moon_icon', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    const { container } = render(<DarkModeToggle />);

    // The Moon icon should be rendered (when theme is light)
    const moonIcon = container.querySelector('svg.lucide-moon');
    expect(moonIcon).toBeTruthy();

    // The Sun icon should not be rendered in this component
    const sunIcon = within(container.firstElementChild as HTMLElement).queryByRole('img', { hidden: true });
    const sunSvg = container.querySelector('svg.lucide-sun');
    expect(sunSvg).toBeFalsy();
  });

  it('dark_mode__renders__shows_sun_icon', () => {
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    const { container } = render(<DarkModeToggle />);

    // The Sun icon should be rendered (when theme is dark)
    const sunIcon = container.querySelector('svg.lucide-sun');
    expect(sunIcon).toBeTruthy();

    // The Moon icon should not be rendered in this component
    const moonIcon = container.querySelector('svg.lucide-moon');
    expect(moonIcon).toBeFalsy();
  });

  it('light_mode__click_button__calls_setTheme_dark', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'light',
      setTheme: mockSetTheme,
    });

    const { container } = render(<DarkModeToggle />);

    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });

  it('dark_mode__click_button__calls_setTheme_light', async () => {
    const user = userEvent.setup();
    mockUseTheme.mockReturnValue({
      resolvedTheme: 'dark',
      setTheme: mockSetTheme,
    });

    const { container } = render(<DarkModeToggle />);

    const button = container.querySelector('button') as HTMLButtonElement;
    expect(button).toBeTruthy();
    await user.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
    expect(mockSetTheme).toHaveBeenCalledTimes(1);
  });
});
