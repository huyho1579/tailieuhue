"use client";
import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  ShoppingBag,
  Sparkles,
  Info,
  ChevronRight,
  X,
} from "lucide-react";
import { useNotificationStore, Notification } from "@/lib/store/notificationStore";
import { cn } from "@/lib/utils/cn";

export function NotificationDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { notifications, markAllRead, markRead, clearAll, unreadCount } =
    useNotificationStore();

  const count = unreadCount();

  useEffect(() => {
    setMounted(true);
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const formatTime = (isoString: string) => {
    try {
      const diff = Date.now() - new Date(isoString).getTime();
      const mins = Math.floor(diff / 60000);
      if (mins < 1) return "Vừa xong";
      if (mins < 60) return `${mins} phút trước`;
      const hours = Math.floor(mins / 60);
      if (hours < 24) return `${hours} giờ trước`;
      const days = Math.floor(hours / 24);
      return `${days} ngày trước`;
    } catch {
      return "Gần đây";
    }
  };

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "purchase":
        return <ShoppingBag className="w-4 h-4 text-emerald-600" />;
      case "system":
        return <Sparkles className="w-4 h-4 text-amber-500" />;
      default:
        return <Info className="w-4 h-4 text-blue-600" />;
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Bell Button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          "relative w-9 h-9 flex items-center justify-center rounded-xl transition-all cursor-pointer",
          isOpen
            ? "bg-blue-600 text-white shadow-md shadow-blue-500/20"
            : "text-slate-600 dark:text-slate-300 hover:text-slate-950 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800"
        )}
        title="Thông báo hệ thống"
      >
        <Bell className="w-4 h-4" />
        {mounted && count > 0 && (
          <span className="absolute -top-0.5 -right-0.5 min-w-[18px] h-[18px] px-1 bg-red-500 text-white text-[10px] font-extrabold rounded-full flex items-center justify-center ring-2 ring-white dark:ring-slate-900 animate-pulse">
            {count > 9 ? "9+" : count}
          </span>
        )}
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div className="absolute right-0 mt-2.5 w-[360px] sm:w-[380px] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl shadow-2xl z-50 overflow-hidden animate-fade-in">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 p-4 text-white">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 bg-white/15 rounded-lg flex items-center justify-center">
                  <Bell className="w-4 h-4 text-amber-300" />
                </div>
                <div>
                  <h3 className="font-bold text-sm leading-tight">Thông báo</h3>
                  <p className="text-[11px] text-blue-100 font-medium">
                    {count > 0 ? `${count} thông báo chưa đọc` : "Đã đọc tất cả"}
                  </p>
                </div>
              </div>

              {count > 0 && (
                <button
                  type="button"
                  onClick={markAllRead}
                  className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg transition-colors cursor-pointer text-blue-50"
                  title="Đánh dấu tất cả là đã đọc"
                >
                  <CheckCheck className="w-3.5 h-3.5" />
                  Đọc hết
                </button>
              )}
            </div>
          </div>

          {/* Notification List */}
          <div className="max-h-[380px] overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <div className="w-12 h-12 rounded-full bg-blue-50 dark:bg-slate-800 flex items-center justify-center mx-auto mb-2 text-blue-600 dark:text-blue-400">
                  <Check className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Không có thông báo mới
                </p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Các cập nhật về đề cương và tài liệu sẽ hiện tại đây.
                </p>
              </div>
            ) : (
              notifications.map((notif) => (
                <div
                  key={notif.id}
                  onClick={() => markRead(notif.id)}
                  className={cn(
                    "p-3.5 flex items-start gap-3 transition-colors cursor-pointer group hover:bg-slate-50 dark:hover:bg-slate-800/50",
                    !notif.read && "bg-blue-50/50 dark:bg-blue-950/20"
                  )}
                >
                  {/* Icon */}
                  <div
                    className={cn(
                      "w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 shadow-2xs",
                      notif.type === "purchase"
                        ? "bg-emerald-50 dark:bg-emerald-950/60"
                        : notif.type === "system"
                        ? "bg-amber-50 dark:bg-amber-950/60"
                        : "bg-blue-50 dark:bg-blue-950/60"
                    )}
                  >
                    {getIcon(notif.type)}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1 mb-0.5">
                      <p
                        className={cn(
                          "text-xs font-bold truncate",
                          notif.read
                            ? "text-slate-700 dark:text-slate-300"
                            : "text-slate-900 dark:text-white"
                        )}
                      >
                        {notif.title}
                      </p>
                      {!notif.read && (
                        <span className="w-2 h-2 rounded-full bg-red-500 shrink-0" />
                      )}
                    </div>

                    <p className="text-[12px] text-slate-600 dark:text-slate-400 leading-snug line-clamp-2">
                      {notif.message}
                    </p>

                    <div className="flex items-center justify-between mt-1.5 text-[10px] text-slate-400">
                      <span>{formatTime(notif.createdAt)}</span>
                      {notif.link && (
                        <Link
                          href={notif.link}
                          onClick={() => setIsOpen(false)}
                          className="inline-flex items-center gap-0.5 text-blue-600 dark:text-blue-400 font-bold hover:underline"
                        >
                          Xem chi tiết <ChevronRight className="w-3 h-3" />
                        </Link>
                      )}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="p-2.5 bg-slate-50 dark:bg-slate-800/40 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500 dark:text-slate-400 pl-2">
                Hệ thống thông báo TailieuHue
              </span>
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-600 dark:text-red-400 hover:text-red-700 py-1 px-2.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors cursor-pointer"
              >
                <Trash2 className="w-3 h-3" /> Xóa tất cả
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
