import React from 'react';
import { cn } from '@/lib/utils';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "input-field flex min-h-[120px] w-full rounded-xl border border-olive/20 bg-vanilla/50 px-4 py-3 text-dark-moss placeholder:text-olive/60 focus:border-jonquil focus:bg-vanilla/80 focus:outline-none focus:ring-2 focus:ring-jonquil/20 disabled:cursor-not-allowed disabled:opacity-50 resize-y transition-all duration-200",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);

Textarea.displayName = "Textarea";