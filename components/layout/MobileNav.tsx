"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, BookOpen, GraduationCap, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Tài liệu", href: "/tai-lieu", icon: BookOpen },
  { label: "Tìm kiếm", href: "/tim-kiem", icon: Search },
  { label: "Môn học", href: "/mon-hoc", icon: GraduationCap },
  { label: "Cá nhân", href: "/dashboard", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.label}
              href={item.href}
              className={cn(
                "flex flex-col items-center gap-1 px-3 py-1 rounded-xl transition-colors",
                isActive ? "text-blue-600 font-semibold" : "text-slate-500"
              )}
            >
              <item.icon className="w-5 h-5" />
              <span className="text-[10px] font-medium">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
