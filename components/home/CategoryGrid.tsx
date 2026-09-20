import Link from "next/link";
import {
  BookOpen, FileText, Presentation, BookMarked,
  Megaphone, TrendingUp, Briefcase, Scale,
} from "lucide-react";

const CATEGORIES = [
  { id: "de-cuong", label: "Đề cương", icon: BookOpen, color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60" },
  { id: "de-thi", label: "Đề thi", icon: FileText, color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/60" },
  { id: "slide", label: "Slide bài giảng", icon: Presentation, color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60" },
  { id: "giao-trinh", label: "Giáo trình", icon: BookMarked, color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60" },
];

export function CategoryGrid() {
  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-5">
          Khám phá theo danh mục
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/tai-lieu/${cat.id}`}
              className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 rounded-2xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${cat.color}`}>
                <cat.icon className="w-5 h-5" />
              </div>
              <div>
                <div className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {cat.label}
                </div>
                <div className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                  ĐH Kinh tế Huế
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
