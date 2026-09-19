import { mockDocuments } from "@/lib/data/mock";
import { DocumentCard } from "@/components/documents/DocumentCard";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

export default function DeCuongPage() {
  const deCuong = mockDocuments.filter((d) => d.type === "de-cuong");

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
        <span className="text-slate-900 font-medium">Đề cương ôn tập ĐH Kinh tế Huế</span>
      </nav>

      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-950">Đề cương ôn thi kết thúc học phần</h1>
        <p className="text-slate-500 text-sm mt-1">
          Tổng hợp {deCuong.length} đề cương chuẩn chỉnh cho sinh viên Đại học Kinh tế Huế
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {deCuong.map((doc) => (
          <DocumentCard key={doc.id} doc={doc} />
        ))}
      </div>
    </div>
  );
}
