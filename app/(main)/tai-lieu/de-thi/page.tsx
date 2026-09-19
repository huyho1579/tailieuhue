"use client";
import { useState, useEffect } from "react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useAuthStore } from "@/lib/store/auth";
import Link from "next/link";
import { ChevronRight, Plus, FileText } from "lucide-react";

export default function DeThiPage() {
  const { documents } = useDocumentStore();
  const { isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const deThi = documents.filter((d) => d.type === "de-thi");

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      <nav className="flex items-center justify-between text-xs text-slate-500 mb-6 flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-slate-700">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/tai-lieu" className="hover:text-slate-700">
            Kho tài liệu
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-semibold">Đề thi các năm HCE</span>
        </div>

        {mounted && isAdmin && (
          <Link
            href="/tai-lieu/dang-tai?type=de-thi"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[8px] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Đăng đề thi mới
          </Link>
        )}
      </nav>

      <div className="mb-8">
        <div className="inline-block px-3 py-1 bg-amber-50 text-amber-800 text-xs font-semibold rounded-full mb-2">
          Đề thi chính thức • Kèm đáp án
        </div>
        <h1 className="text-2xl md:text-3xl font-bold text-slate-950">
          Đề thi Đại học Kinh tế Huế
        </h1>
        <p className="text-slate-500 text-sm mt-1">
          Tổng hợp {deThi.length} đề thi chính thức kèm đáp án và hướng dẫn giải chi tiết
        </p>
      </div>

      {deThi.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {deThi.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-[20px] p-12 text-center max-w-md mx-auto">
          <FileText className="w-10 h-10 text-slate-400 mx-auto mb-3" />
          <p className="font-bold text-slate-800 text-sm">Chưa có đề thi nào</p>
          <p className="text-xs text-slate-500 mt-1">Các đề thi mới đăng tải sẽ hiển thị tại đây.</p>
        </div>
      )}
    </div>
  );
}
