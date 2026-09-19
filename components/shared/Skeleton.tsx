import { cn } from "@/lib/utils/cn";

interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className }: SkeletonProps) {
  return (
    <div className={cn("bg-slate-200 rounded-lg animate-skeleton", className)} />
  );
}

export function SkeletonCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-[16px] overflow-hidden">
      <Skeleton className="h-44 rounded-none" />
      <div className="p-4 space-y-3">
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
        <div className="flex gap-2">
          <Skeleton className="h-4 w-12" />
          <Skeleton className="h-4 w-12" />
        </div>
        <Skeleton className="h-5 w-20" />
        <Skeleton className="h-9 w-full" />
      </div>
    </div>
  );
}
