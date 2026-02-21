import React from 'react';
import { cn } from '@/lib/utils';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  ({ className, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          "relative overflow-hidden rounded-xl bg-gradient-to-r from-vanilla/40 via-vanilla/60 to-vanilla/40 bg-[length:200%_100%] animate-shimmer",
          className
        )}
        {...props}
      />
    );
  }
);

Skeleton.displayName = "Skeleton";

export const CardSkeleton = () => (
  <div className="relative overflow-hidden border-2 border-vanilla/50 rounded-2xl p-6 bg-vanilla/20 backdrop-blur-sm">
    <div className="flex flex-col h-full space-y-4">
      <div className="flex items-center justify-between mb-2">
        <Skeleton className="w-14 h-14 rounded-xl" />
        <Skeleton className="w-20 h-6 rounded-full" />
      </div>
      <Skeleton className="w-32 h-4 rounded-lg" />
      <div className="flex-1 space-y-3">
        <Skeleton className="w-20 h-10 rounded-lg" />
        <Skeleton className="w-full h-4 rounded-lg" />
        <Skeleton className="w-4/5 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-full h-10 rounded-xl mt-2" />
    </div>
  </div>
);

export const RecommendationSkeleton = () => (
  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 sm:gap-4 p-4 sm:p-5 bg-vanilla/30 rounded-xl border border-vanilla/50">
    <div className="flex items-center space-x-3 sm:space-x-4 w-full sm:w-auto">
      <Skeleton className="w-12 h-12 sm:w-14 sm:h-14 rounded-xl flex-shrink-0" />
      <div className="space-y-2 flex-1">
        <Skeleton className="w-32 h-5 rounded-lg" />
        <Skeleton className="w-24 h-4 rounded-lg" />
      </div>
    </div>
    <div className="flex items-center space-x-3 w-full sm:w-auto justify-end">
      <Skeleton className="w-20 h-6 rounded-full" />
      <Skeleton className="w-16 h-8 rounded-lg" />
    </div>
  </div>
);

export const QuickActionSkeleton = () => (
  <div className="space-y-3">
    <Skeleton className="w-full h-10 rounded-xl" />
    <Skeleton className="w-full h-10 rounded-xl" />
    <Skeleton className="w-full h-10 rounded-xl" />
    <Skeleton className="w-full h-10 rounded-xl" />
  </div>
);

export const WeatherDetailSkeleton = () => (
  <div className="space-y-3">
    <div className="flex items-center justify-between p-3 bg-vanilla/40 rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-24 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-16 h-5 rounded-lg" />
    </div>
    <div className="flex items-center justify-between p-3 bg-vanilla/40 rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-12 h-5 rounded-lg" />
    </div>
    <div className="flex items-center justify-between p-3 bg-vanilla/40 rounded-lg">
      <div className="flex items-center space-x-3">
        <Skeleton className="w-8 h-8 rounded-lg" />
        <Skeleton className="w-20 h-4 rounded-lg" />
      </div>
      <Skeleton className="w-20 h-5 rounded-lg" />
    </div>
  </div>
);
