import { forwardRef } from "react";
import { ChevronDown } from "lucide-react";

interface VendorSelectProps
  extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label: string;
  options?: { value: string; label: string }[];
}

export const VendorSelect = forwardRef<HTMLSelectElement, VendorSelectProps>(
  ({ label, options = [], className = "", children, ...props }, ref) => {
    return (
      <div className="flex flex-col gap-0.5 w-full">
        <label className="text-[#7C8BA0] text-xs font-medium leading-[160%] tracking-[-0.24px]">
          {label}
        </label>
        <div className="relative">
          <select
            ref={ref}
            className={`w-full h-[46px] px-3.5 py-[13px] rounded-[10px] border border-[#EDF1F3] bg-white shadow-[0_1px_2px_0_rgba(228,229,231,0.24)] text-[#292D32] text-sm font-medium leading-[140%] tracking-[-0.14px] outline-none focus:ring-2 focus:ring-primary/20 appearance-none ${className}`}
            {...props}
          >
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
            {children}
          </select>
          <ChevronDown className="absolute right-3.5 top-1/2 -translate-y-1/2 w-5 h-5 text-[#292D32] pointer-events-none" />
        </div>
      </div>
    );
  }
);

VendorSelect.displayName = "VendorSelect";
