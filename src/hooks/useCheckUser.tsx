'use client';

import { useSession } from 'next-auth/react';
import React from 'react';
import { toast } from 'sonner';

export default function useCheckUser() {
  const { status } = useSession();

  if (status === 'unauthenticated') {
    return false;
  }
}
