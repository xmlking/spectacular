<script>
export let linkText = '';
export let linkPath = '';
import { setupViewTransition } from 'sveltekit-view-transition';

const { transition } = setupViewTransition();
</script>

<a
    href={linkPath}
    class="variant-ghost-primary p-4 hover:variant-ghost-secondary {linkPath ===
        '/experiments/animations/view' && 'viewLink'}"
    use:transition={linkPath === '/experiments/animations/view' ? 'viewLink' : 'none'}
>
    <h1 class="text-lg font-semibold">{linkText}</h1>
</a>
