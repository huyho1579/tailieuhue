"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  BookOpen,
  FileText,
  MessageCircle,
  Sparkles,
  Search,
  Bell,
  Menu,
  X,
  ShieldCheck,
  LogOut,
  Plus,
  LayoutDashboard,
  GraduationCap,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { signOut } from "@/lib/supabase/client";
import { ThemeToggle } from "@/components/shared/ThemeToggle";
import { StudyTimer } from "@/components/shared/StudyTimer";

const NAV_LINKS = [
  { label: "Tài liệu", href: "/tai-lieu", icon: BookOpen },
  { label: "Môn học", href: "/mon-hoc", icon: GraduationCap },
  { label: "Cộng đồng", href: "/community", icon: MessageCircle },
  { label: "AI Học tập", href: "#", icon: Sparkles, badge: "Sắp ra mắt" },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  const { currentUser, isAdmin, logoutUser } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleLogout = async () => {
    await signOut();
    logoutUser();
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 h-[68px] transition-colors">
      <div className="max-w-[1360px] mx-auto px-4 h-full flex items-center justify-between gap-3">
        {/* Left: Brand Logo */}
        <Link href="/" className="flex items-center gap-2.5 shrink-0 group">
          <div className="w-9 h-9 relative rounded-[10px] overflow-hidden shadow-xs border border-blue-100 dark:border-slate-700 bg-white dark:bg-slate-800 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="TailieuHue Logo"
              fill
              className="object-cover"
              priority
            />
          </div>
          <div className="flex flex-col">
            <div className="flex items-center">
              <span className="font-extrabold text-blue-600 dark:text-blue-400 text-lg leading-tight tracking-tight">
                Tailieu<span className="text-amber-500">Hue</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold tracking-wide">
              ĐH Kinh tế Huế
            </span>
          </div>
        </Link>

        {/* Center: Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-0.5">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 px-3 py-2 rounded-[10px] text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100/70 dark:hover:bg-slate-800 transition-colors relative"
            >
              {link.label}
              {link.badge && (
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}
        </nav>

        {/* Right Actions */}
        <div className="flex items-center gap-2">
          {/* Thời gian hoạt động & Chuỗi ngày học tập */}
          <StudyTimer />

          {/* Nút chuyển đổi Sáng / Tối / Theo hệ thống */}
          <ThemeToggle />

          {/* Search trigger button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden xl:flex items-center gap-2 px-3 py-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-[10px] text-sm text-slate-500 dark:text-slate-400 hover:border-blue-300 hover:bg-blue-50/50 dark:hover:bg-slate-800 transition-colors min-w-[150px]"
          >
            <Search className="w-3.5 h-3.5 shrink-0 text-slate-400" />
            <span className="text-xs">Tìm kiếm tài liệu...</span>
          </button>

          {/* Notification bell */}
          <button
            title="Thông báo"
            className="w-8 h-8 flex items-center justify-center rounded-[8px] text-slate-500 dark:text-slate-400 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile / Admin Controls */}
          {mounted && currentUser ? (
            <div className="flex items-center gap-1.5 pl-1.5 py-1 pr-1.5 bg-slate-50 dark:bg-slate-800/80 border border-slate-200/90 dark:border-slate-700 rounded-[12px] shadow-2xs">
              {/* User Link */}
              <Link
                href="/dashboard"
                className="flex items-center gap-2 hover:opacity-85 transition-opacity"
              >
                <div className="w-7 h-7 bg-blue-600 text-white font-bold rounded-[8px] flex items-center justify-center text-xs shadow-xs">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <div className="flex items-center gap-1">
                    <span className="text-xs font-bold text-slate-900 dark:text-white leading-tight truncate max-w-[90px]">
                      {currentUser.name}
                    </span>
                    {isAdmin && (
                      <span className="text-[9px] font-bold px-1.5 py-0.2 bg-amber-100 dark:bg-amber-950/80 text-amber-900 dark:text-amber-300 rounded border border-amber-300/60 dark:border-amber-800">
                        Admin
                      </span>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium">
                    {isAdmin ? "Quản trị viên" : "Sinh viên HCE"}
                  </span>
                </div>
              </Link>

              {/* Phím tắt nhanh cho Admin: Vào quản trị & Đăng bài */}
              {isAdmin && (
                <div className="flex items-center gap-1 pl-1 border-l border-slate-200 dark:border-slate-700">
                  <Link
                    href="/admin"
                    title="Vào Bảng điều khiển Quản trị viên"
                    className="p-1 text-amber-600 dark:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/60 rounded-[6px] transition-colors"
                  >
                    <ShieldCheck className="w-4 h-4" />
                  </Link>
                  <Link
                    href="/tai-lieu/dang-tai"
                    title="Đăng tải tài liệu mới (Admin)"
                    className="p-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/60 rounded-[6px] transition-colors"
                  >
                    <Plus className="w-4 h-4" />
                  </Link>
                </div>
              )}

              {/* Nút Đăng xuất */}
              <button
                onClick={handleLogout}
                title="Đăng xuất tài khoản"
                className="p-1 text-slate-400 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-950/40 rounded-[6px] transition-colors cursor-pointer ml-0.5"
              >
                <LogOut className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[10px] transition-colors shadow-xs"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden w-8 h-8 flex items-center justify-center rounded-[8px] text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileOpen && (
        <div className="lg:hidden absolute top-[68px] left-0 right-0 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 px-4 py-3 space-y-1 shadow-xl animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800"
            >
              <link.icon className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              {link.label}
              {link.badge && (
                <span className="text-[10px] font-semibold bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300 px-1.5 py-0.5 rounded-full ml-auto">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {mounted && isAdmin && (
            <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
              <Link
                href="/admin"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-bold text-amber-900 dark:text-amber-200 bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800"
              >
                <ShieldCheck className="w-4 h-4 text-amber-600 dark:text-amber-400" />
                Cổng quản trị Admin
              </Link>
              <Link
                href="/tai-lieu/dang-tai"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-bold text-blue-700 dark:text-blue-300 bg-blue-50 dark:bg-blue-950/40 border border-blue-200 dark:border-blue-800"
              >
                <Plus className="w-4 h-4 text-blue-600 dark:text-blue-400" />
                Đăng tải tài liệu mới (Admin)
              </Link>
            </div>
          )}

          <div className="pt-2 border-t border-slate-100 dark:border-slate-800">
            {mounted && currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-100 text-sm font-semibold rounded-[10px]"
                  onClick={() => setMobileOpen(false)}
                >
                  Trang cá nhân ({currentUser.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-red-600 dark:text-red-400 text-xs font-semibold cursor-pointer"
                >
                  Đăng xuất tài khoản
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-[10px]"
                onClick={() => setMobileOpen(false)}
              >
                Đăng nhập
              </Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
