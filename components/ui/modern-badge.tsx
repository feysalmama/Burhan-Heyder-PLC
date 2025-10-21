"use client";

import { cn } from "@/lib/utils";

interface ModernBadgeProps {
  children: React.ReactNode;
  variant?: "success" | "warning" | "error" | "info" | "default";
  size?: "sm" | "md" | "lg";
  className?: string;
}

const ModernBadge = ({
  children,
  variant = "default",
  size = "md",
  className,
}: ModernBadgeProps) => {
  const baseClasses =
    "inline-flex items-center justify-center font-medium rounded-full transition-all duration-200 whitespace-nowrap";

  const sizeClasses = {
    sm: "px-3 py-1.5 text-xs w-[80px]",
    md: "px-4 py-2 text-sm w-[100px]",
    lg: "px-5 py-2.5 text-base w-[120px]",
  };

  const variantClasses = {
    success:
      "bg-green-100 text-green-800 border border-green-200 hover:bg-green-200",
    warning:
      "bg-yellow-100 text-yellow-800 border border-yellow-200 hover:bg-yellow-200",
    error: "bg-red-100 text-red-800 border border-red-200 hover:bg-red-200",
    info: "bg-blue-100 text-blue-800 border border-blue-200 hover:bg-blue-200",
    default:
      "bg-gray-100 text-gray-800 border border-gray-200 hover:bg-gray-200",
  };

  return (
    <span
      className={cn(
        baseClasses,
        sizeClasses[size],
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
};

export { ModernBadge };
