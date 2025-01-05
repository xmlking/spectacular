import { Context } from 'runed';

/**
 * Usage
 * @example
 *   import { myTheme } from "./context";
 *   myTheme.set(data.theme);
 *   const theme = myTheme.get();
 *   const theme = myTheme.getOr("light");
 */
export const myTheme = new Context<'light' | 'dark'>('theme');
