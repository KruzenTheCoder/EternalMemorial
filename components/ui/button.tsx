import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "btn font-semibold normal-case tracking-normal rounded-2xl min-h-11 px-6 border-0 transition-all duration-200 active:scale-[0.98] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 shadow-material hover:shadow-material-lg",
  {
    variants: {
      variant: {
        default: "btn-primary text-primary-content",
        destructive: "btn-error text-error-content shadow-none",
        outline: "btn-outline btn-primary border-2 border-primary/40 bg-base-100/80 hover:bg-base-200 shadow-none",
        secondary: "btn-secondary text-secondary-content shadow-none",
        ghost: "btn-ghost shadow-none hover:bg-base-200/80",
        link: "btn-link shadow-none no-underline hover:underline p-0 h-auto min-h-0",
        luxury: "bg-neutral text-primary border border-primary/30 hover:bg-neutral/90 shadow-lg shadow-primary/10",
      },
      size: {
        default: "h-11 px-6",
        sm: "btn-sm h-9 min-h-9 rounded-xl px-4 text-sm",
        lg: "btn-lg h-12 min-h-12 rounded-2xl px-8 text-base",
        icon: "btn-square h-11 w-11 min-h-11 p-0 rounded-2xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
