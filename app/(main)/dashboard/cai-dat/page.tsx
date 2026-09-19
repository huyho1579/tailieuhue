"use client";
import { useState, useEffect } from "react";
import { Camera, Save, Check, ShieldCheck, GraduationCap } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function SettingsPage() {
  const { currentUser, updateProfile, isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [form, setForm] = useState({
    name: "",
    username: "",
    email: "",
    university: "Đại học Kinh tế Huế",
    bio: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (currentUser) {
      const savedBio =
        localStorage.getItem(`edudocs-bio-${currentUser.email}`) ||
        (currentUser.role === "admin"
          ? "Quản trị viên hệ thống EduDocs — Sinh viên Đại học Kinh tế, Đại học Huế."
          : "Sinh viên Đại học Kinh tế, Đại học Huế.");

      setForm({
        name: currentUser.name || "",
        username: currentUser.username || (currentUser.email ? currentUser.email.split("@")[0] : ""),
        email: currentUser.email || "",
        university: currentUser.university || "Đại học Kinh tế Huế",
        bio: savedBio,
      });
    }
  }, [currentUser]);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email.trim()) return;

    updateProfile({
      name: form.name.trim() || (isAdmin ? "Quản trị viên" : "Sinh viên HCE"),
      username: form.username.trim() || form.email.split("@")[0],
      email: form.email.trim(),
      university: form.university,
    });

    if (form.bio) {
      localStorage.setItem(`edudocs-bio-${form.email.trim()}`, form.bio);
    }

    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const displayName = form.name || currentUser?.name || "Người dùng";
  const displayEmail = form.email || currentUser?.email || "Chưa thiết lập email";
  const initials = displayName ? displayName.slice(0, 2).toUpperCase() : "SV";

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Cài đặt tài khoản</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          {isAdmin
            ? "Quản lý thông tin cá nhân và tài khoản quản trị viên của bạn"
            : "Quản lý thông tin hồ sơ sinh viên của bạn tại EduDocs Huế"}
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar & Vai trò */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
          <h2 className="font-bold text-slate-900 text-base mb-4">Ảnh đại diện & Vai trò</h2>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-xl shadow-xs">
                {mounted ? initials : "SV"}
              </div>
              <button
                type="button"
                className="absolute bottom-0 right-0 w-7 h-7 bg-blue-600 rounded-full flex items-center justify-center text-white border-2 border-white cursor-pointer hover:bg-blue-700 transition-colors"
                title="Đổi ảnh đại diện"
              >
                <Camera className="w-3.5 h-3.5" />
              </button>
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-bold text-slate-900 text-base">{displayName}</span>
                {isAdmin ? (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quản trị viên (Admin)
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                    <GraduationCap className="w-3.5 h-3.5" /> Sinh viên HCE
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500">
                {isAdmin ? "Email quản trị hệ thống:" : "Email tài khoản:"}{" "}
                <strong className="text-slate-700 font-semibold">{displayEmail}</strong>
              </p>
              <p className="text-xs text-blue-600 font-medium mt-1">Đại học Kinh tế Huế</p>
            </div>
          </div>
        </div>

        {/* Profile info */}
        <form
          onSubmit={handleSave}
          className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs"
        >
          <h2 className="font-bold text-slate-900 text-base mb-5">Thông tin cá nhân</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Họ và tên
              </label>
              <input
                type="text"
                required
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Nhập họ và tên..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Tên người dùng (@username)
              </label>
              <input
                type="text"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Địa chỉ Email
              </label>
              <input
                type="email"
                required
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="email@gmail.com"
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Trường đại học
              </label>
              <input
                type="text"
                value={form.university}
                disabled
                className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm text-slate-700 font-semibold cursor-not-allowed"
              />
            </div>

            <div className="sm:col-span-2">
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Tiểu sử giới thiệu
              </label>
              <textarea
                value={form.bio}
                onChange={(e) => setForm({ ...form, bio: e.target.value })}
                rows={3}
                placeholder="Giới thiệu đôi nét về bản thân, chuyên ngành..."
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
            {saved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5 animate-fade-in">
                <Check className="w-4 h-4 text-emerald-600" />
                Đã lưu thay đổi thành công! F5 thông tin vẫn sẽ giữ nguyên.
              </span>
            ) : (
              <span className="text-xs text-slate-400">
                Nhấn lưu để cập nhật thông tin hiển thị trên toàn hệ thống
              </span>
            )}
            <button
              type="submit"
              className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-bold rounded-[10px] transition-colors cursor-pointer shadow-xs"
            >
              <Save className="w-4 h-4" />
              Lưu thay đổi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
