'use client';

import React, { useState } from 'react';

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
import { ArrowLeft, ArrowRight, Plus } from 'lucide-react';

export default function Reportform() {
  const [step, setStep] = useState(0);

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const form = useForm({
    resolver: zodResolver(assistanceRecordSchema),
    defaultValues: {
      institutionName: '',
      institutionType: '',
      contactPerson: '',
      emailAddress: '',
      phoneNumber: '',
      beneficiaryName: '',
      disability: false,
      geoType: 'urban',
      dateAssisted: new Date().getDate(),
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
    <div className="h-20 flex items-center w-full ">
      <Dialog>
        <DialogTrigger asChild aria-describedby={undefined}>
          <div className="w-full">
            <Button
              variant="elevated"
              className="w-full h-14 flex flex-row justify-center items-center gap-2 hover:cursor-pointer md:w-40"
            >
              <Plus /> Add Information
            </Button>
          </div>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Report</DialogTitle>
          </DialogHeader>
          <form
            onSubmit={handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-4"
          >
            {step === 0 && (
              <div className="transition-all delay-200">
                <div>
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
                          <FieldLabel htmlFor={field.name}>
                            Contact Person
                          </FieldLabel>
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
                          <FieldLabel htmlFor={field.name}>
                            Email Address
                          </FieldLabel>
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
                  </FieldGroup>
                </div>
                <div className="h-15 mt-4 flex justify-end items-center">
                  <Button
                    className="cursor-pointer h-15 w-15 flex justify-center items-center "
                    variant={'elevated'}
                    onClick={() => {
                      setStep((prev) => prev + 1);
                    }}
                  >
                    <ArrowRight size={40} />
                  </Button>
                </div>
              </div>
            )}

            {step === 1 && (
              <div className="transition-all delay-200">
                <div>
                  <FieldGroup>
                    <Controller
                      control={control}
                      name="phoneNumber"
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Contact Number
                          </FieldLabel>
                          <Input
                            {...field}
                            type="tel"
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

                    <Controller
                      control={control}
                      name="beneficiaryName"
                      render={({ field, fieldState }) => (
                        <Field>
                          <FieldLabel htmlFor={field.name}>
                            Beneficiary Name
                          </FieldLabel>
                          <Input
                            {...field}
                            id={field.name}
                            placeholder="Beneficiary Name..."
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
                      name="disability"
                      render={({ field, fieldState }) => (
                        <Field className="flex flex-row items-center justify-start w-full h-15 dark:bg-gray-900 px-2 border-2 mb-3">
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

                  <FieldGroup>
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
                  </FieldGroup>
                </div>
                <div className="h-15 mt-4 flex justify-start items-center">
                  <Button
                    className="cursor-pointer h-15 w-15 flex justify-center items-center "
                    variant={'elevated'}
                    onClick={() => {
                      setStep((prev) => prev - 1);
                    }}
                  >
                    <ArrowLeft size={40} />
                  </Button>
                </div>
              </div>
            )}

            {/* Submit */}
            <Button
              className="mt-1 h-16 cursor-pointer bg-gray-500 text-white"
              variant={'elevated'}
              type="submit"
            >
              Submit
            </Button>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
