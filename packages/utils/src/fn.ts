/** Do nothing. */
export const noop = () => {};

/** Executes passed in function immediately. */
export const run = (fn: Fn) => fn();

/** Executes passed in functions immediately. */
export const runAll = (fns: Fn[]) => fns.forEach(run);

/** Unknown function type. Use `Fn<Params, Return>` to specify types. */
export type Fn<Params extends unknown[] = unknown[], Return = unknown> = (...params: Params) => Return;
