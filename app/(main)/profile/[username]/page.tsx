"use client";
import { use, useState } from "react";
import { FileText, Calendar, Award, ShieldCheck, Mail, Building2 } from "lucide-react";
import { DocumentCard } from "@/components/documents/DocumentCard";
import { PostCard } from "@/components/community/PostCard";
import { mockDocuments, mockPosts } from "@/lib/data/mock";
import { cn } from "@/lib/utils/cn";

const TABS = ["Bài viết đã đăng", "Tài liệu đóng góp", "Hoạt động gần đây", "Huy hiệu & Điểm"];

const ACHIEVEMENTS = [
  {
    label: "Quản trị viên sáng lập",
    icon: ShieldCheck,
    color: "text-amber-700 bg-amber-50 border-amber-200",
    desc: "Admin hệ thống EduDocs Đại học Kinh tế Huế",
  },
  {
    label: "Tác giả đề cương",
    icon: Award,
    color: "text-blue-700 bg-blue-50 border-blue-200",
    desc: "Đã đóng góp các bộ đề cương trọng tâm",
  },
];

export default function ProfilePage({
  params,
}: {
  params: Promise<{ username: string }>;
}) {
  const { username } = use(params);
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Profile Header */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-8 mb-8 text-center relative overflow-hidden shadow-xs">
        <div className="absolute inset-x-0 top-0 h-28 bg-gradient-to-r from-blue-100/60 to-indigo-100/60" />
        <div className="relative z-10">
          <div className="w-24 h-24 bg-blue-600 text-white font-bold rounded-full flex items-center justify-center text-3xl mx-auto mb-4 ring-4 ring-white shadow-md">
            HH
          </div>
          <div className="flex items-center justify-center gap-2">
            <h1 className="text-2xl font-bold text-slate-950">Hồ Huy</h1>
            <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-amber-100 text-amber-800">
              <ShieldCheck className="w-3.5 h-3.5 text-amber-600" /> Quản trị viên (Admin)
            </span>
          </div>
          <p className="text-slate-500 text-sm mt-0.5">@{username}</p>

          <div className="flex items-center justify-center gap-4 mt-2 text-xs text-slate-600">
            <span className="flex items-center gap-1 text-blue-700 font-semibold">
              <Building2 className="w-3.5 h-3.5" />
              Đại học Kinh tế Huế
            </span>
            <span>•</span>
            <span className="flex items-center gap-1">
              <Mail className="w-3.5 h-3.5 text-slate-400" />
              huyho1579@gmail.com
            </span>
          </div>

          {/* Stats thực tế - Không số ảo */}
          <div className="flex items-center justify-center gap-8 mt-6 text-sm">
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">{mockPosts.length}</div>
              <div className="text-xs text-slate-500 font-medium">bài viết</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">{mockDocuments.length}</div>
              <div className="text-xs text-slate-500 font-medium">tài liệu HCE</div>
            </div>
            <div className="w-px h-8 bg-slate-200" />
            <div className="text-center">
              <div className="text-xl font-bold text-slate-950">0</div>
              <div className="text-xs text-slate-500 font-medium">điểm đóng góp</div>
            </div>
          </div>

          <div className="flex items-center justify-center gap-1.5 mt-4 text-xs text-slate-400">
            <Calendar className="w-3.5 h-3.5" />
            <span>Thành viên từ tháng 9, 2024</span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1.5 bg-white border border-slate-200 rounded-[12px] p-1.5 mb-6 overflow-x-auto shadow-xs">
        {TABS.map((tab, i) => (
          <button
            key={tab}
            onClick={() => setActiveTab(i)}
            className={cn(
              "flex-1 py-2.5 px-3 text-sm font-semibold rounded-[8px] transition-colors whitespace-nowrap cursor-pointer",
              activeTab === i
                ? "bg-blue-600 text-white shadow-xs"
                : "text-slate-600 hover:text-slate-900"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 0 && (
        <div className="space-y-4">
          {mockPosts.map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      )}

      {activeTab === 1 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {mockDocuments.map((doc) => (
            <DocumentCard key={doc.id} doc={doc} />
          ))}
        </div>
      )}

      {activeTab === 2 && (
        <div className="space-y-3">
          {[
            {
              text: "Đã cập nhật hệ thống tài liệu chuẩn cho Đại học Kinh tế Huế",
              time: "Vừa xong",
            },
            {
              text: "Đã khởi tạo tài khoản quản trị viên cho email huyho1579@gmail.com",
              time: "Hôm nay",
            },
            {
              text: "Đã đăng tài liệu: Đề cương Marketing Căn bản",
              time: "Tuần này",
            },
          ].map((activity, i) => (
            <div
              key={i}
              className="flex items-start gap-3 p-4 bg-white border border-slate-200 rounded-[16px] shadow-xs"
            >
              <div className="w-8 h-8 bg-blue-50 rounded-full flex items-center justify-center shrink-0 mt-0.5">
                <FileText className="w-4 h-4 text-blue-600" />
              </div>
              <div>
                <p className="text-sm font-semibold text-slate-800">{activity.text}</p>
                <p className="text-xs text-slate-400 mt-0.5">{activity.time}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 3 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {ACHIEVEMENTS.map((ach) => (
            <div
              key={ach.label}
              className={cn("bg-white border rounded-[20px] p-6 text-center shadow-xs", ach.color)}
            >
              <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-3 bg-white shadow-xs">
                <ach.icon className="w-7 h-7" />
              </div>
              <h3 className="font-bold text-base mb-1">{ach.label}</h3>
              <p className="text-xs text-slate-600">{ach.desc}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
