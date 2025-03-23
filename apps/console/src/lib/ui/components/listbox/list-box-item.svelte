<!-- @migration-task Error while migrating Svelte code: $$props is used together with named props in a way that cannot be automatically migrated. -->
<script lang="ts">
// Slots
/**
 * @slot lead - Positioned on the left of each row item.
 * @slot trail - Positioned on the right of each row item.
 */

import { getContext } from 'svelte';

// Types
type CssClasses = string;
type SvelteEvent<E extends Event = Event, T extends EventTarget = Element> = E & { currentTarget: EventTarget & T };

// Context
export let disabled: boolean = getContext('disabled');
export let rounded: CssClasses = getContext('rounded');
export let hover: CssClasses = getContext('hover');
export let padding: CssClasses = getContext('padding');
export let regionLead: CssClasses = getContext('regionLead');
export let regionDefault: CssClasses = getContext('regionDefault');
export let regionTrail: CssClasses = getContext('regionTrail');

// Classes
const cBase = 'cursor-pointer -outline-offset-[3px]';
const cDisabled = 'opacity-50 !cursor-default';
const cLabel = 'flex items-center space-x-4';

// Local
let checked: boolean;
let elemInput: HTMLElement;

// Functionality
function areDeeplyEqual(param1: unknown, param2: unknown) {
  // check strict equality
  if (param1 === param2) return true;
  // check if props are not objects
  if (!(param1 instanceof Object) || !(param2 instanceof Object)) return false;

  // object keys
  const keys1 = Object.keys(param1);
  const keys2 = Object.keys(param2);
  // check if number of keys are the same
  if (keys1.length !== keys2.length) return false;
  // Iterate over the keys and compare the values recursively
  for (const key of keys1) {
    const value1 = (param1 as Record<string, unknown>)[key];
    const value2 = (param2 as Record<string, unknown>)[key];
    if (!areDeeplyEqual(value1, value2)) return false;
  }
  return true;
}

// Base Classes
const cRegionLead = '';
const cRegionDefault = 'flex-1';
const cRegionTrail = '';

// Reactive
$: classesActive = !disabled ? hover : '';
$: classesDisabled = disabled ? cDisabled : '';
$: classesBase = `${cBase} ${classesDisabled} ${rounded} ${padding} ${classesActive} ${$$props.class ?? ''}`;
$: classesLabel = `${cLabel}`;
$: classesRegionLead = `${cRegionLead} ${regionLead}`;
$: classesRegionDefault = `${cRegionDefault} ${regionDefault}`;
$: classesRegionTrail = `${cRegionTrail} ${regionTrail}`;
</script>

<label>
	<!-- A11y attributes are not allowed on <label> -->
	<div
		class="listbox-item {classesBase}"
		data-testid="listbox-item"
		role="option"
		tabindex="0"
		on:keydown
		on:keyup
		on:keypress
	>

		<!-- <slot /> -->
		<div class="listbox-label {classesLabel}">
			<!-- Slot: Lead -->
			{#if $$slots.lead}<div class="listbox-label-lead {classesRegionLead}"><slot name="lead" /></div>{/if}
			<!-- Slot: Default -->
			<div class="listbox-label-content {classesRegionDefault}"><slot /></div>
			<!-- Slot: Trail -->
			{#if $$slots.trail}<div class="listbox-label-trail {classesRegionTrail}"><slot name="trail" /></div>{/if}
		</div>
	</div>
</label>
