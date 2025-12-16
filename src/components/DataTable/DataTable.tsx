import * as React from 'react';
import { clamp, debounce, size } from 'lodash-es';
import {
  functionalUpdate,
  getCoreRowModel,
  getExpandedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type Row
} from '@tanstack/react-table';

import { cn } from '@/lib/utils';

import { DataTablePagination } from './components/DataTablePagination';
import { DataTableTable } from './components/DataTableTable';
import { DataTableToolbar } from './components/DataTableToolbar';
import { DataTableViewOptions } from './components/DataTableViewOptions';
import {
  DEFAULT_API,
  DEFAULT_EMPTY,
  DEFAULT_INFINITE_SCROLL,
  DEFAULT_PAGINATION,
  DEFAULT_SEARCH,
  createDefaultActions
} from './render/defaults';
import type {
  DataTableApiConfig,
  DataTableEmptyConfig,
  DataTableExpandConfig,
  DataTableInitialState,
  DataTableInfiniteScrollConfig,
  DataTablePaginationConfig,
  DataTableProps,
  DataTableQuery,
  DataTableSearchConfig,
  DataTableValue
} from './types';

const DEFAULT_INITIAL_STATE: DataTableInitialState = {
  sorting: [],
  columnFilters: [],
  globalFilter: '',
  columnVisibility: {},
  rowSelection: {},
  pagination: { pageIndex: 0, pageSize: 10 },
  expanded: {}
};

const createDefaultExpand = <TData,>(): DataTableExpandConfig<TData> => ({
  enabled: false,
  renderSubComponent: () => null,
  getSubRows: () => []
});

const DEFAULT_RENDER_TOOLBAR_RIGHT = () => null;

const DEFAULT_GET_ROW_ID = <TData,>(_originalRow: TData, index: number) => {
  return String(index);
};

