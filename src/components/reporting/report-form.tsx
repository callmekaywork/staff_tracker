'use client';

import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assistanceRecordSchema } from '@/db/validators';

import { orpc } from '@/orpc/client';

import z from 'zod';

import { Input } from '../ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';

import { Button } from '../ui/button';
import { Checkbox } from '../ui/checkbox';
import { Field, FieldError, FieldGroup, FieldLabel } from '../ui/field';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Plus } from 'lucide-react';

export default function Reportform() {
  const form = useForm({
    resolver: zodResolver(assistanceRecordSchema),
    defaultValues: {
      institutionName: '',
      institutionType: '',
      contactPerson: '',
      emailAddress: '',
      phoneNumber: '',
      disability: false,
      geoType: 'urban',
    },
  });

  const { control, handleSubmit } = form;

  const onSubmit = async (data: z.infer<typeof assistanceRecordSchema>) => {
    // console.log('Form submitted:', data);

    try {
      console.log(data);
      await orpc.reports.create(data);
    } finally {
    }
  };

  return (
    <div className="h-20 ">
      <Dialog>
        <DialogTrigger asChild aria-describedby={undefined}>
          <Button
            variant="ghost"
            className="m-2 flex flex-row justify-center items-center gap-2 hover:cursor-pointer"
          >
            <Plus /> Add Information
          </Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Report</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-4"
          >
            <FieldGroup>
              <Controller
                control={control}
                name="institutionName"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Institution Name
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Enter institution name"
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
                name="institutionType"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>
                      Institution Type
                    </FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="e.g. School, NGO"
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
                name="contactPerson"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Contact Person</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="Full name"
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
                name="emailAddress"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Email Address</FieldLabel>
                    <Input
                      {...field}
                      id={field.name}
                      placeholder="example@email.com"
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
                name="phoneNumber"
                render={({ field, fieldState }) => (
                  <Field>
                    <FieldLabel htmlFor={field.name}>Contact Number</FieldLabel>
                    <Input
                      {...field}
                      type="digit"
                      id={field.name}
                      placeholder="+27 82 123 4567"
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
                name="disability"
                render={({ field, fieldState }) => (
                  <Field className="flex flex-row items-center justify-between space-x-1 w-full ">
                    <FieldLabel htmlFor={field.name}>
                      Disability Type
                    </FieldLabel>

                    <div>
                      <Checkbox
                        checked={field.value}
                        onCheckedChange={field.onChange}
                        className="size-4"
                      />
                    </div>

                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </FieldGroup>

            <Controller
              control={control}
              name="geoType"
              render={({ field, fieldState }) => (
                <Field>
                  <FieldLabel>Geo Type</FieldLabel>

                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select geo type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="urban">Urban</SelectItem>
                      <SelectItem value="rural">Rural</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            {/* Submit */}
            <Button className="mt-5" type="submit">
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
