import HeadFilter from './table-head-filter.svelte';
import Head from './table-head.svelte';
import Pagination from './table-pagination.svelte';
import RowCount from './table-row-count.svelte';
import RowsPerPage from './table-rows-per-page.svelte';
import Search from './table-search.svelte';
import Root from './table.svelte';

export {
  Root,
  Head,
  HeadFilter,
  Pagination,
  RowCount,
  RowsPerPage,
  Search,
  //
  Root as Datatable,
  Head as TableHead,
  HeadFilter as TableHeadFilter,
  Pagination as TablePagination,
  RowCount as TableRowCount,
  RowsPerPage as TableRowsPerPage,
  Search as TableSearch,
};
