<script lang="ts">
import { Facebook, Github, Instagram, Twitter } from 'lucide-svelte';
</script>

<!-- svelte-ignore a11y_invalid_attribute -->

<footer class="flex items-center justify-between h-16 px-6 text-xs text-muted-foreground">
  <div>&copy; 2024 Sumanth Spectacular Inc. All rights reserved.</div>
  <div class="flex gap-4" data-sveltekit-preload-data="false">
    <a href="#" class="hover:text-primary">
      <Facebook class="h-6 w-6" />
      <span class="sr-only">Facebook</span>
    </a>
    <a href="#" class="hover:text-primary">
      <Twitter class="h-6 w-6" />
      <span class="sr-only">Twitter</span>
    </a>
    <a href="#" class="hover:text-primary">
      <Instagram class="h-6 w-6" />
      <span class="sr-only">Instagram</span>
    </a>
    <a href="#" class="hover:text-primary">
      <Github class="h-6 w-6" />
      <span class="sr-only">GitHub</span>
    </a>
  </div>
</footer>