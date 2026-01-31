'use client';

import { Button } from '@/components/ui/button';
import useCheckUser from '@/hooks/useCheckUser';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';

export function Onlinetoast() {
  //   const onlineUser = useCheckUser();

  //   if (!onlineUser) {
  //     toast('Sorry seems like you are not logged in', {
  //       description: 'Features will be limited!',
  //       action: {
  //         label: 'Cancel',
  //         onClick: () => console.log('Cancelled'),
  //       },
  //     });
  //   }

  return <Toaster />;
}
