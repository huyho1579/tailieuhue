import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { PostCard } from "@/components/community/PostCard";
import { mockPosts } from "@/lib/data/mock";

export function CommunityPreview() {
  return (
    <section className="py-10 bg-slate-50/80 rounded-[20px] mx-4 border border-slate-200/60">
      <div className="max-w-[1280px] mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h2 className="text-xl font-bold text-slate-950">Góc sinh viên Kinh tế Huế</h2>
            <p className="text-sm text-slate-500 mt-0.5">
              Hỏi đáp môn học, kinh nghiệm ôn thi và tài liệu mới từ sinh viên HCE
            </p>
          </div>
          <Link
            href="/community"
            className="flex items-center gap-1 text-sm font-semibold text-blue-600 hover:text-blue-700 transition-colors"
          >
            Xem tất cả bài viết
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {mockPosts.slice(0, 3).map((post) => (
            <PostCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </section>
  );
}
