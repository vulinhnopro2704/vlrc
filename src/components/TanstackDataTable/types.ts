import type {
  ColumnDef,
  ColumnFiltersState,
  ExpandedState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  VisibilityState
} from '@tanstack/react-table';

export type DataTableMode = 'client' | 'server';

export type DataTableQuery = {
  pagination: PaginationState;
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
};

export type DataTableEmptyConfig = {
  render: () => ReactNode;
};

export type DataTableActionItem<TData> = {
  id: string;
  label: string;
  disabled: boolean;
  onSelect: (row: Row<TData>) => void;
};

export type DataTableActionsConfig<TData> = {
  getRowActions: (row: Row<TData>) => DataTableActionItem<TData>[];
};

export type DataTableSearchConfig = {
  placeholder: string;
  debounceMs: number;
};

export type DataTablePaginationConfig = {
  pageSizeOptions: number[];
};

export type DataTableInfiniteScrollConfig = {
  enabled: boolean;
  thresholdPx: number;
  onEndReached: (query: DataTableQuery) => void;
};

export type DataTableApiConfig = {
  mode: DataTableMode;
  isFetching: boolean;
  totalRows: number;
  onQueryChange: (query: DataTableQuery) => void;
};

export type DataTableExpandConfig<TData> = {
  enabled: boolean;
  renderSubComponent: (row: Row<TData>) => ReactNode;
  getSubRows: (row: TData) => TData[];
};

export type DataTableInitialState = {
  sorting: SortingState;
  columnFilters: ColumnFiltersState;
  globalFilter: string;
  columnVisibility: VisibilityState;
  rowSelection: RowSelectionState;
  pagination: PaginationState;
  expanded: ExpandedState;
};
export type DataTableValue = string | number | boolean | null | undefined | Date | object;

export type DataTableProps<TData> = {
  data: TData[];
  columns: ColumnDef<TData, DataTableValue>[];
  initialState?: DataTableInitialState;
  empty?: DataTableEmptyConfig;
  search?: DataTableSearchConfig;
  pagination?: DataTablePaginationConfig;
  actions?: DataTableActionsConfig<TData>;
  api?: DataTableApiConfig;
  infiniteScroll?: DataTableInfiniteScrollConfig;
  expand?: DataTableExpandConfig<TData>;
  className?: string;
  containerClassName?: string;
  getRowId?: (originalRow: TData, index: number, parent: Row<TData> | null) => string;
  renderToolbarRight?: (table: Table<TData>) => ReactNode;
};
