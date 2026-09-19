import Link from "next/link";
import { BookOpen } from "lucide-react";

const LINKS = {
  "Kho tài liệu": [
    { label: "Đề cương ôn tập", href: "/tai-lieu/de-cuong" },
    { label: "Đề thi các năm", href: "/tai-lieu/de-thi" },
    { label: "Slide bài giảng", href: "/tai-lieu" },
    { label: "Tất cả tài liệu", href: "/tai-lieu" },
  ],
  "Chuyên ngành": [
    { label: "Marketing", href: "/tai-lieu" },
    { label: "Kế toán — Kiểm toán", href: "/tai-lieu" },
    { label: "Quản trị kinh doanh", href: "/tai-lieu" },
    { label: "Tài chính — Ngân hàng", href: "/tai-lieu" },
  ],
  "EduDocs Huế": [
    { label: "Cộng đồng sinh viên", href: "/community" },
    { label: "Gói tài liệu PRO", href: "/pro" },
    { label: "Về chúng tôi", href: "/about" },
    { label: "Liên hệ & Hỗ trợ", href: "/contact" },
  ],
};

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white mt-20">
      <div className="max-w-[1280px] mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-blue-600 rounded-[10px] flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-950 text-lg">EduDocs Huế</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">
              Nền tảng chia sẻ và lưu trữ tài liệu học tập chính thức dành riêng cho sinh viên{" "}
              <strong>Đại học Kinh tế — Đại học Huế</strong>. Học đúng tài liệu, ôn đúng trọng tâm.
            </p>
          </div>

          {/* Links */}
          {Object.entries(LINKS).map(([category, items]) => (
            <div key={category}>
              <h3 className="font-semibold text-slate-950 text-sm mb-3">{category}</h3>
              <ul className="space-y-2">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link
                      href={item.href}
                      className="text-sm text-slate-500 hover:text-blue-600 transition-colors"
                    >
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-slate-400">
            © 2024 EduDocs — Đại học Kinh tế Huế. Mọi quyền được bảo lưu.
          </p>
          <div className="flex items-center gap-4">
            <Link href="/privacy" className="text-xs text-slate-400 hover:text-slate-600">
              Chính sách bảo mật
            </Link>
            <Link href="/terms" className="text-xs text-slate-400 hover:text-slate-600">
              Điều khoản sử dụng
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
