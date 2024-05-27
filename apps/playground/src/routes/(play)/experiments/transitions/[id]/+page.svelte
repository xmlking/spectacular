<script>
import { fade } from 'svelte/transition';
import { page } from '$app/stores';
import TransitionableImage from '../TransitionableImage.svelte';

let { id } = $page.params;

const images = {
  a: 'https://picsum.photos/id/400/1200/800',
  b: 'https://picsum.photos/id/402/1200/800',
  c: 'https://picsum.photos/id/403/1200/800',
  d: 'https://picsum.photos/id/404/1200/800',
  e: 'https://picsum.photos/id/405/1200/800',
};

let src = images[id];
</script>

<div class="container">
  <a class="imgContainer" href="/experiments/transitions">
    <TransitionableImage class="image" {src} transitionId={id} />
  </a>
  <div class="content">
    <h1 in:fade={{ delay: 600, duration: 300 }} out:fade={{ delay: 0, duration: 300 }}> Lorem ipsum & ipsum lorem </h1>
    <p in:fade={{ delay: 600, duration: 300 }} out:fade={{ delay: 0, duration: 300 }}>
      Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore
      magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo
      consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur.
      Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.
    </p>
  </div>
</div>

<style>
.container {
  display: flex;
  flex-direction: row;
  justify-content: center;
  height: 100vh;
}
.imgContainer {
  width: 50vw;
  height: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: flex-end;
  flex-shrink: 0;
}
.imgContainer > :global(.image) {
  height: 540px;
  aspect-ratio: 6 / 8;
}

.content {
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  padding: 0 400px 0 60px;
  justify-content: center;
  font-family: sans-serif;
}

.content > p {
  margin-top: 30px;
}
</style>
