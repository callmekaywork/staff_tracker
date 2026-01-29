'use client';

import React from 'react';

import { Controller, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { assistanceRecordSchema } from '@/db/validators';
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
import { Field, FieldError, FieldLabel } from '../ui/field';

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

  const onSubmit = (data: z.infer<typeof assistanceRecordSchema>) => {
    console.log('Form submitted:', data);
  };

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Controller
          control={control}
          name="institutionName"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Institution Name</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="Enter institution name"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="institutionType"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Institution Type</FieldLabel>
              <Input
                {...field}
                id={field.name}
                placeholder="e.g. School, NGO"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                type="number"
                id={field.name}
                placeholder="+27 82 123 4567"
                aria-invalid={fieldState.invalid}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="disability"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel htmlFor={field.name}>Disability Type</FieldLabel>

              <Checkbox
                checked={field.value}
                onCheckedChange={field.onChange}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        <Controller
          control={control}
          name="geoType"
          render={({ field, fieldState }) => (
            <Field>
              <FieldLabel>Geo Type</FieldLabel>

              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <SelectTrigger>
                  <SelectValue placeholder="Select geo type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="urban">Urban</SelectItem>
                  <SelectItem value="rural">Rural</SelectItem>
                </SelectContent>
              </Select>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />

        {/* Submit */}
        <Button type="submit">Submit</Button>
      </form>
    </div>
  );
}
