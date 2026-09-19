"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { ThumbsUp, MessageCircle, Bookmark, Clock, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { Avatar } from "@/components/shared/Avatar";
import { timeAgo } from "@/lib/utils/format";
import { useAuthStore } from "@/lib/store/auth";
import { useCommunityStore } from "@/lib/store/communityStore";
import type { Post } from "@/lib/data/mock";

const TYPE_CONFIG = {
  qa: { label: "Hỏi đáp", color: "text-amber-700 bg-amber-50 border-amber-200", icon: "❓" },
  discussion: { label: "Thảo luận", color: "text-blue-700 bg-blue-50 border-blue-200", icon: "💬" },
  share: { label: "Chia sẻ", color: "text-emerald-700 bg-emerald-50 border-emerald-200", icon: "📢" },
  experience: { label: "Kinh nghiệm", color: "text-purple-700 bg-purple-50 border-purple-200", icon: "✨" },
};

interface PostCardProps {
  post: Post;
  className?: string;
}

export function PostCard({ post, className }: PostCardProps) {
  const typeConfig = TYPE_CONFIG[post.type];
  const { isAdmin, currentUser } = useAuthStore();
  const { deletePost } = useCommunityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const canDelete = mounted && (isAdmin || (currentUser && currentUser.name === post.author.name));

  const handleDelete = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}" của ${post.author.name}?`)) {
      deletePost(post.id);
    }
  };

  return (
    <Link
      href={`/community/${post.slug}`}
      className={cn(
        "block bg-white border border-slate-200 rounded-[16px] p-5",
        "hover:border-blue-300 hover:shadow-[0_4px_20px_rgba(15,23,42,0.08)] transition-all duration-200",
        className
      )}
    >
      {/* Author + Meta */}
      <div className="flex items-center gap-3 mb-3">
        <Avatar name={post.author.name} size="sm" />
        <div className="flex-1 min-w-0">
          <span className="font-semibold text-sm text-slate-900">{post.author.name}</span>
          <div className="flex items-center gap-1.5 mt-0.5">
            <Clock className="w-3 h-3 text-slate-400" />
            <span className="text-xs text-slate-400">{timeAgo(post.createdAt)}</span>
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span
            className={cn(
              "text-xs font-semibold px-2.5 py-1 rounded-full border",
              typeConfig.color
            )}
          >
            {typeConfig.icon} {typeConfig.label}
          </span>
          {canDelete && (
            <button
              type="button"
              onClick={handleDelete}
              title="Xóa bài viết"
              className="flex items-center gap-1 text-xs text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 border border-red-200 px-2 py-1 rounded-[6px] transition-colors cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span className="font-semibold text-[11px]">Xóa</span>
            </button>
          )}
        </div>
      </div>

      {/* Title + Excerpt */}
      <h3 className="font-bold text-slate-900 text-[15px] leading-snug mb-1.5 line-clamp-2 hover:text-blue-600 transition-colors">
        {post.title}
      </h3>
      <p className="text-sm text-slate-500 line-clamp-2 leading-relaxed">{post.excerpt}</p>

      {/* Tags */}
      {post.tags.length > 0 && (
        <div className="flex gap-1.5 mt-3 flex-wrap">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Reactions thực tế */}
      <div className="flex items-center gap-4 mt-4 pt-3 border-t border-slate-100 text-xs font-medium text-slate-500">
        <span className="flex items-center gap-1.5">
          <ThumbsUp className="w-4 h-4 text-slate-400" />
          <span>{post.likes} thích</span>
        </span>
        <span className="flex items-center gap-1.5">
          <MessageCircle className="w-4 h-4 text-slate-400" />
          <span>{post.comments} bình luận</span>
        </span>
        <span className="flex items-center gap-1.5 ml-auto">
          <Bookmark className="w-4 h-4 text-slate-400" />
          <span>{post.bookmarks} lưu</span>
        </span>
      </div>
    </Link>
  );
}
