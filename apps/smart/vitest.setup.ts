// Ref: https://github.com/huntabyte/bits-ui/blob/main/tests/other/setup-test.ts
import '@vitest/browser/matchers';
import '@vitest/browser/providers/playwright';
import type * as environment from '$app/environment';
import type * as navigation from '$app/navigation';

import { vi } from 'vitest';

// Mock SvelteKit runtime module $app/environment
vi.mock('$app/environment', (): typeof environment => ({
  browser: false,
  dev: true,
  building: false,
  version: 'any',
}));

// Mock SvelteKit runtime module $app/navigation
vi.mock('$app/navigation', (): typeof navigation => ({
  afterNavigate: () => {},
  beforeNavigate: () => {},
  disableScrollHandling: () => {},
  goto: () => Promise.resolve(),
  invalidate: () => Promise.resolve(),
  invalidateAll: () => Promise.resolve(),
  preloadData: () => Promise.resolve({ type: 'loaded' as const, status: 200, data: {} }),
  preloadCode: () => Promise.resolve(),
  onNavigate: () => {},
  pushState: () => {},
  replaceState: () => {},
}));

// required for svelte5 + jsdom as jsdom does not support matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  enumerable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// add more mocks here if you need them
