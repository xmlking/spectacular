/**
 * Usage:
 * <label>
 *	<input type="checkbox" bind:checked={visible} />
 *	visible
 *</label>
 *
 *{#if visible}
 *	<p transition:typewriter>
 *		All work and no play makes Jack a dull boy All work and no play makes Jack a dull boy All work
 *		and no play mmakes Jack a dull boy All work and no PLay ma es Jack a dull boy All work and no
 *		play makes Jack a dull boy
 *	</p>
 *{/if}
 *
 *<style>
 *	p {
 *		font-family: 'Courier New', Courier, monospace;
 *		width: 43ch;
 *	}
 *</style>
 */
import type { TransitionConfig } from 'svelte/transition';

export function typewriter(node: Element, { speed = 4 }: TransitionConfig) {
  const valid = node.childNodes.length === 1 && node.childNodes[0].nodeType === Node.TEXT_NODE;

  if (!valid) {
    throw new Error('This transition only works on elements with a single text node child');
  }

  const text = node.textContent;
  const duration = text.length / (speed * 0.01);

  return {
    duration,
    tick: (t) => {
      const i = Math.trunc(text.length * t);
      node.textContent = text.slice(0, i);
    },
  };
}
