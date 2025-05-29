# Shared util functions

## Development

```shell
turbo run format --filter=@repo/utils
turbo run lint --filter=@repo/utils
turbo run test --filter=@repo/utils
```

## Usage

### Context

keys.ts

```ts
import type { InjectionKey } from '@repo/utils';
import type { DataHandler, Row } from '@vincjo/datatables';
type T = Row;

export const handlerKey: InjectionKey<DataHandler<T>> = Symbol('DataHandler type');
```

table.svelte

```svelte
<script lang="ts" generics="T extends Row">
	import { handlerKey } from './keys';

	export let handler: DataHandler<T>;
	setContext(handlerKey, handler);
</script>
```

table-head.svelte

```svelte
<script lang="ts" generics="T extends Row">
	import { handlerKey } from './keys';

	export let handler: DataHandler<T>;
	handler ??= getContext(handlerKey);
```
