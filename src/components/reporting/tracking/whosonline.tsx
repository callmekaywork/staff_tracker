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
import { redirect, useRouter } from 'next/navigation';
import Loading from '@/app/loading';
import Whiteloader from '@/components/loaders/whiteloader';

import { motion } from 'motion/react';

export default function Whosonline() {
  const [loginOpen, setLoginOpen] = useState(false);

  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);

  const [isUsersOnline, setIsUsersOnline] = useState<WhosOnlineObjectType[]>(
    []
  );

  const router = useRouter();

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
      <Toaster />

      <div className={`${!isOnline && 'hidden'} my-5 flex gap-2 flex-col`}>
        <div className="min-h-20 dark:bg-gray-800 border-2">
          {isOnline && (
            <div>
              <div className="flex w-full px-2 flex-col py-2">
                {isUserTask.length > 0 && (
                  <div>
                    {isUserTask[0].status === 'not_started' ? (
                      <div>
                        <Button
                          variant={'elevated'}
                          className="h-14 m-2  w-full bg-green-700 text-white cursor-pointer"
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
                          className="h-14 mt-2 w-full bg-red-700 text-white cursor-pointer"
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
                      <div className="mt-2 w-full flex justify-center items-center h-16">
                        You have no running task
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-2 p-2 my-4">
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

        <div className="min-h-20 max-h-250 overflow-scroll dark:bg-gray-800 border-2 ">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-2 grid-rows-auto">
            {isUsersOnline ? (
              isUsersOnline.map((ts, idx) => (
                <div
                  key={idx}
                  className="relative m-2 border-2 flex flex-row items-centser justify-start gap-2 px-3 sm:w-full md:w-full h-42 rounded-none shadow-md"
                >
                  {ts.isOnline ? (
                    <div className="absolute top-2 right-2 flex flex-row-reverse gap-2 items-center justify-center">
                      <div className="h-4 w-4 bg-green-600 rounded-full"></div>
                      <span className="text-[12px]">Online</span>
                    </div>
                  ) : (
                    <div className="absolute top-2 right-2 flex flex-row-reverse gap-2 items-center justify-center">
                      <div className="h-4 w-4 bg-red-600 rounded-full"></div>
                      <span className="text-[12px]">Offline</span>
                    </div>
                  )}
                  <div className="flex flex-col gap-2 justify-center items-start bg-color-mercury-500 py-4">
                    <h1 className="font-semibold text-xl">{ts.firstname}</h1>
                    <Label className="text-md">Task:</Label>
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
