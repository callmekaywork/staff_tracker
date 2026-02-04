'use client';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import useCheckUser from '@/hooks/useCheckUser';
import Link from 'next/link';
import React, { useActionState, useEffect, useState } from 'react';
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { zodResolver } from '@hookform/resolvers/zod';
import { checkLoginSchema, updateTaskSchema } from '@/db/validators';
import { Controller, useForm } from 'react-hook-form';
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { Button, buttonVariants } from '@/components/ui/button';
import { orpc } from '@/orpc/client';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { CheckCircle2Icon } from 'lucide-react';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { signIn, signOut } from '@/auth';
import { loginAction } from './loginaction';
import { refresh } from 'next/cache';
import { WhosOnlineObjectType } from '@/types/next-auth';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

export default function Whosonline() {
  const [loginOpen, setLoginOpen] = useState(false);
  const [isUsersOnline, setIsUsersOnline] = useState<WhosOnlineObjectType[]>(
    []
  );

  const { isOnline, user } = useCheckUser();

  const [isEmail, setIsEmail] = useState(false);

  const loginForm = useForm({
    resolver: zodResolver(checkLoginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const taskForm = useForm({
    resolver: zodResolver(updateTaskSchema),
    defaultValues: {
      title: '',
      description: '',
    },
  });

  useEffect(() => {
    async function GetOnlineUser() {
      const res = await orpc.tasks.whosonline();
      setIsUsersOnline(res);
    }

    GetOnlineUser();
  }, []);

  const [showPassword, setShowPassword] = useState(false);

  const { control: loginControl, handleSubmit: loginFormSubmitHandler } =
    loginForm;
  const { control: taskControl, handleSubmit: taskHandlerSubmit } = taskForm;

  const loginFormSubmit = async (data: z.infer<typeof checkLoginSchema>) => {
    // console.log('Form submitted:', data);
    try {
      const checkEmail = await orpc.auth.login(data);

      toast.info(` successfull login`, {
        position: 'top-left',
      });

      setLoginOpen(false);
    } catch (error) {
      toast.info(`${error} loggin in - Please try again`, {
        position: 'top-left',
      });
      console.log(error);
    }
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

        {isOnline && (
          <Button
            onClick={async () => {
              await orpc.auth.signout();
            }}
          >
            Sign us Out
          </Button>
        )}

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

              <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                <DialogTrigger className="text-4xl cursor-pointer">
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
                        <form
                          onSubmit={loginFormSubmitHandler(loginFormSubmit)}
                          // action={formAction}
                          className="flex flex-col w-full space-y-4"
                        >
                          <FieldGroup>
                            <Controller
                              control={loginControl}
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
                              control={loginControl}
                              name="password"
                              render={({ field, fieldState }) => (
                                <Field>
                                  <FieldLabel htmlFor={field.name}>
                                    Password:
                                  </FieldLabel>
                                  {/* <Input
                                    {...field}
                                    id={field.name}
                                    type="password"
                                    placeholder="Enter your secret password...."
                                    aria-invalid={fieldState.invalid}
                                  /> */}
                                  <div className="relative">
                                    <Input
                                      {...field}
                                      id={field.name}
                                      type={showPassword ? 'text' : 'password'}
                                      placeholder="Enter your secret password..."
                                      aria-invalid={fieldState.invalid}
                                    />
                                    <Button
                                      type="button"
                                      variant="ghost"
                                      size="sm"
                                      className="absolute right-2 top-2"
                                      onClick={() =>
                                        setShowPassword(!showPassword)
                                      }
                                    >
                                      {showPassword ? 'Hide' : 'Show'}{' '}
                                    </Button>
                                  </div>

                                  {fieldState.invalid && (
                                    <FieldError errors={[fieldState.error]} />
                                  )}
                                </Field>
                              )}
                            />
                          </FieldGroup>

                          {/* Submit */}
                          {/* <DialogClose></DialogClose> */}
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
              <h2 className="p-2">{user?.email}</h2>
              <div>
                <Dialog>
                  <DialogTrigger
                    className={`${buttonVariants({ variant: 'elevated' })} m-2 w-50`}
                  >
                    Update my task
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>What are you busy with today</DialogTitle>
                      <DialogDescription>Updating my task</DialogDescription>
                    </DialogHeader>
                    <div>
                      <form className="flex flex-col gap-5">
                        <FieldGroup>
                          <Controller
                            control={taskControl}
                            name="title"
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel htmlFor={field.name}>
                                  Title:
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={field.name}
                                  type="text"
                                  placeholder="Enter your task title...."
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                          <Controller
                            control={taskControl}
                            name="description"
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel htmlFor={field.name}>
                                  Description:
                                </FieldLabel>
                                <Input
                                  {...field}
                                  id={field.name}
                                  type="text"
                                  placeholder="Enter your task description...."
                                  aria-invalid={fieldState.invalid}
                                />
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </FieldGroup>
                        <FieldGroup>
                          <Controller
                            control={taskControl}
                            name="status"
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel>Status: </FieldLabel>

                                <Select
                                  onValueChange={field.onChange}
                                  defaultValue={field.value}
                                >
                                  <SelectTrigger className="h-14">
                                    <SelectValue
                                      className="h-14"
                                      placeholder="Select Status Type"
                                    />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem
                                      className="h-14"
                                      value="not_started"
                                    >
                                      Not Started
                                    </SelectItem>
                                    <SelectItem
                                      className="h-14"
                                      value="in_progress"
                                    >
                                      In Progress
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                                {fieldState.invalid && (
                                  <FieldError errors={[fieldState.error]} />
                                )}
                              </Field>
                            )}
                          />
                        </FieldGroup>
                        <Button
                          className="mt-1 h-16 cursor-pointer bg-gray-500 text-white w-full"
                          variant={'elevated'}
                          type="submit"
                        >
                          Update my task
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          )}
        </div>
        <div className="min-h-20 dark:bg-gray-800 border-2">
          <div className="grid grid-rows-auto">
            {isUsersOnline &&
              isUsersOnline.map((ts, idx) => (
                <div
                  key={idx}
                  className=" m-2 border-2 flex flex-col items-center justify-center gap-2 w-50 h-60"
                >
                  <Label className="w-full px-5">{ts.firstname}</Label>
                  <Label className="text-[11px]">{ts.email}</Label>
                  <div>
                    <div className="flex gap-2 flex-col">
                      <Label>Task:</Label>
                      {ts.task_title != '' ? (
                        <>Not Doing anything!</>
                      ) : (
                        <>{ts.task_title}</>
                      )}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
}