export const DataTable = <TData,>({
  tableId,
  data,
  columns,
  initialState,
  empty,
  search,
  pagination: paginationConfig,
  actions,
  api,
  infiniteScroll,
  expand,
  className,
  containerClassName,
  getRowId,
  renderToolbarRight
}: DataTableProps<TData> & {
  columns: ColumnDef<TData, DataTableValue>[];
}) => {
  const resolvedInitialState: DataTableInitialState =
    initialState === undefined ? DEFAULT_INITIAL_STATE : initialState;
  const resolvedEmpty: DataTableEmptyConfig = empty === undefined ? DEFAULT_EMPTY : empty;
  const resolvedSearch: DataTableSearchConfig = search === undefined ? DEFAULT_SEARCH : search;
  const resolvedPagination: DataTablePaginationConfig =
    paginationConfig === undefined ? DEFAULT_PAGINATION : paginationConfig;
  const resolvedActions = actions === undefined ? createDefaultActions<TData>() : actions;
  const resolvedApi: DataTableApiConfig = api === undefined ? DEFAULT_API : api;
  const resolvedInfinite: DataTableInfiniteScrollConfig =
    infiniteScroll === undefined ? DEFAULT_INFINITE_SCROLL : infiniteScroll;
  const resolvedExpand: DataTableExpandConfig<TData> =
    expand === undefined ? createDefaultExpand<TData>() : expand;
  const resolvedGetRowId = getRowId === undefined ? DEFAULT_GET_ROW_ID : getRowId;
  const resolvedRenderToolbarRight =
    renderToolbarRight === undefined ? DEFAULT_RENDER_TOOLBAR_RIGHT : renderToolbarRight;

  const [sorting, setSorting] = React.useState(resolvedInitialState.sorting);
  const [columnFilters, setColumnFilters] = React.useState(resolvedInitialState.columnFilters);
  const [globalFilter, setGlobalFilter] = React.useState(resolvedInitialState.globalFilter);
  const [columnVisibility, setColumnVisibility] = React.useState(
    resolvedInitialState.columnVisibility
  );
  const [rowSelection, setRowSelection] = React.useState(resolvedInitialState.rowSelection);
  const [paginationState, setPaginationState] = React.useState(resolvedInitialState.pagination);
  const [expanded, setExpanded] = React.useState(resolvedInitialState.expanded);

  React.useEffect(() => {
    setSorting(resolvedInitialState.sorting);
    setColumnFilters(resolvedInitialState.columnFilters);
    setGlobalFilter(resolvedInitialState.globalFilter);
    setColumnVisibility(resolvedInitialState.columnVisibility);
    setRowSelection(resolvedInitialState.rowSelection);
    setPaginationState(resolvedInitialState.pagination);
    setExpanded(resolvedInitialState.expanded);
  }, [tableId]);

  const manualMode = resolvedApi.mode === 'server';
  const pageCount =
    manualMode && paginationState.pageSize > 0
      ? Math.ceil(resolvedApi.totalRows / paginationState.pageSize)
      : undefined;

  const table = useReactTable({
    data,
    columns,
    state: {
      sorting,
      columnFilters,
      globalFilter,
      columnVisibility,
      rowSelection,
      pagination: paginationState,
      expanded
    },
    getRowId: (originalRow, index, parent) =>
      resolvedGetRowId(originalRow, index, parent === undefined ? null : (parent as Row<TData>)),
    onSortingChange: updater => setSorting(current => functionalUpdate(updater, current)),
    onColumnFiltersChange: updater =>
      setColumnFilters(current => functionalUpdate(updater, current)),
    onGlobalFilterChange: updater => setGlobalFilter(current => functionalUpdate(updater, current)),
    onColumnVisibilityChange: updater =>
      setColumnVisibility(current => functionalUpdate(updater, current)),
    onRowSelectionChange: updater => setRowSelection(current => functionalUpdate(updater, current)),
    onPaginationChange: updater =>
      setPaginationState(current => functionalUpdate(updater, current)),
    onExpandedChange: updater => setExpanded(current => functionalUpdate(updater, current)),
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: manualMode ? undefined : getSortedRowModel(),
    getFilteredRowModel: manualMode ? undefined : getFilteredRowModel(),
    getPaginationRowModel: manualMode ? undefined : getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
    manualSorting: manualMode,
    manualFiltering: manualMode,
    manualPagination: manualMode,
    pageCount,
    enableRowSelection: true,
    getSubRows: resolvedExpand.enabled ? resolvedExpand.getSubRows : undefined,
    getRowCanExpand: () => resolvedExpand.enabled,
    meta: {
      getRowActions: resolvedActions.getRowActions
    }
  });

  const query: DataTableQuery = {
    sorting,
    columnFilters,
    globalFilter,
    pagination: paginationState
  };

  React.useEffect(() => {
    if (manualMode) {
      return;
    }
    setPaginationState(current => ({ ...current, pageIndex: 0 }));
  }, [manualMode, globalFilter, columnFilters, sorting]);

  React.useEffect(() => {
    if (manualMode) {
      return;
    }

    const filteredRows = table.getFilteredRowModel().rows.length;
    const pageSize = paginationState.pageSize;
    const computedPageCount = pageSize > 0 ? Math.ceil(filteredRows / pageSize) : 0;
    const maxPageIndex = computedPageCount === 0 ? 0 : computedPageCount - 1;

    setPaginationState(current => ({
      ...current,
      pageIndex: clamp(current.pageIndex, 0, maxPageIndex)
    }));
  }, [manualMode, paginationState.pageSize, table]);

  const debouncedNotifyRef = React.useRef(
    debounce((next: DataTableQuery) => {
      resolvedApi.onQueryChange(next);
    }, resolvedSearch.debounceMs)
  );

  React.useEffect(() => {
    debouncedNotifyRef.current = debounce((next: DataTableQuery) => {
      resolvedApi.onQueryChange(next);
    }, resolvedSearch.debounceMs);
    return () => {
      debouncedNotifyRef.current.cancel();
    };
  }, [resolvedApi, resolvedSearch.debounceMs]);

  React.useEffect(() => {
    if (resolvedApi.mode !== 'server') {
      return;
    }
    debouncedNotifyRef.current(query);
    return () => {
      debouncedNotifyRef.current.cancel();
    };
  }, [query, resolvedApi]);

  const [scrollEl, setScrollEl] = React.useState<HTMLDivElement | null>(null);

  React.useEffect(() => {
    if (resolvedInfinite.enabled === false) {
      return undefined;
    }
    if (scrollEl === null) {
      return undefined;
    }

    const onScroll = () => {
      if (resolvedApi.isFetching) {
        return;
      }
      const scrollTop = scrollEl.scrollTop;
      const scrollHeight = scrollEl.scrollHeight;
      const clientHeight = scrollEl.clientHeight;
      const remaining = scrollHeight - (scrollTop + clientHeight);
      if (remaining <= resolvedInfinite.thresholdPx) {
        resolvedInfinite.onEndReached(query);
      }
    };

    scrollEl.addEventListener('scroll', onScroll, { passive: true });
    return () => {
      scrollEl.removeEventListener('scroll', onScroll);
    };
  }, [resolvedApi.isFetching, resolvedInfinite, query, scrollEl]);

  const columnsCount = table.getVisibleLeafColumns().length;

  return (
    <div className={cn('w-full', className === undefined ? '' : className)}>
      <DataTableToolbar<TData>
        table={table}
        placeholder={resolvedSearch.placeholder}
        debounceMs={resolvedSearch.debounceMs}
        right={
          <div className='ml-auto flex items-center gap-2'>
            {resolvedRenderToolbarRight(table)}
            <DataTableViewOptions<TData> table={table} columnVisibility={columnVisibility} />
          </div>
        }
      />

      <div
        ref={node => setScrollEl(node)}
        className={cn(containerClassName === undefined ? 'overflow-auto' : containerClassName)}>
        <DataTableTable<TData>
          table={table}
          columnVisibility={columnVisibility}
          expandedState={expanded}
          expandConfig={resolvedExpand}
          empty={resolvedEmpty}
          columnsCount={columnsCount}
        />
      </div>

      <DataTablePagination<TData>
        table={table}
        tableState={table.getState()}
        pageSizeOptions={resolvedPagination.pageSizeOptions}
        apiConfig={resolvedApi}
      />
    </div>
  );
};

export default DataTable;
