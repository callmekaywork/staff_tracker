import Header from '@/components/header/head';
import { Onlinetoast } from '@/components/header/onlinetoast';
import Reportform from '@/components/reporting/report-form';
import Reporttable from '@/components/reporting/report-table';
import Tabs from '@/components/reporting/tabs';
import Whosonline from '@/components/reporting/tracking/whosonline';
import { Label } from '@/components/ui/label';
// import useCheckUser from '@/hooks/useCheckUser';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen font-sans ">
      <Header />
      {/* <Onlinetoast /> */}
      <main className="flex min-h-screen w-full md:max-w-4xl lg:max-w-6xl flex-col items-center  py-32 px-5 sm:items-start transition-all transition-normal delay-75 ease-in-out">
        {/* <Tabs /> */}
        <Whosonline />

        <div className="flex w-full flex-col mt-10 mb-2 ">
          <div className="mb-5">
            <Label className="text-6xl">Literacy Project</Label>
          </div>
          <Reportform />
          <Reporttable />
        </div>
      </main>
    </div>
  );
}
