'use client';

import { useSession } from 'next-auth/react';

import type { User } from 'next-auth';

type UserStatus = {
  isOnline: boolean;
  user: User | null;
  loading: boolean;
};

export default function useCheckUser(): UserStatus {
  const { data: session, status } = useSession();

  if (status === 'unauthenticated') {
    return { isOnline: false, user: null, loading: false };
  }

  if (status === 'authenticated') {
    return { isOnline: true, user: session?.user ?? null, loading: false };
  }

  if (status === 'loading') {
    return { isOnline: false, user: null, loading: true };
  }

  // covers "loading" or any other status
  return { isOnline: false, user: null, loading: false };
}
