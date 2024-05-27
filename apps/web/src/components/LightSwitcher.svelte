<script lang="ts">
import { twMerge } from 'tailwind-merge';
import { toggleMode, mode } from 'mode-watcher';
import { Sun, Moon } from 'lucide-svelte';

export let labelClass =
    'flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600/80';
</script>

<div>
    <input
        checked={$mode === 'dark'}
        on:click={toggleMode}
        type="checkbox"
        name="light-switch"
        id="light-switch"
        class="sr-only"
    />
    <label class={twMerge(labelClass, $$props.class)} for="light-switch">
        <Sun
            class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
        />
        <Moon
            class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
        />
        <span class="sr-only">Switch to light / dark version</span>
    </label>
</div>
