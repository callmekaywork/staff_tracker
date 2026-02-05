'use client';

import React, { useState } from 'react';
import useCheckUser from '@/hooks/useCheckUser';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';
import { Button } from '../ui/button';
import Whiteloader from '../loaders/whiteloader';
import { orpc } from '@/orpc/client';

export default function Userprofile() {
  const { isOnline, user, loading } = useCheckUser();

  const [isForcedLoading, setIsForcedLoading] = useState(false);

  if (loading) {
    return (
      <div>
        <div className="flex items-center gap-4 border-2 w-full px-2 py-8 bg-gray-500 animate-pulse rounded-md">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-62.5" />
            <Skeleton className="h-4 w-50" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border-2 w-full p-2">
      <div className="flex flex-row gap-4">
        <div className="flex justify-center items-center rounded-full bg-slate-400 h-16 w-16">
          <Camera className="opacity-40" />
        </div>
        <div className=" h-auto">
          {user && (
            <div className="flex flex-col w-full h-16">
              <h1 className="min-h-5">
                {user.firstname}
                {user.lastname}
              </h1>
              <h4>{user.email}</h4>
            </div>
          )}
        </div>
      </div>
      {isOnline && (
        <Button
          onClick={async () => {
            if (user) {
              setIsForcedLoading(true);

              await orpc.auth.signout({ id: user.id });

              setTimeout(() => {
                setIsForcedLoading(false);
                window.location.reload();
              }, 3000);
            }
          }}
          className="cursor-pointer mt-4 w-full"
        >
          {isForcedLoading === true ? <Whiteloader /> : 'Sign Yourself Out'}
        </Button>
      )}
    </div>
  );
}
