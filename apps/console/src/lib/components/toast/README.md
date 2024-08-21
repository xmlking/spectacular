# Toast

## Usage

1. Add `<Toasts />` component somewhere in your layout component (e.g. App.svelte or \_layout.svelte, etc).

   ```svelte
   <script lang="ts">
   	import { Toasts } from '$lib/components/toast';
   </script>

   <Toasts placements="bottom-right" />

   <div>
   	<Header />
   	<div>
   		<SideMenu />
   		<main>
   			<slot />
   		</main>
   	</div>
   	<Footer />
   </div>
   ```

2. Use `addToast()` method to emit notifications in a svelte component or in `ts` file.

   ```svelte
   <script lang="ts">
   	import { addToast, ToastLevel } from '$lib/components/toast';
   	import { Button } from 'flowbite-svelte';
   </script>

   <svelte:head>
   	<title>Dashboard/test</title>
   	<meta name="description" content="Dashboard test" />
   </svelte:head>

   <h2>Settings</h2>
   <Button
   	on:click={() =>
   		addToast({
   			message: 'Hello, World!',
   			dismissible: false,
   			duration: 6000,
   			type: ToastLevel.Error
   		})}>Error</Button
   >
   <Button
   	on:click={() =>
   		addToast({
   			message: 'Hello, World!',
   			dismissible: true,
   			duration: 6000,
   			type: ToastLevel.Warning
   		})}>Warning</Button
   >
   <Button
   	on:click={() =>
   		addToast({
   			message: 'Hello, World!',
   			dismissible: false,
   			duration: 6000,
   			type: ToastLevel.Success
   		})}>Success</Button
   >
   <Button
   	on:click={() =>
   		addToast({
   			message: 'Hello, World!',
   			dismissible: true,
   			duration: 6000,
   			type: ToastLevel.Info
   		})}>Info</Button
   >
   ```

## Configuration

```html
<!-- +layout.svelte -->

<Toaster placement="bottom-right" />
```

| Property Name | Property Type                                                                                               | Property Default |
| :------------ | :---------------------------------------------------------------------------------------------------------- | :--------------- |
| placement     | 'top-left' \| 'top-center' \| 'top-right' \| 'center' \| 'bottom-left' \| 'bottom-center' \| 'bottom-right' | 'center'         |

```svelte
<!-- +page.svelte -->
<script lang="ts">
	function newToast() {
		new Slice({
			message: 'Hello, World!',
			dismissible: false,
			duration: 6000,
			type: ToastLevel.Warning
		});
	}
</script>
```

| Property Name | Property Type                               | Property Default |
| :------------ | :------------------------------------------ | :--------------- |
| message       | string                                      |                  |
| type          | 'Error' \| 'Warning' \| 'Success' \| 'Info' | Info             |
| dismissible   | boolean                                     | true             |
| duration      | number                                      | 9000             |
