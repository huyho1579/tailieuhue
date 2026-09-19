"use client";
import { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ChevronRight, Send, Clock, UserCheck, Trash2, ArrowLeft } from "lucide-react";
import { Avatar } from "@/components/shared/Avatar";
import { ReactionBar } from "@/components/community/ReactionBar";
import { useCommunityStore } from "@/lib/store/communityStore";
import { useAuthStore } from "@/lib/store/auth";
import { timeAgo } from "@/lib/utils/format";
import { cn } from "@/lib/utils/cn";

const TYPE_CONFIG = {
  qa: { label: "Hỏi đáp", color: "text-amber-700 bg-amber-50 border-amber-200" },
  discussion: { label: "Thảo luận", color: "text-blue-700 bg-blue-50 border-blue-200" },
  share: { label: "Chia sẻ", color: "text-emerald-700 bg-emerald-50 border-emerald-200" },
  experience: { label: "Kinh nghiệm", color: "text-purple-700 bg-purple-50 border-purple-200" },
};

export default function PostDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const router = useRouter();
  const { slug } = use(params);
  const { posts, deletePost, addComment, getCommentsByPostId } = useCommunityStore();
  const { isAdmin, currentUser } = useAuthStore();
  const [mounted, setMounted] = useState(false);
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    setMounted(true);
  }, []);

  const post = posts.find((p) => p.slug === slug);

  if (mounted && !post) {
    return (
      <div className="max-w-[600px] mx-auto px-4 py-20 text-center animate-fade-in">
        <h2 className="text-xl font-bold text-slate-900 mb-2">Bài viết không tồn tại hoặc đã bị xóa</h2>
        <p className="text-sm text-slate-500 mb-6">Bài viết này có thể đã được gỡ bỏ bởi quản trị viên hoặc tác giả.</p>
        <Link
          href="/community"
          className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white text-sm font-semibold rounded-[10px]"
        >
          <ArrowLeft className="w-4 h-4" /> Quay lại diễn đàn HCE
        </Link>
      </div>
    );
  }

  if (!post) {
    return null;
  }

  const postComments = mounted ? getCommentsByPostId(post.id) : [];
  const typeConfig = TYPE_CONFIG[post.type] || TYPE_CONFIG.discussion;
  const canDelete = mounted && (isAdmin || (currentUser && currentUser.name === post.author.name));

  const handleDelete = () => {
    if (confirm(`Bạn có chắc chắn muốn xóa bài viết "${post.title}" không? Hành động này không thể hoàn tác.`)) {
      deletePost(post.id);
      router.push("/community");
    }
  };

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!commentText.trim()) return;

    addComment(
      post.id,
      commentText.trim(),
      currentUser?.name || "Sinh viên HCE"
    );
    setCommentText("");
  };

  const userInitials = currentUser?.name
    ? currentUser.name.slice(0, 2).toUpperCase()
    : "SV";

  return (
    <div className="max-w-[880px] mx-auto px-4 py-8 animate-fade-in">
      {/* Breadcrumb & Actions */}
      <div className="flex items-center justify-between gap-4 mb-6 flex-wrap">
        <nav className="flex items-center gap-2 text-sm text-slate-500 flex-wrap">
          <Link href="/" className="hover:text-slate-700">
            Trang chủ
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <Link href="/community" className="hover:text-slate-700">
            Cộng đồng sinh viên Huế
          </Link>
          <ChevronRight className="w-3.5 h-3.5" />
          <span className="text-slate-900 font-medium truncate max-w-[200px] sm:max-w-[320px]">
            {post.title}
          </span>
        </nav>

        {canDelete && (
          <button
            type="button"
            onClick={handleDelete}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-red-50 hover:bg-red-100 text-red-600 border border-red-200 text-xs font-semibold rounded-[8px] transition-colors cursor-pointer"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Xóa bài viết này</span>
          </button>
        )}
      </div>

      <article className="bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 mb-6 shadow-xs">
        {/* Type badge */}
        <div
          className={cn(
            "inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1.5 rounded-full border mb-4",
            typeConfig.color
          )}
        >
          {typeConfig.label.toUpperCase()}
        </div>

        <h1 className="text-2xl font-bold text-slate-950 mb-4 leading-tight">
          {post.title}
        </h1>

        {/* Author */}
        <div className="flex items-center gap-3 mb-6 pb-6 border-b border-slate-100">
          <Avatar name={post.author.name} size="md" />
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900">{post.author.name}</span>
              <span className="text-[11px] font-semibold bg-blue-50 text-blue-700 px-2 py-0.5 rounded-full flex items-center gap-1">
                <UserCheck className="w-3 h-3" /> Sinh viên HCE
              </span>
            </div>
            <div className="flex items-center gap-1 text-xs text-slate-400 mt-0.5">
              <Clock className="w-3 h-3" />
              <span>Đăng vào {timeAgo(post.createdAt)}</span>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="text-slate-700 leading-relaxed text-[15px] space-y-4 mb-6">
          <p>{post.content}</p>
          <p>
            Mọi ý kiến đóng góp, thảo luận từ các bạn sinh viên Đại học Kinh tế Huế đều rất đáng quý.
            Hãy để lại câu trả lời hoặc kinh nghiệm của bạn ở phần bình luận bên dưới nhé!
          </p>
        </div>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex gap-2 flex-wrap mb-6">
            {post.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs font-medium text-slate-600 bg-slate-100 px-2.5 py-1 rounded-md"
              >
                #{tag}
              </span>
            ))}
          </div>
        )}

        {/* Reactions (Tự động lưu trạng thái Thích & Bookmark khi F5) */}
        <div className="pt-4 border-t border-slate-100">
          <ReactionBar
            postId={post.id}
            likes={post.likes}
            comments={post.comments}
            bookmarks={post.bookmarks}
          />
        </div>
      </article>

      {/* Comments section (Lưu vĩnh viễn, F5 không bị mất) */}
      <div className="bg-white border border-slate-200 rounded-[20px] p-6 md:p-8 shadow-xs">
        <h2 className="font-bold text-slate-950 text-lg mb-6">
          {postComments.length} câu trả lời & thảo luận
        </h2>

        {postComments.length === 0 ? (
          <div className="text-center py-8 text-slate-400 bg-slate-50 rounded-[12px] border border-dashed border-slate-200 mb-6">
            <p className="text-sm font-semibold text-slate-700">Chưa có bình luận nào</p>
            <p className="text-xs text-slate-500 mt-0.5">
              Hãy là người đầu tiên trả lời và chia sẻ quan điểm của bạn!
            </p>
          </div>
        ) : (
          <div className="space-y-4 mb-6">
            {postComments.map((c) => (
              <div key={c.id} className="flex gap-3">
                <Avatar name={c.name} size="sm" />
                <div className="flex-1 bg-slate-50 rounded-[16px] p-4 border border-slate-100">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-bold text-xs text-slate-900">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.time}</span>
                  </div>
                  <p className="text-sm text-slate-700 leading-relaxed">{c.text}</p>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Form comment */}
        <form onSubmit={handleCommentSubmit} className="flex gap-3 items-start">
          <div className="w-8 h-8 rounded-full bg-blue-600 text-white font-bold flex items-center justify-center text-xs shrink-0 mt-1">
            {userInitials}
          </div>
          <div className="flex-1 flex gap-2">
            <input
              value={commentText}
              onChange={(e) => setCommentText(e.target.value)}
              placeholder="Viết câu trả lời hoặc thảo luận cho bạn sinh viên này..."
              className="flex-1 px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-[10px] text-sm focus:outline-none focus:border-blue-400 focus:bg-white transition-all"
            />
            <button
              type="submit"
              className="px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-[10px] transition-colors cursor-pointer shrink-0 font-semibold text-xs flex items-center gap-1.5"
            >
              <Send className="w-3.5 h-3.5" /> Gửi
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
