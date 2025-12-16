import { ArrowUpDown } from 'lucide-react';
import type { ColumnDef } from '@tanstack/react-table';

import { Button } from '@/components/ui/button';

import type { DataTableValue } from '../types';

export type Payment = {
  id: string;
  amount: number;
  status: 'pending' | 'processing' | 'success' | 'failed';
  email: string;
};

export const paymentColumns: ColumnDef<Payment, DataTableValue>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => <div className='capitalize'>{String(row.getValue('status'))}</div>
  },
  {
    accessorKey: 'email',
    header: ({ column }) => (
      <Button variant='ghost' onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}>
        Email
        <ArrowUpDown />
      </Button>
    ),
    cell: ({ row }) => <div className='lowercase'>{String(row.getValue('email'))}</div>
  },
  {
    accessorKey: 'amount',
    header: () => <div className='text-right'>Amount</div>,
    cell: ({ row }) => {
      const value = row.getValue('amount');
      const amount = typeof value === 'number' ? value : Number(String(value));
      const formatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }).format(amount);

      return <div className='text-right font-medium'>{formatted}</div>;
    }
  }
];
