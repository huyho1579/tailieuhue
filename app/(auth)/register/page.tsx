"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, BookOpen, Check } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { GoogleAuthModal } from "@/components/shared/GoogleAuthModal";

export default function RegisterPage() {
  const router = useRouter();
  const [showPw, setShowPw] = useState(false);
  const [form, setForm] = useState({ name: "", email: "", password: "", confirm: "" });
  const [loading, setLoading] = useState(false);
  const [isGoogleModalOpen, setIsGoogleModalOpen] = useState(false);

  const { loginRegularUser } = useAuthStore();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (form.password !== form.confirm) return;
    setLoading(true);

    setTimeout(() => {
      loginRegularUser(form.email, form.name);
      router.push("/dashboard");
      setLoading(false);
    }, 600);
  };

  const passwordStrength =
    form.password.length >= 8
      ? form.password.match(/[A-Z]/) && form.password.match(/[0-9]/)
        ? "strong"
        : "medium"
      : form.password
      ? "weak"
      : "";

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md">
        <div className="flex flex-col items-center mb-8">
          <Link href="/" className="flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 bg-blue-600 rounded-[12px] flex items-center justify-center shadow-xs">
              <BookOpen className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="font-bold text-slate-950 text-xl leading-tight">EduDocs</span>
              <span className="text-[11px] text-blue-600 font-bold">Đại học Kinh tế Huế</span>
            </div>
          </Link>
          <h1 className="text-2xl font-bold text-slate-950">Tạo tài khoản sinh viên</h1>
          <p className="text-slate-500 text-sm mt-1">Miễn phí trọn đời, hỗ trợ học tập HCE</p>
        </div>

        <div className="bg-white border border-slate-200 rounded-[20px] p-8 shadow-[0_4px_20px_rgba(15,23,42,0.06)]">
          {/* Nút Đăng ký bằng Google kích hoạt Modal */}
          <button
            type="button"
            onClick={() => setIsGoogleModalOpen(true)}
            className="w-full flex items-center justify-center gap-3 py-3 border border-slate-200 rounded-[10px] text-sm font-semibold text-slate-700 hover:border-blue-400 hover:bg-blue-50/40 transition-all mb-5 cursor-pointer shadow-xs"
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
            Đăng ký nhanh với Google
          </button>

          <div className="relative mb-5">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-xs text-slate-400">hoặc đăng ký với email</span>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Họ và tên</label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nguyễn Văn A"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Email</label>
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
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">Mật khẩu</label>
              <div className="relative">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  value={form.password}
                  onChange={(e) => setForm({ ...form, password: e.target.value })}
                  placeholder="Tối thiểu 8 ký tự"
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
              {passwordStrength && (
                <div className="mt-1.5 flex items-center gap-1">
                  {["weak", "medium", "strong"].map((s, i) => (
                    <div
                      key={s}
                      className={`h-1 flex-1 rounded-full transition-colors ${
                        passwordStrength === "weak" && i === 0
                          ? "bg-red-400"
                          : passwordStrength === "medium" && i <= 1
                          ? "bg-amber-400"
                          : passwordStrength === "strong"
                          ? "bg-green-500"
                          : "bg-slate-200"
                      }`}
                    />
                  ))}
                  <span className="text-xs text-slate-400 ml-1">
                    {passwordStrength === "weak"
                      ? "Yếu"
                      : passwordStrength === "medium"
                      ? "Trung bình"
                      : "Mạnh"}
                  </span>
                </div>
              )}
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Xác nhận mật khẩu
              </label>
              <div className="relative">
                <input
                  type="password"
                  required
                  value={form.confirm}
                  onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                  placeholder="Nhập lại mật khẩu"
                  className={`w-full px-4 py-2.5 pr-11 border rounded-[10px] text-sm focus:outline-none focus:ring-2 transition-all font-medium ${
                    form.confirm && form.confirm !== form.password
                      ? "border-red-300 focus:border-red-400 focus:ring-red-100"
                      : "border-slate-200 focus:border-blue-400 focus:ring-blue-100"
                  }`}
                />
                {form.confirm && form.confirm === form.password && (
                  <Check className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500" />
                )}
              </div>
              {form.confirm && form.confirm !== form.password && (
                <p className="text-xs text-red-500 mt-1">Mật khẩu không khớp</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || form.password !== form.confirm}
              className="w-full py-3 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white font-bold rounded-[10px] transition-colors text-sm cursor-pointer shadow-xs"
            >
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản ngay"}
            </button>
          </form>

          <p className="text-xs text-slate-400 text-center mt-4">
            Bằng cách đăng ký, bạn đồng ý với{" "}
            <Link href="/terms" className="text-blue-600">
              Điều khoản sử dụng
            </Link>{" "}
            và{" "}
            <Link href="/privacy" className="text-blue-600">
              Chính sách bảo mật
            </Link>
          </p>
        </div>

        <p className="text-center text-sm text-slate-500 mt-5">
          Đã có tài khoản?{" "}
          <Link href="/login" className="font-bold text-blue-600 hover:text-blue-700">
            Đăng nhập
          </Link>
        </p>
      </div>

      {/* Google Auth Modal */}
      <GoogleAuthModal
        isOpen={isGoogleModalOpen}
        onClose={() => setIsGoogleModalOpen(false)}
        mode="register"
      />
    </div>
  );
}
