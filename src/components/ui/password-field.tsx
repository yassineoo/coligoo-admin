import { useState } from "react";
import ErrorMessage from "./error-message";
import { Eye, EyeOff } from "lucide-react";
import { cn } from "@/lib/utils";

type PasswordFieldProps = {
  label: string;
  name: string;
  id: string;
  type?: string;
  placeholder?: string;
  error?: string;
  className?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export default function PasswordField({
  label,
  name,
  id,
  placeholder,
  error,
  className,
  ...props
}: PasswordFieldProps) {
  const [type, setType] = useState("password");
  return (
    <div className={cn("flex flex-col space-y-1", className)}>
      <div className="flex flex-col space-y-2">
        <label className=" text-gray-500 font-medium" htmlFor={id}>
          {label}
        </label>
        <div className=" flex  shadow-md rounded-[10px] overflow-hidden  placeholder:text-gray-300">
          <input
            className=" w-full p-3 placeholder:text-gray-300 focus:outline-none bg-white"
            type={type}
            name={name}
            id={id}
            placeholder={placeholder}
            {...props}
          />
          <button
            type="button"
            className="p-3 bg-white focus:outline-none"
            onClick={() => setType(type === "password" ? "text" : "password")}
          >
            {type === "password" && <EyeOff />}
            {type == "text" && <Eye />}
          </button>
        </div>
      </div>
      {error && <ErrorMessage message={error} />}
    </div>
  );
}
