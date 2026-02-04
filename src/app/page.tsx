import Header from '@/components/header/head';
import { Onlinetoast } from '@/components/header/onlinetoast';
import Reportform from '@/components/reporting/report-form';
import Reporttable from '@/components/reporting/report-table';
import Tabs from '@/components/reporting/tabs';
import Task_report from '@/components/reporting/tracking/task-report';
import Whosonline from '@/components/reporting/tracking/whosonline';
import { Label } from '@/components/ui/label';
// import useCheckUser from '@/hooks/useCheckUser';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen font-sans ">
      <Header />
      {/* <Onlinetoast /> */}
      <main className="flex min-h-screen w-full md:max-w-4xl lg:max-w-6xl flex-col items-center py-10 px-5 sm:items-start transition-all transition-normal delay-75 ease-in-out">
        {/* <Tabs /> */}
        <Whosonline />
        <Task_report />
      </main>
    </div>
  );
}
