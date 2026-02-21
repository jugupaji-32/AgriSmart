import React from 'react';
import { cn } from '@/lib/utils';

interface ProgressProps {
  value: number; // 0-100
  className?: string;
  size?: 'sm' | 'md' | 'lg';
  color?: 'primary' | 'secondary' | 'accent';
}

export const Progress: React.FC<ProgressProps> = ({ 
  value, 
  className, 
  size = 'md',
  color = 'primary'
}) => {
  const sizes = {
    sm: 'h-1',
    md: 'h-2',
    lg: 'h-3'
  };
  
  const colors = {
    primary: 'bg-olive',
    secondary: 'bg-arylide-yellow', 
    accent: 'bg-jonquil'
  };
  
  return (
    <div className={cn('progress-bar', sizes[size], className)}>
      <div 
        className={cn('progress-fill', colors[color])} 
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};

export default Progress;