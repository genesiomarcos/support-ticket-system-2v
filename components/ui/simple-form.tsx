"use client"

import type React from "react"
import { FormProvider, type UseFormReturn, type FieldValues } from "react-hook-form"

interface FormProps<T extends FieldValues> {
  form: UseFormReturn<T>
  onSubmit: (data: T) => void
  children: React.ReactNode
  className?: string
}

export function SimpleForm<T extends FieldValues>({ form, onSubmit, children, className }: FormProps<T>) {
  return (
    <FormProvider {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className={className}>
        {children}
      </form>
    </FormProvider>
  )
}

interface FormFieldProps {
  name: string
  label: string
  type?: string
  placeholder?: string
  required?: boolean
  children?: React.ReactNode
}

export function SimpleFormField({ name, label, type = "text", placeholder, required, children }: FormFieldProps) {
  return (
    <div className="space-y-2">
      <label htmlFor={name} className="text-sm font-medium">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      {children || (
        <input
          id={name}
          name={name}
          type={type}
          placeholder={placeholder}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
          required={required}
        />
      )}
    </div>
  )
}
