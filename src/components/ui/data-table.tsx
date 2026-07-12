'use client'

import * as React from 'react'
import {
  useReactTable,
  getCoreRowModel,
  getSortedRowModel,
  getPaginationRowModel,
  flexRender,
  type SortingState,
  type ColumnDef,
  type Row,
} from '@tanstack/react-table'
import { ArrowUpDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { cn } from '@/lib/utils'

declare module '@tanstack/react-table' {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  interface ColumnMeta<TData, TValue> {
    className?: string
    headerClassName?: string
  }
}

export interface Column<T> {
  key: string
  header: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
  className?: string
  headerClassName?: string
}

export interface DataTableProps<T> {
  columns: Column<T>[]
  data: T[]
  pageSize?: number
  sortable?: boolean
  loading?: boolean
  emptyState?: React.ReactNode
  className?: string
  onRowClick?: (item: T) => void
  keyExtractor: (item: T) => string | number
}

function buildColumnDefs<T>(
  columns: Column<T>[],
  globalSortable: boolean,
): ColumnDef<T, unknown>[] {
  return columns.map((col) => ({
    id: col.key,
    accessorKey: col.key as keyof T & string,
    header: col.header,
    enableSorting: col.sortable !== false && globalSortable,
    cell: ({ row }) => {
      const item = row.original
      return col.render ? col.render(item) : String((item as Record<string, unknown>)[col.key] ?? '')
    },
    meta: { className: col.className, headerClassName: col.headerClassName },
  }))
}

function DataTable<T extends Record<string, unknown>>({
  columns,
  data,
  pageSize = 20,
  sortable = true,
  loading = false,
  emptyState,
  className,
  onRowClick,
  keyExtractor,
}: DataTableProps<T>) {
  const [sorting, setSorting] = React.useState<SortingState>([])

  const columnDefs = React.useMemo(() => buildColumnDefs(columns, sortable), [columns, sortable])

  const table = useReactTable({
    data,
    columns: columnDefs,
    state: { sorting },
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize } },
  })

  if (loading) {
    return (
      <div className={cn('rounded-lg border border-[#2b3139] overflow-hidden', className)}>
        <div className="p-8 text-center text-[#848e9c]">Loading...</div>
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={cn('rounded-lg border border-[#2b3139] overflow-hidden', className)}>
        {emptyState ?? <div className="p-8 text-center text-[#848e9c]">No data</div>}
      </div>
    )
  }

  const pageIndex = table.getState().pagination.pageIndex
  const pageCount = table.getPageCount()
  const totalRows = table.getFilteredRowModel().rows.length

  return (
    <div className={cn('space-y-3', className)}>
      <div className="rounded-lg border border-[#2b3139] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className="bg-[#1e2329]">
                  {headerGroup.headers.map((header) => {
                    const meta = header.column.columnDef.meta
                    const canSort = header.column.getCanSort()
                    const sortedState = header.column.getIsSorted()
                    return (
                      <th
                        key={header.id}
                        className={cn(
                          'px-4 py-3 text-left text-xs font-medium text-[#848e9c] uppercase tracking-wider',
                          canSort && 'cursor-pointer select-none hover:text-white transition-colors',
                          meta?.headerClassName,
                        )}
                        onClick={canSort ? header.column.getToggleSortingHandler() : undefined}
                        role={canSort ? 'button' : undefined}
                        tabIndex={canSort ? 0 : undefined}
                        aria-label={canSort ? (sortedState === 'asc' ? 'Sorted ascending' : sortedState === 'desc' ? 'Sorted descending' : 'Not sorted') : undefined}
                        onKeyDown={canSort ? (e) => {
                          if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault()
                            header.column.getToggleSortingHandler()?.(e)
                          }
                        } : undefined}
                      >
                        <div className="flex items-center gap-1">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                          {header.column.getCanSort() && (
                            <ArrowUpDown className="h-3 w-3 shrink-0 text-[#848e9c]" />
                          )}
                          {header.column.getIsSorted() === 'asc' && (
                            <span className="text-[#fcd535]">↑</span>
                          )}
                          {header.column.getIsSorted() === 'desc' && (
                            <span className="text-[#fcd535]">↓</span>
                          )}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-[#2b3139]">
              {table.getRowModel().rows.map((row: Row<T>) => (
                <tr
                  key={keyExtractor(row.original)}
                  className={cn(
                    'bg-[#0b0e11] transition-colors',
                    onRowClick && 'cursor-pointer hover:bg-[#1e2329]',
                  )}
                  onClick={() => onRowClick?.(row.original)}
                >
                  {row.getVisibleCells().map((cell) => {
                    const meta = cell.column.columnDef.meta
                    return (
                      <td key={cell.id} className={cn('px-4 py-3 text-white/80', meta?.className)}>
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <span className="text-xs text-[#848e9c]">
          {totalRows} result{totalRows !== 1 ? 's' : ''}
        </span>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
            aria-label="Previous page"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#2b3139] text-[#848e9c] hover:bg-[#1e2329] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className="text-xs text-[#848e9c]">
            Page {pageIndex + 1} of {pageCount}
          </span>
          <button
            type="button"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
            aria-label="Next page"
            className="inline-flex items-center justify-center h-8 w-8 rounded-md border border-[#2b3139] text-[#848e9c] hover:bg-[#1e2329] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  )
}

export { DataTable }
