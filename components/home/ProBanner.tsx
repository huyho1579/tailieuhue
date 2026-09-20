import Link from "next/link";
import { Sparkles, BookOpen, ShieldCheck, Crown } from "lucide-react";

export function ProBanner() {
  return (
    <section className="py-12">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 dark:from-blue-800 dark:via-blue-900 dark:to-indigo-950 rounded-[24px] px-8 py-12 md:py-14 shadow-xl shadow-blue-600/15 dark:shadow-blue-900/30">
          {/* Background decoration */}
          <div className="absolute -right-16 -top-16 w-64 h-64 bg-amber-400/15 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute left-1/4 -bottom-20 w-80 h-80 bg-blue-400/20 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute right-1/3 top-0 w-48 h-48 bg-indigo-400/10 rounded-full blur-2xl pointer-events-none" />

          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-8">
            <div>
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 bg-amber-400/20 rounded-lg flex items-center justify-center">
                  <Crown className="w-4 h-4 text-amber-300" />
                </div>
                <span className="text-blue-100 text-sm font-bold tracking-wide uppercase">
                  EduDocs PRO — Đại học Kinh tế Huế
                </span>
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold text-white mb-3 leading-tight tracking-tight">
                Nâng cấp trải nghiệm
                <br />
                <span className="text-amber-300">học tập và ôn thi</span> của bạn.
              </h2>
              <p className="text-blue-200/80 text-sm leading-relaxed max-w-lg font-light">
                Mở khóa toàn bộ kho đề cương PRO, lời giải đề thi chi tiết và sự hỗ trợ học tập đắc lực.
              </p>
              <div className="flex items-center gap-6 mt-5 text-sm text-blue-100/90 font-medium">
                <span className="flex items-center gap-2">
                  <BookOpen className="w-4 h-4 text-amber-300/80" />
                  Đầy đủ đề cương & đề thi HCE
                </span>
                <span className="flex items-center gap-2">
                  <ShieldCheck className="w-4 h-4 text-amber-300/80" />
                  Nội dung kiểm duyệt chuẩn xác
                </span>
              </div>
            </div>
            <Link
              href="/pro"
              className="shrink-0 px-7 py-4 bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-slate-900 font-bold rounded-2xl transition-all text-sm shadow-lg shadow-amber-500/20 hover:shadow-amber-400/30 hover:-translate-y-0.5"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4" />
                Khám phá gói PRO →
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
