import { cn } from "@/lib/utils/cn";

type BadgeVariant = "free" | "pro" | "hot" | "new" | "default";

interface BadgeProps {
  variant?: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClasses: Record<BadgeVariant, string> = {
  free: "bg-green-50 text-green-700 border border-green-200",
  pro: "bg-blue-600 text-white border border-blue-600",
  hot: "bg-orange-50 text-orange-600 border border-orange-200",
  new: "bg-blue-50 text-blue-600 border border-blue-200",
  default: "bg-slate-100 text-slate-600 border border-slate-200",
};

export function Badge({ variant = "default", children, className }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold tracking-wide uppercase",
        variantClasses[variant],
        className
      )}
    >
      {children}
    </span>
  );
}
