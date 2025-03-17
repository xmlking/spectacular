import { describe, expect, it } from 'vitest';
import { langs } from './constants.js';

// RUN: turbo run test --filter=./packages/smart/src/components
// in-source testing
describe('languages test', () => {
  it('fill missing lang', () => {
    const filledLangs = langs
      .map((entry) => {
        if (entry[1] && Array.isArray(entry[1]) && entry[1].length === 1) {
          entry[1].push(entry[0]);
          return [entry[0], entry[1]];
        }
        return entry;
      })
      .sort((a, b) => (a[0] < b[0] ? -1 : 1));

    expect(filledLangs[0]).toEqual(['Afrikaans', ['af-ZA', 'Afrikaans']]);
  });
});
