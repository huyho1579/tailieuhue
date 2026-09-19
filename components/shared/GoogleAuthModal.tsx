"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { X, Check, ShieldCheck, UserPlus, ArrowRight } from "lucide-react";
import { useAuthStore, ADMIN_CREDENTIALS } from "@/lib/store/auth";
import { signInWithGoogle, isSupabaseConfigured } from "@/lib/supabase/client";

interface GoogleAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode?: "login" | "register";
}

const PRESET_ACCOUNTS = [
  {
    name: "Hồ Huy",
    email: "huyho1579@gmail.com",
    avatarBg: "bg-blue-600",
    initials: "HH",
    tag: "Tài khoản Quản trị viên (Admin)",
    isAdmin: true,
  },
  {
    name: "Nguyễn Văn An",
    email: "nguyenvanan.hce@gmail.com",
    avatarBg: "bg-emerald-600",
    initials: "NA",
    tag: "Sinh viên ĐH Kinh tế Huế",
    isAdmin: false,
  },
  {
    name: "Trần Thị Thu Hà",
    email: "thuha.kinhte@gmail.com",
    avatarBg: "bg-purple-600",
    initials: "TH",
    tag: "Sinh viên ĐH Kinh tế Huế",
    isAdmin: false,
  },
];

export function GoogleAuthModal({
  isOpen,
  onClose,
  mode = "login",
}: GoogleAuthModalProps) {
  const router = useRouter();
  const { loginWithGoogle } = useAuthStore();
  const [selectedEmail, setSelectedEmail] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customName, setCustomName] = useState("");
  const [customEmail, setCustomEmail] = useState("");
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSelectAccount = (account: (typeof PRESET_ACCOUNTS)[0]) => {
    setSelectedEmail(account.email);
    setLoading(true);

    setTimeout(() => {
      loginWithGoogle({
        email: account.email,
        name: account.name,
        asAdmin: account.isAdmin,
      });
      setLoading(false);
      onClose();

      if (account.isAdmin) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 700);
  };

  const handleCustomGoogleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customEmail.trim()) return;

    setLoading(true);
    setTimeout(() => {
      const isAdm = customEmail.trim().toLowerCase() === ADMIN_CREDENTIALS.email;
      loginWithGoogle({
        email: customEmail.trim(),
        name: customName.trim() || customEmail.split("@")[0],
        asAdmin: isAdm,
      });
      setLoading(false);
      onClose();

      if (isAdm) {
        router.push("/admin");
      } else {
        router.push("/dashboard");
      }
    }, 700);
  };

  const handleRealOAuth = async () => {
    setLoading(true);
    const res = await signInWithGoogle();
    if (res?.error) {
      alert("Chưa cấu hình Supabase Client ID/Secret trên file .env.local. Đang sử dụng chế độ đăng nhập Google trực tiếp mô phỏng.");
      setLoading(false);
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
            <div className="w-10 h-10 rounded-full border border-slate-200 flex items-center justify-center bg-white shadow-xs">
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
                {mode === "login" ? "Đăng nhập bằng Google" : "Đăng ký bằng Google"}
              </h3>
              <p className="text-xs text-slate-500">
                Để tiếp tục tới <strong className="text-blue-600">EduDocs Huế</strong>
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <p className="text-xs text-slate-500 font-medium">
            Chọn tài khoản Google của bạn để liên kết và đăng nhập:
          </p>

          {/* List Google Accounts */}
          <div className="space-y-2">
            {PRESET_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                disabled={loading}
                onClick={() => handleSelectAccount(acc)}
                className={`w-full flex items-center gap-3.5 p-3 rounded-[14px] border text-left transition-all cursor-pointer ${
                  selectedEmail === acc.email
                    ? "border-blue-500 bg-blue-50/70"
                    : "border-slate-200 hover:border-slate-300 hover:bg-slate-50"
                }`}
              >
                <div
                  className={`w-10 h-10 ${acc.avatarBg} text-white font-bold rounded-full flex items-center justify-center text-sm shadow-xs shrink-0`}
                >
                  {acc.initials}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-sm text-slate-900 truncate">
                      {acc.name}
                    </span>
                    {acc.isAdmin && (
                      <span className="text-[10px] bg-amber-100 text-amber-900 font-bold px-2 py-0.5 rounded-full flex items-center gap-0.5">
                        <ShieldCheck className="w-3 h-3 text-amber-600" /> Admin
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 truncate">{acc.email}</p>
                  <span className="text-[10px] text-blue-600 font-medium">{acc.tag}</span>
                </div>

                {selectedEmail === acc.email && (
                  <Check className="w-5 h-5 text-blue-600 shrink-0" />
                )}
              </button>
            ))}
          </div>

          {/* Nhập tài khoản Google khác */}
          {!showCustomInput ? (
            <button
              type="button"
              onClick={() => setShowCustomInput(true)}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 text-xs font-semibold text-slate-700 hover:text-blue-600 bg-slate-50 hover:bg-blue-50/50 rounded-[12px] border border-slate-200 border-dashed transition-colors cursor-pointer"
            >
              <UserPlus className="w-4 h-4" />
              Sử dụng tài khoản Google khác của bạn...
            </button>
          ) : (
            <form
              onSubmit={handleCustomGoogleLogin}
              className="p-4 bg-slate-50 border border-slate-200 rounded-[14px] space-y-3"
            >
              <span className="text-xs font-bold text-slate-800 block">
                Nhập tài khoản Google của bạn:
              </span>
              <div>
                <input
                  type="text"
                  placeholder="Họ và tên của bạn"
                  value={customName}
                  onChange={(e) => setCustomName(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div>
                <input
                  type="email"
                  required
                  placeholder="diachi.email@gmail.com"
                  value={customEmail}
                  onChange={(e) => setCustomEmail(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-200 rounded-[8px] text-xs focus:outline-none focus:border-blue-400"
                />
              </div>
              <div className="flex items-center justify-end gap-2 pt-1">
                <button
                  type="button"
                  onClick={() => setShowCustomInput(false)}
                  className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-800"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  disabled={loading || !customEmail.trim()}
                  className="px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] text-xs font-bold transition-colors cursor-pointer"
                >
                  Tiếp tục
                </button>
              </div>
            </form>
          )}

          {/* Real Supabase OAuth button if configured */}
          {isSupabaseConfigured && (
            <button
              type="button"
              onClick={handleRealOAuth}
              className="w-full py-2.5 text-xs font-semibold text-blue-600 border border-blue-200 rounded-[10px] hover:bg-blue-50 transition-colors"
            >
              Đăng nhập qua Cổng OAuth Google trực tiếp (Supabase)
            </button>
          )}

          {loading && (
            <div className="flex items-center justify-center gap-2 py-2 text-xs font-semibold text-blue-600 animate-pulse">
              <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
              Đang đồng bộ hóa hồ sơ Google...
            </div>
          )}

          <div className="pt-2 text-[11px] text-slate-400 text-center leading-relaxed">
            Để tiếp tục, Google sẽ chia sẻ tên, địa chỉ email, tùy chọn ngôn ngữ và ảnh hồ sơ
            của bạn với EduDocs Huế.
          </div>
        </div>
      </div>
    </div>
  );
}
