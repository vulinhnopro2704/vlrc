import * as React from 'react';
import { map } from 'lodash-es';
import {
  flexRender,
  type ExpandedState,
  type Table,
  type VisibilityState
} from '@tanstack/react-table';

import {
  Table as UITable,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

import type { DataTableEmptyConfig, DataTableExpandConfig } from '../types';

export const DataTableTable = <TData,>({
  table,
  columnVisibility,
  expandedState,
  expandConfig,
  empty,
  columnsCount
}: {
  table: Table<TData>;
  columnVisibility: VisibilityState;
  expandedState: ExpandedState;
  expandConfig: DataTableExpandConfig<TData>;
  empty: DataTableEmptyConfig;
  columnsCount: number;
}) => {
  const rows = table.getRowModel().rows;
  const hasRows = rows.length > 0;
  // Touch expandedState so React sees prop change and re-renders when expand toggles (compiler may memo table ref)
  void expandedState;

  return (
    <div className='overflow-hidden rounded-md border'>
      <UITable>
        <TableHeader>
          {map(table.getHeaderGroups(), headerGroup => (
            <TableRow key={headerGroup.id}>
              {map(headerGroup.headers, header => {
                if (
                  header.isPlaceholder ||
                  columnVisibility[header.column.id] === false ||
                  header.column.columnDef.header === undefined
                ) {
                  return null;
                }
                return (
                  <TableHead key={header.id}>
                    {flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {hasRows ? (
            map(rows, row => (
              <React.Fragment key={row.id}>
                <TableRow data-state={row.getIsSelected() ? 'selected' : undefined}>
                  {map(row.getVisibleCells(), cell => (
                    <TableCell key={cell.id}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>

                {expandConfig.enabled && row.getIsExpanded() ? (
                  <TableRow>
                    <TableCell colSpan={columnsCount} className='p-0'>
                      {expandConfig.renderSubComponent(row)}
                    </TableCell>
                  </TableRow>
                ) : null}
              </React.Fragment>
            ))
          ) : (
            <TableRow>
              <TableCell colSpan={columnsCount} className='h-24 text-center'>
                {empty.render()}
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </UITable>
    </div>
  );
};
