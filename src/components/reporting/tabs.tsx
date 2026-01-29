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

type TabData = {
  id: string;
  title: string;
  description?: string;
  rows: Row[]; // or more complex objects if needed
};

type Row = { id: string; cells: string[] };

type RowData = Record<string, string>; // flexible row type

const example: TabData[] = [
  {
    id: 'tab1',
    title: 'Customers',
    description: 'Customer data',
    rows: [
      { id: 'row1', cells: ['Alice', 'alice@email.com', 'Premium'] },
      { id: 'row2', cells: ['Bob', 'bob@email.com', 'Standard'] },
    ],
  },
];

export const columns: ColumnDef<TabData>[] = [];

function AddColumnDialog({ onAdd }: { onAdd: (title: string) => void }) {
  const [title, setTitle] = useState('');

  return (
    <Dialog>
      <DialogTrigger asChild aria-describedby={undefined}>
        <Button className="m-2 flex flex-row justify-center items-center gap-2 hover:cursor-pointer">
          <Plus /> Add Column
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Column</DialogTitle>
        </DialogHeader>
        <Input
          placeholder="Column title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <DialogClose asChild>
          <Button
            onClick={() => {
              if (title.trim()) {
                onAdd(title.trim());
                setTitle('');
              }
            }}
            className="hover:cursor-pointer"
          >
            Add
          </Button>
        </DialogClose>
      </DialogContent>
    </Dialog>
  );
}

