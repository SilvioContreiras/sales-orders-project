import type { ReactNode } from 'react';
import { cn } from '@/shared/lib/cn';

export interface Column<T> {
  header: string;
  cell: (row: T) => ReactNode;
  className?: string;
  align?: 'left' | 'right' | 'center';
}

interface DataTableProps<T> {
  columns: Column<T>[];
  rows: T[];
  rowKey: (row: T) => string;
  onRowClick?: (row: T) => void;
}

const alignClass = {
  left: 'text-left',
  right: 'text-right',
  center: 'text-center',
};

export function DataTable<T>({ columns, rows, rowKey, onRowClick }: DataTableProps<T>) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="border-b border-slate-200 bg-slate-50">
            {columns.map((column, index) => (
              <th
                key={index}
                className={cn(
                  'px-4 py-3 text-xs font-semibold uppercase tracking-wider text-slate-500',
                  alignClass[column.align ?? 'left'],
                  column.className,
                )}
              >
                {column.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr
              key={rowKey(row)}
              onClick={onRowClick ? () => onRowClick(row) : undefined}
              className={cn(
                'border-b border-slate-100 last:border-0',
                onRowClick && 'cursor-pointer hover:bg-slate-50',
              )}
            >
              {columns.map((column, index) => (
                <td
                  key={index}
                  className={cn('px-4 py-3 text-slate-700', alignClass[column.align ?? 'left'])}
                >
                  {column.cell(row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
