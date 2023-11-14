<script lang="ts">
	export let image: string;
	export let title: string;
	export let subtitle: string;
	export let description: string;
</script>

<div class="@xl:grid @xl:grid-cols-[1fr_3fr] mb-2">
	<div
		class="@xl:rounded-l-3xl @xl:rounded-tr-none h-64 min-h-full rounded-t-3xl bg-cover bg-center bg-no-repeat"
		style:background-image={`url(${image})`}
	/>
	<div class="p-2">
		<h2 class="mb-2 text-3xl font-bold">{title}</h2>
		<h4 class="mb-2 italic">{subtitle}</h4>
		<p class="@xl:block hidden">{description}</p>
	</div>
</div>