function EditColumnDialog({
  columnKey, // 👈 pass the old key in
  currentTitle,
  onEdit,
}: {
  columnKey: string;
  currentTitle: string;
  onEdit: (title: string, oldKey: string) => void;
}) {
  const [title, setTitle] = useState(currentTitle);

  return (
    <Dialog>
      <DialogTrigger asChild aria-describedby={undefined}>
        <Button
          variant="ghost"
          className="m-2 flex flex-row justify-center items-center gap-2 hover:cursor-pointer"
          onClick={() => {
            console.log(title);
          }}
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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <DialogClose asChild>
              <Button
                onClick={() => {
                  if (title.trim()) {
                    onEdit(title.trim(), columnKey); // 👈 send old key back
                  }
                }}
                className="hover:cursor-pointer"
              >
                Save
              </Button>
            </DialogClose>
          </div>

          <div className="mt-2">
            <DialogClose asChild>
              <Button
                onClick={() => {
                  onEdit('', columnKey); // 👈 empty title means delete
                }}
              >
                Delete Column
              </Button>
            </DialogClose>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

export default function Tabs() {
  const [isViewed, setIsViewed] = useState(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  const [columnOrder, setColumnOrder] = useState<string[]>([]);

  const actionsColumn: ColumnDef<any> = {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          variant={'ghost'}
          onClick={() => {
            const newData = data.filter((_, i) => i !== row.index);
            setData(newData);
          }}
          className="flex flex-row-reverse cursor-pointer"
        >
          Delete
          <Trash2 />
        </Button>
      );
    },
  };

  const [columns, setColumns] = useState<ColumnDef<RowData>[]>([
    {
      id: 'select',
      size: 10, // fixed width in pixels
      minSize: 10, // minimum width
      maxSize: 10, // maximum width
      header: ({ table }) => (
        <div className="flex flex-row justify-start items-center gap-3 max-w-7">
          <Checkbox
            checked={
              table.getIsAllPageRowsSelected() ||
              (table.getIsSomePageRowsSelected() && 'indeterminate')
            }
            onCheckedChange={(value) =>
              table.toggleAllPageRowsSelected(!!value)
            }
            aria-label="Select all"
          />
          {/* <Label>Select all</Label> */}
        </div>
      ),
      cell: ({ row }) => (
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      ),
      enableSorting: false,
      enableHiding: false,
    },
    {
      accessorKey: 'name',
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
          >
            Name
            <ArrowUpDown />
          </Button>
        );
      },
      cell: ({ row }) => (
        <div className="lowercase">{row.getValue('name')}</div>
      ),
    },
    { accessorKey: 'age', header: 'Age' },
    actionsColumn,
  ]);

  const [data, setData] = useState<RowData[]>([
    { name: 'Alice', age: '24' },
    { name: 'Bob', age: '30' },
  ]);

  const table = useReactTable({
    data,
    columns,
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

  // Ensure "actions" is always last
  useEffect(() => {
    const baseOrder = table.getAllLeafColumns().map((col) => col.id);
    const withoutActions = baseOrder.filter((id) => id !== 'actions');
    setColumnOrder([...withoutActions, 'actions']);
  }, [table]);

  const handleEditColumn = (colId: string) => {
    // Example: simple prompt for action

    console.log('do something', colId);
  };

  // Add a new column dynamically
  // const addColumn = () => {
  //   const newKey = `col${columns.length + 1}`;
  //   setColumns([
  //     ...columns,
  //     { accessorKey: newKey, header: `Column ${columns.length + 1}` },
  //   ]);

  //   // Update existing rows with empty values for the new column
  //   setData(data.map((row) => ({ ...row, [newKey]: '' })));
  // };
  // const isColumnEmpty = (colKey: string) => {
  //   return data.every((row) => !row[colKey] || row[colKey].trim() === '');
  // };

  return (
    <>
      <div className="w-full">
        <div className="flex flex-row justify-end items-center ">
          <AddColumnDialog
            onAdd={(title) => {
              const newKey = title.toLowerCase().replace(/\s+/g, '_');

              // add new column
              // setColumns([...columns, { accessorKey: newKey, header: title }]);

              const newColumn = { accessorKey: newKey, header: title };

              setColumns((prev) => {
                const actionsCol = prev.find((col) => col.id === 'actions');
                const withoutActions = prev.filter(
                  (col) => col.id !== 'actions'
                );

                const updated = [...withoutActions, newColumn];
                if (actionsCol) {
                  updated.push(actionsCol);
                }

                return updated;
              });

              // set new data
              setData(data.map((row) => ({ ...row, [newKey]: '' })));
            }}
          />
        </div>

        <div className="flex items-center py-4">
          <Input
            placeholder="Filter emails..."
            value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
            onChange={(event) =>
              table.getColumn('name')?.setFilterValue(event.target.value)
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
            <TableHeader className="bg-gray-600 flex flex-col md:flex-row">
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
            {/* <TableBody>
              {table.getRowModel().rows?.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    data-state={row.getIsSelected() && 'selected'}
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id}>
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    No results.
                  </TableCell>
                </TableRow>
              )}
            </TableBody> */}
            <TableBody className="flex flex-col md:flex-row">
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
            </TableBody>
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

        <div className="mt-10">
          <Button
            onClick={() => {
              setIsViewed((prev) => !prev);
            }}
            className="mb-2 cursor-pointer"
          >
            Print data
          </Button>

          {isViewed && (
            <div>
              {table.getRowModel().rows.map((row) => (
                <div key={row.id}>
                  {row.getVisibleCells().map((cell) => {
                    const colKey = cell.column.id;
                    const value = cell.getValue() as string;

                    return (
                      <div key={cell.id} className="border px-2 py-1">
                        {value && value.trim() !== '' && value}
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* <div>
          {table.getHeaderGroups().map((headerGroup) => (
            <div key={headerGroup.id} className="flex">
              {headerGroup.headers.map((header) => (
                <div
                  key={header.id}
                  className="flex items-center gap-2 px-2 font-bold"
                >
                  {header.isPlaceholder ? null : header.column.id ===
                    'select' ? null : header.column.id === 'actions' ? null : (
                    <>
                      {flexRender(
                        header.column.columnDef.header,
                        header.getContext()
                      )}

                      <EditColumnDialog
                        columnKey={
                          header.column.id ?? header.column.columnDef.header
                        }
                        currentTitle={String(header.column.id)}
                        onEdit={(newTitle, oldKey) => {
                          if (!newTitle) {
                            // delete
                            setColumns((prev) =>
                              prev.filter(
                                (col) =>
                                  (col.id ?? header.column.columnDef.header) !==
                                  oldKey
                              )
                            );
                          } else {
                            // edit
                            setColumns((prev) =>
                              prev.map((col) =>
                                (col.id ?? header.column.columnDef.header) ===
                                oldKey
                                  ? { ...col, header: newTitle }
                                  : col
                              )
                            );
                          }
                        }}
                      />
                    </>
                  )}
                </div>
              ))}
            </div>
          ))}
        </div> */}
      </div>
    </>
  );
}
