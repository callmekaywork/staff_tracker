import React from 'react';
import { DarkmodeToggle } from '../darkmode-toggle';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cva } from 'class-variance-authority';

export default function Header() {
  return (
    <div className="flex flex-row justify-center w-full h-25 bg-[#acacb3] dark:bg-border p-2 border-b-2 dark:border-gray-800">
      <div className="flex flex-row justify-between px-10 w-full md:max-w-3xl lg:max-w-5xl ">
        <div className="h-full flex justify-center items-center ">
          <Link
            href={'/'}
            className={`${buttonVariants({ variant: 'outline' })} rounded-2xl h-12`}
          >
            Home
          </Link>
        </div>
        <nav className="flex flex-row items-center justify-center gap-5">
          <DarkmodeToggle />
          <Link href={'/literacyproject'}>Literacy Project</Link>
        </nav>
      </div>
    </div>
  );
}
