"use client";
import { useState, useMemo } from "react";
import Link from "next/link";
import {
  MessageSquare,
  Search,
  Trash2,
  ExternalLink,
  Clock,
  ThumbsUp,
  MessageCircle,
  Bookmark,
  CheckCircle,
  AlertTriangle,
  User,
  Filter,
} from "lucide-react";
import { useCommunityStore } from "@/lib/store/communityStore";
import { timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const TYPE_CONFIG = {
  qa: { label: "Hỏi đáp", color: "text-amber-700 bg-amber-50 border-amber-200" },
  discussion: { label: "Thảo luận", color: "text-blue-700 bg-blue-50 border-blue-200" },
  share: { label: "Chia sẻ", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  experience: { label: "Kinh nghiệm", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export default function AdminBaiVietPage() {
  const { posts, deletePost } = useCommunityStore();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [deletedSuccessMsg, setDeletedSuccessMsg] = useState("");

  const filteredPosts = useMemo(() => {
    return posts.filter((p) => {
      const matchSearch =
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.author.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.excerpt.toLowerCase().includes(searchTerm.toLowerCase());

      const matchType = selectedType === "all" || p.type === selectedType;

      return matchSearch && matchType;
    });
  }, [posts, searchTerm, selectedType]);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${title}" khỏi cộng đồng không? Hành động này không thể hoàn tác.`)) {
      deletePost(id);
      setDeletedSuccessMsg(`Đã xóa bài viết "${title}" thành công.`);
      setTimeout(() => {
        setDeletedSuccessMsg("");
      }, 4000);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/10 text-amber-400 text-xs font-semibold rounded-full mb-2 border border-amber-500/20">
            <MessageSquare className="w-3.5 h-3.5" />
            Hệ thống Quản trị Cộng đồng ĐH Kinh tế Huế
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Quản lý bài viết cộng đồng
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Kiểm duyệt, theo dõi tương tác và xóa bài viết vi phạm trên diễn đàn sinh viên HCE.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/community"
            target="_blank"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-[10px] border border-slate-700 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            Xem diễn đàn thực tế
          </Link>
          <Link
            href="/community/tao-bai-viet"
            className="inline-flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold rounded-[10px] transition-colors"
          >
            + Đăng thông báo mới
          </Link>
        </div>
      </div>

      {/* Thông báo xóa thành công */}
      {deletedSuccessMsg && (
        <div className="p-3.5 bg-emerald-500/10 border border-emerald-500/30 rounded-[12px] flex items-center gap-2 text-emerald-400 text-xs animate-fade-in">
          <CheckCircle className="w-4 h-4 shrink-0" />
          <span>{deletedSuccessMsg}</span>
        </div>
      )}

      {/* Thống kê nhanh */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="bg-slate-900/60 border border-slate-800 rounded-[16px] p-4">
          <span className="text-xs text-slate-400 font-medium block">Tổng số bài viết</span>
          <span className="text-2xl font-bold text-white mt-1 block">{posts.length}</span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-[16px] p-4">
          <span className="text-xs text-slate-400 font-medium block">Hỏi đáp & Thảo luận</span>
          <span className="text-2xl font-bold text-amber-400 mt-1 block">
            {posts.filter((p) => p.type === "qa" || p.type === "discussion").length}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-[16px] p-4">
          <span className="text-xs text-slate-400 font-medium block">Chia sẻ & Kinh nghiệm</span>
          <span className="text-2xl font-bold text-emerald-400 mt-1 block">
            {posts.filter((p) => p.type === "share" || p.type === "experience").length}
          </span>
        </div>
        <div className="bg-slate-900/60 border border-slate-800 rounded-[16px] p-4">
          <span className="text-xs text-slate-400 font-medium block">Tổng lượt tương tác</span>
          <span className="text-2xl font-bold text-blue-400 mt-1 block">
            {posts.reduce((sum, p) => sum + p.likes + p.comments + p.bookmarks, 0)}
          </span>
        </div>
      </div>

      {/* Toolbar lọc & tìm kiếm */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-[16px] p-4 flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Tìm theo tiêu đề, tác giả..."
            className="w-full bg-slate-950 border border-slate-800 rounded-[10px] pl-9 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <Filter className="w-3.5 h-3.5 text-slate-400 shrink-0 hidden sm:inline" />
          {[
            { id: "all", label: "Tất cả" },
            { id: "discussion", label: "Thảo luận" },
            { id: "qa", label: "Hỏi đáp" },
            { id: "share", label: "Chia sẻ" },
            { id: "experience", label: "Kinh nghiệm" },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setSelectedType(tab.id)}
              className={cn(
                "px-3 py-1.5 rounded-[8px] text-xs font-semibold whitespace-nowrap cursor-pointer transition-colors",
                selectedType === tab.id
                  ? "bg-amber-500 text-slate-950 font-bold"
                  : "bg-slate-800/80 text-slate-400 hover:text-white"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Danh sách bài viết */}
      <div className="bg-slate-900/60 border border-slate-800 rounded-[20px] overflow-hidden">
        {filteredPosts.length > 0 ? (
          <div className="divide-y divide-slate-800">
            {filteredPosts.map((post) => {
              const typeCfg = TYPE_CONFIG[post.type] || TYPE_CONFIG.discussion;

              return (
                <div
                  key={post.id}
                  className="p-5 hover:bg-slate-800/30 transition-colors flex flex-col md:flex-row md:items-center justify-between gap-4"
                >
                  <div className="space-y-1.5 flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span
                        className={cn(
                          "text-[11px] font-bold px-2 py-0.5 rounded-full border",
                          typeCfg.color
                        )}
                      >
                        {typeCfg.label}
                      </span>
                      <span className="text-xs text-slate-400 flex items-center gap-1">
                        <User className="w-3 h-3 text-slate-500" />
                        <span className="text-slate-300 font-medium">{post.author.name}</span>
                      </span>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {timeAgo(post.createdAt)}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-white line-clamp-1 hover:text-amber-400 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-xs text-slate-400 line-clamp-1 leading-relaxed">
                      {post.excerpt}
                    </p>

                    <div className="flex items-center gap-4 text-xs text-slate-500 pt-1">
                      <span className="flex items-center gap-1">
                        <ThumbsUp className="w-3 h-3 text-slate-400" />
                        {post.likes} thích
                      </span>
                      <span className="flex items-center gap-1">
                        <MessageCircle className="w-3 h-3 text-slate-400" />
                        {post.comments} bình luận
                      </span>
                      <span className="flex items-center gap-1">
                        <Bookmark className="w-3 h-3 text-slate-400" />
                        {post.bookmarks} lưu
                      </span>
                      {post.tags.length > 0 && (
                        <div className="flex gap-1">
                          {post.tags.slice(0, 3).map((tag) => (
                            <span key={tag} className="text-[10px] text-slate-400 bg-slate-800 px-1.5 py-0.5 rounded">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Hành động */}
                  <div className="flex items-center gap-2 shrink-0 self-end md:self-center">
                    <Link
                      href={`/community/${post.slug}`}
                      target="_blank"
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold rounded-[8px] border border-slate-700 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      Xem bài
                    </Link>
                    <button
                      type="button"
                      onClick={() => handleDelete(post.id, post.title)}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-500/30 text-xs font-bold rounded-[8px] transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3 h-3" />
                      Xóa bài
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-16 px-4">
            <AlertTriangle className="w-10 h-10 text-slate-600 mx-auto mb-2" />
            <p className="text-sm font-semibold text-slate-300">Không tìm thấy bài viết nào</p>
            <p className="text-xs text-slate-500 mt-1">
              Thử thay đổi từ khóa tìm kiếm hoặc danh mục lọc
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
