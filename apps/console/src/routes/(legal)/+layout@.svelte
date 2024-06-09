<script lang="ts">
import { UsersRound } from 'lucide-svelte';
</script>

<div class="mx-auto flex max-w-2xl flex-col justify-center px-6 py-12 lg:px-8">
  <div class="card p-6 pb-8 pt-8">
    <div class="prose xl:prose-xl lg:prose-lg md:prose-base sm:prose-sm dark:prose-invert">
      <div class="mb-4 flex flex-row items-center justify-center">
        <div>
          <UsersRound size={42} />
        </div>
      </div>
      <slot />
    </div>
  </div>
</div>

<style>
</style>
