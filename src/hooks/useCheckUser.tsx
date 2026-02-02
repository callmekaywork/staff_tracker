'use client';

import { useSession } from 'next-auth/react';

import type { User } from 'next-auth';

type UserStatus = {
  isOnline: boolean;
  user: User | null;
};

export default function useCheckUser(): UserStatus {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return { isOnline: false, user: null };
  }

  if (status === 'authenticated') {
    return { isOnline: true, user: session?.user ?? null };
  }

  // covers "loading" or any other status
  return { isOnline: false, user: null };
}
