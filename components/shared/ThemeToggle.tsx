"use client";
import { useState, useEffect, useRef } from "react";
import { Sun, Moon, Laptop, Check } from "lucide-react";
import { cn } from "@/lib/utils/cn";

type ThemeMode = "light" | "dark" | "system";

export function ThemeToggle() {
  const [theme, setTheme] = useState<ThemeMode>("system");
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    const saved = (localStorage.getItem("tailieuhue-theme") as ThemeMode) || "system";
    setTheme(saved);
    applyTheme(saved);

    const media = window.matchMedia("(prefers-color-scheme: dark)");
    const handleSystemChange = () => {
      const current = localStorage.getItem("tailieuhue-theme") || "system";
      if (current === "system") {
        applyTheme("system");
      }
    };
    media.addEventListener("change", handleSystemChange);
    return () => media.removeEventListener("change", handleSystemChange);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === "dark") {
      root.classList.add("dark");
    } else if (mode === "light") {
      root.classList.remove("dark");
    } else {
      const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      if (systemDark) {
        root.classList.add("dark");
      } else {
        root.classList.remove("dark");
      }
    }
  };

  const handleSelect = (mode: ThemeMode) => {
    setTheme(mode);
    localStorage.setItem("tailieuhue-theme", mode);
    applyTheme(mode);
    setOpen(false);
  };

  if (!mounted) {
    return (
      <div className="w-8 h-8 rounded-[8px] bg-slate-100 dark:bg-slate-800 animate-pulse" />
    );
  }

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-8 h-8 flex items-center justify-center rounded-[8px] text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
        title="Chọn giao diện sáng / tối"
      >
        {theme === "light" && <Sun className="w-4 h-4" />}
        {theme === "dark" && <Moon className="w-4 h-4" />}
        {theme === "system" && <Laptop className="w-4 h-4" />}
      </button>

      {open && (
        <div className="absolute right-0 top-full mt-2 w-44 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[14px] shadow-xl p-1.5 z-50 animate-fade-in space-y-0.5">
          <button
            type="button"
            onClick={() => handleSelect("light")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer text-left",
              theme === "light"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Sun className="w-4 h-4" />
              <span>Sáng</span>
            </div>
            {theme === "light" && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelect("dark")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer text-left",
              theme === "dark"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Moon className="w-4 h-4" />
              <span>Tối</span>
            </div>
            {theme === "dark" && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          </button>

          <button
            type="button"
            onClick={() => handleSelect("system")}
            className={cn(
              "w-full flex items-center justify-between px-3 py-2 rounded-[10px] text-xs font-semibold transition-colors cursor-pointer text-left",
              theme === "system"
                ? "bg-blue-50 text-blue-600 dark:bg-blue-950/40 dark:text-blue-400"
                : "text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            )}
          >
            <div className="flex items-center gap-2.5">
              <Laptop className="w-4 h-4" />
              <span>Theo hệ thống</span>
            </div>
            {theme === "system" && <Check className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
          </button>
        </div>
      )}
    </div>
  );
}
