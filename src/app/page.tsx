import Header from '@/components/header/head';
import Tabs from '@/components/reporting/tabs';
import Image from 'next/image';

export default function Home() {
  return (
    <div className="flex flex-col items-center min-h-screen bg-zinc-50 font-sans dark:bg-black">
      <Header />
      <main className="flex min-h-screen w-full md:max-w-3xl lg:max-w-5xl flex-col items-center justify-between py-32 px-16 sm:items-start transition-all transition-normal delay-75 ease-in-out">
        <Tabs />
      </main>
    </div>
  );
}
