"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, AlertCircle, ArrowRight } from "lucide-react";
import { useAuthStore, ADMIN_CREDENTIALS } from "@/lib/store/auth";
import { signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase/client";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}

export function GoogleAuthModal({
  isOpen,
  onClose,
  mode = "login",
}: GoogleAuthModalProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [oauthLoading, setOauthLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleEmailSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setError(null);
    setLoading(true);

    setTimeout(() => {
      const cleanEmail = email.trim().toLowerCase();
      const isAdm = cleanEmail === ADMIN_CREDENTIALS.email;

      const res = loginWithGoogle({
        email: cleanEmail,
        name: name.trim() || cleanEmail.split("@")[0],
        asAdmin: isAdm,
        mode,
      });

      if (!res.success) {
        setError(res.error || "Đăng nhập với Google thất bại!");
        setLoading(false);
        return;
      }

      setLoading(false);
      onClose();

      if (isAdm) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 600);
  };

  const handleRealOAuth = async () => {
    setError(null);
    setOauthLoading(true);
    try {
      const res = await signInWithGoogle();
      if (res?.error) {
        setError("Cổng OAuth Google đang được kết nối. Bạn cũng có thể nhập địa chỉ Gmail bên dưới để tiếp tục.");
        setOauthLoading(false);
      }
    } catch {
      setError("Không thể kết nối đến máy chủ Google. Vui lòng nhập địa chỉ Gmail bên dưới.");
      setOauthLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
      <div
        className="bg-white rounded-[24px] max-w-md w-full overflow-hidden shadow-2xl border border-slate-200 animate-fade-in"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Google Header */}
        <div className="p-6 pb-4 border-b border-slate-100 relative">
          <button
            onClick={onClose}
            className="absolute right-4 top-4 p-1 text-slate-400 hover:text-slate-700 rounded-full transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            {/* Google G Logo */}
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-xs shrink-0">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
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
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base">
                {mode === "login" ? "Đăng nhập với Google" : "Đăng ký với Google"}
              </h3>
              <p className="text-xs text-slate-500">
                Truy cập hệ thống tài liệu <strong className="text-blue-600">TailieuHue Huế</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {error && (
            <div className="p-3.5 bg-red-50 border border-red-200 rounded-[12px] flex items-start gap-2 text-xs text-red-700 animate-fade-in font-semibold">
              <AlertCircle className="w-4 h-4 text-red-600 shrink-0 mt-0.5" />
              <p className="flex-1 leading-relaxed">{error}</p>
            </div>
          )}

          {/* Nút Đăng nhập trực tiếp Google OAuth qua Supabase */}
          <button
            type="button"
            disabled={oauthLoading}
            onClick={handleRealOAuth}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-[12px] border border-slate-300 hover:border-blue-500 bg-white hover:bg-blue-50/40 text-slate-800 text-xs font-bold transition-all shadow-xs cursor-pointer"
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
            {oauthLoading ? "Đang chuyển hướng Google..." : "Mở cửa sổ đăng nhập Google"}
          </button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200" />
            </div>
            <div className="relative flex justify-center">
              <span className="px-3 bg-white text-[11px] text-slate-400 font-medium">
                hoặc nhập địa chỉ Gmail của bạn
              </span>
            </div>
          </div>

          {/* Form nhập địa chỉ Gmail cá nhân của sinh viên */}
          <form onSubmit={handleEmailSubmit} className="space-y-3">
            {mode === "register" && (
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Họ và tên của bạn
                </label>
                <input
                  type="text"
                  required
                  placeholder="Ví dụ: Nguyễn Văn A"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (error) setError(null);
                  }}
                  className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors"
                />
              </div>
            )}

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Địa chỉ Gmail
              </label>
              <input
                type="email"
                required
                placeholder="diachi.email@gmail.com"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  if (error) setError(null);
                }}
                className="w-full px-3.5 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-xs focus:outline-none focus:border-blue-500 focus:bg-white transition-colors font-medium"
              />
            </div>

            <button
              type="submit"
              disabled={loading || !email.trim()}
              className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white rounded-[10px] text-xs font-bold transition-colors cursor-pointer shadow-xs flex items-center justify-center gap-2"
            >
              {loading ? (
                "Đang xác thực..."
              ) : (
                <>
                  <span>{mode === "login" ? "Tiếp tục đăng nhập" : "Tạo tài khoản với Gmail"}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </>
              )}
            </button>
          </form>

          <div className="pt-2 text-[11px] text-slate-400 text-center leading-relaxed">
            Hệ thống bảo mật dữ liệu theo tiêu chuẩn trường Đại học Kinh tế Huế.
          </div>
        </div>
      </div>
    </div>
  );
}
