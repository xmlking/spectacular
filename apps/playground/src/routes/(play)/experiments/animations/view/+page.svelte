<script>
import { setupViewTransition } from 'sveltekit-view-transition';

const { transition } = setupViewTransition();
</script>

<div class="card variant-ghost-primary p-4" use:transition={'viewLink'}>
	<h1 class="card-header pb-10 text-2xl font-semibold text-surface-100">View Transitions</h1>
	<p class="card-content px-8 pb-10">
		These are a clean way to animate the flow between pages creating a super clean look/flow.
	</p>
	<footer class="card-footer">
		<a
			class="btn bg-secondary-100 text-surface-900"
			href="https://svelte.dev/blog/view-transitions"
			target="_blank">Learn More</a
		>
		<a href="/experiments/animations" class="btn bg-secondary-100 text-surface-900">Home</a>
	</footer>
</div>
