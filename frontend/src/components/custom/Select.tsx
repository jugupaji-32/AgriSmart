import React from 'react';
import { cn } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  children: React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  name?: string;
  required?: boolean;
}

interface SelectTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

interface SelectValueProps {
  placeholder?: string;
}

interface SelectContentProps {
  children: React.ReactNode;
}

interface SelectItemProps {
  value: string;
  children: React.ReactNode;
  onSelect?: (value: string) => void;
}

const SelectContext = React.createContext<{
  value?: string;
  onValueChange?: (value: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}>({
  isOpen: false,
  setIsOpen: () => {},
});

export const Select = ({ value, onValueChange, children, disabled, name, required }: SelectProps) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const [internalValue, setInternalValue] = React.useState(value || '');

  const handleValueChange = (newValue: string) => {
    setInternalValue(newValue);
    onValueChange?.(newValue);
  };

  React.useEffect(() => {
    if (value !== undefined) {
      setInternalValue(value);
    }
  }, [value]);

  return (
    <SelectContext.Provider value={{ value: internalValue, onValueChange: handleValueChange, isOpen, setIsOpen }}>
      <div className="relative">
        {children}
        {/* Hidden input for form validation */}
        {required && (
          <input
            type="text"
            name={name}
            value={internalValue}
            onChange={() => {}}
            required={required}
            className="absolute opacity-0 pointer-events-none h-0 w-0"
            tabIndex={-1}
          />
        )}
      </div>
    </SelectContext.Provider>
  );
};

export const SelectTrigger = React.forwardRef<HTMLButtonElement, SelectTriggerProps>(
  ({ className, children, ...props }, ref) => {
    const { isOpen, setIsOpen } = React.useContext(SelectContext);

    const handleClick = (e: React.MouseEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsOpen(!isOpen);
    };

    return (
      <button
        ref={ref}
        type="button"
        className={cn(
          "input-field flex h-12 w-full items-center justify-between rounded-xl border border-olive/20 bg-vanilla/50 px-4 py-3 text-left text-dark-moss placeholder:text-olive/60 focus:border-jonquil focus:bg-vanilla/80 focus:outline-none focus:ring-2 focus:ring-jonquil/20 disabled:cursor-not-allowed disabled:opacity-50 transition-all duration-200",
          className
        )}
        onClick={handleClick}
        {...props}
      >
        {children}
        <ChevronDown className={cn("h-4 w-4 text-olive/60 transition-transform duration-200", isOpen && "rotate-180")} />
      </button>
    );
  }
);

export const SelectValue = ({ placeholder }: SelectValueProps) => {
  const { value } = React.useContext(SelectContext);
  
  return (
    <span className={cn("truncate", !value && "text-olive/60")}>
      {value || placeholder}
    </span>
  );
};

export const SelectContent = ({ children }: SelectContentProps) => {
  const { isOpen, setIsOpen } = React.useContext(SelectContext);
  const contentRef = React.useRef<HTMLDivElement>(null);

  React.useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (e: MouseEvent) => {
      if (contentRef.current && !contentRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    setTimeout(() => {
      document.addEventListener('click', handleClickOutside);
    }, 0);

    return () => document.removeEventListener('click', handleClickOutside);
  }, [isOpen, setIsOpen]);

  if (!isOpen) return null;

  return (
    <div 
      ref={contentRef}
      className="absolute top-full left-0 z-50 w-full mt-1 bg-vanilla/95 backdrop-blur-sm border border-olive/20 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto"
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
};

export const SelectItem = ({ value, children, onSelect }: SelectItemProps) => {
  const { onValueChange, setIsOpen } = React.useContext(SelectContext);

  const handleSelect = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onValueChange?.(value);
    onSelect?.(value);
    setIsOpen(false);
  };

  return (
    <div
      className="px-4 py-3 text-dark-moss hover:bg-jonquil/20 cursor-pointer transition-colors duration-200"
      onClick={handleSelect}
    >
      {children}
    </div>
  );
};

Select.displayName = "Select";
SelectTrigger.displayName = "SelectTrigger";
SelectValue.displayName = "SelectValue";
SelectContent.displayName = "SelectContent";
SelectItem.displayName = "SelectItem";