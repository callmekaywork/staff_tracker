'use client';

import React, { useState } from 'react';
import useCheckUser from '@/hooks/useCheckUser';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';
import { Button } from '../ui/button';
import Whiteloader from '../loaders/whiteloader';
import { orpc } from '@/orpc/client';
import { motion } from 'motion/react';

export default function Userprofile() {
  const { isOnline, user, loading } = useCheckUser();
  const load = true;

  const [isForcedLoading, setIsForcedLoading] = useState(false);

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0.8, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.8, scale: 0.9 }}
        transition={{ duration: 0.3, delay: 0.2, ease: [0, 0.71, 0.2, 1.01] }}
        className="md:w-1/2"
      >
        <div className="flex h-35 items-center gap-4 border-2 w-full px-2 py-8 bg-gray-400 border-gray-600 animate-pulse ">
          <Skeleton className="h-16 w-16 rounded-full" />
          <div className="space-y-2">
            <Skeleton className="h-6 w-62.5" />
            <Skeleton className="h-6 w-50" />
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-row w-full gap-2">
      <motion.div
        initial={{ opacity: 0.8, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.8, scale: 0.9 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        className="border-2 h-35 w-full md:w-1/2 p-2"
      >
        <div className="flex flex-row gap-4">
          <div className="flex justify-center items-center rounded-full bg-slate-400 h-16 w-16">
            <Camera className="opacity-40" />
          </div>
          <div className="h-auto">
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
      </motion.div>
      <motion.div
        initial={{ opacity: 0.8, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.8, scale: 0.9 }}
        transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
        className="border-2 md:block hidden h-35 w-full md:w-1/2 p-2"
      ></motion.div>
    </div>
  );
}
