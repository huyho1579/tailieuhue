import Link from "next/link";
import {
  BookOpen,
  FileText,
  Presentation,
  BookMarked,
  Megaphone,
  TrendingUp,
  ArrowRight,
} from "lucide-react";

const CATEGORIES = [
  {
    id: "de-cuong",
    label: "Đề cương ôn tập",
    desc: "Tổng hợp công thức & lý thuyết",
    icon: BookOpen,
    color: "text-blue-600 bg-blue-50 dark:text-blue-400 dark:bg-blue-950/60",
    borderHover: "hover:border-blue-400",
  },
  {
    id: "de-thi",
    label: "Đề thi & Đáp án",
    desc: "Bộ đề thi chính thức các năm",
    icon: FileText,
    color: "text-purple-600 bg-purple-50 dark:text-purple-400 dark:bg-purple-950/60",
    borderHover: "hover:border-purple-400",
  },
  {
    id: "slide",
    label: "Slide bài giảng",
    desc: "Bài giảng chuẩn giáo trình",
    icon: Presentation,
    color: "text-emerald-600 bg-emerald-50 dark:text-emerald-400 dark:bg-emerald-950/60",
    borderHover: "hover:border-emerald-400",
  },
  {
    id: "giao-trinh",
    label: "Giáo trình học tập",
    desc: "Tài liệu học phần ĐH Kinh tế",
    icon: BookMarked,
    color: "text-amber-600 bg-amber-50 dark:text-amber-400 dark:bg-amber-950/60",
    borderHover: "hover:border-amber-400",
  },
  {
    id: "marketing",
    label: "Marketing & Quản trị",
    desc: "Chuyên ngành QTKD",
    icon: Megaphone,
    color: "text-indigo-600 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-950/60",
    borderHover: "hover:border-indigo-400",
  },
  {
    id: "ke-toan",
    label: "Kế toán & Tài chính",
    desc: "Khoa KT-KT & TC-NH",
    icon: TrendingUp,
    color: "text-rose-600 bg-rose-50 dark:text-rose-400 dark:bg-rose-950/60",
    borderHover: "hover:border-rose-400",
  },
];

export function CategoryGrid() {
  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              Khám phá theo danh mục
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Phân loại tài liệu chuẩn theo khung đào tạo ĐH Kinh tế Huế
            </p>
          </div>
          <Link
            href="/mon-hoc"
            className="flex items-center gap-1 text-xs font-bold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
          >
            Xem chuyên trang Môn học
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              href={`/tai-lieu/${cat.id}`}
              className={`flex flex-col items-center text-center p-4 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-2xl ${cat.borderHover} hover:shadow-md transition-all group hover:-translate-y-0.5`}
            >
              <div
                className={`w-11 h-11 rounded-2xl flex items-center justify-center mb-3 shadow-2xs group-hover:scale-110 transition-transform ${cat.color}`}
              >
                <cat.icon className="w-5 h-5" />
              </div>
              <div className="text-xs font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors line-clamp-1">
                {cat.label}
              </div>
              <div className="text-[10px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">
                {cat.desc}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
