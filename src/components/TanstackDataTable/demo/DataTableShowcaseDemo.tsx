import * as React from 'react';
import { map } from 'lodash-es';

import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';

import { DataTable } from '../DataTable';
import {
  createExpanderColumn,
  createRowActionsColumn,
  createSelectionColumn
} from '../render/createColumns';

import { logColumns, makeRowActions, treeColumns, userColumns } from './showcaseColumns';
import {
  makeLogs,
  makeTree,
  makeUsers,
  type LogRow,
  type TreeNodeRow,
  type UserRow
} from './showcaseData';

const sectionClass = 'space-y-3';

const statusFilter = (table: import('@tanstack/react-table').Table<UserRow>) => {
  const col = table.getColumn('status');
  if (col === undefined) {
    return null;
  }

  const current = col.getFilterValue();
  const currentValue = typeof current === 'string' ? current : '';

  const set = (value: string) => {
    col.setFilterValue(value);
  };

  const label = currentValue === '' ? 'Status: All' : `Status: ${currentValue}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Status</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => set('')}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('active')}>active</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('inactive')}>inactive</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('invited')}>invited</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

const levelFilter = (table: import('@tanstack/react-table').Table<LogRow>) => {
  const col = table.getColumn('level');
  if (col === undefined) {
    return null;
  }

  const current = col.getFilterValue();
  const currentValue = typeof current === 'string' ? current : '';

  const set = (value: string) => {
    col.setFilterValue(value);
  };

  const label = currentValue === '' ? 'Level: All' : `Level: ${currentValue}`;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='outline' size='sm'>
          {label}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        <DropdownMenuLabel>Level</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={() => set('')}>All</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('debug')}>debug</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('info')}>info</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('warn')}>warn</DropdownMenuItem>
        <DropdownMenuItem onClick={() => set('error')}>error</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export const DataTableShowcaseDemo = () => {
  // Important: keep demo data stable across re-renders.
  // If we regenerate rows on every interaction, TanStack Table will treat it as new data and
  // may reset expanded/selection/sorting, making the UI feel "non-interactive".
  const users = React.useMemo(() => makeUsers(48), []);
  const logs = React.useMemo(() => makeLogs(120), []);
  const tree = React.useMemo(() => makeTree(), []);

  const usersColumns = React.useMemo(
    () => [createSelectionColumn<UserRow>(), ...userColumns, createRowActionsColumn<UserRow>()],
    []
  );
  const logsColumns = React.useMemo(() => [...logColumns, createRowActionsColumn<LogRow>()], []);
  const treeColumnsResolved = React.useMemo(
    () => [
      createExpanderColumn<TreeNodeRow>(),
      ...treeColumns,
      createRowActionsColumn<TreeNodeRow>()
    ],
    []
  );

  return (
    <div className='space-y-10'>
      <section className={sectionClass}>
        <div className='space-y-1'>
          <div className='text-base font-semibold'>Users</div>
          <div className='text-muted-foreground text-sm'>
            Search + sort + filter + selection + actions + pagination.
          </div>
        </div>

        <DataTable<UserRow>
          tableId='showcase-users'
          data={users}
          columns={usersColumns}
          actions={makeRowActions<UserRow>(
            row => row.original.email,
            text => {
              void navigator.clipboard.writeText(text);
            }
          )}
          renderToolbarRight={table => statusFilter(table)}
        />
      </section>

      <section className={sectionClass}>
        <div className='space-y-1'>
          <div className='text-base font-semibold'>Logs</div>
          <div className='text-muted-foreground text-sm'>
            Code + badge + number columns; filter on level; large data.
          </div>
        </div>

        <DataTable<LogRow>
          tableId='showcase-logs'
          data={logs}
          columns={logsColumns}
          actions={makeRowActions<LogRow>(
            row => row.original.code,
            text => {
              void navigator.clipboard.writeText(text);
            }
          )}
          renderToolbarRight={table => levelFilter(table)}
          pagination={{ pageSizeOptions: [10, 20, 50, 100, 200] }}
        />
      </section>

      <section className={sectionClass}>
        <div className='space-y-1'>
          <div className='text-base font-semibold'>Tree / Expand + Child Rows</div>
          <div className='text-muted-foreground text-sm'>
            Row can expand and can have children (subRows).
          </div>
        </div>

        <DataTable<TreeNodeRow>
          tableId='showcase-tree'
          data={tree}
          columns={treeColumnsResolved}
          expand={{
            enabled: true,
            getSubRows: row => row.children,
            renderSubComponent: row => {
              const original = row.original;
              const lines = map(
                [
                  `id: ${original.id}`,
                  `type: ${original.type}`,
                  `amount: ${original.amount}`,
                  `children: ${original.children.length}`
                ],
                v => v
              );

              return (
                <div className='bg-muted/30 border-t p-3'>
                  <div className='text-muted-foreground mb-1 text-xs'>Expanded row details</div>
                  <pre className='text-xs leading-5'>{lines.join('\n')}</pre>
                </div>
              );
            }
          }}
          actions={makeRowActions<TreeNodeRow>(
            row => row.original.id,
            text => {
              void navigator.clipboard.writeText(text);
            }
          )}
          pagination={{ pageSizeOptions: [10, 20, 50] }}
        />
      </section>
    </div>
  );
};
