"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  BookOpen,
  Bookmark,
  FileText,
  Star,
  Clock,
  ChevronRight,
  ShieldCheck,
  GraduationCap,
  ExternalLink,
} from "lucide-react";
import { useAuthStore } from "@/lib/store/auth";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { useDocumentStore } from "@/lib/store/documentStore";

export default function DashboardPage() {
  const { currentUser, isAdmin } = useAuthStore();
  const { purchasedDocs, savedDocIds } = useLibraryStore();
  const { documents } = useDocumentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const recentDocs = documents.slice(0, 3);
  const examDocs = documents.filter((d) => d.type === "de-thi" || d.isPro).slice(0, 3);

  const displayName = currentUser?.name || "Bạn";
  const displayEmail = currentUser?.email || "sinhvien@hce.edu.vn";

  const STATS = [
    {
      label: "Tài liệu đã mua",
      value: mounted ? `${purchasedDocs.length}` : "0",
      icon: BookOpen,
      href: "/dashboard/da-mua",
      color: "text-blue-600 bg-blue-50",
    },
    {
      label: "Tài liệu đã lưu",
      value: mounted ? `${savedDocIds.length}` : "0",
      icon: Bookmark,
      href: "/dashboard/da-luu",
      color: "text-amber-600 bg-amber-50",
    },
    {
      label: "Tài liệu hệ thống",
      value: mounted ? `${documents.length}` : "0",
      icon: FileText,
      href: "/tai-lieu",
      color: "text-emerald-600 bg-emerald-50",
    },
    {
      label: "Điểm đóng góp",
      value: "0",
      icon: Star,
      href: "#",
      color: "text-purple-600 bg-purple-50",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-950">
              Xin chào, {displayName} 👋
            </h1>
            {isAdmin ? (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300">
                <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quản trị viên
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                <GraduationCap className="w-3.5 h-3.5" /> Sinh viên HCE
              </span>
            )}
          </div>
          <p className="text-slate-500 text-sm">
            Tài khoản: <strong className="text-slate-800 font-semibold">{displayEmail}</strong> • Đại học Kinh tế Huế
          </p>
        </div>

        {isAdmin && (
          <Link
            href="/admin"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-[10px] transition-colors shadow-xs"
          >
            Mở bảng Quản trị Admin
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Stats - Đếm động từ Store thực tế */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {STATS.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="bg-white border border-slate-200 rounded-[16px] p-5 hover:border-blue-200 hover:shadow-xs transition-all group"
          >
            <div
              className={`w-10 h-10 rounded-[10px] flex items-center justify-center mb-3 ${stat.color}`}
            >
              <stat.icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-slate-950 mb-0.5">{stat.value}</div>
            <div className="text-xs text-slate-500 font-medium">{stat.label}</div>
          </Link>
        ))}
      </div>

      {/* Nếu đã mua tài liệu: Hiển thị nhanh tài liệu đã mua kèm nút Drive */}
      {mounted && purchasedDocs.length > 0 && (
        <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-slate-900 text-base flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              Tài liệu của bạn sẵn sàng trong Google Drive
            </h2>
            <Link
              href="/dashboard/da-mua"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả ({purchasedDocs.length}) <ChevronRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {purchasedDocs.slice(0, 2).map((p) => (
              <div
                key={p.id}
                className="p-3.5 bg-slate-50 rounded-[12px] border border-slate-200/80 flex items-center justify-between gap-3"
              >
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-bold text-slate-900 truncate">{p.title}</p>
                  <p className="text-[11px] text-slate-500 truncate">{p.subject}</p>
                </div>
                <a
                  href={p.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[8px] text-xs font-bold flex items-center gap-1 shrink-0 transition-colors shadow-xs"
                >
                  <ExternalLink className="w-3 h-3" />
                  Mở Drive ↗
                </a>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Kho tài liệu trường */}
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <Clock className="w-4 h-4 text-slate-400" />
              Tài liệu mới của ĐH Kinh tế Huế
            </h2>
            <Link
              href="/tai-lieu"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {recentDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/tai-lieu/${doc.slug}`}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-[10px] hover:bg-blue-50/60 transition-colors"
              >
                <div className="w-10 h-10 bg-blue-100 rounded-[8px] flex items-center justify-center shrink-0">
                  <BookOpen className="w-5 h-5 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.subject} • {doc.pages} trang</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Đề thi & Tài liệu trọng tâm */}
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-slate-900 text-sm flex items-center gap-2">
              <FileText className="w-4 h-4 text-amber-500" />
              Đề thi & Tài liệu ôn tập trọng tâm
            </h2>
            <Link
              href="/tai-lieu/de-thi"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              Xem tất cả <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="space-y-3">
            {examDocs.map((doc) => (
              <Link
                key={doc.id}
                href={`/tai-lieu/${doc.slug}`}
                className="flex items-center gap-3 p-3 bg-slate-50 rounded-[10px] hover:bg-blue-50/60 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-100 text-amber-700 rounded-[8px] flex items-center justify-center shrink-0 font-bold text-xs">
                  PRO
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-900 truncate">{doc.title}</p>
                  <p className="text-xs text-slate-500">{doc.subject} • {doc.pages} trang</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
