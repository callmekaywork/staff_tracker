import Header from '@/components/header/head';
import Reportform from '@/components/reporting/report-form';
import Reporttable from '@/components/reporting/report-table';
import Tabs from '@/components/reporting/tabs';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex min-h-screen w-full md:max-w-4xl lg:max-w-6xl flex-col items-center  py-32 px-5 sm:items-start transition-all transition-normal delay-75 ease-in-out">
        {/* <Tabs /> */}
        <Reportform />
        <Reporttable />
      </main>
    </div>
  );
}
