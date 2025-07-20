import React from "react";
import { clsx } from "clsx";

interface CheckboxProps {
  checked?: boolean | "indeterminate";
  onChange?: (checked: boolean) => void;
  onCheckedChange?: (checked: boolean) => void;
  indeterminate?: boolean;
  disabled?: boolean;
  className?: string;
  "aria-label"?: string;
}

const Checkbox = React.forwardRef<HTMLInputElement, CheckboxProps>(
  (
    {
      checked,
      onChange,
      onCheckedChange,
      indeterminate,
      disabled,
      className,
      ...props
    },
    ref
  ) => {
    const checkboxRef = React.useRef<HTMLInputElement>(null);
    const isChecked = checked === true;
    const isIndeterminate = checked === "indeterminate" || indeterminate;

    React.useEffect(() => {
      const checkbox = checkboxRef.current;
      if (checkbox) {
        checkbox.indeterminate = Boolean(isIndeterminate);
      }
    }, [isIndeterminate]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const newChecked = e.target.checked;
      onChange?.(newChecked);
      onCheckedChange?.(newChecked);
    };

    return (
      <input
        ref={ref || checkboxRef}
        type="checkbox"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        className={clsx(
          "w-4 h-4 rounded border-2 border-orange-500 accent-orange-500 text-orange-500 ",
          "disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        {...props}
      />
    );
  }
);

Checkbox.displayName = "Checkbox";

export { Checkbox };
export type { CheckboxProps };
