import * as React from "react";
import { cn } from "@/lib/utils";

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  return (
    <input
      type={type}
      className={cn(
        "input input-bordered w-full rounded-2xl h-11 min-h-11 bg-base-100 border-base-300/80 text-base-content placeholder:text-base-content/45",
        "focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-shadow duration-200",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "file:border-0 file:bg-transparent file:text-sm file:font-medium",
        className
      )}
      ref={ref}
      {...props}
    />
  );
});
Input.displayName = "Input";

export { Input };
