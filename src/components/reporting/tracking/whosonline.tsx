'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useCheckUser from '@/hooks/useCheckUser';
import Link from 'next/link';
import React from 'react';

export default function Whosonline() {
  const userOnline = useCheckUser();

  return (
    <div className="w-full">
      <div className="flex flex-col gap-2 border-2 p-2 ">
        <div className="flex flex-row gap-4 items-center h-16">
          <Avatar>
            <AvatarImage
              src="rick-sanchez-face-free-vector.jpg"
              alt="@shadcn"
              className="grayscale"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
          <h1>Who is online?</h1>
        </div>

        <div className="min-h-20 dark:bg-gray-800 border-2">
          {!userOnline ? (
            <div className="w-full flex flex-col min-h-30 justify-center items-center gap-2">
              <h1>No User is Online</h1>
              <Link
                href={'/auth/staff/register'}
                className="text-3xl font-bold underline text-purple-600"
              >
                Check your email?
              </Link>
            </div>
          ) : (
            <div>
              <h2>Some online user</h2>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
