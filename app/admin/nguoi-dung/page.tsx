"use client";
import { useState, useEffect } from "react";
import { Users, ShieldCheck, User, Mail, CheckCircle, Clock } from "lucide-react";
import { useAuthStore, INITIAL_REGISTERED_USERS } from "@/lib/store/auth";
import { cn } from "@/lib/utils/cn";

export default function AdminNguoiDungPage() {
  const { registeredUsers, currentUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const users = registeredUsers && registeredUsers.length > 0
    ? registeredUsers
    : INITIAL_REGISTERED_USERS;

  if (!mounted) {
    return <div className="p-6 text-sm text-slate-500">Đang tải danh sách người dùng...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center gap-3 mb-1">
          <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
            <Users className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-950">Quản lý người dùng</h1>
            <p className="text-xs text-slate-500">Danh sách tất cả tài khoản đã đăng ký trên hệ thống TailieuHue</p>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Tổng tài khoản</div>
          <div className="text-2xl font-bold text-slate-950">{users.length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Quản trị viên</div>
          <div className="text-2xl font-bold text-amber-600">{users.filter(u => u.role === 'admin').length}</div>
        </div>
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-1">Sinh viên</div>
          <div className="text-2xl font-bold text-blue-600">{users.filter(u => u.role === 'user').length}</div>
        </div>
      </div>

      {/* User Table */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
        <h2 className="text-base font-bold text-slate-950 mb-4">Danh sách tài khoản đã đăng ký</h2>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Người dùng</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Vai trò</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {users.map((user) => {
                const isOnline = currentUser?.email === user.email;
                const isAdminUser = user.role === 'admin' || user.email === 'huyho1579@gmail.com';

                return (
                  <tr key={user.id} className={cn("hover:bg-slate-50/60 transition-colors", isAdminUser && "bg-amber-50/40")}>
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white",
                          isAdminUser ? "bg-amber-500" : "bg-blue-600"
                        )}>
                          {user.name.slice(0, 2).toUpperCase()}
                        </div>
                        <div>
                          <div className="font-semibold text-slate-900">{user.name}</div>
                          <div className="text-xs text-slate-500">@{user.username}</div>
                        </div>
                      </div>
                    </td>
                    <td className="py-3.5 px-4 text-slate-700 font-medium">{user.email}</td>
                    <td className="py-3.5 px-4">
                      {isAdminUser ? (
                        <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                          <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                          {user.email === 'huyho1579@gmail.com' ? 'Super Admin' : 'Admin'}
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-50 text-blue-700">
                          <User className="w-3.5 h-3.5" />
                          Sinh viên HCE
                        </span>
                      )}
                    </td>
                    <td className="py-3.5 px-4">
                      {isOnline ? (
                        <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                          <CheckCircle className="w-3.5 h-3.5" />
                          Đang hoạt động
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1 text-xs text-slate-400">
                          <Clock className="w-3.5 h-3.5" />
                          Ngoại tuyến
                        </span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
