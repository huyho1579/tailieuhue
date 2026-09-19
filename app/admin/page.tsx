"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import {
  FileText,
  Users,
  ShieldCheck,
  Eye,
  Download,
  Trash2,
  Plus,
  CheckCircle,
  Building2,
  ExternalLink,
} from "lucide-react";
import { useDocumentStore } from "@/lib/store/documentStore";
import { useCommunityStore } from "@/lib/store/communityStore";
import { formatPrice } from "@/lib/utils/format";

export default function AdminDashboardPage() {
  const { documents, deleteDocument } = useDocumentStore();
  const { posts } = useCommunityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa tài liệu "${title}" khỏi hệ thống?`)) {
      deleteDocument(id);
    }
  };

  if (!mounted) {
    return <div className="p-6 text-sm text-slate-500">Đang tải dữ liệu quản trị...</div>;
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header Info */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <h1 className="text-2xl font-bold text-slate-950">
              Bảng điều khiển Quản trị viên
            </h1>
            <span className="bg-amber-100 text-amber-900 border border-amber-300 text-xs font-bold px-2.5 py-0.5 rounded-full flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
              Đã cấp quyền Admin
            </span>
          </div>
          <p className="text-slate-500 text-sm">
            Tài khoản quản trị cao nhất:{" "}
            <strong className="text-slate-900 font-bold">huyho1579@gmail.com</strong> (Hồ Huy)
            • Quản lý dữ liệu <span className="text-blue-700 font-semibold">Đại học Kinh tế Huế</span>
          </p>
        </div>

        {/* Nút Đăng tài liệu chi tiết */}
        <Link
          href="/tai-lieu/dang-tai"
          className="inline-flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs rounded-[10px] transition-colors shadow-xs cursor-pointer shrink-0"
        >
          <Plus className="w-4 h-4" />
          Đăng tải tài liệu mới (Đầy đủ chi tiết)
        </Link>
      </div>

      {/* Real Statistics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tài liệu ĐH Kinh tế Huế
            </span>
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-3xl font-bold text-slate-950">{documents.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Tài liệu đã xuất bản</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Bài viết cộng đồng HCE
            </span>
            <Building2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-3xl font-bold text-slate-950">{posts.length}</div>
          <span className="text-xs text-slate-400 mt-1 block">Bài thảo luận sinh viên</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lượt xem thực tế
            </span>
            <Eye className="w-4 h-4 text-purple-600" />
          </div>
          <div className="text-3xl font-bold text-slate-950">
            {documents.reduce((acc, d) => acc + (d.viewCount || 0), 0)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Số liệu đếm thực tế</span>
        </div>

        <div className="bg-white border border-slate-200 rounded-[16px] p-5 shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lượt tải thực tế
            </span>
            <Download className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-3xl font-bold text-slate-950">
            {documents.reduce((acc, d) => acc + (d.downloadCount || 0), 0)}
          </div>
          <span className="text-xs text-slate-400 mt-1 block">Số liệu tải về thực tế</span>
        </div>
      </div>

      {/* Document Management Table */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
        <div className="flex items-center justify-between mb-5 flex-wrap gap-4">
          <div>
            <h2 className="text-lg font-bold text-slate-950">Danh sách tài liệu hệ thống</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              Đồng bộ dữ liệu thời gian thực với trang chi tiết và kho tài liệu ĐH Kinh tế Huế
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/tai-lieu/dang-tai"
              className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1.5 rounded-[8px] hover:bg-blue-100 transition-colors flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" /> Thêm tài liệu mới
            </Link>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Tên tài liệu</th>
                <th className="py-3 px-4">Môn học</th>
                <th className="py-3 px-4">Khoa</th>
                <th className="py-3 px-4">Phân loại</th>
                <th className="py-3 px-4">Giá bán</th>
                <th className="py-3 px-4 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              {documents.map((doc) => (
                <tr key={doc.id} className="hover:bg-slate-50/60 transition-colors">
                  <td className="py-3.5 px-4 font-semibold text-slate-900 max-w-xs">
                    <Link
                      href={`/tai-lieu/${doc.slug}`}
                      className="hover:text-blue-600 flex items-center gap-1.5 group"
                    >
                      <span className="truncate">{doc.title}</span>
                      <ExternalLink className="w-3 h-3 text-slate-400 group-hover:text-blue-600 shrink-0" />
                    </Link>
                  </td>
                  <td className="py-3.5 px-4 text-slate-600">{doc.subject}</td>
                  <td className="py-3.5 px-4">
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md">
                      {doc.department || "Khoa QTKD"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-md ${
                        doc.isPro
                          ? "bg-amber-100 text-amber-900 border border-amber-200"
                          : "bg-emerald-100 text-emerald-800"
                      }`}
                    >
                      {doc.isPro ? "PRO" : "MIỄN PHÍ"}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 font-semibold text-slate-900">
                    {formatPrice(doc.price)}
                  </td>
                  <td className="py-3.5 px-4 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <Link
                        href={`/tai-lieu/${doc.slug}`}
                        className="p-1.5 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-[6px] transition-colors"
                        title="Xem tài liệu"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                      <button
                        onClick={() => handleDelete(doc.id, doc.title)}
                        className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-[6px] transition-colors cursor-pointer"
                        title="Xóa tài liệu"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* User Management Section */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 shadow-xs">
        <h2 className="text-lg font-bold text-slate-950 mb-1">
          Danh sách người dùng & Phân quyền quản trị
        </h2>
        <p className="text-xs text-slate-500 mb-5">
          Tài khoản quản trị viên tối cao được cấp quyền theo yêu cầu
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-slate-200 text-xs font-bold uppercase tracking-wider text-slate-500 bg-slate-50/70">
                <th className="py-3 px-4">Họ và tên</th>
                <th className="py-3 px-4">Email</th>
                <th className="py-3 px-4">Trường</th>
                <th className="py-3 px-4">Cấp quyền</th>
                <th className="py-3 px-4">Trạng thái</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-sm">
              <tr className="bg-amber-50/40">
                <td className="py-3.5 px-4 font-bold text-slate-900 flex items-center gap-2">
                  <div className="w-7 h-7 rounded-full bg-blue-600 text-white flex items-center justify-center text-xs font-bold">
                    HH
                  </div>
                  <span>Hồ Huy</span>
                </td>
                <td className="py-3.5 px-4 font-semibold text-slate-800">
                  huyho1579@gmail.com
                </td>
                <td className="py-3.5 px-4 text-blue-700 font-medium">Đại học Kinh tế Huế</td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                    Admin tối cao (Super Admin)
                  </span>
                </td>
                <td className="py-3.5 px-4">
                  <span className="inline-flex items-center gap-1 text-xs font-semibold text-emerald-700">
                    <CheckCircle className="w-3.5 h-3.5" /> Đang hoạt động
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
