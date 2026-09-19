"use client";
import { useState } from "react";
import { Camera, Save, Check, ShieldCheck } from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";

export default function SettingsPage() {
  const { currentUser } = useAuthStore();
  const [form, setForm] = useState({
    name: currentUser?.name || "Hồ Huy",
    username: currentUser?.username || "huyho",
    email: currentUser?.email || "huyho1579@gmail.com",
    university: "Đại học Kinh tế Huế",
    bio: "Quản trị viên hệ thống EduDocs — Sinh viên Đại học Kinh tế, Đại học Huế.",
  });
  const [saved, setSaved] = useState(false);

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Cài đặt tài khoản</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Quản lý thông tin cá nhân và tài khoản quản trị viên của bạn
        </p>
      </div>

      <div className="space-y-6">
        {/* Avatar & Vai trò */}
        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
          <h2 className="font-bold text-slate-900 text-base mb-4">Ảnh đại diện & Vai trò</h2>
          <div className="flex items-center gap-5 flex-wrap">
            <div className="relative">
              <div className="w-20 h-20 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-xl shadow-xs">
                HH
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
                <span className="font-bold text-slate-900 text-base">{form.name}</span>
                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quản trị viên (Admin)
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Email quản trị hệ thống: <strong className="text-slate-700 font-semibold">{form.email}</strong>
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
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-1.5">
                Địa chỉ Email
              </label>
              <input
                type="email"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
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
                className="w-full px-4 py-2.5 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100 transition-all resize-none"
              />
            </div>
          </div>

          <div className="flex items-center justify-between mt-6 pt-5 border-t border-slate-100">
            {saved ? (
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-1.5">
                <Check className="w-4 h-4 text-emerald-600" />
                Đã lưu thay đổi thành công!
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
