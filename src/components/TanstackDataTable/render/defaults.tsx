import { noop } from 'lodash-es';
import type {
  DataTableActionItem,
  DataTableApiConfig,
  DataTableEmptyConfig,
  DataTableInfiniteScrollConfig,
  DataTablePaginationConfig,
  DataTableSearchConfig
} from '../types';

export const DEFAULT_SEARCH: DataTableSearchConfig = {
  placeholder: 'Search...',
  debounceMs: 300
};

export const DEFAULT_PAGINATION: DataTablePaginationConfig = {
  pageSizeOptions: [10, 20, 50, 100]
};

export const DEFAULT_EMPTY: DataTableEmptyConfig = {
  render: () => <div className='text-muted-foreground py-8 text-center text-sm'>No results.</div>
};

export const DEFAULT_API: DataTableApiConfig = {
  mode: 'client',
  isFetching: false,
  totalRows: 0,
  onQueryChange: noop
};

export const DEFAULT_INFINITE_SCROLL: DataTableInfiniteScrollConfig = {
  enabled: false,
  thresholdPx: 200,
  onEndReached: noop
};

export const createDefaultActions = <TData,>(): {
  getRowActions: () => DataTableActionItem<TData>[];
} => ({
  getRowActions: () => []
});
