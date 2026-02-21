import { memo } from "react";

const PageFallback = memo(() => {
  return (
    <div className="container mx-auto px-4 py-8 max-w-7xl">
      <div className="animate-pulse space-y-8">
        <div className="h-10 bg-muted rounded w-1/3"></div>
        <div className="h-6 bg-muted rounded w-1/2"></div>
        <div className="h-80 bg-muted rounded"></div>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="h-64 bg-muted rounded"></div>
          <div className="lg:col-span-2 h-64 bg-muted rounded"></div>
        </div>
      </div>
    </div>
  );
});

export default PageFallback;
