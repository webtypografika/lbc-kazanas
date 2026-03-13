"use client";

import { ButtonHTMLAttributes, forwardRef } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "outline" | "ghost" | "danger";
  size?: "sm" | "md" | "lg";
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = "primary", size = "md", className = "", children, ...props }, ref) => {
    const base =
      "inline-flex items-center justify-center font-medium transition-all duration-200 rounded-[2px] disabled:opacity-50 disabled:cursor-not-allowed";

    const variants = {
      primary: "bg-brand-800 text-white hover:bg-brand-700 active:bg-brand-900",
      secondary: "bg-neutral-100 text-neutral-800 hover:bg-neutral-200",
      outline: "border border-brand-800 text-brand-800 hover:bg-brand-800 hover:text-white",
      ghost: "text-neutral-600 hover:text-brand-800 hover:bg-neutral-50",
      danger: "bg-red-600 text-white hover:bg-red-700",
    };

    const sizes = {
      sm: "px-3 py-1.5 text-xs",
      md: "px-5 py-2.5 text-sm",
      lg: "px-8 py-3.5 text-sm uppercase tracking-[0.15em]",
    };

    return (
      <button
        ref={ref}
        className={`${base} ${variants[variant]} ${sizes[size]} ${className}`}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
