"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import {
  GraduationCap,
  BookOpen,
  Search,
  Plus,
  ChevronRight,
  Sparkles,
  Building2,
  FileText,
  Check,
  Layers,
} from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useAuthStore } from "@/lib/store/auth";
import { cn } from "@/lib/utils/cn";

const DEFAULT_SUBJECTS = [
  {
    name: "Marketing Căn bản",
    code: "MKT101",
    department: "Khoa Quản trị kinh doanh",
    icon: "📢",
    color: "from-blue-500 to-indigo-600",
  },
  {
    name: "Kế toán Tài chính",
    code: "ACC201",
    department: "Khoa Kế toán — Kiểm toán",
    icon: "📊",
    color: "from-emerald-500 to-teal-600",
  },
  {
    name: "Kinh tế Vi mô",
    code: "ECO101",
    department: "Khoa Kinh tế & Phát triển",
    icon: "📈",
    color: "from-amber-500 to-orange-600",
  },
  {
    name: "Kinh tế Vĩ mô",
    code: "ECO102",
    department: "Khoa Kinh tế & Phát triển",
    icon: "🌐",
    color: "from-sky-500 to-blue-600",
  },
  {
    name: "Quản trị Học",
    code: "MGT101",
    department: "Khoa Quản trị kinh doanh",
    icon: "💼",
    color: "from-purple-500 to-indigo-600",
  },
  {
    name: "Tài chính Doanh nghiệp",
    code: "FIN201",
    department: "Khoa Tài chính — Ngân hàng",
    icon: "💰",
    color: "from-rose-500 to-pink-600",
  },
  {
    name: "Luật Kinh doanh",
    code: "LAW101",
    department: "Khoa Quản trị kinh doanh",
    icon: "⚖️",
    color: "from-violet-500 to-purple-600",
  },
  {
    name: "Kinh tế Lượng",
    code: "ECO301",
    department: "Khoa Kinh tế & Phát triển",
    icon: "🔢",
    color: "from-teal-500 to-emerald-600",
  },
  {
    name: "Nguyên lý Thống kê kinh tế",
    code: "STA101",
    department: "Khoa Hệ thống thông tin kinh tế",
    icon: "📉",
    color: "from-cyan-500 to-blue-600",
  },
  {
    name: "Quản trị Nhân lực",
    code: "HRM201",
    department: "Khoa Quản trị kinh doanh",
    icon: "👥",
    color: "from-indigo-500 to-blue-700",
  },
];

const DEPARTMENTS = [
  "Tất cả các khoa",
  "Khoa Quản trị kinh doanh",
  "Khoa Kế toán — Kiểm toán",
  "Khoa Tài chính — Ngân hàng",
  "Khoa Kinh tế & Phát triển",
  "Khoa Hệ thống thông tin kinh tế",
];

