"use client";
import Link from "next/link";
import { Star, Eye, Download, FileText, ArrowRight, ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { formatPrice } from "@/lib/utils/format";
import type { Document } from "@/lib/data/mock";

interface DocumentCardProps {
  doc: Document & { coverImage?: string; coverTheme?: string; department?: string };
  className?: string;
}

const TYPE_LABELS: Record<Document["type"], string> = {
  "de-cuong": "Đề cương",
  "de-thi": "Đề thi",
  slide: "Slide bài giảng",
  "giao-trinh": "Giáo trình",
};

export function DocumentCard({ doc, className }: DocumentCardProps) {
  const coverUrl = doc.coverImage || doc.thumbnail;
  const isFree = !doc.isPro || doc.price === 0;

  return (
    <div
      className={cn(
        "group relative flex flex-col bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[20px] overflow-hidden shadow-xs",
        "hover:border-blue-400 dark:hover:border-blue-600 hover:shadow-[0_12px_32px_rgba(30,64,175,0.08)] dark:hover:shadow-[0_12px_32px_rgba(0,0,0,0.4)]",
        "transition-all duration-300 hover:-translate-y-1",
        className
      )}
    >
      {/* Top Accent Line (Gold for PRO, Blue for Free) */}
      <div
        className={cn(
          "h-1.5 w-full",
          doc.isPro
            ? "bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600"
            : "bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-500"
        )}
      />

      {/* Card Header / Image or Visual Thumbnail */}
      <div className="relative h-44 bg-gradient-to-br from-blue-50 via-slate-50 to-indigo-50/40 dark:from-slate-850 dark:via-slate-900 dark:to-blue-950/40 flex items-center justify-center overflow-hidden border-b border-slate-100 dark:border-slate-800">
        {coverUrl ? (
          <img
            src={coverUrl}
            alt={doc.title}
            className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="flex flex-col items-center gap-2 text-center px-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100/80 dark:bg-blue-950/80 text-blue-600 dark:text-blue-400 flex items-center justify-center shadow-xs group-hover:scale-110 transition-transform">
              <FileText className="w-6 h-6" />
            </div>
            <span className="text-[11px] font-bold text-slate-500 dark:text-slate-400 bg-white/80 dark:bg-slate-800/80 px-2.5 py-0.5 rounded-full border border-slate-200/60 dark:border-slate-700">
              {doc.pages} trang tài liệu
            </span>
          </div>
        )}

        {/* Badges: PRO/FREE and Type */}
        <div className="absolute top-3 left-3 flex items-center gap-1.5 z-10">
          {doc.isPro ? (
            <span className="inline-flex items-center gap-1 text-[11px] font-extrabold px-2.5 py-1 rounded-full bg-amber-400 text-slate-950 shadow-sm">
              <ShieldCheck className="w-3 h-3" />
              PRO
            </span>
          ) : (
            <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-emerald-500 text-white shadow-sm">
              MIỄN PHÍ
            </span>
          )}
        </div>

        <div className="absolute top-3 right-3 z-10">
          <span className="text-[11px] font-bold px-2.5 py-1 rounded-full bg-white/95 dark:bg-slate-800/95 text-slate-800 dark:text-slate-200 border border-slate-200/80 dark:border-slate-700 shadow-xs backdrop-blur-sm">
            {TYPE_LABELS[doc.type] || "Tài liệu"}
          </span>
        </div>
      </div>

      {/* Content Body */}
      <div className="flex flex-col flex-1 p-5 gap-3">
        {/* Subject & Dept Tags */}
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-[11px] font-bold px-2.5 py-0.5 rounded-md bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-300 border border-blue-200/60 dark:border-blue-900/60">
            {doc.subject}
          </span>
          <span className="text-[11px] text-slate-500 dark:text-slate-400">
            ĐH Kinh tế Huế
          </span>
        </div>

        {/* Title */}
        <Link
          href={`/tai-lieu/${doc.slug}`}
          className="font-bold text-slate-900 dark:text-white text-base leading-snug line-clamp-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          {doc.title}
        </Link>

        {/* Short info */}
        <div className="flex items-center gap-3 text-xs text-slate-500 dark:text-slate-400 mt-auto pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            {doc.rating > 0 ? doc.rating.toFixed(1) : "5.0"}
          </span>
          <span>•</span>
          <span className="flex items-center gap-1">
            <Eye className="w-3.5 h-3.5 text-slate-400" />
            {doc.viewCount || 0} lượt xem
          </span>
          <span className="ml-auto font-bold text-xs">
            {isFree ? (
              <span className="text-emerald-600 dark:text-emerald-400 font-extrabold">0đ</span>
            ) : (
              <span className="text-blue-700 dark:text-blue-400 font-extrabold">{formatPrice(doc.price)}</span>
            )}
          </span>
        </div>

        {/* Action Button - Yellow / Gold prominent button like in screenshot */}
        <Link
          href={`/tai-lieu/${doc.slug}`}
          className={cn(
            "w-full py-2.5 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-xs cursor-pointer",
            doc.isPro
              ? "bg-amber-400 hover:bg-amber-500 text-slate-950 shadow-amber-400/20 hover:shadow-md"
              : "bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20 hover:shadow-md"
          )}
        >
          <span>Xem tài liệu</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
