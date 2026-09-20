"use client";
import { useEffect, useState } from "react";
import { SearchBar } from "@/components/shared/SearchBar";
import { BookOpen, GraduationCap, Building2, FileText } from "lucide-react";
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
    <section className="relative py-16 md:py-24 overflow-hidden text-center">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50 via-white to-transparent dark:from-slate-900 dark:via-slate-950 dark:to-transparent pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-blue-400/10 dark:bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 rounded-full text-sm font-semibold text-blue-700 dark:text-blue-300 mb-6">
          <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
          Hệ thống tài liệu Đại học Kinh tế Huế
        </div>

        {/* Headline */}
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-4 leading-[1.1]">
          Học đúng tài liệu.
          <br />
          <span className="bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Ôn đúng trọng tâm.
          </span>
        </h1>

        <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed">
          Kho đề cương, đề thi và bài giảng chuyên sâu dành riêng cho sinh viên{" "}
          <strong className="text-slate-800 dark:text-slate-200 font-semibold">Đại học Kinh tế — Đại học Huế</strong>.
        </p>

        {/* Search */}
        <div className="max-w-xl mx-auto mb-12">
          <SearchBar
            placeholder="Tìm đề cương, môn học (Marketing, Vi mô, Kế toán...)"
            size="lg"
          />
        </div>

        {/* Stats */}
        <div className="flex items-center justify-center gap-4 md:gap-6 flex-wrap">
          {[
            { icon: FileText, value: mounted ? `${docCount}+` : "...", label: "Tài liệu số hóa" },
            { icon: GraduationCap, value: mounted ? `${subjectCount}` : "...", label: "Môn học trọng tâm" },
            { icon: Building2, value: "HCE", label: "ĐH Kinh tế Huế" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="flex items-center gap-3 px-5 py-3 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-xl shadow-sm"
            >
              <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/60 flex items-center justify-center">
                <stat.icon className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <div className="text-left">
                <div className="text-lg font-bold text-slate-900 dark:text-white leading-tight">{stat.value}</div>
                <div className="text-xs text-slate-500 dark:text-slate-400">{stat.label}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
