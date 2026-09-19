"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Search, Plus, MessageCircle, User } from "lucide-react";
import { cn } from "@/lib/utils/cn";

const NAV_ITEMS = [
  { label: "Trang chủ", href: "/", icon: Home },
  { label: "Tìm kiếm", href: "/tim-kiem", icon: Search },
  { label: "Đăng bài", href: "/community/tao-bai-viet", icon: Plus, isSpecial: true },
  { label: "Cộng đồng", href: "/community", icon: MessageCircle },
  { label: "Cá nhân", href: "/dashboard", icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-slate-200 px-2 pb-safe">
      <div className="flex items-center justify-around py-2">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          if (item.isSpecial) {
            return (
              <Link
                key={item.label}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1"
              >
                <div className="w-10 h-10 bg-blue-600 rounded-[14px] flex items-center justify-center shadow-lg shadow-blue-200">
                  <item.icon className="w-5 h-5 text-white" />
                </div>
              </Link>
            );
          }
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
