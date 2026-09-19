import { mockDocuments } from "@/lib/data/mock";
import { DocumentCard } from "@/components/documents/DocumentCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function DeThiPage() {
  const deThi = mockDocuments.filter((d) => d.type === "de-thi");

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      <nav className="flex items-center gap-2 text-sm text-slate-500 mb-6">
        <Link href="/" className="hover:text-slate-700">
          Trang chủ
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link href="/tai-lieu" className="hover:text-slate-700">
          Tài liệu
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-slate-900 font-medium">Đề thi các năm</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Đề thi Đại học Kinh tế Huế</h1>
        <p className="text-slate-500 text-sm mt-1">
          Tổng hợp {deThi.length} đề thi chính thức kèm đáp án và hướng dẫn giải
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deThi.length > 0 ? (
          deThi.map((doc) => <DocumentCard key={doc.id} doc={doc} />)
        ) : (
          <div className="col-span-4 py-20 text-center text-slate-400 bg-white rounded-[16px] border border-slate-200">
            <p className="text-base font-semibold">Chưa có đề thi nào trong danh mục này</p>
            <p className="text-sm mt-1">Đề thi mới sẽ được cập nhật liên tục!</p>
          </div>
        )}
      </div>
    </div>
  );
}
