import { mockPosts } from "@/lib/data/mock";
import { PostCard } from "@/components/community/PostCard";
import Link from "next/link";
import { Plus } from "lucide-react";

export default function MyPostsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-950">Bài viết của bạn</h1>
          <p className="text-slate-500 text-sm mt-0.5">
            Quản lý các bài viết và thảo luận bạn đã đăng tải trên Cộng đồng HCE ({mockPosts.length} bài)
          </p>
        </div>
        <Link
          href="/community/tao-bai-viet"
          className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 text-white text-sm font-semibold rounded-[10px] hover:bg-blue-700 transition-colors shadow-xs"
        >
          <Plus className="w-4 h-4" /> Viết bài mới
        </Link>
      </div>

      <div className="space-y-4">
        {mockPosts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
    </div>
  );
}
