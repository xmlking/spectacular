<script lang="ts">
// NOTE: from https://swapy.tahazsh.com/
// TODO: Drag-and-Drop Dashboard https://github.com/olliethedev/dnd-dashboard
import { onDestroy, onMount } from 'svelte';
// import { persisted } from 'svelte-persisted-store';
import { type Swapy, createSwapy } from 'swapy';
import { fragment, graphql, type WelcomeUserFragment } from '$houdini';
import type { PageData } from './$houdini';

export let data: PageData;
let { AppLayout } = data;
let user: WelcomeUserFragment;

// Reactivity
$: ({ AppLayout } = data);
$: if ($AppLayout?.data?.user) {
  user = $AppLayout?.data?.user;
}
$: fragmentData = fragment(
  user,
  graphql(`
      fragment WelcomeUserFragment on users {
        displayName
        currentOrg {
          displayName
        },
        defaultRole
      }
    `),
);

let container: HTMLDivElement;
let swapy: Swapy;

/*
  const DEFAULT = {
    1: "a",
    3: "c",
    4: "d",
    5: "e",
    6: "f",
    7: "g",
    2: null,
  };

  // Persists the slot arrangemnt for the user's preferred oedwe
  export const slotItems = persisted<Record<number, string | null>>(
    "slotItems",
    DEFAULT,
  );
  */

onMount(() => {
  if (container) {
    swapy = createSwapy(container, {
      animation: 'dynamic', // or spring or none
    });

    // swapy.onSwap(({ data }) => {
    //   console.log({ data: data.object });
    //   slotItems.set(data.object);
    // });
  }
});
onDestroy(() => {
  // Destroy the swapy instance on component destroy
  swapy?.destroy();
});
</script>

<svelte:head>
  <title>Datablocks | Dashboard</title>
  <meta name="description" content="Analytics  Dashboard" />
</svelte:head>

<div class="page-container">
  <section class="space-y-4">
    <h1 class="h1">Dashboard</h1>
    <p>Stats, Reports, Metrics</p>
    <p class="text-xl font-semiblod md:text-2xl">Welcome <strong>{$fragmentData?.displayName}</strong> to <strong class="uppercase">{$fragmentData?.currentOrg?.displayName ?? 'no org'}</strong>, Your Role <strong class="uppercase">{$fragmentData?.defaultRole}</strong></p>
  </section>

  <section class="space-y-4">
    <div class="flex h-full items-center justify-center">
      <h1 class="h1">
        <span
          class="bg-gradient-to-br from-blue-500 to-cyan-300 box-decoration-clone bg-clip-text text-transparent"
          >Design.</span
        >
      </h1>
      <h1 class="h1">
        <span
          class="bg-gradient-to-br from-red-500 to-yellow-500 box-decoration-clone bg-clip-text text-transparent"
          >Build.</span
        >
      </h1>
      <h1 class="h1">
        <span
          class="bg-gradient-to-br from-pink-500 to-violet-500 box-decoration-clone bg-clip-text text-transparent"
          >Deploy.</span
        >
      </h1>
    </div>
  </section>

  <section class="space-y-4">
    <h2 class="h2">Metrics Gallery</h2>
    <p>
      Show metrics at a glance. you can rearrange the widgets by drag and drop
    </p>

    <div
      class="grid grid-cols-3 gap-4 font-mono text-white text-sm text-center font-bold leading-6"
      bind:this={container}
    >
      <div data-swapy-slot="1">
        <div
          data-swapy-item="a"
          class="p-4 rounded-lg bg-red-300 dark:bg-red-800 dark:text-red-400 cursor-move"
        >
          01
        </div>
      </div>
      <div data-swapy-slot="2">
        <div
          data-swapy-item="b"
          class="p-4 rounded-lg bg-lime-300 dark:bg-lime-800 dark:text-lime-400 cursor-move"
        >
          02
        </div>
      </div>
      <div data-swapy-slot="3">
        <div
          data-swapy-item="c"
          class="p-4 rounded-lg bg-lime-300 dark:bg-lime-800 dark:text-lime-400 cursor-move"
        >
          <div>03</div>
        </div>
      </div>
      <div data-swapy-slot="4" class="col-span-2">
        <div
          data-swapy-item="d"
          class="p-4 rounded-lg shadow-lg bg-violet-500 cursor-move"
        >
          04
        </div>
      </div>
      <div data-swapy-slot="5">
        <div
          data-swapy-item="e"
          class="p-4 rounded-lg bg-pink-300 dark:bg-pink-800 dark:text-pink-400 cursor-move"
        >
          05
        </div>
      </div>
      <div data-swapy-slot="6">
        <div
          data-swapy-item="f"
          class="p-4 rounded-lg bg-yellow-300 dark:bg-yellow-800 dark:text-yellow-400 cursor-move"
        >
          06
        </div>
      </div>
      <div data-swapy-slot="7" class="col-span-2">
        <div
          data-swapy-item="g"
          class="p-4 rounded-lg shadow-lg bg-cyan-500 cursor-move"
        >
          07
        </div>
      </div>
    </div>
  </section>
</div>

