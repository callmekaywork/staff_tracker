import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { assistanceRecordSchema } from '@/db/validators';
import type { AssistanceRecord } from '@/types/next-auth';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';

// Infer the type from Zod

// Generate columns dynamically
export const schoolColumns: ColumnDef<AssistanceRecord>[] = [
  {
    id: 'select',
    size: 10, // fixed width in pixels
    minSize: 10, // minimum width
    maxSize: 10, // maximum width
    header: ({ table }) => (
      <div className="flex flex-row justify-center items-center gap-3 w-8">
        <Checkbox
          checked={
            table.getIsAllPageRowsSelected() ||
            (table.getIsSomePageRowsSelected() && 'indeterminate')
          }
          onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
          aria-label="Select all"
        />
      </div>
    ),
    cell: ({ row }) => (
      <div className="flex flex-row justify-center items-center gap-3 w-8">
        <Checkbox
          checked={row.getIsSelected()}
          onCheckedChange={(value) => row.toggleSelected(!!value)}
          aria-label="Select row"
        />
      </div>
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: 'institutionName',
    header: 'Institution Name',
  },
  {
    accessorKey: 'institutionType',
    header: 'Institution Type',
  },
  {
    accessorKey: 'contactPerson',
    header: 'Contact Person',
  },
  {
    accessorKey: 'emailAddress',
    header: 'Email',
  },
  {
    accessorKey: 'phoneNumber',
    header: 'Phone',
  },
  {
    accessorKey: 'beneficiaryName',
    header: 'Beneficiary',
  },
  {
    accessorKey: 'disability',
    header: 'Disability',
    cell: ({ row }) => (row.getValue('disability') ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'race',
    header: 'Race',
  },
  {
    accessorKey: 'gender',
    header: 'Gender',
  },
  {
    accessorKey: 'geoType',
    header: 'Geo Type',
  },
  {
    accessorKey: 'ageRange',
    header: 'Age Range',
  },
  {
    accessorKey: 'needsIdentified',
    header: 'Needs Identified',
  },
  {
    accessorKey: 'assistanceGiven',
    header: 'Assistance Given',
  },
  {
    accessorKey: 'valueRating',
    header: 'Value Rating',
  },
  {
    accessorKey: 'dateAssisted',
    header: 'Date Assisted',
    cell: ({ row }) => {
      const date = row.getValue('dateAssisted') as Date | undefined;
      return date ? new Date(date).toLocaleDateString() : '';
    },
  },
  {
    accessorKey: 'userResponsible',
    header: 'User Responsible',
  },
  {
    accessorKey: 'provinceOrState',
    header: 'Province/State',
  },
  {
    id: 'actions',
    enableHiding: false,
    cell: ({ row }) => {
      const item = row.original;
      return (
        <Button
          variant={'ghost'}
          onClick={() => {
            //   const newData = data.filter((_, i) => i !== row.index);
            console.log(item);
            //   setData(newData);
          }}
          className="flex flex-row-reverse cursor-pointer"
        >
          Delete
          <Trash2 />
        </Button>
      );
    },
  },
];
