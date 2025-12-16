import { ChevronDown, ChevronRight } from 'lucide-react';
import type { ColumnDef, Row } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { DataTableRowActions } from '../components/DataTableRowActions';
import type { DataTableValue } from '../types';

export const createSelectionColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'select',
  header: ({ table }) => (
    <Checkbox
      checked={
        table.getIsAllPageRowsSelected() ||
        (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)
      }
      onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
      aria-label='Select all'
    />
  ),
  cell: ({ row }) => (
    <Checkbox
      checked={row.getIsSelected()}
      onCheckedChange={value => row.toggleSelected(!!value)}
      aria-label='Select row'
    />
  ),
  enableSorting: false,
  enableHiding: false
});

export const createExpanderColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'expand',
  header: () => null,
  cell: ({ row }) => <ExpanderCell row={row} />,
  enableSorting: false,
  enableHiding: false
});

const ExpanderCell = <TData,>({ row }: { row: Row<TData> }) => {
  if (row.getCanExpand() === false) {
    return null;
  }

  return (
    <Button variant='ghost' size='sm' className='h-8 w-8 p-0' onClick={() => row.toggleExpanded()}>
      <span className='sr-only'>Toggle</span>
      {row.getIsExpanded() ? <ChevronDown /> : <ChevronRight />}
    </Button>
  );
};

export const createRowActionsColumn = <TData,>(): ColumnDef<TData, DataTableValue> => ({
  id: 'actions',
  header: () => null,
  enableHiding: false,
  cell: ({ row, table }) => <DataTableRowActions row={row} table={table} />
});
