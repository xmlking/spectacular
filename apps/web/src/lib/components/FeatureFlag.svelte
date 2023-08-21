<script lang="ts">
	export let flag: string;
	// TODO: pull from backend
	type Feature = {
		name: string;
		active?: boolean;
	};

	const features: Feature[] = [];
	let feature = features.find((f) => f.name == flag);
	if (!feature) console.log('flagNotFound:', flag);
</script>

{#if feature && feature.active}
	<slot />
{/if}
