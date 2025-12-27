import { map } from 'lodash-es';
import { ChevronDown } from 'lucide-react';
import type { Table, VisibilityState } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

export const DataTableViewOptions = <TData,>({
  table,
  columnVisibility
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
}) => {
  const columns = table.getAllColumns().filter(c => c.getCanHide());

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' className='ml-auto'>
          Columns <ChevronDown />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {map(columns, col => (
          <DropdownMenuCheckboxItem
            key={col.id}
            className='capitalize'
            checked={columnVisibility[col.id] !== false}
            onCheckedChange={() => col.toggleVisibility(columnVisibility[col.id] === false)}>
            {col.id}
          </DropdownMenuCheckboxItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
