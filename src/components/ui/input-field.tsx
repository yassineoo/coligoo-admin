import { cn } from "@/lib/utils";
import ErrorMessage from "./error-message";

type InputFieldProps = {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function InputField({
  label,
  name,
  id,
  type = "text",
  placeholder,
  error,
  className,
  ...props
}: InputFieldProps) {
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex flex-col space-y-2">
        <label className=" text-gray-500 font-medium" htmlFor={id}>
          {label}
        </label>
        <input
          className=" focus:outline-none  bg-white shadow-md rounded-[10px] p-3  placeholder:text-gray-300"
          type={type}
          name={name}
          id={id}
          placeholder={placeholder}
          {...props}
        />
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
