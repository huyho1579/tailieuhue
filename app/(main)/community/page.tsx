"use client";
import { useState } from "react";
import { Plus } from "lucide-react";
import Link from "next/link";
import { PostCard } from "@/components/community/PostCard";
import { useCommunityStore } from "@/lib/store/communityStore";
import { cn } from "@/lib/utils/cn";

const FILTERS = [
  { id: "all", label: "Tất cả bài viết" },
  { id: "discussion", label: "Thảo luận" },
  { id: "qa", label: "Hỏi đáp" },
  { id: "share", label: "Chia sẻ tài liệu" },
  { id: "experience", label: "Kinh nghiệm thi cử" },
];

export default function CommunityPage() {
  const [activeFilter, setActiveFilter] = useState("all");
  const { posts } = useCommunityStore();

  const filteredPosts =
    activeFilter === "all"
      ? posts
      : posts.filter((p) => p.type === activeFilter);

  return (
    <div className="max-w-[1280px] mx-auto px-4 py-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <div className="inline-block px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full mb-2 border border-blue-100">
            Cộng đồng sinh viên Đại học Kinh tế Huế
          </div>
          <h1 className="text-2xl font-bold text-slate-950">Góc học tập & Thảo luận HCE</h1>
          <p className="text-slate-500 text-sm mt-1">
            Nơi sinh viên Đại học Kinh tế Huế chia sẻ tài liệu, đặt câu hỏi và giúp đỡ nhau qua môn.
          </p>
        </div>
        <Link
          href="/community/tao-bai-viet"
          className="inline-flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-sm font-semibold rounded-[10px] transition-colors shrink-0 shadow-xs"
        >
          <Plus className="w-4 h-4" />
          Tạo bài viết mới
        </Link>
      </div>

      <div className="flex gap-8">
        {/* Main feed */}
        <div className="flex-1 min-w-0">
          {/* Filter tabs */}
          <div className="flex gap-2 overflow-x-auto pb-2 mb-6">
            {FILTERS.map((f) => (
              <button
                key={f.id}
                onClick={() => setActiveFilter(f.id)}
                className={cn(
                  "shrink-0 px-4 py-2 rounded-[10px] text-sm font-semibold transition-colors cursor-pointer",
                  activeFilter === f.id
                    ? "bg-blue-600 text-white shadow-xs"
                    : "bg-white border border-slate-200 text-slate-600 hover:border-blue-200 hover:text-blue-600"
                )}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Posts */}
          <div className="space-y-4">
            {filteredPosts.length > 0 ? (
              filteredPosts.map((post) => <PostCard key={post.id} post={post} />)
            ) : (
              <div className="text-center py-20 text-slate-400 bg-white rounded-[16px] border border-slate-200">
                <p className="text-base font-semibold text-slate-700">Chưa có bài viết nào trong mục này</p>
                <p className="text-xs text-slate-500 mt-1">Hãy là sinh viên đầu tiên mở đầu thảo luận!</p>
                <Link
                  href="/community/tao-bai-viet"
                  className="inline-flex items-center gap-2 mt-4 px-4 py-2 bg-blue-600 text-white text-xs font-semibold rounded-[8px]"
                >
                  <Plus className="w-4 h-4" /> Tạo bài viết ngay
                </Link>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24 space-y-4">
            <div className="bg-white border border-slate-200 rounded-[16px] p-5">
              <h3 className="font-bold text-slate-900 text-sm mb-3">Quy định cộng đồng HCE</h3>
              <ul className="space-y-2 text-xs text-slate-600 leading-relaxed">
                {[
                  "Tôn trọng và văn minh trong thảo luận",
                  "Không đăng tải đề thi giả mạo hoặc spam",
                  "Ghi rõ nguồn tài liệu khi chia sẻ",
                  "Khuyến khích hỗ trợ giải bài tập và đề cương",
                ].map((rule) => (
                  <li key={rule} className="flex items-start gap-2">
                    <span className="text-blue-600 font-bold mt-0.5">•</span>
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100 rounded-[16px] p-5">
              <h3 className="font-bold text-blue-950 text-sm mb-2">Đóng góp cho trường</h3>
              <p className="text-xs text-slate-600 mb-3 leading-relaxed">
                Chia sẻ đề thi các kỳ trước hoặc đề cương môn học của bạn để tích lũy điểm và huy hiệu học tập.
              </p>
              <Link
                href="/community/tao-bai-viet"
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-blue-600 text-white text-xs font-bold rounded-[8px] hover:bg-blue-700 transition-colors shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" /> Viết bài chia sẻ
              </Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
