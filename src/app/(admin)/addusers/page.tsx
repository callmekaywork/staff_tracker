'use client';

import React, { useState } from 'react';
import { orpc } from '@/orpc/client';

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
import { createUserSchema } from '@/db/validators';
import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import Whiteloader from '@/components/loaders/whiteloader';

export default function Adduser() {
  const [isForcedLoading, setIsForcedLoading] = useState(false);
  const createForm = useForm({
    resolver: zodResolver(createUserSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
    },
  });

  const { control: createControl, handleSubmit: createFormSubmitHandler } =
    createForm;

  const createFormSubmit = async (data: z.infer<typeof createUserSchema>) => {
    // console.log('Form submitted:', data);
    setIsForcedLoading(true);
    try {
      const checkEmail = await orpc.auth.create(data);

      toast.info(` successfull creation`, {
        position: 'top-center',
      });

      setTimeout(() => {
        setIsForcedLoading(false);
        window.location.reload();
      }, 3000);
    } catch (error) {
      toast.info(`${error} | Please try again`, {
        position: 'top-left',
      });
      setIsForcedLoading(false);
    }
  };

  return (
    <div className="w-full flex-col flex justify-center items-center p-5">
      <Toaster />
      <h1 className="text-4xl my-10">Create new User</h1>
      <div className="w-full md:w-150">
        <form
          onSubmit={createFormSubmitHandler(createFormSubmit)}
          // action={formAction}
          className="flex flex-col w-full space-y-4"
        >
          <FieldGroup>
            <Controller
              control={createControl}
              name="firstName"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>First Name:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Enter First Name...."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={createControl}
              name="lastName"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Last Name:</FieldLabel>
                  <Input
                    {...field}
                    id={field.name}
                    type="text"
                    placeholder="Enter Last Name...."
                    aria-invalid={fieldState.invalid}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              control={createControl}
              name="email"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Email:</FieldLabel>
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
              control={createControl}
              name="password"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel htmlFor={field.name}>Password:</FieldLabel>

                  <div className="relative">
                    <Input
                      {...field}
                      id={field.name}
                      type={'text'}
                      placeholder="Enter your secret password..."
                      aria-invalid={fieldState.invalid}
                    />
                  </div>

                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              control={createControl}
              name="role"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>User Role: </FieldLabel>

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
                      <SelectItem className="h-14" value="admin">
                        Admin
                      </SelectItem>
                      <SelectItem className="h-14" value="staff">
                        Staff
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

          {/* Submit */}
          {/* <DialogClose></DialogClose> */}
          <Button
            className="mt-1 h-16 cursor-pointer bg-gray-500 text-white"
            variant={'elevated'}
            type="submit"
          >
            {isForcedLoading === true ? <Whiteloader /> : 'Create New User'}
          </Button>
        </form>
      </div>
    </div>
  );
}
