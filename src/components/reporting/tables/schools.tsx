import { z } from 'zod';
import { ColumnDef } from '@tanstack/react-table';
import { assistanceRecordSchema } from '@/db/validators';
import type { AssistanceRecord } from '@/types/next-auth';

// Infer the type from Zod

// Generate columns dynamically
export const schoolColumns: ColumnDef<AssistanceRecord>[] = [
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
];
