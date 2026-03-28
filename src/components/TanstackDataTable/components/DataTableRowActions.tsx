import { get, isEmpty, map } from 'lodash-es';
import { MoreHorizontal } from 'lucide-react';
import type { Row, Table } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import type { DataTableActionsConfig } from '../types';

export const DataTableRowActions = <TData,>({
  row,
  table
}: {
  row: Row<TData>;
  table: Table<TData>;
}) => {
  const { t } = useTranslation();
  const meta = table.options.meta as
    | { getRowActions?: DataTableActionsConfig<TData>['getRowActions'] }
    | undefined;
  const getRowActions = get(meta, 'getRowActions');
  const items = getRowActions === undefined ? [] : getRowActions(row);

  if (isEmpty(items)) {
    return null;
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>{t('datatable_open_menu')}</span>
          <MoreHorizontal />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>{t('datatable_actions')}</DropdownMenuLabel>
        <DropdownMenuSeparator />
        {map(items, item => (
          <DropdownMenuItem
            key={item.id}
            disabled={item.disabled}
            onClick={() => item.onSelect(row)}>
            {item.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
