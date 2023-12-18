# UI Components

## Usage

Add **shadcn** component to UI Components collection

```shell
cd packages/ui
pnpx shadcn-svelte@latest add -p src/lib/components/shadcn button
# update
pnpx shadcn-svelte update button
```

Use **shadcn** component in your app

```svelte
<script lang="ts">
  import { Button } from 'ui/components/shadcn/button';
  import * as DropdownMenu from 'ui/components/shadcn/dropdown-menu';
  import { Sun, Moon } from 'lucide-svelte';

  import { setMode, resetMode } from 'mode-watcher';
</script>

<Button variant="outline">Button</Button>
```

## Reference

- Sample global ESLint configuration file: [.eslintrc.cjs](https://gist.github.com/huntabyte/b73073a93a7a664f3cbad7c50376c9c9)
- shadcn-svelte, Superforms [sample project](https://github.com/delay/sveltekit-auth) 
