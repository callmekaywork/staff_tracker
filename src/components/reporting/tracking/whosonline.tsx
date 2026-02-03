'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useCheckUser from '@/hooks/useCheckUser';
import Link from 'next/link';
import React, { useActionState, useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkLoginSchema } from '@/db/validators';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button } from '@/components/ui/button';
import { orpc } from '@/orpc/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { signIn } from '@/auth';
import { loginAction } from './loginaction';

export default function Whosonline() {
  const [state, formAction, isPending] = useActionState(loginAction, null);

  const { isOnline, user } = useCheckUser();

  const [isEmail, setIsEmail] = useState(false);

  const form = useForm({
    resolver: zodResolver(checkLoginSchema),
    defaultValues: {
      email: '',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof checkLoginSchema>) => {
    // console.log('Form submitted:', data);
    const checkEmail = await orpc.auth.login(data);
    // try {
    //   const res = await signIn('credentials', {
    //     redirect: false,
    //     email: data.email,
    //     password: data.password,
    //     // callbackUrl: "/dashboard",
    //   });
    //   // if (res?.error) {

    //   //   return { error: res.error };
    //   // }
    //   toast.info(` successfull login`, {
    //     position: 'top-left',
    //   });
    //   // return { success: true };
    // } catch (err) {
    //   toast.info(`Error loggin in - Please try again`, {
    //     position: 'top-left',
    //   });
    //   return { error: `Unexpected error during sign-in.: ${err}` };
    // }
  };

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

        <Toaster />

        <div className="min-h-20 dark:bg-gray-800 border-2">
          {!isOnline ? (
            <div className="w-full flex flex-col min-h-30 justify-center items-center gap-2">
              <h1>No User is Online</h1>
              {/* <Link
                href={'/auth/staff/register'}
                className="text-3xl font-bold underline text-purple-600"
              >
                Check your email?
              </Link> */}

              <Dialog>
                <DialogTrigger className="text-4xl">
                  Start my work day (Login)
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Are you in the database?</DialogTitle>
                    <DialogDescription>
                      This is a login dialog
                    </DialogDescription>
                    <DialogContent>
                      <div>
                        {/* {isEmail && (
                          <Alert>
                            <CheckCircle2Icon />
                            <AlertTitle>Payment successful</AlertTitle>
                            <AlertDescription>
                              Your payment of $29.99 has been processed. A
                              receipt has been sent to your email address.
                            </AlertDescription>
                          </Alert>
                        )} */}
                        <form
                          // onSubmit={handleSubmit(async (data) => {
                          //   // console.log(data);

                          //   const res = await signIn('credentials', {
                          //     redirect: false,
                          //     email: data.email,
                          //     password: data.password,
                          //   });
                          // })}
                          action={formAction}
                          className="flex flex-col w-full space-y-4"
                        >
                          <FieldGroup>
                            <Controller
                              control={control}
                              name="email"
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel htmlFor={field.name}>
                                    Email:
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id={field.name}
                                    type="email"
                                    placeholder="Enter your company email...."
                                    aria-invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />

                            <Controller
                              control={control}
                              name="password"
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel htmlFor={field.name}>
                                    Email:
                                  </FieldLabel>
                                  <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    placeholder="Enter your secret password...."
                                    aria-invalid={fieldState.invalid}
                                  />
                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          {/* Submit */}
                          <Button
                            className="mt-1 h-16 cursor-pointer bg-gray-500 text-white"
                            variant={'elevated'}
                            type="submit"
                          >
                            Check my email
                          </Button>
                        </form>
                      </div>
                    </DialogContent>
                  </DialogHeader>
                </DialogContent>
              </Dialog>
            </div>
          ) : (
            <div>
              <h2>{user?.email}</h2>
            </div>
          )}
        </div>
        <div className="min-h-20 dark:bg-gray-800 border-2"></div>
      </div>
    </div>
  );
}
