import React from "react";
import { cn } from "@/lib/utils";
import { SelectOption } from "./select";
import ErrorMessage from "./error-message";
import "@/app/[locale]/select.css"; // Ensure to import the CSS for styling

export type MultiSelectOption = SelectOption;

type MultiSelectFieldProps = {
  label: string;
  name: string;
  id: string;
  placeholder?: string;
  options: MultiSelectOption[];
  error?: string;
  className?: string;
  value?: string[];
  onChange?: (value: string[]) => void;
} & Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onChange">;

export default function MultiSelectField({
  label,
  name,
  id,
  options,
  error,
  className,
  placeholder,
  ...props
}: MultiSelectFieldProps) {
  // Update display value when value changes

  // Close dropdown when clicking outside

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
            <div className=" flex items-center gap-2 pl-2" key={option.value}>
              <input
                type="checkbox"
                className=" accent-orange-500 peer size-4 "
                value={option.value}
                name={option.label}
                id={option.value}
              />
              <label
                htmlFor={option.value}
                className="peer-checked:text-black text-gray-500  flex gap-2 "
              >
                <span className=" font-medium  block">{option.label}</span>
              </label>
            </div>
          ))}
        </select>
      </div>

      {error && <ErrorMessage message={error} />}
    </div>
  );
}
