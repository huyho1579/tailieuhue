"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ShoppingBag,
  ExternalLink,
  Copy,
  Check,
  FileText,
  Calendar,
  ArrowRight,
  FolderOpen,
} from "lucide-react";
import { useLibraryStore } from "@/lib/store/libraryStore";
import { formatPrice } from "@/lib/utils/format";

export default function PurchasedPage() {
  const { purchasedDocs } = useLibraryStore();
  const [mounted, setMounted] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleCopyLink = (id: string, url: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(url);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  };

  if (!mounted) {
    return <div className="p-6 text-sm text-slate-500">Đang tải danh sách tài liệu...</div>;
  }

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Tài liệu đã mua</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Danh sách các tài liệu học tập bạn đã sở hữu kèm Link Google Drive xem và tải về trọn đời
          </p>
        </div>
        <span className="text-xs font-bold bg-blue-50 text-blue-700 px-3 py-1.5 rounded-full border border-blue-200/60">
          {purchasedDocs.length} tài liệu trong kho
        </span>
      </div>

      {purchasedDocs.length === 0 ? (
        <div className="text-center py-16 bg-white border border-slate-200 rounded-[20px] p-8 shadow-xs">
          <div className="w-16 h-16 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-7 h-7" />
          </div>
          <h2 className="text-lg font-bold text-slate-900 mb-1">Bạn chưa có tài liệu nào trong kho</h2>
          <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6 leading-relaxed">
            Khi mua hoặc mở khóa tài liệu đề cương, đề thi của ĐH Kinh tế Huế, tài liệu kèm link Google Drive sẽ tự động xuất hiện tại đây.
          </p>
          <Link
            href="/tai-lieu"
            className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-[10px] transition-colors shadow-xs"
          >
            Khám phá kho tài liệu HCE
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {purchasedDocs.map((doc) => (
            <div
              key={doc.id}
              className="bg-white border border-slate-200 rounded-[20px] p-5 shadow-xs flex flex-col justify-between hover:border-blue-300 transition-all group"
            >
              <div>
                {/* Header card */}
                <div className="flex items-start justify-between gap-3 mb-3">
                  <div className="w-10 h-10 rounded-[10px] bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[11px] font-bold text-blue-600 uppercase tracking-wide">
                      {doc.subject}
                    </span>
                    <h3 className="font-bold text-slate-950 text-sm leading-snug line-clamp-2 mt-0.5">
                      {doc.title}
                    </h3>
                  </div>
                </div>

                {/* Metadata */}
                <div className="flex items-center gap-3 text-xs text-slate-500 pb-3 border-b border-slate-100">
                  <span>{doc.pages} trang</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-semibold">
                    {doc.price > 0 ? `Đã mua (${formatPrice(doc.price)})` : "Miễn phí"}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1 text-slate-400">
                    <Calendar className="w-3 h-3" />
                    {new Date(doc.purchasedAt).toLocaleDateString("vi-VN")}
                  </span>
                </div>

                {/* Drive Link Box */}
                <div className="mt-3 p-3 bg-slate-50 rounded-[12px] border border-slate-200/80 space-y-1.5">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                    Link Google Drive lưu trữ:
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-slate-700 font-mono truncate flex-1">
                      {doc.driveUrl}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleCopyLink(doc.id, doc.driveUrl)}
                      className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-white rounded-[6px] transition-colors cursor-pointer shrink-0"
                      title="Sao chép link"
                    >
                      {copiedId === doc.id ? (
                        <Check className="w-3.5 h-3.5 text-emerald-600" />
                      ) : (
                        <Copy className="w-3.5 h-3.5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center gap-2">
                <a
                  href={doc.driveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 py-2.5 px-3 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-[10px] transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                  Mở Link Google Drive ↗
                </a>

                <Link
                  href={`/tai-lieu/${doc.slug}`}
                  className="py-2.5 px-3 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-[10px] transition-colors"
                >
                  Chi tiết
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
