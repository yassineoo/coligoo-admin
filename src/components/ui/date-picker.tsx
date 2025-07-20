import React from "react";
import { cn } from "../../lib/utils";
import ErrorMessage from "./error-message";

interface DatePickerProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  error?: string;
  className?: string;
}

export default function DatePicker({
  label,
  error,
  className,
  ...props
}: DatePickerProps) {
  return (
    <div className={cn("space-y-2", className)}>
      <label className="block  font-medium text-gray-500">{label}</label>
      <div className="relative">
        <input
          type="date"
          className="w-full px-3 py-3 bg-white shadow-md focus:outline-none  rounded-lg transition-colors"
          {...props}
        />
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
