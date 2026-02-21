import React from 'react';
import { cn } from '@/lib/utils';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "input-field flex h-12 w-full rounded-xl border border-olive/20 bg-vanilla/50 px-4 py-3 text-dark-moss placeholder:text-olive/60 focus:border-jonquil focus:bg-vanilla/80 focus:outline-none focus:ring-2 focus:ring-jonquil/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Input.displayName = "Input";