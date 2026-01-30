'use client';
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import {
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
  type ColumnDef,
  type ColumnFiltersState,
  type SortingState,
  type VisibilityState,
} from '@tanstack/react-table';
import {
  ArrowUpDown,
  ChevronDown,
  MoreHorizontal,
  Pencil,
  Plus,
  Trash2,
} from 'lucide-react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Label } from '../ui/label';
import { schoolColumns } from './tables/schools';
import type { AssistanceRecord } from '@/types/next-auth';
import { orpc } from '@/orpc/client';

type RowData = Record<string, string>;

function EditColumnDialog({
  rowData, // 👈 pass the old key in
  onEdit,
}: {
  rowData: AssistanceRecord;
  onEdit: (rowData: AssistanceRecord) => void;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild aria-describedby={undefined}>
        <Button
          variant="ghost"
          className="m-2 flex flex-row justify-center items-center gap-2 hover:cursor-pointer"
        >
          <Plus /> Edit Column
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Column</DialogTitle>
        </DialogHeader>
        <div className="flex gap-2 flex-col">
          <div className="flex gap-2 flex-row">
            <Input
              placeholder="Column title"
              //   value={title}
            />
            <DialogClose asChild>
              <Button className="hover:cursor-pointer">Save</Button>
            </DialogClose>
          </div>

          <div className="mt-2">
            <DialogClose asChild>
              <Button>Delete Column</Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Reporttable() {
  const [isViewed, setIsViewed] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({
      race: false,
      gender: false,
      ageRange: false,
      needsIdentified: false,
      assistanceGiven: false,
      valueRating: false,
      userResponsible: false,
      provinceOrState: false,
    });
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const [data, setData] = useState<AssistanceRecord[]>([]);

  useEffect(() => {
    async function fetchData() {
      const records = await orpc.reports.getall();
      setData(records);
    }
    fetchData();
  }, []);

  const table = useReactTable({
    data,
    columns: schoolColumns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    onColumnOrderChange: setColumnOrder,
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  });

  return (
    <>
      <div className="w-full">
        <div className="flex items-center py-4">
          <Input
            placeholder="Filter institution name..."
            value={
              (table
                .getColumn('institutionName')
                ?.getFilterValue() as string) ?? ''
            }
            onChange={(event) =>
              table
                .getColumn('institutionName')
                ?.setFilterValue(event.target.value)
            }
            className="max-w-sm"
          />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="ml-auto">
                Columns <ChevronDown />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    );
                  })}
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="w-full overflow-hidden rounded-md border">
          <Table>
            <TableHeader className="">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                    onClick={() => {
                      //   console.log(row.original);
                    }}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        <Dialog>
                          <DialogTrigger asChild aria-describedby={undefined}>
                            <button className="m-2 flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
                              {flexRender(
                                cell.column.columnDef.cell,
                                cell.getContext()
                              )}
                            </button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Edit Column</DialogTitle>
                            </DialogHeader>
                            <div className="flex gap-2 flex-col">
                              <div className="flex gap-2 flex-row">
                                <label htmlFor="">
                                  {flexRender(
                                    cell.column.columnDef.cell,
                                    cell.getContext()
                                  )}
                                </label>
                                <label htmlFor="">{cell.column.id}</label>
                                <label htmlFor="">{row.original['id']}</label>
                                <DialogClose asChild>
                                  <Button className="hover:cursor-pointer">
                                    Save
                                  </Button>
                                </DialogClose>
                              </div>

                              <div className="mt-2">
                                <DialogClose asChild>
                                  <Button>Delete Column</Button>
                                </DialogClose>
                              </div>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={schoolColumns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
            {/* <TableBody className="flex flex-col md:flex-row">
              {table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className={`${row.getIsSelected() ? 'bg-red-800' : ''}`}
                >
                  {row.getVisibleCells().map((cell) => {
                    const colKey = cell.column.id;
                    const value = cell.getValue() as string;

                    return (
                      <td key={cell.id} className="border px-2 py-1">
                        {colKey === 'select' ? (
                          // Render the checkbox for the select column
                          <Checkbox
                            checked={row.getIsSelected()}
                            onCheckedChange={(value) =>
                              row.toggleSelected(!!value)
                            }
                            aria-label="Select row"
                          />
                        ) : colKey === 'actions' ? (
                          <Button
                            variant={'ghost'}
                            onClick={() => {
                              const newData = data.filter(
                                (_, i) => i !== row.index
                              );
                              setData(newData);
                            }}
                            className="cursor-pointer flex flex-row-reverse w-10 justify-end"
                          >
                            <Trash2 />
                          </Button>
                        ) : value && value.trim() !== '' ? (
                          // Render the actual value if it exists
                          value
                        ) : (
                          // Otherwise show the +Add button
                          <button
                            className="text-blue-500 text-sm underline"
                            onClick={() => {
                              const newData = [...data];
                              newData[row.index][colKey] = 'New Value';
                              setData(newData);
                            }}
                          >
                            + Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </TableRow>
              ))}
            </TableBody> */}
          </Table>
        </div>
        <div className="flex items-center justify-end space-x-2 py-4">
          <div className="text-muted-foreground flex-1 text-sm">
            {table.getFilteredSelectedRowModel().rows.length} of{' '}
            {table.getFilteredRowModel().rows.length} row(s) selected.
          </div>
          <div className="space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              Next
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
