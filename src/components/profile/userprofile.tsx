'use client';

import React, { useState } from 'react';
import useCheckUser from '@/hooks/useCheckUser';
import { Skeleton } from '@/components/ui/skeleton';
import { Camera } from 'lucide-react';
import { Button, buttonVariants } from '../ui/button';
import Whiteloader from '../loaders/whiteloader';
import { orpc } from '@/orpc/client';
import { motion } from 'motion/react';

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from '@/components/ui/field';

import { Input } from '@/components/ui/input';

import z from 'zod';
import { toast } from 'sonner';
import { Toaster } from '@/components/ui/sonner';
import { checkLoginSchema, updateTaskSchema } from '@/db/validators';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

export default function Userprofile() {
  const { isOnline, user, loading } = useCheckUser();
  const [loginOpen, setLoginOpen] = useState(false);
  const [updateTaskOpen, setUpdateTaskOpen] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const load = true;

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

          setIsForcedLoading(true);

          setUpdateTaskOpen(false);

          setTimeout(() => {
            setIsForcedLoading(false);
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
      <div className="w-full flex flex-col gap-3 md:flex-row">
        <motion.div
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0.9 }}
          transition={{ duration: 0.3 }}
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
        <motion.div
          initial={{ opacity: 0.8, scale: 1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="md:w-1/2"
        >
          <div className="flex h-35 items-center gap-4 border-2 w-full px-2 py-8 bg-gray-400 border-gray-600 animate-pulse ">
            <div className="space-y-2">
              <Skeleton className="h-6 w-62.5" />
              <Skeleton className="h-6 w-50" />
            </div>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="flex flex-col md:flex-row w-full gap-2">
      <motion.div
        initial={{ opacity: 0.8, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0.8, scale: 0.9 }}
        transition={{ duration: 0.3, delay: 0.2 }}
        className="border-2 h-35 w-full md:w-1/2 p-2"
      >
        {isOnline ? (
          <div className="flex flex-col ">
            <div className="flex flex-row gap-2">
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
          </div>
        ) : (
          <div className="flex gap-2 flex-col">
            <div className="min-h-20 dark:bg-gray-800 ">
              <div className="w-full flex flex-col min-h-30 justify-center items-center gap-2">
                <h1>No User is Online</h1>

                <Dialog open={loginOpen} onOpenChange={setLoginOpen}>
                  <DialogTrigger className="text-3xl cursor-pointer">
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
                                        type={
                                          showPassword ? 'text' : 'password'
                                        }
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
            </div>
          </div>
        )}
      </motion.div>

      {/* hidden div */}
      {isOnline && (
        <motion.div
          initial={{ opacity: 0.8, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0.8, scale: 0.9 }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0, 0.71, 0.2, 1.01] }}
          className="border-2 flex justify-center items-center md:items-start h-35 w-full md:w-1/2 p-2"
        >
          <Dialog open={updateTaskOpen} onOpenChange={setUpdateTaskOpen}>
            <DialogTrigger
              className={`${buttonVariants({ variant: 'elevated' })}  cursor-pointer w-full`}
            >
              Create new task
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
                          <FieldLabel htmlFor={field.name}>Title:</FieldLabel>
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
                            <span className="text-amber-700">(optional)</span>:
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
                              <SelectItem className="h-14" value="not_started">
                                Not Started
                              </SelectItem>
                              <SelectItem className="h-14" value="in_progress">
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
        </motion.div>
      )}
    </div>
  );
}
