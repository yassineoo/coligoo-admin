import { forwardRef, useState } from "react";
import { Eye, EyeOff } from "lucide-react";

interface VendorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPasswordToggle?: boolean;
  error?: string;
}

export const VendorInput = forwardRef<HTMLInputElement, VendorInputProps>(
  (
    {
      label,
      showPasswordToggle,
      error,
      className = "",
      type: propType,
      ...props
    },
    ref
  ) => {
    const [visible, setVisible] = useState(false);
    const inputType = showPasswordToggle
      ? visible
        ? "text"
        : "password"
      : propType;

    return (
      <div className="flex flex-col gap-0.5 w-full">
        <label className="text-[#7C8BA0] text-xs font-normal leading-[160%] tracking-[-0.24px]">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            type={inputType}
            className={`w-full h-[46px] px-[14px] rounded-[10px] border ${
              error ? "border-red-500" : "border-[#EDF1F3]"
            } bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] outline-none focus:ring-2 focus:ring-[#FF5A01]/20 ${className}`}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              onClick={() => setVisible(!visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2"
            >
              {!visible ? (
                <Eye className="w-4 h-4 text-[#ACB5BB]" />
              ) : (
                <EyeOff className="w-4 h-4 text-[#ACB5BB]" />
              )}
            </button>
          )}
        </div>
      </div>
    );
  }
);

VendorInput.displayName = "VendorInput";
