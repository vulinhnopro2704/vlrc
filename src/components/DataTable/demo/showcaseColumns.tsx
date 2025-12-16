import type { ColumnDef, Row } from '@tanstack/react-table';
import { isEmpty } from 'lodash-es';
import { ArrowUpDown } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import type { DataTableValue } from '../types';

import type { LogRow, TreeNodeRow, UserRow } from './showcaseData';

const sortButton = (label: string, onClick: () => void) => {
  return (
    <Button variant='ghost' onClick={onClick}>
      {label}
      <ArrowUpDown />
    </Button>
  );
};

const money = (value: number) => {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(value);
};

const codeCell = (value: string) => {
  return <span className='font-mono text-xs'>{value}</span>;
};

const levelBadge = (level: LogRow['level']) => {
  if (level === 'error') {
    return <Badge variant='destructive'>error</Badge>;
  }
  if (level === 'warn') {
    return <Badge variant='secondary'>warn</Badge>;
  }
  if (level === 'debug') {
    return <Badge variant='outline'>debug</Badge>;
  }
  return <Badge variant='default'>info</Badge>;
};

const statusBadge = (status: UserRow['status']) => {
  if (status === 'active') {
    return <Badge variant='default'>active</Badge>;
  }
  if (status === 'inactive') {
    return <Badge variant='secondary'>inactive</Badge>;
  }
  return <Badge variant='outline'>invited</Badge>;
};

const roleBadge = (role: UserRow['role']) => {
  if (role === 'admin') {
    return <Badge variant='destructive'>admin</Badge>;
  }
  if (role === 'manager') {
    return <Badge variant='secondary'>manager</Badge>;
  }
  return <Badge variant='outline'>viewer</Badge>;
};

const getIndentPx = (depth: number) => {
  const base = 8;
  return depth * base;
};

export const userColumns: ColumnDef<UserRow, DataTableValue>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) =>
      sortButton('Name', () => column.toggleSorting(column.getIsSorted() === 'asc')),
    cell: ({ row }) => <div className='font-medium'>{String(row.getValue('name'))}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) =>
      sortButton('Email', () => column.toggleSorting(column.getIsSorted() === 'asc')),
    cell: ({ row }) => <div className='lowercase'>{String(row.getValue('email'))}</div>
  },
  {
    accessorKey: 'role',
    header: 'Role',
    cell: ({ row }) => roleBadge(row.original.role),
    filterFn: 'equalsString'
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => statusBadge(row.original.status),
    filterFn: 'equalsString'
  },
  {
    accessorKey: 'balance',
    header: ({ column }) => (
      <div className='text-right'>
        {sortButton('Balance', () => column.toggleSorting(column.getIsSorted() === 'asc'))}
      </div>
    ),
    cell: ({ row }) => <div className='text-right font-medium'>{money(row.original.balance)}</div>
  },
  {
    accessorKey: 'createdAt',
    header: ({ column }) =>
      sortButton('Created', () => column.toggleSorting(column.getIsSorted() === 'asc')),
    cell: ({ row }) => codeCell(new Date(row.original.createdAt).toLocaleString())
  }
];

export const logColumns: ColumnDef<LogRow, DataTableValue>[] = [
  {
    accessorKey: 'ts',
    header: ({ column }) =>
      sortButton('Time', () => column.toggleSorting(column.getIsSorted() === 'asc')),
    cell: ({ row }) => codeCell(new Date(row.original.ts).toLocaleString())
  },
  {
    accessorKey: 'level',
    header: 'Level',
    cell: ({ row }) => levelBadge(row.original.level),
    filterFn: 'equalsString'
  },
  {
    accessorKey: 'code',
    header: ({ column }) =>
      sortButton('Code', () => column.toggleSorting(column.getIsSorted() === 'asc')),
    cell: ({ row }) => codeCell(row.original.code)
  },
  {
    accessorKey: 'message',
    header: 'Message',
    cell: ({ row }) => (
      <div className='max-w-[520px] truncate'>{String(row.getValue('message'))}</div>
    )
  },
  {
    accessorKey: 'durationMs',
    header: ({ column }) => (
      <div className='text-right'>
        {sortButton('Duration', () => column.toggleSorting(column.getIsSorted() === 'asc'))}
      </div>
    ),
    cell: ({ row }) => <div className='text-right font-medium'>{row.original.durationMs} ms</div>
  }
];

export const treeColumns: ColumnDef<TreeNodeRow, DataTableValue>[] = [
  {
    accessorKey: 'name',
    header: 'Node',
    cell: ({ row }) => {
      const depth = row.depth;
      const paddingLeft = getIndentPx(depth);
      return (
        <div style={{ paddingLeft }} className='flex items-center gap-2'>
          <span className='font-medium'>{row.original.name}</span>
          <span className='text-muted-foreground text-xs'>{row.original.type}</span>
        </div>
      );
    }
  },
  {
    accessorKey: 'amount',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => <div className='text-right font-medium'>{money(row.original.amount)}</div>
  },
  {
    id: 'childrenCount',
    header: 'Children',
    cell: ({ row }) => {
      const count = row.original.children.length;
      const value = count === 0 ? '-' : String(count);
      return codeCell(value);
    }
  },
  {
    id: 'debug',
    header: 'Debug',
    cell: ({ row }) => {
      const id = row.original.id;
      if (isEmpty(id)) {
        return null;
      }
      return codeCell(id);
    }
  }
];

export const getRowIdFromId = <T extends { id: string }>(row: T) => row.id;

export const makeRowActions = <TData,>(
  getLabel: (row: Row<TData>) => string,
  onCopy: (text: string) => void
) => {
  return {
    getRowActions: (row: Row<TData>) => [
      {
        id: 'copy',
        label: `Copy ${getLabel(row)}`,
        disabled: false,
        onSelect: () => {
          onCopy(getLabel(row));
        }
      }
    ]
  };
};
