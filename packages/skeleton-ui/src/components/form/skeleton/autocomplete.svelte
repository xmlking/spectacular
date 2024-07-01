<script lang="ts">
import { createEventDispatcher } from 'svelte';
// import { flip } from 'svelte/animate';
// import {slide} from 'svelte/transition';

// Types
import { boldQuery } from '$lib/utils';
import type { AutocompleteOption } from '@skeletonlabs/skeleton';

// Event Dispatcher
type AutocompleteEvent = {
  selection: AutocompleteOption;
};
const dispatch = createEventDispatcher<AutocompleteEvent>();

// Props
/**
 * Bind the input value.
 * @type {unknown}
 */
export let input: unknown = undefined;
/**
 * Define values for the list.
 * @type {AutocompleteOption[]}
 */
export let options: AutocompleteOption[] = [];
/** Limit the total number of suggestions. */
export let limit: number | undefined = undefined;
/**
 * Provide allowlist values.
 * @type {unknown[]}
 */
export let allowlist: unknown[] = [];
/**
 * Provide denylist values.
 * @type {unknown[]}
 */
export let denylist: unknown[] = [];
/** Provide a HTML markup to display when no match is found. */
export let emptyState = 'No Results Found.';
// Props (region)
/** Provide arbitrary classes to nav element. */
export let regionNav = '';
/** Provide arbitrary classes to each list. */
export let regionList = 'list-nav';
/** Provide arbitrary classes to each list item. */
export let regionItem = '';
/** Provide arbitrary classes to each button. */
export let regionButton = 'w-full';
/** Provide arbitrary classes to empty message. */
export let regionEmpty = 'text-center';

// Local
$: listedOptions = options;

// Allowed Options
function filterByAllowed(): void {
  if (allowlist.length) {
    listedOptions = [...options].filter((option: AutocompleteOption) => allowlist.includes(option.value));
  } else {
    // IMPORTANT: required if the list goes from populated -> empty
    listedOptions = [...options];
  }
}

// Denied Options
function filterByDenied(): void {
  if (denylist.length) {
    const denySet = new Set(denylist);
    listedOptions = [...options].filter((option: AutocompleteOption) => !denySet.has(option.value));
  } else {
    // IMPORTANT: required if the list goes from populated -> empty
    listedOptions = [...options];
  }
}

function onSelection(option: AutocompleteOption) {
  /** @event {AutocompleteOption} selection - Fire on option select. */
  dispatch('selection', option);
}

// State
$: if (allowlist) filterByAllowed();
$: if (denylist) filterByDenied();
$: sliceLimit = limit !== undefined ? limit : listedOptions.length;
// Reactive
$: classesBase = `${$$props.class ?? ''}`;
$: classesNav = `${regionNav}`;
$: classesList = `${regionList}`;
$: classesItem = `${regionItem}`;
$: classesButton = `${regionButton}`;
$: classesEmpty = `${regionEmpty}`;
$: inputWords = String(input).split(' ');
</script>

<!-- animate:flip={{ duration }} transition:slide={{ duration }} -->
<div class="autocomplete {classesBase}" data-testid="autocomplete">
  {#if listedOptions.length > 0}
    <nav class="autocomplete-nav {classesNav}">
      <ul class="autocomplete-list {classesList}">
        {#each listedOptions.slice(0, sliceLimit) as option (option)}
          <li class="autocomplete-item {classesItem}">
            <button
              class="autocomplete-button {classesButton} my-2"
              type="button"
              on:click={() => onSelection(option)}
              on:click
              on:keypress
            >
              <span class="text-left">
                <span>
                  {@html boldQuery(option.label, inputWords)}
                </span>
                <br />
                <span class="text-gray-400">
                  Used {option.meta._count.exerciseEvents} times
                </span>
              </span>
            </button>
          </li>
        {/each}
        <li>
          <div class="text-gray-400 {classesEmpty}">Start typing to see more results...</div>
        </li>
      </ul>
    </nav>
  {:else}
    <div class="autocomplete-empty {classesEmpty}">{emptyState}</div>
  {/if}
</div>
