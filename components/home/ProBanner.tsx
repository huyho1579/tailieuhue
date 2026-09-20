import Link from "next/link";
import { Sparkles, BookOpen, ShieldCheck } from "lucide-react";

export function ProBanner() {
  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="relative overflow-hidden bg-blue-600 dark:bg-blue-700 rounded-[20px] px-8 py-10 md:py-12 shadow-lg shadow-blue-500/10 dark:shadow-none">
          {/* Background decoration */}
          <div className="absolute -right-20 -top-20 w-72 h-72 bg-blue-500 dark:bg-blue-600 rounded-full opacity-30 pointer-events-none" />
          <div className="absolute -right-8 -bottom-16 w-48 h-48 bg-blue-700 dark:bg-blue-800 rounded-full opacity-40 pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-3">
                <Sparkles className="w-5 h-5 text-blue-200" />
                <span className="text-blue-100 text-sm font-semibold tracking-wide uppercase">
                  EduDocs PRO — Đại học Kinh tế Huế
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2 leading-tight">
                Nâng cấp trải nghiệm
                <br />
                học tập và ôn thi của bạn.
              </h2>
              <p className="text-blue-100 text-sm leading-relaxed max-w-lg">
                Mở khóa toàn bộ kho đề cương PRO, lời giải đề thi chi tiết và sự hỗ trợ học tập đắc lực.
              </p>
              <div className="flex items-center gap-6 mt-4 text-sm text-blue-100 font-medium">
                <span className="flex items-center gap-1.5">
                  <BookOpen className="w-4 h-4 text-blue-200" />
                  Đầy đủ đề cương & đề thi HCE
                </span>
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-blue-200" />
                  Nội dung kiểm duyệt chuẩn xác
                </span>
              </div>
            </div>
            <Link
              href="/pro"
              className="shrink-0 px-6 py-3.5 bg-white text-blue-600 dark:bg-slate-900 dark:text-blue-400 font-bold rounded-[10px] hover:bg-blue-50 dark:hover:bg-slate-800 transition-colors text-sm shadow-md"
            >
              Khám phá gói PRO →
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
