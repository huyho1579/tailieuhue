"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { GraduationCap, Building2, FileText, Star } from "lucide-react";
import { useDocumentStore } from "@/lib/store/documentStore";

export function Hero() {
  const { documents } = useDocumentStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const docCount = mounted ? documents.length : 0;
  const subjectCount = mounted
    ? new Set(documents.map((d) => d.subject)).size
    : 0;

  return (
    <section className="relative py-20 md:py-28 overflow-hidden text-center">
      {/* Background layers */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/80 via-amber-50/20 to-white dark:from-slate-900 dark:via-slate-950 dark:to-slate-950 pointer-events-none" />
      <div className="absolute top-[-10%] left-1/2 -translate-x-1/2 w-[900px] h-[500px] bg-blue-400/8 dark:bg-blue-500/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute top-[20%] right-[-5%] w-[300px] h-[300px] bg-amber-300/10 dark:bg-amber-500/5 rounded-full blur-[80px] pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2.5 px-4 py-2 bg-white/80 dark:bg-slate-800/80 border border-blue-200/60 dark:border-blue-800/40 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-8 shadow-sm backdrop-blur-sm">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Hệ thống tài liệu Đại học Kinh tế Huế
          <span className="px-2 py-0.5 bg-amber-100 dark:bg-amber-900/40 text-amber-700 dark:text-amber-300 text-[11px] font-bold rounded-full">HCE</span>
        </div>

        {/* Headline */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-5 leading-[1.08]">
          Học đúng tài liệu.
          <br />
          <span className="bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
            Ôn đúng trọng tâm.
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-10 leading-relaxed font-light">
          Kho đề cương, đề thi và bài giảng chuyên sâu dành riêng cho sinh viên{" "}
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">Đại học Kinh tế — Đại học Huế</strong>.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-14">
          <SearchBar
            placeholder="Tìm đề cương, môn học (Marketing, Vi mô, Kế toán...)"
            size="lg"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 md:gap-5 flex-wrap">
          {[
            { icon: FileText, value: mounted ? `${docCount}+` : "—", label: "Tài liệu số hóa", accent: "text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-950/60" },
            { icon: GraduationCap, value: mounted ? `${subjectCount}` : "—", label: "Môn học trọng tâm", accent: "text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-950/60" },
            { icon: Star, value: "4.9", label: "Đánh giá chất lượng", accent: "text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60" },
            { icon: Building2, value: "HCE", label: "ĐH Kinh tế Huế", accent: "text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/60" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-3.5 bg-white/90 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700/60 rounded-2xl shadow-sm backdrop-blur-sm hover:shadow-md hover:-translate-y-0.5 transition-all"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.accent}`}>
                <stat.icon className="w-5 h-5" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{stat.value}</div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
