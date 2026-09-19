"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, ShieldAlert } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { GoogleAuthModal } from "@/components/shared/GoogleAuthModal";
import { signInWithGoogle } from "@/lib/supabase/client";

export default function LoginPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { loginRegularUser, loginAdmin } = useAuthStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        console.warn("Lỗi chuyển hướng Google:", res.error);
        setIsGoogleModalOpen(true);
      }
    } catch {
      setIsGoogleModalOpen(true);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    setTimeout(() => {
      // Nếu là email admin nhập đúng mật khẩu admin
      if (
        form.email.trim().toLowerCase() === "huyho1579@gmail.com" &&
        form.password === "123321"
      ) {
        loginAdmin(form.email, form.password);
        router.push("/admin");
      } else {
        // Đăng nhập tài khoản sinh viên bình thường
        loginRegularUser(form.email);
        router.push("/dashboard");
      }
      setLoading(false);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <Image
              src="/logo.png"
              alt="TailieuHue Logo"
              width={40}
              height={40}
              className="rounded-[10px] object-contain shadow-xs"
            />
            <div className="flex flex-col">
              <span className="font-bold text-slate-950 text-xl leading-tight">TailieuHue</span>
              <span className="text-[11px] text-blue-600 font-bold">Đại học Kinh tế Huế</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-950">Đăng nhập tài khoản</h1>
          <p className="text-slate-500 text-sm mt-1">
            Dành cho sinh viên và cộng tác viên Đại học Kinh tế Huế
          </p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          {/* Nút Đăng nhập Google trực tiếp */}
          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading}
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-[10px] text-sm font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50/40 transition-all mb-5 cursor-pointer shadow-xs disabled:opacity-70"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            {loading ? "Đang kết nối Google..." : "Đăng nhập thẳng với Google"}
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-400">hoặc bằng email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Email sinh viên / tài khoản
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="sinhvien@hce.edu.vn"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <div className="flex justify-between mb-1.5">
                <label className="text-sm font-semibold text-slate-900">Mật khẩu</label>
                <Link
                  href="/quen-mat-khau"
                  className="text-xs text-blue-600 hover:text-blue-700 font-medium"
                >
                  Quên mật khẩu?
                </Link>
              </div>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Nhập mật khẩu..."
                  className="w-full px-4 py-2.5 pr-11 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
                />
                <button
                  type="button"
                  onClick={() => setShowPw(!showPw)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-70 text-white font-bold rounded-[10px] transition-colors text-sm shadow-xs cursor-pointer"
            >
              {loading ? "Đang đăng nhập..." : "Đăng nhập ngay"}
            </button>
          </form>

          {/* Admin link helper */}
          <div className="mt-6 pt-4 border-t border-slate-100 text-center">
            <Link
              href="/admin"
              className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-amber-700 transition-colors"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-amber-600" />
              Đăng nhập trang Quản trị viên (Admin)
            </Link>
          </div>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Chưa có tài khoản?{" "}
          <Link
            href="/register"
            className="font-bold text-blue-600 hover:text-blue-700"
          >
            Đăng ký tài khoản miễn phí
          </Link>
        </p>
      </div>

      {/* Google Sign In Modal (Dự phòng khi chưa bật Google OAuth trên Supabase) */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="login"
      />
    </div>
  );
}
