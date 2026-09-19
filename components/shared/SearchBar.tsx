"use client";
import { Search } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { cn } from "@/lib/utils/cn";

interface SearchBarProps {
  placeholder?: string;
  className?: string;
  size?: "sm" | "lg";
}

export function SearchBar({
  placeholder = "Tìm kiếm đề cương, môn học...",
  className,
  size = "sm",
}: SearchBarProps) {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/tim-kiem?q=${encodeURIComponent(query.trim())}`);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={cn("relative w-full", className)}>
      <Search
        className={cn(
          "absolute left-4 top-1/2 -translate-y-1/2 text-slate-400",
          size === "lg" ? "w-5 h-5" : "w-4 h-4"
        )}
      />
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        className={cn(
          "w-full bg-white border border-slate-200 rounded-[10px] text-slate-900 placeholder:text-slate-400",
          "focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all",
          size === "lg"
            ? "pl-12 pr-4 py-3.5 text-base"
            : "pl-10 pr-4 py-2.5 text-sm"
        )}
      />
    </form>
  );
}
