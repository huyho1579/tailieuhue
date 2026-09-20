"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  ShieldCheck,
  FileText,
  Users,
  BarChart3,
  ArrowLeft,
  Lock,
  Mail,
  KeyRound,
  Eye,
  EyeOff,
  LogOut,
  AlertCircle,
  MessageSquare,
} from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useAuthStore, ADMIN_CREDENTIALS } from "@/lib/store/auth";

const ADMIN_MENU = [
  { label: "Tổng quan Quản trị", href: "/admin", icon: BarChart3 },
  { label: "Quản lý tài liệu HCE", href: "/admin/tai-lieu", icon: FileText },
  { label: "Quản lý người dùng", href: "/admin/nguoi-dung", icon: Users },
];

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);
  const { currentUser, isAdmin, loginAdmin, logoutAdmin } = useAuthStore();

  // State cho form đăng nhập Admin
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    setTimeout(() => {
      const res = loginAdmin(email, password);
      if (!res.success) {
        setErrorMsg(res.error || "Đăng nhập thất bại. Kiểm tra lại thông tin!");
      }
      setLoading(false);
    }, 400);
  };

  if (!mounted) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center text-white text-sm">
        Đang tải hệ thống Quản trị...
      </div>
    );
  }

  // NẾU CHƯA ĐĂNG NHẬP ADMIN -> HIỂN THỊ CỔNG ĐĂNG NHẬP BẢO MẬT ADMIN
  if (!isAdmin || !currentUser || currentUser.role !== "admin") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-14 h-14 bg-amber-500 text-slate-950 rounded-[16px] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-amber-500/20">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-2xl font-bold text-white tracking-tight">
              Cổng Quản trị Viên (Admin Portal)
            </h1>
            <p className="text-slate-400 text-xs mt-1.5">
              Khu vực bảo mật dành riêng cho Quản trị viên Đại học Kinh tế Huế
            </p>
          </div>

          {/* Form Login */}
          <div className="bg-slate-900/90 border border-slate-800 rounded-[20px] p-7 shadow-2xl backdrop-blur-sm">
            {errorMsg && (
              <div className="mb-5 p-3.5 bg-red-500/10 border border-red-500/30 rounded-[10px] flex items-start gap-2.5 text-red-400 text-xs">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleAdminLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Tài khoản Email Quản trị
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Nhập email quản trị viên..."
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/80 border border-slate-700 rounded-[10px] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1.5">
                  Mật khẩu Quản trị
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Nhập mật khẩu quản trị..."
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/80 border border-slate-700 rounded-[10px] text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div className="p-3 bg-slate-800/50 rounded-[10px] border border-slate-800 text-[11px] text-slate-400 leading-relaxed">
                <span className="text-amber-400 font-semibold">Bảo mật hệ thống:</span> Vui lòng nhập đúng tài khoản và mật khẩu quản trị viên được cấp quyền để truy cập.
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 bg-amber-500 hover:bg-amber-600 disabled:opacity-70 text-slate-950 font-bold rounded-[10px] text-sm transition-colors shadow-lg shadow-amber-500/15 flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4" />
                {loading ? "Đang xác thực bảo mật..." : "Xác thực & Vào Trang Quản Trị"}
              </button>
            </form>

            <div className="mt-6 pt-5 border-t border-slate-800 text-center">
              <Link
                href="/"
                className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                Quay lại trang chủ người dùng
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // NẾU ĐÃ ĐĂNG NHẬP ĐÚNG ADMIN -> HIỂN THỊ GIAO DIỆN QUẢN TRỊ VIÊN
  return (
    <div className="min-h-screen bg-slate-100/80">
      {/* Top Admin Bar */}
      <header className="bg-slate-950 text-white h-16 border-b border-slate-800 px-4 md:px-8 flex items-center justify-between sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-amber-500 text-slate-950 font-bold rounded-[8px] flex items-center justify-center text-sm shadow-xs">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-sm tracking-tight block">TailieuHue Admin Portal</span>
            <span className="text-[10px] text-amber-400 font-semibold">
              Hệ thống Đại học Kinh tế Huế
            </span>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-xs bg-slate-900 px-3 py-1.5 rounded-full border border-slate-800">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-slate-400">Admin:</span>
            <strong className="text-white font-semibold">
              {currentUser?.email || ADMIN_CREDENTIALS.email}
            </strong>
          </div>

          <button
            onClick={() => logoutAdmin()}
            className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 px-3 py-1.5 rounded-[8px] bg-red-950/40 hover:bg-red-950/60 border border-red-900/40 transition-colors cursor-pointer"
            title="Thoát quyền quản trị"
          >
            <LogOut className="w-3.5 h-3.5" />
            Đăng xuất Admin
          </button>

          <Link
            href="/"
            className="flex items-center gap-1.5 text-xs font-semibold text-slate-300 hover:text-white px-3 py-1.5 rounded-[8px] bg-slate-900 hover:bg-slate-800 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            Về website
          </Link>
        </div>
      </header>

      {/* Main Admin Content */}
      <div className="max-w-[1400px] mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full lg:w-64 shrink-0">
          <div className="bg-white border border-slate-200 rounded-[16px] p-3 space-y-1 shadow-xs sticky top-24">
            <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-slate-400">
              Chức năng quản trị
            </div>
            {ADMIN_MENU.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-sm font-semibold transition-colors",
                    isActive
                      ? "bg-amber-50 text-amber-950 font-bold border border-amber-200"
                      : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                  )}
                >
                  <item.icon
                    className={cn(
                      "w-4 h-4",
                      isActive ? "text-amber-600" : "text-slate-400"
                    )}
                  />
                  <span>{item.label}</span>
                </Link>
              );
            })}

            <div className="pt-3 mt-3 border-t border-slate-100">
              <button
                onClick={() => logoutAdmin()}
                className="w-full flex items-center gap-3 px-3 py-2.5 rounded-[10px] text-xs font-semibold text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
                Đăng xuất quyền Admin
              </button>
            </div>
          </div>
        </aside>

        {/* Admin Body */}
        <main className="flex-1 min-w-0">{children}</main>
      </div>
    </div>
  );
}
