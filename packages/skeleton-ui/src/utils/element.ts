import { browser } from './env.js';

export type ElementOrSelector = HTMLElement | string | undefined;

/**
 * Returns the target node from the provided target or the fallback node.
 */
export function getElement(target: ElementOrSelector, fallback: HTMLElement): HTMLElement;
export function getElement(target: ElementOrSelector): HTMLElement | undefined;
export function getElement(target: ElementOrSelector, fallback?: HTMLElement) {
  return (typeof target === 'string' ? document.querySelector(target) : target) || fallback;
}

/**
 * Returns the text content of the target node. If the target is an input or textarea, its value is returned. Otherwise, textContent is returned.
 */
export function getTextContent(target: Element) {
  return target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement
    ? target.value
    : target.textContent || '';
}

/**
 * Sets the text content of the target node. If the target is an input or textarea, its value is set. Otherwise, textContent is set.
 */
export function setTextContent(target: Element, text: string) {
  if (target instanceof HTMLInputElement || target instanceof HTMLTextAreaElement) {
    target.value = text;
  } else {
    target.textContent = text;
  }
}

// This list originates from: https://stackoverflow.com/a/30753870
const focusableElements = `
    a[href]:not([tabindex='-1']),
    area[href]:not([tabindex='-1']),
    input:not([disabled]):not([tabindex='-1']),
    select:not([disabled]):not([tabindex='-1']),
    textarea:not([disabled]):not([tabindex='-1']),
    button:not([disabled]):not([tabindex='-1']),
    iframe:not([tabindex='-1']),
    [tabindex]:not([tabindex='-1']),
    [contentEditable=true]:not([tabindex='-1'])
`;

/**
 * Returns true if the node is focusable.
 */
export function isFocusable(node: HTMLElement) {
  return node && node.matches(focusableElements);
}

/**
 * Returns an array with all focusable children of the node.
 */
export function getFocusableChildren(node: HTMLElement): HTMLElement[] {
  return node ? Array.from(node.querySelectorAll(focusableElements)) : [];
}