export default function MonHocPage() {
  const { documents } = useDocumentStore();
  const { isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [selectedDept, setSelectedDept] = useState("Tất cả các khoa");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeSubject, setActiveSubject] = useState<string>("all");

  useEffect(() => {
    setMounted(true);
  }, []);

  // 1. Tự động đồng bộ danh sách môn học từ cả danh sách chuẩn và tài liệu thực tế
  const allSubjects = useMemo(() => {
    const map = new Map<string, (typeof DEFAULT_SUBJECTS)[0]>();

    DEFAULT_SUBJECTS.forEach((s) => {
      map.set(s.name.toLowerCase().trim(), s);
    });

    documents.forEach((d) => {
      if (d.subject) {
        const key = d.subject.toLowerCase().trim();
        if (!map.has(key)) {
          map.set(key, {
            name: d.subject,
            code: `HCE-${map.size + 1}`,
            department: d.department || "Khoa Quản trị kinh doanh",
            icon: "📚",
            color: "from-blue-600 to-indigo-700",
          });
        }
      }
    });

    return Array.from(map.values());
  }, [documents]);

  // 2. Lọc môn học theo tìm kiếm và khoa
  const filteredSubjects = useMemo(() => {
    return allSubjects.filter((s) => {
      const matchDept =
        selectedDept === "Tất cả các khoa" ||
        s.department.toLowerCase().includes(selectedDept.toLowerCase()) ||
        selectedDept.toLowerCase().includes(s.department.toLowerCase());

      const matchSearch =
        !searchQuery.trim() ||
        s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        s.code.toLowerCase().includes(searchQuery.toLowerCase());

      return matchDept && matchSearch;
    });
  }, [allSubjects, selectedDept, searchQuery]);

  // 3. Đếm số lượng tài liệu của từng môn (thời gian thực từ store)
  const getSubjectDocCount = (subjectName: string) => {
    return documents.filter(
      (d) => d.subject.toLowerCase().trim() === subjectName.toLowerCase().trim()
    ).length;
  };

  // 4. Lọc tài liệu hiển thị
  const activeSubjectDocs = useMemo(() => {
    if (activeSubject === "all") {
      return documents;
    }
    return documents.filter(
      (d) => d.subject.toLowerCase().trim() === activeSubject.toLowerCase().trim()
    );
  }, [documents, activeSubject]);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-xs text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-semibold">Danh mục Môn học HCE</span>
      </nav>

      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 bg-gradient-to-br from-blue-700 via-blue-800 to-indigo-900 text-white rounded-[24px] p-8 md:p-10 mb-8 relative overflow-hidden shadow-lg">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md text-blue-200 text-xs font-semibold mb-3 border border-white/15">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Hệ thống Học phần & Môn học Đại học Kinh tế Huế</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight mb-2">
            Môn học & Học phần Trọng tâm
          </h1>
          <p className="text-blue-100 text-sm leading-relaxed">
            Tra cứu đề cương, đề thi, slide bài giảng bám sát cấu trúc đào tạo của Đại học Kinh tế
            Huế. Dữ liệu đồng bộ tự động 100% giữa kho tài liệu và từng môn học.
          </p>

          <div className="flex items-center gap-6 mt-6 pt-4 border-t border-white/15 text-xs text-blue-200">
            <div>
              <span className="text-white font-bold text-lg block">{allSubjects.length}</span>
              <span>Môn học được hỗ trợ</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-white font-bold text-lg block">
                {mounted ? documents.length : "..."}
              </span>
              <span>Tài liệu đã số hóa</span>
            </div>
            <div className="w-px h-8 bg-white/20" />
            <div>
              <span className="text-white font-bold text-lg block">5 Khoa</span>
              <span>Đại học Kinh tế Huế</span>
            </div>
          </div>
        </div>

        {isAdmin && (
          <div className="relative z-10 shrink-0">
            <Link
              href="/tai-lieu/dang-tai"
              className="inline-flex items-center gap-2 px-5 py-3 bg-amber-500 hover:bg-amber-400 text-slate-950 text-sm font-bold rounded-[12px] shadow-md transition-colors"
            >
              <Plus className="w-4 h-4" />
              Đăng tải tài liệu môn mới
            </Link>
          </div>
        )}
      </div>

      {/* Search & Department Filters */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
          {/* Search bar */}
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Tìm kiếm môn học (Marketing, Vi mô, Kế toán...)"
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-slate-200 rounded-[12px] text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-100 transition-all font-medium"
            />
          </div>

          <div className="text-xs text-slate-500 font-medium">
            Hiển thị <strong className="text-slate-900">{filteredSubjects.length}</strong> môn học
          </div>
        </div>

        {/* Khoa filter tabs */}
        <div className="flex gap-2 overflow-x-auto pb-1">
          {DEPARTMENTS.map((dept) => (
            <button
              key={dept}
              onClick={() => setSelectedDept(dept)}
              className={cn(
                "px-3.5 py-1.5 rounded-full text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer",
                selectedDept === dept
                  ? "bg-blue-600 text-white shadow-xs"
                  : "bg-white border border-slate-200 text-slate-600 hover:border-slate-300 hover:text-slate-900"
              )}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Grid Danh sách các môn học */}
      <div className="mb-12">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Layers className="w-5 h-5 text-blue-600" />
            Chọn môn học để xem tài liệu
          </h2>

          {activeSubject !== "all" && (
            <button
              onClick={() => setActiveSubject("all")}
              className="text-xs font-bold text-blue-600 hover:underline cursor-pointer"
            >
              Xem tất cả tài liệu ({documents.length})
            </button>
          )}
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3.5">
          {/* Nút Xem tất cả */}
          <button
            type="button"
            onClick={() => setActiveSubject("all")}
            className={cn(
              "p-4 rounded-[16px] border text-left transition-all cursor-pointer flex flex-col justify-between",
              activeSubject === "all"
                ? "bg-blue-600 border-blue-600 text-white shadow-md scale-102"
                : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs text-slate-900"
            )}
          >
            <div>
              <span className="text-2xl mb-2 block">📚</span>
              <h3 className="font-bold text-sm leading-snug">Tất cả môn học</h3>
              <p
                className={cn(
                  "text-[11px] mt-0.5",
                  activeSubject === "all" ? "text-blue-100" : "text-slate-500"
                )}
              >
                Tổng hợp toàn trường
              </p>
            </div>
            <div
              className={cn(
                "mt-3 text-[11px] font-bold px-2 py-0.5 rounded-full inline-block self-start",
                activeSubject === "all"
                  ? "bg-white/20 text-white"
                  : "bg-blue-50 text-blue-700"
              )}
            >
              {documents.length} tài liệu
            </div>
          </button>

          {filteredSubjects.map((s) => {
            const count = getSubjectDocCount(s.name);
            const isSelected = activeSubject.toLowerCase().trim() === s.name.toLowerCase().trim();

            return (
              <button
                key={s.name}
                type="button"
                onClick={() => setActiveSubject(s.name)}
                className={cn(
                  "p-4 rounded-[16px] border text-left transition-all cursor-pointer flex flex-col justify-between group",
                  isSelected
                    ? "bg-blue-600 border-blue-600 text-white shadow-md scale-102"
                    : "bg-white border-slate-200 hover:border-blue-300 hover:shadow-xs text-slate-900"
                )}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-2xl">{s.icon}</span>
                    <span
                      className={cn(
                        "text-[10px] font-mono px-1.5 py-0.2 rounded font-semibold",
                        isSelected
                          ? "bg-white/20 text-white"
                          : "bg-slate-100 text-slate-500"
                      )}
                    >
                      {s.code}
                    </span>
                  </div>
                  <h3 className="font-bold text-sm leading-snug line-clamp-2">{s.name}</h3>
                  <p
                    className={cn(
                      "text-[10px] mt-1 truncate",
                      isSelected ? "text-blue-100" : "text-slate-400"
                    )}
                  >
                    {s.department}
                  </p>
                </div>

                <div
                  className={cn(
                    "mt-3 text-[11px] font-bold px-2 py-0.5 rounded-full inline-block self-start",
                    isSelected
                      ? "bg-white/20 text-white"
                      : count > 0
                      ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                      : "bg-slate-100 text-slate-400"
                  )}
                >
                  {count > 0 ? `${count} tài liệu` : "Chưa có tài liệu"}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Kho Tài liệu của môn được chọn */}
      <div className="pt-6 border-t border-slate-200">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold text-slate-900">
                {activeSubject === "all" ? "Tất cả tài liệu môn học" : `Tài liệu môn: ${activeSubject}`}
              </h2>
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-50 text-blue-700">
                {activeSubjectDocs.length} tài liệu
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-1">
              {activeSubject === "all"
                ? "Duyệt danh sách toàn bộ đề cương, đề thi và bài giảng số hóa tại HCE"
                : `Tất cả đề cương ôn tập, đề thi các năm và tài liệu chuẩn của học phần ${activeSubject}`}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={
                activeSubject === "all"
                  ? "/tai-lieu"
                  : `/tai-lieu?subject=${encodeURIComponent(activeSubject)}`
              }
              className="px-4 py-2 bg-white border border-slate-200 hover:border-slate-300 text-slate-700 text-xs font-semibold rounded-[10px] transition-colors"
            >
              Mở trong kho Tài liệu
            </Link>

            {isAdmin && (
              <Link
                href={
                  activeSubject === "all"
                    ? "/tai-lieu/dang-tai"
                    : `/tai-lieu/dang-tai?subject=${encodeURIComponent(activeSubject)}`
                }
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[10px] transition-colors shadow-xs flex items-center gap-1.5"
              >
                <Plus className="w-3.5 h-3.5" />
                Đăng thêm cho môn này
              </Link>
            )}
          </div>
        </div>

        {/* Danh sách tài liệu */}
        {activeSubjectDocs.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {activeSubjectDocs.map((doc) => (
              <DocumentCard key={doc.id} doc={doc} />
            ))}
          </div>
        ) : (
          <div className="bg-white border border-slate-200 rounded-[20px] p-12 text-center max-w-md mx-auto">
            <div className="w-14 h-14 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
              <BookOpen className="w-6 h-6" />
            </div>
            <h3 className="font-bold text-slate-900 text-base mb-1">Chưa có tài liệu cho môn này</h3>
            <p className="text-xs text-slate-500 mb-5 leading-relaxed">
              Học phần <strong>{activeSubject}</strong> hiện đang được ban biên tập số hóa. Bạn có
              thể thảo luận với các bạn sinh viên khác hoặc đóng góp tài liệu.
            </p>
            <div className="flex items-center justify-center gap-2">
              <Link
                href="/community/tao-bai-viet"
                className="px-4 py-2 bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-semibold rounded-[8px]"
              >
                Tạo bài thảo luận môn này
              </Link>
              {isAdmin && (
                <Link
                  href={`/tai-lieu/dang-tai?subject=${encodeURIComponent(activeSubject)}`}
                  className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-[8px]"
                >
                  Đăng tải tài liệu ngay
                </Link>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
