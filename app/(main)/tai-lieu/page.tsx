"use client";
import { useState, useMemo, useEffect } from "react";
import Link from "next/link";
import { SlidersHorizontal, ArrowUpDown, Plus, X, Search, FileX } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { DocumentFilter, FilterState, TYPES, DEPARTMENTS, PRICE_OPTIONS } from "@/components/documents/DocumentFilter";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useAuthStore } from "@/lib/store/auth";

const SORT_OPTIONS = [
  { value: "newest", label: "Mới nhất" },
  { value: "price-asc", label: "Giá tăng dần" },
  { value: "price-desc", label: "Giá giảm dần" },
  { value: "pages", label: "Số trang nhiều nhất" },
];

export default function TaiLieuPage() {
  const { documents } = useDocumentStore();
  const { isAdmin } = useAuthStore();
  const [mounted, setMounted] = useState(false);

  const [sort, setSort] = useState("newest");
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const [filters, setFilters] = useState<FilterState>({
    types: [],
    departments: [],
    priceFilter: "all",
  });

  useEffect(() => {
    setMounted(true);
  }, []);

  // XỬ LÝ LỌC THỜI GIAN THỰC
  const filteredAndSortedDocs = useMemo(() => {
    let result = [...documents];

    // 1. Lọc theo Loại tài liệu (Đề cương, Đề thi, Slide, Giáo trình)
    if (filters.types.length > 0) {
      result = result.filter((d) => filters.types.includes(d.type));
    }

    // 2. Lọc theo Khoa / Chuyên ngành
    if (filters.departments.length > 0) {
      result = result.filter((d) => {
        if (!d.department) return false;
        return filters.departments.some(
          (dept) =>
            d.department?.toLowerCase().includes(dept.toLowerCase()) ||
            dept.toLowerCase().includes(d.department?.toLowerCase() || "")
        );
      });
    }

    // 3. Lọc theo Mức phí (Miễn phí / PRO)
    if (filters.priceFilter === "free") {
      result = result.filter((d) => !d.isPro || d.price === 0);
    } else if (filters.priceFilter === "pro") {
      result = result.filter((d) => d.isPro && d.price > 0);
    }

    // 4. Sắp xếp
    result.sort((a, b) => {
      if (sort === "newest") return new Date(b.uploadedAt).getTime() - new Date(a.uploadedAt).getTime();
      if (sort === "price-asc") return a.price - b.price;
      if (sort === "price-desc") return b.price - a.price;
      if (sort === "pages") return b.pages - a.pages;
      return 0;
    });

    return result;
  }, [documents, filters, sort]);

  const hasActiveFilters =
    filters.types.length > 0 ||
    filters.departments.length > 0 ||
    filters.priceFilter !== "all";

  const clearAllFilters = () => {
    setFilters({ types: [], departments: [], priceFilter: "all" });
  };

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb & Admin Action */}
      <nav className="text-sm text-slate-500 mb-6 flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Link href="/" className="hover:text-slate-700">Trang chủ</Link>
          <span className="text-slate-300">/</span>
          <span className="text-slate-900 font-semibold">Kho tài liệu ĐH Kinh tế Huế</span>
        </div>

        {/* CHỈ HIỂN THỊ KHI LÀ ADMIN */}
        {mounted && isAdmin && (
          <Link
            href="/tai-lieu/dang-tai"
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-[8px] transition-colors shadow-xs"
          >
            <Plus className="w-3.5 h-3.5" /> Đăng tài liệu mới (Admin)
          </Link>
        )}
      </nav>

      <div className="flex items-start gap-8">
        {/* Sidebar filter - Desktop */}
        <aside className="hidden lg:block w-68 shrink-0">
          <div className="sticky top-24">
            <DocumentFilter filters={filters} onFilterChange={setFilters} />
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Header */}
          <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
            <div>
              <h1 className="text-2xl font-bold text-slate-950">Kho tài liệu học tập</h1>
              <p className="text-sm text-slate-500 mt-0.5">
                Tìm thấy{" "}
                <span className="font-bold text-slate-900">{filteredAndSortedDocs.length}</span>{" "}
                tài liệu phù hợp tiêu chuẩn ĐH Kinh tế Huế
              </p>
            </div>

            <div className="flex items-center gap-2">
              {/* Mobile filter toggle */}
              <button
                onClick={() => setShowMobileFilter(true)}
                className="lg:hidden flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded-[10px] text-sm font-medium text-slate-700 hover:border-blue-300 shadow-xs"
              >
                <SlidersHorizontal className="w-4 h-4" />
                Bộ lọc {hasActiveFilters && <span className="w-2 h-2 rounded-full bg-blue-600" />}
              </button>

              {/* Sort */}
              <div className="relative">
                <select
                  value={sort}
                  onChange={(e) => setSort(e.target.value)}
                  className="appearance-none pl-3 pr-8 py-2 bg-white border border-slate-200 rounded-[10px] text-sm font-semibold text-slate-700 cursor-pointer focus:outline-none focus:border-blue-400 shadow-xs"
                >
                  {SORT_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                      {opt.label}
                    </option>
                  ))}
                </select>
                <ArrowUpDown className="w-3.5 h-3.5 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Active filter chips */}
          {hasActiveFilters && (
            <div className="flex items-center gap-2 flex-wrap mb-5 p-3 bg-blue-50/50 border border-blue-100 rounded-[12px]">
              <span className="text-xs font-bold text-slate-600">Đang lọc:</span>

              {filters.types.map((t) => {
                const label = TYPES.find((item) => item.id === t)?.label || t;
                return (
                  <span
                    key={t}
                    className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-semibold shadow-2xs"
                  >
                    {label}
                    <button
                      type="button"
                      onClick={() =>
                        setFilters({ ...filters, types: filters.types.filter((item) => item !== t) })
                      }
                      className="hover:text-red-500"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                );
              })}

              {filters.departments.map((dept) => (
                <span
                  key={dept}
                  className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-semibold shadow-2xs"
                >
                  {dept}
                  <button
                    type="button"
                    onClick={() =>
                      setFilters({
                        ...filters,
                        departments: filters.departments.filter((item) => item !== dept),
                      })
                    }
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}

              {filters.priceFilter !== "all" && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 bg-white border border-blue-200 text-blue-700 rounded-full text-xs font-semibold shadow-2xs">
                  {filters.priceFilter === "free" ? "Miễn phí" : "Tài liệu PRO"}
                  <button
                    type="button"
                    onClick={() => setFilters({ ...filters, priceFilter: "all" })}
                    className="hover:text-red-500"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={clearAllFilters}
                className="text-xs font-bold text-red-600 hover:text-red-700 hover:underline ml-auto"
              >
                Xóa tất cả lọc
              </button>
            </div>
          )}

          {/* Document Grid hoặc Empty state */}
          {filteredAndSortedDocs.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
              {filteredAndSortedDocs.map((doc) => (
                <DocumentCard key={doc.id} doc={doc} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-white border border-slate-200 rounded-[20px] p-8 shadow-xs">
              <FileX className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-slate-800 mb-1">
                Không tìm thấy tài liệu phù hợp với bộ lọc này
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-5 leading-relaxed">
                Bạn thử chọn lại loại tài liệu khác hoặc xóa bớt tiêu chí lọc khoa / mức phí để xem thêm kết quả nhé.
              </p>
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] text-xs font-bold transition-colors shadow-xs"
              >
                Xóa bộ lọc để xem tất cả
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Mobile filter drawer */}
      {showMobileFilter && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-xs"
            onClick={() => setShowMobileFilter(false)}
          />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-[24px] p-6 max-h-[85vh] overflow-y-auto animate-fade-in shadow-2xl">
            <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100">
              <h3 className="font-bold text-slate-900 text-base">Bộ lọc tìm kiếm</h3>
              <button
                onClick={() => setShowMobileFilter(false)}
                className="px-4 py-2 bg-blue-600 text-white text-xs font-bold rounded-[8px]"
              >
                Áp dụng bộ lọc
              </button>
            </div>
            <DocumentFilter filters={filters} onFilterChange={setFilters} />
          </div>
        </div>
      )}
    </div>
  );
}
