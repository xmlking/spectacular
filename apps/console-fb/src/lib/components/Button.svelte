<script lang="ts">
	// import type { HTMLButtonAttributes } from 'not-decided-where-from-yet'
	// interface $$Props extends HTMLButtonAttributes {}

	// https://github.com/sveltejs/rfcs/pull/38
	type OwnProps = { variant: 'primary' | 'secondary' };
	/** @type {import('svelte-check/dist/svelte-jsx').svelteHTML} */
	// type $$Props = svelteHTML.IntrinsicElements['button'] & OwnProps;
	export let variant: OwnProps['variant'] = 'primary';
</script>

<button {...$$restProps} class="{$$restProps.class ?? ''} {variant}">
	<slot />
</button>

<style lang="postcss">
	button {
		color: white;
	}

	•primary {
		background: teal;
	}

	• secondary {
		background: orange;
	}
</style>
