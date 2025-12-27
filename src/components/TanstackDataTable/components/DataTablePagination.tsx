import { map } from 'lodash-es';
import type { Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { DataTableApiConfig } from '../types';

export const DataTablePagination = <TData,>({
  table,
  tableState,
  pageSizeOptions,
  apiConfig
}: {
  table: Table<TData>;
  tableState: Table<TData>['getState'] extends () => infer S ? S : never;
  pageSizeOptions: number[];
  apiConfig: DataTableApiConfig;
}) => {
  const pageIndex = tableState.pagination.pageIndex;
  const pageSize = tableState.pagination.pageSize;

  const totalRows =
    apiConfig.mode === 'server' ? apiConfig.totalRows : table.getFilteredRowModel().rows.length;

  const pageCount = pageSize > 0 ? Math.ceil(totalRows / pageSize) : 0;

  return (
    <div className='flex items-center justify-between gap-4 py-4'>
      <div className='text-muted-foreground flex-1 text-sm'>
        {table.getFilteredSelectedRowModel().rows.length} of {totalRows} row(s) selected.
      </div>

      <div className='flex items-center gap-2'>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant='outline' size='sm'>
              Rows: {pageSize}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align='end'>
            {map(pageSizeOptions, opt => (
              <DropdownMenuItem
                key={String(opt)}
                onClick={() => table.setPageSize(opt)}
                disabled={opt === pageSize}>
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          variant='outline'
          size='sm'
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}>
          Previous
        </Button>
        <Button
          variant='outline'
          size='sm'
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}>
          Next
        </Button>

        <div className='text-muted-foreground px-2 text-sm'>
          Page {pageIndex + 1} / {pageCount === 0 ? 1 : pageCount}
        </div>
      </div>
    </div>
  );
};
