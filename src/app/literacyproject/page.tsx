'use client';

import Header from '@/components/header/head';
import Reportform from '@/components/reporting/report-form';
import Reporttable from '@/components/reporting/report-table';
import { Label } from '@/components/ui/label';
import React from 'react';

export default function Literacyproject() {
  return (
    <div>
      <div className="flex min-h-screen w-full md:max-w-4xl lg:max-w-6xl flex-col items-center  py-32 px-5 sm:items-start transition-all transition-normal delay-75 ease-in-out">
        <div className="flex w-full flex-col mt-10 mb-2 ">
          <div className="mb-5">
            <Label className="text-6xl">Literacy Project</Label>
          </div>
          <Reportform />
          <Reporttable />
        </div>
      </div>
    </div>
  );
}
