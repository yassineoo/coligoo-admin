import React from "react";
import { cn } from "../../lib/utils";
import "@/app/[locale]/select.css"; // Ensure to import the CSS for styling
import ErrorMessage from "./error-message";

export interface SelectOption {
  value: string;
  label: string;
}

type SelectProps = {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  options: SelectOption[];
  error?: string;
  className?: string;
} & React.SelectHTMLAttributes<HTMLSelectElement>;

export default function Select({
  label,
  name,
  id,
  placeholder,
  options,
  error,
  className,
  ...props
}: SelectProps) {
  return (
    <div className={cn("flex flex-col gap-1 w-full", className)}>
      {/* Label */}
      <div className="inline-flex items-center justify-center rounded-full  px-3 py-[2px]  w-fit">
        <label className="text-gray-500 font-medium" htmlFor={id}>
          {label}
        </label>
      </div>

      {/* Select */}
      <div className="relative">
        <select className="select" name={name} id={id} {...props}>
          <button className=" rounded-2xl bg-white">
            <selectedcontent></selectedcontent>
          </button>
          {placeholder && (
            <option className="text-gray-500" value="">
              {placeholder}
            </option>
          )}
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
