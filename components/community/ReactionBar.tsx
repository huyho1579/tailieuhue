"use client";
import { useState, useEffect } from "react";
import { ThumbsUp, MessageCircle, Bookmark, Share2 } from "lucide-react";
import { cn } from "@/lib/utils/cn";
import { useCommunityStore } from "@/lib/store/communityStore";

interface ReactionBarProps {
  postId?: string;
  likes: number;
  comments: number;
  bookmarks: number;
}

export function ReactionBar({
  postId,
  likes: initialLikes,
  comments,
  bookmarks: initialBookmarks,
}: ReactionBarProps) {
  const { toggleLike, isLiked, toggleBookmark, isBookmarked } = useCommunityStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const liked = mounted && postId ? isLiked(postId) : false;
  const bookmarked = mounted && postId ? isBookmarked(postId) : false;

  const handleLike = () => {
    if (postId) {
      toggleLike(postId);
    }
  };

  const handleBookmark = () => {
    if (postId) {
      toggleBookmark(postId);
    }
  };

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <button
        onClick={handleLike}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all cursor-pointer",
          liked
            ? "bg-blue-50 text-blue-600 border border-blue-200"
            : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600"
        )}
      >
        <ThumbsUp className={cn("w-4 h-4 transition-transform", liked && "scale-110 fill-current")} />
        <span>Thích ({initialLikes})</span>
      </button>

      <button className="flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold bg-slate-50 text-slate-600 border border-slate-200 hover:border-blue-200 hover:text-blue-600 transition-all cursor-pointer">
        <MessageCircle className="w-4 h-4" />
        <span>Bình luận ({comments})</span>
      </button>

      <button
        onClick={handleBookmark}
        className={cn(
          "flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold transition-all cursor-pointer",
          bookmarked
            ? "bg-amber-50 text-amber-700 border border-amber-200"
            : "bg-slate-50 text-slate-600 border border-slate-200 hover:border-amber-200 hover:text-amber-600"
        )}
      >
        <Bookmark className={cn("w-4 h-4 transition-transform", bookmarked && "fill-current scale-110")} />
        <span>Lưu bài ({initialBookmarks})</span>
      </button>

      <button
        onClick={() => {
          if (navigator.clipboard) {
            navigator.clipboard.writeText(window.location.href);
            alert("Đã sao chép liên kết bài viết!");
          }
        }}
        className="ml-auto flex items-center gap-2 px-4 py-2 rounded-[10px] text-sm font-semibold bg-slate-50 text-slate-600 border border-slate-200 hover:border-slate-300 transition-all cursor-pointer"
      >
        <Share2 className="w-4 h-4" />
        Chia sẻ
      </button>
    </div>
  );
}
