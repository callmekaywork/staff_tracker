import React from 'react';
import { DarkmodeToggle } from '../darkmode-toggle';
import Link from 'next/link';
import { buttonVariants } from '../ui/button';
import { cva } from 'class-variance-authority';

export default function Header() {
  return (
    <div className="flex flex-row justify-center w-full h-25 bg-[#acacb3] dark:bg-border p-2 border-b-2 dark:border-gray-800">
      <div className="flex flex-row justify-center w-full md:max-w-3xl lg:max-w-5xl gap-10">
        <div className="h-full flex justify-center items-center ">
          <Link
            href={'/'}
            className={`${buttonVariants({ variant: 'outline' })} rounded-3xl h-12`}
          >
            Home
          </Link>
        </div>
        <nav className="flex flex-row items-center justify-center ">
          <DarkmodeToggle />

          <div className="w-30 flex flex-row justify-end">
            <Link
              className={`${buttonVariants({ variant: 'elevated' })} w-23 h-12`}
              href={'/auth/login'}
            >
              Login
            </Link>
          </div>
        </nav>
      </div>
    </div>
  );
}
