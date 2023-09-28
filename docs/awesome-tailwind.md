# Tailwind

Awesome **Tailwind CSS** Links

## UI Components

- [Flowbite](https://flowbite.com/) [Svelte UI Components](https://flowbite-svelte.com/), [Getting Started with Flowbite-Svelte](https://medium.com/mkdir-awesome/getting-started-with-flowbite-svelte-37b086ce9db5)
- [DaisyUI](https://daisyui.com/)
- [headlessUI](https://github.com/CaptainCodeman/svelte-headlessui) **fully accessible, unstyled** UI components.
- [Preline]([preline](https://preline.co/index.html)
- [Skeleton](https://www.skeleton.dev/) - Build fast and reactive web interfaces using Svelte + Tailwind CSS.

## UI Blocks

- [Kometa UI Kit](https://kitwind.io/products/kometa) (Free) [Blocks](https://kitwind.io/products/kometa/components)
- [Tailblocks](https://tailblocks.cc/) via [tailblocks github](https://github.com/mertJF/tailblocks)
- [Tailwind Components](https://tailwindcomponents.com/) (Free)
- Flowbite [Blocks](https://flowbite.com/blocks/) via [flowbite-svelte-blocks](https://github.com/shinokada/flowbite-svelte-blocks)
- [Konsta UI](https://konstaui.com/svelte) - is a free and open source mobile UI svelte components framework built with [Tailwind CSS](https://tailwindcss.com/).
- [Preline Blocks]([preline](https://preline.co/examples.html)
- [hyperui](https://www.hyperui.dev/)

## Dashboards

- [Flowbite Admin Dashboard](https://github.com/themesberg/flowbite-admin-dashboard) and [Svelte version](https://github.com/themesberg/flowbite-svelte-admin-dashboard)

## Guides

- [Best free tailwind CSS libraries for 2023](https://medium.com/frontendweb/top-19-best-free-tailwind-css-libraries-kits-for-2023-8dfb478d4d0f)
- [6 Tips for Tailwind CSS Development](https://jfelix.info/blog/6-tips-for-tailwind-css-development-with-resources)
- [Collection of Tailwind Components](https://github.com/unlight/tailwind-components)
- [Beautiful CSS box-shadow examples](https://getcssscan.com/css-box-shadow-examples)
- [storyblok-that-speakers](https://github.com/bradgarropy/jqq-demos/tree/main/storyblok-that-speakers#visual-editing) showcase [responsive grid](https://github.com/bradgarropy/jqq-demos/blob/main/storyblok-that-speakers/my-app/src/routes/speakers/%2Bpage.svelte#L17-L20)

## FQA

- Rendering different views for **Mobile** and **Desktop**:

  Tell SvelteKit not to handle a link, but allow the browser to handle it

  ```html
  <!-- Mobile -->
  <header class="block md:hidden"></header>
  <!-- Desktop -->
  <header class="hidden md:block"></header>
  ```

- Svelte Component styling

  [Styling children: slot props](https://svelte-headlessui.goss.io/docs/2.0/general-concepts#component-styling)

  ```svelte
  <RadioGroup bind:value={plan}>
  	<RadioGroupLabel>Plan</RadioGroupLabel>
  	<RadioGroupOption value="startup" let:checked>
  		<span class:checked>Startup</span>
  	</RadioGroupOption>
  	<RadioGroupOption value="business" let:checked>
  		<span class:checked>Business</span>
  	</RadioGroupOption>
  </RadioGroup>

  <style>
  	/* Note that using global styles this way is bad practice in larger applications; see below for more */
  	:global(.checked) {
  		background-color: rgb(191 219 254);
  	}
  </style>
  ```

  You can scope this more narrowly if you have a wrapper element:

  ```svelte
  <div>
  	<RadioGroup bind:value={plan}>
  		<RadioGroupLabel>Plan</RadioGroupLabel>
  		<RadioGroupOption value="startup" class={({ checked }) => (checked ? 'checked' : '')}>
  			Startup
  		</RadioGroupOption>
  		<RadioGroupOption value="business" class={({ checked }) => (checked ? 'checked' : '')}>
  			Business
  		</RadioGroupOption>
  	</RadioGroup>
  </div>

  <!-- This will only apply to .checked elements that descend from this component -->
  <style>
  	* > :global(.checked) {
  		background-color: rgb(191 219 254);
  	}
  </style>
  ```

- How to have `<div />` wrapper but it should not affect the layout?

  CSS `display: contents` causes an element's children to appear as if they were direct children of the element's parent, ignoring the element itself. This can be useful when a wrapper element should be ignored when using CSS grid or similar layout techniques.

- How to add `keyframes` globally with in a components' `<style>` block?

  If you want to make @keyframes that are accessible globally, you need to prepend your keyframe names with `-global-`.

  The `-global-` part will be removed when compiled, and the keyframe then be referenced using just `my-animation-name` elsewhere in your code.

  ```html
  <style>
  	@keyframes -global-my-animation-name {
  		/* code goes here */
  	}
  </style>
  ```
