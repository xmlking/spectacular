<script lang="ts">
	    import { fly } from "svelte/transition"
		import { navigating, page } from "$app/stores"
		  import Page from '$lib/components/layout/Page.svelte';
		import Counter from "./components/Counter.svelte"
		import Menu from "./components/Menu.svelte"
		import { description } from "./components/description.js"

    $: {
        if (navigating) {
            // prettier-ignore
            if ($page.url.pathname === "/utilities/outclick") {
				$description = `Click outside of COMPONENT CONTENT to increase the counter. The component captures the event for you, so you can for example use it to close a dropdown, a menu, or do whatever.`
			} else if ($page.url.pathname === "/utilities/outclick/exclude") {
				$description = "You can exclude some elements from triggering the event."
			} else if ($page.url.pathname === "/utilities/outclick/half-click") {
				$description = "Trigger the event on pointer-down instead of a full click action (pointer-down + pointer-up)."
			}
        }
    }
</script>

<Page>
	<header class="space-y-4">
		<h1 class="h1">Outclick</h1>
		<p>Showcase Outclick.</p>
	</header>

<div class="relative flex items-center justify-between gap-4">
    <Counter />
    <Menu />
</div>

{#key $page.url.pathname}
    <div class="grid gap-2" in:fly={{ y: 64, duration: 300 }}>
        <slot />
    </div>

    {#if $description}
        <p
            class="text-xs leading-5 text-gray-400"
            in:fly={{ y: 32, duration: 300, delay: 100 }}
        >
            {@html $description}
        </p>
    {/if}
{/key}
</Page>
