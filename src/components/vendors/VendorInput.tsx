import { forwardRef } from "react";
import { EyeOff } from "lucide-react";

interface VendorInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label: string;
  showPasswordToggle?: boolean;
}

export const VendorInput = forwardRef<HTMLInputElement, VendorInputProps>(
  ({ label, showPasswordToggle, className = "", ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5 w-full">
        <label className="text-[#7C8BA0] text-xs font-medium leading-[160%] tracking-[-0.24px]">
          {label}
        </label>
        <div className="relative">
          <input
            ref={ref}
            className={`w-full h-[46px] px-3.5 py-[13px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] outline-none focus:ring-2 focus:ring-primary/20 ${className}`}
            {...props}
          />
          {showPasswordToggle && (
            <button
              type="button"
              className="absolute right-3.5 top-1/2 -translate-y-1/2"
            >
              <EyeOff className="w-4 h-4 text-[#ACB5BB]" />
            </button>
          )}
        </div>
      </div>
    );
  }
);

VendorInput.displayName = "VendorInput";
