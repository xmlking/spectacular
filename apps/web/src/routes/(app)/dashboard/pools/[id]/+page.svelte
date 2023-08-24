<script lang="ts">
	import { dev } from '$app/environment';
	import { invalidateAll } from '$app/navigation';
	import { cache, DeleteDevicePoolStore, InsertDevicePoolStore } from '$houdini';
	import type { CustomEventProps as RemoveCustomEventProps } from '$lib/components/DeleteButton.svelte';
	import { FloatingTextInput, Form, TagsInput } from '$lib/components/form';
	import { DataTable } from '$lib/components/table';
	import { addToast, ToastLevel } from '$lib/components/toast';
	import { updatePoolKeys as keys } from '$lib/models/schema';
	import { Logger } from '$lib/utils';
	import { Breadcrumb, BreadcrumbItem, Heading, Helper, Navbar, NavBrand } from 'flowbite-svelte';
	import { GraphQLError } from 'graphql';
	import { createRender, createTable } from 'svelte-headless-table';
	import { addPagination, addSortBy, addTableFilter } from 'svelte-headless-table/plugins';
	import { IconOutline } from 'svelte-heros-v2';
	import { TimeDistance } from 'svelte-time-distance';
	import { writable } from 'svelte/store';
	import { superForm } from 'sveltekit-superforms/client';
	import SuperDebug from 'sveltekit-superforms/client/SuperDebug.svelte';
	import AddDevicePoolButton, { type CustomEventProps } from './AddDevicePoolButton.svelte';
	import RemoveDevicePoolButton from './RemoveDevicePoolButton.svelte';

	const log = new Logger('routes:pools:update');
	export let data;
	$: ({ poolId, inPool, notInPool } = data);
	$: inPoolStore.set(inPool ?? []);
	$: notInPoolStore.set(notInPool ?? []);

	// Client API:
	const superform = superForm(data.form, {
		dataType: 'json',
		taintedMessage: null,
		syncFlashMessage: false,
		onError({ result, message }) {
			log.error('superForm', { result }, { message });
		}
	});
	const {
		form,
		delayed,
		enhance,
		errors,
		constraints,
		message,
		tainted,
		posted,
		allErrors,
		reset,
		submitting,
		capture,
		restore
	} = superform;
	export const snapshot = { capture, restore };

	const inPoolStore = writable(inPool ?? []);
	const notInPoolStore = writable(notInPool ?? []);

	const inPoolTable = createTable(inPoolStore, {
		page: addPagination({ initialPageSize: 10 }),
		tableFilter: addTableFilter({
			fn: ({ filterValue, value }) =>
				'' === filterValue ? true : value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		sort: addSortBy()
	});

	const notInPoolTable = createTable(notInPoolStore, {
		page: addPagination({ initialPageSize: 10 }),
		tableFilter: addTableFilter({
			fn: ({ filterValue, value }) =>
				'' === filterValue ? true : value.toLowerCase().includes(filterValue.toLowerCase())
		}),
		sort: addSortBy()
	});

	let removeDevicePoolBusy = false;
	const deleteDevicePoolStore = new DeleteDevicePoolStore();
	const handleDelete = async (e: CustomEvent<RemoveCustomEventProps>) => {
		removeDevicePoolBusy = true;
		try {
			if (e.detail.id) {
				const id = e.detail.id;
				log.debug(`Inside handleDelete for associationId: ${id}`);
				const { data, errors } = await deleteDevicePoolStore.mutate({ id });
				if (errors) {
					addToast({
						message: `Error in GraphQL mutation to soft delete associationId ${id} with error ${errors[0].message} `,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					return;
				}
				if (data) {
					addToast({
						message: `Deleted device ${data?.delete_device_pool_by_pk?.deviceId} from pool ${data?.delete_device_pool_by_pk?.poolId}`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					cache.markStale();
					await invalidateAll();
				} else {
					addToast({
						message: `Cannot soft delete associationId ${id}. Data returned from mutation is falsey.`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Error
					});
				}
			} else {
				log.error('AssociationId missing in the synthetic delete event');
			}
		} catch (err) {
			if (err instanceof GraphQLError) {
				log.error(err.message);
			} else {
				throw err;
			}
		} finally {
			removeDevicePoolBusy = false;
		}
	};

	const inPoolColumns = inPoolTable.createColumns([
		inPoolTable.column({
			header: 'Name',
			accessor: 'displayName'
		}),
		inPoolTable.column({
			header: 'IP',
			accessor: 'ip'
		}),
		inPoolTable.column({
			header: 'Version',
			accessor: 'version'
		}),
		inPoolTable.column({
			header: 'Updated At',
			accessor: 'updatedAt',
			cell: ({ value }) =>
				createRender(TimeDistance, {
					timestamp: value,
					class: 'decoration-solid'
				}),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		inPoolTable.column({
			header: 'Delete',
			id: 'associationId',
			accessor: 'associationId',
			cell: ({ value }) =>
				createRender(RemoveDevicePoolButton, { id: value }).on('delete', handleDelete),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		})
	]);

	let addDevicePoolbusy = false;
	const insertDevicePoolStore = new InsertDevicePoolStore();
	const handleAdd = async (e: CustomEvent<CustomEventProps>) => {
		addDevicePoolbusy = true;
		try {
			if (e.detail.poolId && e.detail.deviceId) {
				const poolId = e.detail.poolId;
				const deviceId = e.detail.deviceId;
				log.debug(`Inside handleAdd(...) w/poolId ${poolId} + deviceId ${deviceId}`);
				const { data, errors } = await insertDevicePoolStore.mutate({ deviceId, poolId });
				if (errors) {
					addToast({
						message: `Error in Device to Pool Association Query ${errors[0].message}`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					return;
				}
				if (data) {
					addToast({
						message: `Added device ${data?.insert_device_pool_one?.deviceId} to pool ${data?.insert_device_pool_one?.poolId}`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Info
					});
					cache.markStale();
					await invalidateAll();
				} else {
					addToast({
						message: `Cannot add device ${deviceId} to pool ${poolId}. Data returned from mutation is falsey.`,
						dismissible: true,
						duration: 10000,
						type: ToastLevel.Error
					});
				}
			} else {
				log.error('❗️PoolID or DeviceID missing in the synthetic delete event❗️');
			}
		} catch (err) {
			if (err instanceof GraphQLError) {
				log.error(err.message);
			} else {
				throw err;
			}
		} finally {
			addDevicePoolbusy = false;
		}
	};

	const notInPoolColumns = notInPoolTable.createColumns([
		notInPoolTable.column({
			header: 'Name',
			accessor: 'displayName'
		}),
		notInPoolTable.column({
			header: 'IP',
			accessor: 'ip'
		}),
		notInPoolTable.column({
			header: 'Version',
			accessor: 'version'
		}),
		notInPoolTable.column({
			header: 'Updated At',
			accessor: 'updatedAt',
			cell: ({ value }) =>
				createRender(TimeDistance, {
					timestamp: value,
					class: 'decoration-solid'
				}),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					getSortValue: (value) => value
				}
			}
		}),
		notInPoolTable.column({
			header: 'Add',
			id: 'deviceId',
			accessor: 'id', // This is the deviceId
			cell: ({ value }) =>
				createRender(AddDevicePoolButton, { poolId, deviceId: value }).on('add', handleAdd),
			plugins: {
				tableFilter: {
					exclude: true
				},
				sort: {
					disable: true
				}
			}
		})
	]);

	const inPoolTableViewModel = inPoolTable.createViewModel(inPoolColumns);
	const notInPoolTableViewModel = notInPoolTable.createViewModel(notInPoolColumns);
</script>

<svelte:head>
	<title>Pools | Update</title>
	<meta name="description" content="Update Pool" />
</svelte:head>

<Breadcrumb aria-label="Default breadcrumb example" class="mb-6">
	<BreadcrumbItem href="/dashboard" home>Home</BreadcrumbItem>
	<BreadcrumbItem href="/dashboard/pools">Pools</BreadcrumbItem>
	<BreadcrumbItem>Update Pool</BreadcrumbItem>
</Breadcrumb>

<Heading tag="h4" class="pb-5">Update Pool</Heading>

<Form {superform} submitButtonText="Update" class="space-y-6">
	<div class="mb-6 grid gap-6 md:grid-cols-3 lg:grid-cols-6">
		<div class="col-span-2">
			<FloatingTextInput field={keys.displayName} label="Display Name" />
		</div>
		<div class="col-span-4">
			<FloatingTextInput field={keys.description} label="Description" />
		</div>
		<div class="col-span-3">
			<TagsInput field={keys.tags} label="Tags" placeholder={'Enter tags...'} />
		</div>
		<div class="col-span-3">
			<FloatingTextInput field={keys.annotations} label="Annotations" />
			<Helper class="mt-2 text-sm italic">
				Format: key1=>value1 (or) "key2" => "value2 with space"
			</Helper>
		</div>
	</div>
</Form>

{#if dev}
	<br />
	<SuperDebug
		label="Miscellaneous"
		status={false}
		data={{
			message: $message,
			submitting: $submitting,
			delayed: $delayed,
			posted: $posted
		}}
	/>
	<br />
	<SuperDebug label="Form" data={$form} />
	<br />
	<SuperDebug label="Tainted" status={false} data={$tainted} />
	<br />
	<SuperDebug label="Errors" status={false} data={$errors} />
	<br />
	<SuperDebug label="Constraints" status={false} data={$constraints} />
	<!-- <br />
 	<SuperDebug label="$page data" status={false} data={$page} /> -->
{/if}

{#if inPool && notInPool}
	<Navbar class="rounded border">
		<NavBrand>
			<IconOutline name="device-phone-mobile-outline" />
			<span class="ml-2 self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Devices in Pool
			</span>
		</NavBrand>
	</Navbar>
	<DataTable tableViewModel={inPoolTableViewModel} />

	<Navbar class="rounded border">
		<NavBrand>
			<IconOutline name="device-phone-mobile-outline" />
			<span class="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
				Devices NOT in Pool
			</span>
		</NavBrand>
	</Navbar>
	<DataTable tableViewModel={notInPoolTableViewModel} />
{/if}
