import { cn } from "@/lib/utils/cn";
import { User } from "lucide-react";

interface AvatarProps {
  src?: string;
  name?: string;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: "w-7 h-7 text-xs",
  md: "w-9 h-9 text-sm",
  lg: "w-12 h-12 text-base",
  xl: "w-20 h-20 text-2xl",
};

export function Avatar({ src, name, size = "md", className }: AvatarProps) {
  const initials = name
    ? name.split(" ").map((w) => w[0]).slice(-2).join("").toUpperCase()
    : "";

  return (
    <div
      className={cn(
        "rounded-full flex items-center justify-center shrink-0 overflow-hidden",
        sizeMap[size],
        !src && "bg-blue-100 text-blue-700 font-semibold",
        className
      )}
    >
      {src ? (
        <img src={src} alt={name || "avatar"} className="w-full h-full object-cover" />
      ) : initials ? (
        <span>{initials}</span>
      ) : (
        <User className="w-4 h-4 text-blue-400" />
      )}
    </div>
  );
}
