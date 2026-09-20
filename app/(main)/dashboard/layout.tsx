"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Library,
  ShoppingBag,
  Bookmark,
  FileText,
  Bell,
  Settings,
  ChevronRight,
  ShieldCheck,
  LogOut,
  GraduationCap,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore } from "@/lib/store/auth";

const MENU_ITEMS = [
  { label: "Tổng quan", href: "/dashboard", icon: LayoutDashboard },
  { label: "Thư viện tài liệu", href: "/dashboard/thu-vien", icon: Library },
  { label: "Tài liệu đã mua", href: "/dashboard/da-mua", icon: ShoppingBag },
  { label: "Đã lưu yêu thích", href: "/dashboard/da-luu", icon: Bookmark },
  { label: "Cài đặt tài khoản", href: "/dashboard/cai-dat", icon: Settings },
];

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { currentUser, isAdmin, logoutUser } = useAuthStore();

  const userName = currentUser?.name || "Sinh viên HCE";
  const userEmail = currentUser?.email || "sinhvien@hce.edu.vn";

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8">
      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="sticky top-24 space-y-4">
            {/* User Profile Card */}
            <div className="bg-white border border-slate-200 rounded-[16px] p-4 shadow-xs">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-11 h-11 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-sm shadow-xs">
                  {userName.slice(0, 2).toUpperCase()}
                </div>
                <div className="min-w-0">
                  <p className="font-bold text-sm text-slate-900 truncate">{userName}</p>
                  <p className="text-xs text-slate-500 truncate">{userEmail}</p>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2.5 border-t border-slate-100 text-xs">
                <span className="text-slate-500">Vai trò:</span>
                {isAdmin ? (
                  <span className="font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Quản trị viên
                  </span>
                ) : (
                  <span className="font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md flex items-center gap-1">
                    <GraduationCap className="w-3.5 h-3.5" />
                    Sinh viên
                  </span>
                )}
              </div>

              <div className="flex items-center justify-between pt-1.5 text-xs">
                <span className="text-slate-500">Trường:</span>
                <span className="font-semibold text-slate-800">ĐH Kinh tế Huế</span>
              </div>
            </div>

            {/* Menu Items */}
            <nav className="bg-white border border-slate-200 rounded-[16px] p-2 space-y-1 shadow-xs">
              {MENU_ITEMS.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    className={cn(
                      "flex items-center gap-3 px-3.5 py-2.5 rounded-[10px] text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    )}
                  >
                    <item.icon
                      className={cn("w-4 h-4", isActive ? "text-blue-600" : "text-slate-400")}
                    />
                    <span>{item.label}</span>
                    {isActive && <ChevronRight className="w-3.5 h-3.5 ml-auto text-blue-500" />}
                  </Link>
                );
              })}

              {/* CHỈ hiển thị nếu là Admin */}
              {isAdmin && (
                <div className="pt-2 mt-2 border-t border-slate-100">
                  <Link
                    href="/admin"
                    className="flex items-center gap-2.5 px-3.5 py-2.5 rounded-[10px] text-xs font-bold text-amber-900 bg-amber-50 hover:bg-amber-100 transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4 text-amber-600" />
                    Bảng điều khiển Quản trị (Admin)
                  </Link>
                </div>
              )}

              <div className="pt-2 mt-2 border-t border-slate-100">
                <button
                  onClick={() => logoutUser()}
                  className="w-full flex items-center gap-3 px-3.5 py-2 rounded-[10px] text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                  Đăng xuất tài khoản
                </button>
              </div>
            </nav>
          </div>
        </aside>

        {/* Content */}
        <main className="flex-1 min-w-0 animate-fade-in">{children}</main>
      </div>
    </div>
  );
}
