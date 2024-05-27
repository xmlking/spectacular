<script lang="ts">
import { User2 } from 'lucide-svelte';
</script>

<div class="mx-auto flex max-w-2xl flex-col justify-center px-6 py-12 lg:px-8">
    <div class="card p-6 pb-8 pt-8">
        <div>
            <div class="mb-4 flex flex-row items-center justify-center">
                <div>
                    <User2 size={42} />
                </div>
            </div>
            <slot />
        </div>
    </div>
</div>

<style>
</style>
