"use client";
import Link from "next/link";
import Image from "next/image";
import { useState, useEffect } from "react";
import {
  Search,
  Bell,
  Menu,
  X,
  BookOpen,
  FileText,
  MessageCircle,
  Sparkles,
  ShieldCheck,
  LogOut,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

const NAV_LINKS = [
  { label: "Tài liệu", href: "/tai-lieu", icon: BookOpen },
  { label: "Môn học", href: "/tai-lieu/de-cuong", icon: FileText },
  { label: "Cộng đồng", href: "/community", icon: MessageCircle },
  { label: "AI Học tập", href: "#", icon: Sparkles, badge: "Sắp ra mắt" },
];

import { signOut } from "@/lib/supabase/client";

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
    <header className="sticky top-0 z-50 bg-white border-b border-slate-200 h-[68px]">
      <div className="max-w-[1280px] mx-auto px-4 h-full flex items-center justify-between gap-4">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="w-10 h-10 relative rounded-[10px] overflow-hidden shadow-xs border border-blue-100 bg-white group-hover:scale-105 transition-transform">
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
              <span className="font-extrabold text-blue-600 text-lg leading-tight tracking-tight">
                Tailieu<span className="text-amber-500">Hue</span>
              </span>
            </div>
            <span className="text-[10px] text-slate-500 font-semibold tracking-wide">
              ĐH Kinh tế Huế
            </span>
          </div>
        </Link>

        {/* Desktop Nav - Hoàn toàn sạch cho người dùng thông thường */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-[10px] text-sm font-medium text-slate-600 hover:text-slate-950 hover:bg-slate-50 transition-colors relative"
            >
              {link.label}
              {link.badge && (
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {/* CHỈ hiển thị khi đã đăng nhập đúng tài khoản Admin */}
          {mounted && isAdmin && (
            <Link
              href="/admin"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-[8px] text-xs font-bold bg-amber-50 text-amber-900 border border-amber-300 hover:bg-amber-100 transition-colors ml-2"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Quản trị Admin
            </Link>
          )}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-2.5">
          {/* Quick upload document button - CHỈ HIỂN THỊ KHI LÀ ADMIN */}
          {mounted && isAdmin && (
            <Link
              href="/tai-lieu/dang-tai"
              className="hidden lg:flex items-center gap-1.5 px-3 py-2 bg-blue-50 text-blue-700 hover:bg-blue-100/80 border border-blue-200/80 rounded-[10px] text-xs font-bold transition-colors shadow-2xs"
            >
              <BookOpen className="w-3.5 h-3.5 text-blue-600" />
              <span>Đăng tài liệu (Admin)</span>
            </Link>
          )}

          {/* Search button */}
          <button
            onClick={() => setSearchOpen(true)}
            className="hidden sm:flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-[10px] text-sm text-slate-500 hover:border-blue-300 hover:bg-blue-50 transition-colors min-w-[160px]"
          >
            <Search className="w-4 h-4 shrink-0 text-slate-400" />
            <span className="text-xs">Tìm kiếm tài liệu...</span>
          </button>

          <button
            title="Thông báo"
            className="w-9 h-9 flex items-center justify-center rounded-[10px] text-slate-500 hover:text-slate-950 hover:bg-slate-50 transition-colors"
          >
            <Bell className="w-4 h-4" />
          </button>

          {/* User Profile / Login button */}
          {mounted && currentUser ? (
            <div className="flex items-center gap-2">
              <Link
                href="/dashboard"
                className="flex items-center gap-2 px-3 py-1.5 bg-slate-50 border border-slate-200 hover:border-blue-300 rounded-[10px] transition-colors"
              >
                <div className="w-7 h-7 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-xs">
                  {currentUser.name.slice(0, 2).toUpperCase()}
                </div>
                <div className="hidden lg:flex flex-col text-left">
                  <span className="text-xs font-bold text-slate-900 leading-tight">
                    {currentUser.name}
                  </span>
                  <span className="text-[10px] text-slate-500 font-medium">
                    {isAdmin ? "Quản trị viên" : "Sinh viên HCE"}
                  </span>
                </div>
              </Link>
              <button
                onClick={handleLogout}
                title="Đăng xuất"
                className="w-8 h-8 flex items-center justify-center text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[8px] transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-[10px] transition-colors shadow-xs"
            >
              Đăng nhập
            </Link>
          )}

          {/* Mobile menu button */}
          <button
            className="md:hidden w-9 h-9 flex items-center justify-center rounded-[10px] text-slate-500 hover:bg-slate-50"
            onClick={() => setMobileOpen(!mobileOpen)}
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="md:hidden absolute top-[68px] left-0 right-0 bg-white border-b border-slate-200 px-4 py-3 space-y-1 shadow-lg animate-fade-in">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              <link.icon className="w-4 h-4 text-blue-600" />
              {link.label}
              {link.badge && (
                <span className="text-[10px] font-semibold bg-blue-100 text-blue-700 px-1.5 py-0.5 rounded-full ml-auto">
                  {link.badge}
                </span>
              )}
            </Link>
          ))}

          {mounted && isAdmin && (
            <Link
              href="/admin"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-bold text-amber-900 bg-amber-50 border border-amber-200"
            >
              <ShieldCheck className="w-4 h-4 text-amber-600" />
              Cổng quản trị Admin
            </Link>
          )}

          <div className="pt-2 border-t border-slate-100">
            {mounted && currentUser ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  className="flex items-center justify-center gap-2 w-full px-4 py-2.5 bg-slate-100 text-slate-800 text-sm font-semibold rounded-[10px]"
                  onClick={() => setMobileOpen(false)}
                >
                  Trang cá nhân ({currentUser.name})
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMobileOpen(false);
                  }}
                  className="flex items-center justify-center gap-2 w-full px-4 py-2 text-red-600 text-xs font-semibold cursor-pointer"
                >
                  Đăng xuất
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

      {/* Search overlay */}
      {searchOpen && (
        <div
          className="fixed inset-0 z-50 bg-black/40 flex items-start justify-center pt-20 px-4"
          onClick={() => setSearchOpen(false)}
        >
          <div
            className="bg-white rounded-[20px] shadow-xl w-full max-w-2xl p-4 animate-fade-in"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 border border-slate-200 rounded-[10px] px-4 py-3 focus-within:border-blue-400">
              <Search className="w-4 h-4 text-slate-400 shrink-0" />
              <input
                autoFocus
                type="text"
                placeholder="Tìm kiếm đề cương, môn học của ĐH Kinh tế Huế..."
                className="flex-1 outline-none text-sm text-slate-900 bg-transparent placeholder:text-slate-400"
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    const target = e.target as HTMLInputElement;
                    if (target.value.trim()) {
                      window.location.href = `/tim-kiem?q=${encodeURIComponent(target.value.trim())}`;
                    }
                  }
                }}
              />
            </div>
            <div className="mt-3 text-xs text-slate-400 text-center">
              Nhấn Enter để tìm kiếm, hoặc nhấn ra ngoài để đóng
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
