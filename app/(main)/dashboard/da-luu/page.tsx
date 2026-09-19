import Link from "next/link";
import { Bookmark, ArrowRight } from "lucide-react";

export default function SavedPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-950">Tài liệu đã lưu</h1>
        <p className="text-slate-500 text-sm mt-0.5">
          Danh sách các tài liệu bạn đã đánh dấu yêu thích để xem lại sau
        </p>
      </div>

      <div className="text-center py-16 bg-white border border-slate-200 rounded-[20px] p-8 shadow-xs">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <Bookmark className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-1">Chưa có tài liệu nào được lưu</h2>
        <p className="text-sm text-slate-500 max-w-sm mx-auto mb-6">
          Khi tìm thấy tài liệu hữu ích cho việc ôn thi tại ĐH Kinh tế Huế, hãy nhấn biểu tượng trái tim để lưu lại tại đây.
        </p>
        <Link
          href="/tai-lieu"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm rounded-[10px] transition-colors"
        >
          Xem tài liệu để lưu
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
