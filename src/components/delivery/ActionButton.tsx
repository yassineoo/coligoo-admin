"use client";

import { ReactNode } from "react";

interface ActionButtonProps {
  icon?: ReactNode;
  children: ReactNode;
  variant?: "default" | "primary";
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

export function ActionButton({
  icon,
  children,
  variant = "default",
  onClick,
  disabled = false,
  className = "",
}: ActionButtonProps) {
  const baseStyles =
    "inline-flex items-center justify-center gap-2 px-2 py-2 rounded-[10px] text-[11px] font-medium leading-[150%] tracking-[0.346px] transition-colors disabled:cursor-not-allowed disabled:opacity-50";

  const variantStyles =
    variant === "primary"
      ? "bg-delivery-orange border border-primary text-white hover:bg-primary/90 disabled:bg-primary/50"
      : "bg-transparent text-[#292D32] hover:bg-gray-50 disabled:text-gray-300 disabled:hover:bg-transparent";

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyles} ${variantStyles} ${className}`}
    >
      {icon && <span className="w-4 h-4">{icon}</span>}
      {children}
    </button>
  );
}
