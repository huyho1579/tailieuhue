"use client";
import { useState, useEffect, useId } from "react";
import { ChevronDown, ChevronUp, X, Check } from "lucide-react";

export const TYPES = [
  { id: "de-cuong", label: "Đề cương" },
  { id: "de-thi", label: "Đề thi" },
  { id: "slide", label: "Slide bài giảng" },
  { id: "giao-trinh", label: "Giáo trình" },
];

export const DEPARTMENTS = [
  "Khoa Quản trị kinh doanh",
  "Khoa Kế toán — Kiểm toán",
  "Khoa Tài chính — Ngân hàng",
  "Khoa Kinh tế & Phát triển",
  "Khoa Hệ thống thông tin kinh tế",
];

export const PRICE_OPTIONS = [
  { id: "all", label: "Tất cả tài liệu" },
  { id: "free", label: "Miễn phí" },
  { id: "pro", label: "Tài liệu PRO" },
];

export interface FilterState {
  types: string[];
  departments: string[];
  priceFilter: string;
}

interface DocumentFilterProps {
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
}

function FilterSection({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-slate-100 dark:border-slate-800 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex items-center justify-between w-full mb-3 text-sm font-semibold text-slate-900 dark:text-white text-left cursor-pointer"
      >
        <span>{title}</span>
        {open ? (
          <ChevronUp className="w-4 h-4 text-slate-400" />
        ) : (
          <ChevronDown className="w-4 h-4 text-slate-400" />
        )}
      </button>
      {open && children}
    </div>
  );
}

export function DocumentFilter({
  filters: controlledFilters,
  onFilterChange,
}: DocumentFilterProps) {
  const radioGroupId = useId();
  const [internalFilters, setInternalFilters] = useState<FilterState>(
    controlledFilters || {
      types: [],
      departments: [],
      priceFilter: "all",
    }
  );

  useEffect(() => {
    if (controlledFilters) {
      setInternalFilters(controlledFilters);
    }
  }, [controlledFilters]);

  const activeFilters = controlledFilters || internalFilters;

  const updateFilters = (newFilters: FilterState) => {
    setInternalFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const toggleType = (id: string) => {
    const next = activeFilters.types.includes(id)
      ? activeFilters.types.filter((t) => t !== id)
      : [...activeFilters.types, id];
    updateFilters({ ...activeFilters, types: next });
  };

  const toggleDepartment = (dept: string) => {
    const next = activeFilters.departments.includes(dept)
      ? activeFilters.departments.filter((x) => x !== dept)
      : [...activeFilters.departments, dept];
    updateFilters({ ...activeFilters, departments: next });
  };

  const setPrice = (priceId: string) => {
    updateFilters({ ...activeFilters, priceFilter: priceId });
  };

  const hasFilters =
    activeFilters.types.length > 0 ||
    activeFilters.departments.length > 0 ||
    activeFilters.priceFilter !== "all";

  const clearAll = () => {
    const reset = { types: [], departments: [], priceFilter: "all" };
    updateFilters(reset);
  };

  return (
    <aside className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[20px] p-5 shadow-xs">
      <div className="flex items-center justify-between mb-5 pb-3 border-b border-slate-100 dark:border-slate-800">
        <span className="font-bold text-slate-900 dark:text-white text-sm">Bộ lọc tìm kiếm</span>
        {hasFilters && (
          <button
            type="button"
            onClick={clearAll}
            className="flex items-center gap-1 text-xs font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 cursor-pointer"
          >
            <X className="w-3.5 h-3.5" /> Xóa tất cả
          </button>
        )}
      </div>

      {/* Trường cố định: ĐH Kinh tế Huế */}
      <div className="mb-4 p-3 bg-blue-50/70 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/60 rounded-[12px]">
        <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Trường đại học:</span>
        <span className="text-sm font-bold text-blue-800 dark:text-blue-300 flex items-center gap-1.5 mt-0.5">
          <Check className="w-4 h-4 text-blue-600 dark:text-blue-400" />
          Đại học Kinh tế Huế
        </span>
      </div>

      <FilterSection title="Loại tài liệu">
        <div className="space-y-2.5">
          {TYPES.map((t) => (
            <label
              key={t.id}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <input
                type="checkbox"
                checked={activeFilters.types.includes(t.id)}
                onChange={() => toggleType(t.id)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {t.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Khoa / Chuyên ngành">
        <div className="space-y-2.5">
          {DEPARTMENTS.map((dept) => (
            <label
              key={dept}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <input
                type="checkbox"
                checked={activeFilters.departments.includes(dept)}
                onChange={() => toggleDepartment(dept)}
                className="w-4 h-4 rounded border-slate-300 dark:border-slate-600 text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span className="text-xs text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white leading-snug transition-colors">
                {dept}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>

      <FilterSection title="Mức phí">
        <div className="space-y-2.5">
          {PRICE_OPTIONS.map((p) => (
            <label
              key={p.id}
              className="flex items-center gap-2.5 cursor-pointer group select-none"
            >
              <input
                type="radio"
                name={radioGroupId}
                checked={activeFilters.priceFilter === p.id}
                onChange={() => setPrice(p.id)}
                className="w-4 h-4 border-slate-300 dark:border-slate-600 text-blue-600 accent-blue-600 cursor-pointer"
              />
              <span className="text-sm text-slate-600 dark:text-slate-300 group-hover:text-slate-900 dark:group-hover:text-white transition-colors">
                {p.label}
              </span>
            </label>
          ))}
        </div>
      </FilterSection>
    </aside>
  );
}
