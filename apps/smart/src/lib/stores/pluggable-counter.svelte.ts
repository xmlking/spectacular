// https://x.com/_gruntled/status/1927778997087195482
export class PluggableCounter<T> {
  #count = $state(0);
  count: T;

  constructor(plugin: (count: number) => T) {
    this.count = $derived(plugin(this.#count));
  }

  increment = () => this.#count++;
  decrement = () => this.#count--;
}
