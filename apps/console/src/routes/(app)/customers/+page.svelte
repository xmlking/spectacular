<script lang="ts">
import * as Table from '@spectacular/skeleton/components/table';
import { DataHandler } from '@vincjo/datatables';
// import PageToCLayout from '$lib/components/layout/page-toc-layout.svelte';
// import PageLayout from '$lib/components/layout/page-layout.svelte';

// Props
//Import data
// export let data: PageData;
// $: ({ customers } = data);
import customers from './data';

//Datatable handler initialization
const handler = new DataHandler(customers, { rowsPerPage: 10 });
const rows = handler.getRows();

// Reactive
// $: handler.setRows(customers);
</script>

<div class="page-container">
    <div class="page-section">
        <header class="flex justify-between">
            <Table.Search {handler} />
            <Table.RowsPerPage {handler} />
        </header>
        <table class="table table-hover table-compact w-full table-auto">
            <thead>
                <tr>
                    <Table.Head {handler} orderBy="first_name">First name</Table.Head>
                    <Table.Head {handler} orderBy="last_name">Last name</Table.Head>
                    <Table.Head {handler} orderBy="email">Email</Table.Head>
                </tr>
                <tr>
                    <Table.HeadFilter {handler} filterBy="first_name" />
                    <Table.HeadFilter {handler} filterBy="last_name" />
                    <Table.HeadFilter {handler} filterBy="email" />
                </tr>
            </thead>
            <tbody>
                {#each $rows as row}
                    <tr>
                        <td>{row.first_name}</td>
                        <td>{row.last_name}</td>
                        <td>{row.email}</td>
                    </tr>
                {/each}
            </tbody>
        </table>
        <footer class="flex justify-between">
            <Table.RowCount {handler} />
            <Table.Pagination {handler} />
        </footer>
    </div>
    <div class="page-section">
        <Table.Root {handler} search={true} rowsPerPage={true}>
            <table class="table table-hover table-compact w-full table-auto">
                <thead>
                    <tr>
                        <Table.Head orderBy="first_name">First Name</Table.Head>
                        <Table.Head orderBy="last_name">Last Name</Table.Head>
                        <Table.Head orderBy="email">Email</Table.Head>
                    </tr>
                    <tr>
                        <Table.HeadFilter filterBy="first_name" />
                        <Table.HeadFilter filterBy="last_name" />
                        <Table.HeadFilter filterBy="email" />
                    </tr>
                </thead>
                <tbody>
                    {#each $rows as row}
                        <tr>
                            <td>{row.first_name}</td>
                            <td>{row.last_name}</td>
                            <td>{row.email}</td>
                        </tr>
                    {/each}
                </tbody>
            </table>
        </Table.Root>
    </div>
</div>
