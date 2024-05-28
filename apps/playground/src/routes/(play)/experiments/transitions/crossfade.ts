import { cubicOut } from 'svelte/easing';
import { assign, is_function } from 'svelte/internal';
import type { EasingFunction, TransitionConfig } from 'svelte/types/runtime/transition';

export interface CrossfadeParams {
  delay?: number;
  duration?: number | ((len: number) => number);
  easing?: EasingFunction;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ClientRectMap = Map<any, { rect: DOMRect }>;

export function crossfade({
  fallback,
  ...defaults
}: CrossfadeParams & {
  fallback?: (node: Element, params: CrossfadeParams, intro: boolean) => TransitionConfig;
}): [
  (
    node: Element,
    params: CrossfadeParams & {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      key: any;
    },
  ) => () => TransitionConfig,
  (
    node: Element,
    params: CrossfadeParams & {
      // eslint-disable-next-line  @typescript-eslint/no-explicit-any
      key: any;
    },
  ) => () => TransitionConfig,
] {
  const to_receive: ClientRectMap = new Map();
  const to_send: ClientRectMap = new Map();

  function crossfade(target: DOMRect, node: Element, params: CrossfadeParams, inTransition: boolean): TransitionConfig {
    const {
      delay = 0,
      duration = (d: number) => Math.sqrt(d) * 30,
      easing = cubicOut,
    } = assign(assign({}, defaults), params);

    const from = node.getBoundingClientRect();
    const dx = target.left - from.left;
    const dy = target.top - from.top;
    const dw = target.width - from.width;
    const dh = target.height - from.height;
    const d = Math.sqrt(dx * dx + dy * dy);

    if (!inTransition) console.log(target.x, target.y, target.height, target.width, dw, dh);

    const style = getComputedStyle(node);
    const transform = style.transform === 'none' ? '' : style.transform;

    return {
      delay,
      duration: is_function(duration) ? duration(d) : duration,
      easing,
      css: (t, u) => `
					position: absolute;
					z-index: 10;
					opacity: ${inTransition ? 1 : 0};
					width: ${from.width + u * dw}px;
					height: ${from.height + u * dh}px;
					transform: ${transform} translate(${u * dx}px,${u * dy}px);
				`,
    };
  }

  function transition(items: ClientRectMap, counterparts: ClientRectMap, inTransition: boolean) {
    // eslint-disable-next-line  @typescript-eslint/no-explicit-any
    return (node: Element, params: CrossfadeParams & { key: any }) => {
      items.set(params.key, {
        rect: node.getBoundingClientRect(),
      });

      return (): TransitionConfig => {
        if (counterparts.has(params.key)) {
          const { rect } = counterparts.get(params.key)!;
          counterparts.delete(params.key);

          return crossfade(rect, node, params, inTransition);
        }

        // if the node is disappearing altogether
        // (i.e. wasn't claimed by the other list)
        // then we need to supply an outro
        items.delete(params.key);

        return fallback && fallback(node, params, inTransition);
      };
    };
  }

  return [
    transition(to_send, to_receive, false), // Out transition
    transition(to_receive, to_send, true), // In transition
  ];
}
