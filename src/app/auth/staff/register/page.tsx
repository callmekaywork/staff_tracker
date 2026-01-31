'use client';

import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import React, { useActionState, useContext } from 'react';
import { registerAction } from './registeraction';
import { Separator } from '@/components/ui/separator';
import { useSession } from 'next-auth/react';
import Loading from '@/app/loading';
import Inloader from '@/components/loaders/inloader';
import Header from '@/components/header/head';
import Link from 'next/link';

export default function Register() {
  const [state, formAction, isPending] = useActionState(registerAction, null);

  // const { status } = useSession();

  if (state && 'success' in state && state.success) {
    window.location.href = '/';
  }

  // if (status == 'loading') {
  //   return (
  //     <div className="h-[70vh]">
  //       <Loading />
  //     </div>
  //   );
  // }

  return (
    <div>
      <Header />

      <div className="flex h-[70vh] w-screen justify-center items-center">
        <div className="flex flex-col justify-center items-center  py-10 h-auto sm:w-100 w-95  bg-[#ffffff] dark:bg-[#333333] shadow-sm inset-shadow-sm inset-shadow-black-900 border-2">
          <Label className="text-4xl font-bold">Check Email</Label>

          <form action={formAction} className="flex flex-col gap-2 ">
            {/* <div>{session?.user.email}</div> */}
            <Label className="flex flex-row gap-2 justify-center h-[30px] m-2 text-black dark:text-[#ffffff]">
              Email
            </Label>
            <Input
              name="email"
              type="email"
              placeholder="enter your email"
              className="w-82.5 h-14 bg-blue-50 inset-shadow-sm inset-shadow-black-900 dark:text-[#000000]"
            />

            {/* <Label className="flex flex-row gap-2 justify-center h-[30px] m-2 text-black dark:text-[#ffffff]">
               Password
             </Label>
             <Input
               name="password"
               type="password"
               placeholder="enter your password"
               className="w-62.5 h-14 bg-blue-50  inset-shadow-sm inset-shadow-black-900 dark:text-[#000000]"
             /> */}

            <div className="flex flex-col gap-6 justify-center mt-2">
              <Button
                type="submit"
                variant={'elevated'}
                className="w-82.5 flex justify-center items-center text-white dark:text-[#ffffff] h-15 cursor-pointer bg-[#059e00]"
              >
                {isPending ? (
                  <div className="flex flex-row gap-2 p-5 text-white">
                    <Inloader />
                    loading...
                  </div>
                ) : (
                  'Check my email'
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
