import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { mockDocuments } from "@/lib/data/mock";

interface FeaturedDocsProps {
  title: string;
  docs?: typeof mockDocuments;
  viewAllHref?: string;
}

export function FeaturedDocs({
  title,
  docs = mockDocuments.slice(0, 4),
  viewAllHref = "/tai-lieu",
}: FeaturedDocsProps) {
  return (
    <section className="py-10">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">{title}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Tài liệu chuẩn giáo trình Đại học Kinh tế Huế
            </p>
          </div>
          <Link
            href={viewAllHref}
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
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
