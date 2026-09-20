import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import type { Document } from "@/lib/data/mock";

interface FeaturedDocsProps {
  title: string;
  docs?: Document[];
  viewAllHref?: string;
}

export function FeaturedDocs({
  title,
  docs = [],
  viewAllHref = "/tai-lieu",
}: FeaturedDocsProps) {
  if (docs.length === 0) return null;

  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950 dark:text-white">{title}</h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Tài liệu chuẩn giáo trình Đại học Kinh tế Huế
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Xem tất cả
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {docs.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      </div>
    </section>
  );
}
