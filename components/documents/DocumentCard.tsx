"use client";
import Link from "next/link";
import { Star, Eye, Download, FileText, ArrowRight } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Badge } from "@/components/shared/Badge";
import { formatPrice } from "@/lib/utils/format";
import type { Document } from "@/lib/data/mock";

interface DocumentCardProps {
  doc: Document & { coverImage?: string; coverTheme?: string };
  className?: string;
}

const TYPE_LABELS: Record<Document["type"], string> = {
  "de-cuong": "Đề cương",
  "de-thi": "Đề thi",
  slide: "Slide bài giảng",
  "giao-trinh": "Giáo trình",
};

const TYPE_COLORS: Record<Document["type"], string> = {
  "de-cuong": "text-blue-600 bg-blue-50 border border-blue-100",
  "de-thi": "text-purple-600 bg-purple-50 border border-purple-100",
  slide: "text-emerald-600 bg-emerald-50 border border-emerald-100",
  "giao-trinh": "text-amber-600 bg-amber-50 border border-amber-100",
};

export function DocumentCard({ doc, className }: DocumentCardProps) {
  const coverUrl = doc.coverImage || doc.thumbnail;

  return (
    <Link
      href={`/tai-lieu/${doc.slug}`}
      className={cn(
        "group flex flex-col bg-white border border-slate-200 rounded-[16px] overflow-hidden",
        "hover:border-blue-300 hover:shadow-[0_8px_30px_rgba(15,23,42,0.08)]",
        "transition-all duration-200 hover:-translate-y-0.5",
        className
      )}
    >
      {/* Thumbnail / Ảnh nền bìa */}
      <div className="relative h-40 bg-gradient-to-br from-slate-50 via-blue-50/40 to-slate-100 flex items-center justify-center overflow-hidden border-b border-slate-100">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={doc.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300 opacity-90"
          />
        ) : (
          <div className="flex flex-col items-center gap-1.5 opacity-60 group-hover:opacity-80 transition-opacity">
            <FileText className="w-12 h-12 text-blue-500" strokeWidth={1.5} />
            <span className="text-xs text-slate-500 font-medium">{doc.pages} trang</span>
          </div>
        )}

        {/* Overlay gradient nếu có ảnh */}
        {coverUrl && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30" />
        )}

        {/* Badge FREE / PRO */}
        <div className="absolute top-3 left-3 flex gap-1.5 z-10">
          <Badge variant={doc.isPro ? "pro" : "free"}>
            {doc.isPro ? "PRO" : "MIỄN PHÍ"}
          </Badge>
        </div>

        {/* Type Badge */}
        <div className="absolute top-3 right-3 z-10">
          <span
            className={cn(
              "text-[11px] font-semibold px-2.5 py-0.5 rounded-full shadow-xs backdrop-blur-xs",
              coverUrl ? "bg-white/90 text-slate-900" : TYPE_COLORS[doc.type]
            )}
          >
            {TYPE_LABELS[doc.type]}
          </span>
        </div>

        {/* Số trang góc dưới nếu có ảnh */}
        {coverUrl && (
          <div className="absolute bottom-2.5 left-3 z-10 text-[11px] text-white/90 font-medium drop-shadow-xs">
            {doc.pages} trang
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-col flex-1 p-4 gap-2">
        <h3 className="font-semibold text-slate-900 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors">
          {doc.title}
        </h3>

        <div className="text-xs text-slate-500 space-y-0.5">
          <div className="font-medium text-slate-700">{doc.subject}</div>
          <div className="text-blue-600 font-medium">Đại học Kinh tế Huế</div>
        </div>

        {/* Stats thực tế - không ảo */}
        <div className="flex items-center gap-3 text-xs text-slate-500 mt-auto pt-2 border-t border-slate-100">
          {doc.rating > 0 ? (
            <span className="flex items-center gap-1">
              <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              <span className="font-medium text-slate-700">{doc.rating}</span>
            </span>
          ) : (
            <span className="text-slate-400 italic text-[11px]">Chưa có đánh giá</span>
          )}

          <span className="flex items-center gap-1 ml-auto">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            <span>{doc.viewCount} lượt xem</span>
          </span>

          <span className="flex items-center gap-1">
            <Download className="w-3.5 h-3.5 text-slate-400" />
            <span>{doc.downloadCount}</span>
          </span>
        </div>

        {/* Price & Action */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100 mt-1">
          <span
            className={cn(
              "font-bold text-sm",
              doc.isPro ? "text-slate-900" : "text-emerald-600"
            )}
          >
            {formatPrice(doc.price)}
          </span>
          <span className="flex items-center gap-1 text-xs font-semibold text-blue-600 group-hover:gap-1.5 transition-all">
            Xem tài liệu
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  );
}
