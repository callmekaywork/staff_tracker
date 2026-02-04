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
import { userTaskType, WhosOnlineObjectType } from '@/types/next-auth';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { redirect } from 'next/navigation';
import Loading from '@/app/loading';
import Whiteloader from '@/components/loaders/whiteloader';

import { motion } from 'motion/react';

export default function Whosonline() {
  const [loginOpen, setLoginOpen] = useState(false);

  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);

  const [isUsersOnline, setIsUsersOnline] = useState<WhosOnlineObjectType[]>(
    []
  );

  const [isUserTask, setIsUserTask] = useState<userTaskType[]>([]);

  const { isOnline, user, loading } = useCheckUser();

  const [isEmail, setIsEmail] = useState(false);

  const [isForcedLoading, setIsForcedLoading] = useState(false);

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
      status: 'not_started',
      priority: 'low',
      userId: '',
    },
  });

  useEffect(() => {
    async function GetOnlineUser() {
      const res = await orpc.tasks.whosonline();
      setIsUsersOnline(res);

      // console.log(user?.email);
      // console.log(res);

      // if (user) {
      //   const res = await orpc.tasks.getmytask({ id: user.id });

      //   setIsUserTask(res);
      // }
    }

    // async function GetUserTask() {
    // }

    GetOnlineUser();
  }, []);

  useEffect(() => {
    async function GetUserTask() {
      if (user) {
        const res = await orpc.tasks.getmytask({ id: user.id });
        setIsUserTask(res);
      }
    }

    if (isOnline === true) {
      GetUserTask();
    }
  }, [isOnline]);

  const [showPassword, setShowPassword] = useState(false);

  const { control: loginControl, handleSubmit: loginFormSubmitHandler } =
    loginForm;
  const { control, handleSubmit: taskHandleSubmit } = taskForm;

  const loginFormSubmit = async (data: z.infer<typeof checkLoginSchema>) => {
    // console.log('Form submitted:', data);
    setIsForcedLoading(true);
    try {
      const checkEmail = await orpc.auth.login(data);

      toast.info(` successfull login`, {
        position: 'top-center',
      });

      setTimeout(() => {
        setLoginOpen(false);
        setIsForcedLoading(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.info(`${error} loggin in - Please try again`, {
        position: 'top-left',
      });
      console.log(error);
      setIsForcedLoading(false);
    }
  };

  const taskSubmit = async (data: z.infer<typeof updateTaskSchema>) => {
    // console.log('Form submitted:', data);

    try {
      if (user) {
        const checkEmail = await orpc.tasks.updatetask({
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          userId: user.id,
        });

        if (checkEmail.error === undefined) {
          toast.info(`${checkEmail.success} successfull Task Updated`, {
            position: 'top-center',
          });

          // setIsForcedLoading(true);

          setUpdateTaskOpen(false);

          setTimeout(() => {
            window.location.reload();
          }, 3000);
        } else {
          toast.info(`${checkEmail.error}`, {
            position: 'top-center',
          });
        }
      }
    } catch (error) {
      toast.info(`${error} Something went wrong`, {
        position: 'top-left',
      });
      console.log(error);
    }
  };

  if (loading) {
    return (
      <motion.div
        initial={{ opacity: 0.5, scale: 0.6 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full flex justify-center items-center"
      >
        <Loading />
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
      className="w-full"
    >
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
              if (user) {
                setIsForcedLoading(true);

                await orpc.auth.signout({ id: user.id });

                setTimeout(() => {
                  setLoginOpen(false);
                  setIsForcedLoading(false);
                  window.location.reload();
                }, 3000);
              }
            }}
            className="cursor-pointer"
          >
            {isForcedLoading === true ? <Whiteloader /> : 'Sign Yourself Out'}
          </Button>
        )}

        <div className="min-h-20 dark:bg-gray-800 border-2">
          {!isOnline ? (
            <div className="w-full flex flex-col min-h-30 justify-center items-center gap-2">
              <h1>No User is Online</h1>

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
                            {isForcedLoading === true ? (
                              <Whiteloader />
                            ) : (
                              'Check my email'
                            )}
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
                <Dialog open={updateTaskOpen} onOpenChange={setUpdateTaskOpen}>
                  <DialogTrigger
                    className={`${buttonVariants({ variant: 'elevated' })} m-2 w-50 cursor-pointer`}
                  >
                    Update my task
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>What are you busy with today</DialogTitle>
                      <DialogDescription>Updating my task</DialogDescription>
                    </DialogHeader>
                    <div>
                      <form
                        onSubmit={taskHandleSubmit(taskSubmit)}
                        className="flex flex-col gap-5"
                      >
                        <FieldGroup>
                          <Controller
                            control={control}
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
                            control={control}
                            name="description"
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel htmlFor={field.name}>
                                  Description{' '}
                                  <span className="text-amber-700">
                                    (optional)
                                  </span>
                                  :
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
                            control={control}
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

                          <Controller
                            control={control}
                            name="priority"
                            render={({ field, fieldState }) => (
                              <Field>
                                <FieldLabel>Priority: </FieldLabel>

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
                                    <SelectItem className="h-14" value="low">
                                      Priority Low
                                    </SelectItem>
                                    <SelectItem className="h-14" value="medium">
                                      Priority Medium
                                    </SelectItem>
                                    <SelectItem className="h-14" value="high">
                                      Priority High
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
                          {isForcedLoading === true ? (
                            <Whiteloader />
                          ) : (
                            'Update my task'
                          )}
                        </Button>
                      </form>
                    </div>
                  </DialogContent>
                </Dialog>

                {isUserTask.length > 0 && (
                  <div>
                    {isUserTask[0].status === 'not_started' ? (
                      <div>
                        <Button
                          variant={'elevated'}
                          className="h-14 m-2  w-50 bg-green-700 text-white cursor-pointer"
                          onClick={async () => {
                            if (user) {
                              const updateTask = await orpc.tasks.startmytask({
                                id: user.id,
                                taskId: isUserTask[0].id,
                              });

                              toast.info(
                                `${updateTask?.success} | successfully `,
                                {
                                  position: 'top-center',
                                }
                              );

                              // setIsForcedLoading(true);

                              setTimeout(() => {
                                window.location.reload();
                                // setIsForcedLoading(false);
                              }, 3000);

                              // window.location.reload();
                            }
                          }}
                        >
                          Iam starting my task
                        </Button>
                      </div>
                    ) : isUserTask[0].status === 'in_progress' ? (
                      <div>
                        <Button
                          variant={'elevated'}
                          className="h-14 m-2 w-50 bg-red-700 text-white cursor-pointer"
                          onClick={async () => {
                            if (user) {
                              const updateTask = await orpc.tasks.endmytask({
                                id: user.id,
                                taskId: isUserTask[0].id,
                              });

                              toast.info(
                                `${updateTask?.success} | successfully `,
                                {
                                  position: 'top-center',
                                }
                              );

                              setTimeout(() => {
                                window.location.reload();
                              }, 3000);

                              // window.location.reload();
                            }
                          }}
                        >
                          Iam done with my Task
                        </Button>
                      </div>
                    ) : (
                      <div className="m-2">You have no running task</div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        <div className="min-h-20 max-h-150 dark:bg-gray-800 border-2 ">
          <div className="grid grid-cols-2 md:grid-cols-5 grid-rows-auto">
            {isUsersOnline ? (
              isUsersOnline.map((ts, idx) => (
                <div
                  key={idx}
                  className="relative m-2 border-2 flex flex-col items-center justify-center gap-2 w-36 sm:w-40 md:w-50 h-42 rounded-[10px] shadow-sm"
                >
                  {ts.isOnline ? (
                    <div className="absolute top-2 right-2 flex flex-row-reverse gap-2 items-center justify-center">
                      <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                      <span className="text-[12px]">Online</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 left-2 flex flex-row gap-2 items-center justify-center">
                      <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                      Offline
                    </div>
                  )}

                  <div className="flex flex-col justify-center items-center bg-color-mercury-500 ">
                    <div className="w-full px-2">
                      <h1 className="font-semibold">{ts.firstname}</h1>
                    </div>
                    <div className="flex gap-2 flex-col bg-gray-300 dark:bg-slate-800 border-2 rounded-[10px] p-2 py-3">
                      <Label className="text-2xl">Task:</Label>
                      {ts.task_title != '' ? (
                        <div className="min-h-15">
                          {ts.task_title}
                          <Label>status: {ts.task_status}</Label>
                        </div>
                      ) : (
                        <>
                          <label>Not Doing anything!</label>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <>No One is Online</>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}
